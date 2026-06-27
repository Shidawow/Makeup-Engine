# Current Phase

## Phase State

- `lastCompletedPhase`: `12B`
- `lastCompletedBusinessPhase`: `12B`
- `currentPhase`: `12B`
- `currentPhaseName`: `Makeup Semantic Extraction Baseline`
- `nextRecommendedPhase`: `12C`
- `nextRecommendedPhaseName`: `Photo-to-Template Draft Integration & Human Review Editing`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 12B is complete when:

- A local deterministic `MakeupSemanticExtractionReport` exists for candidate
  lip, blush, eye, brow, highlight, contour, and overall style semantic fields.
- The semantic source labels distinguish region pixel, FaceMesh region, color,
  brightness, saturation, semantic rule, insufficient evidence, and human
  review sources.
- All semantic outputs are candidate-only, not final recognition, not
  AI-confirmed, not product shade claims, and not medical or skin diagnosis.
- The Template Workbench renders the Makeup Semantic Extraction Baseline panel
  without exposing operator-only terminology in the ordinary User App Shell.
- Phase 12A reality-check source labels remain accurate and include the new
  Phase 12B source types.
- Registry chain remains paused after Phase 10U, and Phase 10V is not the
  active next phase.
- No real registry write, registry mutation, publication, production writer,
  current User App Shell package replacement, backend, database, login,
  payment, camera, AR, OpenAI/external API, training, real photo upload, real
  user data storage, or MediaPipe binary commit occurs.
- Documentation and project-state handoff are updated.
- MediaPipe check, scoped tests, typecheck, build, project status, context
  pack, direct JSON status, browser verification, and direct JSON context pass.
