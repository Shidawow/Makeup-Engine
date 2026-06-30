# Next Action

## What To Do Next

Proceed to Phase 14A: Internal Founder Demo Run.

## Why

Phase 13D resolves the first MVP demo gaps from the Phase 13C sprint plan:

```text
Demo Route A: User App MVP
Demo Route B: Vision Analysis
Demo Route C: Template Studio Operator Workflow
-> Draft Preview QA
-> Acceptance Trial
-> Phase 13A Founder Demo Review
-> Phase 13B Founder feedback capture and MVP gap prioritization
-> Phase 13C MVP gap resolution sprint planning
-> Phase 13D MVP demo gap resolution sprint 1
-> Phase 14A internal founder demo run
```

The system can now show a clearer ordinary-user User App MVP path, consistent
three-template trial content, safer step guidance wording, mobile demo spacing,
and tighter Template Studio operator explanations while preserving all
no-registry/no-production boundaries.

## Recommended 14A Scope

- Run an internal founder demo using the local User App MVP, Vision Analysis,
  and Template Studio operator flow.
- Use the 13D resolution report as the demo readiness evidence.
- Capture only internal/founder notes; do not treat them as analytics or real
  user research.
- Decide whether to proceed after demo, run Phase 13E for more polish, or
  prepare a later validation plan.
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
- Do not treat founder/internal feedback, sprint planning, or founder demo notes
  as real user research, analytics, production readiness, or final roadmap.
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
12. `docs/product/mvp-gap-resolution-sprint-plan.md`
13. `docs/product/mvp-gap-resolution-13d-candidate-scope.md`
14. `docs/product/mvp-demo-gap-resolution-sprint-1.md`
15. `docs/product/mvp-demo-gap-resolution-evidence.md`
16. `docs/product/photo-to-template-acceptance-trial.md`
17. `docs/phases/phase-13A.md`
18. `docs/phases/phase-13B.md`
19. `docs/phases/phase-13C.md`
20. `docs/phases/phase-13D.md`
21. `project-state/project-state.snapshot.json`
22. `project-state/latest-handoff.json`
23. `project-state/provider-handoff.json`
24. `project-state/active-task.json`
25. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
