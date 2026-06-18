# Current Project Status

## Current Phase

Phase 10E: User App Package Draft Preview is complete.

Last completed business phase: Phase 10E.

Next recommended phase: Phase 10F, Official User App Package Draft Gate.

Phase 10E turns Phase 10D candidate-to-app contract preparation into a local
administrator-only user app package draft preview with validation and handoff,
while keeping it separate from formal `UserAppTemplatePackage` generation,
registry writes, publication, backend services, and production app readiness.

## What The System Can Do

- Run real local MediaPipe FaceMesh when ignored local assets under
  `public/mediapipe/**` are present.
- Evaluate FaceMesh region QA and show whether the operator can enter Template
  Workbench.
- Generate deterministic makeup attribute candidates, rule-based step drafts,
  and draft-only template data.
- Run draft QA, human review, review workflow, and candidate handoff.
- Package approved candidates into local candidate packages with QA trace,
  human review trace, privacy trace, reviewed steps, tools, and placeholders.
- Validate candidate packages and hand off approved candidate packages without
  publishing or writing the formal Template Library automatically.
- Prepare candidate-to-app mapping previews for future app-facing fields.
- Validate app contract preparation for source readiness, required mappings,
  raw image boundaries, personal data boundaries, no automatic publish, no
  `UserAppTemplatePackage` mutation, trace preservation, and JSON round-trip
  stability.
- Generate a local User App Package Draft Preview with title, summary, style
  tags, difficulty, estimated time, scenarios, tools, product placeholders,
  step guidance, region guidance, privacy copy, QA trace, human review trace,
  candidate trace, and contract trace.
- Validate the draft preview for user-facing copy, step comprehensibility,
  region safety, tools/products, privacy copy, no raw image references, no
  personal data, no medical/product shade/final claims, no auto-publish, no
  registry write, no formal package mutation, and JSON round-trip stability.
- Generate preview handoff next actions for 10F official draft gate readiness,
  copy revision, step revision, region revision, privacy revision, admin-preview
  retention, or blocked app package creation.
- Render compact Template Studio workflow, candidate package, candidate-to-app,
  and user app package draft preview panels in the Template Workbench.
- Keep Vision Analysis focused on FaceMesh, overlay/mask, region QA, and
  readiness; keep ordinary User App Shell paths separate from administrator-only
  vision, draft QA, human review, package preview, and registry terminology.

## What The System Cannot Do

- It cannot act as the production end-user makeup coaching app.
- It cannot treat FaceMesh candidates, generated steps, template drafts,
  candidate packages, contract preparations, or draft previews as final makeup
  recognition.
- It cannot publish drafts automatically.
- It cannot treat candidate packages as published templates.
- It cannot write candidate packages into the formal Template Library
  automatically.
- It cannot treat candidate-to-app contract preparation as formal
  `UserAppTemplatePackage` generation or a user app package registry write.
- It cannot treat User App Package Draft Preview as formal
  `UserAppTemplatePackage` generation, official package readiness, publication,
  production readiness, or registry write.
- It cannot generate or mutate `UserAppTemplatePackage` from FaceMesh QA,
  candidates, generated steps, draft QA, human review, candidate handoff,
  candidate package handoff, app contract preparation, draft preview, validation,
  or handoff.
- It cannot collect, upload, store, or train on real user photos through the
  User App Shell.
- It cannot request camera permissions or call browser camera APIs.
- It cannot add backend, database, accounts, analytics, AR, OpenAI API,
  external AI/CV APIs, service worker, native app scope, or new runtime
  dependencies in Phase 10E.
- It cannot commit local MediaPipe `.task` or `.wasm` files from
  `public/mediapipe/**`.
- It cannot modify legacy `src/engine`, `src/runtime`, or
  `src/intelligence/runtime` for new mainline work.

## Core Module Status

- `src/vision`: active local vision, FaceMesh runtime, FaceMesh region QA,
  segmentation, pixel analysis, and pipeline logic.
- `src/template-engine`: active local template production plus Phase 10B draft
  QA/human review, Phase 10C candidate package validation/handoff, Phase 10D
  candidate-to-app contract preparation, and Phase 10E user app package draft
  preview validation/handoff.
- `src/components/template-studio`: active operator UI with compact Vision
  Analysis to Template Workbench workflow surfaces.
- `src/components/demo`: Vision Analysis demo with readiness summary and
  MediaPipe fallback/recovery messaging.
- `src/templates/examples`: active deterministic examples and fixtures.
- `src/user-app` and `src/components/user-app`: active local shell and admin
  trial readiness panels; still not production app code.
- `docs`, `project-state`, and `tests`: active recovery, architecture,
  validation, provider handoff, and regression coverage.
- `src/engine`, `src/runtime`, and `src/intelligence/runtime`: legacy frozen
  areas.

## Recent Validation

Phase 10E validation must include:

```bash
npm run mediapipe:check
npm run typecheck
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

The latest completed validation is recorded in `project-state/test-status.json`.

## Next Phase Recommendation

Proceed to Phase 10F: Official User App Package Draft Gate.

Phase 10F should decide whether a validated 10E draft preview can enter an
official user app package draft gate, still without production publication,
registry writes, backend work, or automatic `UserAppTemplatePackage` mutation.
