# Threat model

| Asset | Threat | Control |
|---|---|---|
| Plugin bundle | Tampered upstream or generated files | Immutable tag/commit/tree lock, allowlist, SHA-256 provenance, regeneration check |
| Hook state | Traversal, symlink, malformed state | Bounded JSON, known modes, symlink rejection, private atomic writes |
| User data | Unexpected deletion during migration | Dry run by default, explicit `--apply`, verified paths only, timestamped backup |
| Credentials | Accidental collection/exfiltration | No telemetry, no secret handling, no runtime network access |
| Release artifacts | Supply-chain substitution | SHA-256 manifest, SBOM, GitHub keyless attestation |

Hooks provide guidance, not an authorization boundary. Codex hook trust and workspace policy remain authoritative.
