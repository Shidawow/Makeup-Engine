# Current Phase

## Phase State

- `lastCompletedPhase`: `8D`
- `lastCompletedBusinessPhase`: `8D`
- `currentPhase`: `8D`
- `currentPhaseName`: `Template Content QA for Real User Trial`
- `nextRecommendedPhase`: `8E`
- `nextRecommendedPhaseName`: `MVP Release Readiness Gate`
- `phaseOwner`: `Codex implementation, validation, commit, and push pass`

## Phase Completion Definition

Phase 8D is complete when:

- Template content QA checks title, summary, steps, actionability, regions, tools, products, duration, difficulty, recommendation reasons, internal terms, and trial suitability.
- Trial template selection identifies trial-ready, backup warning, and blocked templates.
- Trial content readiness combines trial pack, feedback, content QA, template selection, privacy, and local-only boundary checks.
- UserAppShell exposes 模板内容 QA, 试用模板选择, and 试用内容就绪度 only in administrator checks.
- The ordinary user path remains focused on 跟练, 发现妆容, 我的准备, 我的偏好, 照片占位, 本地进度, and 隐私说明.
- `UserAppTemplatePackage` remains the handoff contract and is not mutated.
- The phase does not add production app, online release, App Store/TestFlight, backend, database, accounts, analytics, camera, AR, AI generation, training, native iOS, OpenAI/external APIs, online publication, service worker, offline cache, or new runtime dependencies.
- Documentation and project-state handoff are updated.
- Typecheck, tests, build, project status, context pack, direct JSON status, and direct JSON context pass.
