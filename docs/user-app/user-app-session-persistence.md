# User App Session Persistence

Phase 7F adds local-only session persistence boundaries for the User App MVP Shell.

This is not an account system, login flow, backend session service, cloud sync, database feature, analytics feature, production app release, camera flow, AR flow, or training workflow.

## Allowed Session State

The session snapshot can store only lightweight local shell state:

- selected template id
- active step id
- current template completed step ids
- current template skipped step ids
- onboarding status and progress summary
- non-sensitive local preferences
- discovery filters
- discovery sort mode
- last visited shell section
- dismissed local warning ids

## Forbidden Session State

The session snapshot must not store:

- real user photos
- image bytes or photo bytes
- base64 image data
- `data:image/`
- object URLs or `blob:`
- local absolute paths
- face embeddings
- biometric identifiers
- health or sensitive identity fields
- React component state or internal React fields
- function values or class instances
- recommendation result records as user records
- training input or training dataset markers

## Storage Boundary

`userAppSessionStorage` provides a testable storage adapter. Browser usage can use `localStorage`; tests and SSR use an in-memory adapter.

Before storage, `sanitizeUserAppSessionForStorage` keeps only the allowed schema fields. `validateSessionStoragePayload` rejects unsafe payloads before writing.

## Relationship To Templates

Session state never modifies `UserAppTemplatePackage`. It can restore UI selection and progress against the current package, but recovery must reconcile stale ids instead of patching template data.

## Current Limitation

The Phase 7F session is a local MVP shell preview. It is not secure production persistence, not encrypted profile storage, not consent management, not cross-device sync, and not a backend user record.
