import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { files, hashTree, json, replace, root, sha256, writeJson } from './lib.mjs';

const check = process.argv.includes('--check');
const updateAt = process.argv.indexOf('--update');
const updateTag = updateAt >= 0 ? process.argv[updateAt + 1] : null;
if (updateAt >= 0 && (!updateTag || !/^v\d+\.\d+\.\d+$/.test(updateTag))) throw new Error('--update requires a stable vMAJOR.MINOR.PATCH tag');
const lockPath = join(root, 'upstream.lock.json');
let lock = await json(lockPath);
const temp = await mkdtemp(join(tmpdir(), 'thinkhome-caveman-'));
const source = join(temp, 'source');
const stage = join(temp, 'plugin');
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8' }).trim();
try {
  run('git', ['clone', '--no-checkout', lock.repository, source]);
  if (updateTag) {
    run('git', ['checkout', '--detach', updateTag], source);
    lock = { ...lock, tag: updateTag, commit: run('git', ['rev-parse', 'HEAD'], source), tree: run('git', ['rev-parse', 'HEAD^{tree}'], source), synchronizedAt: new Date().toISOString() };
  } else run('git', ['checkout', '--detach', lock.commit], source);
  if (run('git', ['rev-parse', 'HEAD'], source) !== lock.commit) throw new Error('upstream commit mismatch');
  if (run('git', ['rev-parse', 'HEAD^{tree}'], source) !== lock.tree) throw new Error('upstream tree mismatch');
  if (run('git', ['rev-list', '-n', '1', lock.tag], source) !== lock.commit) throw new Error('tag does not resolve to locked commit');
  await mkdir(stage, { recursive: true });
  await cp(join(root, 'integration/codex/plugin.json'), join(stage, '.codex-plugin/plugin.json'), { recursive: true });
  await cp(join(root, 'integration/codex/hooks.json'), join(stage, 'hooks/hooks.json'), { recursive: true });
  await cp(join(root, 'integration/codex/caveman-hook.mjs'), join(stage, 'hooks/caveman-hook.mjs'));
  await cp(join(root, 'tools/migrate-yibie.mjs'), join(stage, 'tools/migrate-yibie.mjs'));
  await cp(join(root, 'integration/codex/caveman-init'), join(stage, 'skills/caveman-init'), { recursive: true });
  await cp(join(root, 'integration/codex/caveman-migrate'), join(stage, 'skills/caveman-migrate'), { recursive: true });
  for (const path of lock.paths) {
    const from = join(source, path);
    await stat(from);
    const to = path === 'LICENSE' ? join(stage, 'UPSTREAM_LICENSE') : path.startsWith('skills/') ? join(stage, path) : join(stage, 'upstream', path);
    await cp(from, to, { recursive: true });
  }
  const imported = {};
  for (const path of lock.paths) {
    const from = join(source, path);
    if ((await stat(from)).isDirectory()) for (const file of await files(from)) imported[relative(source, file)] = sha256(await readFile(file));
    else imported[path] = sha256(await readFile(from));
  }
  await writeJson(join(stage, 'PROVENANCE.json'), { generated: true, upstream: { repository: lock.repository, tag: lock.tag, commit: lock.commit, tree: lock.tree }, imported, generatedFiles: await hashTree(stage) });
  const current = join(root, 'plugins/caveman');
  if (check) {
    const expected = await hashTree(stage);
    const actual = await hashTree(current);
    if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error('generated plugin differs; run npm run build');
  } else {
    await replace(stage, current);
    if (updateTag) await writeJson(lockPath, lock);
  }
} finally { await rm(temp, { recursive: true, force: true }); }
