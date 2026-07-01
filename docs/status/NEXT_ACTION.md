# Next Action

## What To Do Next

Proceed to Phase 14C: Internal Trial Dry Run.

## Why

Phase 14B adds an Internal Trial Prep pack over the passed local founder demo:

```text
Phase 14A Internal Founder Demo Run
-> role-only participant profiles
-> safe feedback prompts
-> internal trial routes
-> privacy / data / scope checklist
-> Internal Trial Prep validation
-> Phase 14C Internal Trial Dry Run
```

The system can now prepare a small-scope internal dry run while keeping the
registry chain paused after Phase 10U and keeping all trial evidence local,
anonymous, and role/profile based.

## Recommended 14C Scope

- Run a dry run using only the 14B route checklist.
- Keep participants represented by role profiles only.
- Record only anonymous observations and safe feedback answers.
- Confirm ordinary User App, mobile demo, template content, operator demo, and
  boundary explanation are usable before any broader internal trial.
- Keep photo-to-template semi-automatic, draft-only, and human-review-required.

## What Not To Do

- Do not make this a public beta.
- Do not create a real user research system.
- Do not collect real names, contact information, photos, health information,
  sensitive identity information, local photo paths, object URLs, base64 image
  payloads, biometrics, backend records, analytics ids, or training data.
- Do not add backend, database, account, payment, analytics, camera capture, AR,
  OpenAI/external API calls, native app implementation, React Native, Flutter,
  App Store/TestFlight work, ecommerce, community, paid features, or new runtime
  dependencies.
- Do not resume Phase 10V or actual write authorization.
- Do not execute or simulate a real registry write as product behavior.
- Do not mutate registry state.
- Do not publish to the user app.
- Do not create or execute a production writer.
- Do not replace the current User App Shell package.
- Do not treat trial notes as analytics, production readiness, registry
  readiness, public market validation, or final roadmap.
- Do not claim fully automatic high-quality makeup extraction.
- Do not claim AI confirmed recognition.
- Do not commit `public/mediapipe/**` `.task` or `.wasm` assets.
- Do not modify legacy runtime areas.

## Entry For The Next Codex Session

Read these files first:

1. `AGENTS.md`
2. `START_HERE.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
5. `docs/status/CURRENT_PROJECT_STATUS.md`
6. `docs/status/CURRENT_PHASE.md`
7. `docs/status/NEXT_ACTION.md`
8. `docs/product/internal-trial-prep.md`
9. `docs/product/internal-trial-feedback-prompts.md`
10. `docs/product/internal-trial-safety-boundaries.md`
11. `docs/product/internal-founder-demo-run.md`
12. `docs/product/internal-founder-demo-run-checklist.md`
13. `docs/product/mvp-demo-gap-resolution-sprint-1.md`
14. `docs/phases/phase-14A.md`
15. `docs/phases/phase-14B.md`
16. `project-state/project-state.snapshot.json`
17. `project-state/latest-handoff.json`
18. `project-state/provider-handoff.json`
19. `project-state/active-task.json`
20. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
