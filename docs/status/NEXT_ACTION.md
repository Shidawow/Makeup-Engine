# Next Action

## What To Do Next

Proceed to Phase 10F: Official User App Package Draft Gate.

## Why

Phase 10E creates a local user app package draft preview from validated 10D
candidate-to-app contract preparation while preserving no-publish,
no-registry-write, and no-formal-`UserAppTemplatePackage` boundaries. The next
safe step is a gate that decides whether an official user app package draft can
be prepared in a later explicit scope.

## Recommended 10F Scope

- Evaluate whether a 10E draft preview can enter an official user app package
  draft gate.
- Keep the gate local, deterministic, and blocked by validation failures.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, and preview validation trace.
- Continue to avoid formal `UserAppTemplatePackage` mutation unless the 10F gate
  explicitly defines a safe draft-only contract path.
- Add docs, fixtures, tests, and UI that distinguish official draft gate from
  production package generation.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not publish template candidates automatically.
- Do not write candidate packages into the formal Template Library
  automatically.
- Do not treat 10E draft preview as an official `UserAppTemplatePackage`.
- Do not write a user app package registry.
- Do not add backend, database, account system, cloud sync, analytics, camera
  capture, AR, OpenAI/external API calls, native app implementation, React
  Native, Flutter, App Store/TestFlight work, service worker, ecommerce,
  community, paid features, or new runtime dependencies.
- Do not train on FaceMesh candidates, draft steps, template drafts, human
  review records, user app state, draft previews, or real user photos.
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
7. `docs/product/candidate-to-app-package-contract-preparation.md`
8. `docs/product/candidate-to-app-package-validation.md`
9. `docs/product/candidate-to-app-package-handoff.md`
10. `docs/product/user-app-package-draft-preview.md`
11. `docs/product/user-app-package-draft-preview-validation.md`
12. `docs/product/user-app-package-draft-preview-handoff.md`
13. `docs/phases/phase-10D.md`
14. `docs/phases/phase-10E.md`
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
