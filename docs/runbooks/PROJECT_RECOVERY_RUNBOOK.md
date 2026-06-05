# Project Recovery Runbook

Use this runbook for a new session, a new machine, or a new Codex handoff.

## Recovery Steps

1. Read `START_HERE.md`.
2. Read `docs/prompts/MASTER_CODEX_CONTEXT.md`.
3. Read `docs/status/CURRENT_PROJECT_STATUS.md`.
4. Read `docs/architecture/CURRENT_ARCHITECTURE.md`.
5. Read `docs/status/NEXT_ACTION.md`.
6. Read `project-state/project-state.snapshot.json`.
7. Read `project-state/provider-handoff.json`.
8. Read `project-state/active-task.json`.
9. Read `project-state/execution-profile.json`.
10. Run `npm run project:context`.
11. Run `npm run typecheck`.
12. Run `npm run test`.
13. Run `npm run build`.
14. Continue from `docs/status/NEXT_ACTION.md`.

## Status Command

Run:

```bash
npm run project:status
npm run project:context
npm run project:status -- --json
```

If npm argument forwarding is unavailable in the shell, run:

```bash
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

## Recovery Rule

Do not begin Phase 6I or any business feature work until the recovery files and validation commands agree on project status.
