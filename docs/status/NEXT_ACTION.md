# Next Action

## What To Do Next

Proceed to Phase 10J: UserAppTemplatePackage Registry Write Gate.

## Why

Phase 10I adds a local registry preparation layer over the Phase 10H draft
publish gate while preserving no actual registry write, no publication, no
production package, and no User App Shell package replacement boundaries. The
next safe step is an explicit registry write gate that can review whether the
prepared entry is eligible for a later write action without silently writing or
publishing anything.

## Recommended 10J Scope

- Build a local UserAppTemplatePackage registry write gate over Phase 10I
  registry preparation ready or ready-with-warnings inputs.
- Keep the write gate local, deterministic, reviewable, and explicitly blocked
  from automatic publication or production replacement.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, publish gate trace, and
  registry preparation trace.
- Continue to avoid automatic publication, backend work, online release,
  production readiness, or current User App Shell package replacement.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not publish template candidates automatically.
- Do not write candidate packages into the formal Template Library
  automatically.
- Do not treat 10E draft preview as an official `UserAppTemplatePackage`.
- Do not treat 10G official draft builder output or 10H draft publish gate
  readiness as production readiness, registry write execution, User App Shell
  package replacement, or publication.
- Do not treat 10I registry preparation as registry write execution, User App
  Shell package replacement, production readiness, or publication.
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
7. `docs/product/user-app-package-draft-preview.md`
8. `docs/product/user-app-package-draft-preview-validation.md`
9. `docs/product/user-app-package-draft-preview-handoff.md`
10. `docs/product/official-user-app-package-draft-gate.md`
11. `docs/product/official-user-app-package-draft-gate-handoff.md`
12. `docs/product/official-user-app-template-package-draft-builder.md`
13. `docs/product/official-user-app-template-package-draft-validation.md`
14. `docs/product/official-user-app-template-package-draft-handoff.md`
15. `docs/product/user-app-template-package-draft-publish-gate.md`
16. `docs/product/user-app-template-package-draft-publish-gate-handoff.md`
17. `docs/product/user-app-template-package-registry-preparation.md`
18. `docs/product/user-app-template-package-registry-preparation-validation.md`
19. `docs/product/user-app-template-package-registry-preparation-handoff.md`
20. `docs/phases/phase-10F.md`
21. `docs/phases/phase-10G.md`
22. `docs/phases/phase-10H.md`
23. `docs/phases/phase-10I.md`
24. `project-state/project-state.snapshot.json`
25. `project-state/latest-handoff.json`
26. `project-state/provider-handoff.json`
27. `project-state/active-task.json`
28. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
