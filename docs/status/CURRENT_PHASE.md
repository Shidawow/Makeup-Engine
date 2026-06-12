# Current Phase

## Phase State

- `lastCompletedPhase`: `9F`
- `lastCompletedBusinessPhase`: `9F`
- `currentPhase`: `9F`
- `currentPhaseName`: `Internal Trial Evidence Collection Preparation`
- `nextRecommendedPhase`: `9G`
- `nextRecommendedPhaseName`: `Anonymous Internal Trial Dry Run Pack`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 9F is complete when:

- Evidence collection protocol defines allowed anonymous evidence types and forbidden data types.
- Protocol includes anonymization rules, participant notice, and stop conditions.
- Checklist covers before-trial, during-trial, after-trial, privacy boundary, evidence quality, stop conditions, and review handoff.
- Checklist confirms no photos, no upload, no training, no sensitive information, anonymous observation only, no real user records in project-state, and no AI automatic analysis.
- Quality gate can decide ready to collect anonymous internal evidence, ready with warnings, missing protocol, missing notice, forbidden data request, or privacy/scope block.
- Photo, contact, upload, training, real identity, health, sensitive identity, and biometric requests are blocking.
- UserAppShell exposes 证据收集协议, 证据收集 checklist, and 证据收集质量门 only in administrator checks.
- The ordinary user path remains focused on 跟练, 发现妆容, 我的准备, 我的偏好, 照片占位, 本地进度, and 隐私说明.
- `UserAppTemplatePackage` remains the handoff contract and is not mutated.
- The phase prepares anonymous internal dry run only and does not add production app, public recruitment, online release, App Store/TestFlight, backend, database, accounts, analytics, camera, AR, AI analysis, training, native iOS, OpenAI/external APIs, online publication, service worker, offline cache, or new runtime dependencies.
- Documentation and project-state handoff are updated.
- Typecheck, tests, build, project status, context pack, direct JSON status, and direct JSON context pass.
