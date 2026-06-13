import {
  createUserAppAnonymousTrialDecisionInput,
  type UserAppAnonymousTrialDecisionInput,
} from './userAppAnonymousTrialDecisionInput';
import {
  createUserAppAnonymousTrialGapActionPlan,
  type UserAppAnonymousTrialGapActionPlan,
} from './userAppAnonymousTrialGapActionPlan';

export const USER_APP_ANONYMOUS_TRIAL_FOLLOW_UP_ITERATION_SCHEMA_VERSION =
  'user-app-anonymous-trial-follow-up-iteration-v0.1' as const;

export type UserAppAnonymousTrialFollowUpIterationStatus =
  | 'follow_up_ready'
  | 'follow_up_ready_with_warnings'
  | 'follow_up_blocked';

export type UserAppAnonymousTrialFollowUpIterationActionType =
  | 'revise_launch_pack'
  | 'revise_evidence_collection_protocol'
  | 'revise_participant_notice'
  | 'revise_admin_script'
  | 'revise_stop_conditions'
  | 'repeat_dry_run'
  | 'continue_anonymous_internal_trial'
  | 'collect_more_anonymous_evidence'
  | 'pause_for_privacy_or_scope_fix'
  | 'prepare_mvp_validation_plan_preconditions';

export type UserAppAnonymousTrialFollowUpIterationRecommendation =
  | 'revise_launch_pack'
  | 'revise_evidence_collection_protocol'
  | 'repeat_dry_run'
  | 'continue_anonymous_internal_trial'
  | 'pause_for_privacy_or_scope_fix'
  | 'prepare_mvp_validation_plan_preconditions'
  | 'do_not_advance';

export interface UserAppAnonymousTrialFollowUpIterationGoal {
  goalId: string;
  label: string;
  summary: string;
  requiredBeforeNextTrial: boolean;
}

export interface UserAppAnonymousTrialFollowUpIterationAction {
  actionId: string;
  type: UserAppAnonymousTrialFollowUpIterationActionType;
  label: string;
  summary: string;
  completed: boolean;
  blocksNextAnonymousTrial: boolean;
  blocksMvpValidationPreconditions: boolean;
}

export interface UserAppAnonymousTrialFollowUpIterationRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialFollowUpIteration {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_FOLLOW_UP_ITERATION_SCHEMA_VERSION;
  iterationId: string;
  title: string;
  status: UserAppAnonymousTrialFollowUpIterationStatus;
  recommendation: UserAppAnonymousTrialFollowUpIterationRecommendation;
  decisionInput: UserAppAnonymousTrialDecisionInput;
  gapActionPlan: UserAppAnonymousTrialGapActionPlan;
  goals: UserAppAnonymousTrialFollowUpIterationGoal[];
  actions: UserAppAnonymousTrialFollowUpIterationAction[];
  risks: UserAppAnonymousTrialFollowUpIterationRisk[];
  localOnly: true;
  deterministic: true;
  anonymousOrExampleOnly: true;
  reviewOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialFollowUpIterationInput {
  iterationId?: string;
  title?: string;
  decisionInput?: UserAppAnonymousTrialDecisionInput;
  gapActionPlan?: UserAppAnonymousTrialGapActionPlan;
  completedActionTypes?: UserAppAnonymousTrialFollowUpIterationActionType[];
}

const actionLabels: Record<UserAppAnonymousTrialFollowUpIterationActionType, string> = {
  revise_launch_pack: '修订启动包',
  revise_evidence_collection_protocol: '修订证据收集协议',
  revise_participant_notice: '修订参与者说明',
  revise_admin_script: '修订管理员脚本',
  revise_stop_conditions: '修订停止条件',
  repeat_dry_run: '重复 dry run',
  continue_anonymous_internal_trial: '继续匿名内部试用',
  collect_more_anonymous_evidence: '补充匿名证据',
  pause_for_privacy_or_scope_fix: '因隐私或范围问题暂停',
  prepare_mvp_validation_plan_preconditions: '准备 MVP validation 前置条件',
};

const actionSummary: Record<UserAppAnonymousTrialFollowUpIterationActionType, string> = {
  revise_launch_pack: '更新 launch pack、handoff 和管理员检查项，避免结构缺口进入下一轮。',
  revise_evidence_collection_protocol: '更新协议、记录模板和质量门，只允许匿名聚合摘要。',
  revise_participant_notice: '用普通中文说明不收集照片、身份、联系方式、健康或敏感信息。',
  revise_admin_script: '让管理员脚本避免诱导上传、身份、联系方式或健康信息。',
  revise_stop_conditions: '隐私、上传、训练、身份或敏感信息风险出现时立即停止。',
  repeat_dry_run: '先用 mock/example 或内部演练补齐流程，再决定是否继续匿名试用。',
  continue_anonymous_internal_trial: '继续小范围匿名内部试用，只收集本地匿名摘要。',
  collect_more_anonymous_evidence: '补充匿名任务完成、步骤理解、价值、可用性和隐私清晰度摘要。',
  pause_for_privacy_or_scope_fix: '暂停试用，先修复隐私边界、范围和 forbidden data 问题。',
  prepare_mvp_validation_plan_preconditions: '仅准备 Phase 10A 前置条件，不启动生产 App 或公开招募。',
};

const createGoals = (): UserAppAnonymousTrialFollowUpIterationGoal[] => [
  {
    goalId: 'anonymous-follow-up-goal-fix-gaps',
    label: '修复阻断缺口',
    summary: '先处理 privacy、notice、script、stop condition、handoff 等阻断项。',
    requiredBeforeNextTrial: true,
  },
  {
    goalId: 'anonymous-follow-up-goal-preserve-boundary',
    label: '守住匿名边界',
    summary: '后续迭代仍然匿名、本地、不上传、不训练、不保存真实用户记录。',
    requiredBeforeNextTrial: true,
  },
  {
    goalId: 'anonymous-follow-up-goal-decide-next-step',
    label: '保守决定下一步',
    summary: '根据证据质量选择重复 dry run、继续匿名试用或仅准备 MVP validation 前置条件。',
    requiredBeforeNextTrial: false,
  },
];

const actionTypesFromDecision = (
  decisionInput: UserAppAnonymousTrialDecisionInput,
  gapActionPlan: UserAppAnonymousTrialGapActionPlan,
): UserAppAnonymousTrialFollowUpIterationActionType[] => {
  const actionTypes = new Set<UserAppAnonymousTrialFollowUpIterationActionType>();

  for (const action of gapActionPlan.actions) {
    if (action.priority === 'p0_privacy_blocker') actionTypes.add('pause_for_privacy_or_scope_fix');
    if (action.ownerArea === 'launch_pack' || action.ownerArea === 'post_launch_handoff') {
      actionTypes.add('revise_launch_pack');
    }
    if (action.ownerArea === 'participant_notice') actionTypes.add('revise_participant_notice');
    if (action.ownerArea === 'admin_script') actionTypes.add('revise_admin_script');
    if (action.ownerArea === 'stop_conditions') actionTypes.add('revise_stop_conditions');
    if (
      action.ownerArea === 'evidence_collection_protocol' &&
      action.issueType !== 'insufficient_sample_size'
    ) {
      actionTypes.add('revise_evidence_collection_protocol');
    }
    if (action.priority === 'p2_should_fix' && action.issueType === 'insufficient_sample_size') {
      actionTypes.add('collect_more_anonymous_evidence');
    }
  }

  if (decisionInput.recommendation === 'repeat_anonymous_internal_trial') {
    actionTypes.add('repeat_dry_run');
  }
  if (decisionInput.recommendation === 'continue_anonymous_internal_trial') {
    actionTypes.add('continue_anonymous_internal_trial');
  }
  if (decisionInput.recommendation === 'prepare_mvp_validation_plan') {
    actionTypes.add('prepare_mvp_validation_plan_preconditions');
  }
  if (decisionInput.recommendation === 'do_not_advance') {
    actionTypes.add('repeat_dry_run');
  }

  if (actionTypes.size === 0) actionTypes.add('continue_anonymous_internal_trial');
  return Array.from(actionTypes);
};

const recommendationFromActions = (
  decisionInput: UserAppAnonymousTrialDecisionInput,
  actionTypes: readonly UserAppAnonymousTrialFollowUpIterationActionType[],
): UserAppAnonymousTrialFollowUpIterationRecommendation => {
  if (actionTypes.includes('pause_for_privacy_or_scope_fix')) return 'pause_for_privacy_or_scope_fix';
  if (decisionInput.recommendation === 'do_not_advance') return 'do_not_advance';
  if (
    actionTypes.some((action) =>
      ['revise_evidence_collection_protocol', 'revise_stop_conditions'].includes(action),
    )
  ) {
    return 'revise_evidence_collection_protocol';
  }
  if (
    actionTypes.some((action) =>
      ['revise_launch_pack', 'revise_participant_notice', 'revise_admin_script'].includes(action),
    )
  ) {
    return 'revise_launch_pack';
  }
  if (actionTypes.includes('repeat_dry_run')) return 'repeat_dry_run';
  if (actionTypes.includes('prepare_mvp_validation_plan_preconditions')) {
    return 'prepare_mvp_validation_plan_preconditions';
  }
  return 'continue_anonymous_internal_trial';
};

const createActions = (
  actionTypes: readonly UserAppAnonymousTrialFollowUpIterationActionType[],
  completedActionTypes: readonly UserAppAnonymousTrialFollowUpIterationActionType[],
): UserAppAnonymousTrialFollowUpIterationAction[] =>
  actionTypes.map((type) => {
    const completed = completedActionTypes.includes(type);
    const blocksNextAnonymousTrial =
      !completed &&
      [
        'pause_for_privacy_or_scope_fix',
        'revise_launch_pack',
        'revise_participant_notice',
        'revise_admin_script',
        'revise_stop_conditions',
      ].includes(type);
    return {
      actionId: `anonymous-trial-follow-up-action-${type}`,
      type,
      label: actionLabels[type],
      summary: actionSummary[type],
      completed,
      blocksNextAnonymousTrial,
      blocksMvpValidationPreconditions:
        !completed && type !== 'continue_anonymous_internal_trial',
    };
  });

const statusFromActions = (
  actions: readonly UserAppAnonymousTrialFollowUpIterationAction[],
): UserAppAnonymousTrialFollowUpIterationStatus => {
  if (actions.some((action) => action.type === 'pause_for_privacy_or_scope_fix')) {
    return 'follow_up_blocked';
  }
  if (actions.some((action) => action.blocksNextAnonymousTrial)) return 'follow_up_blocked';
  if (actions.some((action) => action.blocksMvpValidationPreconditions)) {
    return 'follow_up_ready_with_warnings';
  }
  return 'follow_up_ready';
};

const risksForIteration = (
  decisionInput: UserAppAnonymousTrialDecisionInput,
  actions: readonly UserAppAnonymousTrialFollowUpIterationAction[],
): UserAppAnonymousTrialFollowUpIterationRisk[] => {
  const risks: UserAppAnonymousTrialFollowUpIterationRisk[] = [];
  if (actions.some((action) => action.type === 'pause_for_privacy_or_scope_fix')) {
    risks.push({
      riskId: 'anonymous-trial-follow-up-risk-privacy',
      severity: 'critical',
      message: '隐私、上传、训练或 forbidden data 问题阻断后续试用。',
      mitigation: '暂停，先修复收集协议、启动包、参与者说明和管理员脚本。',
    });
  }
  if (decisionInput.evidenceReview.mockOrExampleOnly) {
    risks.push({
      riskId: 'anonymous-trial-follow-up-risk-mock-evidence',
      severity: 'medium',
      message: '当前证据仍是 mock/example，不能过度推进 MVP validation。',
      mitigation: '重复 dry run 或继续匿名内部试用，补充真实匿名摘要。',
    });
  }
  if (actions.some((action) => action.blocksMvpValidationPreconditions)) {
    risks.push({
      riskId: 'anonymous-trial-follow-up-risk-open-actions',
      severity: 'high',
      message: '仍有后续 action 未完成，不能准备更强 validation 判断。',
      mitigation: '完成阻断项后再重新运行 follow-up readiness。',
    });
  }
  return risks;
};

export const createUserAppAnonymousTrialFollowUpIteration = (
  input: CreateUserAppAnonymousTrialFollowUpIterationInput = {},
): UserAppAnonymousTrialFollowUpIteration => {
  const decisionInput = input.decisionInput ?? createUserAppAnonymousTrialDecisionInput();
  const gapActionPlan =
    input.gapActionPlan ?? createUserAppAnonymousTrialGapActionPlan({ decisionInput });
  const actionTypes = actionTypesFromDecision(decisionInput, gapActionPlan);
  const actions = createActions(actionTypes, input.completedActionTypes ?? []);
  const recommendation = recommendationFromActions(decisionInput, actionTypes);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_FOLLOW_UP_ITERATION_SCHEMA_VERSION,
    iterationId: input.iterationId ?? 'anonymous-internal-trial-follow-up-iteration-v0',
    title: input.title ?? '匿名内部试用后续迭代计划',
    status: statusFromActions(actions),
    recommendation,
    decisionInput,
    gapActionPlan,
    goals: createGoals(),
    actions,
    risks: risksForIteration(decisionInput, actions),
    localOnly: true,
    deterministic: true,
    anonymousOrExampleOnly: true,
    reviewOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
