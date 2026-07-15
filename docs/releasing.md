# Releasing

1. Run `npm test` and `npm run release:dry-run`.
2. Complete macOS and Windows Desktop acceptance evidence for `v1.0.0` and major releases.
3. Obtain approval to make the repository public and to create the GitHub draft release.
4. Tag `vMAJOR.MINOR.PATCH`; the release workflow verifies, builds `caveman.zip`, SBOM, checksums, and GitHub keyless provenance, then prepares a draft release.
5. Review artifacts and attestations. Publish only with explicit approval.

ThinkHome versions are independent SemVer. Record upstream Caveman in provenance and release notes.
