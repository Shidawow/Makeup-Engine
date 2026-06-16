# Next Action

## What To Do Next

Proceed to Phase 10C: Template Library Candidate Packaging.

## Why

Phase 10B separated Vision Analysis from Template Workbench and added draft QA,
human review, review queue status, and candidate handoff. The next safe step is
to define how approved template library candidates are packaged without
claiming production publication or automatic User App template export.

## Recommended 10C Scope

- Package approved template library candidates as local candidate artifacts.
- Preserve draft QA and human review lineage.
- Keep candidate package status separate from published template status.
- Keep `UserAppTemplatePackage` generation as a later explicit workflow.
- Add docs, fixtures, and tests for candidate packaging boundaries.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not publish template candidates automatically.
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
