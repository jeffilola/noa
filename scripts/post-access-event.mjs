/**
 * Post a mock PACS access event to the local API.
 *
 * Usage:
 *   node scripts/post-access-event.mjs
 *   node scripts/post-access-event.mjs --as=user_xxxxxxxx
 *   node scripts/post-access-event.mjs --external-id=evt-demo-001
 *
 * Env:
 *   NOA_API_URL — default http://localhost:3001/api/v1
 *   NOA_DEMO_ORG_ID / NOA_DEMO_USER_ID — skip DB lookup when set
 */
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rawArgs = process.argv.slice(2);
const apiBase = process.env.NOA_API_URL ?? 'http://localhost:3001/api/v1';

function readArg(name, fallback = '') {
  const prefixed = rawArgs.find((arg) => arg.startsWith(`--${name}=`));
  if (prefixed) return prefixed.slice(name.length + 3).trim();
  return fallback;
}

const holderAlias = readArg('user');
const locationLabel = readArg('location', 'Main entrance');
const readerLabel = readArg('reader', 'Reader 101');
const direction = readArg('direction', 'entry');
const externalEventId = readArg('external-id', `demo-access-${randomUUID()}`);
const cardNumber = readArg('card', 'DEMO-1001');

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

function resolveExplicitClerkUserId() {
  const asArg = rawArgs.find((arg) => arg.startsWith('--as='))?.slice('--as='.length)?.trim();
  if (asArg?.startsWith('user_')) return asArg;

  for (const key of ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID']) {
    const fromProcess = process.env[key]?.trim();
    if (fromProcess?.startsWith('user_')) return fromProcess;
  }

  for (const relPath of ['packages/database/.env', 'apps/api/.env', 'apps/web/.env.local']) {
    const vars = loadEnvFile(relPath);
    for (const key of ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID']) {
      const value = vars[key]?.trim();
      if (value?.startsWith('user_')) return value;
    }
  }

  if (holderAlias?.startsWith('user_')) return holderAlias;

  return undefined;
}

async function resolveDemoContext() {
  const holderClerkUserId = resolveExplicitClerkUserId();

  if (process.env.NOA_DEMO_ORG_ID && process.env.NOA_DEMO_USER_ID) {
    return {
      orgId: process.env.NOA_DEMO_ORG_ID,
      userId: process.env.NOA_DEMO_USER_ID,
      clerkUserId: holderClerkUserId,
      orgName: 'demo-org',
      source: 'NOA_DEMO_* env vars',
    };
  }

  const output = execSync(
    `pnpm exec tsx scripts/resolve-demo-webhook-context.ts${holderClerkUserId ? ` --as=${holderClerkUserId}` : ''}`,
    {
      cwd: resolve(repoRoot, 'packages/database'),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  ).trim();

  return JSON.parse(output);
}

async function main() {
  const context = await resolveDemoContext();
  const payload = {
    organizationId: context.orgId,
    externalEventId,
    occurredAt: new Date().toISOString(),
    locationLabel,
    readerLabel,
    direction,
    clerkUserId: context.clerkUserId,
    cardNumber,
    source: 'PACS',
  };

  console.log(`Posting access event to ${apiBase}/webhooks/pacs/access-events`);
  console.log(`Org: ${context.orgName} (${context.orgId})`);
  console.log(`User: ${context.clerkUserId} (${context.userId})`);
  console.log(`Location: ${locationLabel}`);
  console.log(`External id: ${externalEventId}`);

  let response;
  try {
    response = await fetch(`${apiBase}/webhooks/pacs/access-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Could not reach ${apiBase}/webhooks/pacs/access-events (${message}).`);
    console.error('Start the API first: pnpm --filter @noa/api dev');
    process.exit(1);
  }

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
  console.log('');
  console.log('Next steps:');
  console.log(`1. Sign in to the web app as ${context.clerkUserId} (same user this event was posted for).`);
  console.log('2. Holder history: http://localhost:3000/user/access');
  console.log('3. Org feed: http://localhost:3000/org/access');
  console.log('4. Re-run with the same --external-id to verify dedupe');
  if (context.source) {
    console.log(`\nResolved holder via: ${context.source}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
