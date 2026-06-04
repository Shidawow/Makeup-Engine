# Compact Codex Task Template

Use this template for small fixes, small UI changes, test fixes, documentation sync, project-state maintenance, and provider handoff refreshes. Compact means less repeated background, not lower standards.

```text
# Phase <PHASE_ID> - <PHASE_NAME>

Current phase:
- lastCompletedPhase: <phase>
- nextRecommendedPhase: <phase>
- task mode: compact | medium | full

This round goal:
<State the exact outcome. Do not compress the goal.>

Required read files:
1. START_HERE.md
2. docs/prompts/MASTER_CODEX_CONTEXT.md
3. docs/status/NEXT_ACTION.md
4. project-state/project-state.snapshot.json
5. project-state/latest-handoff.json
6. project-state/provider-handoff.json
7. <task-specific files>

Allowed modification scope:
- <directories/files allowed>

Forbidden modification scope:
- Do not modify src/engine, src/runtime, or src/intelligence/runtime for new mainline work.
- Do not paste or inspect full node_modules, dist, .test-dist, or .vite trees.
- Do not add backend, database, external APIs, or new dependencies unless explicitly required.
- Do not weaken existing guardrails, tests, acceptance commands, or documentation requirements.
- <task-specific forbidden scope>

Core tasks:
1. <task>
2. <task>
3. <task>

State machine / schema / contract requirements, if applicable:
- <required transitions, schema fields, validation rules, compatibility rules, or "Not applicable">

Acceptance commands:
- npm run typecheck
- npm run test
- npm run build
- npm run project:status
- npm run project:context
- <additional direct commands, if needed>

Documentation update requirements:
- Update docs/status when phase state or next action changes.
- Update docs/phases/phase-<PHASE_ID>.md for detailed implementation notes.
- Update project-state/*.json when recovery state, handoff, tests, commands, or guardrails change.
- For docs-only tasks, still update any relevant recovery tests.

Current limitations:
- <limitations that remain after this task>

Next recommendation:
- <next phase or follow-up>

Completion report format:
1. Added/modified files
2. New rules or behavior
3. Tests and validation
4. Current limitations
5. Next recommendation
```

## Mode Guidance

Use `compact prompt` for small fixes, small UI changes, test fixes, documentation sync, and handoff maintenance.

Use `medium prompt` for ordinary phases. Preserve goals, schemas, state machines, contract requirements, test requirements, acceptance commands, docs updates, and project-state updates.

Use `full prompt` for architecture refactors, new mainline systems, broad PackyAPI tasks, failure recovery, or when a provider lacks reliable repository context.

Only provide a full long prompt when the owner explicitly asks for "完整 prompt" or "full prompt".

