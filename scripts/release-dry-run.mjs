import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root, sha256 } from './lib.mjs';
const out = join(root, 'dist'); await rm(out, { recursive: true, force: true }); await mkdir(out, { recursive: true });
await cp(join(root, 'plugins/caveman'), join(out, 'caveman'), { recursive: true });
execFileSync('zip', ['-qr', 'caveman.zip', 'caveman'], { cwd: out });
const entries = ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'upstream.lock.json'];
const hashes = {};
for (const entry of entries) { const data = await readFile(join(root, entry)); hashes[entry] = sha256(data); await writeFile(join(out, entry.replaceAll('/', '_')), data); }
await writeFile(join(out, 'SBOM.cdx.json'), `${JSON.stringify({ bomFormat: 'CycloneDX', specVersion: '1.5', components: [{ type: 'application', name: 'thinkhome-caveman-codex', version: '1.0.0', licenses: [{ license: { id: 'MIT' } }] }, { type: 'library', name: 'JuliusBrussee/caveman', version: JSON.parse(await readFile(join(root, 'upstream.lock.json'))).tag, licenses: [{ license: { id: 'MIT' } }] }] }, null, 2)}\n`);
await writeFile(join(out, 'SHA256SUMS.json'), `${JSON.stringify(hashes, null, 2)}\n`);
console.log('dry release prepared in dist/; GitHub provenance/SBOM attestation requires the approval-gated release workflow.');
