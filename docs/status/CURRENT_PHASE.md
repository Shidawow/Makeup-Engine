# Current Phase

## Phase State

- `lastCompletedPhase`: `9G`
- `lastCompletedBusinessPhase`: `9G`
- `currentPhase`: `9G`
- `currentPhaseName`: `Anonymous Internal Trial Dry Run Pack`
- `nextRecommendedPhase`: `9H`
- `nextRecommendedPhaseName`: `Anonymous Internal Trial Launch Pack`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 9G is complete when:

- Anonymous internal trial dry run pack defines the required scenarios.
- Dry run session script and participant notice explain anonymous, local, rehearsal-only boundaries.
- Dry run allowed evidence and forbidden data lists are explicit.
- Stop conditions cover photos, uploads, training, real identity, contacts, health/sensitive information, biometrics, backend storage, and AI analysis.
- Dry run checklist confirms no photos, no upload, no training, no names/contacts/health/sensitive identity, anonymous observation only, no real user records in project-state, no AI automatic analysis, and stop conditions ready.
- Dry run review can decide ready for anonymous internal trial, ready with warnings, repeat dry run, revise protocol, revise checklist, missing notice, forbidden data request, or privacy/scope block.
- Photo, contact, upload, training, real identity, health, sensitive identity, and biometric requests are blocking.
- UserAppShell exposes 匿名内部试用 dry run, dry run checklist, and dry run 复盘 only in administrator checks.
- The ordinary user path remains focused on 跟练, 发现妆容, 我的准备, 我的偏好, 照片占位, 本地进度, and 隐私说明.
- `UserAppTemplatePackage` remains the handoff contract and is not mutated.
- The phase prepares anonymous internal trial launch-pack planning only and does not add production app, public recruitment, online release, App Store/TestFlight, backend, database, accounts, analytics, camera, AR, AI analysis, training, native iOS, OpenAI/external APIs, online publication, service worker, offline cache, or new runtime dependencies.
- Documentation and project-state handoff are updated.
- Typecheck, tests, build, project status, context pack, direct JSON status, and direct JSON context pass.
