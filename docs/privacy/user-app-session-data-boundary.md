# User App Session Data Boundary

Phase 7F local session data is non-sensitive shell state only.

## Allowed

- template ids
- step ids
- local progress ids
- onboarding status
- non-sensitive local preferences
- discovery filters and sort mode
- local UI section id
- dismissed local warning ids

## Blocked

Session privacy guards reject:

- `imageBytes`, `photoBytes`, binary image data, or large inline bytes
- object URLs and `blob:` values
- local absolute paths on Windows or Unix-like systems
- `data:image/` and base64 image-like strings
- `faceEmbedding`, `biometricId`, `faceprint`, or biometric identifiers
- health, medical, sensitive identity, or precise identity fields
- React state-like keys and internal React fields
- function values, symbols, bigints, and class instances
- `trainingInput` or `trainingDataset` markers

## Project-State Rule

`project-state` may document Phase 7F boundaries and validation status, but it must not store real user session records, user preferences, step histories, photos, recommendation histories, or profile data.
