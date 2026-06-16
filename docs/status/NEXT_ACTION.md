# Next Action

## What To Do Next

Proceed to Phase 10D: Candidate-to-App Package Contract Preparation.

## Why

Phase 10C packages approved template library candidates with validation and
handoff while preserving the no-publish and no-auto-`UserAppTemplatePackage`
boundaries. The next safe step is to prepare an explicit contract bridge for a
future candidate-to-app package workflow without generating app packages
automatically.

## Recommended 10D Scope

- Define candidate-to-app contract preparation inputs and blockers.
- Map candidate package fields to future app contract requirements without
  mutating `UserAppTemplatePackage`.
- Preserve explicit human review, QA trace, privacy trace, and package lineage.
- Keep app package creation as a separate reviewed action.
- Add docs, fixtures, and tests for the candidate-to-app boundary.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not publish template candidates automatically.
- Do not write candidate packages into the formal Template Library
  automatically.
- Do not generate or mutate `UserAppTemplatePackage` from candidate packages.
- Do not add backend, database, account system, cloud sync, analytics, camera
  capture, AR, OpenAI/external API calls, native app implementation, React
  Native, Flutter, App Store/TestFlight work, service worker, ecommerce,
  community, paid features, or new runtime dependencies.
- Do not train on FaceMesh candidates, draft steps, template drafts, human
  review records, user app state, or real user photos.
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
7. `docs/product/facemesh-region-qa-baseline.md`
8. `docs/product/makeup-attribute-candidate-baseline.md`
9. `docs/product/rule-based-template-draft-baseline.md`
10. `docs/product/template-draft-qa.md`
11. `docs/product/template-draft-human-review-workflow.md`
12. `docs/product/template-draft-review-workflow.md`
13. `docs/phases/phase-10B.md`
14. `docs/product/template-library-candidate-package.md`
15. `docs/product/template-library-candidate-validation.md`
16. `docs/product/template-library-candidate-handoff.md`
17. `docs/phases/phase-10C.md`
18. `project-state/project-state.snapshot.json`
19. `project-state/latest-handoff.json`
20. `project-state/provider-handoff.json`
21. `project-state/active-task.json`
22. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
