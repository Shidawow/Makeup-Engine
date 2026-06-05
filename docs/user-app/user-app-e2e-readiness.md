# User App E2E Readiness

Phase 7H defines the current readiness bar for moving from the local User App MVP Shell into Phase 8A planning.

## Required Evidence

Readiness requires:

- `npm run typecheck` passes.
- `npm run test` passes.
- `npm run build` passes.
- `npm run project:status` passes.
- `npm run project:context` passes.
- `node scripts/project-status.mjs --json` passes.
- `node scripts/context-pack.mjs --json` passes.
- `npm run user-app:browser-qa -- --json` passes.

The browser/mobile QA report must show:

- `browserSmokeStatus: passed`
- `criticalPathStatus: passed`
- `privacyCopyStatus: passed`
- `chineseCopyStatus: passed`

## Critical Paths

The local shell must keep these paths reachable:

- Template guidance.
- Template list and selected detail.
- Step guide with previous/next/complete/skip controls.
- Local session controls and recovery state.
- App readiness panel.
- Mobile QA panel.
- Interaction checklist panel.
- Privacy notice.

## State Coverage

Tests must cover:

- Empty package/template states.
- Warning states.
- Blocked package or blocked guidance states.
- Session recovery or reset state.
- Narrow viewport/mobile layout readiness.

## Boundary

Readiness is for the local prototype only. It is not app store readiness, native iOS readiness, backend readiness, camera readiness, AR readiness, training readiness, or production launch approval.
