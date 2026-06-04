# User Template Recommendation Placeholder

Phase 7E adds a recommendation placeholder for the local User App MVP Shell.

## Model

The placeholder is:

- local-only
- rule-based
- deterministic
- explainable
- driven by `UserAppTemplatePackage` plus non-sensitive `UserLocalPreferences`

It is not real AI recommendation, not backend personalization, not cloud sync, not analytics, not advertising, and not ecommerce.

## Rules

- Beginner preferences boost easy, shorter, clearer templates.
- Short available time boosts short-duration templates.
- Minimal or unavailable tools boost templates with fewer required tools.
- Matching style tags and occasions increase ranking.
- Blocked templates are excluded from recommendations.
- Warning templates can appear, but warnings must remain visible.
- Unknown preferences use default discovery ordering.

## Boundary

Recommendation results do not modify templates, do not write back to `UserAppTemplatePackage`, do not enter training datasets, do not call OpenAI or external recommendation APIs, and do not create a durable user profile.
