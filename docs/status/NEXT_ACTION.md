# Next Action

## What To Do Next

Proceed to Phase 8D: Template Content QA for Real User Trial.

## Why

Phase 8C added a local User App MVP Trial Pack, trial feedback structure, privacy-safe mock feedback summary, trial readiness model, and administrator trial panels. The next bottleneck is content quality: whether template copy, step wording, region instructions, warnings, tools/products, and mobile guidance clarity are good enough for a real user trial.

Historical recovery notes: Phase 7H browser/mobile QA remains the local prototype QA baseline, Phase 8B PWA/mobile polish is complete, and Phase 8C trial pack is complete.

## Recommended 8D Scope

- QA trial-selected template copy.
- QA region instructions and step wording.
- QA warning and blocked-state clarity.
- QA tool/product usefulness.
- QA mobile guidance readability for the trial pack.
- Keep the work content/readiness-only.

## What Not To Do

- Do not build the production user app inside this repository.
- Do not add backend, database, account system, cloud sync, analytics, camera capture, AR, OpenAI/external API calls, training, native iOS implementation, React Native, Flutter, online publication, App Store/TestFlight work, service worker, offline cache, push notification, background sync, install tracking, ecommerce, community, paid features, or new runtime dependencies.
- Do not collect real user photos, names, contact information, health information, sensitive identity information, biometrics, backend records, analytics records, or training data.
- Do not mutate `UserAppTemplatePackage` from trial tasks, trial feedback, readiness, sessions, preferences, recommendations, or admin panels.
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
7. `docs/app-roadmap/app-technology-route-decision.md`
8. `docs/app-roadmap/user-app-mvp-plan.md`
9. `docs/app-roadmap/makeup-engine-vs-user-app-boundary.md`
10. `docs/app-roadmap/phase-8-roadmap.md`
11. `docs/product/user-app-v1-non-goals.md`
12. `docs/user-app/user-app-mvp-trial-pack.md`
13. `docs/user-app/user-app-trial-feedback.md`
14. `docs/user-app/user-app-trial-readiness.md`
15. `docs/product/user-app-trial-script.md`
16. `docs/product/user-app-feedback-questionnaire.md`
17. `docs/phases/phase-8C.md`
18. `project-state/project-state.snapshot.json`
19. `project-state/latest-handoff.json`
20. `project-state/provider-handoff.json`
21. `project-state/active-task.json`
22. `project-state/guardrails.json`

Then run:

```bash
npm run project:context
npm run project:status
npm run typecheck
npm run test
npm run build
```
