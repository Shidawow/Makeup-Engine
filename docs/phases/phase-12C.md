# Phase 12C - Photo-to-Template Draft Integration & Human Review Editing

## Status

Complete.

## Summary

Phase 12C connects Phase 12B makeup semantic candidates into the
photo-to-template draft chain and adds a local human review editing layer. The
result is a traceable, draft-only workflow from semantic candidate to editable
template field.

This phase does not resume the Phase 10 registry write chain. Registry chain
remains paused after Phase 10U.

## Added

- `PhotoToTemplateDraftIntegrationReport`
- `PhotoToTemplateDraftSemanticBinding`
- `PhotoToTemplateDraftFieldSource`
- `PhotoToTemplateDraftEditState`
- `PhotoToTemplateHumanReviewEditingSession`
- `PhotoToTemplateHumanReviewEditableField`
- Template Workbench panels for draft integration and human review editing
- Reality Check support for `semantic_candidate_integrated`
- Draft QA checks for semantic candidate trace preservation and unsafe claims

## Draft Integration

Semantic candidates can now bind to draft fields for title, summary, style,
scenario, difficulty, time, tools, steps, tips, mistakes, correction guidance,
region guidance, and user app preview notes.

Every binding preserves source type, confidence band, evidence, limitations,
human review requirement, not-final status, original candidate value, editable
draft value, reviewer decision, and reviewer note.

## Human Review Editing

Operators can simulate local review decisions:

- accept candidate into draft
- edit candidate before draft QA
- reject candidate
- mark insufficient evidence
- require more review
- block template draft

Accepted candidates remain draft-only. They are not final, published,
registry-written, or user-app-package-ready.

## Draft QA And Reality Check

Draft QA now blocks semantic candidates that lose `notFinal`,
`humanReviewRequired`, source type, confidence band, evidence, limitations, or
that claim full automation, AI confirmation, product shade certainty, medical
diagnosis, registry write, publish, production writer, or User App Shell
replacement.

Reality Check now recognizes `semantic_candidate_integrated` as a draft-source
label. It still does not treat those fields as final real photo extraction.

## UI

Template Workbench shows:

- `Photo-to-Template Draft Integration`
- semantic candidate to draft field binding matrix
- source type and confidence band
- evidence and limitations
- original candidate and editable draft values
- reviewer decision and reviewer note
- `Photo-to-Template Human Review Editing`
- local checklist, issues, and draft QA readiness

The ordinary User App path remains free of semantic source labels, confidence
bands, evidence, limitations, reviewer notes, registry gates, simulator terms,
production writer terms, and Template Studio operator language.

## Boundaries

Phase 12C does not:

- claim fully automatic high-quality makeup extraction
- treat semantic candidates as final recognition
- publish templates
- write or mutate registry state
- create a production writer
- replace the current User App Shell package
- generate or mutate `UserAppTemplatePackage`
- add backend, database, account, payment, camera, AR, OpenAI, or external AI
  API scope
- upload or store real user photos
- train a model
- commit MediaPipe `.task` or `.wasm` assets

## Validation

Phase 12C validation includes scoped draft integration, human review editing,
panel, semantic extraction, reality check, user app forbidden terms, Template
Studio tab boundary, MediaPipe asset, project-state, provider switching,
typecheck, build, project status, project context, and browser verification.

## Next

Recommended next phase: Phase 12D - Photo-to-Template Operator Workflow & Draft
Preview QA.
