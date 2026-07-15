import { execFileSync } from 'node:child_process';
import { cp, lstat, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { files, hashTree, json, portablePath, replace, root, sha256, writeJson } from './lib.mjs';

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
  run('git', ['-c', 'core.autocrlf=false', 'clone', '--no-checkout', lock.repository, source]);
  // Clone options do not necessarily govern a later checkout on Windows.
  run('git', ['config', 'core.autocrlf', 'false'], source);
  if (updateTag) {
    run('git', ['checkout', '--detach', updateTag], source);
    const commit = run('git', ['rev-parse', 'HEAD'], source);
    if (updateTag === lock.tag && commit !== lock.commit) throw new Error('refusing rewritten upstream tag');
    if (updateTag !== lock.tag) lock = { ...lock, tag: updateTag, commit, tree: run('git', ['rev-parse', 'HEAD^{tree}'], source), synchronizedAt: new Date().toISOString() };
  } else run('git', ['checkout', '--detach', lock.commit], source);
  if (run('git', ['rev-parse', 'HEAD'], source) !== lock.commit) throw new Error('upstream commit mismatch');
  if (run('git', ['rev-parse', 'HEAD^{tree}'], source) !== lock.tree) throw new Error('upstream tree mismatch');
  if (run('git', ['rev-list', '-n', '1', lock.tag], source) !== lock.commit) throw new Error('tag does not resolve to locked commit');
  await mkdir(stage, { recursive: true });
  const manifest = await json(join(root, 'integration/codex/plugin.json'));
  manifest.version = (await json(join(root, 'package.json'))).version;
  await writeJson(join(stage, '.codex-plugin/plugin.json'), manifest);
  await cp(join(root, 'integration/codex/hooks.json'), join(stage, 'hooks/hooks.json'), { recursive: true });
  await cp(join(root, 'integration/codex/caveman-hook.mjs'), join(stage, 'hooks/caveman-hook.mjs'));
  await cp(join(root, 'tools/migrate-yibie.mjs'), join(stage, 'tools/migrate-yibie.mjs'));
  await cp(join(root, 'integration/codex/caveman-init'), join(stage, 'skills/caveman-init'), { recursive: true });
  await cp(join(root, 'integration/codex/caveman-migrate'), join(stage, 'skills/caveman-migrate'), { recursive: true });
  for (const path of lock.paths) {
    const from = join(source, path);
    if ((await lstat(from)).isSymbolicLink()) throw new Error(`refusing symlinked source path: ${path}`);
    const to = path === 'LICENSE' ? join(stage, 'UPSTREAM_LICENSE') : path.startsWith('skills/') ? join(stage, path) : path.startsWith('plugins/caveman/') ? join(stage, path.slice('plugins/caveman/'.length)) : join(stage, 'upstream', path);
    await cp(from, to, { recursive: true });
  }
  const imported = {};
  for (const path of lock.paths) {
    const from = join(source, path);
    const inputs = (await stat(from)).isDirectory() ? await files(from) : [from];
    for (const file of inputs) {
      const data = await readFile(file);
      if ((await stat(file)).mode & 0o111) throw new Error(`unexpected executable source file: ${relative(source, file)}`);
      try { new TextDecoder('utf-8', { fatal: true }).decode(data); } catch { throw new Error(`unexpected non-text source file: ${relative(source, file)}`); }
      imported[portablePath(relative(source, file))] = sha256(data);
    }
  }
  if (!updateTag && lock.importedFiles && JSON.stringify(lock.importedFiles) !== JSON.stringify(imported)) throw new Error('locked upstream file hashes differ');
  lock = { ...lock, importedFiles: imported };
  const skills = Object.keys(imported).filter(path => path.endsWith('/SKILL.md')).map(path => path.split('/')[1]).sort();
  const parity = { generated: true, upstream: { tag: lock.tag, commit: lock.commit, tree: lock.tree }, skills, cavecrewAgents: Object.keys(imported).filter(path => path.startsWith('agents/')).sort(), mcpShrink: Object.keys(imported).some(path => path.startsWith('src/mcp-servers/caveman-shrink/')), manualReview: ['Review upstream release notes and changed imported hashes before merging.', 'Do not enable MCP shrink automatically.'] };
  await writeJson(join(stage, 'PARITY.json'), parity);
  await writeFile(join(stage, 'PARITY.md'), `# Upstream parity\n\n- Upstream: ${lock.tag} (${lock.commit})\n- Skills: ${skills.map(skill => `$${skill}`).join(', ')}\n- Cavecrew agents: ${parity.cavecrewAgents.length}\n- MCP shrink: ${parity.mcpShrink ? 'packaged, opt-in' : 'not packaged'}\n\n## Manual review\n\n${parity.manualReview.map(item => `- ${item}`).join('\n')}\n`);
  await writeJson(join(stage, 'PROVENANCE.json'), { generated: true, upstream: { repository: lock.repository, tag: lock.tag, commit: lock.commit, tree: lock.tree }, imported, generatedFiles: await hashTree(stage) });
  const current = join(root, 'plugins/caveman');
  if (check) {
    const expected = await hashTree(stage);
    const actual = await hashTree(current);
    if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error('generated plugin differs; run npm run build');
  } else {
    await replace(stage, current);
    await writeJson(lockPath, lock);
  }
} finally { await rm(temp, { recursive: true, force: true }); }
