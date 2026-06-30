# Internal Founder Demo Run

Phase 14A defines a local internal founder demo run. It is a structured way to
walk through the current MVP demo and decide whether the project can move to
internal trial preparation.

This is not real user research, not publication, not production readiness, and
not registry readiness. The demo uses local/example evidence only.

## Demo Routes

Route A: User App MVP

- Open the ordinary User App MVP path.
- Show home, template selection, template detail, preparation, guided steps,
  and completion.
- Confirm the three MVP trial templates are understandable.
- Confirm ordinary users do not see Template Studio, registry, publish,
  production writer, demo blocker, or founder decision terminology.

Route B: Vision Analysis

- Show FaceMesh, overlay/mask, Region QA, image quality notes, and MediaPipe
  readiness.
- Explain that Readiness Score is a rule-based usability score, not MediaPipe
  model raw confidence.
- Show recovery guidance if local MediaPipe assets are missing.

Route C: Template Studio Operator Workflow

- Show candidate attributes, rule-based step drafts, template draft, draft QA,
  human review, candidate handoff, and draft-preview QA.
- Explain that candidates and drafts require human review.
- Explain that approve means candidate handoff only, not publish.

Route D: Mobile Demo

- Validate the narrow-screen path for home, detail, preparation, guided steps,
  and completion.
- Confirm touch targets and sticky actions do not block core content.

Route E: Boundary Explanation

- Explain that this remains a local MVP demo.
- Confirm no registry write, no publish, no production writer, and no User App
  Shell replacement.
- Confirm no backend, no analytics, no camera/AR, no AI API, no training, no
  real user photos, no base64 image payloads, no local photo paths, and no
  personal data.

## Decision

The preferred pass decision is `proceed_to_internal_trial_prep`, which maps to
Phase 14B - Internal Trial Prep.

If any route is blocked, the project should run Phase 13E - MVP Demo Gap
Resolution Sprint 2 before moving forward.

## Guardrails

- Do not resume Phase 10V or actual registry write authorization.
- Do not write or mutate registry state.
- Do not publish to the user app.
- Do not create a production writer.
- Do not replace the current User App Shell package.
- Do not claim automatic high-quality extraction or AI-confirmed recognition.
- Do not treat founder notes as real user research, analytics, or training data.
