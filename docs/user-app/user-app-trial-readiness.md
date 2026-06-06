# User App Trial Readiness

Phase 8C adds deterministic trial readiness checks for the local User App Shell trial pack.

## Readiness Areas

`src/user-app/userAppTrialReadiness.ts` checks:

- trial task completeness
- feedback form completeness
- privacy copy readiness
- no backend / no upload / no training
- no camera / no AR
- PWA readiness carried over from Phase 8B
- mobile shell readiness carried over from Phase 8B
- ordinary user path readiness
- administrator QA separation

## Status

- `ready_for_internal_trial`: the pack can be used for internal / small-scope trial.
- `ready_with_warnings`: the pack can be reviewed, but content coverage or non-blocking details need attention.
- `blocked`: the pack must not be used until blocking issues are fixed.

## Boundary

Trial readiness is not production release approval. It is not app store readiness, TestFlight readiness, backend readiness, camera readiness, AR readiness, accessibility certification, analytics readiness, or model training readiness.
