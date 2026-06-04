# User Template Discovery

Phase 7E adds a local-only template discovery placeholder to the User App MVP Shell.

## Scope

- Reads `UserAppTemplatePackage` templates.
- Builds deterministic discovery results for template cards.
- Supports local filters for difficulty, estimated duration, style tags, suitable occasions, required tools, step count, warning/blocked status, and compatibility target.
- Supports local sort modes: recommended, shortest duration, easiest, most steps, and style match.
- Shows empty states when no package, no templates, or no filtered results are available.

## Boundary

Discovery is not a backend search service and not a production recommendation system. It must not call external APIs, create user profiles, mutate `UserAppTemplatePackage`, write project-state user records, or create training input.

Blocked templates can be shown with reasons, but they are not eligible for user guidance or recommendation.
