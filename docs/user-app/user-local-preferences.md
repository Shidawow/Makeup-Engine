# User Local Preferences

Phase 7D adds non-sensitive local preferences for the User App MVP Shell.

These preferences are not a user account profile and are not durable sensitive profile data. They are local UI state for guidance hints only.

## Supported Preferences

- makeup skill level: beginner, intermediate, advanced, unknown
- guidance verbosity: concise, balanced, detailed
- available time: under 5 minutes, 5 to 10 minutes, 10 to 20 minutes, over 20 minutes, flexible
- available tools: fingers, sponge, brush, lash curler, brow pencil, cotton swab
- preferred style tags: natural, soft, polished, glowy, bold, minimal
- occasion: daily, work, date, evening, special event, practice
- comfort level: cautious, normal, adventurous

## Hard Boundaries

Local preferences must not:

- collect photos
- request camera permission
- store object URLs, local paths, image bytes, or base64 images
- store face embeddings, biometric identifiers, health information, or sensitive identity fields
- modify `UserAppTemplatePackage`
- write back to templates
- enter training datasets
- write user profile data into `project-state`
- sync to backend or cloud storage

## Current Limitation

Preferences are in-memory shell state for preview and tests. A future production app would need a separate persistence, consent, security, and privacy phase gate.
