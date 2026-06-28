# Next Action

## What To Do Next

Proceed to Phase 12E: Photo-to-Template End-to-End Demo Script & Acceptance
Trial.

## Why

Phase 12D turns the current photo-to-template chain into a clearer
operator-led workflow:

```text
Vision Analysis / FaceMesh
-> Reality Check
-> Makeup Semantic Extraction
-> Draft Integration
-> Human Review Editing
-> Draft QA
-> User App Draft Preview QA
-> Phase 12E demo script handoff
```

The system can now show where a photo-to-template draft is ready, warning,
blocked, or still needs review before any demo acceptance trial. Draft Preview
QA also checks that ordinary user-facing preview copy does not leak source
metadata, confidence bands, evidence, reviewer notes, registry terms, publish
terms, production writer terms, or final/AI/fully-automatic claims.

## Recommended 12E Scope

- Create an end-to-end operator demo script for the photo-to-template flow.
- Define acceptance trial steps for Vision Analysis, semantic extraction,
  draft integration, human review editing, Draft QA, and Draft Preview QA.
- Define pass/fail criteria for demo acceptance.
- Keep all output local, operator-only, draft-only, and human-reviewed.
- Keep the registry chain paused after Phase 10U.

## What Not To Do

- Do not resume Phase 10V or actual write authorization.
- Do not execute a registry write.
- Do not mutate registry state.
- Do not create or execute a production writer.
- Do not publish to the user app.
- Do not replace the current User App Shell package.
- Do not generate or mutate a formal `UserAppTemplatePackage` from 12D output.
- Do not treat semantic candidates, draft fields, or preview QA as final
  recognition or AI-confirmed analysis.
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
14. `docs/product/photo-to-template-operator-workflow.md`
15. `docs/product/photo-to-template-draft-preview-qa.md`
16. `docs/phases/phase-12A.md`
17. `docs/phases/phase-12B.md`
18. `docs/phases/phase-12C.md`
19. `docs/phases/phase-12D.md`
20. `project-state/project-state.snapshot.json`
21. `project-state/latest-handoff.json`
22. `project-state/provider-handoff.json`
23. `project-state/active-task.json`
24. `project-state/guardrails.json`

Then run:

```bash
npm run mediapipe:check
npm run project:context
npm run project:status
npm run typecheck
npm run build
```
