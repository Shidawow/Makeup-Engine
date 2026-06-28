# Photo-to-Template Draft Preview QA

## Purpose

Phase 12D adds Draft Preview QA for the user-facing draft preview surface. It
checks whether a human-reviewed photo-to-template draft could be shown as a
local demo preview without leaking internal pipeline language.

This is still not a formal `UserAppTemplatePackage`, not a registry write, not
a publish step, not production readiness, and not User App Shell replacement.

## Model

`PhotoToTemplateDraftPreviewQaReport` records:

- source draft integration id
- source human review editing session id
- source draft QA status
- user-visible draft fields
- QA checks
- blocking issues and warnings
- local-only privacy notice readiness
- internal-field leakage status
- human review trace preservation
- publish, registry, production writer, shell replacement, and package
  generation blocked flags
- JSON round-trip stability

## User-Visible Fields

Draft Preview QA checks these user-visible fields:

- title
- summary
- suitable scenario
- difficulty
- estimated time
- tool checklist
- step guidance
- beginner tips
- common mistakes
- correction tips
- region guidance

The preview can use these fields only as a draft demo. They cannot become a
formal user app package in Phase 12D.

## Required Checks

Draft Preview QA blocks or warns on:

- missing title
- missing summary
- missing scenario, difficulty, or estimated time
- missing tools
- missing steps
- missing beginner tips, common mistakes, or correction tips
- missing region guidance
- internal source type leakage
- confidence band leakage
- reviewer note leakage
- registry, publish, production writer, or production-ready wording
- AI-confirmed claims
- fully automatic extraction claims
- medical or skin diagnosis claims
- brand shade hard claims
- missing local-only, no-upload, no-training privacy copy
- missing or blocked Draft QA
- missing internal human review trace

## Privacy Copy

The draft preview must keep clear local-only copy:

- no upload
- no training
- no real user record storage
- no formal package generation

## Boundary

Phase 12D Draft Preview QA does not:

- publish templates
- write or mutate registry state
- create a production writer
- create a formal `UserAppTemplatePackage`
- replace the current User App Shell package
- claim final recognition
- claim AI confirmation
- claim fully automatic high-quality makeup extraction
- add backend, database, camera, AR, OpenAI, external AI API, analytics, or
  training scope

## Next

If the operator workflow and draft preview QA are ready, the next recommended
phase is Phase 12E - Photo-to-Template End-to-End Demo Script & Acceptance
Trial.
