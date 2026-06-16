# Current Project Status

## Current Phase

Phase 10B: Template Draft Review Workflow is complete.

Last completed business phase: Phase 10B.

Next recommended phase: Phase 10C, Template Library Candidate Packaging.

Phase 10B turns the Phase 10A FaceMesh-driven draft baseline into a clearer
administrator workflow: Vision Analysis owns image understanding and region
quality; Template Workbench owns candidates, draft steps, template draft QA,
human review, and candidate handoff.

## What The System Can Do

- Run real local MediaPipe FaceMesh when ignored local assets under
  `public/mediapipe/**` are present.
- Evaluate FaceMesh region QA and show whether the operator can enter Template
  Workbench.
- Generate deterministic makeup attribute candidates, rule-based step drafts,
  and draft-only template data.
- Run `TemplateDraftQaResult` checks before human review.
- Run a local human review checklist and decision model.
- Queue template drafts as revision, rejected, blocked, example-only, or
  approved-as-template-library-candidate.
- Render a compact Template Studio workflow stepper, next-action card,
  blocked-reason card, and collapsible details.
- Keep ordinary User App Shell paths separate from administrator-only vision,
  draft QA, and human review terminology.

## What The System Cannot Do

- It cannot act as the production end-user makeup coaching app.
- It cannot treat FaceMesh candidates, generated steps, or template drafts as
  final makeup recognition.
- It cannot publish drafts automatically.
- It cannot generate or mutate `UserAppTemplatePackage` from FaceMesh QA,
  candidates, generated steps, draft QA, human review, or candidate handoff.
- It cannot collect, upload, store, or train on real user photos through the
  User App Shell.
- It cannot request camera permissions or call browser camera APIs.
- It cannot add backend, database, accounts, analytics, AR, OpenAI API,
  external AI/CV APIs, service worker, native app scope, or new runtime
  dependencies in Phase 10B.
- It cannot commit local MediaPipe `.task` or `.wasm` files from
  `public/mediapipe/**`.
- It cannot modify legacy `src/engine`, `src/runtime`, or
  `src/intelligence/runtime` for new mainline work.

## Core Module Status

- `src/vision`: active local vision, FaceMesh runtime, FaceMesh region QA,
  segmentation, pixel analysis, and pipeline logic.
- `src/template-engine`: active local template production plus Phase 10B draft
  QA, human review, review workflow, and Template Studio workflow state.
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

Phase 10B validation must include:

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

Proceed to Phase 10C: Template Library Candidate Packaging.

Phase 10C should package approved template library candidates without turning
them into published templates or automatic `UserAppTemplatePackage` exports.
