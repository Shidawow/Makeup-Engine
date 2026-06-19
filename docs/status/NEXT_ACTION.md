# Next Action

## What To Do Next

Proceed to Phase 10L: Explicit Registry Write Authorization Gate.

## Why

Phase 10K adds a local controlled registry writer draft over the Phase 10J
registry write gate result while preserving dry-run-only, no actual registry
write, no publication, no production package, and no User App Shell package
replacement boundaries. The next safe step is an explicit authorization gate
that can review the dry-run writer plan without silently writing, publishing, or
replacing anything.

## Recommended 10L Scope

- Review Phase 10K writer draft validation and handoff through an explicit
  authorization gate.
- Keep authorization local, deterministic, reviewable, and explicitly blocked
  from automatic publication, production replacement, or uncontrolled registry
  mutation unless a future phase separately implements execution.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, publish gate trace, and
  registry preparation / write gate / writer draft trace.
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
- Do not treat 10K controlled registry writer draft readiness as registry write
  authorization, User App Shell package replacement, production readiness, or
  publication.
- Do not execute a user app package registry write unless a later phase
  explicitly implements a controlled writer after separate authorization.
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
22. `docs/product/controlled-user-app-template-package-registry-writer-draft.md`
23. `docs/product/controlled-user-app-template-package-registry-writer-validation.md`
24. `docs/product/controlled-user-app-template-package-registry-writer-handoff.md`
25. `docs/phases/phase-10F.md`
26. `docs/phases/phase-10G.md`
27. `docs/phases/phase-10H.md`
28. `docs/phases/phase-10I.md`
29. `docs/phases/phase-10J.md`
30. `docs/phases/phase-10K.md`
31. `project-state/project-state.snapshot.json`
32. `project-state/latest-handoff.json`
33. `project-state/provider-handoff.json`
34. `project-state/active-task.json`
35. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
