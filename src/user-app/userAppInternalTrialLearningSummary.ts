import {
  createUserAppTrialIterationPlan,
  type UserAppTrialIterationPlan,
  type UserAppTrialIterationWorkstream,
} from './userAppTrialIterationPlan';
import type {
  UserAppTrialIssueCategory,
  UserAppTrialIssueSeverity,
} from './userAppTrialIssueTaxonomy';
import {
  createUserAppTrialResultReview,
  type UserAppTrialResultReview,
  type UserAppTrialResultSignal,
} from './userAppTrialResultReview';

export const USER_APP_INTERNAL_TRIAL_LEARNING_SUMMARY_SCHEMA_VERSION =
  'user-app-internal-trial-learning-summary-v0.1' as const;

export type UserAppInternalTrialLearningStatus =
  | 'learning_summary_ready'
  | 'learning_summary_ready_with_warnings'
  | 'learning_summary_blocked';

export type UserAppInternalTrialLearningTheme =
  | 'user_value_signal'
  | 'template_content_signal'
  | 'shell_usability_signal'
  | 'guidance_clarity_signal'
  | 'recommendation_signal'
  | 'privacy_trust_signal'
  | 'trial_ops_signal'
  | 'iteration_readiness_signal'
  | 'blocked_boundary_signal';

export interface UserAppInternalTrialLearningSignal {
  signalId: string;
  theme: UserAppInternalTrialLearningTheme;
  source:
    | 'phase_9a_trial_ops'
    | 'phase_9b_result_review'
    | 'phase_9c_iteration_plan'
    | 'mock_example';
  summary: string;
  strength: 'weak' | 'medium' | 'strong' | 'blocked';
  evidenceCount: number;
  anonymousOrExampleOnly: true;
}

export interface UserAppInternalTrialLearningInsight {
  insightId: string;
  theme: UserAppInternalTrialLearningTheme;
  title: string;
  summary: string;
  supportingSignalIds: string[];
}

export interface UserAppInternalTrialLearningRisk {
  riskId: string;
  theme: UserAppInternalTrialLearningTheme;
  severity: UserAppTrialIssueSeverity;
  message: string;
  mitigation: string;
}

export interface UserAppInternalTrialLearningSummary {
  schemaVersion: typeof USER_APP_INTERNAL_TRIAL_LEARNING_SUMMARY_SCHEMA_VERSION;
  summaryId: string;
  title: string;
  status: UserAppInternalTrialLearningStatus;
  signals: UserAppInternalTrialLearningSignal[];
  themes: UserAppInternalTrialLearningTheme[];
  insights: UserAppInternalTrialLearningInsight[];
  risks: UserAppInternalTrialLearningRisk[];
  resultReview: UserAppTrialResultReview;
  iterationPlan: UserAppTrialIterationPlan;
  learningStatement: string;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  productionRelease: false;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  collectsRealName: false;
  collectsContact: false;
  collectsPhotos: false;
  collectsHealthInfo: false;
  collectsSensitiveIdentity: false;
  collectsBiometrics: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppInternalTrialLearningSummaryInput {
  summaryId?: string;
  title?: string;
  resultReview?: UserAppTrialResultReview;
  iterationPlan?: UserAppTrialIterationPlan;
  additionalSignals?: UserAppInternalTrialLearningSignal[];
  minimumSignals?: number;
}

const themeFromResultSignal = (
  signal: UserAppTrialResultSignal,
): UserAppInternalTrialLearningTheme => {
  if (signal.dimension === 'template_value_perception') return 'user_value_signal';
  if (signal.dimension === 'content_quality') return 'template_content_signal';
  if (signal.dimension === 'shell_usability' || signal.dimension === 'task_completion') {
    return 'shell_usability_signal';
  }
  if (signal.dimension === 'step_comprehension' || signal.dimension === 'tool_product_clarity') {
    return 'guidance_clarity_signal';
  }
  if (signal.dimension === 'recommendation_usefulness') return 'recommendation_signal';
  if (signal.dimension === 'privacy_clarity') return 'privacy_trust_signal';
  if (signal.dimension === 'trial_operation_quality') return 'trial_ops_signal';
  if (signal.dimension === 'user_confusion_points') return 'guidance_clarity_signal';
  return 'iteration_readiness_signal';
};

const strengthFromScore = (score: 1 | 2 | 3 | 4 | 5): UserAppInternalTrialLearningSignal['strength'] => {
  if (score <= 1) return 'blocked';
  if (score <= 2) return 'weak';
  if (score === 3) return 'medium';
  return 'strong';
};

const signalFromResultSignal = (
  signal: UserAppTrialResultSignal,
): UserAppInternalTrialLearningSignal => ({
  signalId: `learning-${signal.signalId}`,
  theme: themeFromResultSignal(signal),
  source: 'phase_9b_result_review',
  summary: signal.summary,
  strength: strengthFromScore(signal.score),
  evidenceCount: signal.evidenceCount,
  anonymousOrExampleOnly: true,
});

const themeFromWorkstream = (
  workstream: UserAppTrialIterationWorkstream,
): UserAppInternalTrialLearningTheme => {
  if (workstream === 'template_content_iteration') return 'template_content_signal';
  if (workstream === 'user_app_shell_iteration') return 'shell_usability_signal';
  if (workstream === 'trial_pack_iteration') return 'trial_ops_signal';
  if (workstream === 'privacy_boundary_iteration') return 'blocked_boundary_signal';
  if (workstream === 'discovery_recommendation_iteration') return 'recommendation_signal';
  if (workstream === 'session_preference_iteration') return 'guidance_clarity_signal';
  return 'iteration_readiness_signal';
};

const signalsFromIterationPlan = (
  plan: UserAppTrialIterationPlan,
): UserAppInternalTrialLearningSignal[] =>
  plan.workstreams.map((workstream) => ({
    signalId: `learning-iteration-${workstream}`,
    theme: themeFromWorkstream(workstream),
    source: 'phase_9c_iteration_plan',
    summary: `9C 将 ${workstream} 纳入下一轮迭代规划。`,
    strength: workstream === 'privacy_boundary_iteration' ? 'blocked' : 'medium',
    evidenceCount: 1,
    anonymousOrExampleOnly: true,
  }));

const categoryTheme: Record<UserAppTrialIssueCategory, UserAppInternalTrialLearningTheme> = {
  content_issue: 'template_content_signal',
  shell_usability_issue: 'shell_usability_signal',
  guidance_clarity_issue: 'guidance_clarity_signal',
  recommendation_issue: 'recommendation_signal',
  privacy_copy_issue: 'privacy_trust_signal',
  trial_ops_issue: 'trial_ops_signal',
  template_selection_issue: 'template_content_signal',
  blocked_boundary_issue: 'blocked_boundary_signal',
  unknown_issue: 'iteration_readiness_signal',
};

const blockedRisk = (): UserAppInternalTrialLearningRisk => ({
  riskId: 'learning-risk-boundary-blocker',
  theme: 'blocked_boundary_signal',
  severity: 'critical',
  message: '学习输入包含隐私、敏感数据、上传、后端、AI 分析、训练或范围边界阻断。',
  mitigation: '暂停决策推进，先修复边界并重新用匿名/示例级输入复盘。',
});

const riskFromIssue = (
  category: UserAppTrialIssueCategory,
  severity: UserAppTrialIssueSeverity,
  count: number,
): UserAppInternalTrialLearningRisk | null => {
  if (category === 'blocked_boundary_issue' || severity === 'critical') return blockedRisk();
  if (count === 0) return null;
  return {
    riskId: `learning-risk-${category}`,
    theme: categoryTheme[category],
    severity,
    message: `${category} 出现 ${count} 个匿名/示例问题，需要进入产品决策门判断。`,
    mitigation: '只在本地决策框架中归因，不写真实用户记录、不上传、不训练。',
  };
};

const uniqueThemes = (
  signals: readonly UserAppInternalTrialLearningSignal[],
): UserAppInternalTrialLearningTheme[] =>
  Array.from(new Set(signals.map((signal) => signal.theme)));

const titleForTheme: Record<UserAppInternalTrialLearningTheme, string> = {
  user_value_signal: '用户价值信号',
  template_content_signal: '模板内容学习',
  shell_usability_signal: 'Shell 可用性学习',
  guidance_clarity_signal: '跟练清晰度学习',
  recommendation_signal: '推荐与发现学习',
  privacy_trust_signal: '隐私信任学习',
  trial_ops_signal: '试用流程学习',
  iteration_readiness_signal: '迭代就绪学习',
  blocked_boundary_signal: '边界阻断学习',
};

const insightForTheme = (
  theme: UserAppInternalTrialLearningTheme,
  signals: readonly UserAppInternalTrialLearningSignal[],
): UserAppInternalTrialLearningInsight => {
  const related = signals.filter((signal) => signal.theme === theme);
  const strongCount = related.filter((signal) => signal.strength === 'strong').length;
  const blockedCount = related.filter((signal) => signal.strength === 'blocked').length;

  return {
    insightId: `learning-insight-${theme}`,
    theme,
    title: titleForTheme[theme],
    summary:
      blockedCount > 0
        ? '该主题包含阻断风险，必须先修复隐私或范围边界。'
        : strongCount > 0
          ? '该主题已有正向匿名/示例信号，可作为下一步决策依据。'
          : '该主题仍需要更多匿名/示例证据，不应过度判断。',
    supportingSignalIds: related.map((signal) => signal.signalId),
  };
};

const statusFromSignals = (
  signals: readonly UserAppInternalTrialLearningSignal[],
  minimumSignals: number,
): UserAppInternalTrialLearningStatus => {
  if (signals.some((signal) => signal.strength === 'blocked')) {
    return 'learning_summary_blocked';
  }
  if (signals.length < minimumSignals || signals.some((signal) => signal.strength === 'weak')) {
    return 'learning_summary_ready_with_warnings';
  }
  return 'learning_summary_ready';
};

export const createUserAppInternalTrialLearningSummary = (
  input: CreateUserAppInternalTrialLearningSummaryInput = {},
): UserAppInternalTrialLearningSummary => {
  const minimumSignals = input.minimumSignals ?? 6;
  const resultReview = input.resultReview ?? createUserAppTrialResultReview({ minimumSignals });
  const iterationPlan = input.iterationPlan ?? createUserAppTrialIterationPlan();
  const signals = [
    ...resultReview.signals.map(signalFromResultSignal),
    ...signalsFromIterationPlan(iterationPlan),
    ...(input.additionalSignals ?? []),
  ];
  const themes = uniqueThemes(signals);
  const risks = resultReview.issueSummary.issues
    .map((issue) => riskFromIssue(issue.category, issue.severity, issue.count))
    .filter((risk): risk is UserAppInternalTrialLearningRisk => Boolean(risk));
  if (iterationPlan.status === 'iteration_blocked' && risks.length === 0) {
    risks.push(blockedRisk());
  }

  return {
    schemaVersion: USER_APP_INTERNAL_TRIAL_LEARNING_SUMMARY_SCHEMA_VERSION,
    summaryId: input.summaryId ?? 'internal-trial-learning-summary-v0',
    title: input.title ?? '内部试用学习总结',
    status:
      risks.some((risk) => risk.severity === 'critical') || resultReview.status === 'review_blocked'
        ? 'learning_summary_blocked'
        : statusFromSignals(signals, minimumSignals),
    signals,
    themes,
    insights: themes.map((theme) => insightForTheme(theme, signals)),
    risks,
    resultReview,
    iterationPlan,
    learningStatement:
      '当前学习总结只汇总 9A/9B/9C 的匿名/mock/example 信号，用于本地产品决策门，不是正式用户数据分析系统。',
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    anonymousOrExampleOnly: true,
    productionRelease: false,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    collectsRealName: false,
    collectsContact: false,
    collectsPhotos: false,
    collectsHealthInfo: false,
    collectsSensitiveIdentity: false,
    collectsBiometrics: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
