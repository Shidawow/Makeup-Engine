# Provider Switch Prompt

Use these compact templates when handing Makeup Engine work between providers. Repository documents are the source of truth, not chat memory.

Default to compact context. Do not copy full historical chat transcripts. Do not paste complete directory trees, and never paste `node_modules`, `dist`, `.test-dist`, or `.vite`.

## Current State

- `lastCompletedPhase: 9E`
- `nextRecommendedPhase: 9F`
- `nextRecommendedPhaseName: Internal Trial Evidence Collection Preparation`
- Project role: Makeup template production system with a local contract-driven user app shell prototype, not a production user app.
- Current capability: Phase 9E added local internal trial evidence pack, evidence summary, sufficiency gate, fixtures, and administrator evidence panels after Phase 9D learning decision gate.

Historical handoff marker retained for recovery tests: `lastCompletedPhase: 8A`, `nextRecommendedPhase: 8B`.
Historical handoff marker retained for Phase 8B recovery tests: `lastCompletedPhase: 8B`, `nextRecommendedPhase: 8C`.
Historical handoff marker retained for Phase 8C recovery tests: `lastCompletedPhase: 8C`, `nextRecommendedPhase: 8D`.
Historical handoff marker retained for Phase 8D recovery tests: `lastCompletedPhase: 8D`, `nextRecommendedPhase: 8E`.
Historical handoff marker retained for Phase 8E recovery tests: `lastCompletedPhase: 8E`, `nextRecommendedPhase: 9A`.
Historical handoff marker retained for Phase 9A recovery tests: `lastCompletedPhase: 9A`, `nextRecommendedPhase: 9B`.
Historical handoff marker retained for Phase 9B recovery tests: `lastCompletedPhase: 9B`, `nextRecommendedPhase: 9C`.
Historical handoff marker retained for Phase 9C recovery tests: `lastCompletedPhase: 9C`, `nextRecommendedPhase: 9D`.
Historical handoff marker retained for Phase 9D recovery tests: `lastCompletedPhase: 9D`, `nextRecommendedPhase: 9E`.

## Relevant skills

- `PROJECT_RECOVERY_SKILL.md`: use for provider switches, source-of-truth checks, and recovery.
- `PHASE_EXECUTION_SKILL.md`: use for phase implementation, validation, documentation sync, and failure reports.
- `CONTRACT_SCHEMA_GUARD_SKILL.md`: use for schema, state machine, storage, export, and handoff JSON changes.
- `COMPACT_HANDOFF_SKILL.md`: use for compact provider handoff.

## Switch To Native GPT / Codex Desktop

```text
You are continuing Makeup Engine on native GPT / Codex Desktop.

Current state:
- lastCompletedPhase: 9E
- nextRecommendedPhase: 9F
- nextRecommendedPhaseName: Internal Trial Evidence Collection Preparation
- project role: Makeup template production system with a local contract-driven user app shell prototype, not a production user app
- current capability: React Web / PWA MVP first is selected; Phase 8B local PWA/mobile shell polish, Phase 8C local MVP trial pack, Phase 8D template content QA, Phase 8E MVP release readiness gate, Phase 9A internal trial operations pack, Phase 9B internal trial result review framework, Phase 9C internal trial iteration plan, Phase 9D internal trial learning decision gate, and Phase 9E internal trial evidence pack are complete; Makeup Engine remains the template production system and the future user-facing app should be planned separately

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
7. docs/app-roadmap/app-technology-route-decision.md
8. docs/app-roadmap/user-app-mvp-plan.md
9. docs/app-roadmap/makeup-engine-vs-user-app-boundary.md
10. docs/app-roadmap/phase-8-roadmap.md
11. docs/product/user-app-v1-non-goals.md
12. docs/user-app/user-app-product-route.md
13. docs/user-app/pwa-mobile-web-mvp-polish.md
14. docs/user-app/pwa-install-readiness.md
15. docs/user-app/user-app-mvp-trial-pack.md
16. docs/user-app/user-app-trial-feedback.md
17. docs/user-app/user-app-trial-readiness.md
18. docs/product/user-app-trial-script.md
19. docs/product/user-app-feedback-questionnaire.md
20. docs/user-app/template-content-qa-for-trial.md
21. docs/user-app/trial-template-selection.md
22. docs/user-app/trial-content-readiness.md
23. docs/product/template-content-qa-checklist.md
24. docs/user-app/mvp-release-readiness-gate.md
25. docs/user-app/trial-go-no-go-decision.md
26. docs/product/internal-trial-launch-checklist.md
27. docs/product/internal-trial-operations-pack.md
28. docs/product/internal-trial-participant-guide.md
29. docs/product/internal-trial-observation-template.md
30. docs/product/internal-trial-outcome-review.md
31. docs/product/internal-trial-result-review-framework.md
32. docs/product/internal-trial-issue-taxonomy.md
33. docs/product/internal-trial-decision-framework.md
34. docs/product/internal-trial-iteration-plan.md
35. docs/product/internal-trial-iteration-backlog.md
36. docs/product/internal-trial-priority-framework.md
37. docs/product/internal-trial-learning-summary.md
38. docs/product/product-decision-gate.md
39. docs/product/next-phase-recommendation-framework.md
40. docs/product/internal-trial-evidence-pack.md
41. docs/product/trial-evidence-summary.md
42. docs/product/evidence-sufficiency-gate.md
43. docs/user-app/user-app-browser-mobile-qa.md
21. docs/user-app/user-app-e2e-readiness.md
22. docs/user-app/user-app-mobile-interaction-qa.md
23. docs/user-app/user-app-readiness-gate.md
24. docs/user-app/user-app-readiness-checklist.md
25. docs/privacy/user-app-session-data-boundary.md
26. docs/phases/phase-8A.md
27. docs/phases/phase-8B.md
28. docs/phases/phase-8C.md
29. docs/phases/phase-8D.md
30. docs/phases/phase-8E.md
42. docs/phases/phase-9A.md
43. docs/phases/phase-9B.md
44. docs/phases/phase-9C.md
45. docs/phases/phase-7H.md
46. project-state/project-state.snapshot.json
47. project-state/provider-handoff.json
48. project-state/latest-handoff.json
49. project-state/active-task.json
50. project-state/skills.json
51. project-state/external-skills-registry.json

Forbidden:
- Do not touch src/engine, src/runtime, or src/intelligence/runtime legacy frozen modules.
- Do not train directly from SourceImagePackage.
- Do not bypass artifact binding, mask correction, template review, dataset review, package validation, app contract validation, or quality gates.
- Do not treat UserAppTemplatePackage as the real user app or online release.
- Do not treat the Phase 7A/7B/7C/7D/7E/7F/7G/7H shell, readiness gate, and browser/mobile QA harness as a production user app or production release approval.
- Do not treat the Phase 8A React Web / PWA route decision or Phase 8B PWA/mobile polish as production app implementation approval.
- Do not treat the Phase 8C trial pack, feedback preview, or trial readiness as production release, App Store/TestFlight, backend form, analytics, real user record collection, camera/AR, or training approval.
- Do not treat the Phase 8D template content QA, trial template selection, or trial content readiness as production release, App Store/TestFlight, backend, analytics, AI generation, OpenAI/external API usage, real user record collection, camera/AR, or training approval.
- Do not treat the Phase 8E MVP release readiness or trial go/no-go decision as production release, App Store/TestFlight, backend readiness, analytics readiness, camera readiness, AR readiness, AI generation approval, OpenAI/external API approval, training readiness, online publication, or real user data collection approval.
- Do not treat the Phase 9A internal trial operations, observation template, or outcome review as public recruitment, production release, App Store/TestFlight, backend form, analytics, real user record collection, camera/AR, AI analysis, OpenAI/external API usage, or training approval.
- Do not treat the Phase 9B internal trial result review, issue taxonomy, or decision framework as production analytics, public recruitment, backend record collection, AI analysis, OpenAI/external API usage, training, production release, or real user record collection approval.
- Do not treat the Phase 9C internal trial iteration plan, backlog, or priority framework as a formal production roadmap, backend issue tracker, production analytics, public recruitment, AI analysis, OpenAI/external API usage, training, production release, or real user record collection approval.
- Do not treat the Phase 9D internal trial learning decision gate as production analytics, production app approval, backend collection, AI analysis, training, public recruitment, production roadmap approval, or production release approval.
- Do not treat the Phase 9E internal trial evidence pack, evidence summary, or sufficiency gate as production analytics, backend evidence collection, AI analysis, training, public recruitment, production app approval, or production release approval.
- Do not add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, camera, AR, external API, native app, training, online publication, or app store release work unless a future explicit phase gate expands scope.
- Do not build or bootstrap the separate production user app repository unless a future explicit phase gate expands scope.
- Do not add real camera capture, AR, backend, database, account systems, cloud sync, analytics, ecommerce, community, paid features, online publishing, training, native iOS, React Native, Flutter, app store release work, or new runtime dependencies.
- Do not collect, upload, analyze, store, export, or train on real user photos.
- Do not persist face embeddings, biometric identifiers, user photo bytes, base64 image data, local photo paths, sensitive profile data, React state, recommendation result records, readiness records, browser QA records, or training input.
- Do not let preferences, recommendations, session recovery, readiness, mobile QA, or browser QA mutate UserAppTemplatePackage, enter training datasets, sync to backend/cloud, or write real user records into project-state.
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
- lastCompletedPhase: 9E
- nextRecommendedPhase: 9F
- nextRecommendedPhaseName: Internal Trial Evidence Collection Preparation
- project role: Makeup template production system with a local contract-driven user app shell prototype, not a production user app
- current capability: Phase 9E completed internal trial evidence packaging after Phase 9D learning decision gate, Phase 9C iteration planning, Phase 9B result review, and Phase 9A operations

Use compact context and repository docs as source of truth. Candidate external skills remain explicit-only and scripts-disabled by default.

Read the same files listed in the native GPT / Codex Desktop section, plus docs/workflows/PACKYAPI_CLI_RUNBOOK.md if PackyAPI execution details are needed.

Forbidden and acceptance commands are the same as above.
```

## Return From PackyAPI To ChatGPT

```text
Below is the PackyAPI + CLI execution result for Makeup Engine. Please review it as ChatGPT / PM / architect and decide the next step.

Current state:
- lastCompletedPhase: 9E
- nextRecommendedPhase: 9F
- nextRecommendedPhaseName: Internal Trial Evidence Collection Preparation
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
- Did exports/session/readiness/browser QA payloads avoid object URLs, local absolute paths, large image bytes, base64 images, React state, photos, biometrics, sensitive profile data, recommendation records, readiness records, browser QA records, and training input? {exportBoundary}

Please respond with:
1. Whether this work is accepted
2. Whether anything must be rolled back or patched
3. The next recommended provider and profile
4. Whether to start Phase 9D or run a targeted 9C internal trial iteration follow-up
5. The exact handoff text for the next provider
```

## Required Handoff Rules

- Always state `lastCompletedPhase: 9E`.
- Always state `nextRecommendedPhase: 9F` unless the owner asks for a targeted 9C follow-up.
- Always list the required read files first.
- Always include the boundary that `SourceImagePackage` can reach Vision Analysis through explicit binding, but cannot become a training dataset directly and cannot directly become a template library entry.
- Always include the boundary that `UserAppTemplatePackage` is a consumption contract, not a real app, backend publication, or online release.
- Always include the boundary that the prototype consumer is read-only validation, not the real user app.
- Always include the boundary that the Phase 7A/7B/7C/7D/7E/7F/7G/7H shell, readiness gate, and browser/mobile QA harness are local contract-driven prototype behavior, not a production app or production release approval.
- Always include the boundary that Phase 7C photo intake is placeholder-only and does not collect, upload, analyze, store, export, or train on real user photos.
- Always include the boundary that Phase 7D preferences are local-only, non-sensitive, display-hint-only, not backend/cloud synced, not training input, and cannot mutate `UserAppTemplatePackage`.
- Always include the boundary that Phase 7E recommendations are local-only, rule-based, deterministic placeholders, not real AI recommendation, not backend/cloud synced, not training input, and cannot mutate `UserAppTemplatePackage`.
- Always include the boundary that Phase 7F session persistence is local-only, not account/backend/cloud storage, not training input, and cannot persist photos, object URLs, local paths, image bytes, base64 images, biometrics, sensitive profile fields, React state, or recommendation result records.
- Always include the boundary that Phase 7G readiness/mobile QA is local deterministic product QA only, not real device QA, native iOS QA, backend readiness, camera readiness, AR readiness, training readiness, or app store release approval.
- Always include the boundary that Phase 7H browser/mobile QA is local deterministic prototype QA only, not production release approval, real device lab QA, Playwright pointer/canvas/screenshot QA, native iOS QA, backend readiness, camera readiness, AR readiness, training readiness, or app store release approval.
- Always include the boundary that Phase 8A selected React Web / PWA MVP first only, not production app implementation, repository bootstrap, backend, analytics, camera, AR, native iOS, React Native, Flutter, ecommerce, community, paid features, training, external API, OpenAI API, online publication, app store release work, or new dependency approval.
- Always include the boundary that Phase 8B PWA/mobile polish is local shell polish only, not production PWA release approval, and does not add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, camera, AR, native app, external API, training, or online publication scope.
- Always include the boundary that Phase 8C trial pack is local internal / small-scope trial planning only, not production release, App Store/TestFlight, backend form, analytics, real user record collection, camera, AR, training, or online publication scope.
- Always include the boundary that Phase 8D template content QA is local trial content preparation only, not production release, App Store/TestFlight, backend, analytics, AI generation, OpenAI/external API usage, real user record collection, camera, AR, training, or online publication scope.
- Always include the boundary that Phase 8E MVP release readiness and trial go/no-go are local gate decisions for internal trial preparation only, not production release, App Store/TestFlight, backend readiness, analytics readiness, camera readiness, AR readiness, AI generation approval, OpenAI/external API approval, training readiness, online publication, or real user data collection approval.
- Always include the boundary that Phase 9A internal trial operations, observation templates, and outcome review are local administrator preparation only, not public recruitment, production release, App Store/TestFlight, backend forms, analytics, real user record collection, camera, AR, AI analysis, OpenAI/external API usage, training, or online publication scope.
- Always include the boundary that Phase 9B internal trial result review, issue taxonomy, and decision framework are local administrator review aids only, not production analytics, public recruitment, backend record collection, AI analysis, OpenAI/external API usage, training, production release, or real user record collection scope.
- Always include the boundary that Phase 9C internal trial iteration plan; Phase 9D internal trial learning decision gate, backlog, and priority framework are local administrator planning aids only, not a formal production roadmap, backend issue tracker, production analytics, public recruitment, AI analysis, OpenAI/external API usage, training, production release, or real user record collection scope.
- Always include the validation commands that were run.
- Always state that project-state and docs/status were updated after the work.
- Always include `project-state/skills.json` or the relevant skill docs when switching providers.
- Always include an `AGENTS.md` summary when switching providers.
- Always include `project-state/external-skills-registry.json` or a relevant external skill summary if an external skill is referenced.
- Always prefer compact context and repository document references over copied chat history.


- Phase 9D completed internal trial learning summary, product decision gate, next phase recommendation, fixtures, and administrator decision panels.
- Phase 9D is not production analytics, production app approval, backend collection, AI analysis, training, public recruitment, or production release approval.
- Phase 9E should create an internal trial evidence pack using privacy-safe anonymous/mock/example summaries only.
