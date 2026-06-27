# Next Action

## What To Do Next

Proceed to Phase 11D: User App Demo Readiness & Operator QA.

## Why

Phase 11C kept the post-10U registry write chain paused and polished the
ordinary-user User App MVP shell content. The shell now has a more concrete
practice path:

Home -> Template Selection -> Template Detail -> Preparation ->
Step-by-step Guidance -> Completion.

Template content now uses Chinese user-facing titles, summaries, scenarios,
tools, product placeholders, step instructions, common mistakes, correction
tips, safety notes, and region guidance. The UI now shows step preview, region
guidance, practice-first copy, region badge, intensity reminder, technique
breakdown, final check, and completed-region summary.

Phase 11D should verify that this demo is ready for an operator-led walkthrough
without adding production app scope.

## Recommended 11D Scope

- Add operator demo checklist for the User App MVP shell.
- Verify ordinary-user path wording, mobile layout, and privacy copy.
- Verify admin tools remain behind explicit admin mode.
- Verify Template Studio and registry-chain terminology do not appear in the
  ordinary-user path.
- Record demo readiness risks and blocked conditions.

## What Not To Do

- Do not resume Phase 10V or actual write authorization in 11D.
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
9. `docs/product/user-app-visual-guidance-and-template-content.md`
10. `docs/phases/phase-11A.md`
11. `docs/phases/phase-11B.md`
12. `docs/phases/phase-11C.md`
13. `docs/phases/phase-10U.md`
14. `project-state/project-state.snapshot.json`
15. `project-state/latest-handoff.json`
16. `project-state/provider-handoff.json`
17. `project-state/active-task.json`
18. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
