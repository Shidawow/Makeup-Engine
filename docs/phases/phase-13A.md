# Phase 13A - MVP Trial Content Pack & Founder Demo Review

## Status

Completed.

## Summary

Phase 13A adds a local MVP trial content pack and a founder demo review layer
for the current User App MVP and photo-to-template operator workflow. It keeps
the registry chain paused after Phase 10U and does not resume Phase 10V.

## Added

- `MvpTrialContentPack` and `MvpTrialTemplate` models.
- Three demo templates: 新手通勤淡妆, 日系温柔约会妆, 韩系清透低饱和妆.
- `FounderDemoReviewReport`, checks, issues, recommendations, status, and
  decision model.
- Template Studio operator-only `FounderDemoReviewPanel`.
- Founder demo script and MVP trial content documentation.
- Tests for content completeness, founder review blocking rules, panel wiring,
  documentation recovery, and ordinary-user hidden admin terminology.

## Boundaries

Phase 13A is founder-demo and trial-content preparation only:

- not production readiness
- not official Template Library content
- not formal `UserAppTemplatePackage` generation or mutation
- not registry write readiness
- not publish
- not production writer creation
- not User App Shell package replacement
- not backend, database, account, analytics, camera, AR, OpenAI/external API,
  native app, ecommerce, payment, or training scope
- not real user photo or personal data collection

## Founder Demo Review Rules

The review is blocked when:

- ordinary user path exposes admin/backend terms
- fully automatic extraction is claimed
- publish, registry, or production writer claims appear
- privacy boundaries are unclear
- User App path is incomplete
- trial content crosses official library, publish, or registry boundaries

The review warns when fewer than two complete trial templates are available or
non-blocking completion/decision evidence is missing.

## Next Phase

Phase 13B - Founder Trial Feedback Capture & MVP Gap Prioritization.
