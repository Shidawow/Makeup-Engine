import type { FaceMeshRegionQaReport } from '../vision';
import type { MakeupAttributeCandidateReport } from './makeupAttributeCandidates';
import type { RuleBasedStepSequence } from './ruleBasedStepGenerator';
import type { MakeupTemplateDraftReport } from './templateDraftGenerator';
import type { TemplateDraftQaResult } from './templateDraftQa';
import type { TemplateDraftHumanReview } from './templateDraftHumanReview';
import type { TemplateDraftReviewWorkflow } from './templateDraftReviewWorkflow';

export type TemplateStudioWorkflowStepStatus =
  | 'not_started'
  | 'ready'
  | 'warning'
  | 'blocked'
  | 'needs_review'
  | 'approved_candidate';

export type TemplateStudioWorkflowState =
  | 'vision_analysis_required'
  | 'region_qa_ready'
  | 'region_qa_blocked'
  | 'draft_generation_ready'
  | 'draft_qa_ready'
  | 'human_review_required'
  | 'candidate_handoff_ready'
  | 'blocked_by_privacy_or_scope';

export interface TemplateStudioWorkflowStep {
  id:
    | 'image_analysis'
    | 'region_qa'
    | 'attribute_candidates'
    | 'step_draft'
    | 'template_draft'
    | 'draft_qa'
    | 'human_review'
    | 'candidate_handoff';
  label: string;
  ownerTab: 'vision_analysis' | 'template_workbench';
  status: TemplateStudioWorkflowStepStatus;
}

export interface TemplateStudioNextAction {
  status: TemplateStudioWorkflowState;
  ownerTab: 'vision_analysis' | 'template_workbench';
  message: string;
}

export interface TemplateStudioTabRecommendation {
  activeTab: 'vision_analysis' | 'template_workbench';
  reason: string;
}

export interface TemplateStudioWorkflowReport {
  state: TemplateStudioWorkflowState;
  steps: TemplateStudioWorkflowStep[];
  nextAction: TemplateStudioNextAction;
  tabRecommendation: TemplateStudioTabRecommendation;
}

export interface TemplateStudioWorkflowInput {
  regionQa?: FaceMeshRegionQaReport | null;
  attributeCandidates?: MakeupAttributeCandidateReport | null;
  stepSequence?: RuleBasedStepSequence | null;
  templateDraft?: MakeupTemplateDraftReport | null;
  draftQa?: TemplateDraftQaResult | null;
  humanReview?: TemplateDraftHumanReview | null;
  reviewWorkflow?: TemplateDraftReviewWorkflow | null;
}

const statusFromReadiness = (
  status: string | undefined,
  ready: string,
  warning: string,
  blocked: string,
): TemplateStudioWorkflowStepStatus => {
  if (!status) {
    return 'not_started';
  }
  if (status === blocked) {
    return 'blocked';
  }
  if (status === warning) {
    return 'warning';
  }
  if (status === ready) {
    return 'ready';
  }
  return 'not_started';
};

export const buildTemplateStudioWorkflowState = ({
  regionQa = null,
  attributeCandidates = null,
  stepSequence = null,
  templateDraft = null,
  draftQa = null,
  humanReview = null,
  reviewWorkflow = null,
}: TemplateStudioWorkflowInput): TemplateStudioWorkflowReport => {
  const privacyBlocked =
    draftQa?.issues.some((issue) => /privacy|contract|UserAppTemplatePackage/i.test(issue.id)) ||
    humanReview?.decision === 'block_for_privacy_or_scope';
  const state: TemplateStudioWorkflowState = privacyBlocked
    ? 'blocked_by_privacy_or_scope'
    : regionQa?.status === 'region_qa_blocked'
      ? 'region_qa_blocked'
      : reviewWorkflow?.queueItem.status === 'approved_as_library_candidate'
        ? 'candidate_handoff_ready'
        : humanReview?.status === 'human_review_required'
          ? 'human_review_required'
          : draftQa?.status === 'draft_qa_ready_for_human_review' ||
              draftQa?.status === 'draft_qa_ready_with_warnings'
            ? 'draft_qa_ready'
            : templateDraft?.status === 'draft_ready' ||
                templateDraft?.status === 'draft_ready_with_warnings'
              ? 'draft_generation_ready'
              : regionQa?.status === 'region_qa_ready' ||
                  regionQa?.status === 'region_qa_ready_with_warnings'
                ? 'region_qa_ready'
                : 'vision_analysis_required';

  const humanReviewStatus: TemplateStudioWorkflowStepStatus =
    reviewWorkflow?.queueItem.status === 'approved_as_library_candidate'
      ? 'approved_candidate'
      : humanReview?.status === 'human_review_required'
        ? 'needs_review'
        : humanReview?.status === 'blocked'
          ? 'blocked'
          : humanReview
            ? 'ready'
            : 'not_started';

  const steps: TemplateStudioWorkflowStep[] = [
    {
      id: 'image_analysis',
      label: '图片分析',
      ownerTab: 'vision_analysis',
      status: regionQa ? 'ready' : 'not_started',
    },
    {
      id: 'region_qa',
      label: '区域 QA',
      ownerTab: 'vision_analysis',
      status: statusFromReadiness(
        regionQa?.status,
        'region_qa_ready',
        'region_qa_ready_with_warnings',
        'region_qa_blocked',
      ),
    },
    {
      id: 'attribute_candidates',
      label: '属性候选',
      ownerTab: 'template_workbench',
      status: statusFromReadiness(
        attributeCandidates?.status,
        'candidates_ready',
        'candidates_ready_with_warnings',
        'candidates_blocked',
      ),
    },
    {
      id: 'step_draft',
      label: '步骤草稿',
      ownerTab: 'template_workbench',
      status: statusFromReadiness(
        stepSequence?.status,
        'steps_ready',
        'steps_ready_with_warnings',
        'steps_blocked',
      ),
    },
    {
      id: 'template_draft',
      label: '模板草稿',
      ownerTab: 'template_workbench',
      status: statusFromReadiness(
        templateDraft?.status,
        'draft_ready',
        'draft_ready_with_warnings',
        'draft_blocked',
      ),
    },
    {
      id: 'draft_qa',
      label: '草稿 QA',
      ownerTab: 'template_workbench',
      status: draftQa?.status === 'draft_qa_blocked'
        ? 'blocked'
        : draftQa?.status === 'draft_qa_ready_with_warnings'
          ? 'warning'
          : draftQa?.status === 'draft_qa_ready_for_human_review'
            ? 'needs_review'
            : 'not_started',
    },
    {
      id: 'human_review',
      label: '人工审核',
      ownerTab: 'template_workbench',
      status: humanReviewStatus,
    },
    {
      id: 'candidate_handoff',
      label: '候选入库 handoff',
      ownerTab: 'template_workbench',
      status: reviewWorkflow?.queueItem.status === 'approved_as_library_candidate'
        ? 'approved_candidate'
        : reviewWorkflow?.queueItem.status === 'blocked'
          ? 'blocked'
          : 'not_started',
    },
  ];

  const nextActionByState: Record<TemplateStudioWorkflowState, TemplateStudioNextAction> = {
    vision_analysis_required: {
      status: 'vision_analysis_required',
      ownerTab: 'vision_analysis',
      message: '先在视觉分析 Tab 上传图片并运行 FaceMesh / 区域 QA。',
    },
    region_qa_ready: {
      status: 'region_qa_ready',
      ownerTab: 'template_workbench',
      message: '可以进入模板工作台生成/审核模板草稿。',
    },
    region_qa_blocked: {
      status: 'region_qa_blocked',
      ownerTab: 'vision_analysis',
      message: '视觉分析质量不足，需回到视觉分析 Tab 修正图片/区域后再生成草稿。',
    },
    draft_generation_ready: {
      status: 'draft_generation_ready',
      ownerTab: 'template_workbench',
      message: '候选属性和步骤草稿已生成，下一步检查模板草稿 QA。',
    },
    draft_qa_ready: {
      status: 'draft_qa_ready',
      ownerTab: 'template_workbench',
      message: '草稿可进入人工审核，但不能发布。',
    },
    human_review_required: {
      status: 'human_review_required',
      ownerTab: 'template_workbench',
      message: '请完成人工审核 checklist，再决定请求修改、拒绝、阻断或候选入库。',
    },
    candidate_handoff_ready: {
      status: 'candidate_handoff_ready',
      ownerTab: 'template_workbench',
      message: '已作为模板库候选。',
    },
    blocked_by_privacy_or_scope: {
      status: 'blocked_by_privacy_or_scope',
      ownerTab: 'template_workbench',
      message: '存在隐私或范围边界风险，必须先阻断并修复。',
    },
  };

  const nextAction = nextActionByState[state];

  return {
    state,
    steps,
    nextAction,
    tabRecommendation: {
      activeTab: nextAction.ownerTab,
      reason:
        nextAction.ownerTab === 'vision_analysis'
          ? '当前阻断或准备动作属于图像理解与区域质量。'
          : '当前动作属于候选、草稿、QA、人工审核或候选入库。',
    },
  };
};
