import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
execFileSync('node', ['scripts/sync-upstream.mjs', '--check'], { stdio: 'inherit' });
assert.ok(true);
