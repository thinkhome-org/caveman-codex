import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const home = await mkdtemp(`${tmpdir()}/caveman-codex-home-`); const env = { ...process.env, CODEX_HOME: home };
const run = args => execFileSync('codex', args, { encoding: 'utf8', env });
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
  assert.match(execFileSync('codex', ['plugin', 'list'], { encoding: 'utf8', env: personalEnv }), /personal-test/);
  execFileSync('codex', ['plugin', 'add', 'caveman@personal-test'], { env: personalEnv });
  execFileSync('codex', ['plugin', 'remove', 'caveman@personal-test'], { env: personalEnv });
} finally { await rm(personal, { recursive: true, force: true }); }
