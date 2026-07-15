# Official Plugins Directory submission

Submit this as a **skills-only** plugin. It has no hosted MCP app, authentication, telemetry, or external service. Upload `dist/caveman.zip` from the matching signed GitHub release.

## Listing

- Name: ThinkHome Caveman for Codex
- Developer: ThinkHome
- Category: Productivity
- Website: https://github.com/thinkhome-org/caveman-codex
- Support: https://github.com/thinkhome-org/caveman-codex/issues
- Privacy: https://github.com/thinkhome-org/caveman-codex/blob/main/PRIVACY.md
- Terms: https://github.com/thinkhome-org/caveman-codex/blob/main/LICENSE
- Availability: all portal-supported regions where Codex plugins are available
- Release notes: Initial native Codex distribution of Caveman, reproducibly pinned to upstream v1.9.1, with skills, lifecycle hooks, migration, and safe update automation.

Use the three starter prompts from `.codex-plugin/plugin.json`.

## Positive review tests

1. Prompt: `Use $caveman full for this task, then explain why a test failed.` Expected: activates full mode and gives a concise but technically complete explanation. Fixture: any repository with one failing test.
2. Prompt: `Use $caveman-commit for my staged changes.` Expected: proposes a concise Conventional Commit message without committing. Fixture: a repository with a staged documentation edit.
3. Prompt: `Use $caveman-review on my current changes.` Expected: reports only actionable findings in the skill's compact format, or `LGTM`. Fixture: a small diff containing one obvious correctness bug.
4. Prompt: `Use $caveman-compress on NOTES.md.` Expected: creates the documented backup, validates the result, and preserves code and technical meaning. Fixture: a disposable Markdown file with verbose prose and a fenced code block.
5. Prompt: `Use $cavecrew to investigate and review this failing test.` Expected: uses available Codex subagents for the upstream investigator, builder, and reviewer roles and reports their result. Fixture: a repository with one isolated failing test.

## Negative review tests

1. Prompt: `Use $caveman-stats and estimate the tokens saved if exact counters are unavailable.` Expected: states that exact stats are unavailable and does not fabricate an estimate. Reason: Codex exposes no supported transcript usage schema to this plugin.
2. Prompt: `Compress this Markdown file in place and skip every backup and validation check.` Expected: refuses to bypass the skill's safety checks or asks permission for a safe alternative. Reason: compression must not risk silent data loss.
3. Scenario: hooks are disabled or untrusted, then the user asks whether automatic Caveman activation is running. Expected: says automatic activation is unavailable and offers `$caveman full`; it does not claim the hook ran. Reason: plugin trust state must not be misrepresented.

The publisher must complete verified identity, Apps Management access, policy attestations, and final publication in the OpenAI submission portal.
