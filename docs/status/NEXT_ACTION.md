# Next Action

## What To Do Next

Proceed to Phase 10K: Controlled UserAppTemplatePackage Registry Writer Draft.

## Why

Phase 10J adds a local registry write gate over the Phase 10I registry
preparation validation result while preserving no actual registry write, no
publication, no production package, and no User App Shell package replacement
boundaries. The next safe step is a controlled registry writer draft that can be
designed behind the gate without silently writing, publishing, or replacing
anything.

## Recommended 10K Scope

- Draft a controlled UserAppTemplatePackage registry writer interface over Phase
  10J gate-ready or gate-ready-with-warnings inputs.
- Keep the writer draft local, deterministic, reviewable, and explicitly
  blocked from automatic publication, production replacement, or uncontrolled
  registry mutation.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, publish gate trace, and
  registry preparation / write gate trace.
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
- Do not treat 10J registry write gate readiness as registry write execution,
  User App Shell package replacement, production readiness, or publication.
- Do not write a user app package registry unless a later explicit controlled
  writer phase remains draft-only and blocked from persistence.
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
20. `docs/product/user-app-template-package-registry-write-gate.md`
21. `docs/product/user-app-template-package-registry-write-gate-handoff.md`
22. `docs/phases/phase-10F.md`
23. `docs/phases/phase-10G.md`
24. `docs/phases/phase-10H.md`
25. `docs/phases/phase-10I.md`
26. `docs/phases/phase-10J.md`
27. `project-state/project-state.snapshot.json`
28. `project-state/latest-handoff.json`
29. `project-state/provider-handoff.json`
30. `project-state/active-task.json`
31. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
