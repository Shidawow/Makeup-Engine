# Makeup Template Production System

## Business Goal

This repository produces reusable `MakeupTemplate` objects from uploaded makeup photos.
The system is not the end-user coaching runtime. It is a template production system that extracts structured beauty knowledge for downstream products.

## Core Business Flow

```text
image-input
→ face-analysis
→ makeup-region-detection
→ style-inference
→ technique-extraction
→ template-build
→ template-validation
```

## Current Domain Layout

```text
src/
  vision/
  beauty-knowledge/
  template-engine/
  templates/
  coach-runtime/
```

## Domain Responsibilities

### `src/vision`

- Photo input contract.
- Face analysis.
- Makeup region detection.
- Fixture-friendly local analysis helpers.

### `src/beauty-knowledge`

- Beauty rules.
- Style inference.
- Reusable knowledge extraction.

### `src/template-engine`

- Template production contracts.
- Technique extraction.
- Makeup template assembly.
- Template validation.
- Production pipeline.

### `src/templates`

- Core `MakeupTemplate` schema.
- Style schema.
- Technique schema.
- Face suitability schema.
- Example template production inputs.

### `src/coach-runtime`

- Lightweight downstream summary view.
- Not the production goal itself.
- Exists as a compatibility bridge for future coaching apps.

## Legacy Modules

### Keep for now

- `src/components`
- `src/store`
- `src/examples/demoPipeline.ts`
- `src/intelligence`
- `src/engine`
- `src/compiler`
- `src/runtime`
- `src/schema`

These modules keep the current app working while migration proceeds.

### Deprecate gradually

- `src/engine/orchestrator`
- `src/engine/executor`
- `src/engine/stages`
- `src/engine/contracts`
- `src/intelligence/runtime`
- `src/intelligence/analysis`
- `src/intelligence/knowledge`
- `src/intelligence/scoring`
- `src/intelligence/styles`

These names feel generic for the new business direction. They should be wrapped or replaced by the domain-centric modules above.

## Migration Plan

1. Freeze new business logic in the new domain folders.
2. Add thin adapter exports from legacy folders to the new folders where needed.
3. Move template production flow to `src/template-engine`.
4. Keep demo UI functioning through compatibility wrappers.
5. Deprecate generic engine terminology in new code and new docs.
6. Remove obsolete generic modules only after all consumers are migrated.

## Schema-First Principles

- `MakeupTemplate` is the primary object.
- `MakeupStyleSchema`, `MakeupTechnique`, and `FaceSuitabilitySchema` are first-class shared contracts.
- Validation should happen at the template boundary.
- UI must consume produced template data, not infer business rules.

## Working Rules

- Preserve working code when possible.
- Prefer business semantics over framework language.
- Keep extraction and validation deterministic.
- Avoid broad infrastructure abstractions unless they add domain clarity.

## Next Recommended Step

Introduce thin compatibility exports so the current demo and tests can gradually switch to `src/template-engine` and `src/templates` without a big-bang migration.
