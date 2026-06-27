# Next Action

## What To Do Next

Proceed to Phase 12C: Photo-to-Template Draft Integration & Human Review Editing.

## Why

Phase 12B establishes a candidate-only makeup semantic baseline:

```text
local photo analysis
-> FaceMesh / region QA
-> local pixel and semantic rules
-> MakeupSemanticExtractionReport
-> candidate-only semantic fields
-> human review required
```

The system can now explain lip, blush, eye, brow, highlight, contour, and
overall style candidate evidence. It still cannot claim final recognition,
AI-confirmed extraction, product shade matching, medical or skin diagnosis, or
fully automatic high-quality makeup extraction from arbitrary photos.

## Recommended 12C Scope

- Integrate 12B semantic candidates into the photo-to-template draft chain.
- Add human review editing affordances for accepting, revising, or keeping
  unknown semantic candidates.
- Preserve field evidence source labels in the draft and review flow.
- Keep all candidate-to-template movement local, deterministic, inspectable,
  and review-gated.
- Keep ordinary User App MVP boundaries separate from Template Studio operator
  semantic extraction and draft editing.

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
10. `docs/product/makeup-semantic-extraction-baseline.md`
11. `docs/product/makeup-semantic-field-evidence.md`
12. `docs/product/vision-readiness-score.md`
13. `docs/phases/phase-12A.md`
14. `docs/phases/phase-12B.md`
15. `project-state/project-state.snapshot.json`
16. `project-state/latest-handoff.json`
17. `project-state/provider-handoff.json`
18. `project-state/active-task.json`
19. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
