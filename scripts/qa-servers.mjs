#!/usr/bin/env node
/**
 * Start API + web unless healthy servers are already running.
 * Frees stale listeners on :3000 / :3001 before starting (qa:dev flow).
 * Usage: pnpm qa:servers
 */
import { spawnSync } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnPnpm } from './qa-exec.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEB_URL = 'http://localhost:3000/';
const API_HEALTH_URL = 'http://localhost:3001/api/v1/health';

function isPortListening(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: '127.0.0.1' });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.end();
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function probe(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function runNodeScript(scriptName) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, 'scripts', scriptName)], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    return false;
  }

  return true;
}

function startDevServers() {
  const child = spawnPnpm(
    ['exec', 'turbo', 'run', 'dev', '--filter=@noa/api', '--filter=@noa/web', '--parallel'],
    { cwd: repoRoot, stdio: 'inherit' },
  );

  child.on('exit', (code) => {
    process.exitCode = code ?? 1;
  });
}

async function main() {
  console.log('=== Starting Noa dev servers ===');

  const webListening = await isPortListening(3000);
  const apiListening = await isPortListening(3001);

  if (webListening || apiListening) {
    const webHealthy = webListening ? await probe(WEB_URL) : false;
    const apiHealthy = apiListening ? await probe(API_HEALTH_URL) : false;

    if (webHealthy && apiHealthy) {
      console.log('\nWeb (:3000) and API (:3001) are already running.');
      console.log('Run  pnpm qa:smoke  in another terminal.\n');
      process.exitCode = 0;
      return;
    }

    console.log('\nPorts :3000 / :3001 are in use but not responding as Noa dev servers.');
    console.log('Stopping stale listeners…\n');

    if (!runNodeScript('qa-stop.mjs')) {
      return;
    }

    await sleep(750);

    if ((await isPortListening(3000)) || (await isPortListening(3001))) {
      console.error('\nCould not free :3000 or :3001. Run  pnpm qa:stop  manually, then retry.\n');
      process.exitCode = 1;
      return;
    }
  }

  console.log('\nLaunching API (:3001) and web (:3000)…\n');
  startDevServers();
}

await main();
