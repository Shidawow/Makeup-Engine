# CTO Architecture Review

## Executive Summary

The repository is in a transitional state between two product theses:

1. legacy AI makeup runtime / demo engine
2. new makeup template production system

The second thesis is now stronger and more business-correct.

## Scores

- Overall architecture score: 6.7 / 10
- Scalability score: 5.8 / 10
- Maintainability score: 6.1 / 10
- AI-runtime maturity score: 5.0 / 10
- Template-production maturity score: 7.4 / 10

## Biggest Technical Risks

1. Multiple overlapping schema generations are still alive.
2. Legacy runtime/orchestrator layers are still present and can attract new work by habit.
3. Template storage is local and not version-aware.
4. Vision remains fixture-based rather than normalized.
5. Studio editing is useful, but still light on governance and review semantics.

## Highest ROI Refactors

### 1. Unify the template schema lineage

Pick `src/templates/schema` as the single canonical schema family and gradually phase out the old schema families.

### 2. Promote template storage into a real asset library

Add versioning, listing, revision history, validation status, and import/export roundtrips.

### 3. Replace heuristic demo glue with template-production contracts

Move the remaining business logic out of the legacy engine/runtime path and into the new template pipeline.

## Rewrite Now vs Later

### Rewrite now

- schema duplication
- storage/versioning for templates
- pipeline contracts around template production

### Rewrite later

- full CV normalization
- real face landmark/segmentation integration
- richer template review workflow
- legacy engine/runtime retirement

## Architecture Truth

The repository is not yet a single clean architecture. It is a live migration between two architectures. The new one is better. The old one is still carrying the load.
