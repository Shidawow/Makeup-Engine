# Next Action

## What To Do Next

Proceed to Phase 13C: MVP Gap Resolution Sprint Planning.

## Why

Phase 13B captures founder/internal demo feedback and turns it into prioritized
MVP gaps:

```text
Demo Route A: User App MVP
Demo Route B: Vision Analysis
Demo Route C: Template Studio Operator Workflow
-> Draft Preview QA
-> Acceptance Trial
-> Phase 13A Founder Demo Review
-> Phase 13B Founder feedback capture and MVP gap prioritization
-> Phase 13C MVP gap resolution sprint planning
```

The system can now show three MVP trial templates, run founder-demo checks,
record deterministic founder/internal feedback, convert it into MVP demo gaps
and deferred production gaps, and keep ordinary users away from admin terms.

## Recommended 13C Scope

- Turn p0/p1 MVP demo gaps into a focused sprint plan.
- Decide which content, interaction, privacy-copy, and photo-to-template trust
  gaps must be fixed first.
- Keep production gaps deferred unless explicitly pulled into a later phase.
- Keep the photo-to-template workflow semi-automatic, draft-only, and
  human-review-required.
- Keep registry writes paused after Phase 10U.

## What Not To Do

- Do not resume Phase 10V or actual write authorization.
- Do not execute a registry write.
- Do not mutate registry state.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not treat founder/internal feedback as real user research or analytics.
- Do not generate or mutate a formal `UserAppTemplatePackage` from 12E/13A/13B
  output.
- Do not claim fully automatic high-quality makeup extraction.
- Do not add backend, database, login, payment, analytics, camera capture, AR,
  OpenAI/external API calls, native app implementation, React Native, Flutter,
  App Store/TestFlight work, service worker, ecommerce, community, paid
  features, or new runtime dependencies.
- Do not upload, store, or train on real user photos.
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
8. `docs/product/mvp-trial-content-pack.md`
9. `docs/product/founder-demo-review-script.md`
10. `docs/product/founder-trial-feedback-capture.md`
11. `docs/product/mvp-gap-prioritization.md`
12. `docs/product/photo-to-template-acceptance-trial.md`
13. `docs/phases/phase-13A.md`
14. `docs/phases/phase-13B.md`
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
