# Next Action

## What To Do Next

Proceed to Phase 10N: Real Registry Write Implementation Gate.

## Why

Phase 10M adds a local controlled registry write execution design over the Phase
10L explicit authorization gate result while preserving design/dry-run-only, no
actual registry write, no publication, no production package, future owner
authorization, audit plan, rollback design, write lock requirements, and no User
App Shell package replacement boundaries. The next safe step is a real write
implementation gate that can review whether implementation may be designed
without silently writing, publishing, or replacing anything.

## Recommended 10N Scope

- Gate any future real registry write implementation design from the Phase 10M
  execution design result without executing it.
- Keep implementation-gate work local, deterministic, reviewable, explicitly
  owner-gated, and blocked from automatic publication, production replacement,
  or uncontrolled registry mutation.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, publish gate trace, and
  registry preparation / write gate / writer draft / authorization gate /
  execution design trace.
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
- Do not treat 10L explicit authorization gate readiness as actual registry
  write authorization, User App Shell package replacement, production readiness,
  or publication.
- Do not treat 10M controlled registry write execution design readiness as
  actual registry write authorization, User App Shell package replacement,
  production readiness, registry write execution, or publication.
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
25. `docs/product/explicit-registry-write-authorization-gate.md`
26. `docs/product/explicit-registry-write-authorization-checklist.md`
27. `docs/product/explicit-registry-write-authorization-handoff.md`
28. `docs/product/controlled-registry-write-execution-design.md`
29. `docs/product/controlled-registry-write-execution-validation.md`
30. `docs/product/controlled-registry-write-execution-handoff.md`
31. `docs/phases/phase-10F.md`
32. `docs/phases/phase-10G.md`
33. `docs/phases/phase-10H.md`
34. `docs/phases/phase-10I.md`
35. `docs/phases/phase-10J.md`
36. `docs/phases/phase-10K.md`
37. `docs/phases/phase-10L.md`
38. `docs/phases/phase-10M.md`
39. `project-state/project-state.snapshot.json`
40. `project-state/latest-handoff.json`
41. `project-state/provider-handoff.json`
42. `project-state/active-task.json`
43. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
