import { execSync, spawn, spawnSync } from 'child_process';

/** Run pnpm on Windows (.cmd batch files need shell) and Unix. */
export function runPnpm(args, { cwd, label, stdio = 'inherit' } = {}) {
  if (label) console.log(`\n→ ${label}`);

  if (process.platform === 'win32') {
    try {
      execSync(`pnpm ${args.join(' ')}`, { cwd, stdio, shell: true });
      return 0;
    } catch (error) {
      return typeof error.status === 'number' ? error.status : 1;
    }
  }

  const result = spawnSync('pnpm', args, { cwd, stdio, shell: false });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status ?? 1;
}

/** Long-running pnpm process (dev servers). */
export function spawnPnpm(args, { cwd, stdio = 'inherit' } = {}) {
  if (process.platform === 'win32') {
    return spawn(`pnpm ${args.join(' ')}`, { cwd, stdio, shell: true });
  }

  return spawn('pnpm', args, { cwd, stdio, shell: false });
}

export function runCommand(command, args, { cwd, label, stdio = 'inherit' } = {}) {
  if (label) console.log(`\n→ ${label}`);

  const result = spawnSync(command, args, { cwd, stdio, shell: false });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status ?? 1;
}

export function runOrExit(runFn) {
  const code = runFn();
  if (code !== 0) {
    process.exit(code);
  }
}
