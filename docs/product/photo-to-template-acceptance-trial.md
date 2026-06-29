# Photo-to-Template Acceptance Trial

Phase 12E defines an acceptance trial for the local photo-to-template demo. The
trial is an operator / reviewer checklist, not production readiness, not
registry readiness, not publication, and not actual user data collection.

## Trial Goal

Verify that a boss, tester, or operator can understand and run:

- Ordinary User App MVP path.
- Vision Analysis path.
- Template Studio operator workflow.
- Draft Preview QA.
- Acceptance Trial panel.

The trial should prove demo clarity and boundary safety, not final recognition
quality.

## Trial Inputs

- Local app running through `npm run dev`.
- Local MediaPipe assets checked with `npm run mediapipe:check`.
- Test photo only.
- No real user-sensitive photo.
- No personal data.
- No backend, database, account, camera, AR, OpenAI API, external AI API, or
  training pipeline.

## Pass Standards

1. User App MVP can run from home to completion.
2. Vision Analysis can show readiness.
3. Readiness Score is described as rule-based detection usability, not model
   raw confidence.
4. Template Studio operator workflow shows all expected steps.
5. Semantic candidates are shown as candidates, not final.
6. Human Review Editing is shown as local draft editing.
7. Draft Preview QA clearly says it is not publish.
8. Ordinary user path hides internal terms.
9. Registry, publish, and production writer remain blocked.
10. Fully automatic extraction claims remain blocked.
11. AI confirmed claims remain blocked.
12. Medical and product shade hard claims remain blocked.
13. `public/mediapipe` assets remain ignored and uncommitted.
14. MediaPipe check, scoped tests, typecheck, build, project status/context, and
    JSON status/context pass.

## Failure Standards

A blocker is any of:

- Registry write, registry mutation, publish, production writer, or User App
  Shell replacement.
- Semantic candidate described as final recognition.
- Ordinary user path showing sourceType, confidenceBand, evidence, limitations,
  reviewerDecision, reviewerNote, humanReviewRequired, notFinal, registry,
  production writer, publish, Template Studio, Pipeline Trace, or debug JSON.
- Fully automatic high-quality extraction claim.
- AI confirmed recognition claim.
- Medical / skin diagnosis claim.
- Exact brand shade matching claim.
- Real user photo, base64 image, local photo path, personal data, biometric id,
  or face embedding in demo materials.

A warning is any of:

- Build/test evidence has not been recorded yet.
- A demo route is understandable but needs copy cleanup.
- Operator notes need clarification before founder review.

## Evidence Recording

Record only anonymous local evidence:

- Command names and pass/fail status.
- Demo route pass/warning/block status.
- Screenshot observations without real user photos.
- Checklist notes without personal data.

Do not store real trial participant records in `project-state`.

## Operator Checklist

- Confirm User App MVP path opens first.
- Confirm Vision Analysis has MediaPipe readiness or recovery copy.
- Confirm Template Studio shows Reality Check, Semantic Extraction, Draft
  Integration, Human Review Editing, Draft QA, Operator Workflow, Draft Preview
  QA, and Acceptance Trial.
- Confirm registry chain remains paused after Phase 10U.
- Confirm Phase 10V is not active.

## Reviewer Checklist

- Review whether semantic fields are candidate-only.
- Review whether draft fields remain editable.
- Review whether user-visible draft preview copy hides internal trace.
- Review whether human review is still required.
- Review whether acceptance trial is not described as production readiness.

## User App Preview Checklist

- The ordinary user path uses natural template copy.
- It does not expose operator workflow terms.
- It states local-only, no upload, and no training.
- It does not mention registry, writer, simulator, or publish gates.

## Privacy Checklist

- No real user photos.
- No base64 images.
- No local photo paths.
- No personal names, contact details, health information, sensitive identity,
  biometrics, face embeddings, or account data.
- No backend or analytics collection.

## Forbidden Claims Checklist

- No fully automatic extraction claim.
- No AI confirmed recognition claim.
- No production ready claim.
- No published claim.
- No registry written claim.
- No production writer claim.
- No exact brand shade claim.
- No medical or skin diagnosis claim.

## Handoff

If the trial is ready or ready with warnings, the next recommended phase is
Phase 13A - MVP Trial Content Pack & Founder Demo Review. If blocked, fix the
blocking demo/script/copy boundary before founder review.
## Phase 13A Founder Demo Review Handoff

Acceptance Trial now hands off to Phase 13A Founder Demo Review. The founder
review consumes the acceptance trial demo routes and combines them with the MVP
trial content pack.

The handoff remains local and operator-only. It does not write registry state,
does not publish, does not create a production writer, does not replace the
current User App Shell package, and does not generate or mutate a formal
`UserAppTemplatePackage`.
