# Makeup Attribute Candidate Baseline

Phase 10A turns FaceMesh-ready local analysis into deterministic makeup
attribute candidates.

## Candidate Scope

The model can generate candidate values for:

- Lip color family.
- Lip finish.
- Blush placement.
- Eye definition.
- Eyeshadow depth.
- Contour softness.

These are candidates only. They are not final recognition results and must not
be shown as confirmed makeup facts.

## Sources

- FaceMesh region QA.
- Local pixel analysis.
- Local semantic analysis.
- Conservative rule-based defaults when optional pixel or semantic inputs are
  missing.

## Review Requirement

Every `MakeupAttributeCandidate` has `reviewStatus:
needs_human_review`. Candidate outputs are meant for Template Studio operator
review before any template library or user app package work.

## Boundaries

- The model is deterministic and local.
- It does not use OpenAI, external AI, CV APIs, recommendation APIs, analytics,
  backend services, or training datasets.
- It does not mutate `UserAppTemplatePackage`.
- It does not collect user photos or user records.
