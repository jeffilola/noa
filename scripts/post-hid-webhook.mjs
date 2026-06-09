import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureArg = process.argv[2] ?? 'issued';
const apiBase = process.env.NOA_API_URL ?? 'http://localhost:3001/api/v1';

const fixtureName =
  fixtureArg === 'issued' || fixtureArg === 'credential-issued.mock.json'
    ? 'credential-issued.mock.json'
    : fixtureArg === 'revoked' || fixtureArg === 'credential-revoked.mock.json'
      ? 'credential-revoked.mock.json'
      : fixtureArg;

const fixturePath = resolve(repoRoot, 'docs/fixtures/hid-origo', fixtureName);

function loadEnvFile(relativePath) {
  const filePath = resolve(repoRoot, relativePath);
  if (!existsSync(filePath)) return {};

  const vars = {};
  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
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
  for (const key of ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID']) {
    const fromProcess = process.env[key]?.trim();
    if (fromProcess?.startsWith('user_')) return fromProcess;
  }

  for (const relPath of ['packages/database/.env', 'apps/api/.env']) {
    const vars = loadEnvFile(relPath);
    for (const key of ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID']) {
      const value = vars[key]?.trim();
      if (value?.startsWith('user_')) return value;
    }
  }

  return 'user_demo_holder';
}

async function resolveDemoContext() {
  if (process.env.NOA_DEMO_ORG_ID && process.env.NOA_DEMO_USER_ID) {
    return {
      orgId: process.env.NOA_DEMO_ORG_ID,
      userId: process.env.NOA_DEMO_USER_ID,
      clerkUserId: resolveDemoClerkUserId(),
      orgName: 'demo-org',
    };
  }

  const clerkUserId = resolveDemoClerkUserId();
  const output = execSync('pnpm exec tsx scripts/resolve-demo-webhook-context.ts', {
    cwd: resolve(repoRoot, 'packages/database'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();

  return JSON.parse(output);
}

function loadFixture(context) {
  if (!existsSync(fixturePath)) {
    throw new Error(`Fixture not found: ${fixturePath}`);
  }

  const raw = readFileSync(fixturePath, 'utf8')
    .replaceAll('__DEMO_ORG_ID__', context.orgId)
    .replaceAll('__DEMO_USER_ID__', context.userId);

  return JSON.parse(raw);
}

async function main() {
  const context = await resolveDemoContext();
  const event = loadFixture(context);

  console.log(`Posting ${event.type} for org "${context.orgName}" (${context.orgId})`);
  console.log(`Holder: ${context.clerkUserId} (${context.userId})`);
  console.log(`Fixture: ${fixturePath}`);

  const response = await fetch(`${apiBase}/webhooks/hid-origo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });

  const body = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    parsed = body;
  }

  if (!response.ok) {
    console.error(`HTTP ${response.status}`, parsed);
    process.exit(1);
  }

  console.log('Response:', JSON.stringify(parsed, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
