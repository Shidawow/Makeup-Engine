import {
  createUserAppAnonymousTrialPostLaunchHandoff,
  type UserAppAnonymousTrialPostLaunchHandoff,
} from './userAppAnonymousTrialPostLaunchHandoff';

export const USER_APP_ANONYMOUS_TRIAL_EVIDENCE_REVIEW_SCHEMA_VERSION =
  'user-app-anonymous-trial-evidence-review-v0.1' as const;

export type UserAppAnonymousTrialEvidenceReviewDimension =
  | 'task_completion_evidence'
  | 'step_comprehension_evidence'
  | 'template_value_evidence'
  | 'shell_usability_evidence'
  | 'recommendation_usefulness_evidence'
  | 'privacy_clarity_evidence'
  | 'trial_ops_evidence'
  | 'stop_condition_evidence'
  | 'post_launch_handoff_evidence'
  | 'decision_input_evidence';

export type UserAppAnonymousTrialEvidenceReviewSource =
  | 'anonymous_internal_trial_summary'
  | 'mock_example_summary'
  | 'missing';

export type UserAppAnonymousTrialEvidenceReviewStatus =
  | 'evidence_review_ready'
  | 'evidence_review_ready_with_warnings'
  | 'evidence_review_blocked';

export interface UserAppAnonymousTrialEvidenceReviewItem {
  itemId: string;
  dimension: UserAppAnonymousTrialEvidenceReviewDimension;
  label: string;
  summary: string;
  present: boolean;
  source: UserAppAnonymousTrialEvidenceReviewSource;
  localOnly: true;
  anonymousOnly: true;
  containsRealIdentity: false;
  containsContact: false;
  containsPhoto: false;
  containsHealthInfo: false;
  containsSensitiveIdentity: false;
  containsBiometric: false;
  requestsUpload: false;
  writesTrainingInput: false;
}

export interface UserAppAnonymousTrialEvidenceCompletenessCheck {
  checkId: string;
  dimension: UserAppAnonymousTrialEvidenceReviewDimension;
  label: string;
  passed: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppAnonymousTrialEvidencePrivacyCheck {
  checkId: string;
  label: string;
  passed: boolean;
  blocking: boolean;
  message: string;
}

export interface UserAppAnonymousTrialEvidenceReviewRisk {
  riskId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  mitigation: string;
}

export interface UserAppAnonymousTrialEvidenceReview {
  schemaVersion: typeof USER_APP_ANONYMOUS_TRIAL_EVIDENCE_REVIEW_SCHEMA_VERSION;
  reviewId: string;
  title: string;
  status: UserAppAnonymousTrialEvidenceReviewStatus;
  postLaunchHandoff: UserAppAnonymousTrialPostLaunchHandoff;
  items: UserAppAnonymousTrialEvidenceReviewItem[];
  completenessChecks: UserAppAnonymousTrialEvidenceCompletenessCheck[];
  privacyChecks: UserAppAnonymousTrialEvidencePrivacyCheck[];
  privacyIncidents: string[];
  stoppedOrPausedReasons: string[];
  sampleSize: number;
  source: UserAppAnonymousTrialEvidenceReviewSource;
  risks: UserAppAnonymousTrialEvidenceReviewRisk[];
  localOnly: true;
  deterministic: true;
  reviewOnly: true;
  anonymousOrExampleOnly: true;
  mockOrExampleOnly: boolean;
  productionBuildApproved: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  requestsCamera: false;
  requestsUpload: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppAnonymousTrialEvidenceReviewInput {
  reviewId?: string;
  title?: string;
  postLaunchHandoff?: UserAppAnonymousTrialPostLaunchHandoff;
  items?: UserAppAnonymousTrialEvidenceReviewItem[];
  missingDimensions?: UserAppAnonymousTrialEvidenceReviewDimension[];
  privacyIncidents?: string[];
  stoppedOrPausedReasons?: string[];
  sampleSize?: number;
  source?: UserAppAnonymousTrialEvidenceReviewSource;
  containsForbiddenData?: boolean;
}

const dimensionLabels: Record<UserAppAnonymousTrialEvidenceReviewDimension, string> = {
  task_completion_evidence: '任务完成证据',
  step_comprehension_evidence: '步骤理解证据',
  template_value_evidence: '模板价值证据',
  shell_usability_evidence: 'Shell 可用性证据',
  recommendation_usefulness_evidence: '推荐有用性证据',
  privacy_clarity_evidence: '隐私清晰度证据',
  trial_ops_evidence: '试用流程证据',
  stop_condition_evidence: '停止 / 暂停条件证据',
  post_launch_handoff_evidence: '试用后 handoff 证据',
  decision_input_evidence: '下一步决策输入证据',
};

const requiredDimensions: UserAppAnonymousTrialEvidenceReviewDimension[] = [
  'task_completion_evidence',
  'step_comprehension_evidence',
  'template_value_evidence',
  'shell_usability_evidence',
  'recommendation_usefulness_evidence',
  'privacy_clarity_evidence',
  'trial_ops_evidence',
  'stop_condition_evidence',
  'post_launch_handoff_evidence',
  'decision_input_evidence',
];

export const createDefaultUserAppAnonymousTrialEvidenceReviewItems = (
  input: {
    source?: UserAppAnonymousTrialEvidenceReviewSource;
    missingDimensions?: readonly UserAppAnonymousTrialEvidenceReviewDimension[];
  } = {},
): UserAppAnonymousTrialEvidenceReviewItem[] => {
  const source = input.source ?? 'mock_example_summary';
  const missing = new Set(input.missingDimensions ?? []);

  return requiredDimensions.map((dimension) => {
    const present = !missing.has(dimension);
    return {
      itemId: `anonymous-trial-evidence-review-${dimension}`,
      dimension,
      label: dimensionLabels[dimension],
      summary: present
        ? `${dimensionLabels[dimension]}已用匿名、本地、聚合摘要表示。`
        : `${dimensionLabels[dimension]}缺失，不能过度推进下一步判断。`,
      present,
      source: present ? source : 'missing',
      localOnly: true,
      anonymousOnly: true,
      containsRealIdentity: false,
      containsContact: false,
      containsPhoto: false,
      containsHealthInfo: false,
      containsSensitiveIdentity: false,
      containsBiometric: false,
      requestsUpload: false,
      writesTrainingInput: false,
    };
  });
};

const createCompletenessChecks = (
  items: readonly UserAppAnonymousTrialEvidenceReviewItem[],
): UserAppAnonymousTrialEvidenceCompletenessCheck[] =>
  requiredDimensions.map((dimension) => {
    const item = items.find((candidate) => candidate.dimension === dimension);
    const passed = Boolean(item?.present);
    return {
      checkId: `anonymous-trial-evidence-completeness-${dimension}`,
      dimension,
      label: dimensionLabels[dimension],
      passed,
      blocking: dimension === 'post_launch_handoff_evidence',
      message: passed
        ? `${dimensionLabels[dimension]}已覆盖。`
        : `${dimensionLabels[dimension]}缺失。`,
    };
  });

const createPrivacyChecks = (
  items: readonly UserAppAnonymousTrialEvidenceReviewItem[],
  privacyIncidents: readonly string[],
  containsForbiddenData: boolean,
): UserAppAnonymousTrialEvidencePrivacyCheck[] => [
  {
    checkId: 'anonymous-trial-evidence-no-real-identity',
    label: '不包含真实身份或联系方式',
    passed: !items.some((item) => item.containsRealIdentity || item.containsContact),
    blocking: true,
    message: '证据复盘不得包含真实姓名、联系方式或可识别个人身份。',
  },
  {
    checkId: 'anonymous-trial-evidence-no-photo-health-biometric',
    label: '不包含照片、健康、敏感身份或生物识别',
    passed: !items.some(
      (item) =>
        item.containsPhoto ||
        item.containsHealthInfo ||
        item.containsSensitiveIdentity ||
        item.containsBiometric,
    ),
    blocking: true,
    message: '证据复盘不得包含照片、健康信息、敏感身份或生物识别信息。',
  },
  {
    checkId: 'anonymous-trial-evidence-no-upload-training',
    label: '不上传、不训练',
    passed: !items.some((item) => item.requestsUpload || item.writesTrainingInput),
    blocking: true,
    message: '证据复盘不得上传数据或写入训练数据。',
  },
  {
    checkId: 'anonymous-trial-evidence-no-forbidden-data',
    label: '没有 forbidden data 过度收集',
    passed: !containsForbiddenData,
    blocking: true,
    message: containsForbiddenData
      ? '发现 forbidden data 过度收集，必须暂停。'
      : '未发现 forbidden data 过度收集。',
  },
  {
    checkId: 'anonymous-trial-evidence-no-privacy-incident',
    label: '没有隐私事件',
    passed: privacyIncidents.length === 0,
    blocking: true,
    message:
      privacyIncidents.length === 0
        ? '未记录隐私或范围事件。'
        : '存在隐私或范围事件，必须暂停复盘推进。',
  },
];

const createRisks = (
  completenessChecks: readonly UserAppAnonymousTrialEvidenceCompletenessCheck[],
  privacyChecks: readonly UserAppAnonymousTrialEvidencePrivacyCheck[],
  sampleSize: number,
  source: UserAppAnonymousTrialEvidenceReviewSource,
  stoppedOrPausedReasons: readonly string[],
): UserAppAnonymousTrialEvidenceReviewRisk[] => {
  const risks: UserAppAnonymousTrialEvidenceReviewRisk[] = [];
  if (privacyChecks.some((check) => check.blocking && !check.passed)) {
    risks.push({
      riskId: 'anonymous-trial-evidence-review-privacy-blocker',
      severity: 'critical',
      message: '证据复盘出现隐私、范围、上传、训练或 forbidden data blocker。',
      mitigation: '暂停推进，清除不合规证据并修复启动包或收集协议。',
    });
  }
  if (
    completenessChecks.some(
      (check) => check.dimension === 'post_launch_handoff_evidence' && !check.passed,
    )
  ) {
    risks.push({
      riskId: 'anonymous-trial-evidence-review-missing-handoff',
      severity: 'high',
      message: '缺少试用后 handoff，无法可靠复盘证据。',
      mitigation: '先补齐匿名 handoff，再继续复盘。',
    });
  }
  if (sampleSize < 3) {
    risks.push({
      riskId: 'anonymous-trial-evidence-review-small-sample',
      severity: 'medium',
      message: '匿名样本量不足，不得直接推进 MVP validation planning。',
      mitigation: '重复匿名内部试用或补充更多匿名摘要。',
    });
  }
  if (source === 'mock_example_summary') {
    risks.push({
      riskId: 'anonymous-trial-evidence-review-mock-source',
      severity: 'medium',
      message: '当前证据是 mock/example 摘要，不能当作真实 validation evidence。',
      mitigation: '仅用于框架验证；真实匿名试用后再进入更强决策。',
    });
  }
  if (stoppedOrPausedReasons.length > 0) {
    risks.push({
      riskId: 'anonymous-trial-evidence-review-stopped-session',
      severity: 'high',
      message: '存在停止或暂停事件。',
      mitigation: '先复盘停止原因，再决定是否重复匿名内部试用。',
    });
  }
  return risks;
};

const statusFromChecks = (
  completenessChecks: readonly UserAppAnonymousTrialEvidenceCompletenessCheck[],
  privacyChecks: readonly UserAppAnonymousTrialEvidencePrivacyCheck[],
  risks: readonly UserAppAnonymousTrialEvidenceReviewRisk[],
): UserAppAnonymousTrialEvidenceReviewStatus => {
  if (privacyChecks.some((check) => check.blocking && !check.passed)) {
    return 'evidence_review_blocked';
  }
  if (completenessChecks.some((check) => check.blocking && !check.passed)) {
    return 'evidence_review_blocked';
  }
  if (risks.length > 0 || completenessChecks.some((check) => !check.passed)) {
    return 'evidence_review_ready_with_warnings';
  }
  return 'evidence_review_ready';
};

export const createUserAppAnonymousTrialEvidenceReview = (
  input: CreateUserAppAnonymousTrialEvidenceReviewInput = {},
): UserAppAnonymousTrialEvidenceReview => {
  const postLaunchHandoff =
    input.postLaunchHandoff ?? createUserAppAnonymousTrialPostLaunchHandoff();
  const source = input.source ?? 'mock_example_summary';
  const privacyIncidents =
    input.privacyIncidents ?? postLaunchHandoff.evidenceHandoff.privacyIncidents;
  const stoppedOrPausedReasons = [
    ...(input.stoppedOrPausedReasons ?? []),
    ...(postLaunchHandoff.evidenceHandoff.stoppedSessionReason
      ? [postLaunchHandoff.evidenceHandoff.stoppedSessionReason]
      : []),
  ];
  const items =
    input.items ??
    createDefaultUserAppAnonymousTrialEvidenceReviewItems({
      source,
      missingDimensions: input.missingDimensions,
    });
  const sampleSize = input.sampleSize ?? 1;
  const containsForbiddenData = input.containsForbiddenData ?? false;
  const completenessChecks = createCompletenessChecks(items);
  const privacyChecks = createPrivacyChecks(items, privacyIncidents, containsForbiddenData);
  const risks = createRisks(
    completenessChecks,
    privacyChecks,
    sampleSize,
    source,
    stoppedOrPausedReasons,
  );
  const status = statusFromChecks(completenessChecks, privacyChecks, risks);

  return {
    schemaVersion: USER_APP_ANONYMOUS_TRIAL_EVIDENCE_REVIEW_SCHEMA_VERSION,
    reviewId: input.reviewId ?? 'anonymous-internal-trial-evidence-review-v0',
    title: input.title ?? '匿名内部试用证据复盘',
    status,
    postLaunchHandoff,
    items,
    completenessChecks,
    privacyChecks,
    privacyIncidents,
    stoppedOrPausedReasons,
    sampleSize,
    source,
    risks,
    localOnly: true,
    deterministic: true,
    reviewOnly: true,
    anonymousOrExampleOnly: true,
    mockOrExampleOnly: source === 'mock_example_summary',
    productionBuildApproved: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    requestsCamera: false,
    requestsUpload: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
