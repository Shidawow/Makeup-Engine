import {
  createUserAppAnonymousTrialDecisionInput,
  type UserAppAnonymousTrialDecisionInput,
} from './userAppAnonymousTrialDecisionInput';
import type {
  UserAppAnonymousTrialEvidenceGap,
  UserAppAnonymousTrialEvidenceGapType,
} from './userAppAnonymousTrialEvidenceGapReview';

export const USER_APP_ANONYMOUS_TRIAL_GAP_ACTION_PLAN_SCHEMA_VERSION =
  'user-app-anonymous-trial-gap-action-plan-v0.1' as const;

export type UserAppAnonymousTrialGapActionIssueType =
  | UserAppAnonymousTrialEvidenceGapType
  | 'missing_participant_notice'
  | 'missing_admin_script'
  | 'low_confidence_issue'
  | 'no_gap';

export type UserAppAnonymousTrialGapActionOwnerArea =
  | 'launch_pack'
  | 'participant_notice'
  | 'admin_script'
  | 'evidence_collection_protocol'
  | 'evidence_capture_sheet'
  | 'stop_conditions'
  | 'post_launch_handoff'
  | 'privacy_boundary'
  | 'trial_content'
  | 'user_app_shell'
  | 'no_action_observe_more';

export type UserAppAnonymousTrialGapActionPriority =
  | 'p0_privacy_blocker'
  | 'p1_required_before_next_trial'
  | 'p2_should_fix'
  | 'p3_observe'
  | 'no_action';

export interface UserAppAnonymousTrialGapActionAcceptanceCriteria {
  criteriaId: string;
  label: string;
  requiredBeforeNextTrial: boolean;
  satisfied: boolean;
}

export interface UserAppAnonymousTrialGapAction {
  actionId: string;
  issueType: UserAppAnonymousTrialGapActionIssueType;
  label: string;
  ownerArea: UserAppAnonymousTrialGapActionOwnerArea;
  priority: UserAppAnonymousTrialGapActionPriority;
  recommendedFix: string;
  acceptanceCriteria: UserAppAnonymousTrialGapActionAcceptanceCriteria[];
  blocksNextAnonymousTrial: boolean;
  blocksMvpValidationPreconditions: boolean;
  resolved: boolean;
}

export interface UserAppAnonymousTrialGapActionPlan {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_GAP_ACTION_PLAN_SCHEMA_VERSION;
  actionPlanId: string;
  title: string;
  decisionInput: UserAppAnonymousTrialDecisionInput;
  actions: UserAppAnonymousTrialGapAction[];
  localOnly: true;
  deterministic: true;
  anonymousOrExampleOnly: true;
  reviewOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialGapActionPlanInput {
  actionPlanId?: string;
  title?: string;
  decisionInput?: UserAppAnonymousTrialDecisionInput;
  manualIssueTypes?: UserAppAnonymousTrialGapActionIssueType[];
  resolvedIssueTypes?: UserAppAnonymousTrialGapActionIssueType[];
}

const unique = <T>(items: readonly T[]): T[] => Array.from(new Set(items));

const issueLabel: Record<UserAppAnonymousTrialGapActionIssueType, string> = {
  missing_task_completion_evidence: '缺少任务完成证据',
  missing_step_comprehension_evidence: '缺少步骤理解证据',
  missing_template_value_evidence: '缺少模板价值证据',
  missing_shell_usability_evidence: '缺少 Shell 可用性证据',
  missing_privacy_clarity_evidence: '缺少隐私清晰度证据',
  missing_stop_condition_record: '缺少停止条件记录',
  missing_post_launch_handoff: '缺少试用后 handoff',
  insufficient_sample_size: '匿名样本量不足',
  unclear_admin_notes: '管理员记录不清楚',
  over_collected_forbidden_data: '过度收集 forbidden data',
  privacy_incident: '隐私或范围事件',
  missing_participant_notice: '缺少参与者说明',
  missing_admin_script: '缺少管理员脚本',
  low_confidence_issue: '低置信度问题',
  no_gap: '没有需要修复的缺口',
};

const ownerForIssue = (
  issueType: UserAppAnonymousTrialGapActionIssueType,
): UserAppAnonymousTrialGapActionOwnerArea => {
  const owners: Record<UserAppAnonymousTrialGapActionIssueType, UserAppAnonymousTrialGapActionOwnerArea> = {
    missing_task_completion_evidence: 'evidence_capture_sheet',
    missing_step_comprehension_evidence: 'evidence_capture_sheet',
    missing_template_value_evidence: 'trial_content',
    missing_shell_usability_evidence: 'user_app_shell',
    missing_privacy_clarity_evidence: 'participant_notice',
    missing_stop_condition_record: 'stop_conditions',
    missing_post_launch_handoff: 'post_launch_handoff',
    insufficient_sample_size: 'evidence_collection_protocol',
    unclear_admin_notes: 'admin_script',
    over_collected_forbidden_data: 'privacy_boundary',
    privacy_incident: 'privacy_boundary',
    missing_participant_notice: 'participant_notice',
    missing_admin_script: 'admin_script',
    low_confidence_issue: 'no_action_observe_more',
    no_gap: 'no_action_observe_more',
  };
  return owners[issueType];
};

const priorityForIssue = (
  issueType: UserAppAnonymousTrialGapActionIssueType,
): UserAppAnonymousTrialGapActionPriority => {
  if (issueType === 'privacy_incident' || issueType === 'over_collected_forbidden_data') {
    return 'p0_privacy_blocker';
  }
  if (
    issueType === 'missing_participant_notice' ||
    issueType === 'missing_admin_script' ||
    issueType === 'missing_stop_condition_record' ||
    issueType === 'missing_post_launch_handoff'
  ) {
    return 'p1_required_before_next_trial';
  }
  if (issueType === 'insufficient_sample_size') return 'p2_should_fix';
  if (issueType === 'low_confidence_issue') return 'p3_observe';
  if (issueType === 'no_gap') return 'no_action';
  return 'p2_should_fix';
};

const issueTypesFromDecisionInput = (
  decisionInput: UserAppAnonymousTrialDecisionInput,
  manualIssueTypes: readonly UserAppAnonymousTrialGapActionIssueType[],
): UserAppAnonymousTrialGapActionIssueType[] => {
  const gapTypes = decisionInput.gapReview.gaps.map((gap: UserAppAnonymousTrialEvidenceGap) => gap.type);
  const recommendationIssueTypes: UserAppAnonymousTrialGapActionIssueType[] = [];

  if (decisionInput.recommendation === 'revise_launch_pack') {
    recommendationIssueTypes.push('missing_participant_notice', 'missing_admin_script');
  }
  if (decisionInput.recommendation === 'revise_evidence_collection_protocol') {
    recommendationIssueTypes.push('missing_stop_condition_record');
  }
  if (decisionInput.recommendation === 'repeat_anonymous_internal_trial') {
    recommendationIssueTypes.push('insufficient_sample_size');
  }
  if (decisionInput.recommendation === 'continue_anonymous_internal_trial') {
    recommendationIssueTypes.push('low_confidence_issue');
  }

  const combined = unique([...gapTypes, ...recommendationIssueTypes, ...manualIssueTypes]);
  return combined.length > 0 ? combined : ['no_gap'];
};

const fixForIssue = (issueType: UserAppAnonymousTrialGapActionIssueType): string => {
  if (issueType === 'privacy_incident' || issueType === 'over_collected_forbidden_data') {
    return '暂停后续试用，清理不合规记录，并重写隐私边界、收集协议和管理员口径。';
  }
  if (issueType === 'missing_participant_notice') {
    return '补充参与者说明，明确匿名、本地、不上传、不训练、不收集照片和敏感信息。';
  }
  if (issueType === 'missing_admin_script') {
    return '补齐管理员脚本，避免引导参与者提供身份、联系方式、照片或健康信息。';
  }
  if (issueType === 'missing_stop_condition_record') {
    return '补充停止条件记录格式，确保隐私、上传、训练、身份信息风险出现时立即停止。';
  }
  if (issueType === 'missing_post_launch_handoff') {
    return '补齐试用后 handoff，说明证据状态、缺口、暂停原因和下一步限制。';
  }
  if (issueType === 'insufficient_sample_size') {
    return '重复 dry run 或继续匿名内部试用，补充更多匿名聚合摘要。';
  }
  if (issueType === 'low_confidence_issue') {
    return '继续观察，不把低置信度问题直接变成即时修复。';
  }
  if (issueType === 'no_gap') {
    return '保持匿名边界，准备下一轮匿名内部试用或 MVP validation preconditions 检查。';
  }
  return '补齐对应匿名证据项，更新记录模板和管理员检查清单。';
};

const createAcceptanceCriteria = (
  issueType: UserAppAnonymousTrialGapActionIssueType,
  priority: UserAppAnonymousTrialGapActionPriority,
  resolved: boolean,
): UserAppAnonymousTrialGapActionAcceptanceCriteria[] => [
  {
    criteriaId: `anonymous-trial-gap-action-${issueType}-anonymous-local`,
    label: '只使用匿名、本地、聚合摘要，不保存真实身份、联系方式、照片或敏感信息。',
    requiredBeforeNextTrial: priority === 'p0_privacy_blocker' || priority === 'p1_required_before_next_trial',
    satisfied: resolved || priority === 'p2_should_fix' || priority === 'p3_observe' || priority === 'no_action',
  },
  {
    criteriaId: `anonymous-trial-gap-action-${issueType}-no-upload-training`,
    label: '确认不上传、不训练、不写入 project-state user records。',
    requiredBeforeNextTrial: priority !== 'no_action',
    satisfied: resolved || priority === 'p3_observe' || priority === 'no_action',
  },
];

const createAction = (
  issueType: UserAppAnonymousTrialGapActionIssueType,
  resolvedIssueTypes: readonly UserAppAnonymousTrialGapActionIssueType[],
): UserAppAnonymousTrialGapAction => {
  const priority = priorityForIssue(issueType);
  const resolved = resolvedIssueTypes.includes(issueType) || priority === 'no_action';
  return {
    actionId: `anonymous-trial-gap-action-${issueType}`,
    issueType,
    label: issueLabel[issueType],
    ownerArea: ownerForIssue(issueType),
    priority,
    recommendedFix: fixForIssue(issueType),
    acceptanceCriteria: createAcceptanceCriteria(issueType, priority, resolved),
    blocksNextAnonymousTrial:
      !resolved &&
      (priority === 'p0_privacy_blocker' || priority === 'p1_required_before_next_trial'),
    blocksMvpValidationPreconditions:
      priority === 'p0_privacy_blocker' ||
      priority === 'p1_required_before_next_trial' ||
      priority === 'p2_should_fix',
    resolved,
  };
};

export const createUserAppAnonymousTrialGapActionPlan = (
  input: CreateUserAppAnonymousTrialGapActionPlanInput = {},
): UserAppAnonymousTrialGapActionPlan => {
  const decisionInput = input.decisionInput ?? createUserAppAnonymousTrialDecisionInput();
  const issueTypes = issueTypesFromDecisionInput(decisionInput, input.manualIssueTypes ?? []);
  const actions = issueTypes.map((issueType) =>
    createAction(issueType, input.resolvedIssueTypes ?? []),
  );

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_GAP_ACTION_PLAN_SCHEMA_VERSION,
    actionPlanId: input.actionPlanId ?? 'anonymous-internal-trial-gap-action-plan-v0',
    title: input.title ?? '匿名内部试用证据缺口行动计划',
    decisionInput,
    actions,
    localOnly: true,
    deterministic: true,
    anonymousOrExampleOnly: true,
    reviewOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
