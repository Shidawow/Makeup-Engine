# Next Action

## What To Do Next

Proceed to Phase 13A: MVP Trial Content Pack & Founder Demo Review.

## Why

Phase 12E packages the current photo-to-template chain into an operator-readable
demo and acceptance trial:

```text
Demo Route A: User App MVP
Demo Route B: Vision Analysis
Demo Route C: Template Studio Operator Workflow
-> Draft Preview QA
-> Acceptance Trial
-> Phase 13A Founder Demo Review
```

The system can now explain how to start the app, show the ordinary User App MVP,
show local Vision Analysis, walk through the operator workflow, and verify that
forbidden claims and internal terms stay blocked.

## Recommended 13A Scope

- Prepare a founder-facing MVP trial content pack.
- Select demo templates and copy that are safe for review.
- Create founder review checklist and feedback capture structure.
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
10. `docs/product/photo-to-template-e2e-demo-script.md`
11. `docs/product/photo-to-template-acceptance-trial.md`
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
