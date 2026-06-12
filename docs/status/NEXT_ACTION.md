# Next Action

## What To Do Next

Proceed to Phase 9G: Anonymous Internal Trial Dry Run Pack.

## Why

Phase 9F completed the internal trial evidence collection protocol, checklist, and quality gate. The quality gate supports preparing an anonymous internal dry run, but the project still has no real internal trial evidence records and no production user app.

Historical recovery notes: Phase 7H browser/mobile QA remains the local prototype QA baseline, Phase 8B PWA/mobile polish is complete, Phase 8C trial pack is complete, Phase 8D content QA is complete, Phase 8E release readiness is complete, Phase 9A internal trial operations is complete, Phase 9B internal trial result review is complete, Phase 9C internal trial iteration planning is complete, Phase 9D internal trial learning decision gate is complete, Phase 9E internal trial evidence pack is complete, and Phase 9F evidence collection preparation is complete.

## Recommended 9G Scope

- Prepare an anonymous internal trial dry run pack.
- Use the Phase 9F protocol, checklist, participant notice, stop conditions, and quality gate.
- Keep evidence local and anonymous.
- Do not proceed to MVP validation planning until dry run evidence quality is sufficient.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not add backend, database, account system, cloud sync, analytics, camera capture, AR, OpenAI/external API calls, training, native iOS implementation, React Native, Flutter, online publication, App Store/TestFlight work, service worker, offline cache, push notification, background sync, install tracking, ecommerce, community, paid features, or new runtime dependencies.
- Do not collect real user photos, names, contact information, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, or training data.
- Do not mutate `UserAppTemplatePackage` from evidence collection preparation, evidence pack, evidence summary, sufficiency gate, trial tasks, trial feedback, readiness, sessions, preferences, recommendations, decision gates, or admin panels.
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
7. `docs/product/internal-trial-evidence-collection-protocol.md`
8. `docs/product/internal-trial-evidence-collection-checklist.md`
9. `docs/product/internal-trial-evidence-quality-gate.md`
10. `docs/phases/phase-9F.md`
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
