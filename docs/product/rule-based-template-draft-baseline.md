# Rule-based Template Draft Baseline

Phase 10A adds a local rule-based path from candidate makeup attributes to
reviewable draft steps and a draft-only `MakeupTemplate`.

## Step Generation

The rule-based step generator creates an ordered draft sequence:

1. Base prep.
2. Eyeshadow.
3. Eye definition.
4. Blush.
5. Lip color.
6. Conservative contour review.

Every generated step includes source candidate ids, confidence, and
`reviewStatus: needs_human_review`.

## Template Draft

The template draft generator creates a `MakeupTemplate` only when:

- FaceMesh region QA is not blocked.
- Attribute candidates are ready.
- Rule-based steps are ready.

The result remains `metadata.status: draft`, `humanVerificationStatus:
ai_generated`, `humanReviewRequired: true`, and `publishBlocked: true`.

## Non-goals

Phase 10A does not:

- Publish a template.
- Export a `UserAppTemplatePackage`.
- Build production app routing.
- Add camera capture, AR, backend, database, accounts, analytics, service
  worker, OpenAI API, external AI/CV API, or training.
- Store real user records in `project-state`.
