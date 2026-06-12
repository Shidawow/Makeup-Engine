# Internal Trial Evidence Quality Gate

Phase 9F quality gate decides whether the evidence collection preparation is safe enough for an anonymous internal trial dry run. It is not a production release gate and not approval to collect real user records.

## Decisions

- `ready_to_collect_anonymous_internal_evidence`: protocol, notice, checklist, stop conditions, and local-only boundaries are complete.
- `ready_with_warnings`: preparation has non-blocking gaps and should not be used to advance to MVP validation planning.
- `blocked_by_privacy_scope`: privacy or scope risk appears, including photos, uploads, training, real identity, contact information, health information, sensitive identity, or biometrics.
- `blocked_by_missing_protocol`: protocol or checklist is missing.
- `blocked_by_missing_notice`: participant notice is missing or incomplete.
- `blocked_by_forbidden_data_request`: a forbidden data request appears.

## Required Checks

- Protocol exists.
- Participant notice says anonymous, local-only, no photos, no upload, no training, and no sensitive information.
- Checklist has no blocking item.
- Stop conditions cover photo/camera, identity/contact, health/sensitive information, upload/training, and AI analysis.
- Handoff remains local and anonymous.

## Next Step

If ready, the conservative next phase is Phase 9G - Anonymous Internal Trial Dry Run Pack. Do not skip directly into production app work, backend, analytics, AI analysis, training, public recruitment, App Store/TestFlight, or MVP validation planning.
