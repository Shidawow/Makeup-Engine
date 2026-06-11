# Next Action

## What To Do Next

Proceed to Phase 9F: Internal Trial Evidence Collection Preparation.

## Why

Phase 9E completed the internal trial evidence pack, evidence summary, and evidence sufficiency gate. Current evidence remains anonymous/mock/example framework evidence rather than real internal trial evidence records, so the conservative next step is to prepare privacy-safe internal evidence collection before any MVP validation planning.

Historical recovery notes: Phase 7H browser/mobile QA remains the local prototype QA baseline, Phase 8B PWA/mobile polish is complete, Phase 8C trial pack is complete, Phase 8D content QA is complete, Phase 8E release readiness is complete, Phase 9A internal trial operations is complete, Phase 9B internal trial result review is complete, Phase 9C internal trial iteration planning is complete, Phase 9D internal trial learning decision gate is complete, and Phase 9E internal trial evidence pack is complete.

## Recommended 9F Scope

- Prepare privacy-safe internal trial evidence collection protocol.
- Define what anonymous observation and feedback summaries can be recorded.
- Keep evidence local and documented; do not create backend records, analytics records, AI analysis records, or training data.
- Do not proceed to MVP validation planning until real privacy-safe evidence is sufficient.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not add backend, database, account system, cloud sync, analytics, camera capture, AR, OpenAI/external API calls, training, native iOS implementation, React Native, Flutter, online publication, App Store/TestFlight work, service worker, offline cache, push notification, background sync, install tracking, ecommerce, community, paid features, or new runtime dependencies.
- Do not collect real user photos, names, contact information, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, or training data.
- Do not mutate `UserAppTemplatePackage` from evidence pack, evidence summary, sufficiency gate, trial tasks, trial feedback, readiness, sessions, preferences, recommendations, decision gates, or admin panels.
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
7. `docs/product/internal-trial-evidence-pack.md`
8. `docs/product/trial-evidence-summary.md`
9. `docs/product/evidence-sufficiency-gate.md`
10. `docs/phases/phase-9E.md`
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
