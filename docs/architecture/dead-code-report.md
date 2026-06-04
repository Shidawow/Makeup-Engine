# Dead Code and Orphaned Abstractions Report

## Summary

The repository contains a significant amount of code that is not dead in the strict sense, but is no longer aligned with the current product direction.

## Abandoned or Transitional Areas

### Legacy engine runtime stack

- `src/engine/orchestrator`
- `src/engine/executor`
- `src/engine/graph`
- `src/engine/runtime`
- `src/engine/stages`

These modules are still used by old tests and demo flows, but they represent the previous product thesis. They should stop receiving new feature work.

### Legacy intelligence stack

- `src/intelligence/analysis`
- `src/intelligence/inference`
- `src/intelligence/knowledge`
- `src/intelligence/runtime`
- `src/intelligence/scoring`
- `src/intelligence/styles`

These modules are also active, but they are now overlapping with the new `vision`, `beauty-knowledge`, and `template-engine` stacks.

### Old schema families

- `src/schema/legacyTypes.ts`
- `src/schema/makeup.schema.ts`
- `src/schema/types.ts`

These represent multiple generations of DSL/schema evolution. They are useful as historical compatibility, but they are also a strong source of schema drift.

## Duplicate or Overlapping Utilities

- `src/utils/jsonExport.ts`
- `src/schema/json.ts`
- `src/templates/parser/template-parser.ts`

All three are effectively JSON/template serialization helpers with different generations of assumptions.

- `src/templates/examples/*`
- `src/examples/*`

Both directories contain template-like example assets, but they serve different eras of the repo.

## Orphaned Abstractions

The following concepts are conceptually orphaned from the new business direction:

- generic pipeline graphs
- generic executor layers
- generic runtime lifecycle abstractions
- generic AI scoring wrappers

They are not useless, but they are no longer the product center.

## Recommendation

Do not delete these modules immediately. They still support tests and compatibility. But they should be marked as transitional and not used for new template-production work.
