import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { json, root } from './lib.mjs';
const lock = await json(join(root, 'upstream.lock.json')); const dir = await mkdtemp(join(tmpdir(), 'thinkhome-upstream-test-'));
try {
  execFileSync('git', ['clone', '--depth', '1', '--branch', lock.tag, lock.repository, dir], { stdio: 'inherit' });
  execFileSync('npm', ['test'], { cwd: dir, stdio: 'inherit' });
  execFileSync('python3', ['tests/verify_repo.py'], { cwd: dir, stdio: 'inherit' });
} finally { await rm(dir, { recursive: true, force: true }); }
