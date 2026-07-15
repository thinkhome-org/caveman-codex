# Decisions

## 2026-07-15 — architecture

Use a thin generated adapter around a pinned Caveman release. Do not fork, subtree, or patch upstream. The importer replaces only generated output atomically and fails closed on ambiguous source changes.

## 2026-07-15 — Codex capability baseline

Verified with Codex CLI `0.144.2`, Desktop `26.707.72221`, and the current official Codex manual. Plugins use `.codex-plugin/plugin.json`; marketplaces use `.agents/plugins/marketplace.json`; skills and bundled synchronous command hooks are supported. Git/local marketplace installation is supported. Hooks require user trust and prompt/agent/async handlers are not supported. Desktop acceptance remains a manual release gate.

## 2026-07-15 — pinned upstream

Latest stable tag is `v1.9.1`, resolved commit `0d95a81d35a9f2d123a5e9430d1cfc43d55f1bb0`, tree `867418a8efea2c92b3885b8efd99d73d7c58af11`.

## 2026-07-15 — dependency policy

Node standard library only. No runtime network access. Native `codex plugin` remains the installer and uninstaller.

## 2026-07-15 — upstream regression caveat

The pinned upstream suite has 110 passing and 2 failing tests under local Node `26.4.0`; both failures are upstream uninstall assertions in `tests/installer/e2e.freshinstall.test.mjs`. ThinkHome does not alter upstream code. CI pins Node 20 to establish the supported regression baseline; the result must be reviewed before release.

## 2026-07-15 — import fail-closed checks

The lock records every imported SHA-256. The generator rejects source symlinks, executable files, invalid UTF-8, missing paths, changed locked hashes, and rewritten tags. It emits `PARITY.json` and `PARITY.md` in the generated plugin for automated and human review.

## 2026-07-15 — stats fallback

Observed current Codex transcript envelopes contain no supported token-usage counters. `$caveman-stats` therefore explicitly reports exact stats unavailable; it never estimates. A future documented schema requires fixtures before support is added.
