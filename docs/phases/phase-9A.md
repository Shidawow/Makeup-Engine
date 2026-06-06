# Phase 9A - Internal Trial Operations Pack

## Goal

Prepare the local User App MVP Shell for internal small-scope trial operations by adding participant type planning, session flow, observation templates, outcome review, administrator panels, documentation, and tests.

## Completed Scope

- Added deterministic internal trial operations model.
- Added deterministic trial observation guide and anonymous mock summary model.
- Added deterministic trial outcome review model.
- Added administrator panels for 内部试用运营, 观察记录模板, and 试用结果复盘.
- Added fixtures for ready, warning, unsafe collection, observation blocked, and outcome recommendation cases.
- Updated UserAppShell administrator checks without affecting the ordinary user path.
- Added product documents for operations, participant guide, observation template, and outcome review.
- Updated tests, docs, and project-state for the Phase 9A to Phase 9B handoff.

## Decision

Phase 9A can prepare internal small-scope trial operations when:

- Participant coverage uses broad participant types only.
- Session tasks remain deterministic and local.
- Observation notes are anonymous experience signals, not real user records.
- Outcome review can recommend continuing trials, revising content, revising shell, blocking for privacy/scope, or entering Phase 9B.
- Privacy and local-only boundaries remain intact.
- Tests and project validation pass.

The recommended next phase is Phase 9B - Internal Trial Result Review Framework.

## Boundaries

Phase 9A is an internal operations preparation pack only. It does not create a production app, public release, App Store/TestFlight test, backend, database, account system, cloud sync, analytics, camera, AR, OpenAI API, external API, AI analysis, native app, React Native, Flutter, ecommerce, community, paid feature, model training, online publication, or real user data collection system.

The operations pack, observation guide, and outcome review do not collect real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, or training data.

`UserAppTemplatePackage` remains the handoff contract and is not mutated by trial operations, observation notes, outcome review, sessions, preferences, recommendations, readiness reports, or administrator panels.

`ready_for_internal_trial_ops` and `ready_for_phase_9B` are not production-ready statuses.

## Validation

Required validation:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

Scoped 9A tests:

```bash
npm run test -- tests/user-app-internal-trial-ops.test.ts tests/user-app-trial-observation.test.ts tests/user-app-trial-outcome.test.ts tests/user-app-internal-trial-ops-panel.test.tsx tests/user-app-trial-observation-panel.test.tsx tests/user-app-trial-outcome-panel.test.tsx tests/user-app-shell-internal-trial-flow.test.tsx tests/phase-9A-documentation-recovery.test.ts tests/project-state-snapshot.test.ts tests/provider-switching-docs.test.ts
```

## Next

Proceed to Phase 9B: Internal Trial Result Review Framework.
