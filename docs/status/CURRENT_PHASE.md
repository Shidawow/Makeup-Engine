# Current Phase

## Phase State

- `lastCompletedPhase`: `8C`
- `lastCompletedBusinessPhase`: `8C`
- `currentPhase`: `8C`
- `currentPhaseName`: `User App MVP Trial Pack`
- `nextRecommendedPhase`: `8D`
- `nextRecommendedPhaseName`: `Template Content QA for Real User Trial`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 8C is complete when:

- A local MVP trial pack exists with ordered user trial tasks.
- A privacy-safe trial feedback form and mock/example summary exist.
- Trial readiness checks cover tasks, feedback, privacy, local-only boundaries, PWA carryover, mobile shell carryover, ordinary user path, and admin QA separation.
- UserAppShell exposes MVP 试用包, 反馈表预览, and 试用就绪度 only in administrator checks.
- The ordinary user path remains focused on 跟练, 发现妆容, 我的准备, 我的偏好, 照片占位, 本地进度, and 隐私说明.
- `UserAppTemplatePackage` remains the handoff contract and is not mutated.
- The phase does not add production app, online release, App Store/TestFlight, backend, database, accounts, analytics, camera, AR, training, native iOS, OpenAI/external APIs, online publication, service worker, offline cache, or new runtime dependencies.
- Documentation and project-state handoff are updated.
- Typecheck, tests, build, project status, context pack, direct JSON status, and direct JSON context pass.
