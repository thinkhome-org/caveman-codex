# Migration from yibie/caveman-codex

Run `node tools/migrate-yibie.mjs --project /path/to/project` first. It is dry-run only. Review its JSON output. Run again with `--apply` to back up and remove only a verified yibie-managed plugin directory. The tool preserves ambiguous files and config; remove a reviewed legacy marketplace with `codex plugin marketplace remove caveman-repo`.
