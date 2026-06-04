# Provider Switch Prompt

Use these compact templates when handing Makeup Engine work between providers. Repository documents are the source of truth, not chat memory.

Default to compact context. Do not copy full historical chat transcripts. Do not paste complete directory trees, and never paste `node_modules`, `dist`, `.test-dist`, or `.vite`.

## Current State

- `lastCompletedPhase: 7G`
- `nextRecommendedPhase: 7H`
- Project role: Makeup template production system with a local contract-driven user app shell prototype, not a production user app.
- Current capability: Phase 7G local User App mobile interaction QA and app readiness gate is complete.

## Relevant skills

- `PROJECT_RECOVERY_SKILL.md`: use for provider switches, source-of-truth checks, and recovery.
- `PHASE_EXECUTION_SKILL.md`: use for phase implementation, validation, documentation sync, and failure reports.
- `CONTRACT_SCHEMA_GUARD_SKILL.md`: use for schema, state machine, storage, export, and handoff JSON changes.
- `COMPACT_HANDOFF_SKILL.md`: use for compact provider handoff.

## Switch To Native GPT / Codex Desktop

```text
You are continuing Makeup Engine on native GPT / Codex Desktop.

Current state:
- lastCompletedPhase: 7G
- nextRecommendedPhase: 7H
- project role: Makeup template production system with a local contract-driven user app shell prototype, not a production user app
- current capability: User App Mobile Interaction QA / App Readiness Gate is complete

Compact context:
- Use repository documents as source of truth; do not copy full historical chat.
- Attach or summarize npm run project:context.
- Attach or summarize project-state/latest-handoff.json.
- Include `project-state/skills.json` or relevant `docs/skills/*.md` summaries when project skills matter.
- Include external skill metadata if referenced: `skillId`, source, status, `allowedInvocation`, `instructionOnly`, and `scriptsAllowed`.
- Use docs/prompts/COMPACT_CODEX_TASK_TEMPLATE.md unless a full prompt is explicitly requested.

Read these files first:
1. AGENTS.md
2. START_HERE.md
3. docs/prompts/MASTER_CODEX_CONTEXT.md
4. docs/prompts/PROVIDER_SWITCH_PROMPT.md
5. docs/status/CURRENT_PROJECT_STATUS.md
6. docs/status/NEXT_ACTION.md
7. docs/user-app/user-app-mvp-shell.md
8. docs/user-app/step-guidance-ux-hardening.md
9. docs/user-app/user-app-local-onboarding.md
10. docs/user-app/user-local-preferences.md
11. docs/user-app/preferences-to-guidance-hints.md
12. docs/user-app/user-template-discovery.md
13. docs/user-app/user-template-recommendation-placeholder.md
14. docs/user-app/user-recommendation-reasons.md
15. docs/user-app/user-app-session-persistence.md
16. docs/user-app/user-app-session-recovery.md
17. docs/user-app/user-app-mobile-interaction-qa.md
18. docs/user-app/user-app-readiness-gate.md
19. docs/user-app/user-app-readiness-checklist.md
20. docs/privacy/user-app-session-data-boundary.md
21. docs/phases/phase-7G.md
19. project-state/project-state.snapshot.json
20. project-state/provider-handoff.json
21. project-state/latest-handoff.json
22. project-state/active-task.json
23. project-state/skills.json
24. project-state/external-skills-registry.json

Forbidden:
- Do not touch src/engine, src/runtime, or src/intelligence/runtime legacy frozen modules.
- Do not train directly from SourceImagePackage.
- Do not bypass artifact binding, mask correction, template review, dataset review, package validation, app contract validation, or quality gates.
- Do not treat UserAppTemplatePackage as the real user app or online release.
- Do not treat the Phase 7A/7B/7C/7D/7E/7F/7G shell and readiness gate as a production user app or production release approval.
- Do not add real camera capture, AR, backend, database, account systems, cloud sync, analytics, online publishing, training, native iOS, or new runtime dependencies.
- Do not collect, upload, analyze, store, export, or train on real user photos.
- Do not persist face embeddings, biometric identifiers, user photo bytes, base64 image data, local photo paths, sensitive profile data, React state, recommendation result records, or training input.
- Do not let preferences, recommendations, or session recovery mutate UserAppTemplatePackage, enter training datasets, sync to backend/cloud, or write real user records into project-state.
- Do not use unregistered external skills.

Acceptance commands:
- npm run typecheck
- npm run test
- npm run build
- npm run project:status
- npm run project:context
- node scripts/project-status.mjs --json
- node scripts/context-pack.mjs --json
```

## Switch To PackyAPI + CLI

```text
You are continuing Makeup Engine on PackyAPI + CLI.

Current state:
- lastCompletedPhase: 7G
- nextRecommendedPhase: 7H
- project role: Makeup template production system with a local contract-driven user app shell prototype, not a production user app
- current capability: local User App MVP Shell consumes UserAppTemplatePackage, renders hardened guidance, placeholders, onboarding/preferences, discovery/recommendations, local session persistence/recovery, and Phase 7G readiness/mobile QA panels

Use compact context and repository docs as source of truth. Candidate external skills remain explicit-only and scripts-disabled by default.

Read the same files listed in the native GPT / Codex Desktop section, plus docs/workflows/PACKYAPI_CLI_RUNBOOK.md if PackyAPI execution details are needed.

Forbidden and acceptance commands are the same as above.
```

## Return From PackyAPI To ChatGPT

```text
Below is the PackyAPI + CLI execution result for Makeup Engine. Please review it as ChatGPT / PM / architect and decide the next step.

Current state:
- lastCompletedPhase: 7G
- nextRecommendedPhase: 7H
- project role: Makeup template production system, not a production user app

Completed work:
{completedWork}

Added files:
{addedFiles}

Modified files:
{modifiedFiles}

Validation results:
{validationResults}

Test results:
{testResults}

UI / smoke status:
{uiSmokeStatus}

Current limitations:
{currentLimitations}

Checklist:
- Were src/engine, src/runtime, or src/intelligence/runtime touched? {legacyTouched}
- Were new dependencies added? {newDependencies}
- Were external APIs called? {externalApi}
- Did SourceImagePackage remain out of direct training dataset creation? {sourceImageBoundary}
- Did correction, evidence, template review, dataset review, package validation, app contract validation, and quality gates remain intact? {reviewBoundary}
- Did exports/session payloads avoid object URLs, local absolute paths, large image bytes, base64 images, React state, photos, biometrics, sensitive profile data, recommendation records, and training input? {exportBoundary}

Please respond with:
1. Whether this work is accepted
2. Whether anything must be rolled back or patched
3. The next recommended provider and profile
4. Whether to start Phase 7H or run a targeted Phase 7G-1
5. The exact handoff text for the next provider
```

## Required Handoff Rules

- Always state `lastCompletedPhase: 7G`.
- Always state `nextRecommendedPhase: 7H` unless QA confirms the project needs a targeted Phase 7G-1.
- Always list the required read files first.
- Always include the boundary that `SourceImagePackage` can reach Vision Analysis through explicit binding, but cannot become a training dataset directly and cannot directly become a template library entry.
- Always include the boundary that `UserAppTemplatePackage` is a consumption contract, not a real app, backend publication, or online release.
- Always include the boundary that the prototype consumer is read-only validation, not the real user app.
- Always include the boundary that the Phase 7A/7B/7C/7D/7E/7F/7G shell and readiness gate are local contract-driven prototype behavior, not a production app or production release approval.
- Always include the boundary that Phase 7C photo intake is placeholder-only and does not collect, upload, analyze, store, export, or train on real user photos.
- Always include the boundary that Phase 7D preferences are local-only, non-sensitive, display-hint-only, not backend/cloud synced, not training input, and cannot mutate `UserAppTemplatePackage`.
- Always include the boundary that Phase 7E recommendations are local-only, rule-based, deterministic placeholders, not real AI recommendation, not backend/cloud synced, not training input, and cannot mutate `UserAppTemplatePackage`.
- Always include the boundary that Phase 7F session persistence is local-only, not account/backend/cloud storage, not training input, and cannot persist photos, object URLs, local paths, image bytes, base64 images, biometrics, sensitive profile fields, React state, or recommendation result records.
- Always include the boundary that Phase 7G readiness/mobile QA is local deterministic product QA only, not real device QA, native iOS QA, backend readiness, camera readiness, AR readiness, training readiness, or app store release approval.
- Always include the validation commands that were run.
- Always state that project-state and docs/status were updated after the work.
- Always include `project-state/skills.json` or the relevant skill docs when switching providers.
- Always include an `AGENTS.md` summary when switching providers.
- Always include `project-state/external-skills-registry.json` or a relevant external skill summary if an external skill is referenced.
- Always prefer compact context and repository document references over copied chat history.
