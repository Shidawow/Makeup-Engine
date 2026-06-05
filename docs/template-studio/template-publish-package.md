# Template Publish Package

Phase 6J adds `TemplatePublishPackage` as a local export package for downstream template consumers.

## What It Contains

- package id, name, version, and schema version
- package manifest
- package entries
- template JSON
- evidence summary
- source lineage
- region instructions
- makeup steps
- style tags
- quality summary
- compatibility metadata
- checksums
- export notes

## What It Must Not Contain

- object URLs
- local absolute paths
- large image bytes
- React state
- backend publication state
- training-ready state

## Readiness Rules

Only `ready_for_package`, `packaged`, or `local_published` library entries enter the package by default. Rejected, archived, and deprecated entries are excluded.

The package must clearly state that it is local/export metadata, not online publication.
