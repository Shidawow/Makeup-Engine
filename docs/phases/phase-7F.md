# Phase 7F - User App Session Persistence / Local State Hardening

## Status

Completed.

## Goal

Harden User App MVP Shell local session state and local persistence boundaries without adding accounts, backend sync, cloud sync, database storage, analytics, real photo capture, AR, training, native iOS scope, online publication, or new runtime dependencies.

## What Changed

- Added `src/user-app/userAppSession.ts` for versioned local session snapshots, summary, validation, reset, progress clearing, and preference clearing.
- Added `src/user-app/userAppSessionStorage.ts` for testable memory/localStorage adapters, save/load/clear, import/export snapshot helpers, storage sanitization, and payload validation.
- Added `src/user-app/userAppSessionRecovery.ts` for selected-template fallback, active-step fallback, stale progress reconciliation, discovery filter reset, blocked-package restore prevention, and version mismatch reset.
- Added `src/user-app/userAppSessionPrivacy.ts` for blocking photos, object URLs, local paths, base64 images, biometrics, sensitive profile fields, React state, non-serializable values, and training input markers.
- Added `UserAppSessionPanel` and `UserAppSessionRecoveryNotice`.
- Wired `UserAppShell` with a `本地状态` section for save, restore, clear progress, reset preferences, and clear all local state.
- Added `user-app-session.example.ts` fixtures for empty, completed onboarding, partial progress, invalid selected template, invalid step progress, blocked package, unsafe object URL, unsafe image bytes, unsafe biometric id, and version mismatch sessions.

## Boundaries

Phase 7F is local session hardening only. It is not a production app, account system, login flow, backend session service, cloud sync, database, analytics, camera, AR, AI API, or training phase.

Session state can persist selected template, active step, step progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, last visited section, and dismissed local warning ids.

Session state cannot persist real user photos, image bytes, base64 image data, object URLs, local absolute paths, face embeddings, biometric identifiers, sensitive profile fields, health information, React state, recommendation result records, training input, or training dataset markers.

Recovery reconciles against the current `UserAppTemplatePackage`; it never mutates the package.

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
```

## Next Recommendation

Proceed to Phase 7G - User App Mobile Interaction QA / App Readiness Gate if 7F validation remains stable. Use Phase 7F-1 only if session persistence or recovery QA needs more hardening.
