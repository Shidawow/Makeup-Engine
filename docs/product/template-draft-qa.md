# Template Draft QA

Phase 10B adds a deterministic local QA layer for FaceMesh-driven template
drafts. It checks whether the Phase 10A output is safe to send to a human
reviewer. QA readiness is not publishing readiness.

## Checks

- Region QA must not be blocked.
- Attribute candidates must keep source, confidence, and `needs_human_review`.
- Generated steps must have target regions and beginner-friendly guidance.
- Tool and product suggestions must stay category-level placeholders.
- Draft text must avoid final recognition, medical, and shade-specific claims.
- `publishBlocked` and `humanReviewRequired` must stay true.
- The workflow must not mutate or generate `UserAppTemplatePackage`.
- No photo bytes, object URLs, biometric identifiers, or sensitive user data are allowed.

## Status

- `draft_qa_ready_for_human_review`: the draft can enter human review only.
- `draft_qa_ready_with_warnings`: the draft can enter review with reviewer caution.
- `draft_qa_blocked`: fix the blocking issue before human review.

## 视觉分析 Tab 与模板工作台 Tab 的职责边界

视觉分析 Tab 负责图像理解和区域质量：FaceMesh runtime 状态、overlay、
mask、region QA、图片质量、cropped face / eyes / lips / brows warnings、
MediaPipe missing assets recovery hint、mock fallback 状态，以及“是否可以进入
模板工作台”的 readiness summary。

模板工作台负责模板草稿和人工审核：候选属性、规则步骤草稿、模板草稿、
草稿 QA、人工审核 checklist、review decision、request revision / reject /
block、以及候选入库 handoff。

不能把所有功能堆到同一页，因为图像质量阻断和模板内容审核是两类不同
决策。视觉分析回答“图像和区域是否足够可靠”，模板工作台回答“草稿是否
值得进入人工审核或候选入库”。

Approve 只是“模板库候选”，不是发布。`UserAppTemplatePackage` 不能在这里
自动生成，因为它是未来 User App 的消费契约，需要从已审核的模板库/发布
包流程单独产生。
