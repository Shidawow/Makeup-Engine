import {
  createUserAppAnonymousTrialFollowUpIteration,
  type UserAppAnonymousTrialFollowUpIteration,
} from './userAppAnonymousTrialFollowUpIteration';
import {
  createUserAppAnonymousTrialGapActionPlan,
  type UserAppAnonymousTrialGapActionPlan,
} from './userAppAnonymousTrialGapActionPlan';

export const USER_APP_ANONYMOUS_TRIAL_FOLLOW_UP_READINESS_SCHEMA_VERSION =
  'user-app-anonymous-trial-follow-up-readiness-v0.1' as const;

export type UserAppAnonymousTrialFollowUpReadinessDecision =
  | 'ready_for_next_anonymous_internal_trial'
  | 'ready_with_warnings'
  | 'repeat_dry_run_before_trial'
  | 'revise_protocol_before_trial'
  | 'revise_launch_pack_before_trial'
  | 'pause_for_privacy_or_scope_fix'
  | 'ready_for_mvp_validation_preconditions'
  | 'do_not_advance';

export interface UserAppAnonymousTrialFollowUpReadinessCheck {
  checkId: string;
  label: string;
  passed: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppAnonymousTrialFollowUpReadinessRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialFollowUpReadinessRecommendation {
  recommendationId: string;
  message: string;
  nextAction: string;
}

export interface UserAppAnonymousTrialFollowUpReadiness {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_FOLLOW_UP_READINESS_SCHEMA_VERSION;
  readinessId: string;
  title: string;
  decision: UserAppAnonymousTrialFollowUpReadinessDecision;
  followUpIteration: UserAppAnonymousTrialFollowUpIteration;
  gapActionPlan: UserAppAnonymousTrialGapActionPlan;
  checks: UserAppAnonymousTrialFollowUpReadinessCheck[];
  risks: UserAppAnonymousTrialFollowUpReadinessRisk[];
  recommendations: UserAppAnonymousTrialFollowUpReadinessRecommendation[];
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

export interface CreateUserAppAnonymousTrialFollowUpReadinessInput {
  readinessId?: string;
  title?: string;
  followUpIteration?: UserAppAnonymousTrialFollowUpIteration;
  gapActionPlan?: UserAppAnonymousTrialGapActionPlan;
  evidenceSufficientForMvpPreconditions?: boolean;
}

const hasUnresolvedAction = (
  gapActionPlan: UserAppAnonymousTrialGapActionPlan,
  issueTypes: readonly string[],
): boolean =>
  gapActionPlan.actions.some((action) => issueTypes.includes(action.issueType) && !action.resolved);

const createChecks = (
  followUpIteration: UserAppAnonymousTrialFollowUpIteration,
  gapActionPlan: UserAppAnonymousTrialGapActionPlan,
  evidenceSufficientForMvpPreconditions: boolean,
): UserAppAnonymousTrialFollowUpReadinessCheck[] => [
  {
    checkId: 'anonymous-follow-up-readiness-no-p0',
    label: '没有未解决 P0 隐私 blocker',
    passed: !gapActionPlan.actions.some(
      (action) => action.priority === 'p0_privacy_blocker' && !action.resolved,
    ),
    blocking: true,
    message: 'P0 隐私或 forbidden data blocker 未解决时不得继续。',
  },
  {
    checkId: 'anonymous-follow-up-readiness-notice-script-stop-handoff',
    label: 'notice / script / stop / handoff 已补齐',
    passed: !hasUnresolvedAction(gapActionPlan, [
      'missing_participant_notice',
      'missing_admin_script',
      'missing_stop_condition_record',
      'missing_post_launch_handoff',
    ]),
    blocking: true,
    message: '参与者说明、管理员脚本、停止条件和 handoff 是下一轮前置条件。',
  },
  {
    checkId: 'anonymous-follow-up-readiness-follow-up-actions',
    label: '后续迭代 action 已完成或可带提醒继续',
    passed: !followUpIteration.actions.some((action) => action.blocksNextAnonymousTrial),
    blocking: true,
    message: '仍有阻断下一轮匿名试用的 action 时不得 ready。',
  },
  {
    checkId: 'anonymous-follow-up-readiness-evidence-sufficient',
    label: 'MVP validation 前置证据足够',
    passed: evidenceSufficientForMvpPreconditions,
    blocking: false,
    message: '证据不足时不得 ready_for_mvp_validation_preconditions。',
  },
  {
    checkId: 'anonymous-follow-up-readiness-local-boundary',
    label: '匿名 / 本地 / 不上传 / 不训练边界保留',
    passed:
      followUpIteration.localOnly &&
      followUpIteration.anonymousOrExampleOnly &&
      !followUpIteration.requestsUpload &&
      !followUpIteration.writesTrainingInput &&
      !followUpIteration.writesProjectStateUserRecords,
    blocking: true,
    message: '后续迭代不能保存真实用户记录、上传或训练。',
  },
];

const decideReadiness = (
  followUpIteration: UserAppAnonymousTrialFollowUpIteration,
  gapActionPlan: UserAppAnonymousTrialGapActionPlan,
  checks: readonly UserAppAnonymousTrialFollowUpReadinessCheck[],
  evidenceSufficientForMvpPreconditions: boolean,
): UserAppAnonymousTrialFollowUpReadinessDecision => {
  const hasUnresolvedP0 = gapActionPlan.actions.some(
    (action) => action.priority === 'p0_privacy_blocker' && !action.resolved,
  );
  if (hasUnresolvedP0) return 'pause_for_privacy_or_scope_fix';
  if (followUpIteration.recommendation === 'do_not_advance') return 'do_not_advance';
  if (hasUnresolvedAction(gapActionPlan, ['missing_post_launch_handoff'])) {
    return 'revise_launch_pack_before_trial';
  }
  if (
    hasUnresolvedAction(gapActionPlan, [
      'missing_participant_notice',
      'missing_admin_script',
      'missing_stop_condition_record',
      'missing_privacy_clarity_evidence',
    ])
  ) {
    return 'revise_protocol_before_trial';
  }
  if (followUpIteration.recommendation === 'repeat_dry_run') return 'repeat_dry_run_before_trial';
  if (followUpIteration.recommendation === 'revise_launch_pack') {
    return 'revise_launch_pack_before_trial';
  }
  if (followUpIteration.recommendation === 'revise_evidence_collection_protocol') {
    return 'revise_protocol_before_trial';
  }
  if (
    followUpIteration.recommendation === 'prepare_mvp_validation_plan_preconditions' &&
    evidenceSufficientForMvpPreconditions &&
    checks.every((check) => check.passed || !check.blocking)
  ) {
    return 'ready_for_mvp_validation_preconditions';
  }
  if (
    followUpIteration.gapActionPlan.actions.some(
      (action) => action.issueType === 'insufficient_sample_size' && !action.resolved,
    )
  ) {
    return 'repeat_dry_run_before_trial';
  }
  if (checks.some((check) => check.blocking && !check.passed)) return 'do_not_advance';
  if (checks.some((check) => !check.passed)) return 'ready_with_warnings';
  return 'ready_for_next_anonymous_internal_trial';
};

const risksForDecision = (
  decision: UserAppAnonymousTrialFollowUpReadinessDecision,
): UserAppAnonymousTrialFollowUpReadinessRisk[] => {
  if (decision === 'pause_for_privacy_or_scope_fix') {
    return [
      {
        riskId: 'anonymous-follow-up-readiness-risk-privacy',
        severity: 'critical',
        message: '隐私或 forbidden data blocker 未解决。',
        mitigation: '暂停后续试用并先修复隐私边界。',
      },
    ];
  }
  if (decision === 'ready_for_mvp_validation_preconditions') {
    return [
      {
        riskId: 'anonymous-follow-up-readiness-risk-overclaim',
        severity: 'medium',
        message: 'MVP validation preconditions 仍不是生产发布批准。',
        mitigation: 'Phase 10A 只能做 validation plan，不启动生产 App、后端、公开招募或训练。',
      },
    ];
  }
  if (decision !== 'ready_for_next_anonymous_internal_trial') {
    return [
      {
        riskId: 'anonymous-follow-up-readiness-risk-open-work',
        severity: 'high',
        message: '仍有缺口、证据不足或后续 action 未完成。',
        mitigation: '完成对应修订后重新运行 readiness。',
      },
    ];
  }
  return [];
};

const recommendationsForDecision = (
  decision: UserAppAnonymousTrialFollowUpReadinessDecision,
): UserAppAnonymousTrialFollowUpReadinessRecommendation[] => {
  const nextAction: Record<UserAppAnonymousTrialFollowUpReadinessDecision, string> = {
    ready_for_next_anonymous_internal_trial: '可以继续下一轮匿名内部试用，仍只记录匿名本地摘要。',
    ready_with_warnings: '可以带提醒继续，但不得推进 MVP validation preconditions。',
    repeat_dry_run_before_trial: '先重复 dry run 或补匿名证据，再判断是否继续匿名试用。',
    revise_protocol_before_trial: '先修订证据收集协议、参与者说明、管理员脚本或停止条件。',
    revise_launch_pack_before_trial: '先修订 launch pack 和 post-launch handoff。',
    pause_for_privacy_or_scope_fix: '暂停试用，先修隐私、范围或 forbidden data 问题。',
    ready_for_mvp_validation_preconditions: '可以准备 Phase 10A MVP Validation Plan 的前置条件。',
    do_not_advance: '不要推进，先修复阻断项。',
  };
  return [
    {
      recommendationId: `anonymous-follow-up-readiness-${decision}`,
      message: decision,
      nextAction: nextAction[decision],
    },
  ];
};

export const createUserAppAnonymousTrialFollowUpReadiness = (
  input: CreateUserAppAnonymousTrialFollowUpReadinessInput = {},
): UserAppAnonymousTrialFollowUpReadiness => {
  const followUpIteration =
    input.followUpIteration ?? createUserAppAnonymousTrialFollowUpIteration();
  const gapActionPlan =
    input.gapActionPlan ??
    createUserAppAnonymousTrialGapActionPlan({
      decisionInput: followUpIteration.decisionInput,
    });
  const evidenceSufficientForMvpPreconditions =
    input.evidenceSufficientForMvpPreconditions ??
    (followUpIteration.decisionInput.recommendation === 'prepare_mvp_validation_plan' &&
      !followUpIteration.decisionInput.evidenceReview.mockOrExampleOnly &&
      followUpIteration.decisionInput.evidenceReview.sampleSize >= 3);
  const checks = createChecks(
    followUpIteration,
    gapActionPlan,
    evidenceSufficientForMvpPreconditions,
  );
  const decision = decideReadiness(
    followUpIteration,
    gapActionPlan,
    checks,
    evidenceSufficientForMvpPreconditions,
  );

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_FOLLOW_UP_READINESS_SCHEMA_VERSION,
    readinessId: input.readinessId ?? 'anonymous-internal-trial-follow-up-readiness-v0',
    title: input.title ?? '匿名内部试用后续就绪度',
    decision,
    followUpIteration,
    gapActionPlan,
    checks,
    risks: risksForDecision(decision),
    recommendations: recommendationsForDecision(decision),
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
