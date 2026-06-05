# Phase Execution Skill

Use this skill for every implementation, documentation sync, state recovery, test repair, or handoff phase.

## Before A Phase

1. Run project recovery:

```bash
npm run project:status
npm run project:context
```

2. Read the required files listed in `project-state/provider-handoff.json`.
3. Read any phase-specific docs in `docs/phases`.
4. Check `project-state/active-task.json` for allowed and forbidden directories.
5. Check `project-state/guardrails.json` and relevant `docs/skills/*.md`.
6. Decide whether the task is docs-only, schema/contract work, UI work, production QA work, or provider handoff work.

## During A Phase

- Keep runtime deterministic.
- Prefer existing modules and patterns over parallel systems.
- Keep schema, state machine, storage, UI, and training boundaries separate.
- Add or update tests for every feature or documentation recovery rule.
- Do not disable tests.
- Do not add placeholder logic.
- Do not introduce new dependencies unless the owner explicitly requests them.
- Do not touch legacy frozen directories for new mainline work.

## After A Phase

Update the relevant repository recovery files. For normal business phases this usually includes:

- `START_HERE.md`
- `docs/status/CURRENT_PROJECT_STATUS.md`
- `docs/status/CURRENT_PHASE.md`
- `docs/status/NEXT_ACTION.md`
- `docs/status/KNOWN_LIMITATIONS.md`
- `docs/phases/PHASE_HISTORY.md`
- `docs/phases/phase-xxx.md`
- `docs/architecture/*`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
- `project-state/project-state.snapshot.json`
- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/test-status.json`
- `project-state/command-log.json`
- `project-state/artifact-index.json`
- `project-state/guardrails.json`

For docs-only or operations phases, update only the docs and project-state files needed for the requested operating rule.

## Required Validation

Run:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
```

Run direct JSON recovery checks when the phase touches project-state or provider handoff:

```bash
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

## Compact Report Format

Default completion report:

1. Added/modified files
2. New behavior or rules
3. Relevant schema / state / contract notes
4. Test results
5. Validation command status
6. Current limitations
7. Next recommendation

## Failure Reporting

If validation fails:

- report the exact failed command
- summarize the failing test or error
- explain whether code, docs, or project-state caused the failure
- patch the failure when it is in scope
- if not patchable in scope, stop with the smallest clear blocker
