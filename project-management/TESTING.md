# Testing Strategy

## Required Test Classes

- Unit tests for intelligence inference.
- Snapshot tests for compiler render instructions.
- Integration tests for engine pipeline.
- Integration tests for runtime renderer lifecycle.
- Architecture guard tests for forbidden imports and `any`.

## Rules

- Tests are not deleted to bypass failures.
- Tests should encode engine behavior, not UI details.
- Runtime tests must be deterministic.
- Compiler snapshot tests should fail when render instruction structure changes.

## Commands

```bash
npm run test
npm run typecheck
npm run build
```

## Current Test Suites

- `tests/compiler.snapshot.test.ts`
- `tests/runtime.integration.test.ts`
- `tests/engine.pipeline.test.ts`
- `tests/architecture.guard.test.ts`

## Required Future Suites

- renderer blending tests
- runtime benchmark tests
- intelligence conflict-resolution tests
- executor trace tests
