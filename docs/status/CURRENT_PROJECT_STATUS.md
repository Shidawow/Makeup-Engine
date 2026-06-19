# Current Project Status

## Current Phase

Phase 10I: UserAppTemplatePackage Registry Preparation is complete.

Last completed business phase: Phase 10I.

Next recommended phase: Phase 10J, UserAppTemplatePackage Registry Write Gate.

Phase 10I prepares a local administrator-only registry entry preview from the
Phase 10H draft publish gate, validates draft-only / publish-blocked /
registry-write-blocked boundaries, and hands it off to a future registry write
gate. The preparation is still not a registry write, publication, production
package creation, User App Shell package replacement, backend service, or
production app readiness marker.

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
- Evaluate a Phase 10E draft preview with an Official User App Package Draft
  Gate that checks source validation readiness, user-facing copy, step guidance,
  region guidance, tools, privacy notice, raw image boundaries, personal data
  boundaries, medical/product/final claims, registry write, publish, formal
  package mutation, trace preservation, and JSON round-trip stability.
- Generate gate handoff next actions for the future official draft builder, copy
  revision, step revision, region revision, privacy review, preview-only
  retention, or blocked official draft creation.
- Build Phase 10G official `UserAppTemplatePackage` draft-only objects, validate
  draft-only and publish-blocked flags, and hand them off to a draft publish
  gate.
- Evaluate Phase 10H draft publish gate readiness for future registry
  preparation while preserving no-publish, no-registry-write, no-production
  package, and no User App Shell package replacement boundaries.
- Prepare Phase 10I registry entry previews with package id/version candidates,
  safety flags, trace preservation, validation, and handoff for a future
  registry write gate while still blocking actual writes.
- Render compact Template Studio workflow, candidate package, candidate-to-app,
  user app package draft preview, official draft gate, and official draft
  builder, draft publish gate, and registry preparation panels in the Template
  Workbench.
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
- It cannot treat Official User App Package Draft Gate readiness as automatic
  production package generation, registry write, publication, production
  readiness, or automatic app package builder execution.
- It cannot treat Phase 10G official `UserAppTemplatePackage` draft builder
  output as publication, registry write, production readiness, or a replacement
  for the current User App Shell package.
- It cannot treat Phase 10H draft publish gate readiness as publication,
  registry write execution, production readiness, or a replacement for the
  current User App Shell package.
- It cannot treat Phase 10I registry preparation, validation, or handoff as a
  registry write, publication, production readiness, or replacement for the
  current User App Shell package.
- It cannot generate or mutate `UserAppTemplatePackage` from FaceMesh QA,
  candidates, generated steps, draft QA, human review, candidate handoff,
  candidate package handoff, app contract preparation, draft preview, validation,
  gate, official draft, publish gate, validation, or handoff.
- It cannot collect, upload, store, or train on real user photos through the
  User App Shell.
- It cannot request camera permissions or call browser camera APIs.
- It cannot add backend, database, accounts, analytics, AR, OpenAI API,
  external AI/CV APIs, service worker, native app scope, or new runtime
  dependencies in Phase 10I.
- It cannot commit local MediaPipe `.task` or `.wasm` files from
  `public/mediapipe/**`.
- It cannot modify legacy `src/engine`, `src/runtime`, or
  `src/intelligence/runtime` for new mainline work.

## Core Module Status

- `src/vision`: active local vision, FaceMesh runtime, FaceMesh region QA,
  segmentation, pixel analysis, and pipeline logic.
- `src/template-engine`: active local template production plus Phase 10B draft
  QA/human review, Phase 10C candidate package validation/handoff, Phase 10D
  candidate-to-app contract preparation, Phase 10E user app package draft
  preview validation/handoff, Phase 10F official draft gate/handoff, Phase 10G
  official draft builder, Phase 10H draft publish gate, and Phase 10I registry
  preparation.
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

Phase 10I validation must include:

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

Proceed to Phase 10J: UserAppTemplatePackage Registry Write Gate.

Phase 10J may add an explicit write gate over the Phase 10I registry
preparation output, still without automatic publication, backend work, online
release, production readiness, or current User App Shell package replacement.
