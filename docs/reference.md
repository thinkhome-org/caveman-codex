# Reference

| Skill | Purpose |
|---|---|
| `$caveman [mode]` | Persistent concise response mode; modes are `lite`, `full`, `ultra`, and `wenyan-*`. |
| `$caveman-commit` | Conventional Commit message drafting. |
| `$caveman-review` | Concise review findings. |
| `$caveman-help` | One-shot Caveman reference. |
| `$caveman-stats` | Exact usage only when Codex exposes a supported schema; otherwise says unavailable. |
| `$caveman-compress` | Upstream safe Markdown compression with backups and validation. |
| `$cavecrew` | Maps investigator, builder, and reviewer contracts to Codex multi-agent work. |
| `$caveman-init` | Dry-run-first project rule installation using the pinned upstream tool. |
| `$caveman-migrate` | Dry-run-first yibie migration. |

Say `stop caveman` or `normal mode` to turn the current mode off. Custom distributable slash prompts are deliberately not used because Codex treats them as local/deprecated customization.

Bundled hooks run only for `SessionStart`, `UserPromptSubmit`, and `SubagentStart`; they receive bounded JSON, add context, and do not block startup. Plugin hooks must be trusted with `/hooks`.
