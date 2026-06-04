# Phase 7D - User App Local Preferences & Onboarding

## Status

Phase 7D is complete.

## Goal

Add local-only onboarding and non-sensitive preferences to the User App MVP Shell without adding accounts, backend sync, cloud sync, camera capture, AR, real photo intake, database storage, or training.

## What Changed

- Added `src/user-app/userOnboarding.ts` for deterministic local onboarding state.
- Added `src/user-app/userLocalPreferences.ts` for non-sensitive preference state, validation, readiness, and guidance hints.
- Added `src/user-app/userPreferencePrivacy.ts` to block object URLs, base64/data images, local absolute paths, image bytes, biometric identifiers, sensitive fields, and training input markers from preferences.
- Added `UserOnboardingFlow`, `UserPreferenceSetupPanel`, and `UserPreferenceSummary`.
- Wired the User App Shell with local onboarding and preference tabs while keeping the existing template guidance, photo placeholder, personalization placeholder, privacy notice, and progress flow intact.
- Added `user-app-local-preferences.example.ts` fixtures for beginner, intermediate, advanced, minimal-tools, skipped onboarding, completed onboarding, and unsafe preference cases.
- Added tests for onboarding, preferences, privacy boundary, guidance hints, SSR UI render, shell wiring, and documentation recovery.

## Contract Boundary

Phase 7D consumes `UserAppTemplatePackage` only. Preferences can create guidance hints, but they do not modify package data, template steps, region instructions, tool/product suggestions, compatibility state, or training data.

## Privacy Boundary

Phase 7D does not collect photos, request camera permission, upload data, store user photos, create face embeddings, store biometric identifiers, store health information, store sensitive identity data, write user preferences into `project-state`, or create training input from preferences.

## Validation

Required commands:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

HTTP smoke should load the local Vite app when a dev server is available.

## Current Limitations

- The onboarding and preferences UI is MVP shell preview UI, not production account onboarding.
- Preferences are in-memory local shell state, not backend or cloud synced state.
- No real user photo, camera, AR, database, login, training, OpenAI API, or external CV API is enabled.
- Preferences do not personalize geometry or colors from a real face photo.

## Next Recommendation

Proceed to Phase 7E - User App Template Discovery / Recommendation Placeholder.

Use Phase 7D-1 if onboarding, preference UI, mobile layout, or privacy boundary QA needs hardening first.
