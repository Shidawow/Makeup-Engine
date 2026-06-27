# Phase 11D - User App Demo Readiness & Operator QA

Phase 11D prepares the current ordinary-user User App MVP shell for
operator-led demo, QA, and handoff discussion.

## Goals

- Document how to demo the MVP.
- Document how an operator verifies the user path.
- Verify mobile demo readiness.
- Verify forbidden backend/registry/production terms stay out of the ordinary
  user path.
- Keep Vision Analysis and Template Studio available as administrator surfaces.
- Preserve the post-Phase-10U registry pause.

## Completed Scope

- User App demo readiness checklist.
- Operator QA checklist.
- Administrator-only Demo Readiness panel.
- User path QA tests for template selection, detail, preparation, step guide,
  completion, restart, return selection, and mobile CTA visibility.
- Forbidden terms QA tests for the ordinary user path.
- Known limitations update for local MVP, no backend, no camera, no AR, no AI
  API, no training, no photo upload, no registry write, and Readiness Score
  wording.

## Demo Readiness Checklist

- Open local app.
- Confirm default `用户 App 预览`.
- Show template selection.
- Open template detail.
- Show preparation.
- Start step-by-step practice.
- Use previous, next, and complete-step actions.
- Finish practice.
- Show completion and step review.
- Restart or return to template selection.

## Operator QA Checklist

The canonical checklist lives in
`docs/product/operator-qa-checklist.md`.

It covers user path QA, admin boundary QA, Vision Analysis QA, mobile layout QA,
forbidden terms QA, privacy boundary QA, registry paused QA, MediaPipe asset QA,
Git hygiene QA, and build/test QA.

## Out Of Scope

Phase 11D does not resume Phase 10V. It does not execute registry writes, mutate
registry state, publish, replace the current User App Shell package, create a
production writer, add backend/database/account/payment/camera/AR/OpenAI or
external API scope, train models, upload photos, or store real user data.

## Validation

- `npm run mediapipe:check`
- Phase 11D scoped tests
- `npm run typecheck`
- `npm run build`
- `npm run project:status`
- `npm run project:context`
- `node scripts/project-status.mjs --json`
- `node scripts/context-pack.mjs --json`
- Browser QA for ordinary user path, mobile width, Vision Analysis, and
  Template Studio boundaries

## Next Phase

Recommended next phase: Phase 12A - Photo-to-Template Draft Reality Check.

Phase 12A should evaluate the real photo-to-template draft capability instead
of assuming fully automatic high-quality makeup extraction.
