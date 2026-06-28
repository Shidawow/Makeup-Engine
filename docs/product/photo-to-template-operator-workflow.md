# Photo-to-Template Operator Workflow

## Purpose

Phase 12D defines the operator-only workflow that connects the current local
photo-to-template chain:

```text
Vision Analysis / FaceMesh
-> Photo-to-Template Reality Check
-> Makeup Semantic Extraction
-> Draft Integration
-> Human Review Editing
-> Draft QA
-> User App Draft Preview QA
-> Phase 12E demo script handoff
```

This is a Template Studio workflow for administrators and reviewers. It is not
the ordinary User App path, not automatic makeup recognition, not a publish
flow, and not a registry write flow.

## Model

`PhotoToTemplateOperatorWorkflowReport` records:

- ordered workflow steps
- step status: `ready`, `ready_with_warnings`, `blocked`, `not_started`, or
  `not_applicable`
- required inputs and produced outputs for each step
- blocking issues and warnings
- whether human review is required
- whether the step is internal-only
- next action and handoff status

The required steps are:

1. Vision / FaceMesh readiness
2. Photo-to-Template Reality Check
3. Makeup Semantic Extraction candidates
4. Semantic candidate to draft field integration
5. Human Review Editing
6. Draft QA
7. User App Draft Preview QA
8. Next action / blocked reason / handoff

## Operator Decisions

The workflow can recommend:

- run vision analysis
- fix region quality
- run reality check
- run semantic extraction
- fix semantic candidate metadata
- continue to draft integration
- continue human review editing
- fix draft QA blockers
- run draft preview QA
- request user-visible copy revision
- keep operator-only
- ready for Phase 12E demo script
- blocked, do not publish

## Handoff Boundary

Allowed handoff destinations are intentionally narrow:

- draft preview QA
- human review editing
- Phase 12E demo script

Forbidden destinations remain blocked:

- publish
- registry write
- production writer
- User App Shell replacement

## Safety Rules

The workflow must block when:

- Region QA is blocked.
- semantic candidates lose source type, evidence, or human review trace.
- semantic candidates or draft bindings are marked final.
- draft integration is blocked.
- critical user-visible fields are missing reviewer decisions.
- draft QA is blocked.
- draft preview QA is blocked.
- misleading final, AI-confirmed, registry, production writer, or shell
  replacement wording appears in user-visible or reviewer-controlled output.

## User Path Boundary

The ordinary User App path must not expose:

- Photo-to-Template Operator Workflow
- sourceType
- confidenceBand
- evidence
- limitations
- reviewerDecision
- reviewer note
- humanReviewRequired
- notFinal
- Draft Preview QA
- registry/write/publish/production writer terminology

Phase 12D keeps these traces in Template Studio only.
