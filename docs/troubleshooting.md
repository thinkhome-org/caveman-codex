# Troubleshooting

- Plugin missing: run `codex plugin marketplace list`, confirm `thinkhome-caveman`, restart Desktop, then install again.
- Hook not running: use `/hooks` to review and trust the exact hook definition. Hooks may be disabled by `features.hooks = false` or workspace policy. `$caveman` skills still work manually.
- Linux Desktop: unsupported because Codex Desktop is unavailable; use CLI or IDE.
- Slash commands: distributable custom slash prompts are not used. Invoke `$caveman` skills or use natural-language triggers.
- Exact stats unavailable: transcript schemas are unstable; the adapter reports unavailable rather than estimating.
- MCP shrink: opt-in only. Configure the bundled upstream server manually when Codex MCP packaging is supported by your installation.
