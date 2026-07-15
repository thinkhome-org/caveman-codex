# Rollback

Remove the current plugin, then add the prior Git release tag and reinstall:

```sh
codex plugin remove caveman@thinkhome-caveman
codex plugin marketplace remove thinkhome-caveman
codex plugin marketplace add thinkhome-org/caveman-codex --ref vPREVIOUS
codex plugin add caveman@thinkhome-caveman
```

Do not delete plugin data unless you intentionally reset Caveman mode state.
