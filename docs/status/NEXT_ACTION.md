# Next Action

## What To Do Next

Proceed to Phase 10E: User App Package Draft Preview.

## Why

Phase 10D prepares an explicit candidate-to-app contract bridge with mapping
preview, validation, and handoff while preserving the no-publish,
no-registry-write, and no-formal-`UserAppTemplatePackage` boundaries. The next
safe step is a draft preview that still remains local and reviewable.

## Recommended 10E Scope

- Create a draft preview from validated candidate-to-app contract preparation.
- Keep the preview local, deterministic, and blocked by validation failures.
- Preserve QA trace, human review trace, privacy trace, and candidate lineage.
- Continue to avoid formal `UserAppTemplatePackage` generation unless an
  explicit later phase approves it.
- Add docs, fixtures, tests, and UI that distinguish draft preview from formal
  package generation.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not publish template candidates automatically.
- Do not write candidate packages into the formal Template Library
  automatically.
- Do not generate or mutate formal `UserAppTemplatePackage` from candidate
  contract preparation.
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
18. `docs/product/candidate-to-app-package-contract-preparation.md`
19. `docs/product/candidate-to-app-package-validation.md`
20. `docs/product/candidate-to-app-package-handoff.md`
21. `docs/phases/phase-10D.md`
22. `project-state/project-state.snapshot.json`
23. `project-state/latest-handoff.json`
24. `project-state/provider-handoff.json`
25. `project-state/active-task.json`
26. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
