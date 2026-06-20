# Next Action

## What To Do Next

Proceed to Phase 10P: Final Real Write Review Gate.

## Why

Phase 10O adds a local real registry write implementation draft over the Phase
10N implementation gate result while preserving dry-run-only, no actual registry
write, no publication, no production writer, future owner authorization, writer
interface draft, transaction draft, write lock draft, audit event draft,
rollback command draft, and no User App Shell package replacement boundaries.
The next safe step is a final real write review gate that remains explicitly
gated and still cannot silently write, publish, create a production writer, or
replace anything.

## Recommended 10P Scope

- Review the Phase 10O implementation draft through a final real write review
  gate without executing it.
- Keep final-review-gate work local, deterministic, reviewable, explicitly
  owner-gated, and blocked from automatic publication, production replacement,
  production writer creation, or uncontrolled registry mutation.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, publish gate trace, and
  registry preparation / write gate / writer draft / authorization gate /
  execution design / implementation gate / implementation draft trace.
- Continue to avoid automatic publication, backend work, online release,
  production readiness, production writer execution, or current User App Shell
  package replacement.

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
- Do not treat 10N real registry write implementation gate readiness as actual
  registry write implementation, registry write execution, User App Shell
  package replacement, production readiness, or publication.
- Do not treat 10O real registry write implementation draft readiness as actual
  registry write, production writer readiness, registry write execution, User
  App Shell package replacement, production readiness, or publication.
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
31. `docs/product/real-registry-write-implementation-gate.md`
32. `docs/product/real-registry-write-implementation-checklist.md`
33. `docs/product/real-registry-write-implementation-handoff.md`
34. `docs/product/real-registry-write-implementation-draft.md`
35. `docs/product/real-registry-write-implementation-draft-validation.md`
36. `docs/product/real-registry-write-implementation-draft-handoff.md`
37. `docs/phases/phase-10F.md`
38. `docs/phases/phase-10G.md`
39. `docs/phases/phase-10H.md`
40. `docs/phases/phase-10I.md`
41. `docs/phases/phase-10J.md`
42. `docs/phases/phase-10K.md`
43. `docs/phases/phase-10L.md`
44. `docs/phases/phase-10M.md`
45. `docs/phases/phase-10N.md`
46. `docs/phases/phase-10O.md`
47. `project-state/project-state.snapshot.json`
48. `project-state/latest-handoff.json`
49. `project-state/provider-handoff.json`
50. `project-state/active-task.json`
51. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
