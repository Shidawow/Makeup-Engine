# Phase 12D - Photo-to-Template Operator Workflow & Draft Preview QA

## Status

Complete.

## Summary

Phase 12D adds an operator-only workflow and draft preview QA layer for the
photo-to-template chain. It connects Vision / FaceMesh, 12A Reality Check, 12B
Makeup Semantic Extraction, 12C Draft Integration, Human Review Editing, Draft
QA, and User App Draft Preview QA into a clear Template Studio workflow.

The phase keeps the registry chain paused after Phase 10U. Phase 10V actual
write authorization is not active.

## Added

- `PhotoToTemplateOperatorWorkflowReport`
- `PhotoToTemplateOperatorWorkflowStep`
- `PhotoToTemplateOperatorWorkflowHandoff`
- `PhotoToTemplateDraftPreviewQaReport`
- `PhotoToTemplateDraftPreviewQaCheck`
- `PhotoToTemplateDraftPreviewQaIssue`
- `PhotoToTemplateOperatorWorkflowPanel`
- `PhotoToTemplateDraftPreviewQaPanel`
- Phase 12D examples and tests
- Product docs for operator workflow and draft preview QA

## Operator Workflow

The workflow shows an ordered checklist:

1. Vision / FaceMesh readiness
2. Photo-to-Template Reality Check
3. Makeup Semantic Extraction candidates
4. Semantic candidate to draft field integration
5. Human Review Editing
6. Draft QA
7. User App Draft Preview QA
8. Next action / blocked reason / handoff

Each step has a status, required inputs, produced outputs, issues, warnings,
human-review-required flag, internal-only flag, and next action.

## Draft Preview QA

Draft Preview QA checks whether the user-visible draft preview fields are
complete and safe:

- title
- summary
- scenario
- difficulty
- estimated time
- tools
- steps
- beginner tips
- common mistakes
- correction tips
- region guidance
- local-only privacy notice

It blocks internal terms such as source type, confidence band, evidence,
limitations, reviewer decision, reviewer note, `humanReviewRequired`, and
`notFinal` from leaking into the ordinary user path.

## UI

Template Workbench now renders:

- `Photo-to-Template Operator Workflow`
- `Photo-to-Template Draft Preview QA`

The Vision Analysis tab remains focused on FaceMesh, overlay / mask, region QA,
image quality, MediaPipe readiness, fallback status, and readiness summary.

The ordinary User App path does not show operator workflow, Draft Preview QA,
source metadata, confidence bands, evidence, limitations, reviewer notes,
registry gates, simulator terms, production writer terms, or Template Studio
language.

## Boundaries

Phase 12D does not:

- claim fully automatic high-quality makeup extraction
- treat semantic candidates or draft fields as final recognition
- publish templates
- write or mutate registry state
- create a production writer
- replace the current User App Shell package
- generate or mutate formal `UserAppTemplatePackage`
- add backend, database, account, payment, camera, AR, OpenAI, external AI API,
  analytics, or training scope
- upload or store real user photos
- commit MediaPipe `.task` or `.wasm` assets

## Validation

Phase 12D validation includes scoped operator workflow, draft preview QA,
panel, Template Studio tab boundary, ordinary user forbidden terms, documentation
recovery, MediaPipe asset, project-state, provider switching, typecheck, build,
project status, project context, direct JSON status/context, and browser
verification.

## Next

Recommended next phase: Phase 12E - Photo-to-Template End-to-End Demo Script &
Acceptance Trial.
