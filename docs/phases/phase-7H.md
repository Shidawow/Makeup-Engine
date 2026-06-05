# Phase 7H - Browser / Mobile E2E Interaction QA

## Goal

Add local browser/mobile QA coverage around the User App MVP Shell so the prototype can be evaluated through deterministic HTTP smoke, mobile viewport checks, critical path coverage, privacy copy checks, and Chinese copy checks.

## Completed Scope

- Added `userAppBrowserQa` report generation for local-only browser/mobile QA.
- Added `npm run user-app:browser-qa` script for local HTTP smoke and source/copy checks.
- Hardened mobile QA viewport coverage to `375`, `390`, `414`, and `768`.
- Updated visible user-app shell copy to readable Chinese across the main QA surfaces.
- Covered readiness, mobile QA, interaction checklist, empty states, blocked states, recovery states, and privacy copy in tests.
- Added documentation for the browser/mobile QA harness and E2E readiness bar.

## Boundaries

Phase 7H does not add:

- Production user app behavior.
- Backend, database, accounts, cloud sync, analytics, or online publication.
- Real camera, file upload, user photo collection, AR, or MediaPipe/OpenAI calls.
- Training, training datasets from user state, PyTorch, TensorFlow, ONNX Runtime, or WebGPU runtime.
- Native iOS implementation or app store release approval.

Phase 7H reports cannot mutate `UserAppTemplatePackage`, persist real user records, or store photos, temporary image URLs, local paths, encoded image data, biometrics, sensitive profile data, React state, recommendation records, readiness records, browser QA records, or training input in durable exports or `project-state`.

## Validation

Required validation:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
npm run user-app:browser-qa -- --json
```

## Next

Proceed to Phase 8A: Product Route Decision / App MVP Planning.

Use a targeted Phase 7H-1 only if real Playwright pointer/canvas/screenshot/device QA is required before route planning.
