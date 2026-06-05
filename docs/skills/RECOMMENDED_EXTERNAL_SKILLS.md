# Recommended External Skills

These are candidate skill categories for future review. They are not installed by this document. Add a candidate to `project-state/external-skills-registry.json`, review it with `docs/skills/EXTERNAL_SKILL_VETTING.md`, and keep invocation `explicit-only` until approved.

## Recommended Candidates

### React UI / Accessibility QA Skill

- Purpose: review Template Studio, User App Prototype Consumer, panels, empty states, error states, keyboard flow, and accessibility basics.
- Trigger: UI panel, component test, accessibility, empty state, error state.
- `scriptsAllowed`: `false`.
- Use only as an instruction-only review aid unless manually approved.

### TypeScript Contract / Schema Review Skill

- Purpose: review schemas, contracts, state machines, storage/export JSON, and package validation.
- Trigger: `TemplatePublishPackage`, `UserAppTemplatePackage`, `ProductionTask`, `LibraryEntry`, schema, contract, state machine, durable export.
- `scriptsAllowed`: `false`.
- Must preserve schema-first and no durable runtime-reference boundaries.

### Vitest Deterministic Testing Skill

- Purpose: improve state machine tests, component render tests, fixtures, and deterministic assertions.
- Trigger: tests, fixture, deterministic, snapshot, regression coverage.
- `scriptsAllowed`: `false` unless scripts are local and manually reviewed.
- Must not disable tests or introduce nondeterministic remote resources.

### Security / Supply Chain Review Skill

- Purpose: review dependencies, external API proposals, file paths, secrets, artifact exports, and package/handoff safety.
- Trigger: dependency, API, file path, security, package export, handoff export.
- `scriptsAllowed`: `false`.
- Must block unapproved dependency installation and external API usage.

### Git / PR Review Skill

- Purpose: summarize diffs, review risk, prepare PR handoff, and check phase completion after large tasks.
- Trigger: PackyAPI large task, phase completion, handoff, diff review.
- `scriptsAllowed`: `false`.
- Must not revert user changes or modify history unless explicitly requested.

## Not Recommended For Current Phase

Do not introduce these skill categories in the current roadmap position:

- OpenAI CV API skill
- ONNX Runtime skill
- PyTorch / TensorFlow training skill
- Backend deployment skill
- Database skill
- iOS native app skill
- AR realtime makeup skill

These areas are outside the current local template production, contract, prototype consumer, and governance scope.
