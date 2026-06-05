# Template Library Management

Phase 6J adds a local Template Library layer after Production Batch QA and review.

## What It Is

`TemplateLibrary` is the local administrator-managed collection of reviewed makeup templates. A `TemplateLibraryEntry` is created from a reviewed production task, not from a source image package directly.

Allowed source:

```text
TemplateProductionTask approved / published
-> TemplateLibraryEntry
-> TemplateLibrary
```

Forbidden source:

```text
SourceImagePackage
-> TemplateLibraryEntry
```

## Entry Contents

Each entry stores:

- template id and template version
- source production batch id
- source production task id
- source image id
- makeup template JSON
- evidence summary
- quality summary
- review summary
- publish confirmation summary when available
- style tags
- region coverage
- supported use cases
- version history
- lineage

## Local-Only Rule

`local_published` is a Template Library management state. It is not online publication, does not upload to a server, and does not create a training dataset.

## Template Studio

`TemplateLibraryPanel` can create entries from selected approved or locally published production tasks, manage library status, bump versions, build publish packages, and export library JSON or handoff JSON.
