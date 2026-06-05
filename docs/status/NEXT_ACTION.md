# Next Action

## What To Do Next

Proceed to Phase 8B: PWA / Mobile Web MVP Polish.

## Why

Phase 8A selected a React Web / PWA MVP first route for the future user-facing app and documented the ownership boundary. Makeup Engine remains the template production system and local contract prototype. `UserAppTemplatePackage` remains the handoff contract.

The next bottleneck is polishing the mobile-first PWA MVP brief, UX acceptance criteria, package consumption expectations, and trial-readiness checklist without prematurely building the production app.

## Recommended 8B Scope

- Polish the React Web / PWA user app MVP brief.
- Define mobile web UX acceptance criteria for template discovery, template detail, step guidance, region instructions, tools/products, local onboarding, local preferences, local session progress, privacy notice, and photo/camera/AR placeholders.
- Define which product flows belong in the future app versus Makeup Engine.
- Define the future separate app repository/package handoff expectations without bootstrapping the repository.
- Keep `UserAppTemplatePackage` as the consumption contract from Makeup Engine.
- Keep real camera/photo capture, backend, accounts, cloud sync, AR, analytics, ecommerce, community, paid, native app, OpenAI API, external API, training, and production release work gated behind later explicit phases.

## Completed 8A Decision

- Selected React Web / PWA MVP first as the next route.
- Deferred native iOS, React Native, Flutter, backend, camera, AR, ecommerce, community, paid, OpenAI API, external API, and training until product scope and device requirements are clearer.
- Kept future production app ownership outside Makeup Engine.
- Accepted Phase 7H local browser/mobile QA as enough to start planning, not as production release approval.

## What Not To Do

- Do not build the production user app inside this repository without a new phase gate.
- Do not add backend, database, account system, cloud sync, analytics, camera capture, AR, OpenAI/external API calls, training, native iOS implementation, or new runtime dependencies in the planning phase.
- Do not add React Native, Flutter, ecommerce, community, paid features, app store release work, or model training in 8B unless the owner explicitly expands scope.
- Do not bootstrap the separate production app repository during 8B unless the owner explicitly expands scope.
- Do not mutate `UserAppTemplatePackage` from user app shell state.
- Do not write real user photos, photo bytes, object URLs, local paths, biometrics, preferences, sessions, recommendations, or readiness records into `project-state`.
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
12. `docs/user-app/user-app-browser-mobile-qa.md`
13. `docs/user-app/user-app-e2e-readiness.md`
14. `docs/user-app/user-app-mobile-interaction-qa.md`
15. `docs/user-app/user-app-readiness-gate.md`
16. `docs/user-app/user-app-readiness-checklist.md`
17. `docs/privacy/user-app-session-data-boundary.md`
18. `docs/user-app/user-app-product-route.md`
19. `docs/phases/phase-8A.md`
20. `docs/phases/phase-7H.md`
21. `project-state/project-state.snapshot.json`
22. `project-state/latest-handoff.json`
23. `project-state/provider-handoff.json`
24. `project-state/active-task.json`

Then run:

```bash
npm run project:context
npm run project:status
npm run typecheck
npm run test
npm run build
```

## Prompt Format

Use `docs/prompts/COMPACT_CODEX_TASK_TEMPLATE.md` by default. Include `npm run project:context` output or summary and `project-state/latest-handoff.json` summary. Do not paste full historical chat, full directory trees, `node_modules`, `dist`, `.test-dist`, or `.vite`.
