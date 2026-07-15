import { cp, lstat, readFile, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const apply = process.argv.includes('--apply');
const projectArg = process.argv.indexOf('--project');
const projectValue = projectArg >= 0 ? process.argv[projectArg + 1] : null;
if (projectArg >= 0 && (!projectValue || projectValue.startsWith('--'))) throw new Error('--project requires a path');
const project = projectValue ? resolve(projectValue) : null;
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const candidates = [];
if (project) candidates.push(join(project, '.codex-plugins', 'caveman'));
const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex');
candidates.push(join(codexHome, 'plugins', 'cache', 'caveman-repo', 'caveman', '0.1.0'));
async function legacy(path) {
  try {
    const marker = join(path, '.codex-plugin', 'plugin.json');
    const data = JSON.parse(await readFile(marker, 'utf8'));
    return data.name === 'caveman' && (data.repository || '').includes('yibie/caveman-codex');
  } catch { return false; }
}
const found = [];
for (const path of candidates) if (await legacy(path)) found.push(path);
const config = join(codexHome, 'config.toml');
let configHint = false;
try { configHint = (await readFile(config, 'utf8')).includes('caveman-repo'); } catch {}
console.log(JSON.stringify({ dryRun: !apply, legacyPaths: found, marketplaceHint: configHint ? config : null, action: apply ? 'remove verified legacy paths after backup' : 'no changes; rerun with --apply to remove verified paths' }, null, 2));
if (!apply) process.exit(0);
for (const path of found) {
  if ((await lstat(path)).isSymbolicLink()) throw new Error(`refusing symlink: ${path}`);
  const backup = `${path}.thinkhome-backup-${stamp}`;
  await cp(path, backup, { recursive: true, errorOnExist: true });
  await rm(path, { recursive: true, force: false });
  console.log(`removed ${path}; backup ${backup}`);
}
if (configHint) console.log(`preserved ${config}; remove legacy marketplace with native 'codex plugin marketplace remove caveman-repo' after review.`);
