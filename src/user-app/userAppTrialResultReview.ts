import {
  createUserAppTrialIssueSummary,
  type UserAppTrialIssueActionability,
  type UserAppTrialIssueCategory,
  type UserAppTrialIssueSeverity,
  type UserAppTrialIssueSummary,
  type UserAppTrialResultSignalDimension,
} from './userAppTrialIssueTaxonomy';

export const USER_APP_TRIAL_RESULT_REVIEW_SCHEMA_VERSION =
  'user-app-trial-result-review-v0.1' as const;

export type UserAppTrialResultReviewStatus =
  | 'review_ready'
  | 'review_ready_with_warnings'
  | 'review_blocked';

export interface UserAppTrialResultSignal {
  signalId: string;
  dimension: UserAppTrialResultSignalDimension;
  label: string;
  score: 1 | 2 | 3 | 4 | 5;
  summary: string;
  evidenceCount: number;
  mockOnly: true;
  containsPersonalData: false;
}

export interface UserAppTrialResultIssue {
  issueId: string;
  category: UserAppTrialIssueCategory;
  severity: UserAppTrialIssueSeverity;
  actionability: UserAppTrialIssueActionability;
  message: string;
  recommendation: string;
}

export interface UserAppTrialResultRecommendation {
  recommendationId: string;
  priority: 'continue' | 'content' | 'shell' | 'trial_ops' | 'privacy' | 'phase_9c';
  message: string;
}

export interface UserAppTrialResultSummary {
  reviewedSignals: number;
  issueCount: number;
  highestSeverity?: UserAppTrialIssueSeverity;
  summary: string;
}

export interface UserAppTrialResultReview {
  schemaVersion: typeof USER_APP_TRIAL_RESULT_REVIEW_SCHEMA_VERSION;
  reviewId: string;
  title: string;
  status: UserAppTrialResultReviewStatus;
  signals: UserAppTrialResultSignal[];
  issueSummary: UserAppTrialIssueSummary;
  issues: UserAppTrialResultIssue[];
  recommendations: UserAppTrialResultRecommendation[];
  resultSummary: UserAppTrialResultSummary;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  productionRelease: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  containsRealParticipantRecords: false;
  collectsRealName: boolean;
  collectsContact: boolean;
  collectsPhotos: boolean;
  collectsHealthInfo: boolean;
  collectsSensitiveIdentity: boolean;
  collectsBiometrics: boolean;
  writesTrainingInput: boolean;
  writesProjectStateUserRecords: boolean;
}

export interface CreateUserAppTrialResultReviewInput {
  reviewId?: string;
  title?: string;
  signals?: UserAppTrialResultSignal[];
  minimumSignals?: number;
  readyForPhase9C?: boolean;
  collectsRealName?: boolean;
  collectsContact?: boolean;
  collectsPhotos?: boolean;
  collectsHealthInfo?: boolean;
  collectsSensitiveIdentity?: boolean;
  collectsBiometrics?: boolean;
  writesTrainingInput?: boolean;
  writesProjectStateUserRecords?: boolean;
  usesBackendRecordSystem?: boolean;
  usesAiAnalysis?: boolean;
}

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 89);

const recommendation = (
  priority: UserAppTrialResultRecommendation['priority'],
  message: string,
): UserAppTrialResultRecommendation => ({
  recommendationId: `trial-result-${priority}-${Math.abs(hashText(message))}`,
  priority,
  message,
});

export const createDefaultUserAppTrialResultSignals =
  (): UserAppTrialResultSignal[] => [
    {
      signalId: 'task-completion',
      dimension: 'task_completion',
      label: '任务完成',
      score: 4,
      summary: '参与者可以完成推荐、详情、跟练、工具和隐私路径。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'step-comprehension',
      dimension: 'step_comprehension',
      label: '步骤理解',
      score: 4,
      summary: '参与者能理解每一步的动作、区域和完成标准。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'template-value',
      dimension: 'template_value_perception',
      label: '模板价值感',
      score: 4,
      summary: '参与者觉得模板适合日常练习，并能说出价值点。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'recommendation-usefulness',
      dimension: 'recommendation_usefulness',
      label: '推荐有用性',
      score: 4,
      summary: '参与者能理解为什么推荐当前模板。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'tool-product-clarity',
      dimension: 'tool_product_clarity',
      label: '工具/产品清晰度',
      score: 4,
      summary: '参与者能判断需要哪些工具和可替代产品。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'privacy-clarity',
      dimension: 'privacy_clarity',
      label: '隐私说明清晰度',
      score: 4,
      summary: '参与者理解本地-only、不上传、不训练、不需要照片。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'confusion-points',
      dimension: 'user_confusion_points',
      label: '卡点定位',
      score: 4,
      summary: '匿名卡点可以归因到文案、布局或内容，不记录个人身份。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'shell-usability',
      dimension: 'shell_usability',
      label: 'Shell 可用性',
      score: 4,
      summary: '首页、模板入口、按钮和管理员区域分离清楚。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'content-quality',
      dimension: 'content_quality',
      label: '内容质量',
      score: 4,
      summary: '试用模板内容没有明显阻断，步骤和区域说明可跟练。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
    {
      signalId: 'trial-operation-quality',
      dimension: 'trial_operation_quality',
      label: '试用流程质量',
      score: 4,
      summary: '试用脚本、观察模板和反馈整理保持匿名、本地、示例级。',
      evidenceCount: 3,
      mockOnly: true,
      containsPersonalData: false,
    },
  ];

const hasUnsafeBoundary = (input: CreateUserAppTrialResultReviewInput): boolean =>
  Boolean(
    input.collectsRealName ||
      input.collectsContact ||
      input.collectsPhotos ||
      input.collectsHealthInfo ||
      input.collectsSensitiveIdentity ||
      input.collectsBiometrics ||
      input.writesTrainingInput ||
      input.writesProjectStateUserRecords ||
      input.usesBackendRecordSystem ||
      input.usesAiAnalysis,
  );

const createBoundarySignal = (): UserAppTrialResultSignal => ({
  signalId: 'blocked-boundary',
  dimension: 'privacy_clarity',
  label: '边界风险',
  score: 1,
  summary: '复盘输入包含真实姓名、联系方式、照片、健康、敏感身份、后端、AI 分析或训练风险。',
  evidenceCount: 1,
  mockOnly: true,
  containsPersonalData: false,
});

const highestSeverity = (
  issues: readonly UserAppTrialResultIssue[],
): UserAppTrialIssueSeverity | undefined => {
  if (issues.some((issue) => issue.severity === 'critical')) return 'critical';
  if (issues.some((issue) => issue.severity === 'high')) return 'high';
  if (issues.some((issue) => issue.severity === 'medium')) return 'medium';
  if (issues.some((issue) => issue.severity === 'low')) return 'low';
  return undefined;
};

const statusFromSummary = (
  issueSummary: UserAppTrialIssueSummary,
  signalCount: number,
  minimumSignals: number,
): UserAppTrialResultReviewStatus => {
  if (issueSummary.status === 'summary_blocked') return 'review_blocked';
  if (signalCount < minimumSignals || issueSummary.issues.length > 0) {
    return 'review_ready_with_warnings';
  }
  return 'review_ready';
};

const recommendationsFromReview = (
  status: UserAppTrialResultReviewStatus,
  issues: readonly UserAppTrialResultIssue[],
  signalCount: number,
  minimumSignals: number,
  readyForPhase9C: boolean,
): UserAppTrialResultRecommendation[] => {
  if (status === 'review_blocked') {
    return [
      recommendation(
        'privacy',
        '暂停内部试用复盘，先移除照片、身份、联系方式、健康、后端、AI 分析或训练风险。',
      ),
    ];
  }
  if (signalCount < minimumSignals) {
    return [
      recommendation(
        'continue',
        '匿名信号数量不足，继续小范围内部试用，不要过早下结论。',
      ),
    ];
  }
  if (issues.some((issue) => issue.category === 'content_issue')) {
    return [recommendation('content', '先修订模板内容，再继续扩大内部试用。')];
  }
  if (issues.some((issue) => issue.category === 'shell_usability_issue')) {
    return [recommendation('shell', '先修订 Shell 入口、按钮、布局或状态文案。')];
  }
  if (issues.some((issue) => issue.category === 'trial_ops_issue')) {
    return [recommendation('trial_ops', '先修订试用脚本、观察模板或反馈整理流程。')];
  }
  if (readyForPhase9C && issues.length === 0) {
    return [recommendation('phase_9c', '可进入 Phase 9C，制定内部试用迭代计划。')];
  }
  return [
    recommendation(
      'continue',
      '继续内部试用复盘，保持匿名、示例级、本地-only，不上传、不训练。',
    ),
  ];
};

export const createUserAppTrialResultReview = (
  input: CreateUserAppTrialResultReviewInput = {},
): UserAppTrialResultReview => {
  const minimumSignals = input.minimumSignals ?? 6;
  const unsafeBoundary = hasUnsafeBoundary(input);
  const signals = unsafeBoundary
    ? [...(input.signals ?? createDefaultUserAppTrialResultSignals()), createBoundarySignal()]
    : input.signals ?? createDefaultUserAppTrialResultSignals();
  const issueSummary = createUserAppTrialIssueSummary(signals, {
    summaryId: `${input.reviewId ?? 'internal-trial-result-review-v0'}-issue-summary`,
  });
  const issues = issueSummary.issues.map<UserAppTrialResultIssue>((item) => ({
    issueId: item.issueId,
    category: item.category,
    severity: item.severity,
    actionability: item.actionability,
    message: item.summary,
    recommendation: item.recommendation,
  }));
  const status = statusFromSummary(issueSummary, signals.length, minimumSignals);
  const recommendations = recommendationsFromReview(
    status,
    issues,
    signals.length,
    minimumSignals,
    Boolean(input.readyForPhase9C),
  );
  const severity = highestSeverity(issues);

  return {
    schemaVersion: USER_APP_TRIAL_RESULT_REVIEW_SCHEMA_VERSION,
    reviewId: input.reviewId ?? 'internal-trial-result-review-v0',
    title: input.title ?? '内部试用结果复盘框架',
    status,
    signals,
    issueSummary,
    issues,
    recommendations,
    resultSummary: {
      reviewedSignals: signals.length,
      issueCount: issues.length,
      highestSeverity: severity,
      summary:
        status === 'review_blocked'
          ? '发现隐私、敏感数据或范围边界风险，必须先暂停。'
          : status === 'review_ready_with_warnings'
            ? '复盘可继续，但存在匿名信号不足或可修订问题。'
            : '匿名示例信号完整，当前复盘框架可用。',
    },
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    anonymousOrExampleOnly: true,
    productionRelease: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    containsRealParticipantRecords: false,
    collectsRealName: Boolean(input.collectsRealName),
    collectsContact: Boolean(input.collectsContact),
    collectsPhotos: Boolean(input.collectsPhotos),
    collectsHealthInfo: Boolean(input.collectsHealthInfo),
    collectsSensitiveIdentity: Boolean(input.collectsSensitiveIdentity),
    collectsBiometrics: Boolean(input.collectsBiometrics),
    writesTrainingInput: Boolean(input.writesTrainingInput),
    writesProjectStateUserRecords: Boolean(input.writesProjectStateUserRecords),
  };
};
