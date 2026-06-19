# Current Phase

## Phase State

- `lastCompletedPhase`: `10G`
- `lastCompletedBusinessPhase`: `10G`
- `currentPhase`: `10G`
- `currentPhaseName`: `Official UserAppTemplatePackage Draft Builder`
- `nextRecommendedPhase`: `10H`
- `nextRecommendedPhaseName`: `UserAppTemplatePackage Draft Publish Gate`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 10G is complete when:

- Phase 10F gate ready or ready-with-warnings sources can enter a local official
  `UserAppTemplatePackage` draft builder.
- The builder creates a draft-only object with user-facing fields, step sequence,
  region guidance, privacy notice, QA trace, human review trace, candidate
  trace, contract trace, preview trace, and gate trace.
- Draft validation checks draft-only, publish-blocked, no-registry, no-shell
  replacement, unsafe payload, trace, and JSON round-trip boundaries.
- Vision Analysis tab remains free of official draft builder UI.
- Template Workbench owns candidate package, candidate-to-app preparation, app
  package mapping preview, user app package draft preview, preview validation,
  handoff, official draft gate, gate handoff, official draft builder, draft validation, and draft handoff.
- No formal `UserAppTemplatePackage` is generated automatically.
- No user app package registry write occurs automatically.
- Phase 10G does not add backend, camera capture, AR, OpenAI/external API calls,
  training, production app routing, runtime dependencies, or committed MediaPipe
  binaries.
- Documentation and project-state handoff are updated.
- MediaPipe check, scoped tests, typecheck, build, project status, context pack,
  direct JSON status, browser verification, and direct JSON context pass.
