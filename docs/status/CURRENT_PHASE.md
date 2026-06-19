# Current Phase

## Phase State

- `lastCompletedPhase`: `10H`
- `lastCompletedBusinessPhase`: `10H`
- `currentPhase`: `10H`
- `currentPhaseName`: `UserAppTemplatePackage Draft Publish Gate`
- `nextRecommendedPhase`: `10I`
- `nextRecommendedPhaseName`: `UserAppTemplatePackage Registry Preparation`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 10H is complete when:

- Phase 10G official draft validation ready or ready-with-warnings sources can
  enter a local draft publish gate.
- The gate checks draft-only, publish-blocked, user-facing copy, step sequence,
  region guidance, privacy notice, trace, unsafe payload, no-registry,
  no-publish, no-shell replacement, no-production package, and JSON round-trip
  boundaries.
- Gate handoff can recommend future registry preparation, focused revisions,
  draft-only retention, or blocking.
- Vision Analysis tab remains free of official draft builder UI.
- Template Workbench owns candidate package, candidate-to-app preparation, app
  package mapping preview, user app package draft preview, preview validation,
  handoff, official draft gate, gate handoff, official draft builder, draft validation, draft handoff, and draft publish gate.
- No formal `UserAppTemplatePackage` is generated automatically.
- No user app package registry write occurs automatically.
- Phase 10H does not add backend, camera capture, AR, OpenAI/external API calls,
  training, production app routing, runtime dependencies, or committed MediaPipe
  binaries.
- Documentation and project-state handoff are updated.
- MediaPipe check, scoped tests, typecheck, build, project status, context pack,
  direct JSON status, browser verification, and direct JSON context pass.
