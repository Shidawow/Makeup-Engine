# Next Action

## What To Do Next

Proceed to Phase 12A: Photo-to-Template Draft Reality Check.

## Why

Phase 11D packages the current ordinary-user User App MVP shell for demo and
operator QA. The demo path is now documented and test-covered:

Home -> Template Selection -> Template Detail -> Preparation ->
Step-by-step Guidance -> Completion -> Restart / Return to Selection.

The current MVP can be demonstrated as a local shell with Chinese template
content, step preview, region guidance, preparation guidance, mobile-friendly
step actions, completion review, and explicit known limitations.

Phase 12A should evaluate the real photo-to-template draft capability instead
of assuming fully automatic high-quality makeup extraction.

## Recommended 12A Scope

- Audit the current photo-to-template draft chain from Vision Analysis through
  region QA, attribute candidates, step generation, template draft, QA, human
  review, and app-facing preview.
- Identify what is real, what is rule-based, what is fixture/demo content, and
  what still requires human correction.
- Define measurable draft-quality criteria.
- Document where the current system fails or needs manual intervention.
- Preserve ordinary-user MVP boundaries and keep Template Studio operator-only.

## What Not To Do

- Do not resume Phase 10V or actual write authorization.
- Do not execute a registry write.
- Do not mutate registry state.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not add backend, database, login, payment, analytics, camera capture, AR,
  OpenAI/external API calls, native app implementation, React Native, Flutter,
  App Store/TestFlight work, service worker, ecommerce, community, paid
  features, or new runtime dependencies.
- Do not upload, store, analyze, or train on real user photos outside the
  already scoped local operator Vision Analysis path.
- Do not commit `public/mediapipe/**` `.task` or `.wasm` assets.
- Do not modify legacy runtime areas.

## Entry For The Next Codex Session

Read these files first:

1. `AGENTS.md`
2. `START_HERE.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
5. `docs/status/CURRENT_PROJECT_STATUS.md`
6. `docs/status/CURRENT_PHASE.md`
7. `docs/status/NEXT_ACTION.md`
8. `docs/product/user-app-demo-readiness.md`
9. `docs/product/operator-qa-checklist.md`
10. `docs/product/user-app-visual-guidance-and-template-content.md`
11. `docs/product/vision-readiness-score.md`
12. `docs/phases/phase-11D.md`
13. `docs/phases/phase-11C.md`
14. `docs/phases/phase-10U.md`
15. `project-state/project-state.snapshot.json`
16. `project-state/latest-handoff.json`
17. `project-state/provider-handoff.json`
18. `project-state/active-task.json`
19. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
