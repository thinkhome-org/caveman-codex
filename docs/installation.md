# Installation

Use a release tag for Git installs:

```sh
codex plugin marketplace add thinkhome-org/caveman-codex --ref v1.0.0
codex plugin add caveman@thinkhome-caveman
```

For a local repository marketplace, open the repository in Codex Desktop, restart the app, select **ThinkHome Caveman** in Plugins, then install **caveman**. CLI users can run `codex plugin marketplace add /path/to/caveman-codex` followed by `codex plugin add caveman@thinkhome-caveman`.

Plugins are cached by Codex. Run `codex plugin marketplace upgrade thinkhome-caveman`, then reinstall if a new Git snapshot does not refresh an installed copy. Remove with `codex plugin remove caveman@thinkhome-caveman`; optional state is under the plugin data directory only.
