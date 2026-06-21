# Next Action

## What To Do Next

Proceed to Phase 10V: Actual Write Authorization Request.

## Why

Phase 10U adds a local Real Write Approval Boundary after the Phase 10T guarded simulator review gate. It defines approval scope, checklist confirmations, audit requirements, rollback approval requirements, blocked reasons, and handoff while keeping actual registry write, registry mutation, publication, production writer creation, current User App Shell package replacement, and production package creation blocked.

## Recommended 10V Scope

- Request explicit owner authorization for any future actual write path without executing a registry write.
- Keep authorization language precise: whether the owner authorizes a future request, and what still remains blocked.
- Keep all behavior explicit, local, reviewable, owner-gated, and blocked from automatic registry mutation, publication, production writer execution, or current User App Shell package replacement.
- Preserve QA trace, human review trace, privacy trace, candidate trace, contract trace, preview trace, official draft trace, publish gate trace, registry preparation / write gate / writer draft / authorization gate / execution design / implementation gate / implementation draft / final review gate / execution authorization / execution plan / simulator / review gate / approval boundary trace.

## What Not To Do

- Do not treat Phase 10U approval boundary ready as actual registry write authorization or registry write execution.
- Do not execute a registry write.
- Do not mutate registry state.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not mark production readiness or production package output.
- Do not add backend, database, account system, cloud sync, analytics, camera capture, AR, OpenAI/external API calls, native app implementation, React Native, Flutter, App Store/TestFlight work, service worker, ecommerce, community, paid features, or new runtime dependencies.
- Do not train on FaceMesh candidates, draft steps, template drafts, human review records, user app state, draft previews, gates, handoffs, simulator outputs, simulator review outputs, approval boundary outputs, or real user photos.
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
7. `docs/product/guarded-simulator-review-gate.md`
8. `docs/product/guarded-simulator-review-checklist.md`
9. `docs/product/guarded-simulator-review-handoff.md`
10. `docs/product/real-write-approval-boundary.md`
11. `docs/product/real-write-approval-checklist.md`
12. `docs/product/real-write-approval-handoff.md`
13. `docs/phases/phase-10T.md`
14. `docs/phases/phase-10U.md`
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
