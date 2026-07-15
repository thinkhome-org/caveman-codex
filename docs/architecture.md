# Architecture

`upstream.lock.json` pins Caveman tag, commit, and tree. `scripts/sync-upstream.mjs` checks out that immutable source, copies an explicit allowlist into a temporary plugin tree, adds ThinkHome’s manifest/hooks/migration skills, records hashes, then atomically replaces `plugins/caveman`.

Never edit `plugins/caveman` directly. Upstream-derived assets live in `skills/` and `upstream/`; ThinkHome-owned files are the manifest, hooks, migration tools, and provenance. A changed/moved tag or missing allowlisted path stops the import.
