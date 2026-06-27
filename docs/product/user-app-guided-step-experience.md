# User App Guided Step Experience

Phase 11B polishes the ordinary-user guided step experience inside the local
User App MVP shell.

Status marker: registry chain paused after Phase 10U.

## User Path

Home -> Template Selection -> Template Detail -> Preparation -> Step-by-step Guidance -> Completion

Phase 11B keeps this path ordinary-user-facing and focused on a smooth makeup
practice flow. It does not resume Phase 10V, request actual write
authorization, write a registry, mutate registry state, publish, create a
production writer, or replace the current User App Shell package.

## Preparation Polish

The preparation screen now works as a clear start checkpoint:

- 妆容标题
- 难度
- 预计耗时
- 本次步骤数量
- 工具 checklist
- 可选工具和产品建议
- 开始前注意事项
- 明显的“开始跟练”按钮

The copy stays local-only: no login, no upload, no photo storage, no medical
judgment, and no training use.

## Step Guide Polish

The step guide now makes the current practice state easier to scan:

- 当前步骤编号和总步骤数
- 当前步骤标题
- 进度条
- 每一步的完成状态
- 中文区域标签
- 当前目标效果
- 使用工具和产品
- 具体操作说明
- 注意事项
- 修正建议
- 上一步 / 下一步 / 完成本步骤 / 完成本次妆容

All steps remain deterministic local guidance derived from the existing
`UserAppTemplatePackage` fixture. They are not final recognition, not AI
confirmation, not medical advice, and not product shade claims.

## Completion Polish

The completion screen now summarizes the finished practice:

- 已完成本次妆容练习
- 完成步骤数量
- 妆容名称
- 步骤回顾
- 重新开始这套妆容
- 返回模板选择

It still does not upload result photos, save a user face, share to a community,
publish to any registry, or write training data.

## Mobile Guidance

Phase 11B keeps the shell mobile-first:

- Primary actions use larger touch targets.
- The step action bar remains easy to reach on narrow screens.
- Template cards, preparation content, and step details stack cleanly.
- Progress and current-step status are visible without hover-only behavior.

## Admin Boundary

Ordinary users must not see:

- registry
- write gate
- publish gate
- simulator
- approval boundary
- production writer
- Pipeline Trace
- debug JSON
- Template Studio admin-only terms

Administrator QA and the Phase 10A-10U registry safety chain remain preserved
behind explicit operator/admin entry points.

## Phase 11B-Fix Vision Readiness Label

The Vision Analysis readiness summary and Template Workbench visual-analysis
summary no longer display FaceMesh `confidence` as a user-facing score.

They display `Readiness Score（检测可用性评分）` instead. This is a rule-based
usability score derived from:

- landmark count
- makeup-region coverage
- normalized coordinate validity
- face crop margin
- blocking and warning issue count

This score is not MediaPipe model raw confidence. The current browser
FaceLandmarker usage in this project does not provide a reliable single
per-image face confidence. Legacy/internal `confidence` fields may remain in
runtime data for compatibility, but they must not be presented as model
certainty in the readiness UI.

## Current Non-Goals

Phase 11B is not a production app release. It does not add backend, database,
account login, payment, analytics, camera capture, AR, OpenAI/external API
calls, model training, service workers, registry writes, production writers,
or User App Shell package replacement.

## Next Phase

Phase 11C - User App Visual Guidance & Template Content Polish.
