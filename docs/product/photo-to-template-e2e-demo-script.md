# Photo-to-Template End-to-End Demo Script

Phase 12E turns the current photo-to-template chain into an operator-readable
demo script. It is not production readiness, not registry readiness, and not a
claim that arbitrary photos can be fully automatically converted into high
quality makeup templates. The exact claim `fully automatic high-quality makeup extraction`
remains forbidden.

The current capability is still semi-automatic draft generation with human
review. Draft preview is not publish.

## Before Demo

Run these commands from the repository root:

```bash
npm run mediapipe:check
npm run dev
```

Open the local Vite URL, usually `http://127.0.0.1:5173/`.

Recommended screen setup:

- Desktop browser width for the full Template Studio workflow.
- Phone-width or narrow browser width for the User App MVP path.
- Use a test photo only. Do not use a real user's sensitive photo.
- Do not upload, store, or document real personal data.

## Demo Route A - Ordinary User App MVP

Goal: show the local user-facing practice shell without exposing operator
terminology.

1. Open the local page and stay on `用户 App 预览`.
2. Show template selection.
3. Open a template detail page.
4. Show preparation and tools.
5. Start step-by-step practice.
6. Show step region, tools, technique tips, common mistakes, and correction
   tips.
7. Complete the makeup practice.
8. Show the completion page.
9. Return to template selection or restart.

Explain:

- The shell is local-only.
- It does not upload photos.
- It does not use camera or AR.
- It does not train models.

## Demo Route B - Vision Analysis

Goal: show local image understanding and readiness without overstating model
confidence.

1. Open `视觉分析`.
2. Confirm MediaPipe local assets are ready.
3. Upload a test photo.
4. Click analysis.
5. Show FaceMesh, mask, region overlay, and image/mask area.
6. Show Readiness Score.
7. Explain Readiness Score as rule-based detection usability, not MediaPipe raw
   model confidence.

If MediaPipe assets are missing, show the recovery hint instead of continuing
as if real FaceMesh ran.

## Demo Route C - Template Studio Operator Workflow

Goal: show how operator-only photo-to-template draft generation is reviewed.

1. Open `模板工作台`.
2. Show Photo-to-Template Reality Check.
3. Show Makeup Semantic Extraction candidates.
4. Show Semantic Candidate to Draft Field Integration.
5. Show Human Review Editing.
6. Show Draft QA.
7. Show Operator Workflow.
8. Show Draft Preview QA.
9. Show Acceptance Trial.
10. Explain that draft preview is not publish.
11. Explain that human review is still required.

## What Fields Mean

- Real image / FaceMesh / region QA fields: derived from local image analysis
  and readiness checks.
- Semantic candidates: candidate-only extraction hints, not final recognition.
- Draft fields: editable template draft values.
- Human-reviewed fields: local reviewer decisions and edits.
- Draft preview fields: user-readable draft copy for review, not a formal
  `UserAppTemplatePackage`.

## Forbidden Claims

Do not say:

- The system can fully automatically extract high-quality makeup from arbitrary
  photos.
- AI has confirmed the makeup.
- The template is published.
- The system is production ready.
- The registry has been written.
- A formal `UserAppTemplatePackage` has been generated.
- The User App Shell package has been replaced.
- The system can identify exact brand shade matches.
- The system can make medical, skin condition, or skin diagnosis judgments.

## Demo Stop Conditions

Stop or pause the demo if:

- Ordinary user pages show sourceType, confidenceBand, evidence, limitations,
  reviewerDecision, reviewerNote, humanReviewRequired, notFinal, registry,
  publish, production writer, Pipeline Trace, Template Studio, or debug JSON.
- Readiness Score is described as raw model confidence.
- Any panel claims publish, registry write, production writer, or production
  readiness.
- A real user photo, base64 image, local photo path, personal data, biometric
  identifier, or face embedding appears in demo materials.
