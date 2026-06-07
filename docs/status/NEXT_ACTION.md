# Next Action

## What To Do Next

Proceed to Phase 9D: Internal Trial Learning Summary & Product Decision Gate.

## Why

Phase 9C added the internal trial iteration plan, backlog, and priority framework. The current decision is that anonymous/mock iteration planning can now be summarized into learning and product decision criteria, while production release remains out of scope.

Historical recovery notes: Phase 7H browser/mobile QA remains the local prototype QA baseline, Phase 8B PWA/mobile polish is complete, Phase 8C trial pack is complete, Phase 8D content QA is complete, Phase 8E release readiness is complete, Phase 9A internal trial operations is complete, Phase 9B internal trial result review is complete, and Phase 9C internal trial iteration planning is complete.

## Recommended 9D Scope

- Summarize internal trial learnings from anonymous/mock review and iteration planning.
- Decide whether to continue internal trials, revise content, revise Shell, revise trial operations, pause for privacy/scope, or propose a later implementation gate.
- Keep the work local/documented unless a later explicit gate approves real collection systems.

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
17. `docs/user-app/template-content-qa-for-trial.md`
18. `docs/user-app/trial-template-selection.md`
19. `docs/user-app/trial-content-readiness.md`
20. `docs/product/template-content-qa-checklist.md`
21. `docs/phases/phase-8C.md`
22. `docs/phases/phase-8D.md`
23. `docs/user-app/mvp-release-readiness-gate.md`
24. `docs/user-app/trial-go-no-go-decision.md`
25. `docs/product/internal-trial-launch-checklist.md`
26. `docs/phases/phase-8E.md`
27. `docs/product/internal-trial-operations-pack.md`
28. `docs/product/internal-trial-participant-guide.md`
29. `docs/product/internal-trial-observation-template.md`
30. `docs/product/internal-trial-outcome-review.md`
31. `docs/phases/phase-9A.md`
32. `docs/product/internal-trial-result-review-framework.md`
33. `docs/product/internal-trial-issue-taxonomy.md`
34. `docs/product/internal-trial-decision-framework.md`
35. `docs/phases/phase-9B.md`
36. `docs/product/internal-trial-iteration-plan.md`
37. `docs/product/internal-trial-iteration-backlog.md`
38. `docs/product/internal-trial-priority-framework.md`
39. `docs/phases/phase-9C.md`
40. `project-state/project-state.snapshot.json`
41. `project-state/latest-handoff.json`
42. `project-state/provider-handoff.json`
43. `project-state/active-task.json`
44. `project-state/guardrails.json`

Then run:

```bash
npm run project:context
npm run project:status
npm run typecheck
npm run test
npm run build
```
