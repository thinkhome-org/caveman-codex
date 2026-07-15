# ThinkHome Caveman for Codex

Native Codex packaging for [Caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee. It is an independent ThinkHome adapter, not affiliated with or endorsed by OpenAI.

The generated plugin is reproducibly pinned to upstream `v1.9.1` and distributed through a Git/local Codex marketplace. It is not submitted to the official Plugins Directory and collects no telemetry.

## Quick start

```sh
codex plugin marketplace add thinkhome-org/caveman-codex --ref v1.0.0
codex plugin add caveman@thinkhome-caveman
```

Use `$caveman`, `$caveman-commit`, `$caveman-review`, `$caveman-compress`, or `$cavecrew`. Hooks are optional and require trust; manual skills work without them.

See [installation](docs/installation.md), [configuration](docs/configuration.md), [reference](docs/reference.md), [migration](docs/migration.md), [support](SUPPORT.md), [privacy](PRIVACY.md), and [rollback](docs/rollback.md).

Issues and pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md). ThinkHome-authored code is MIT licensed, while imported Caveman files retain their upstream attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
