# Testing Infrastructure Review

## Test Inventory

Current test files:

- architecture guard
- compiler snapshot
- demo pipeline
- demo store
- engine pipeline
- face analysis schema
- intelligence rule engine
- makeup plan generator
- runtime integration
- style inference
- template pipeline
- template production
- template storage

## Real Coverage

The repository has decent coverage for prototype-level flows:

- legacy engine pipeline
- intelligence rule engine
- template production
- store behavior
- compiler snapshot

## Missing Integration Tests

Missing or thin areas:

- browser Studio workflow integration
- template storage persistence lifecycle
- template JSON import/export end-to-end
- real save/load versioning
- cross-module template asset library behavior

## Missing Runtime Tests

The current runtime tests still focus on the legacy engine runtime rather than the Studio/template-production path.

## Missing Pipeline Tests

The new template-production pipeline is covered, but the Studio editing workflow is not yet tested as a complete user journey.

## `.test-dist`

The repository includes `.test-dist`, but it is not currently the primary source of test truth. It appears to be a generated or auxiliary artifact directory rather than a core testing system.

## Assessment

Testing is solid for the current prototype, but it is still biased toward the old engine/runtime world. The new architecture should shift more test emphasis toward template production, storage, parser, validation, and Studio workflows.
