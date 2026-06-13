# Next Action

## What To Do Next

Proceed to Phase 9K: Anonymous Internal Trial Evidence Round 2 Pack.

## Why

Phase 9J completed the anonymous internal trial follow-up iteration framework,
gap action plan, and follow-up readiness gate. The framework can turn 9I
evidence gaps into conservative next actions, but the project still has no
production user app, no backend evidence system, no real user database, and no
approval to collect sensitive data or overclaim MVP validation readiness.

Historical recovery notes: Phase 7H browser/mobile QA remains the local
prototype QA baseline, Phase 8B PWA/mobile polish is complete, Phase 8C trial
pack is complete, Phase 8D content QA is complete, Phase 8E release readiness is
complete, Phase 9A internal trial operations is complete, Phase 9B internal
trial result review is complete, Phase 9C internal trial iteration planning is
complete, Phase 9D internal trial learning decision gate is complete, Phase 9E
evidence pack is complete, Phase 9F evidence collection preparation is complete,
Phase 9G anonymous internal dry run is complete, Phase 9H anonymous internal
trial launch pack is complete, Phase 9I anonymous internal trial evidence
review is complete, and Phase 9J anonymous internal trial follow-up iteration is
complete.

## Recommended 9K Scope

- Use Phase 9J follow-up readiness and action plans to prepare an anonymous
  internal trial evidence round 2 pack.
- Keep round 2 local, anonymous, administrator-only, and small-scope.
- Carry forward fixes for evidence gaps, participant notice wording, admin
  notes, stop-condition handling, launch pack details, and evidence collection
  protocol issues.
- Do not proceed to production or public MVP validation unless a future explicit
  phase gate approves that scope.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not add backend, database, account system, cloud sync, analytics, camera
  capture, AR, OpenAI/external API calls, training, native iOS implementation,
  React Native, Flutter, online publication, App Store/TestFlight work, service
  worker, offline cache, push notification, background sync, install tracking,
  ecommerce, community, paid features, or new runtime dependencies.
- Do not collect real user photos, names, contact information, health
  information, sensitive identity information, biometrics, backend records,
  analytics records, AI analysis records, upload data, or training data.
- Do not mutate `UserAppTemplatePackage` from evidence review, gap review,
  decision input, launch pack, readiness, handoff, dry run, evidence collection
  preparation, trial tasks, trial feedback, readiness, sessions, preferences,
  recommendations, decision gates, or admin panels.
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
7. `docs/product/anonymous-internal-trial-evidence-review.md`
8. `docs/product/anonymous-internal-trial-evidence-gap-review.md`
9. `docs/product/anonymous-internal-trial-decision-input.md`
10. `docs/phases/phase-9I.md`
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
