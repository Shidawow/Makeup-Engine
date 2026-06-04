# User Preferences Data Boundary

Phase 7D preferences are local-only, non-sensitive, and optional.

## Allowed

- makeup skill level
- guidance verbosity
- available time
- available tools
- preferred style tags
- occasion
- comfort level
- onboarding completion state

## Blocked

- health information
- sensitive identity fields
- precise personal identity fields
- real user photos
- object URLs
- local absolute paths
- base64 images
- image bytes
- face embeddings
- biometric identifiers
- training input markers
- training dataset markers
- backend sync identifiers
- cloud sync state

## Project-State Boundary

User preferences and user profile values must not be written into `project-state`. Project-state may document the feature boundary and validation status, but it must not contain real user preference records.

## Training Boundary

Preferences are not training data. They must not enter materialized datasets, model packages, evaluation reports, or export packages.
