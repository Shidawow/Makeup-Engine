# Next Action

## What To Do Next

Proceed to Phase 10Q: Real Write Execution Authorization.

## Why

Phase 10P adds a local final real write review gate over the Phase 10O
implementation draft validation result. It records owner authorization as
review-gate-only, verifies that actual registry write, publication, production
writer creation, and current User App Shell package replacement all remain
blocked, and hands off only to a future real write execution authorization
phase.

## Recommended 10Q Scope

- Review whether a future real write execution authorization phase should be
  opened after the Phase 10P final review gate.
- Keep authorization explicit, local, reviewable, owner-gated, and blocked from
  automatic registry mutation, publication, production writer execution, or
  current User App Shell package replacement.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, publish gate trace,
  registry preparation / write gate / writer draft / authorization gate /
  execution design / implementation gate / implementation draft / final review
  gate trace.

## What Not To Do

- Do not treat Phase 10P final review gate ready as actual registry write
  authorization.
- Do not execute a registry write.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not mark production readiness or production package output.
- Do not add backend, database, account system, cloud sync, analytics, camera
  capture, AR, OpenAI/external API calls, native app implementation, React
  Native, Flutter, App Store/TestFlight work, service worker, ecommerce,
  community, paid features, or new runtime dependencies.
- Do not train on FaceMesh candidates, draft steps, template drafts, human
  review records, user app state, draft previews, gates, handoffs, or real user
  photos.
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
7. `docs/product/real-registry-write-implementation-draft.md`
8. `docs/product/real-registry-write-implementation-draft-validation.md`
9. `docs/product/real-registry-write-implementation-draft-handoff.md`
10. `docs/product/final-real-write-review-gate.md`
11. `docs/product/final-real-write-review-checklist.md`
12. `docs/product/final-real-write-review-handoff.md`
13. `docs/phases/phase-10O.md`
14. `docs/phases/phase-10P.md`
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
