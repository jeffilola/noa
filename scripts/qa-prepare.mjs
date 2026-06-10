#!/usr/bin/env node
/**
 * Prepare local stack for UI/API QA: Postgres + migrations + seed.
 * Usage: pnpm qa:prepare
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runCommand, runOrExit, runPnpm } from './qa-exec.mjs';

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPostgres(maxAttempts = 45) {
  console.log('\n→ Waiting for Postgres…');
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      execSync('docker compose exec -T postgres pg_isready -U noa -d noa', {
        cwd: repoRoot,
        stdio: 'pipe',
      });
      console.log('  Postgres is ready.');
      return;
    } catch {
      if (attempt === maxAttempts) {
        console.error('Postgres did not become ready in time.');
        process.exit(1);
      }
      await sleep(1000);
    }
  }
}

function resolveDemoClerkUserId() {
  const dbEnv = parseEnv('packages/database/.env');
  const keys = ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID', 'DEMO_ORG_ADMIN_CLERK_USER_ID'];

  for (const key of keys) {
    const value = dbEnv[key]?.trim();
    if (value?.startsWith('user_') && !value.includes('<')) return value;
  }

  return null;
}

console.log('=== Noa QA prepare ===');

try {
  execSync('docker info', { stdio: 'pipe' });
} catch {
  console.error('\nDocker is not running. Start Docker Desktop, then run:\n  pnpm qa:prepare\n');
  process.exit(1);
}

runOrExit(() =>
  runCommand('docker', ['compose', 'up', '-d', 'postgres'], { cwd: repoRoot, label: 'Starting Postgres' }),
);
await waitForPostgres();
runOrExit(() =>
  runPnpm(['--filter', '@noa/database', 'migrate:deploy'], { cwd: repoRoot, label: 'Applying migrations' }),
);
runOrExit(() =>
  runPnpm(['--filter', '@noa/domain', 'build'], { cwd: repoRoot, label: 'Building @noa/domain (nav + RBAC)' }),
);
runOrExit(() => runPnpm(['db:seed'], { cwd: repoRoot, label: 'Seeding demo data' }));

const demoClerkUserId = resolveDemoClerkUserId();
const apiUrl = parseEnv('apps/web/.env.local').NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

console.log('\n=== Ready ===');
console.log('Start servers:  pnpm qa:servers');
console.log('Or all-in-one:  pnpm qa:dev        (prepare + servers)');
console.log('API smoke test: pnpm qa:smoke       (after servers are up)\n');

if (demoClerkUserId) {
  console.log(`Demo Clerk user: ${demoClerkUserId}`);
  console.log('Sign in with that account to see holder + org admin routes with seeded data.\n');
} else {
  console.log('Tip: set DEMO_CLERK_USER_ID in packages/database/.env to your Clerk user id,');
  console.log('     then run  pnpm qa:prepare  again for holder + org admin on one account.\n');
}

console.log('Browser checklist: docs/ui-visual-qa.md');
console.log(`API base URL: ${apiUrl}`);
