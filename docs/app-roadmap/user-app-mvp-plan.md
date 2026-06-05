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

Phase 8B should polish the PWA / mobile web MVP plan and define acceptance criteria for a real MVP surface. It should not bootstrap a production app repository unless the owner explicitly expands scope.

Phase 8B should keep the same boundaries:

- web/PWA first
- local-only V1 state
- `UserAppTemplatePackage` contract consumption
- no backend, database, camera, AR, native app, training, OpenAI API, ecommerce, community, or paid scope
