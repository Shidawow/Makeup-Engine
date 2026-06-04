# User Template Recommendation Boundary

Phase 7E recommendation is a placeholder boundary, not a user profiling system.

## Allowed Data

- `UserAppTemplatePackage` metadata
- template difficulty, duration, style tags, occasions, steps, tools, products, warning/blocking status
- non-sensitive local preferences from Phase 7D

## Forbidden Data

- real user photos
- object URLs
- local absolute paths
- large image bytes
- base64 image data
- `data:image/`
- face embeddings
- biometric identifiers
- health information
- sensitive identity fields
- training input markers
- backend recommendation API responses
- durable user profile records

## Persistence Rule

Recommendation results are local UI output only. They must not be written as real user records into `project-state`, durable exports, training datasets, model artifacts, analytics, backend sync, or cloud sync.
