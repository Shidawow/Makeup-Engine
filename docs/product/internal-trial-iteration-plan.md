# Internal Trial Iteration Plan

Phase 9C turns anonymous/mock Phase 9B review decisions into a local internal trial iteration plan. It is not a formal product roadmap release, not production planning for public growth, and not a backend data system.

## Scope

- Convert anonymous issue summaries into next-iteration workstreams.
- Separate template content, User App Shell, trial pack, privacy/boundary, discovery/recommendation, session/preference, and observe-more work.
- Define next actions, acceptance criteria, risks, and blocked reasons.
- Decide whether the next internal trial can proceed, should wait for fixes, or must pause for privacy/scope repair.

## Workstreams

- `template_content_iteration`: steps, region copy, tools, products, recommendation text, template suitability.
- `user_app_shell_iteration`: mobile home, navigation, touch actions, state clarity, admin/user separation.
- `trial_pack_iteration`: task order, script, observation template, feedback organization.
- `privacy_boundary_iteration`: local-only, no upload, no training, no photo, no identity, no backend boundary.
- `discovery_recommendation_iteration`: recommendation reason and template discovery clarity.
- `session_preference_iteration`: local progress and non-sensitive preference clarity.
- `no_action_observe_more`: low-confidence or not-actionable signals that need more anonymous examples.

## Decision Rules

- Critical privacy or boundary issues block the next trial until fixed.
- Repeated content issues become template content iteration.
- Repeated Shell usability issues become Shell iteration.
- Repeated trial operation issues become trial pack iteration.
- Low-confidence or not-actionable issues go to observe-more.
- Clean review can prepare the next internal trial, but still remains internal and small-scope.

## Boundaries

9C does not add backend, database, account system, analytics, camera, AR, AI analysis, OpenAI/external API calls, training, public recruitment, App Store/TestFlight, online publication, production release, or new runtime dependencies.

The iteration plan must not collect or store real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, or real user trial records in `project-state`.

`UserAppTemplatePackage` remains read-only contract data and is not mutated by the iteration plan, backlog, priority model, sessions, preferences, recommendations, readiness reports, or administrator panels.
