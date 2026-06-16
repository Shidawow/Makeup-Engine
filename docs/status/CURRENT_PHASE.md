# Current Phase

## Phase State

- `lastCompletedPhase`: `10B`
- `lastCompletedBusinessPhase`: `10B`
- `currentPhase`: `10B`
- `currentPhaseName`: `Template Draft Review Workflow`
- `nextRecommendedPhase`: `10C`
- `nextRecommendedPhaseName`: `Template Library Candidate Packaging`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 10B is complete when:

- Template draft QA checks region QA, candidates, steps, wording, publish
  blocked state, human review requirement, privacy boundary, and user app
  contract boundary.
- Human review workflow supports approve-as-candidate, request revision, reject,
  region quality block, privacy/scope block, and example-only decisions.
- Candidate handoff is local and admin-only.
- Vision Analysis tab owns FaceMesh, overlay/mask, region QA, image quality,
  MediaPipe recovery hints, mock fallback, and workbench readiness.
- Template Workbench tab owns candidates, step drafts, template draft, draft QA,
  human review, and candidate handoff.
- Approval means template library candidate only, not publishing.
- No `UserAppTemplatePackage` is generated automatically.
- Phase 10B does not add backend, camera capture, AR, OpenAI/external API calls,
  training, automatic publishing, production app routing, runtime dependencies,
  or committed MediaPipe binaries.
- Documentation and project-state handoff are updated.
- Typecheck, scoped tests, build, project status, context pack, direct JSON
  status, and direct JSON context pass.
