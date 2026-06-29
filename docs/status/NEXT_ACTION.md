# Next Action

## What To Do Next

Proceed to Phase 13B: Founder Trial Feedback Capture & MVP Gap Prioritization.

## Why

Phase 13A packages the current User App MVP demo into a local founder-review
content pack:

```text
Demo Route A: User App MVP
Demo Route B: Vision Analysis
Demo Route C: Template Studio Operator Workflow
-> Draft Preview QA
-> Acceptance Trial
-> Phase 13A Founder Demo Review
-> Phase 13B Founder feedback capture and MVP gap prioritization
```

The system can now show three MVP trial templates, run founder-demo checks, keep
ordinary users away from admin terms, and verify that registry, publish,
production writer, automatic extraction, and privacy claims stay blocked.

## Recommended 13B Scope

- Capture founder feedback in a structured local model.
- Prioritize MVP gaps from trial content, User App path, and operator workflow.
- Decide what must be fixed before another founder/user trial.
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
- Do not generate or mutate a formal `UserAppTemplatePackage` from 12E output.
- Do not treat Acceptance Trial as production readiness.
- Do not claim fully automatic high-quality makeup extraction.
- Do not claim AI confirmed analysis.
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
8. `docs/product/user-app-demo-readiness.md`
9. `docs/product/operator-qa-checklist.md`
10. `docs/product/mvp-trial-content-pack.md`
11. `docs/product/founder-demo-review-script.md`
12. `docs/product/photo-to-template-draft-reality-check.md`
13. `docs/product/makeup-semantic-extraction-baseline.md`
14. `docs/product/photo-to-template-draft-integration.md`
15. `docs/product/photo-to-template-human-review-editing.md`
16. `docs/product/photo-to-template-operator-workflow.md`
17. `docs/product/photo-to-template-draft-preview-qa.md`
18. `docs/phases/phase-12E.md`
19. `project-state/project-state.snapshot.json`
20. `project-state/latest-handoff.json`
21. `project-state/provider-handoff.json`
22. `project-state/active-task.json`
23. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
