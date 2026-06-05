# Template Production QA Skill

Use this skill for production batches, QA reports, reject reasons, publish confirmation, Template Library conversion, Publish Package export, and operator handoff maintenance.

## Boundary Model

Keep these layers distinct:

`SourceImagePackage`
-> `TemplateAnalysisSeed`
-> `Vision Analysis`
-> `Editable Masks`
-> `Human Correction`
-> `Template Evidence`
-> `Template Review`
-> `Template Library Entry`
-> `Template Publish Package`
-> `UserAppTemplatePackage`

The production workflow is local and operator-driven. It is not backend publication and not online release.

## Status Constraints

- `approved` requires evidence and review.
- `rejected` requires a fixed taxonomy reason and optional note.
- `packaged` requires readiness and a validated library entry.
- `local_published` is local-only and does not mean online publication.
- `published` in production batch state is local workflow state only.
- `TemplateLibraryEntry` must be derived from approved or locally published production tasks.
- Rejected entries cannot be packaged or published.
- Archived or deprecated entries cannot be silently republished.

## Export And Handoff Rules

- Operator handoff exports must summarize QA, blocking issues, warnings, next actions, reject reasons, publish confirmations, rebinding recovery, and library/package readiness.
- Handoff exports cannot contain object URLs, local absolute paths, large image bytes, or React state.
- Publish packages and library exports must keep lineage, evidence summary, quality summary, and local-only disclaimers.

## QA Focus Areas

- artifact binding status
- blocked or failed source images
- analysis readiness
- mask review readiness
- evidence readiness
- reject reason capture
- publish confirmation
- rebinding recovery after refresh
- local-only publish disclaimer

## Operator Handoff Maintenance

When the phase changes or a new handoff is created:

1. Update the relevant `project-state/*.json` files.
2. Update `docs/status/*`.
3. Update phase or architecture docs when the workflow boundary changes.
4. Run the validation commands.
5. Summarize the exact local-only QA and publish boundaries in the handoff.

## Required Tests

- QA report and readiness tests
- reject reason tests
- publish confirmation tests
- rebinding recovery tests
- batch export and handoff tests
- local-only disclaimer tests
