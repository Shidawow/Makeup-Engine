# Phase OPS-0 - Token Budget & Compact Handoff Rules

## Goal

Reduce repeated ChatGPT / Codex / PackyAPI token use without reducing engineering quality, repository documentation, tests, acceptance standards, or recovery state.

## Added Standards

- Repository documents are the source of truth, not chat history.
- Future conversations should not paste full directory trees.
- `node_modules`, `dist`, `.test-dist`, and `.vite` must not be pasted.
- Codex reports default to compact format.
- Detailed implementation notes belong in phase documents.
- Prompts should cite `START_HERE.md`, `MASTER_CODEX_CONTEXT.md`, `NEXT_ACTION.md`, and `project-state/*.json`.
- Business phases should not repeat DOC-0 / DOC-1 in full; they should reference documentation maintenance standards.

## Quality Protection

Token optimization only compresses repeated background and chat summaries. It cannot compress task goals, acceptance criteria, tests, guardrails, repository documentation, or project-state updates.

Compact prompts are not low-quality prompts. They are incremental prompts backed by stable repository context.

## Task Modes

- Compact prompt: small fixes, small UI changes, test fixes, documentation sync, project-state maintenance.
- Medium prompt: ordinary phases with one feature area or multiple coordinated files.
- Full prompt: architecture refactors, new mainline systems, broad PackyAPI runs, failure recovery, or missing repository context.

## Next Recommendation

Continue with `Phase 6L - User App Prototype Contract Consumer` unless app contract compatibility requires `Phase 6K-1`.

