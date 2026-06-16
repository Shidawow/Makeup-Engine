# Template Draft Review Workflow

Phase 10B connects draft QA, human review, and candidate handoff into one local
administrator workflow.

## Queue Status

- `draft_generated`
- `qa_blocked`
- `ready_for_human_review`
- `revision_requested`
- `rejected`
- `blocked`
- `approved_as_library_candidate`
- `example_only`

## Priority

- `p0_privacy_blocker`
- `p1_region_quality`
- `p2_content_review`
- `p3_copy_polish`
- `observe`

Privacy or scope risks always block. Region QA blockers route the operator back
to the Vision Analysis tab. Content and copy issues stay in the Template
Workbench tab.

## UI Flow

The Template Studio workflow stepper is:

1. 图片分析
2. 区域 QA
3. 属性候选
4. 步骤草稿
5. 模板草稿
6. 草稿 QA
7. 人工审核
8. 候选入库 handoff

The Vision Analysis tab may show that region QA is ready and suggest entering
the Template Workbench. The Template Workbench may block and send the operator
back to Vision Analysis when region quality is insufficient.

The workflow never claims final recognition, automatic publication, or completed
user app package generation.
