# Upstream synchronization

The daily workflow compares stable upstream tags. For a new tag it creates `codex/upstream-vX.Y.Z`, runs the deterministic generator and all gates, then opens a draft pull request only when all gates pass. It never auto-merges.

The importer fails closed if the tag, commit, tree, allowlist, license, or plugin assumptions are incompatible. Review the generated `PROVENANCE.json` and lock-file diff before merging.
