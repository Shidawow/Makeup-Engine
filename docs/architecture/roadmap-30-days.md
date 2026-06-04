# 30-Day Engineering Roadmap

## Week 1

1. Unify canonical schema under `src/templates/schema`.
2. Add stronger template validator and parser contracts.
3. Add template storage lifecycle: save, list, load, overwrite, export.
4. Stabilize Studio editing flow against the canonical schema.

## Week 2

1. Finish migration of template examples into a clearly labeled asset library.
2. Reduce references to legacy schema families in new code.
3. Add Studio workflow tests.
4. Add template version metadata and review status fields.

## Week 3

1. Introduce template review workflow and asset approval states.
2. Add persistence abstraction for template storage.
3. Add normalization layer in vision results.
4. Improve decomposition rationale and provenance fields.

## Week 4

1. Begin deprecating old engine/runtime entry paths.
2. Split legacy demo flow from production template flow.
3. Add richer integration tests for upload → analyze → template build → save.
4. Clean up dead exports and obsolete compatibility layers.

## Priority Order

1. Schema unification
2. Template storage and validation
3. Studio workflow hardening
4. Legacy runtime deprecation
5. Vision normalization

