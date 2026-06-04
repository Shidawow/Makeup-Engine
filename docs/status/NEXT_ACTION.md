# Next Action

## What To Do Next

Begin Phase 7H: User App Prototype Device/Browser QA Harness.

## Why

Phase 7G added deterministic App readiness and mobile interaction QA for the local User App MVP Shell. The shell now exposes `App 就绪度`, `移动端 QA`, and `交互检查` entries and can report whether the local prototype is ready, warning-only, needs mobile QA hardening, or blocked.

The next bottleneck is browser/device-like validation. Phase 7H should add a local smoke harness for narrow viewport rendering, tab navigation, step controls, local session controls, warning/blocked states, and readiness panels.

## Recommended 7H Scope

- Add browser or DOM-level smoke coverage for User App Shell narrow viewport flows.
- Verify App readiness, mobile QA, and interaction checklist entries are reachable.
- Verify no object URL, `data:image/`, local absolute path, photo bytes, biometric field, sensitive profile field, React state, recommendation record, or training marker leaks into rendered shell or local session payloads.
- Keep the harness local-only and deterministic.

## What Not To Do

- Do not build a full production user app.
- Do not add native iOS, backend, accounts, cloud sync, database storage, analytics, camera capture, AR, online publish, training, OpenAI API, external API, or new runtime dependencies.
- Do not write real user session, preference, recommendation, photo, or readiness records into `project-state`.
- Do not mutate `UserAppTemplatePackage`.
- Do not modify legacy runtime areas.

## Entry For The Next Codex Session

Read these files first:

1. `AGENTS.md`
2. `START_HERE.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/status/CURRENT_PROJECT_STATUS.md`
5. `docs/status/NEXT_ACTION.md`
6. `docs/user-app/user-app-mvp-shell.md`
7. `docs/user-app/step-guidance-ux-hardening.md`
8. `docs/user-app/user-app-session-persistence.md`
9. `docs/user-app/user-app-mobile-interaction-qa.md`
10. `docs/user-app/user-app-readiness-gate.md`
11. `docs/user-app/user-app-readiness-checklist.md`
12. `docs/privacy/user-app-session-data-boundary.md`
13. `docs/phases/phase-7G.md`
14. `project-state/project-state.snapshot.json`
15. `project-state/latest-handoff.json`
16. `project-state/provider-handoff.json`

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
