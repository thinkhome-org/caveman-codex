import assert from 'node:assert/strict';
import test from 'node:test';
import { portablePath } from '../../scripts/lib.mjs';

test('portablePath makes repository metadata independent of Windows separators', () => {
  assert.equal(portablePath('skills\\caveman\\SKILL.md'), 'skills/caveman/SKILL.md');
  assert.equal(portablePath('skills/caveman/SKILL.md'), 'skills/caveman/SKILL.md');
});
