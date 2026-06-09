import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseEnv(filePath) {
  const absolute = path.join(repoRoot, filePath);
  if (!fs.existsSync(absolute)) return { exists: false, vars: {} };

  const vars = {};
  for (const line of fs.readFileSync(absolute, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[trimmed.slice(0, eq).trim()] = value;
  }

  return { exists: true, vars };
}

function mask(value) {
  if (!value) return '(missing)';
  if (value.length <= 8) return '*'.repeat(value.length);
  return `${value.slice(0, 7)}...${value.slice(-4)} [${value.length} chars]`;
}

const envFiles = {
  'packages/database/.env': parseEnv('packages/database/.env'),
  'apps/api/.env': parseEnv('apps/api/.env'),
  'apps/web/.env.local': parseEnv('apps/web/.env.local'),
};

const demoKeys = ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID', 'DEMO_ORG_ADMIN_CLERK_USER_ID'];
const sharedKeys = [
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_API_URL',
  'DATABASE_URL',
  'PORT',
];

console.log('=== Noa dev environment audit ===\n');

for (const [name, { exists, vars }] of Object.entries(envFiles)) {
  console.log(`${name}: ${exists ? 'found' : 'MISSING'}`);
  for (const key of [...demoKeys, ...sharedKeys]) {
    if (vars[key] === undefined) continue;
    const isSecret =
      key.includes('SECRET') || key.includes('PUBLISHABLE') || key.includes('DATABASE');
    console.log(`  ${key}: ${isSecret ? mask(vars[key]) : vars[key]}`);
  }
  console.log('');
}

const apiSecret = envFiles['apps/api/.env'].vars.CLERK_SECRET_KEY;
const webSecret = envFiles['apps/web/.env.local'].vars.CLERK_SECRET_KEY;
const demoId = envFiles['packages/database/.env'].vars.DEMO_CLERK_USER_ID;
const apiDemoId = envFiles['apps/api/.env'].vars.DEMO_CLERK_USER_ID;

console.log('=== Checks ===');
console.log(`CLERK_SECRET_KEY in apps/api/.env: ${apiSecret ? 'set' : 'MISSING'}`);
console.log(`CLERK_SECRET_KEY in apps/web/.env.local: ${webSecret ? 'set' : 'MISSING'}`);
console.log(
  `API/Web CLERK_SECRET_KEY match: ${
    apiSecret && webSecret ? (apiSecret === webSecret ? 'yes' : 'NO — mismatch') : 'n/a'
  }`,
);
console.log(`NEXT_PUBLIC_API_URL: ${envFiles['apps/web/.env.local'].vars.NEXT_PUBLIC_API_URL ?? '(missing)'}`);
console.log(`DEMO_CLERK_USER_ID (database/.env): ${demoId ?? '(missing)'}`);
console.log(`DEMO_CLERK_USER_ID (api/.env): ${apiDemoId ?? '(missing — ok if only in database/.env)'}`);

async function checkApi() {
  const demoClerkUserId = demoId ?? 'user_3Eocmo8kpDsR0p0z7A7FmFtd9qL';
  const baseUrl =
    envFiles['apps/web/.env.local'].vars.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
  const accessUrl = `${baseUrl}/users/me/access`;

  try {
    const res = await fetch(accessUrl, {
      headers: { 'x-dev-clerk-user-id': demoClerkUserId },
    });

    if (!res.ok) {
      console.log(`\nAPI /users/me/access (dev header): HTTP ${res.status}`);
      return;
    }

    const body = await res.json();
    console.log('\n=== API access for DEMO_CLERK_USER_ID (dev header) ===');
    console.log(`clerkUserId: ${body.clerkUserId}`);
    console.log(`roles: ${(body.roles ?? []).join(', ') || '(none)'}`);
    console.log(`roleAssignments: ${body.roleAssignments?.length ?? 0}`);
    console.log(
      `org: ${body.roleAssignments?.[0]?.organization?.name ?? body.roleAssignments?.[0]?.organization?.slug ?? '(none)'}`,
    );

    const bearerRes = await fetch(accessUrl, {
      headers: { Authorization: 'Bearer invalid-token-for-env-check' },
    });

    if (bearerRes.status === 401) {
      console.log('\nClerk bearer auth: active (invalid token correctly rejected with 401)');
      return;
    }

    const bearerBody = await bearerRes.json().catch(() => null);
    if (bearerBody?.clerkUserId === 'user_demo_holder') {
      console.log(
        '\nClerk bearer auth: NOT ACTIVE — API ignored the bearer token and fell back to user_demo_holder.',
      );
      console.log('Restart the API after pulling latest code (apps/api loads .env on startup).');
    } else {
      console.log(`\nClerk bearer auth: unexpected response HTTP ${bearerRes.status}`);
    }
  } catch (error) {
    console.log(`\nAPI unreachable at ${accessUrl}: ${error instanceof Error ? error.message : error}`);
  }
}

await checkApi();
