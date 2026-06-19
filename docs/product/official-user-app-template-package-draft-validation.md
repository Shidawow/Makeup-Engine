# Official UserAppTemplatePackage Draft Validation

Phase 10G validation checks whether the official draft is safe to hand to a
future draft publish gate. Validation ready is not publication readiness.

## Checks

- Source gate is ready.
- `draftOnly` is true.
- `publishBlocked` is true.
- Title and summary are present.
- Step sequence is present.
- Region guidance is present or warned.
- Tools checklist is present or warned.
- Privacy notice says no upload, no training, and draft-only.
- QA, human review, candidate, contract, preview, and gate trace are preserved.
- No raw image references.
- No personal or sensitive data.
- No medical, product shade, or unsupported final claims.
- No registry write.
- No `UserAppTemplatePackage` mutation.
- No production package marker.
- JSON round-trip is stable.

## Validation Meaning

`official_draft_validation_ready` means the draft can move to a later Phase 10H
draft publish gate. It still does not publish, write registry, or replace a User
App Shell package.
