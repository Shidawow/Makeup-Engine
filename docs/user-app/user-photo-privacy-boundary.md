# User Photo Privacy Boundary

Phase 7C creates privacy guard utilities for future user photo work before any real photo intake exists.

## Utility

`src/user-app/userPhotoPrivacy.ts` provides:

- `validateNoUserPhotoBytes`
- `validateNoUserPhotoObjectUrl`
- `validateNoUserPhotoLocalPath`
- `validateNoBiometricIdentifier`
- `validateUserPhotoNotTrainingInput`
- `createUserPhotoPrivacySummary`
- `createUserPhotoBoundaryWarnings`

## Blocked Values

The privacy boundary blocks:

- `blob:` object URLs
- `data:image/` strings
- base64 image-like strings
- Windows or Unix local absolute paths
- `imageBytes`
- `photoBytes`
- generic byte-like fields
- `faceEmbedding`
- `biometricId`
- `faceprint`
- `trainingInput`
- `trainingDataset`
- `persistentPhotoReference`

## Durable State Rule

User photo data cannot enter:

- durable app export
- template package export
- user app consumption manifest
- project-state
- training dataset
- model artifacts
- handoff JSON

The current shell can show privacy copy and disabled future controls only.
