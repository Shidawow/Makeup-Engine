# User Personalization Boundary

Phase 7C adds a non-sensitive personalization placeholder for the local User App Shell. It is not a real user profile system and does not persist sensitive data.

## Placeholder Scope

`src/user-app/userPersonalization.ts` defines:

- `UserPersonalizationPlaceholder`
- `UserPersonalizationCapability`
- `UserPersonalizationReadiness`
- `UserPersonalizationBoundary`
- `UserPersonalizationPreference`
- `UserGuidancePersonalizationHints`

The placeholder can describe future or local-only preferences such as:

- skill level
- preferred makeup style
- available time
- available tools
- comfort level
- occasion
- guidance verbosity

## Not Collected

Phase 7C does not collect:

- health information
- precise identity attributes
- real biometric data
- user face embeddings
- user photos
- sensitive demographic attributes
- inferred sensitive attributes

## Guidance Relationship

Placeholder personalization can only create display hints, for example "beginner mode: slow down" or "show detailed reminders". It must not:

- mutate `UserAppTemplatePackage`
- write back to templates
- write durable user profile data
- export profile data
- create training data
- upload to a backend

## Validation

`validateUserPersonalizationBoundary` blocks any placeholder that claims it stores sensitive profile data, face embeddings, user photos, durable export data, or training data.
