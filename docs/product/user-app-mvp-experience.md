# User App MVP Experience

Phase 11A resets the project focus from the Phase 10 registry safety chain back
to an ordinary-user User App MVP experience. The registry chain paused after
Phase 10U; Phase 10V and actual write authorization are intentionally not the
next active path.

Status marker: registry chain paused after Phase 10U.

## MVP User Path

Home -> Template Selection -> Template Detail -> Preparation -> Step-by-step Guidance -> Completion

The local Vite app now opens on a `用户 App 预览` tab that mounts this path for
browser QA. `视觉分析` and `模板工作台` remain adjacent operator/admin tabs, not
ordinary user screens and not production app routing.

1. Home: the user sees a clean local makeup practice entry, the current
   recommended look, expected time, difficulty, and a clear start/browse choice.
2. Template Selection: the user sees two to three local demo makeup cards with
   title, look summary, difficulty, estimated time, step count, and style tags.
3. Template Detail: the user sees the look summary, suitable occasions,
   difficulty, estimated time, tools/products, step count, and the start
   guidance action.
4. Preparation: the user reviews required tools, optional tools, and product
   placeholders before starting.
5. Step-by-step Guidance: the user sees one current step at a time, including
   target area, purpose, operation tips, cautions, required tools/products,
   previous/next controls, and progress.
6. Completion: the user sees a local completion state, completed step count,
   restart action, and return-to-selection action.

## User-Facing Copy Rules

Ordinary users should see words such as:

- 妆容
- 练习
- 准备工具
- 分步骤跟练
- 本地预览
- 不上传
- 不训练
- 暂未启用

Ordinary users should not see backend/admin terms such as:

- registry
- write gate
- publish gate
- simulator
- approval boundary
- production writer
- Pipeline Trace
- FaceMesh debug JSON
- candidate package
- draft validation

## Admin Boundary

Administrator QA, internal trial, Template Studio, registry safety, and real
write approval panels remain available only as administrator tooling. Phase 11A
does not delete Phase 10A-10U artifacts; it prevents those terms from being the
default ordinary-user path.

## Current MVP Non-Goals

Phase 11A does not add backend, database, login, payment, camera, AR, OpenAI or
external AI APIs, model training, real photo upload, real registry write,
registry mutation, publication, production writer creation, or current User App
Shell package replacement.

## Next Phases

Phase 11B should polish the guided step experience: smaller step cards, clearer
step transitions, better completion affordances, and mobile/browser QA over the
ordinary-user path.

Phase 11C can then prepare a stronger demo narrative and trial walkthrough once
the guided step experience feels smooth enough for showing to real users.
