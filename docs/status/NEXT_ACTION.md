# Next Action

## What To Do Next

Proceed to Phase 11B: User App Guided Step Experience Polish.

## Why

Phase 11A paused the post-10U registry write chain and reset the active product
focus to the ordinary-user User App MVP. The shell now has a clear path:

Home -> Template Selection -> Template Detail -> Preparation ->
Step-by-step Guidance -> Completion.

Phase 11B should make the guided step experience feel smoother and more
demo-ready without adding production app scope.

## Recommended 11B Scope

- Improve step card hierarchy, progress affordances, and previous/next/complete
  transitions.
- Improve mobile spacing, touch targets, and completed-step feedback.
- Keep tools/products, region guidance, cautions, and correction tips readable
  without making the page too long.
- Add browser checks around the ordinary-user step flow.
- Keep administrator QA and registry-chain terminology out of the ordinary user
  path.

## What Not To Do

- Do not resume Phase 10V or actual write authorization in 11B.
- Do not execute a registry write.
- Do not mutate registry state.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not add backend, database, login, payment, analytics, camera capture, AR,
  OpenAI/external API calls, native app implementation, React Native, Flutter,
  App Store/TestFlight work, service worker, ecommerce, community, paid
  features, or new runtime dependencies.
- Do not upload, store, analyze, or train on real user photos.
- Do not commit `public/mediapipe/**` `.task` or `.wasm` assets.
- Do not modify legacy runtime areas.

## Entry For The Next Codex Session

Read these files first:

1. `AGENTS.md`
2. `START_HERE.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
5. `docs/status/CURRENT_PROJECT_STATUS.md`
6. `docs/status/NEXT_ACTION.md`
7. `docs/product/user-app-mvp-experience.md`
8. `docs/phases/phase-11A.md`
9. `docs/phases/phase-10U.md`
10. `project-state/project-state.snapshot.json`
11. `project-state/latest-handoff.json`
12. `project-state/provider-handoff.json`
13. `project-state/active-task.json`
14. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
