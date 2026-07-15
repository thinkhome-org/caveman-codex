import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
execFileSync('node', ['scripts/sync-upstream.mjs', '--check'], { stdio: 'inherit' });
const before = await readFile('upstream.lock.json', 'utf8');
execFileSync('node', ['scripts/sync-upstream.mjs', '--update', 'v1.9.1'], { stdio: 'inherit' });
assert.equal(await readFile('upstream.lock.json', 'utf8'), before);
assert.ok(true);
