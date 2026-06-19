# UserAppTemplatePackage Draft Publish Gate

Phase 10H adds a local administrator-only publish gate for the Phase 10G
official `UserAppTemplatePackage` draft.

## Scope

- Input: Phase 10G official draft plus official draft validation.
- Output: a draft publish gate result with checks, issues, blocked reasons,
  warnings, trace, and decision.
- Status: local, deterministic, reviewable, and gate-only.
- Next step: future Phase 10I registry preparation when eligible.

## Gate Meaning

`draft_publish_gate_ready` means the draft may enter future registry
preparation. It is not publication, not a registry write, not production
readiness, and not a User App Shell package replacement.

Ready with warnings remains draft-only until the warnings are reviewed.
Blocked results must not enter registry preparation.

## Checks

- Source official draft validation is ready or ready with warnings.
- `draftOnly` is true.
- `publishBlocked` is true.
- Title, summary, step sequence, region guidance, tools checklist, and privacy
  notice are ready or explicitly warned.
- QA, human review, candidate, contract, preview, and gate trace are preserved.
- No raw image references, local paths, object URLs, base64, or MediaPipe
  runtime asset names.
- No personal, contact, health, sensitive identity, or biometric data.
- No medical, product shade, unsupported final, auto-publish, registry write,
  User App Shell package replacement, production package, or
  `UserAppTemplatePackage` mutation markers.
- JSON round-trip is stable.

## Boundaries

Phase 10H does not publish to a user app, does not write a user app package
registry, does not replace the current User App Shell package, does not add
backend services, does not call OpenAI or external AI/CV APIs, does not use
camera/AR, and does not train models.

The gate may only hand off to a future registry preparation phase.
