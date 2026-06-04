# Intelligence Layer Review

## Modules Reviewed

- `src/intelligence/analysis`
- `src/intelligence/inference`
- `src/intelligence/knowledge`
- `src/intelligence/runtime`
- `src/intelligence/scoring`
- `src/intelligence/styles`
- `src/intelligence/types`

## Observations

The intelligence layer currently performs a useful role for demo inference, but it is not tightly aligned with the new makeup-template production workflow.

## Disconnected Modules

- `analysis` is mostly mock/provider-driven and filename-driven.
- `scoring` is standalone and not deeply integrated with template production.
- `styles` is a preset library that does not yet feed the new template schema.

## Duplicated Scoring Logic

There is no large hard duplication of scoring math, but there is duplication of intent:

- the old `intelligence/scoring` layer scores recommendations,
- the new template system classifies style and suitability,
- the demo pipeline also turns results into scores for display.

That is three different ways of expressing “beauty assessment” in one repository.

## Missing Inference Contracts

The intelligence layer is missing a strong shared contract for:

- face analysis payloads
- style inference evidence
- template suitability output
- decomposition rationale

The new `template-engine` begins to fill that gap, but the legacy intelligence path still uses its own vocabulary.

## Assessment

The intelligence layer is useful for fixtures and demo behavior, but it should become a supporting subsystem. It should not be the center of the product architecture anymore.
