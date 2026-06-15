# Current Project Status

## Current Phase

Phase 10A: FaceMesh-driven Makeup Intelligence Baseline is complete.

Last completed business phase: Phase 10A.

Next recommended phase: Phase 10B, Template Draft QA & Human Review Workflow.

Phase 10A adds local FaceMesh region QA, makeup attribute candidates,
rule-based draft step generation, and draft-only template generation inside
Template Studio. Makeup Engine remains the makeup template production system,
not the production user-facing app and not a backend publication system.

## What The System Can Do

- Produce and review local template production artifacts through the Makeup
  Engine pipeline.
- Run real local MediaPipe FaceMesh when ignored local assets under
  `public/mediapipe/**` are present.
- Evaluate FaceMesh landmark coverage, confidence, normalized coordinates, and
  cropping risk through `FaceMeshRegionQaReport`.
- Generate deterministic makeup attribute candidates from local FaceMesh, pixel,
  semantic, and conservative rule-based signals.
- Generate ordered rule-based makeup step drafts.
- Generate a draft-only `MakeupTemplate` that is blocked from publishing and
  requires human review.
- Render the Template Studio FaceMesh 妆容智能基线 panel for administrator review.
- Export local publish packages and `UserAppTemplatePackage` contract data from
  the existing reviewed package workflow.
- Render the local User App MVP Shell from `UserAppTemplatePackage`.

## What The System Cannot Do

- It cannot act as the production end-user makeup coaching app.
- It cannot treat Phase 10A outputs as final makeup recognition or production
  user guidance.
- It cannot publish Phase 10A drafts automatically.
- It cannot mutate `UserAppTemplatePackage` from FaceMesh QA, attribute
  candidates, generated steps, or template drafts.
- It cannot collect, upload, store, or train on real user photos through the
  User App Shell.
- It cannot request camera permissions or call browser camera APIs.
- It cannot add backend, database, accounts, analytics, AR, OpenAI API,
  external AI/CV APIs, service worker, native app scope, or new runtime
  dependencies in Phase 10A.
- It cannot commit local MediaPipe `.task` or `.wasm` files from
  `public/mediapipe/**`.
- It cannot modify legacy `src/engine`, `src/runtime`, or
  `src/intelligence/runtime` for new mainline work.

## Core Module Status

- `src/vision`: active local vision, FaceMesh runtime, FaceMesh region QA,
  segmentation, pixel analysis, and pipeline logic.
- `src/template-engine`: active local template production plus Phase 10A
  candidate, step, and draft generation.
- `src/components/template-studio`: active operator UI including the Phase 10A
  FaceMesh makeup intelligence baseline panel.
- `src/templates/examples`: active deterministic examples and fixtures.
- `src/user-app` and `src/components/user-app`: active local shell and admin
  trial readiness panels; still not production app code.
- `docs`, `project-state`, and `tests`: active recovery, architecture,
  validation, provider handoff, and regression coverage.
- `src/engine`, `src/runtime`, and `src/intelligence/runtime`: legacy frozen
  areas.

## Recent Validation

Phase 10A validation must include:

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

Proceed to Phase 10B: Template Draft QA & Human Review Workflow.

Phase 10B should add the human review workflow for Phase 10A template drafts:
review status, reviewer notes, accept/revise/reject decisions, draft QA
criteria, and safe handoff rules. It must still keep backend, database, camera,
AR, analytics, production app scope, OpenAI/external APIs, training from drafts,
automatic publishing, and committed MediaPipe runtime assets out of scope unless
a future explicit gate expands scope.
