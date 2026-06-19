# Official UserAppTemplatePackage Draft Builder

Phase 10G adds a local administrator-only builder for an official
`UserAppTemplatePackage` draft after the Phase 10F gate is ready.

## Scope

- Input: Phase 10E draft preview plus Phase 10F gate and gate handoff.
- Output: an official package draft object for review.
- Status: draft-only, local, deterministic, and reviewable.
- Next step: a future Phase 10H draft publish gate.

## Required Source

The builder may produce a ready draft only when the source gate is
`official_draft_gate_ready` or `official_draft_gate_ready_with_warnings` and the
gate handoff next action is `ready_for_official_user_app_package_draft_builder`.

Blocked gate inputs produce `official_package_draft_blocked`.

## Draft Fields

The draft carries user-facing title, summary, style tags, difficulty, estimated
time, scenarios, tools checklist, product placeholders, step sequence, region
guidance, privacy notice, QA trace, human review trace, candidate trace,
contract trace, preview trace, and gate trace.

## Boundaries

The builder does not write a user app package registry, does not publish to a
user app, does not replace the current User App Shell prototype package, does
not upload images, does not save real user data, does not train models, and does
not call backend, OpenAI, or external AI/CV APIs.

It blocks raw image references, local paths, object URLs, base64, MediaPipe
runtime asset names, personal data, medical claims, product shade claims,
unsupported final claims, publish markers, registry write markers, production
package markers, and `UserAppTemplatePackage` mutation markers.
