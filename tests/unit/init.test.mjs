import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = await mkdtemp(join(tmpdir(), 'caveman-init-'));
const script = join(process.cwd(), 'plugins/caveman/upstream/src/tools/caveman-init.js');
const run = args => execFileSync(process.execPath, [script, dir, '--only', 'agents', ...args], { encoding: 'utf8' });
try {
  assert.match(run(['--dry-run']), /dry run/);
  await assert.rejects(stat(join(dir, 'AGENTS.md')));
  assert.match(run([]), /1 added/);
  assert.match(await readFile(join(dir, 'AGENTS.md'), 'utf8'), /Respond terse like smart caveman/);
  assert.match(run([]), /already-installed/);
} finally {
  await rm(dir, { recursive: true, force: true });
}
