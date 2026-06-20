# Start Here

Makeup Engine is the makeup template production system for a future makeup coaching app. It is not the production user-facing app, not a backend service, and not an online publishing system.

## Current Position

- Project role: makeup template production system plus a local contract-driven user app shell prototype.
- Last completed phase: `Phase 10P`.
- Current completed business phase: `Phase 10P - Final Real Write Review Gate`.
- Next recommended phase: `Phase 10Q - Real Write Execution Authorization`.
- Recent recovery milestones retained in phase docs: `Phase 6K`, `Phase 6L`, `Phase 6L-1`, `Phase 7A`, `Phase 7B`, `Phase 7C`, `Phase 7D`, `Phase 7E`, `Phase 7F`, `Phase 7G`, `Phase 7H`, and `Phase 8A`.
- Historical route-planning milestone: `Phase 8A - Product Route Decision / App MVP Planning`.

## Current Core Capability

```text
SourceImagePackage manifest
-> SourceImageEntry
-> operator explicitly binds normalized PNG / json-rgba artifact
-> BrowserArtifactResource
-> TemplateAnalysisSeed ready_for_vision_analysis
-> Vision Analysis
-> Mask Editing
-> Human Correction
-> Template Evidence
-> Template Review
-> Template Library Entry
-> Publish Package
-> UserAppTemplatePackage
-> Prototype Contract Consumer
-> User App MVP Shell
-> Step Guidance UX Hardening
-> User Photo Intake Placeholder / Personalization Boundary
-> User App Local Preferences / Onboarding
-> User App Template Discovery / Recommendation Placeholder
-> User App Session Persistence / Local State Hardening
-> User App Mobile QA / App Readiness Gate
-> Browser / Mobile QA Harness
-> Product Route Decision / App MVP Plan
-> PWA / Mobile Web MVP Polish
-> User App MVP Trial Pack
-> Template Content QA for Real User Trial
-> MVP Release Readiness Gate
-> Internal Trial Operations Pack
-> Internal Trial Result Review Framework
-> Internal Trial Iteration Plan
-> Internal Trial Learning Summary & Product Decision Gate
-> Internal Trial Evidence Pack
-> Internal Trial Evidence Collection Preparation
-> Anonymous Internal Trial Dry Run Pack
-> Anonymous Internal Trial Launch Pack
-> Anonymous Internal Trial Evidence Review
-> Anonymous Internal Trial Follow-up Iteration
-> FaceMesh-driven Makeup Intelligence Baseline
-> Template Draft Review Workflow
-> Template Library Candidate Packaging
-> Candidate-to-App Package Contract Preparation
-> User App Package Draft Preview
-> Official User App Package Draft Gate
-> Official UserAppTemplatePackage Draft Builder
-> UserAppTemplatePackage Draft Publish Gate
-> UserAppTemplatePackage Registry Preparation
-> UserAppTemplatePackage Registry Write Gate
-> Controlled UserAppTemplatePackage Registry Writer Draft
-> Explicit Registry Write Authorization Gate
-> Controlled Registry Write Execution Design
-> Real Registry Write Implementation Gate
-> Real Registry Write Implementation Draft
-> Final Real Write Review Gate
-> Phase 8 Roadmap / V1 Non-Goals
-> Consumption Manifest
-> Dataset Review
-> Materialized Training Dataset
```

`SourceImagePackage` can enter Vision Analysis only through explicit operator artifact binding. It still cannot become a training dataset directly, and it still cannot skip review, package validation, app contract validation, or quality gates to become a library entry, publish package, user app contract, shell state, or QA state.

## Must Read First

1. `docs/status/CURRENT_PROJECT_STATUS.md`
2. `docs/status/NEXT_ACTION.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
5. `docs/app-roadmap/app-technology-route-decision.md`
6. `docs/app-roadmap/user-app-mvp-plan.md`
7. `docs/app-roadmap/makeup-engine-vs-user-app-boundary.md`
8. `docs/app-roadmap/phase-8-roadmap.md`
9. `docs/product/user-app-v1-non-goals.md`
10. `docs/user-app/user-app-product-route.md`
11. `docs/user-app/user-app-browser-mobile-qa.md`
12. `docs/user-app/user-app-e2e-readiness.md`
13. `docs/user-app/user-app-mobile-interaction-qa.md`
14. `docs/user-app/user-app-readiness-gate.md`
15. `docs/user-app/user-app-readiness-checklist.md`
16. `docs/privacy/user-app-session-data-boundary.md`
17. `docs/phases/phase-8A.md`
18. `docs/phases/phase-8B.md`
19. `docs/user-app/pwa-mobile-web-mvp-polish.md`
20. `docs/user-app/pwa-install-readiness.md`
21. `docs/user-app/user-app-mvp-trial-pack.md`
22. `docs/user-app/user-app-trial-feedback.md`
23. `docs/user-app/user-app-trial-readiness.md`
24. `docs/phases/phase-8C.md`
25. `docs/user-app/template-content-qa-for-trial.md`
26. `docs/user-app/trial-template-selection.md`
27. `docs/user-app/trial-content-readiness.md`
28. `docs/product/template-content-qa-checklist.md`
29. `docs/phases/phase-8D.md`
30. `docs/user-app/mvp-release-readiness-gate.md`
31. `docs/user-app/trial-go-no-go-decision.md`
32. `docs/product/internal-trial-launch-checklist.md`
33. `docs/phases/phase-8E.md`
34. `docs/product/internal-trial-operations-pack.md`
35. `docs/product/internal-trial-participant-guide.md`
36. `docs/product/internal-trial-observation-template.md`
37. `docs/product/internal-trial-outcome-review.md`
38. `docs/product/internal-trial-result-review-framework.md`
39. `docs/product/internal-trial-issue-taxonomy.md`
40. `docs/product/internal-trial-decision-framework.md`
41. `docs/product/internal-trial-iteration-plan.md`
42. `docs/product/internal-trial-iteration-backlog.md`
43. `docs/product/internal-trial-priority-framework.md`
44. `docs/phases/phase-9A.md`
45. `docs/phases/phase-9B.md`
46. `docs/phases/phase-9C.md`
47. `docs/product/internal-trial-learning-summary.md`
48. `docs/product/product-decision-gate.md`
49. `docs/product/next-phase-recommendation-framework.md`
50. `docs/phases/phase-9D.md`
51. `docs/product/internal-trial-evidence-pack.md`
52. `docs/product/trial-evidence-summary.md`
53. `docs/product/evidence-sufficiency-gate.md`
54. `docs/phases/phase-9E.md`
55. `docs/product/internal-trial-evidence-collection-protocol.md`
56. `docs/product/internal-trial-evidence-collection-checklist.md`
57. `docs/product/internal-trial-evidence-quality-gate.md`
58. `docs/phases/phase-9F.md`
59. `docs/product/anonymous-internal-trial-dry-run-pack.md`
60. `docs/product/anonymous-internal-trial-dry-run-checklist.md`
61. `docs/product/anonymous-internal-trial-dry-run-review.md`
62. `docs/phases/phase-9G.md`
63. `docs/product/anonymous-internal-trial-launch-pack.md`
64. `docs/product/anonymous-internal-trial-launch-readiness.md`
65. `docs/product/anonymous-internal-trial-post-launch-handoff.md`
66. `docs/phases/phase-9H.md`
67. `docs/product/anonymous-internal-trial-evidence-review.md`
68. `docs/product/anonymous-internal-trial-evidence-gap-review.md`
69. `docs/product/anonymous-internal-trial-decision-input.md`
70. `docs/phases/phase-9I.md`
71. `docs/product/anonymous-internal-trial-follow-up-iteration.md`
72. `docs/product/anonymous-internal-trial-gap-action-plan.md`
73. `docs/product/anonymous-internal-trial-follow-up-readiness.md`
74. `docs/phases/phase-9J.md`
75. `docs/product/facemesh-region-qa-baseline.md`
76. `docs/product/makeup-attribute-candidate-baseline.md`
77. `docs/product/rule-based-template-draft-baseline.md`
78. `docs/phases/phase-10A.md`
79. `docs/product/template-draft-qa.md`
80. `docs/product/template-draft-human-review-workflow.md`
81. `docs/product/template-draft-review-workflow.md`
82. `docs/phases/phase-10B.md`
83. `docs/product/template-library-candidate-package.md`
84. `docs/product/template-library-candidate-validation.md`
85. `docs/product/template-library-candidate-handoff.md`
86. `docs/phases/phase-10C.md`
87. `docs/product/candidate-to-app-package-contract-preparation.md`
88. `docs/product/candidate-to-app-package-validation.md`
89. `docs/product/candidate-to-app-package-handoff.md`
90. `docs/phases/phase-10D.md`
91. `docs/product/user-app-package-draft-preview.md`
92. `docs/product/user-app-package-draft-preview-validation.md`
93. `docs/product/user-app-package-draft-preview-handoff.md`
94. `docs/phases/phase-10E.md`
95. `docs/product/official-user-app-package-draft-gate.md`
96. `docs/product/official-user-app-package-draft-gate-handoff.md`
97. `docs/phases/phase-10F.md`
98. `docs/product/official-user-app-template-package-draft-builder.md`
99. `docs/product/official-user-app-template-package-draft-validation.md`
100. `docs/product/official-user-app-template-package-draft-handoff.md`
101. `docs/phases/phase-10G.md`
102. `docs/product/user-app-template-package-draft-publish-gate.md`
103. `docs/product/user-app-template-package-draft-publish-gate-handoff.md`
104. `docs/phases/phase-10H.md`
105. `docs/product/user-app-template-package-registry-preparation.md`
106. `docs/product/user-app-template-package-registry-preparation-validation.md`
107. `docs/product/user-app-template-package-registry-preparation-handoff.md`
108. `docs/product/user-app-template-package-registry-write-gate.md`
109. `docs/product/user-app-template-package-registry-write-gate-handoff.md`
110. `docs/phases/phase-10J.md`
111. `docs/product/controlled-user-app-template-package-registry-writer-draft.md`
112. `docs/product/controlled-user-app-template-package-registry-writer-validation.md`
113. `docs/product/controlled-user-app-template-package-registry-writer-handoff.md`
114. `docs/phases/phase-10K.md`
115. `docs/product/explicit-registry-write-authorization-gate.md`
116. `docs/product/explicit-registry-write-authorization-checklist.md`
117. `docs/product/explicit-registry-write-authorization-handoff.md`
118. `docs/phases/phase-10L.md`
119. `docs/product/controlled-registry-write-execution-design.md`
120. `docs/product/controlled-registry-write-execution-validation.md`
121. `docs/product/controlled-registry-write-execution-handoff.md`
122. `docs/phases/phase-10M.md`
123. `docs/product/real-registry-write-implementation-gate.md`
124. `docs/product/real-registry-write-implementation-checklist.md`
125. `docs/product/real-registry-write-implementation-handoff.md`
126. `docs/phases/phase-10N.md`
127. `docs/product/real-registry-write-implementation-draft.md`
128. `docs/product/real-registry-write-implementation-draft-validation.md`
129. `docs/product/real-registry-write-implementation-draft-handoff.md`
130. `docs/phases/phase-10O.md`
131. `docs/product/final-real-write-review-gate.md`
132. `docs/product/final-real-write-review-checklist.md`
133. `docs/product/final-real-write-review-handoff.md`
134. `docs/phases/phase-10P.md`
135. `docs/phases/phase-7H.md`
136. `project-state/project-state.snapshot.json`
137. `project-state/provider-handoff.json`
138. `project-state/latest-handoff.json`
139. `project-state/active-task.json`

## What The System Can Do Now

- Produce and review template production artifacts through the local Makeup Engine pipeline.
- Export local publish packages and `UserAppTemplatePackage` contract data.
- Render a local User App MVP Shell from `UserAppTemplatePackage`.
- Show Chinese-facing user shell copy for template guidance, discovery, readiness, mobile QA, interaction checklist, local state, preferences, personalization placeholder, and privacy notice.
- Store and recover local-only shell session state after sanitization.
- Generate readiness reports for package validity, guidance, onboarding, preferences, discovery, session, privacy, mobile interaction, empty state, and blocked state.
- Generate mobile QA reports for `375`, `390`, `414`, and `768` width viewport profiles.
- Run local browser/mobile QA through `npm run user-app:browser-qa`, including HTTP smoke, critical copy, privacy copy, Chinese copy, and forbidden-token checks.
- Use the Phase 8A route decision to plan a future React Web / PWA user app MVP as a mobile-first surface that consumes `UserAppTemplatePackage`.
- Render Phase 8B mobile-first shell polish with a clearer Chinese user path, separated administrator QA surfaces, PWA readiness, and MVP polish readiness.
- Render Phase 8C MVP trial pack, feedback form preview, and trial readiness administrator panels for internal / small-scope trial planning.
- Render Phase 8D template content QA, trial template selection, and trial content readiness administrator panels for real user trial preparation.
- Render Phase 8E MVP release readiness and trial go/no-go administrator panels for deciding internal trial preparation.
- Render Phase 9A internal trial operations, observation template, and outcome review administrator panels for internal small-scope trial preparation.
- Render Phase 9B internal trial result review, issue taxonomy, and decision framework administrator panels for anonymous/mock local trial result review.
- Render Phase 9C internal trial iteration plan, backlog, and priority administrator panels for anonymous/mock local next-iteration planning.
- Render Phase 9D internal trial learning summary, product decision gate, and next phase recommendation administrator panels for anonymous/mock local product decision gating.
- Render Phase 9E internal trial evidence pack, trial evidence summary, and evidence sufficiency gate administrator panels for anonymous/mock local evidence review.
- Render Phase 9F internal trial evidence collection protocol, checklist, and quality gate administrator panels for anonymous/local dry run preparation.
- Render Phase 9G anonymous internal trial dry run pack, checklist, and review administrator panels for local rehearsal before anonymous internal trial launch.
- Render Phase 9H anonymous internal trial launch pack, launch readiness, and post-launch handoff administrator panels for anonymous local internal launch preparation.
- Render Phase 9I anonymous internal trial evidence review, evidence gap review, and decision input administrator panels for anonymous local post-trial review.
- Render Phase 9J anonymous internal trial follow-up iteration, gap action plan, and follow-up readiness administrator panels for conservative next-iteration planning.
- Run real local MediaPipe FaceMesh in Template Studio when ignored local
  `public/mediapipe/**` assets are present, then generate FaceMesh region QA,
  makeup attribute candidates, rule-based draft steps, and a draft-only template
  for human review.
- Run Phase 10B template draft QA and human review workflow, with Vision
  Analysis owning image/region quality and Template Workbench owning candidates,
  step drafts, template draft QA, human review, and candidate handoff.
- Package Phase 10B approved drafts into local Template Library Candidate
  Packages with validation and handoff, while keeping them separate from
  published templates, formal Template Library writes, and
  `UserAppTemplatePackage` generation.
- Prepare Phase 10C candidate packages for a future app-facing package draft
  through local candidate-to-app contract mapping previews, validation, and
  handoff while still blocking formal `UserAppTemplatePackage` generation.
- Preview Phase 10D contract preparation as Phase 10E user App package draft
  preview fields, then evaluate Phase 10F official draft gate eligibility
  without generating a formal `UserAppTemplatePackage`, writing registry data,
  or publishing.
- Build Phase 10G official `UserAppTemplatePackage` draft-only objects and
  evaluate Phase 10H draft publish gate eligibility for future registry
  preparation without publishing, writing registry data, replacing the current
  User App Shell package, or marking production readiness.
- Prepare Phase 10I UserAppTemplatePackage registry entry previews, then run
  Phase 10J registry write gate and handoff in Template Workbench while still
  blocking actual registry writes, publication, production markers, and User
  App Shell package replacement.
- Draft Phase 10K controlled UserAppTemplatePackage registry writer dry-run
  plans with write plan, diff preview, existing entry preview, rollback plan,
  validation, and handoff while still blocking actual registry writes,
  publication, production markers, and current User App Shell package
  replacement.
- Gate Phase 10M controlled execution design through Phase 10N real registry
  write implementation gate, checklist, and handoff while still remaining
  dry-run only, not a real writer implementation, not a registry write, not
  publication, not production readiness, and not a User App Shell package
  replacement.
- Draft Phase 10O real registry write implementation interface, transaction,
  write lock, audit event, rollback command, validation, and handoff while still
  remaining dry-run only, not actual registry write, not production writer, not
  publication, not production readiness, and not current User App Shell package
  replacement.
- Review Phase 10O implementation draft validation through Phase 10P final real
  write review gate, checklist, and handoff while recording owner authorization
  as review-gate-only and still blocking actual registry write, production
  writer creation, publication, production readiness, and current User App
  Shell package replacement.
- Run Phase 10L explicit registry write authorization gate checks, checklist,
  and handoff over the Phase 10K writer validation while still staying dry-run
  only and requiring separate future owner approval before any real write design.
- Continue from Vision Analysis into mask editing, evidence capture, dataset review, materialized training datasets, and lightweight model artifact workflows.
- Run real local MediaPipe FaceMesh after preparing ignored local assets with `npm run mediapipe:prepare`; see `docs/setup/local-mediapipe-assets.md`.

## What The System Must Not Do

- Do not treat the local User App Shell as the production user app.
- Do not add backend, database, accounts, cloud sync, analytics, real camera capture, AR, OpenAI/external API calls, training from user state, native iOS implementation, or online publication without a future explicit phase gate.
- Do not collect, upload, analyze, store, export, or train on real user photos.
- Do not persist object URLs, local absolute paths, image bytes, base64 image data, biometrics, sensitive profile data, React state, recommendation records, readiness records, browser QA records, or training input in durable exports or `project-state`.
- Do not let preferences, recommendations, session recovery, readiness, mobile QA, or browser QA mutate `UserAppTemplatePackage`.
- Do not route new mainline work through `src/engine`, `src/runtime`, or `src/intelligence/runtime`.
- Do not treat the Phase 8A React Web / PWA route decision as permission to build the production user app inside Makeup Engine.
- Do not treat Phase 10A candidates, draft steps, or template draft as final
  makeup recognition, automatic publishing, training input, UserAppTemplatePackage
  mutation, production app behavior, or a replacement for human review.
- Do not treat Phase 10C candidate packages as published templates, formal
  Template Library entries, UserAppTemplatePackage exports, backend records, or
  training input.
- Do not treat Phase 10D candidate-to-app contract preparation as a formal
  `UserAppTemplatePackage`, app package registry write, user app publication, or
  production app readiness approval.
- Do not treat Phase 10E draft preview or Phase 10F official draft gate as a
  formal `UserAppTemplatePackage`, registry write, user app publication,
  production readiness approval, or automatic app package builder.
- Do not treat Phase 10G official draft builder output, Phase 10H draft publish
  gate readiness, Phase 10I registry preparation, or Phase 10J registry write
  gate readiness as publication, actual user app package registry write,
  production readiness, or current User App Shell package replacement.
- Do not treat Phase 10K controlled registry writer draft readiness as
  permission to execute a registry write, publish, create a production package,
  or replace the current User App Shell package.
- Do not treat Phase 10L explicit authorization gate readiness as actual write
  authorization, registry write execution, publication, production readiness, or
  current User App Shell package replacement.
- Do not treat Phase 10O implementation draft readiness as actual registry
  write, production writer readiness, publication, production readiness, or
  current User App Shell package replacement.
- Do not treat Phase 10P final real write review gate readiness as actual
  registry write authorization, registry write execution, production writer
  readiness, publication, production readiness, or current User App Shell
  package replacement.
- Do not treat Phase 8B PWA metadata, mobile shell polish, PWA readiness, or MVP polish readiness as production PWA release approval.
- Do not treat Phase 8C trial pack, feedback preview, or trial readiness as production release, backend form, analytics, App Store/TestFlight, or real user data collection approval.
- Do not treat Phase 8D content QA, trial template selection, or trial content readiness as production release, App Store/TestFlight, backend, AI generation, camera, AR, analytics, or training approval.
- Do not treat Phase 8E release readiness or go/no-go as production release, App Store/TestFlight, backend readiness, camera readiness, AR readiness, analytics readiness, or training approval.
- Do not treat Phase 9A internal trial operations, observation templates, or outcome review as public recruitment, production release, backend form, analytics, App Store/TestFlight, or real user data collection approval.
- Do not treat Phase 9B result review, issue taxonomy, or decision framework as production analytics, backend record collection, AI analysis, training, public recruitment, or production release approval.
- Do not treat Phase 9C iteration plan, backlog, or priority framework as a formal production roadmap, backend issue tracker, AI analysis, training, public recruitment, or production release approval.
- Do not treat Phase 9J follow-up iteration, gap action plan, or readiness as production roadmap approval, public recruitment, production analytics, backend collection, AI analysis, training, MVP validation approval, production app approval, or production release approval.
- Do not treat Phase 9D learning summary, product decision gate, or next phase recommendation as production analytics, production app approval, backend record collection, AI analysis, training, public recruitment, production roadmap approval, or production release approval.
- Do not treat Phase 9E evidence pack, evidence summary, or sufficiency gate as production analytics, backend evidence collection, AI analysis, training, public recruitment, production app approval, or production release approval.
- Do not treat Phase 9F evidence collection preparation as real data collection, backend evidence storage, AI analysis, training, public recruitment, MVP validation approval, or production release approval.
- Do not treat Phase 9G anonymous internal trial dry run as real trial launch, backend evidence collection, AI analysis, training, public recruitment, MVP validation approval, production app approval, or production release approval.
- Do not treat Phase 9H anonymous internal trial launch pack as public recruitment, production app launch, backend evidence collection, production analytics, AI analysis, training, MVP validation approval, production app approval, or production release approval.
- Do not treat Phase 9I anonymous internal trial evidence review as production analytics, backend evidence collection, AI analysis, training, public recruitment, production app approval, production release approval, or automatic MVP validation approval.
- Do not start React Native, Flutter, iOS native, backend, database, camera, AR, ecommerce, community, paid, OpenAI API, external API, training, or production release work without a later explicit gate.

## Validation Commands

Run these whenever you restore or update project state:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

For Phase 7H browser/mobile QA also run when browser/runtime smoke is in scope:

```bash
npm run user-app:browser-qa -- --json
```

For Phase 8B scoped polish checks run:

```bash
npm run test -- tests/user-app-pwa-readiness.test.ts tests/user-app-mvp-polish.test.ts tests/user-app-pwa-install-panel.test.tsx tests/user-app-mobile-home.test.tsx tests/user-app-mvp-polish-checklist.test.tsx tests/user-app-shell-pwa-polish-flow.test.tsx tests/phase-8B-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 8C scoped trial pack checks run:

```bash
npm run test -- tests/user-app-trial-pack.test.ts tests/user-app-trial-feedback.test.ts tests/user-app-trial-readiness.test.ts tests/user-app-trial-pack-panel.test.tsx tests/user-app-trial-feedback-panel.test.tsx tests/user-app-trial-readiness-panel.test.tsx tests/user-app-shell-trial-pack-flow.test.tsx tests/phase-8C-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 8D scoped template content QA checks run:

```bash
npm run test -- tests/user-app-template-content-qa.test.ts tests/user-app-trial-template-selection.test.ts tests/user-app-trial-content-readiness.test.ts tests/user-app-template-content-qa-panel.test.tsx tests/user-app-trial-template-readiness-panel.test.tsx tests/user-app-shell-template-content-qa-flow.test.tsx tests/phase-8D-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 8E scoped release readiness checks run:

```bash
npm run test -- tests/user-app-mvp-release-readiness.test.ts tests/user-app-trial-go-no-go.test.ts tests/user-app-mvp-release-readiness-panel.test.tsx tests/user-app-trial-go-no-go-panel.test.tsx tests/user-app-shell-release-readiness-flow.test.tsx tests/phase-8E-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 9A scoped internal trial operations checks run:

```bash
npm run test -- tests/user-app-internal-trial-ops.test.ts tests/user-app-trial-observation.test.ts tests/user-app-trial-outcome.test.ts tests/user-app-internal-trial-ops-panel.test.tsx tests/user-app-trial-observation-panel.test.tsx tests/user-app-trial-outcome-panel.test.tsx tests/user-app-shell-internal-trial-flow.test.tsx tests/phase-9A-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 9B scoped internal trial result review checks run:

```bash
npm run test -- tests/user-app-trial-result-review.test.ts tests/user-app-trial-issue-taxonomy.test.ts tests/user-app-trial-decision-framework.test.ts tests/user-app-trial-result-review-panel.test.tsx tests/user-app-trial-issue-summary-panel.test.tsx tests/user-app-trial-decision-framework-panel.test.tsx tests/user-app-shell-trial-result-review-flow.test.tsx tests/phase-9B-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 9C scoped internal trial iteration checks run:

```bash
npm run test -- tests/user-app-trial-iteration-plan.test.ts tests/user-app-trial-iteration-backlog.test.ts tests/user-app-trial-iteration-priority.test.ts tests/user-app-trial-iteration-plan-panel.test.tsx tests/user-app-trial-iteration-backlog-panel.test.tsx tests/user-app-trial-iteration-priority-panel.test.tsx tests/user-app-shell-trial-iteration-flow.test.tsx tests/phase-9C-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 9D scoped internal trial learning decision checks run:

```bash
npm run test -- tests/user-app-internal-trial-learning-summary.test.ts tests/user-app-product-decision-gate.test.ts tests/user-app-next-phase-recommendation.test.ts tests/user-app-internal-trial-learning-summary-panel.test.tsx tests/user-app-product-decision-gate-panel.test.tsx tests/user-app-next-phase-recommendation-panel.test.tsx tests/user-app-shell-learning-decision-flow.test.tsx tests/phase-9D-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

## Source Of Truth

Project state comes from repository documents and `project-state/*.json`, not from chat memory.

Root `AGENTS.md` is the concise agent entry point. Project skills are indexed in `project-state/skills.json`; external skill candidates and approvals are indexed in `project-state/external-skills-registry.json`.

For Phase 9E scoped evidence pack checks run:

```bash
npm run test -- tests/user-app-internal-trial-evidence-pack.test.ts tests/user-app-trial-evidence-summary.test.ts tests/user-app-evidence-sufficiency-gate.test.ts tests/user-app-internal-trial-evidence-pack-panel.test.tsx tests/user-app-trial-evidence-summary-panel.test.tsx tests/user-app-evidence-sufficiency-gate-panel.test.tsx tests/user-app-shell-evidence-pack-flow.test.tsx tests/phase-9E-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 9F scoped evidence collection preparation checks run:

```bash
npm run test -- tests/user-app-evidence-collection-protocol.test.ts tests/user-app-evidence-collection-checklist.test.ts tests/user-app-evidence-collection-quality-gate.test.ts tests/user-app-evidence-collection-protocol-panel.test.tsx tests/user-app-evidence-collection-checklist-panel.test.tsx tests/user-app-evidence-collection-quality-gate-panel.test.tsx tests/user-app-shell-evidence-collection-flow.test.tsx tests/phase-9F-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

For Phase 9G scoped anonymous dry run checks run:

```bash
npm run test -- tests/user-app-anonymous-trial-dry-run-pack.test.ts tests/user-app-anonymous-trial-dry-run-checklist.test.ts tests/user-app-anonymous-trial-dry-run-review.test.ts tests/user-app-anonymous-trial-dry-run-pack-panel.test.tsx tests/user-app-anonymous-trial-dry-run-checklist-panel.test.tsx tests/user-app-anonymous-trial-dry-run-review-panel.test.tsx tests/user-app-shell-anonymous-trial-dry-run-flow.test.tsx tests/phase-9G-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```
