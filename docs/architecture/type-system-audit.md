# Type System Audit

## Duplicated Interfaces

There are multiple generations of makeup schema in the repo:

- `src/schema/legacyTypes.ts`
- `src/schema/types.ts`
- `src/schema/makeup.schema.ts`
- `src/templates/schema/*`

This is the biggest source of schema drift.

## Inconsistent Naming

- `MakeupRegion` means different things depending on the module generation.
- `MakeupTechnique` appears in one schema family, while `MakeupStep` carries the operational meaning in another.
- `StyleTaxonomy`, `StyleTaxonomyProfile`, and earlier `MakeupStyle` naming are overlapping.

## Schema Drift

The repo contains at least three eras of domain modeling:

1. early template/legacy DSL era
2. engine/runtime era
3. template-production era

They coexist, which is manageable short term but dangerous long term.

## Weak Typing

The weakest areas are:

- `string[]` for strategy reasons and style evidence in some places
- permissive metadata fields
- parser/storage interfaces that return broad types
- mock analysis inputs derived from file names

## Missing Discriminated Unions

The repo lacks discriminated unions for:

- template lifecycle state
- template source origin
- analysis provenance
- extracted technique type
- face region evidence type

## Assessment

The type system is functional but not unified. The new `src/templates/schema` direction is the best base. The biggest technical debt is not lack of types, but multiple overlapping type systems.
