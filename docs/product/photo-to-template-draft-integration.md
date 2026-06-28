# Photo-to-Template Draft Integration

Phase 12C connects Phase 12B makeup semantic candidates into the local
photo-to-template draft chain. It is an operator-only integration layer, not a
final template generator.

## Purpose

Phase 12B can produce candidate-only semantic fields for lip color, lip finish,
blush, eyes, brows, highlight, contour, and overall style. Phase 12C binds those
candidate fields into draft template fields so an operator can review how the
semantic evidence may shape title, summary, style, scenario, difficulty, time,
tools, steps, tips, mistakes, correction hints, region guidance, and user app
preview notes.

## Model

`src/template-engine/photoToTemplateDraftIntegration.ts` defines:

- `PhotoToTemplateDraftIntegrationReport`
- `PhotoToTemplateDraftSemanticBinding`
- `PhotoToTemplateDraftFieldSource`
- `PhotoToTemplateDraftEditState`
- `PhotoToTemplateDraftIntegrationIssue`
- `PhotoToTemplateDraftIntegrationRecommendation`

Each semantic binding preserves:

- `sourceType`
- `confidenceBand`
- `evidence`
- `limitations`
- `humanReviewRequired`
- `notFinal`
- `originalCandidateValue`
- `editableDraftValue`
- `reviewerDecision`
- `reviewerNote`

## Binding Matrix

Phase 12C binds semantic candidates to draft fields:

- `title`
- `summary`
- `styleCandidate`
- `suitableScenario`
- `difficulty`
- `estimatedTime`
- `toolList`
- `stepSequence`
- `beginnerTips`
- `commonMistakes`
- `correctionTips`
- `regionGuidance`
- `userAppPreviewNotes`

The binding matrix is visible only in the Template Workbench administrator
surface. It is intentionally hidden from the ordinary User App path.

## Boundaries

The integration report must not:

- mark semantic candidates as final recognition
- remove `humanReviewRequired`
- remove `notFinal`
- drop source, confidence, evidence, or limitations
- claim fully automatic high-quality makeup extraction
- claim AI confirmation
- make product shade or medical claims
- publish a template
- write or mutate registry state
- create a production writer
- replace the current User App Shell package
- generate or mutate `UserAppTemplatePackage`
- upload photos or store real user data
- call backend, camera, AR, OpenAI, external AI/CV APIs, or training code

## Handoff

Ready integration means the draft fields can enter Phase 12C human review
editing. It does not mean the template is final, publishable, registry-ready,
or user-app-package-ready.

Next recommended phase: Phase 12D - Photo-to-Template Operator Workflow & Draft
Preview QA.
