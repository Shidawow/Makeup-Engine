# Current Phase

## Phase State

- `lastCompletedPhase`: `12C`
- `lastCompletedBusinessPhase`: `12C`
- `currentPhase`: `12C`
- `currentPhaseName`: `Photo-to-Template Draft Integration & Human Review Editing`
- `nextRecommendedPhase`: `12D`
- `nextRecommendedPhaseName`: `Photo-to-Template Operator Workflow & Draft Preview QA`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 12C is complete when:

- Phase 12B semantic candidates can bind into photo-to-template draft fields.
- Every binding preserves source type, confidence band, evidence, limitations,
  human review requirement, not-final status, original candidate value,
  editable draft value, reviewer decision, and reviewer note.
- Human review editing can accept, edit, reject, mark insufficient, require more
  review, or block draft fields without making them final.
- Draft QA blocks semantic candidates that lose candidate-only boundaries or
  make fully automatic, AI-confirmed, product shade, medical, publish,
  registry, production writer, or shell replacement claims.
- Reality Check can label integrated draft fields as
  `semantic_candidate_integrated` without calling them real photo extraction.
- Template Workbench renders draft integration and human review editing panels.
- The ordinary User App path hides semantic evidence, confidence bands, reviewer
  notes, registry terms, simulator terms, and production writer terminology.
- Registry chain remains paused after Phase 10U, and Phase 10V is not the
  active next phase.
- No real registry write, registry mutation, publication, production writer,
  current User App Shell package replacement, backend, database, login,
  payment, camera, AR, OpenAI/external API, training, real photo upload, real
  user data storage, or MediaPipe binary commit occurs.
- Documentation and project-state handoff are updated.
- MediaPipe check, scoped tests, typecheck, build, project status, context
  pack, direct JSON status, browser verification, and direct JSON context pass.
