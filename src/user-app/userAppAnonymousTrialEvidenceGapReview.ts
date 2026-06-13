import {
  createUserAppAnonymousTrialEvidenceReview,
  type UserAppAnonymousTrialEvidenceReview,
} from './userAppAnonymousTrialEvidenceReview';

export const USER_APP_ANONYMOUS_TRIAL_EVIDENCE_GAP_REVIEW_SCHEMA_VERSION =
  'user-app-anonymous-trial-evidence-gap-review-v0.1' as const;

export type UserAppAnonymousTrialEvidenceGapType =
  | 'missing_task_completion_evidence'
  | 'missing_step_comprehension_evidence'
  | 'missing_template_value_evidence'
  | 'missing_shell_usability_evidence'
  | 'missing_privacy_clarity_evidence'
  | 'missing_stop_condition_record'
  | 'missing_post_launch_handoff'
  | 'insufficient_sample_size'
  | 'unclear_admin_notes'
  | 'over_collected_forbidden_data'
  | 'privacy_incident';

export type UserAppAnonymousTrialEvidenceGapSeverity =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type UserAppAnonymousTrialEvidenceGapReviewStatus =
  | 'gap_review_clear'
  | 'gap_review_has_gaps'
  | 'gap_review_blocked';

export interface UserAppAnonymousTrialEvidenceGap {
  gapId: string;
  type: UserAppAnonymousTrialEvidenceGapType;
  label: string;
  severity: UserAppAnonymousTrialEvidenceGapSeverity;
  message: string;
  blocksMvpValidationPlanning: boolean;
}

export interface UserAppAnonymousTrialEvidenceGapRecommendation {
  recommendationId: string;
  message: string;
  nextAction: string;
}

export interface UserAppAnonymousTrialEvidenceGapReview {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_EVIDENCE_GAP_REVIEW_SCHEMA_VERSION;
  gapReviewId: string;
  title: string;
  status: UserAppAnonymousTrialEvidenceGapReviewStatus;
  evidenceReview: UserAppAnonymousTrialEvidenceReview;
  gaps: UserAppAnonymousTrialEvidenceGap[];
  recommendations: UserAppAnonymousTrialEvidenceGapRecommendation[];
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

export interface CreateUserAppAnonymousTrialEvidenceGapReviewInput {
  gapReviewId?: string;
  title?: string;
  evidenceReview?: UserAppAnonymousTrialEvidenceReview;
  manualGapTypes?: UserAppAnonymousTrialEvidenceGapType[];
}

const gapLabels: Record<UserAppAnonymousTrialEvidenceGapType, string> = {
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
};

const severityForGap = (
  type: UserAppAnonymousTrialEvidenceGapType,
): UserAppAnonymousTrialEvidenceGapSeverity => {
  if (type === 'over_collected_forbidden_data' || type === 'privacy_incident') {
    return 'critical';
  }
  if (type === 'missing_post_launch_handoff') return 'high';
  if (
    type === 'missing_privacy_clarity_evidence' ||
    type === 'missing_stop_condition_record' ||
    type === 'insufficient_sample_size' ||
    type === 'unclear_admin_notes'
  ) {
    return 'medium';
  }
  return 'low';
};

const gapTypeByCompletenessCheckId: Record<string, UserAppAnonymousTrialEvidenceGapType> = {
  'anonymous-trial-evidence-completeness-task_completion_evidence':
    'missing_task_completion_evidence',
  'anonymous-trial-evidence-completeness-step_comprehension_evidence':
    'missing_step_comprehension_evidence',
  'anonymous-trial-evidence-completeness-template_value_evidence':
    'missing_template_value_evidence',
  'anonymous-trial-evidence-completeness-shell_usability_evidence':
    'missing_shell_usability_evidence',
  'anonymous-trial-evidence-completeness-privacy_clarity_evidence':
    'missing_privacy_clarity_evidence',
  'anonymous-trial-evidence-completeness-stop_condition_evidence':
    'missing_stop_condition_record',
  'anonymous-trial-evidence-completeness-post_launch_handoff_evidence':
    'missing_post_launch_handoff',
};

const unique = <T>(items: readonly T[]): T[] => Array.from(new Set(items));

const gapTypesFromReview = (
  review: UserAppAnonymousTrialEvidenceReview,
  manualGapTypes: readonly UserAppAnonymousTrialEvidenceGapType[],
): UserAppAnonymousTrialEvidenceGapType[] => {
  const gapTypes: UserAppAnonymousTrialEvidenceGapType[] = [];
  review.completenessChecks
    .filter((check) => !check.passed)
    .forEach((check) => {
      const gapType = gapTypeByCompletenessCheckId[check.checkId];
      if (gapType) gapTypes.push(gapType);
    });
  if (review.sampleSize < 3) gapTypes.push('insufficient_sample_size');
  if (review.privacyIncidents.length > 0) gapTypes.push('privacy_incident');
  if (
    review.privacyChecks.some(
      (check) =>
        !check.passed &&
        (check.checkId === 'anonymous-trial-evidence-no-forbidden-data' ||
          check.checkId === 'anonymous-trial-evidence-no-photo-health-biometric' ||
          check.checkId === 'anonymous-trial-evidence-no-real-identity' ||
          check.checkId === 'anonymous-trial-evidence-no-upload-training'),
    )
  ) {
    gapTypes.push('over_collected_forbidden_data');
  }
  return unique([...gapTypes, ...manualGapTypes]);
};

const createGap = (type: UserAppAnonymousTrialEvidenceGapType): UserAppAnonymousTrialEvidenceGap => {
  const severity = severityForGap(type);
  const blocksMvpValidationPlanning =
    severity === 'critical' ||
    severity === 'high' ||
    type === 'insufficient_sample_size' ||
    type === 'missing_privacy_clarity_evidence' ||
    type === 'unclear_admin_notes';

  return {
    gapId: `anonymous-trial-evidence-gap-${type}`,
    type,
    label: gapLabels[type],
    severity,
    message:
      type === 'over_collected_forbidden_data'
        ? '发现 forbidden data 过度收集，必须停止推进并修复协议。'
        : `${gapLabels[type]}会降低下一步判断可信度。`,
    blocksMvpValidationPlanning,
  };
};

const recommendationsForGaps = (
  gaps: readonly UserAppAnonymousTrialEvidenceGap[],
): UserAppAnonymousTrialEvidenceGapRecommendation[] => {
  if (gaps.length === 0) {
    return [
      {
        recommendationId: 'anonymous-trial-evidence-gap-clear',
        message: '没有发现关键证据缺口。',
        nextAction: '可以进入下一步决策输入，但仍需确认是否是真实匿名内部试用证据。',
      },
    ];
  }
  if (gaps.some((gap) => gap.severity === 'critical')) {
    return [
      {
        recommendationId: 'anonymous-trial-evidence-gap-critical',
        message: '存在 critical 级证据或隐私缺口。',
        nextAction: '暂停推进，先修复隐私边界、启动包或证据收集协议。',
      },
    ];
  }
  if (gaps.some((gap) => gap.type === 'insufficient_sample_size')) {
    return [
      {
        recommendationId: 'anonymous-trial-evidence-gap-repeat-trial',
        message: '样本量不足，不得直接推进 MVP validation planning。',
        nextAction: '重复匿名内部试用或补充更多匿名摘要。',
      },
    ];
  }
  return [
    {
      recommendationId: 'anonymous-trial-evidence-gap-improve-review',
      message: '证据仍有非阻断缺口。',
      nextAction: '补齐缺口后再进入更强决策，或先继续匿名内部试用。',
    },
  ];
};

const statusFromGaps = (
  gaps: readonly UserAppAnonymousTrialEvidenceGap[],
): UserAppAnonymousTrialEvidenceGapReviewStatus => {
  if (gaps.some((gap) => gap.severity === 'critical' || gap.severity === 'high')) {
    return 'gap_review_blocked';
  }
  if (gaps.length > 0) return 'gap_review_has_gaps';
  return 'gap_review_clear';
};

export const createUserAppAnonymousTrialEvidenceGapReview = (
  input: CreateUserAppAnonymousTrialEvidenceGapReviewInput = {},
): UserAppAnonymousTrialEvidenceGapReview => {
  const evidenceReview = input.evidenceReview ?? createUserAppAnonymousTrialEvidenceReview();
  const gapTypes = gapTypesFromReview(evidenceReview, input.manualGapTypes ?? []);
  const gaps = gapTypes.map(createGap);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_EVIDENCE_GAP_REVIEW_SCHEMA_VERSION,
    gapReviewId: input.gapReviewId ?? 'anonymous-internal-trial-evidence-gap-review-v0',
    title: input.title ?? '匿名内部试用证据缺口复盘',
    status: statusFromGaps(gaps),
    evidenceReview,
    gaps,
    recommendations: recommendationsForGaps(gaps),
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
