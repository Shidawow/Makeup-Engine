# User Photo Intake Placeholder

Phase 7C defines the boundary for future user photo intake. It does not implement real photo capture, selfie upload, camera permissions, AR, face tracking, CV analysis, backend storage, database persistence, native iOS, or training.

## Purpose

The placeholder lets the local User App Shell explain that a future version may support manual upload, camera capture, face analysis, skin tone reference, face shape reference, and progress photos, while the current version keeps guidance usable without a user photo.

## Contract

`src/user-app/userPhotoIntake.ts` defines:

- `UserPhotoIntakeState`
- `UserPhotoIntakeStatus`
- `UserPhotoIntakeCapability`
- `UserPhotoIntakePlaceholder`
- `UserPhotoIntakeIssue`
- `UserPhotoIntakeReadiness`
- `UserPhotoIntakePrivacyNotice`

The supported status values are:

- `unavailable`
- `placeholder_only`
- `not_started`
- `permission_required_future`
- `disabled_by_boundary`
- `ready_for_future_phase`
- `blocked`

## Boundary

The placeholder cannot contain:

- real image bytes
- base64 image data
- `data:image/`
- object URLs
- local absolute paths
- user photo file paths
- face embeddings
- biometric identifiers
- training input markers
- persistent photo references

The placeholder is UI and view-model metadata only. It cannot be written to durable export, training datasets, or `project-state`.

## Shell Behavior

The User App Shell shows disabled future actions such as "upload selfie" and "open camera". They are intentionally disabled and do not render a file input, camera permission request, image preview, or upload flow.

When no user photo exists, step guidance continues from `UserAppTemplatePackage` exactly as in Phase 7B.

## Future Gate

Real photo intake requires a new phase gate that explicitly reviews capture method, storage boundary, privacy policy, consent, retention, deletion, and whether any local-only analysis is allowed.
