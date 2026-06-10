#!/usr/bin/env node
/**
 * Stop processes listening on Noa dev ports (3000 web, 3001 API).
 * Usage: pnpm qa:stop
 */
import { execSync } from 'child_process';

const PORTS = [3000, 3001];

function getListeningPids(port) {
  if (process.platform === 'win32') {
    try {
      const output = execSync(`netstat -ano | findstr ":${port}"`, { encoding: 'utf8' });
      const pids = new Set();

      for (const line of output.split('\n')) {
        if (!line.includes('LISTENING')) continue;
        const parts = line.trim().split(/\s+/);
        const pid = parts.at(-1);
        if (pid && /^\d+$/.test(pid)) pids.add(pid);
      }

      return [...pids];
    } catch {
      return [];
    }
  }

  try {
    return execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function killPid(pid) {
  if (process.platform === 'win32') {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'pipe' });
    return;
  }

  execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
}

console.log('=== Stopping Noa dev servers ===');

const stopped = new Set();

for (const port of PORTS) {
  for (const pid of getListeningPids(port)) {
    if (stopped.has(pid)) continue;

    try {
      killPid(pid);
      stopped.add(pid);
      console.log(`  Stopped PID ${pid} (port ${port})`);
    } catch (error) {
      console.warn(`  Could not stop PID ${pid} on port ${port}: ${error instanceof Error ? error.message : error}`);
    }
  }
}

if (stopped.size === 0) {
  console.log('  No listeners on :3000 or :3001.');
} else {
  console.log(`  Freed ${stopped.size} process(es).`);
}
