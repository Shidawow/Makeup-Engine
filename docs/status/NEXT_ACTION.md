# Next Action

## What To Do Next

Proceed to Phase 9H: Anonymous Internal Trial Launch Pack.

## Why

Phase 9G completed the anonymous internal trial dry run pack, checklist, and review. The dry run review supports preparing an anonymous internal trial launch pack, but the project still has no production user app, no backend evidence system, and no approval to collect sensitive data or begin MVP validation planning.

Historical recovery notes: Phase 7H browser/mobile QA remains the local prototype QA baseline, Phase 8B PWA/mobile polish is complete, Phase 8C trial pack is complete, Phase 8D content QA is complete, Phase 8E release readiness is complete, Phase 9A internal trial operations is complete, Phase 9B internal trial result review is complete, Phase 9C internal trial iteration planning is complete, Phase 9D internal trial learning decision gate is complete, Phase 9E evidence pack is complete, Phase 9F evidence collection preparation is complete, and Phase 9G anonymous internal dry run is complete.

## Recommended 9H Scope

- Prepare an anonymous internal trial launch pack.
- Use the Phase 9F protocol and Phase 9G dry run review.
- Keep launch preparation local, anonymous, and administrator-only.
- Do not proceed to MVP validation planning until anonymous internal trial launch evidence quality is sufficient.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not add backend, database, account system, cloud sync, analytics, camera capture, AR, OpenAI/external API calls, training, native iOS implementation, React Native, Flutter, online publication, App Store/TestFlight work, service worker, offline cache, push notification, background sync, install tracking, ecommerce, community, paid features, or new runtime dependencies.
- Do not collect real user photos, names, contact information, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, upload data, or training data.
- Do not mutate `UserAppTemplatePackage` from dry run pack, checklist, review, evidence collection preparation, trial tasks, trial feedback, readiness, sessions, preferences, recommendations, decision gates, or admin panels.
- Do not write real user trial records into `project-state`.
- Do not modify legacy runtime areas.

## Entry For The Next Codex Session

Read these files first:

1. `AGENTS.md`
2. `START_HERE.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
5. `docs/status/CURRENT_PROJECT_STATUS.md`
6. `docs/status/NEXT_ACTION.md`
7. `docs/product/anonymous-internal-trial-dry-run-pack.md`
8. `docs/product/anonymous-internal-trial-dry-run-checklist.md`
9. `docs/product/anonymous-internal-trial-dry-run-review.md`
10. `docs/phases/phase-9G.md`
11. `project-state/project-state.snapshot.json`
12. `project-state/latest-handoff.json`
13. `project-state/provider-handoff.json`
14. `project-state/active-task.json`
15. `project-state/guardrails.json`

Then run:

```bash
npm run project:context
npm run project:status
npm run typecheck
npm run test
npm run build
```
