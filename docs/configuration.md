# Configuration

Set `CAVEMAN_DEFAULT_MODE` to `lite`, `full`, `ultra`, `wenyan-lite`, `wenyan-full`, `wenyan-ultra`, or `off`. The fallback upstream-compatible file is `~/.config/caveman/config.json` with `{ "defaultMode": "full" }`.

Priority: environment variable, config file, then `full`. Hooks require Codex trust. If hooks are unavailable, use `$caveman full` manually. `stop caveman` and `normal mode` deactivate current mode.
