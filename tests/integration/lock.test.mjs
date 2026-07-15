import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const lock = JSON.parse(await readFile('upstream.lock.json', 'utf8'));
assert.ok(Object.keys(lock.importedFiles || {}).length > 20);
assert.match(lock.importedFiles['skills/caveman/SKILL.md'], /^[a-f0-9]{64}$/);
