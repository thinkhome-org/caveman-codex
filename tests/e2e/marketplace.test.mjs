import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const codex = process.platform === 'win32' ? 'codex.cmd' : 'codex';
const execute = (args, env) => execFileSync(codex, args, { encoding: 'utf8', env, shell: process.platform === 'win32' });
const home = await mkdtemp(`${tmpdir()}/caveman-codex-home-`); const env = { ...process.env, CODEX_HOME: home };
const run = args => execute(args, env);
try {
  run(['plugin', 'marketplace', 'add', process.cwd()]);
  assert.match(run(['plugin', 'list']), /caveman/);
  run(['plugin', 'add', 'caveman@thinkhome-caveman']);
  assert.match(run(['plugin', 'list']), /caveman/);
  run(['plugin', 'remove', 'caveman@thinkhome-caveman']);
} finally { await rm(home, { recursive: true, force: true }); }
const personal = await mkdtemp(`${tmpdir()}/caveman-personal-`);
await mkdir(join(personal, '.agents/plugins'), { recursive: true });
await cp('plugins/caveman', join(personal, '.codex/plugins/caveman'), { recursive: true });
await writeFile(join(personal, '.agents/plugins/marketplace.json'), JSON.stringify({ name: 'personal-test', plugins: [{ name: 'caveman', source: { source: 'local', path: './.codex/plugins/caveman' }, policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Productivity' }] }));
const personalEnv = { ...process.env, HOME: personal, USERPROFILE: personal, CODEX_HOME: join(personal, '.codex') };
try {
  assert.match(execute(['plugin', 'list'], personalEnv), /personal-test/);
  execute(['plugin', 'add', 'caveman@personal-test'], personalEnv);
  execute(['plugin', 'remove', 'caveman@personal-test'], personalEnv);
} finally { await rm(personal, { recursive: true, force: true }); }
