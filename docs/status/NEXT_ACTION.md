# Next Action

## What To Do Next

Proceed to Phase 12D: Photo-to-Template Operator Workflow & Draft Preview QA.

## Why

Phase 12C establishes a safe bridge from semantic candidates to editable draft
fields:

```text
local photo analysis
-> FaceMesh / region QA
-> MakeupSemanticExtractionReport
-> semantic candidate to draft field binding
-> local human review editing
-> draft QA readiness
```

The system can now show an operator how candidate evidence may shape title,
summary, style, scenario, difficulty, time, tools, steps, tips, mistakes,
correction hints, region guidance, and user app preview notes. Every field
remains candidate-only, not final, and human-review-required.

## Recommended 12D Scope

- Review the operator workflow from Vision Analysis to semantic extraction,
  draft integration, human review editing, and draft QA.
- Polish the draft preview QA surface so operators can see what is ready,
  warning, blocked, or still needs review.
- Confirm no duplicate panels, no unclear next step, and no internal terms in
  the ordinary User App path.
- Keep Reality Check source labels honest after `semantic_candidate_integrated`
  fields enter the draft chain.

## What Not To Do

- Do not resume Phase 10V or actual write authorization.
- Do not execute a registry write.
- Do not mutate registry state.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not generate or mutate `UserAppTemplatePackage` from 12C output.
- Do not treat semantic candidates as final recognition or AI-confirmed
  analysis.
- Do not claim fully automatic high-quality makeup extraction.
- Do not add backend, database, login, payment, analytics, camera capture, AR,
  OpenAI/external API calls, native app implementation, React Native, Flutter,
  App Store/TestFlight work, service worker, ecommerce, community, paid
  features, or new runtime dependencies.
- Do not upload, store, or train on real user photos.
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
12. `docs/product/photo-to-template-draft-integration.md`
13. `docs/product/photo-to-template-human-review-editing.md`
14. `docs/product/vision-readiness-score.md`
15. `docs/phases/phase-12A.md`
16. `docs/phases/phase-12B.md`
17. `docs/phases/phase-12C.md`
18. `project-state/project-state.snapshot.json`
19. `project-state/latest-handoff.json`
20. `project-state/provider-handoff.json`
21. `project-state/active-task.json`
22. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
