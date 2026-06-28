# Photo-to-Template Human Review Editing

Phase 12C adds a local human review editing model for semantic-candidate-based
draft fields. It lets an operator inspect candidate evidence, edit draft values,
and record decisions before draft QA.

## Purpose

The editing layer keeps Phase 12B semantic outputs candidate-only while allowing
the operator to decide whether each draft field should be accepted into draft,
edited, rejected, marked insufficient, held for more review, or blocked.

## Model

`src/template-engine/photoToTemplateHumanReviewEditing.ts` defines:

- `PhotoToTemplateHumanReviewEditingSession`
- `PhotoToTemplateHumanReviewEditableField`
- `PhotoToTemplateHumanReviewEdit`
- `PhotoToTemplateHumanReviewDecision`
- `PhotoToTemplateHumanReviewChecklist`
- `PhotoToTemplateHumanReviewIssue`

Reviewer decisions include:

- `accept_candidate`
- `edit_candidate`
- `reject_candidate`
- `mark_insufficient_evidence`
- `require_more_review`
- `block_template_draft`

## Editing Rules

Any accepted or edited candidate only enters the draft. It is not final,
publishable, registry-ready, production-ready, or approved for user app package
replacement.

Every editable field keeps:

- original candidate value
- editable draft value
- reviewer decision
- reviewer note
- source type
- confidence band
- evidence
- limitations
- `humanReviewRequired`
- `notFinal`

Rejected fields do not enter the draft. Insufficient-evidence fields stay in
review. Blocked fields stop the editing session from entering draft QA.

## Safety Checks

Human review editing blocks unsafe wording such as AI confirmation, final
recognition, product shade hard claims, medical claims, publish/registry
claims, production writer claims, `UserAppTemplatePackage` mutation markers,
and personal or sensitive data markers.

## UI Boundary

`PhotoToTemplateHumanReviewEditingPanel` is shown only in Template Workbench.
It is not visible in the ordinary User App path. The ordinary user path must
not expose source type, confidence band, internal evidence, limitations, human
review notes, registry terminology, or production writer language.

## Handoff

Ready human review editing means draft fields may enter draft QA. It does not
publish, write registry state, replace the User App Shell package, call a
backend, upload photos, use camera/AR, call AI APIs, or train a model.
