# Current Phase

## Phase State

- `lastCompletedPhase`: `10F`
- `lastCompletedBusinessPhase`: `10F`
- `currentPhase`: `10F`
- `currentPhaseName`: `Official User App Package Draft Gate`
- `nextRecommendedPhase`: `10G`
- `nextRecommendedPhaseName`: `Official UserAppTemplatePackage Draft Builder`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 10F is complete when:

- Phase 10E draft preview validation ready or ready-with-warnings sources can
  enter a local official draft gate.
- The gate checks user-facing title/summary, step guidance, region guidance,
  tools, privacy notice, raw image boundaries, personal data boundaries,
  medical/product shade/final claims, no registry write, no auto publish, no
  formal `UserAppTemplatePackage` mutation, trace preservation, and JSON
  round-trip stability.
- Gate handoff chooses local next actions without generating a formal app
  package.
- Vision Analysis tab remains free of user app package draft gate UI.
- Template Workbench owns candidate package, candidate-to-app preparation, app
  package mapping preview, user app package draft preview, preview validation,
  handoff, official draft gate, and gate handoff.
- No formal `UserAppTemplatePackage` is generated automatically.
- No user app package registry write occurs automatically.
- Phase 10F does not add backend, camera capture, AR, OpenAI/external API calls,
  training, production app routing, runtime dependencies, or committed MediaPipe
  binaries.
- Documentation and project-state handoff are updated.
- MediaPipe check, scoped tests, typecheck, build, project status, context pack,
  direct JSON status, browser verification, and direct JSON context pass.
