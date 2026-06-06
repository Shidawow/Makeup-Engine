# Current Phase

## Phase State

- `lastCompletedPhase`: `9A`
- `lastCompletedBusinessPhase`: `9A`
- `currentPhase`: `9A`
- `currentPhaseName`: `Internal Trial Operations Pack`
- `nextRecommendedPhase`: `9B`
- `nextRecommendedPhaseName`: `Internal Trial Result Review Framework`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 9A is complete when:

- Internal trial operations define participant types, session flow, checklist, risks, boundaries, and status.
- Observation guide defines anonymous experience signals without collecting real identity, contact, health, sensitive, photo, biometric, backend, analytics, or training data.
- Outcome review can recommend continuing internal trials, revising content, revising shell, blocking for privacy/scope, or entering Phase 9B.
- UserAppShell exposes 内部试用运营, 观察记录模板, and 试用结果复盘 only in administrator checks.
- The ordinary user path remains focused on 跟练, 发现妆容, 我的准备, 我的偏好, 照片占位, 本地进度, and 隐私说明.
- `UserAppTemplatePackage` remains the handoff contract and is not mutated.
- The phase prepares internal small-scope trial operations only and does not add production app, public recruitment, online release, App Store/TestFlight, backend, database, accounts, analytics, camera, AR, AI generation, training, native iOS, OpenAI/external APIs, online publication, service worker, offline cache, or new runtime dependencies.
- Documentation and project-state handoff are updated.
- Typecheck, tests, build, project status, context pack, direct JSON status, and direct JSON context pass.
