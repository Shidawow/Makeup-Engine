# Phase Handoff Requirements

Each phase handoff must be recoverable by a new Codex session without hidden context.

## Required Human-Readable Files

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
- `docs/workflows/AI_PROVIDER_SWITCHING.md`
- `docs/workflows/CODEX_EXECUTION_PROFILES.md`
- `docs/workflows/CODEX_HANDOFF_PROTOCOL.md`
- `docs/workflows/PACKYAPI_CLI_RUNBOOK.md`
- `docs/status/CURRENT_PROJECT_STATUS.md`
- `docs/status/CURRENT_PHASE.md`
- `docs/status/NEXT_ACTION.md`
- `docs/status/KNOWN_LIMITATIONS.md`
- `docs/phases/phase-{phase}.md`
- `docs/runbooks/PROJECT_RECOVERY_RUNBOOK.md`

## Required Machine-Readable Files

- `project-state/project-state.snapshot.json`
- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`
- `project-state/execution-profile.json`
- `project-state/active-task.json`
- `project-state/artifact-index.json`
- `project-state/command-log.json`
- `project-state/test-status.json`
- `project-state/guardrails.json`

## Required Validation

Run:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
npm run project:status -- --json
node scripts/context-pack.mjs --json
```

If npm argument forwarding is unavailable, run:

```bash
node scripts/project-status.mjs --json
```

## Handoff Guardrails

- State whether `src/engine`, `src/runtime`, or `src/intelligence/runtime` were touched.
- State whether new dependencies were added.
- State whether external APIs were called.
- State whether source image, correction, review, and training boundaries remain intact.
- State which provider/profile was used.
- State whether `project-state/provider-handoff.json` and `project-state/active-task.json` were updated.
- State whether the next provider was identified.
