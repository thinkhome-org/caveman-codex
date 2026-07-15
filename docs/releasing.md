# Releasing

1. Run `npm test` and `npm run release:dry-run`.
2. Complete macOS and Windows Desktop acceptance evidence for major releases when those systems are available.
3. Tag `vMAJOR.MINOR.PATCH`; the release workflow requires the tag to match `package.json`, verifies the project, builds `caveman.zip`, SBOM, checksums, and GitHub keyless provenance, then prepares a draft release.
4. Review artifacts and attestations. Publish only with explicit approval.
5. For the official Plugins Directory, use [plugin-submission.md](plugin-submission.md). Verified publisher identity and portal attestations remain manual.

ThinkHome versions are independent SemVer. Record upstream Caveman in provenance and release notes.
