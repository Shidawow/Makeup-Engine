# Current Phase

## Phase State

- `lastCompletedPhase`: `10A`
- `lastCompletedBusinessPhase`: `10A`
- `currentPhase`: `10A`
- `currentPhaseName`: `FaceMesh-driven Makeup Intelligence Baseline`
- `nextRecommendedPhase`: `10B`
- `nextRecommendedPhaseName`: `Template Draft QA & Human Review Workflow`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 10A is complete when:

- Real local MediaPipe assets are recognized by `npm run mediapipe:check`.
- FaceMesh region QA can report landmark count, confidence, region coverage,
  normalized coordinates, crop warnings, and blocking issues.
- Makeup attribute candidate generation remains deterministic, local,
  candidate-only, and human-review-required.
- Rule-based step generation creates ordered draft steps with source candidate
  ids and human review status.
- Template draft generation creates draft-only `MakeupTemplate` data and keeps
  publishing blocked.
- Template Studio renders a FaceMesh 妆容智能基线 administrator panel.
- Phase 10A does not add backend, camera capture, AR, OpenAI/external API calls,
  training, automatic publishing, production app routing, runtime dependencies,
  or committed MediaPipe binaries.
- Documentation and project-state handoff are updated.
- Typecheck, scoped tests, build, project status, context pack, direct JSON
  status, and direct JSON context pass.
