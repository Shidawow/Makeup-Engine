import type { TemplateDraftQaResult } from './templateDraftQa';

export type TemplateDraftHumanReviewDecision =
  | 'approve_for_template_library_candidate'
  | 'request_revision'
  | 'reject_draft'
  | 'block_for_region_quality'
  | 'block_for_privacy_or_scope'
  | 'keep_as_example_only';

export type TemplateDraftHumanReviewStatus =
  | 'human_review_required'
  | 'approved_as_template_library_candidate'
  | 'revision_requested'
  | 'rejected'
  | 'blocked'
  | 'example_only';

export interface TemplateDraftHumanReviewChecklistItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
}

export interface TemplateDraftHumanReviewComment {
  id: string;
  message: string;
  visibility: 'admin_only' | 'handoff_summary';
}

export interface TemplateDraftHumanReviewIssue {
  id: string;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface TemplateDraftHumanReview {
  status: TemplateDraftHumanReviewStatus;
  decision: TemplateDraftHumanReviewDecision | null;
  checklist: TemplateDraftHumanReviewChecklistItem[];
  comments: TemplateDraftHumanReviewComment[];
  issues: TemplateDraftHumanReviewIssue[];
  approvedAsTemplateLibraryCandidate: boolean;
  publishBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
  notes: string[];
}

export interface TemplateDraftHumanReviewInput {
  qa: TemplateDraftQaResult;
  decision?: TemplateDraftHumanReviewDecision | null;
  checklist?: TemplateDraftHumanReviewChecklistItem[];
  comments?: TemplateDraftHumanReviewComment[];
}

const unsafeCommentPattern =
  /data:image|base64|真实姓名|手机号|邮箱|联系方式|健康|过敏|身份证|faceEmbedding|biometric|照片|上传/i;

export const createDefaultTemplateDraftHumanReviewChecklist = (
  checked = false,
): TemplateDraftHumanReviewChecklistItem[] => [
  { id: 'confirm_title', label: '确认标题与摘要仍是草稿口径', required: true, checked },
  { id: 'confirm_style_tags', label: '确认 style tags 是候选标签', required: true, checked },
  { id: 'confirm_lip_candidates', label: '确认唇部候选需要人工复核', required: true, checked },
  { id: 'confirm_blush_candidates', label: '确认腮红候选需要人工复核', required: true, checked },
  { id: 'confirm_eye_candidates', label: '确认眼部候选需要人工复核', required: true, checked },
  { id: 'confirm_brow_candidates', label: '确认眉/轮廓候选没有越界推断', required: true, checked },
  { id: 'confirm_step_order', label: '确认步骤顺序适合初学者', required: true, checked },
  { id: 'edit_step_copy', label: '编辑步骤文案，避免定稿口吻', required: true, checked },
  { id: 'confirm_target_regions', label: '确认每步 target region 清楚', required: true, checked },
  { id: 'confirm_tools', label: '确认工具建议是类别，不是品牌色号', required: true, checked },
  { id: 'confirm_product_placeholders', label: '确认产品建议只是 placeholder', required: true, checked },
  { id: 'confirm_privacy', label: '确认没有照片、身份、健康或生物识别数据', required: true, checked },
  { id: 'confirm_no_auto_publish', label: '确认不会直接发布', required: true, checked },
  { id: 'choose_decision', label: '选择 approve / request revision / reject / block', required: true, checked },
];

export const evaluateTemplateDraftHumanReview = ({
  qa,
  decision = null,
  checklist = createDefaultTemplateDraftHumanReviewChecklist(false),
  comments = [],
}: TemplateDraftHumanReviewInput): TemplateDraftHumanReview => {
  const issues: TemplateDraftHumanReviewIssue[] = [];
  const missingRequiredChecklist = checklist.some((item) => item.required && !item.checked);
  const unsafeComment = comments.find((comment) => unsafeCommentPattern.test(comment.message));

  if (!decision) {
    issues.push({
      id: 'missing_review_decision',
      severity: 'warning',
      message: 'Human reviewer has not selected a decision yet.',
    });
  }

  if (qa.status === 'draft_qa_blocked') {
    issues.push({
      id: 'qa_blocked',
      severity: 'blocking',
      message: 'QA is blocked, so the draft cannot be approved.',
    });
  }

  if (missingRequiredChecklist && decision === 'approve_for_template_library_candidate') {
    issues.push({
      id: 'checklist_incomplete',
      severity: 'blocking',
      message: 'Approval requires every required human review checklist item.',
    });
  }

  if (unsafeComment) {
    issues.push({
      id: 'unsafe_review_comment',
      severity: 'blocking',
      message: 'Review comments must not contain photos, contact, health, identity, or biometric data.',
    });
  }

  if (decision === 'block_for_privacy_or_scope') {
    issues.push({
      id: 'privacy_scope_block',
      severity: 'blocking',
      message: 'Reviewer blocked the draft for privacy or scope boundary risk.',
    });
  }

  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const status: TemplateDraftHumanReviewStatus =
    hasBlockingIssue || decision === 'block_for_region_quality' || decision === 'block_for_privacy_or_scope'
      ? 'blocked'
      : decision === 'approve_for_template_library_candidate'
        ? 'approved_as_template_library_candidate'
        : decision === 'request_revision'
          ? 'revision_requested'
          : decision === 'reject_draft'
            ? 'rejected'
            : decision === 'keep_as_example_only'
              ? 'example_only'
              : 'human_review_required';

  return {
    status,
    decision,
    checklist,
    comments,
    issues,
    approvedAsTemplateLibraryCandidate:
      status === 'approved_as_template_library_candidate',
    publishBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
    notes: [
      'Approve means template library candidate only.',
      'Human review does not publish and does not generate UserAppTemplatePackage.',
      'Review comments must stay anonymous and non-sensitive.',
    ],
  };
};
