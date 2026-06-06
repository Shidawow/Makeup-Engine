# Template Content QA For Trial

Phase 8D adds a local template content QA gate before any small-scope real user trial.

## Goal

Reduce trial feedback pollution caused by unclear template copy. A user trial should test whether users understand and value the guidance, not whether the template text is incomplete.

## QA Areas

`src/user-app/userAppTemplateContentQa.ts` checks:

- template title clarity
- template summary clarity
- step count reasonableness
- step instruction clarity
- step actionability
- region instruction clarity
- tools completeness
- product suggestion clarity
- duration reasonableness
- difficulty consistency
- recommendation reason clarity
- privacy and placeholder copy safety
- internal technical terms in user-facing copy
- trial suitability

## Status

- `trial_ready`: suitable for the core trial-ready set.
- `ready_with_warnings`: can be a backup template only, and warning must be visible.
- `needs_content_revision`: must be edited before trial.
- `blocked`: must not enter a real user trial.

## Boundary

8D is content QA only. It is not production release, not App Store/TestFlight, not backend readiness, not AI content generation, not OpenAI API usage, not real camera/photo collection, not AR, not analytics, and not model training.

QA reports are deterministic, local-only, and read-only. They must not mutate `UserAppTemplatePackage`, write real user records to `project-state`, or enter training datasets.
