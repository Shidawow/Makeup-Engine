# Template Draft Human Review Workflow

Phase 10B adds an administrator-only human review workflow for template drafts.
It does not create a production app, backend workflow, training dataset, camera
flow, AR flow, OpenAI call, or external analysis service.

## Checklist

Human reviewers confirm:

- title, summary, and style tags are still draft/candidate wording;
- lip, blush, eye, brow, and contour candidates are reviewable;
- step order is beginner-friendly;
- target regions, tools, and product placeholders are clear;
- there are no final recognition, medical, product shade, privacy, or scope claims;
- no automatic publishing occurs;
- no `UserAppTemplatePackage` generation occurs.

## Decisions

- `approve_for_template_library_candidate`
- `request_revision`
- `reject_draft`
- `block_for_region_quality`
- `block_for_privacy_or_scope`
- `keep_as_example_only`

Approval means “template library candidate” only. It does not write into a
formal template library, does not publish, and does not generate a user-facing
template package.
