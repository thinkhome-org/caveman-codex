import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const suite = process.argv[2];
if (!suite || !/^[a-z0-9-]+$/.test(suite)) throw new Error('usage: node scripts/run-tests.mjs <suite>');
const directory = join('tests', suite);
const tests = (await readdir(directory)).filter(name => name.endsWith('.test.mjs')).sort().map(name => join(directory, name));
if (!tests.length) throw new Error(`no tests found in ${directory}`);
process.exitCode = spawnSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' }).status ?? 1;
