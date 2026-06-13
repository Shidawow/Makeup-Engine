import {
  createUserAppAnonymousTrialEvidenceGapReview,
  type UserAppAnonymousTrialEvidenceGapReview,
} from './userAppAnonymousTrialEvidenceGapReview';
import {
  createUserAppAnonymousTrialEvidenceReview,
  type UserAppAnonymousTrialEvidenceReview,
} from './userAppAnonymousTrialEvidenceReview';

export const USER_APP_ANONYMOUS_TRIAL_DECISION_INPUT_SCHEMA_VERSION =
  'user-app-anonymous-trial-decision-input-v0.1' as const;

export type UserAppAnonymousTrialDecisionRecommendation =
  | 'continue_anonymous_internal_trial'
  | 'repeat_anonymous_internal_trial'
  | 'revise_launch_pack'
  | 'revise_evidence_collection_protocol'
  | 'pause_for_privacy_or_scope_fix'
  | 'prepare_mvp_validation_plan'
  | 'do_not_advance';

export interface UserAppAnonymousTrialDecisionSignal {
  signalId: string;
  label: string;
  strength: 'weak' | 'medium' | 'strong';
  supportsMvpValidationPlanning: boolean;
  summary: string;
}

export interface UserAppAnonymousTrialDecisionRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialDecisionInput {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_DECISION_INPUT_SCHEMA_VERSION;
  decisionInputId: string;
  title: string;
  recommendation: UserAppAnonymousTrialDecisionRecommendation;
  evidenceReview: UserAppAnonymousTrialEvidenceReview;
  gapReview: UserAppAnonymousTrialEvidenceGapReview;
  signals: UserAppAnonymousTrialDecisionSignal[];
  risks: UserAppAnonymousTrialDecisionRisk[];
  nextAction: string;
  localOnly: true;
  deterministic: true;
  reviewOnly: true;
  anonymousOrExampleOnly: true;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialDecisionInputInput {
  decisionInputId?: string;
  title?: string;
  evidenceReview?: UserAppAnonymousTrialEvidenceReview;
  gapReview?: UserAppAnonymousTrialEvidenceGapReview;
  signals?: UserAppAnonymousTrialDecisionSignal[];
}

export const createDefaultUserAppAnonymousTrialDecisionSignals =
  (): UserAppAnonymousTrialDecisionSignal[] => [
    {
      signalId: 'anonymous-trial-decision-signal-task-completion',
      label: '任务完成信号',
      strength: 'medium',
      supportsMvpValidationPlanning: false,
      summary: '匿名摘要显示任务路径可复盘，但仍需要更多真实匿名证据。',
    },
    {
      signalId: 'anonymous-trial-decision-signal-user-value',
      label: '模板价值信号',
      strength: 'medium',
      supportsMvpValidationPlanning: false,
      summary: '匿名摘要可以判断价值方向，但不能替代 MVP validation evidence。',
    },
    {
      signalId: 'anonymous-trial-decision-signal-privacy',
      label: '隐私清晰度信号',
      strength: 'medium',
      supportsMvpValidationPlanning: false,
      summary: '隐私边界可被复盘，仍需确认没有 forbidden data。',
    },
  ];

const strongValidationSignals = (
  signals: readonly UserAppAnonymousTrialDecisionSignal[],
): boolean =>
  signals.filter((signal) => signal.supportsMvpValidationPlanning && signal.strength === 'strong')
    .length >= 3;

const decide = (
  evidenceReview: UserAppAnonymousTrialEvidenceReview,
  gapReview: UserAppAnonymousTrialEvidenceGapReview,
  signals: readonly UserAppAnonymousTrialDecisionSignal[],
): UserAppAnonymousTrialDecisionRecommendation => {
  const hasPrivacyIncident =
    evidenceReview.privacyIncidents.length > 0 ||
    gapReview.gaps.some(
      (gap) =>
        gap.type === 'privacy_incident' || gap.type === 'over_collected_forbidden_data',
    );
  if (hasPrivacyIncident) return 'pause_for_privacy_or_scope_fix';
  if (evidenceReview.status === 'evidence_review_blocked') return 'do_not_advance';
  if (gapReview.gaps.some((gap) => gap.type === 'missing_post_launch_handoff')) {
    return 'revise_launch_pack';
  }
  if (
    gapReview.gaps.some(
      (gap) =>
        gap.type === 'missing_privacy_clarity_evidence' ||
        gap.type === 'missing_stop_condition_record' ||
        gap.type === 'unclear_admin_notes',
    )
  ) {
    return 'revise_evidence_collection_protocol';
  }
  if (gapReview.gaps.some((gap) => gap.type === 'insufficient_sample_size')) {
    return 'repeat_anonymous_internal_trial';
  }
  if (gapReview.gaps.some((gap) => gap.blocksMvpValidationPlanning)) {
    return 'continue_anonymous_internal_trial';
  }
  if (
    evidenceReview.status === 'evidence_review_ready' &&
    !evidenceReview.mockOrExampleOnly &&
    evidenceReview.sampleSize >= 3 &&
    strongValidationSignals(signals)
  ) {
    return 'prepare_mvp_validation_plan';
  }
  if (evidenceReview.mockOrExampleOnly) return 'repeat_anonymous_internal_trial';
  return 'continue_anonymous_internal_trial';
};

const risksForDecision = (
  recommendation: UserAppAnonymousTrialDecisionRecommendation,
  evidenceReview: UserAppAnonymousTrialEvidenceReview,
  gapReview: UserAppAnonymousTrialEvidenceGapReview,
): UserAppAnonymousTrialDecisionRisk[] => {
  const risks: UserAppAnonymousTrialDecisionRisk[] = [];
  if (recommendation === 'pause_for_privacy_or_scope_fix') {
    risks.push({
      riskId: 'anonymous-trial-decision-risk-privacy',
      severity: 'critical',
      message: '隐私事件或 forbidden data 阻断下一步。',
      mitigation: '暂停试用，修复协议、启动包、管理员话术和记录模板。',
    });
  }
  if (recommendation === 'prepare_mvp_validation_plan') {
    risks.push({
      riskId: 'anonymous-trial-decision-risk-overclaim',
      severity: 'medium',
      message: '准备 MVP validation planning 仍不是生产发布或后端数据系统批准。',
      mitigation: 'Phase 10A 只能做 validation plan，不得新增 production scope。',
    });
  }
  if (evidenceReview.mockOrExampleOnly) {
    risks.push({
      riskId: 'anonymous-trial-decision-risk-mock-evidence',
      severity: 'medium',
      message: '当前证据仍是 mock/example，不能当作真实匿名内部试用结果。',
      mitigation: '先重复匿名内部试用或补充真实匿名摘要，再做强判断。',
    });
  }
  if (gapReview.gaps.some((gap) => gap.blocksMvpValidationPlanning)) {
    risks.push({
      riskId: 'anonymous-trial-decision-risk-gaps',
      severity: 'high',
      message: '存在会阻断 MVP validation planning 的证据缺口。',
      mitigation: '补齐缺口或继续匿名内部试用。',
    });
  }
  return risks;
};

const nextActionForRecommendation = (
  recommendation: UserAppAnonymousTrialDecisionRecommendation,
): string => {
  const nextAction: Record<UserAppAnonymousTrialDecisionRecommendation, string> = {
    continue_anonymous_internal_trial:
      '继续匿名内部试用，只收集匿名、本地、聚合摘要。',
    repeat_anonymous_internal_trial:
      '重复匿名内部试用，补足样本量或替换 mock/example 证据。',
    revise_launch_pack: '修订启动包、参与者说明、管理员脚本或 post-launch handoff。',
    revise_evidence_collection_protocol:
      '修订证据收集协议、checklist、停止条件和管理员记录口径。',
    pause_for_privacy_or_scope_fix:
      '暂停试用和复盘，优先修复隐私、范围或 forbidden data 问题。',
    prepare_mvp_validation_plan:
      '可以准备 Phase 10A MVP Validation Plan；仍不得新增生产 App、后端、上传、AI 分析或训练。',
    do_not_advance: '不要推进下一阶段，先修复阻断问题。',
  };
  return nextAction[recommendation];
};

export const createUserAppAnonymousTrialDecisionInput = (
  input: CreateUserAppAnonymousTrialDecisionInputInput = {},
): UserAppAnonymousTrialDecisionInput => {
  const evidenceReview = input.evidenceReview ?? createUserAppAnonymousTrialEvidenceReview();
  const gapReview =
    input.gapReview ?? createUserAppAnonymousTrialEvidenceGapReview({ evidenceReview });
  const signals = input.signals ?? createDefaultUserAppAnonymousTrialDecisionSignals();
  const recommendation = decide(evidenceReview, gapReview, signals);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_DECISION_INPUT_SCHEMA_VERSION,
    decisionInputId: input.decisionInputId ?? 'anonymous-internal-trial-decision-input-v0',
    title: input.title ?? '匿名内部试用下一步决策输入',
    recommendation,
    evidenceReview,
    gapReview,
    signals,
    risks: risksForDecision(recommendation, evidenceReview, gapReview),
    nextAction: nextActionForRecommendation(recommendation),
    localOnly: true,
    deterministic: true,
    reviewOnly: true,
    anonymousOrExampleOnly: true,
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
