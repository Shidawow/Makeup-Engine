# User App V1 Non-Goals

Phase 8A defines what the first user-facing MVP must not include. These non-goals prevent the PWA/mobile web route from becoming a production platform before the product flow is validated.

## Product Non-Goals

- No login.
- No account system.
- No backend.
- No database.
- No cloud sync.
- No analytics.
- No ecommerce.
- No community.
- No paid features.
- No subscriptions.
- No app store release.
- No online template publication.
- No service worker in Phase 8B.
- No offline cache in Phase 8B.
- No push notification or background sync in Phase 8B.
- No install tracking in Phase 8B.
- No production release, online user growth, backend feedback form, analytics, or App Store/TestFlight testing in Phase 8C.
- No production release, AI content generation, backend content service, analytics, OpenAI/external API use, real user record collection, or App Store/TestFlight testing in Phase 8D.
- No production release, backend readiness, analytics readiness, camera readiness, AR readiness, OpenAI/external API use, AI content generation, real user record collection, or App Store/TestFlight testing in Phase 8E.
- No public recruitment, production release, backend form, analytics, camera readiness, AR readiness, AI analysis, OpenAI/external API use, real user record collection, or App Store/TestFlight testing in Phase 9A.

## Photo / Camera / AR Non-Goals

- No real photo capture.
- No file upload.
- No image preview.
- No camera permission request.
- No browser camera API.
- No selfie analysis.
- No face tracking.
- No face embeddings.
- No biometric identifiers.
- No AR overlay.
- No AR runtime.

## AI / Training Non-Goals

- No OpenAI API.
- No external AI API.
- No external CV API.
- No remote recommendation API.
- No training from user state.
- No training from user photos.
- No model training pipeline expansion.
- No new model artifacts.
- No PyTorch, TensorFlow, ONNX Runtime, WebGPU runtime, or similar runtime expansion for the user app MVP.

## Native Platform Non-Goals

- No iOS native SwiftUI implementation.
- No React Native implementation.
- No Flutter implementation.
- No TestFlight work.
- No App Store signing or submission.
- No production native release process.

## Data Non-Goals

V1 must not store or export:

- user photo bytes
- image bytes
- `data:image/` strings
- base64 image payloads
- object URLs
- local absolute paths
- face embeddings
- biometric identifiers
- sensitive profile fields
- health information
- real user preference records
- real user trial feedback records
- real user template content QA records
- real user release readiness or go/no-go participant records
- real user internal trial observation or outcome records
- real names or contact information
- real recommendation records
- real session records
- readiness/browser QA records as user records
- training input markers

## Repository Non-Goals

Phase 8A does not bootstrap the production User App repository. Phase 8B should polish the PWA/mobile web MVP plan and acceptance criteria first. A separate repository or package boundary requires a later explicit phase gate.
