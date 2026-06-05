# Project Recovery Skill

Use this skill when a new Codex session, PackyAPI run, native GPT session, or provider switch needs to resume Makeup Engine work.

## Source Of Truth

Repository documents and `project-state/*.json` are the source of truth.

Chat history is not source of truth. If chat and repository state disagree, use repository state unless the owner explicitly instructs a correction.

## Required Read Files

Read these first:

1. `START_HERE.md`
2. `docs/prompts/MASTER_CODEX_CONTEXT.md`
3. `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
4. `docs/status/CURRENT_PROJECT_STATUS.md`
5. `docs/status/NEXT_ACTION.md`
6. `project-state/project-state.snapshot.json`
7. `project-state/latest-handoff.json`
8. `project-state/provider-handoff.json`
9. `project-state/active-task.json`
10. `project-state/guardrails.json`
11. `project-state/skills.json`

Read phase-specific docs listed in `project-state/provider-handoff.json` before editing.

## Recovery Steps

1. Confirm `lastCompletedPhase`, `currentPhaseId`, `nextRecommendedPhase`, and `nextAction` from `project-state/project-state.snapshot.json`.
2. Confirm provider handoff state from `project-state/provider-handoff.json`.
3. Confirm active task and allowed/forbidden directories from `project-state/active-task.json`.
4. Confirm guardrails from `project-state/guardrails.json`.
5. Confirm relevant skills from `project-state/skills.json`.
6. Run recovery commands:

```bash
npm run project:status
npm run project:context
```

Use the direct JSON commands when machine-readable state is needed:

```bash
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

## Continue / Stop Decision

The project is safe to continue when:

- required read files exist and parse
- `project:status` passes
- `project:context` passes
- active task has clear allowed and forbidden scopes
- guardrails match the requested work

Stop and report a blocker when:

- required state JSON is invalid
- `project:status` or `project:context` fails
- the requested task conflicts with forbidden directories
- the requested task asks to bypass review, evidence, app contract validation, dataset review, or quality gates
- the requested task depends on chat-only context that is missing from the repository

## Core Boundaries

- Do not depend on chat memory as source of truth.
- Do not modify `src/engine`, `src/runtime`, or `src/intelligence/runtime` for new mainline work.
- Do not train directly from `SourceImagePackage`.
- Do not treat `local_published` as online publication.
- Do not persist object URLs, local absolute paths, large image bytes, or React state in durable exports.
