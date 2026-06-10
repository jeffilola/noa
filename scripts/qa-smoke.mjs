#!/usr/bin/env node
/**
 * API smoke checks for issue #42 — run while API + web dev servers are up.
 * Usage: pnpm qa:smoke
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseEnv(filePath) {
  const absolute = path.join(repoRoot, filePath);
  if (!fs.existsSync(absolute)) return {};

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

  return vars;
}

function resolveDemoClerkUserId() {
  const dbEnv = parseEnv('packages/database/.env');
  const keys = ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID', 'DEMO_ORG_ADMIN_CLERK_USER_ID'];

  for (const key of keys) {
    const value = dbEnv[key]?.trim();
    if (value?.startsWith('user_') && !value.includes('<')) return value;
  }

  return 'user_demo_holder';
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth(baseUrl, attempts = 90) {
  const url = `${baseUrl}/health`;
  process.stdout.write(`Waiting for API at ${url}`);

  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        console.log(' — up');
        return true;
      }
    } catch {
      // retry
    }
    process.stdout.write('.');
    await sleep(1000);
  }

  console.log('\nAPI did not respond. Run  pnpm qa:servers  in another terminal first.');
  return false;
}

async function check(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

const baseUrl = parseEnv('apps/web/.env.local').NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
const demoClerkUserId = resolveDemoClerkUserId();
const devHeaders = { 'x-dev-clerk-user-id': demoClerkUserId };

console.log('=== Noa QA smoke ===\n');
console.log(`Using demo Clerk user: ${demoClerkUserId}\n`);

if (!(await waitForHealth(baseUrl))) {
  process.exit(1);
}

let accessBody;
const results = [];

results.push(
  await check('GET /health', async () => {
    const res = await fetch(`${baseUrl}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }),
);

results.push(
  await check('GET /users/me/access (holder + roles)', async () => {
    const res = await fetch(`${baseUrl}/users/me/access`, { headers: devHeaders });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    accessBody = await res.json();
    if (!accessBody?.clerkUserId) throw new Error('Missing clerkUserId in response');
  }),
);

results.push(
  await check('GET /credentials (seeded holder data)', async () => {
    const res = await fetch(`${baseUrl}/credentials`, { headers: devHeaders });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    const count = Array.isArray(body) ? body.length : body?.items?.length;
    if (!count) throw new Error('No credentials returned — re-run pnpm qa:prepare');
  }),
);

results.push(
  await check('GET /gdpr/export (export payload)', async () => {
    const res = await fetch(`${baseUrl}/gdpr/export`, { headers: devHeaders });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    if (!body?.exportedAt) throw new Error('Missing exportedAt');
  }),
);

const orgAssignment = accessBody?.roleAssignments?.find((entry) => entry.organization?.id);
if (orgAssignment?.organization?.id) {
  const orgId = orgAssignment.organization.id;
  results.push(
    await check('GET /organizations/:id/integrations (HID Active)', async () => {
      const res = await fetch(`${baseUrl}/organizations/${orgId}/integrations`, { headers: devHeaders });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const rows = Array.isArray(body) ? body : body?.items ?? [];
      const hid = rows.find((row) => row?.provider?.adapterKey === 'hid_origo');
      if (!hid?.connection) throw new Error('HID Origo connection not found — re-run pnpm qa:prepare');
      if (String(hid.connection.status).toLowerCase() !== 'active') {
        throw new Error(`HID status is ${hid.connection.status}, expected active`);
      }
    }),
  );
} else {
  console.log('  ⚠ Skipped org integrations — no org role on demo user.');
  console.log('    Set DEMO_CLERK_USER_ID in packages/database/.env and re-run pnpm qa:prepare.\n');
}

const passed = results.filter(Boolean).length;
const total = results.length;

console.log(`\n=== ${passed}/${total} API checks passed ===\n`);

console.log('Manual browser checks (light + dark):');
console.log('  http://localhost:3000/user/identity');
console.log('  http://localhost:3000/user/security   → Download my data (success banner)');
console.log('  http://localhost:3000/user/security   → Request deletion, type DELETE');
console.log('  http://localhost:3000/org');
console.log('  http://localhost:3000/org/integrations');
console.log('  http://localhost:3000/org/credentials\n');

console.log('Full checklist: docs/ui-visual-qa.md');

if (passed !== total) {
  process.exit(1);
}
