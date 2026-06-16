# Phase 10B — Template Draft Review Workflow

Phase 10B is complete.

## What Changed

- Added `TemplateDraftQaResult` and deterministic draft QA checks.
- Added human review checklist and decisions for template drafts.
- Added review queue status, priority, and candidate handoff model.
- Added Template Studio workflow state across Vision Analysis and Template
  Workbench ownership.
- Updated the FaceMesh makeup intelligence panel into a compact summary,
  workflow stepper, next-action card, blocked-reason card, and collapsible
  details.
- Added a Vision Analysis readiness summary that keeps image understanding and
  region QA separate from template draft review.

## 视觉分析 Tab 与模板工作台 Tab 的职责边界

视觉分析 Tab 负责图像理解和区域质量：图片预览、FaceMesh runtime 状态、
landmark count、confidence、overlay / mask、region QA、图片质量判断、
cropped face / eyes / lips / brows warnings、MediaPipe missing assets recovery
hint、mock fallback 状态，以及“可以进入模板工作台”的 readiness summary。

模板工作台负责模板草稿和人工审核：读取视觉分析摘要、展示 makeup
attribute candidates、rule-based generated steps、template draft、draft QA、
human review checklist、review decision、request revision / reject / block、
approved as template library candidate、candidate handoff。

不能把所有功能堆到同一页，因为视觉分析和模板审核有不同失败原因和不同
下一步动作。Region QA blocked 时应回到视觉分析；template draft ready 时
只进入人工审核。Approve 只是模板库候选，不是发布。`UserAppTemplatePackage`
不能在这里自动生成，因为它是后续已审核模板库/发布包流程的消费契约。

## Boundaries

- No production app.
- No backend, database, accounts, cloud sync, analytics, camera, AR, OpenAI API,
  external AI/CV API, or training.
- No automatic publishing.
- No committed MediaPipe `.task` or `.wasm` assets.
- No mutation of `UserAppTemplatePackage` from FaceMesh QA, candidates, steps,
  draft QA, or human review.

## Validation

Phase 10B validation includes MediaPipe asset check, scoped model/UI/docs tests,
typecheck, build, project status, project context, and JSON status/context
commands.

## Next

Phase 10C — Template Library Candidate Packaging.
