# Next Action

## What To Do Next

Proceed to Phase 10B: Template Draft QA & Human Review Workflow.

## Why

Phase 10A added the first FaceMesh-driven makeup intelligence baseline. The
system can now turn real local FaceMesh landmarks into region QA, candidate
makeup attributes, rule-based draft steps, and a draft-only template. The next
safe step is not production publishing; it is human review workflow around those
drafts.

## Recommended 10B Scope

- Add draft QA checks for region coverage, candidate confidence, step order,
  wording, and template safety.
- Add reviewer decisions: accept as draft, request revision, reject, or block.
- Add reviewer notes and next-action summaries.
- Keep draft review local and administrator-only.
- Preserve `UserAppTemplatePackage` as a separate export contract that Phase 10A
  drafts cannot mutate automatically.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not publish Phase 10A drafts automatically.
- Do not add backend, database, account system, cloud sync, analytics, camera
  capture, AR, OpenAI/external API calls, native app implementation, React
  Native, Flutter, App Store/TestFlight work, service worker, ecommerce,
  community, paid features, or new runtime dependencies.
- Do not train on Phase 10A candidates, draft steps, template drafts, user app
  state, or real user photos.
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
10. `docs/phases/phase-10A.md`
11. `project-state/project-state.snapshot.json`
12. `project-state/latest-handoff.json`
13. `project-state/provider-handoff.json`
14. `project-state/active-task.json`
15. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
