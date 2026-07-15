import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
const home = await mkdtemp(`${tmpdir()}/caveman-codex-home-`); const env = { ...process.env, CODEX_HOME: home };
const run = args => execFileSync('codex', args, { encoding: 'utf8', env });
try {
  run(['plugin', 'marketplace', 'add', process.cwd()]);
  assert.match(run(['plugin', 'list']), /caveman/);
  run(['plugin', 'add', 'caveman@thinkhome-caveman']);
  assert.match(run(['plugin', 'list']), /caveman/);
  run(['plugin', 'remove', 'caveman@thinkhome-caveman']);
} finally { await rm(home, { recursive: true, force: true }); }
