# Next Action

## What To Do Next

Proceed to Phase 12B: Makeup Semantic Extraction Baseline.

## Why

Phase 12A establishes the true current photo-to-template boundary:

```text
local photo analysis
-> FaceMesh / region QA
-> local pixel and semantic rules
-> makeup attribute candidates
-> rule-based steps
-> template draft
-> human review
```

The system can support semi-automatic template draft generation with human
review, but it cannot claim fully automatic high-quality makeup extraction from
arbitrary photos.

## Recommended 12B Scope

- Improve makeup semantic extraction baseline for lip color/finish, blush
  placement, eye intensity, eyeshadow tone, eyeliner shape, brow shape, contour,
  and highlight.
- Keep extraction local, deterministic, inspectable, and review-gated.
- Preserve source labels that distinguish real image signals, FaceMesh geometry,
  region QA, pixel rules, semantic rules, fixture copy, placeholders, and
  human-required fields.
- Keep ordinary User App MVP boundaries separate from Template Studio operator
  reality checks.

## What Not To Do

- Do not resume Phase 10V or actual write authorization.
- Do not execute a registry write.
- Do not mutate registry state.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not add backend, database, login, payment, analytics, camera capture, AR,
  OpenAI/external API calls, native app implementation, React Native, Flutter,
  App Store/TestFlight work, service worker, ecommerce, community, paid
  features, or new runtime dependencies.
- Do not upload, store, or train on real user photos.
- Do not claim fully automatic high-quality makeup extraction.
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
8. `docs/product/photo-to-template-draft-reality-check.md`
9. `docs/product/photo-to-template-field-source-matrix.md`
10. `docs/product/vision-readiness-score.md`
11. `docs/phases/phase-12A.md`
12. `docs/phases/phase-11D.md`
13. `project-state/project-state.snapshot.json`
14. `project-state/latest-handoff.json`
15. `project-state/provider-handoff.json`
16. `project-state/active-task.json`
17. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
