import type {
  TemplateDraftHumanReview,
  TemplateDraftHumanReviewDecision,
} from './templateDraftHumanReview';
import type { TemplateDraftQaResult } from './templateDraftQa';

export type TemplateDraftReviewQueueStatus =
  | 'draft_generated'
  | 'qa_blocked'
  | 'ready_for_human_review'
  | 'revision_requested'
  | 'rejected'
  | 'blocked'
  | 'approved_as_library_candidate'
  | 'example_only';

export type TemplateDraftReviewPriority =
  | 'p0_privacy_blocker'
  | 'p1_region_quality'
  | 'p2_content_review'
  | 'p3_copy_polish'
  | 'observe';

export interface TemplateDraftReviewQueueItem {
  id: string;
  status: TemplateDraftReviewQueueStatus;
  priority: TemplateDraftReviewPriority;
  nextAction: string;
  blockedReason?: string;
}

export interface TemplateDraftCandidateHandoff {
  ready: boolean;
  label: string;
  notes: string[];
  notPublished: true;
  userAppTemplatePackageGenerationBlocked: true;
}

export interface TemplateDraftReviewWorkflow {
  id: string;
  queueItem: TemplateDraftReviewQueueItem;
  qaStatus: TemplateDraftQaResult['status'];
  humanReviewStatus: TemplateDraftHumanReview['status'];
  decision: TemplateDraftHumanReviewDecision | null;
  candidateHandoff: TemplateDraftCandidateHandoff;
  publishBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
}

const priorityFor = (
  qa: TemplateDraftQaResult,
  review: TemplateDraftHumanReview,
): TemplateDraftReviewPriority => {
  const text = JSON.stringify({ qa: qa.issues, review: review.issues });
  if (/privacy|scope|photo|biometric|UserAppTemplatePackage|contract/i.test(text)) {
    return 'p0_privacy_blocker';
  }
  if (/region/i.test(text)) {
    return 'p1_region_quality';
  }
  if (qa.status === 'draft_qa_ready_with_warnings') {
    return 'p3_copy_polish';
  }
  if (review.status === 'human_review_required') {
    return 'p2_content_review';
  }
  return 'observe';
};

export const createTemplateDraftReviewWorkflow = ({
  qa,
  review,
  id = 'phase-10b-template-draft-review-workflow',
}: {
  qa: TemplateDraftQaResult;
  review: TemplateDraftHumanReview;
  id?: string;
}): TemplateDraftReviewWorkflow => {
  const status: TemplateDraftReviewQueueStatus =
    qa.status === 'draft_qa_blocked'
      ? 'qa_blocked'
      : review.status === 'approved_as_template_library_candidate'
        ? 'approved_as_library_candidate'
        : review.status === 'revision_requested'
          ? 'revision_requested'
          : review.status === 'rejected'
            ? 'rejected'
            : review.status === 'blocked'
              ? 'blocked'
              : review.status === 'example_only'
                ? 'example_only'
                : qa.readyForHumanReview
                  ? 'ready_for_human_review'
                  : 'draft_generated';

  const blockedReason =
    status === 'qa_blocked' || status === 'blocked'
      ? [...qa.issues, ...review.issues].find((issue) => issue.severity === 'blocking')
          ?.message ?? 'Draft review workflow is blocked.'
      : undefined;

  const nextActionByStatus: Record<TemplateDraftReviewQueueStatus, string> = {
    draft_generated: '先完成草稿 QA，再进入人工审核。',
    qa_blocked: '视觉分析质量不足，需回到视觉分析 Tab 修正图片/区域后再生成草稿。',
    ready_for_human_review: '草稿可进入人工审核，但不能发布。',
    revision_requested: '按人工审核意见修改候选属性、步骤或文案。',
    rejected: '保留为拒绝草稿，不进入候选入库。',
    blocked: blockedReason ?? '先处理阻断原因，再继续模板工作台流程。',
    approved_as_library_candidate: '已作为模板库候选。',
    example_only: '仅保留为示例，不进入候选入库。',
  };

  const approved = status === 'approved_as_library_candidate';

  return {
    id,
    queueItem: {
      id: `${id}-queue-item`,
      status,
      priority: priorityFor(qa, review),
      nextAction: nextActionByStatus[status],
      blockedReason,
    },
    qaStatus: qa.status,
    humanReviewStatus: review.status,
    decision: review.decision,
    candidateHandoff: {
      ready: approved,
      label: approved ? '已作为模板库候选' : '候选入库未就绪',
      notes: approved
        ? [
            'Candidate handoff is local and admin-only.',
            'This is not a published template.',
            'UserAppTemplatePackage generation remains blocked.',
          ]
        : ['Human review approval is required before candidate handoff.'],
      notPublished: true,
      userAppTemplatePackageGenerationBlocked: true,
    },
    publishBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
  };
};
