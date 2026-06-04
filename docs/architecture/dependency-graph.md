# Dependency Graph

## High-Level Module Graph

```text
src/main.tsx
→ src/App.tsx
→ src/components/AppShell.tsx
→ src/components/template-studio/TemplateStudio.tsx
→ src/templates/examples
→ src/templates/schema

src/template-engine
→ src/vision
→ src/templates
→ src/beauty-knowledge

src/beauty-knowledge
→ src/templates/schema
→ src/vision

src/vision
→ src/templates/schema

src/engine
→ src/intelligence
→ src/schema
→ src/compiler
→ src/runtime

src/intelligence
→ src/knowledge
→ src/types
→ src/runtime
```

## Circular Dependency Report

### Confirmed circular patterns

- No hard TypeScript import cycle was detected in the core new domain path during this review.

### Structural circularity risk

- `src/engine` re-exports a large surface and still exposes legacy orchestrator/runtime/stages. This is not a TypeScript cycle, but it is an architectural loop because several submodules conceptually overlap and refer back to the same old abstractions.
- `src/intelligence/analysis` and `src/intelligence/inference` are thin alias layers over `runtime/rule-engine`, which means the same logic can be reached through multiple paths.

## Unstable Dependency Report

The following dependencies are unstable or transitional:

- `src/engine/*`
- `src/intelligence/*`
- `src/runtime/*`
- `src/schema/*`

These are legacy product-era modules that still power tests and old demo flows, but they are not aligned with the new template-production direction.

## Stable Core

The most stable business-oriented path is:

```text
src/vision
→ src/beauty-knowledge
→ src/template-engine
→ src/templates
```

## Assessment

The repository currently contains two overlapping architecture stories:

1. legacy engine/runtime architecture
2. new makeup-template production architecture

The second is stronger and should become the primary dependency graph. The first should be treated as compatibility-only.
