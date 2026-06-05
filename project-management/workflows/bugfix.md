# Bugfix Workflow

## Purpose

Resolve a regression without expanding scope.

## Flow

1. Reproduce the failure.
2. Identify the minimal failing test.
3. Add or tighten the test.
4. Fix the code.
5. Re-run the test subset.
6. Re-run full test suite.
7. Review for collateral impact.
8. Record root cause and fix.

## Completion Criteria

- Regression is covered.
- No unrelated behavior changed.
- Root cause documented.
