import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './lib.mjs';
const license = await readFile(join(root, 'LICENSE'), 'utf8');
const upstream = await readFile(join(root, 'plugins/caveman/UPSTREAM_LICENSE'), 'utf8');
if (!license.includes('Copyright (c) 2026 Julius Brussee') || !upstream.includes('Copyright (c) 2026 Julius Brussee')) throw new Error('upstream MIT attribution missing');
const provenance = JSON.parse(await readFile(join(root, 'plugins/caveman/PROVENANCE.json'), 'utf8'));
if (provenance.upstream?.commit !== '0d95a81d35a9f2d123a5e9430d1cfc43d55f1bb0') throw new Error('upstream provenance mismatch');
console.log('license and provenance valid');
