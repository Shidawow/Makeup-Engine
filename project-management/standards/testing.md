# Testing Standards

## Requirements

- Tests first for new modules.
- Compiler snapshot tests required.
- Runtime integration tests required.
- Architecture guard tests required.
- Deterministic test data required.

## Commands

```bash
npm run test
npm run typecheck
npm run build
```

## Review Gates

- Do not delete failing tests to make CI green.
- Do not weaken assertions to bypass regressions.
