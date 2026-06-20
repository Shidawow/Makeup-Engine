# Next Action

## What To Do Next

Proceed to Phase 10S: Guarded Real Write Execution Simulator.

## Why

Phase 10R adds a local real write execution plan over the Phase 10Q execution
authorization model. It describes execution sequence, preflight checks, write
lock, audit, rollback, failure handling, and dry-run verification while keeping
actual registry write, publication, production writer creation, current User
App Shell package replacement, and production package creation blocked.

## Recommended 10S Scope

- Build a guarded simulator for the Phase 10R execution plan without performing
  a real registry write.
- Keep simulator behavior explicit, local, reviewable, owner-gated, and blocked
  from automatic registry mutation, publication, production writer execution, or
  current User App Shell package replacement.
- Preserve QA trace, human review trace, privacy trace, candidate trace,
  contract trace, preview trace, official draft trace, publish gate trace,
  registry preparation / write gate / writer draft / authorization gate /
  execution design / implementation gate / implementation draft / final review
  gate / execution authorization / execution plan trace.

## What Not To Do

- Do not treat Phase 10R real write execution plan ready as actual registry
  write authorization or registry write execution.
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
7. `docs/product/real-write-execution-authorization.md`
8. `docs/product/real-write-execution-authorization-checklist.md`
9. `docs/product/real-write-execution-authorization-handoff.md`
10. `docs/product/real-write-execution-plan.md`
11. `docs/product/real-write-execution-plan-validation.md`
12. `docs/product/real-write-execution-plan-handoff.md`
13. `docs/phases/phase-10Q.md`
14. `docs/phases/phase-10R.md`
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
