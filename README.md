# ThinkHome Caveman for Codex

[![CI](https://github.com/thinkhome-org/caveman-codex/actions/workflows/ci.yml/badge.svg)](https://github.com/thinkhome-org/caveman-codex/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/thinkhome-org/caveman-codex)](https://github.com/thinkhome-org/caveman-codex/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Native Codex packaging for [Caveman](https://github.com/JuliusBrussee/caveman) by Julius Brussee. It is an independent ThinkHome adapter, not affiliated with or endorsed by OpenAI.

The generated plugin is reproducibly pinned to upstream `v1.9.1`, distributed through a Codex marketplace hosted in this repository, and collects no telemetry.

## Quick start

```sh
codex plugin marketplace add thinkhome-org/caveman-codex --ref v1.0.0
codex plugin add caveman@thinkhome-caveman
```

Use `$caveman`, `$caveman-commit`, `$caveman-review`, `$caveman-compress`, or `$cavecrew`. Hooks are optional and require trust; manual skills work without them.

See [installation](docs/installation.md), [configuration](docs/configuration.md), [reference](docs/reference.md), [migration](docs/migration.md), [support](SUPPORT.md), [privacy](PRIVACY.md), and [rollback](docs/rollback.md).

## Community

[Open an issue](https://github.com/thinkhome-org/caveman-codex/issues/new/choose) for bugs, feature requests, installation help, or general project discussion. Pull requests are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

ThinkHome-authored code is [MIT licensed](LICENSE). Imported Caveman files retain their upstream license and attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
