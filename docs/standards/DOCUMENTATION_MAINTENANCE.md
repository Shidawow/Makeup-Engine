# Documentation Maintenance

Every completed phase must update the recovery and status layer.

## Required Updates

- `docs/status/CURRENT_PROJECT_STATUS.md`
- `docs/status/CURRENT_PHASE.md`
- `docs/status/NEXT_ACTION.md`
- `docs/status/KNOWN_LIMITATIONS.md`
- `docs/phases/phase-{phase}.md`
- `project-state/project-state.snapshot.json`
- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/execution-profile.json`
- `project-state/command-log.json`
- `project-state/test-status.json`

## Required Report Fields

Codex completion reports must include:

- Whether documentation was updated.
- Whether the status snapshot was updated.
- Whether the recovery entry is usable.
- Which files the next session should read first.
- Which provider and execution profile were used.
- Whether the provider handoff was updated.
- Which provider should be used next.
- Whether the task has context drift risk.
- Whether forbidden directories were touched.
- Whether new dependencies were introduced.
- Whether any external API was called.
- Typecheck, test, build, and project-status results.

## Source Of Truth

Use `START_HERE.md` and `project-state/project-state.snapshot.json` as the first recovery layer. Use detailed docs under `docs/training`, `docs/dataset`, `docs/template-studio`, and `docs/architecture` for deeper implementation context.
