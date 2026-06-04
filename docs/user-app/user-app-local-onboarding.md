# User App Local Onboarding

Phase 7D adds optional local onboarding to the User App MVP Shell. It is not an account system, backend flow, cloud sync, production app, camera flow, AR flow, or training workflow.

## Scope

- The onboarding state is local-only and deterministic.
- The fixed steps are welcome, skill level, guidance style, available time, available tools, preferred styles, privacy reminder, and completed.
- Users can complete steps, skip a step, skip the whole flow, or reset onboarding.
- Onboarding does not collect real photos, request camera permissions, upload data, infer sensitive attributes, or create training input.

## Boundary

Onboarding state must not contain:

- real user photos
- object URLs
- local absolute paths
- base64 images or image bytes
- face embeddings
- biometric identifiers
- health information
- sensitive identity information
- training input markers

## Relationship To Guidance

Onboarding can mark whether local preferences are ready. It does not modify `UserAppTemplatePackage`, template steps, region instructions, tools, products, or compatibility state.

## Current Limitation

The Phase 7D onboarding flow is a local MVP shell preview. It has no login, backend persistence, cloud sync, analytics, camera integration, or real production deployment.
