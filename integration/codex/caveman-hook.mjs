import { mkdir, lstat, readFile, rename, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const modes = new Set(['lite', 'full', 'ultra', 'wenyan-lite', 'wenyan-full', 'wenyan-ultra', 'off']);
const control = /[\u0000-\u001f\u007f]/;
const fail = message => process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: message } }));
async function stdin() {
  let size = 0; const chunks = [];
  for await (const chunk of process.stdin) { size += chunk.length; if (size > 65536) throw new Error('hook input exceeds 64 KiB'); chunks.push(chunk); }
  const text = Buffer.concat(chunks).toString('utf8'); return text ? JSON.parse(text) : {};
}
function valid(value) { return typeof value === 'string' && modes.has(value) && !control.test(value); }
async function stateDir() {
  const base = process.env.PLUGIN_DATA || process.env.CLAUDE_PLUGIN_DATA || join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'plugins', 'data', 'caveman');
  await mkdir(base, { recursive: true, mode: 0o700 });
  if ((await lstat(base)).isSymbolicLink()) throw new Error('plugin data directory is a symlink');
  return base;
}
async function readState(dir) { try { const raw = await readFile(join(dir, 'state.json'), 'utf8'); if (raw.length > 4096) return null; const value = JSON.parse(raw).mode; return valid(value) ? value : null; } catch { return null; } }
async function writeState(dir, mode) { const target = join(dir, 'state.json'); const temp = `${target}.${process.pid}.tmp`; await writeFile(temp, `${JSON.stringify({ mode })}\n`, { mode: 0o600, flag: 'wx' }); await rename(temp, target); }
async function configuredMode() {
  if (valid(process.env.CAVEMAN_DEFAULT_MODE)) return process.env.CAVEMAN_DEFAULT_MODE;
  try { const path = join(homedir(), '.config', 'caveman', 'config.json'); const raw = await readFile(path, 'utf8'); if (raw.length <= 4096 && valid(JSON.parse(raw).defaultMode)) return JSON.parse(raw).defaultMode; } catch {}
  return 'full';
}
try {
  const input = await stdin(); const dir = await stateDir(); let mode = await readState(dir) || await configuredMode();
  const prompt = typeof input.prompt === 'string' ? input.prompt : typeof input.user_prompt === 'string' ? input.user_prompt : '';
  let stats = false;
  if (!control.test(prompt)) {
    const match = prompt.match(/(?:^|\s)\$?caveman(?!-)(?:\s+(lite|full|ultra|wenyan-lite|wenyan-full|wenyan-ultra|off))?(?:\s+mode)?(?:\s|$)/i);
    let changed = false;
    if (match) { mode = (match[1] || 'full').toLowerCase(); changed = true; }
    if (/\b(?:stop caveman|normal mode)\b/i.test(prompt)) { mode = 'off'; changed = true; }
    stats = /(?:^|\s)\$?caveman-stats(?:\s|$)/i.test(prompt);
    if (input.hook_event_name === 'UserPromptSubmit' && changed) await writeState(dir, mode);
  }
  const context = stats ? 'Exact Caveman stats unavailable: this Codex transcript schema has no supported usage counters. Do not estimate or fabricate token usage or savings.' : mode !== 'off' ? `Caveman ${mode} mode is active. Follow the $caveman skill; use normal clarity for security, destructive, or ambiguous instructions.` : '';
  if (context) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: input.hook_event_name || 'SessionStart', additionalContext: context } }));
} catch (error) { fail(`Caveman hook unavailable: ${error.message}. Use $caveman manually.`); }
