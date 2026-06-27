# User App Visual Guidance And Template Content

Phase 11C polishes the ordinary-user User App MVP shell so the demo feels more
like a guided makeup practice experience, while the post-10U registry chain
remains paused.

Status marker: registry chain paused after Phase 10U. Phase 10V is not the active next phase.

## User-Facing Content

The local MVP example package now uses Chinese, user-facing makeup content:

- `柔玫瑰日常妆` for通勤、日常出门、朋友小聚.
- `暖棕约会妆` for晚餐和小型活动.
- Chinese style tags, scenarios, tool names, product placeholders, safety notes,
  step titles, step instructions, common mistakes, correction tips, and region
  guidance.

The copy is still local example content. It is not final recognition, not
medical advice, not a product shade claim, and not a production release.

## Visual Guidance Polish

Phase 11C improves the ordinary-user flow:

- Template detail shows step preview and region guidance before the user starts.
- Preparation explains what the user will practice first and reminds them to
  read region guidance before applying product.
- Step guidance shows a region badge, intensity reminder, technique breakdown,
  and final check before moving to the next step.
- Completion summarizes completed regions (`completed-region summary`) and
  suggests a slower replay for the next practice.

The step guide remains deterministic and local. It does not use camera, AR,
OpenAI, external AI/CV APIs, backend services, analytics, or training.

## Mobile Readability

The existing mobile-first shell remains intact:

- Template cards stay stacked and touch-friendly on narrow screens.
- Preparation keeps a single primary start action.
- Step actions remain large and reachable.
- Detail cards use compact summaries instead of raw internal traces.
- Completion gives a short review instead of administrator-only diagnostics.

## User/Admin Boundary

Ordinary users must not see registry, write gate, publish gate, simulator,
approval boundary, production writer, Pipeline Trace, debug JSON, Template
Studio, draft QA, human review, or registry safety chain terminology.

Administrator tooling remains preserved behind explicit admin mode and Template
Studio. Phase 11C does not delete the Phase 10A-10U safety chain; it simply keeps
that chain out of the ordinary-user MVP path.

## Non-Goals

Phase 11C does not resume Phase 10V.

Phase 11C does not:

- resume Phase 10V actual write authorization
- execute a real registry write
- mutate registry state
- publish to the user app
- create a production writer
- replace the current User App Shell package
- add backend, database, login, payment, analytics, camera, AR, OpenAI/external
  API, native app, React Native, Flutter, App Store/TestFlight, or training
  scope
- upload, store, analyze, or train on real user photos
- commit local MediaPipe `.task`, `.wasm`, or model files

## Next Phase

Phase 11D - User App Demo Readiness & Operator QA.
