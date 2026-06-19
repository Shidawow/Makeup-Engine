# Next Action

## What To Do Next

Proceed to Phase 10I: UserAppTemplatePackage Registry Preparation.

## Why

Phase 10H adds a local draft publish gate over the Phase 10G official draft
while preserving no-publish, no-registry-write, no production package, and no
User App Shell package replacement boundaries. The next safe step is registry
preparation that can remain local and explicit without publishing.

## Recommended 10I Scope

- Prepare a local UserAppTemplatePackage registry preparation model from Phase
  10H gate-ready inputs.
- Keep registry preparation local, deterministic, reviewable, and explicitly
  blocked from publication or production replacement.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, and publish gate trace.
- Continue to avoid automatic publication, production registry writes, backend
  work, online release, or current User App Shell package replacement.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not publish template candidates automatically.
- Do not write candidate packages into the formal Template Library
  automatically.
- Do not treat 10E draft preview as an official `UserAppTemplatePackage`.
- Do not treat 10G official draft builder output or 10H draft publish gate
  readiness as production readiness, registry write execution, User App Shell
  package replacement, or publication.
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
13. `docs/product/official-user-app-package-draft-gate.md`
14. `docs/product/official-user-app-package-draft-gate-handoff.md`
15. `docs/phases/phase-10D.md`
16. `docs/phases/phase-10E.md`
17. `docs/phases/phase-10F.md`
18. `docs/phases/phase-10G.md`
19. `docs/product/official-user-app-template-package-draft-builder.md`
20. `docs/product/official-user-app-template-package-draft-validation.md`
21. `docs/product/official-user-app-template-package-draft-handoff.md`
22. `docs/product/user-app-template-package-draft-publish-gate.md`
23. `docs/product/user-app-template-package-draft-publish-gate-handoff.md`
24. `docs/phases/phase-10H.md`
25. `project-state/project-state.snapshot.json`
26. `project-state/latest-handoff.json`
27. `project-state/provider-handoff.json`
28. `project-state/active-task.json`
29. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
