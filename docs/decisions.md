# Decisions

## 2026-07-15 — architecture

Use a thin generated adapter around a pinned Caveman release. Do not fork, subtree, or patch upstream. The importer replaces only generated output atomically and fails closed on ambiguous source changes.

## 2026-07-15 — Codex capability baseline

Verified with Codex CLI `0.144.2`, Desktop `26.707.72221`, and the current official Codex manual. Plugins use `.codex-plugin/plugin.json`; marketplaces use `.agents/plugins/marketplace.json`; skills and bundled synchronous command hooks are supported. Git/local marketplace installation is supported. Hooks require user trust and prompt/agent/async handlers are not supported. Desktop acceptance remains a manual release gate.

## 2026-07-15 — pinned upstream

Latest stable tag is `v1.9.1`, resolved commit `0d95a81d35a9f2d123a5e9430d1cfc43d55f1bb0`, tree `867418a8efea2c92b3885b8efd99d73d7c58af11`.

## 2026-07-15 — dependency policy

Node standard library only. No runtime network access. Native `codex plugin` remains the installer and uninstaller.

## 2026-07-15 — upstream regression runtime

The upstream installer suite has 2 uninstall failures under local Node `26.4.0`, but passes 112/112 under Node `20.20.2`. The regression runner pins Node `20.20.2` through `npx` so local and CI results use the supported baseline. ThinkHome does not alter upstream code.

On Windows, upstream v1.9.1 has additional path-separator-sensitive installer-test failures. ThinkHome still runs its generated-plugin, installation, and marketplace tests on Windows; the unmodified upstream suite runs on Linux and macOS, where it passes.

## 2026-07-15 — import fail-closed checks

The lock records every imported SHA-256. The generator rejects source symlinks, executable files, invalid UTF-8, missing paths, changed locked hashes, and rewritten tags. It emits `PARITY.json` and `PARITY.md` in the generated plugin for automated and human review.

Repeated synchronization of the already-pinned tag is an explicit no-op, including the lock timestamp; integration tests enforce this.

## 2026-07-15 — stats fallback

Observed current Codex transcript envelopes contain no supported token-usage counters. `$caveman-stats` therefore explicitly reports exact stats unavailable; it never estimates. A future documented schema requires fixtures before support is added.

## 2026-07-15 — current CLI evidence

NPM’s official `@openai/codex` latest tag resolved to `0.144.4`. An isolated `CODEX_HOME` successfully added the local marketplace, listed the plugin, installed it, and removed it. The installed `0.144.2` remains the minimum-version evidence.

## 2026-07-15 — local release evidence

`npm test`, `npm run test:upstream`, `npm audit --omit=dev`, secret-pattern scanning, and `npm run release:dry-run` pass. The current deterministic local ZIP hash is recorded only as run evidence; the approval-gated GitHub release will produce the authoritative attestation and checksums.
