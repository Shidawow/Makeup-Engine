# Contract Schema Guard Skill

Use this skill whenever a task changes schemas, contracts, adapters, durable storage, exports, handoff JSON, or state machines.

## Schema-First Rule

- Define durable data shape in `src/templates/schema` before building UI assumptions.
- Keep contract types deterministic and strongly typed.
- Avoid `any`.
- Do not store React component state as durable contract data.
- Keep runtime-only browser resources separate from durable schema fields.

## Contract And State Machine Rules

- State transitions must be explicit and testable.
- Invalid transitions must be rejected by pure logic before UI wiring.
- Review, evidence, QA, package validation, app contract validation, and dataset review cannot be bypassed.
- Local lifecycle states must be named and documented as local-only when they are not online publication.
- If a contract feeds downstream consumers, add validation and export tests.

## Durable Export Prohibitions

Durable storage, export JSON, manifest JSON, handoff JSON, app contracts, prototype consumer handoff, and project-state files must not contain:

- object URL
- `blob:` URL
- local absolute path
- 本地绝对路径
- large image bytes
- 大图 bytes
- `data:image/` inline bytes
- React state

References must be durable artifact references, lineage references, evidence references, or package metadata.

## Source Image Boundary

`SourceImagePackage` cannot directly become a training dataset.

`SourceImagePackage` also cannot directly become:

- `TemplateLibraryEntry`
- `TemplatePublishPackage`
- `UserAppTemplatePackage`
- prototype consumer durable state

It must pass through artifact binding, analysis seed, Vision Analysis, editable masks, human correction, evidence, review, package validation, app contract validation, and the relevant quality gates.

## Local Publish Boundary

- Production task `published` is local workflow state only.
- Template Library `local_published` is local library state only.
- `local_published is not online publication`.
- Publish package export is local handoff metadata only.
- None of these states upload to a backend, publish online, or create an app-store release.

## Training Boundary

- UI state cannot directly train a model.
- Source image packages cannot directly train a model.
- Training reads reviewed, materialized datasets only.
- Accepted / training-ready filters and dataset review cannot be skipped.

## Required Tests

Contract or schema work must include tests for:

- valid contract shape
- invalid transition or invalid export rejection
- no object URL / local absolute path / large image bytes / React state in durable output
- source image boundary when relevant
- local-only publish disclaimer when relevant
