# Next Action

## What To Do Next

Proceed to Phase 11C: User App Visual Guidance & Template Content Polish.

## Why

Phase 11B kept the post-10U registry write chain paused and polished the
ordinary-user User App guided step experience. The shell now has a clearer path:

Home -> Template Selection -> Template Detail -> Preparation ->
Step-by-step Guidance -> Completion.

Preparation now includes the tool checklist, time, step count, privacy reminder,
and primary start action. Step guidance now shows current step number, region,
tools/products, instructions, cautions, correction tips, progress, and larger
mobile-friendly actions. Completion now includes template name and step review.

Phase 11C should polish visual guidance and template content so the demo feels
more concrete without adding camera, AR, backend, API, registry write, or
production app scope.

## Recommended 11C Scope

- Improve user-facing visual guidance copy for regions, tools, and step goals.
- Polish template content so steps read like real makeup coaching instructions.
- Keep preparation and completion concise while making the practice flow more demonstrable.
- Keep the ordinary-user path free of registry, write, simulator, approval, and debug terminology.
- Preserve Template Studio and Phase 10A-10U administrator safety chain without exposing it by default.

## What Not To Do

- Do not resume Phase 10V or actual write authorization in 11C.
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
8. `docs/product/user-app-guided-step-experience.md`
9. `docs/phases/phase-11A.md`
10. `docs/phases/phase-11B.md`
11. `docs/phases/phase-10U.md`
12. `project-state/project-state.snapshot.json`
13. `project-state/latest-handoff.json`
14. `project-state/provider-handoff.json`
15. `project-state/active-task.json`
16. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
