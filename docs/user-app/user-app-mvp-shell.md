# User App MVP Shell

Phase 7A adds a local, contract-driven User App MVP Shell.

Phase 7B hardens the shell guidance UX with user-friendly step summaries, detailed instructions, checklists, warnings, blocked reasons, and mobile-friendly layout.

Phase 8B polishes the shell into a more mobile-first PWA MVP preview with a clearer Chinese user path, lightweight PWA metadata, PWA readiness, MVP polish readiness, and separated administrator QA surfaces.

It is not a production app, not an iOS native app, not a backend release, not an online publication, not camera capture, and not AR.

## Purpose

The shell verifies whether `UserAppTemplatePackage` can support user-facing makeup guidance:

```text
UserAppTemplatePackage
-> User App Shell
-> Template List
-> Template Detail
-> Step-by-step Guidance
-> Region Instructions
-> Tools / Products
-> Local Progress
-> Compatibility Warnings
-> PWA / MVP Polish Readiness
```

## Scope

The shell reads only app contract data:

- package summary
- template cards
- template detail
- ordered makeup steps
- region instructions
- required and optional tools
- product suggestions
- duration, difficulty, tags, occasions, and safety notes
- compatibility warnings and blocking issues
- local step progress
- user-friendly step guidance and next actions
- mobile home and current recommendation preview
- PWA metadata readiness
- MVP polish readiness

## Boundaries

- No backend.
- No database.
- No login or account system.
- No online publishing.
- No iOS native implementation.
- No camera or selfie capture.
- No AR overlay.
- No OpenAI API.
- No training pipeline changes.
- No PyTorch, TensorFlow, ONNX Runtime, or new runtime dependency.
- No durable object URLs, local absolute paths, large image bytes, or React state.
- No service worker, offline cache, push notification, background sync, install tracking, analytics, or production PWA release scope in Phase 8B.

## Relationship To Template Studio

Template Studio remains the administrator workbench for production, library, package, and app-contract validation.

`UserAppShell` is mounted in Template Studio only as a local preview surface. It helps administrators inspect the future user-side information architecture before a production app exists.

Phase 7B keeps that same relationship. It improves the preview quality, but it does not turn Template Studio into the production user app.

Phase 8B keeps ordinary user paths and administrator QA paths visually separated. PWA readiness, MVP polish readiness, app readiness, mobile QA, and interaction checklist panels are administrator checks, not user-facing production features.

## Local-Only Status

The shell keeps progress in local React memory only. It does not upload, sync, publish, create training data, or mutate durable contract exports.
