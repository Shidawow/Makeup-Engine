# User App MVP Plan

Phase 8A defines the future user-facing MVP scope. This plan is intentionally product-level. It does not build the production app and does not add backend, database, camera, AR, OpenAI API, external API, training, ecommerce, community, payments, or native app code.

## MVP Goal

Validate whether users can follow makeup guidance from `UserAppTemplatePackage` on a mobile-first web/PWA surface.

The MVP should answer:

- Can a user find a template that fits their need?
- Can they understand the template before starting?
- Can they follow step-by-step guidance with region instructions, tools, and products?
- Can local onboarding, local preferences, and local session progress make the flow feel helpful without collecting sensitive data?
- Can privacy copy clearly explain that photo, camera, AR, backend, and training features are not active?

## MVP Includes

- Template discovery.
- Template detail.
- Step-by-step makeup guidance.
- Region instructions.
- Tools and products.
- Local onboarding.
- Local preferences.
- Local session progress.
- Privacy notice.
- Photo, camera, and AR placeholders.

## MVP User Flow

```text
Open mobile-first PWA
-> Read privacy notice
-> Optional local onboarding
-> Set local non-sensitive preferences
-> Discover templates
-> View template detail
-> Start step-by-step guidance
-> Read region instructions
-> Check tools and products
-> Mark local progress
-> Recover local session if the browser reloads
```

## Data Contract

The MVP consumes `UserAppTemplatePackage` as read-only contract data from Makeup Engine.

The MVP must not read `SourceImagePackage` directly. It must not mutate Makeup Engine templates, publish packages, library entries, production batches, source images, project-state, or training datasets.

## Local State

Allowed V1 local state:

- selected template id
- current step id
- completed/skipped local progress ids
- local onboarding status
- non-sensitive local preferences
- discovery filters and sort mode
- dismissed local warnings

Forbidden local state:

- user photo bytes
- object URLs
- local absolute paths
- `data:image/` strings
- base64 image payloads
- face embeddings
- biometric identifiers
- health information
- sensitive identity fields
- real recommendation records
- training input markers

## MVP Excludes

- Login.
- Backend.
- Database.
- Cloud sync.
- Real photo capture.
- Camera.
- AR.
- OpenAI API.
- Ecommerce.
- Community.
- Paid features.
- Model training.

## Phase 8B Planning Target

Phase 8B polished the local PWA / mobile web MVP shell evidence: mobile home, user copy, PWA metadata, install-readiness placeholder, PWA readiness, MVP polish readiness, privacy copy, touch-friendly step actions, and administrator QA separation. It did not bootstrap a production app repository.

Phase 8B should keep the same boundaries:

- web/PWA first
- local-only V1 state
- `UserAppTemplatePackage` contract consumption
- no backend, database, camera, AR, native app, training, OpenAI API, ecommerce, community, or paid scope

## Phase 8C Planning Target

Phase 8C should define the first User App MVP Trial Pack: a small set of trial-ready templates and sample guidance coverage. It should remain content/package selection only unless a future explicit gate expands scope.

## Phase 8C Result

Phase 8C adds a local trial pack structure for internal / small-scope trial planning:

- ordered trial tasks
- trial preparation instructions
- trial checklist
- feedback questionnaire
- privacy-safe mock feedback summary
- trial readiness report
- administrator trial panels

The result is still local-only and contract-driven. It does not add backend, database, accounts, analytics, camera, AR, real photo collection, training, online publication, native app work, App Store/TestFlight, or production release scope.

## Phase 8D Result

Phase 8D adds a local content QA gate for real user trial preparation:

- template content QA
- trial template selection
- trial content readiness
- trial-ready, warning, blocked, missing-step, missing-tool, missing-region, and technical-copy fixtures
- administrator content QA panels

The result is still local-only and contract-driven. It does not add AI content generation, OpenAI/external API calls, backend, database, accounts, analytics, camera, AR, real photo collection, training, online publication, native app work, App Store/TestFlight, or production release scope.

## Phase 8E Result

Phase 8E adds the MVP release readiness gate for internal trial preparation:

- MVP release readiness report
- trial go/no-go decision
- ready, warning, no-template, unsafe-feedback, blocked-content, and production-boundary fixtures
- administrator release gate panels
- internal trial launch checklist

The result is still local-only and contract-driven. `go_for_internal_trial` and `go_with_warnings` mean internal small-scope trial preparation only. They do not add backend, database, accounts, analytics, camera, AR, real photo collection, training, online publication, native app work, App Store/TestFlight, production release scope, service worker, offline cache, push notification, background sync, install tracking, AI generation, OpenAI/external API calls, or real user record collection.

## Phase 9A Planning Target

Phase 9A should prepare the internal trial operations pack: participant instructions, operator script, warning log, stop conditions, and post-trial summary structure. It should not create backend forms, analytics stores, camera/photo capture, AR flows, App Store/TestFlight work, online release, or real user record storage unless a later explicit gate approves those systems.

## Phase 9A Result

Phase 9A adds a local internal trial operations pack:

- participant type coverage
- session plan and checklist
- risk and boundary checks
- anonymous observation guide
- mock/example observation summary
- outcome review recommendations
- administrator operations panels

The result is still local-only and contract-driven. It does not add public recruitment, backend forms, database, accounts, analytics, camera, AR, real photo collection, AI analysis, OpenAI/external API calls, training, online publication, native app work, App Store/TestFlight, production release scope, or real user record collection.

## Phase 9B Planning Target

Phase 9B should define how anonymous internal trial signals are reviewed after sessions: evidence sufficiency, issue theme grouping, decision criteria, and whether to continue trials, revise content, revise shell, or pause for privacy/scope. It should not create a backend research repository, analytics store, public recruitment workflow, or real participant record system unless a later explicit gate approves those systems.
