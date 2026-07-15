import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const sha256 = data => createHash('sha256').update(data).digest('hex');
export const portablePath = path => path.replaceAll('\\', '/');
export async function json(path) { return JSON.parse(await readFile(path, 'utf8')); }
export async function writeJson(path, value) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, `${JSON.stringify(value, null, 2)}\n`); }
export async function files(dir) {
  const found = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) found.push(path);
      else throw new Error(`unsupported source entry: ${path}`);
    }
  }
  await walk(dir); return found.sort();
}
export async function replace(from, to) { await rm(to, { recursive: true, force: true }); await mkdir(dirname(to), { recursive: true }); await cp(from, to, { recursive: true }); }
export async function hashTree(dir) { return Object.fromEntries(await Promise.all((await files(dir)).map(async path => [portablePath(relative(dir, path)), sha256(await readFile(path))]))); }
