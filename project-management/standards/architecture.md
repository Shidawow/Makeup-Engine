# Architecture Standards

## Principles

- Engine-first.
- Pipeline-driven.
- Runtime-oriented.
- Strict type contracts.
- Low coupling.
- Explicit dependencies.

## Rules

- UI must not own business logic.
- Intelligence must not depend on React or Zustand.
- Compiler output must target runtime rendering.
- Runtime contracts must be renderer-agnostic.
- Graphs must be explicit and inspectable.
