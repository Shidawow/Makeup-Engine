# Next Action

## What To Do Next

Proceed to Phase 8A: Product Route Decision / App MVP Planning.

## Why

Phase 7H completed the local browser/mobile QA harness around the User App MVP Shell. The prototype now has deterministic coverage for HTTP smoke, narrow viewport readiness, critical shell paths, empty/warning/blocked/recovery states, Chinese UI copy, and privacy boundary copy. It is still a local contract-driven prototype and not a production user app.

The next bottleneck is deciding the future app route before implementing more user-side behavior: web prototype, native iOS, or cross-platform shell, plus what remains inside Makeup Engine versus a separate user-facing app repository.

## Recommended 8A Scope

- Define the app technology route and ownership boundary.
- Decide whether the user-facing MVP remains a web prototype first or moves to native/cross-platform planning.
- Keep `UserAppTemplatePackage` as the consumption contract from Makeup Engine.
- Define which QA evidence from Phase 7H is enough to start app MVP planning.
- Keep real camera/photo capture, backend, accounts, cloud sync, AR, analytics, and production release work gated behind later explicit phases.

## What Not To Do

- Do not build the production user app inside this repository without a new phase gate.
- Do not add backend, database, account system, cloud sync, analytics, camera capture, AR, OpenAI/external API calls, training, native iOS implementation, or new runtime dependencies in the planning phase.
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
7. `docs/user-app/user-app-browser-mobile-qa.md`
8. `docs/user-app/user-app-e2e-readiness.md`
9. `docs/user-app/user-app-mobile-interaction-qa.md`
10. `docs/user-app/user-app-readiness-gate.md`
11. `docs/user-app/user-app-readiness-checklist.md`
12. `docs/privacy/user-app-session-data-boundary.md`
13. `docs/phases/phase-7H.md`
14. `project-state/project-state.snapshot.json`
15. `project-state/latest-handoff.json`
16. `project-state/provider-handoff.json`
17. `project-state/active-task.json`

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
