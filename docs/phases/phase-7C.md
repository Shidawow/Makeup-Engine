# Phase 7C - User Photo Intake Placeholder / Personalization Boundary

## Goal

Phase 7C defines the product and engineering boundary for future user photo intake and personalization. It keeps the User App Shell local-only and contract-driven while making clear that the current version does not collect, upload, analyze, store, or train on user photos.

This phase is not a production app, not real camera capture, not selfie upload, not AR, not face tracking, not backend work, not database work, not native iOS, and not training.

## What Changed

- Added `userPhotoIntake` placeholder contracts for future manual upload, camera capture, face analysis, skin tone reference, face shape reference, and progress photo capabilities.
- Added `userPersonalization` placeholder contracts for non-sensitive local guidance hints such as skill level, available time, occasion, preferred style, and guidance verbosity.
- Added `userPhotoPrivacy` validators that block object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo byte fields, face embeddings, biometric identifiers, training input markers, and persistent photo references.
- Added User App Shell UI sections for "模板指导", "我的准备", "照片与个性化（未启用）", and "隐私说明".
- Added disabled future upload/camera buttons without real file input, camera permissions, image preview, or upload behavior.
- Added examples for default, disabled camera, future manual upload, beginner personalization, advanced personalization, and blocked unsafe photo references.
- Added tests for privacy boundaries, placeholder contracts, UI rendering, guidance-without-photo flow, and documentation recovery.

## Main Flow

```text
User App Shell
-> Photo Intake Placeholder
-> Personalization Placeholder
-> Privacy Notice
-> Guidance remains UserAppTemplatePackage-driven
```

## Guidance Without User Photo

The shell continues to render template list, template detail, step-by-step guidance, region instructions, tools/products, warnings, blocked states, and local progress without any user photo.

Placeholder personalization may create display hints only. It does not mutate templates, write profile data, export user data, or create training input.

## Privacy Boundary

User photo data cannot enter durable exports, template packages, project-state, handoff JSON, training datasets, or model artifacts. `SourceImagePackage` remains an admin production input and cannot directly become user photo intake.

## Tests

Phase 7C adds tests for:

- photo intake placeholder readiness
- personalization placeholder readiness
- user photo privacy boundary detection
- disabled upload/camera UI
- privacy notice rendering
- user app shell guidance without photo intake
- documentation and project-state recovery

## Result

Phase 7C is complete when typecheck, full tests, build, project status, context pack, direct JSON status, direct JSON context, and HTTP smoke pass.

## Next Recommendation

Proceed to Phase 7D - User App Local Preferences & Onboarding.

Use Phase 7C-1 only if privacy, personalization, or photo boundary QA finds issues before onboarding work.
