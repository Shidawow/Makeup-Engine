# Template Library Lifecycle

Phase 6J defines the local lifecycle for `TemplateLibraryEntry`.

## Statuses

- `draft`
- `imported_from_production`
- `needs_library_review`
- `ready_for_package`
- `packaged`
- `local_published`
- `archived`
- `deprecated`
- `rejected`

## Rules

- Only production tasks that are `approved` or `published` can be converted.
- Rejected production tasks cannot enter the library.
- Missing evidence blocks conversion.
- `ready_for_package` must happen before `packaged`.
- `packaged` must happen before library `local_published`.
- Rejected library entries cannot be packaged.
- Archived and deprecated entries do not enter packages by default.
- Deprecated entries must record a reason.
- `local_published` is local-only and is not online publication.
