import type { UserAppTrialIssueSummary } from './userAppTrialIssueTaxonomy';
import {
  createUserAppTrialResultReview,
  type UserAppTrialResultReview,
} from './userAppTrialResultReview';

export const USER_APP_TRIAL_DECISION_FRAMEWORK_SCHEMA_VERSION =
  'user-app-trial-decision-framework-v0.1' as const;

export type UserAppTrialDecision =
  | 'continue_internal_trials'
  | 'revise_template_content'
  | 'revise_user_app_shell'
  | 'revise_trial_pack'
  | 'pause_for_privacy_or_scope_fix'
  | 'ready_for_phase_9C';

export type UserAppTrialDecisionFrameworkStatus =
  | 'decision_ready'
  | 'decision_needs_more_trials'
  | 'decision_blocked';

export interface UserAppTrialDecisionRecommendation {
  recommendationId: string;
  decision: UserAppTrialDecision;
  message: string;
}

export interface UserAppTrialDecisionFramework {
  schemaVersion: typeof USER_APP_TRIAL_DECISION_FRAMEWORK_SCHEMA_VERSION;
  frameworkId: string;
  title: string;
  status: UserAppTrialDecisionFrameworkStatus;
  decision: UserAppTrialDecision;
  rationale: string[];
  recommendations: UserAppTrialDecisionRecommendation[];
  review: UserAppTrialResultReview;
  issueSummary: UserAppTrialIssueSummary;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppTrialDecisionFrameworkInput {
  frameworkId?: string;
  title?: string;
  review?: UserAppTrialResultReview;
  issueSummary?: UserAppTrialIssueSummary;
  minimumSignals?: number;
  readyForPhase9C?: boolean;
}

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 97);

const recommendation = (
  decision: UserAppTrialDecision,
  message: string,
): UserAppTrialDecisionRecommendation => ({
  recommendationId: `trial-decision-${decision}-${Math.abs(hashText(message))}`,
  decision,
  message,
});

const hasBlockingBoundary = (summary: UserAppTrialIssueSummary): boolean =>
  summary.status === 'summary_blocked' ||
  summary.issues.some(
    (issue) =>
      issue.category === 'blocked_boundary_issue' ||
      issue.category === 'privacy_copy_issue' ||
      issue.severity === 'critical' ||
      issue.actionability === 'blocked_by_boundary',
  );

const countContentIssues = (summary: UserAppTrialIssueSummary): number =>
  summary.categoryCounts.content_issue +
  summary.categoryCounts.guidance_clarity_issue +
  summary.categoryCounts.recommendation_issue +
  summary.categoryCounts.template_selection_issue;

const countShellIssues = (summary: UserAppTrialIssueSummary): number =>
  summary.categoryCounts.shell_usability_issue;

const countTrialOpsIssues = (summary: UserAppTrialIssueSummary): number =>
  summary.categoryCounts.trial_ops_issue;

const decide = (
  review: UserAppTrialResultReview,
  summary: UserAppTrialIssueSummary,
  minimumSignals: number,
  readyForPhase9C: boolean,
): { status: UserAppTrialDecisionFrameworkStatus; decision: UserAppTrialDecision; rationale: string[] } => {
  if (review.status === 'review_blocked' || hasBlockingBoundary(summary)) {
    return {
      status: 'decision_blocked',
      decision: 'pause_for_privacy_or_scope_fix',
      rationale: ['发现 critical boundary、隐私说明或敏感数据风险，必须暂停。'],
    };
  }

  if (summary.signalsReviewed < minimumSignals) {
    return {
      status: 'decision_needs_more_trials',
      decision: 'continue_internal_trials',
      rationale: ['匿名试用信号数量不足，继续内部小范围试用，不扩大范围。'],
    };
  }

  if (countContentIssues(summary) >= 2) {
    return {
      status: 'decision_ready',
      decision: 'revise_template_content',
      rationale: ['内容、跟练说明、推荐或模板选择问题较多，先修订模板内容。'],
    };
  }

  if (countShellIssues(summary) >= 2) {
    return {
      status: 'decision_ready',
      decision: 'revise_user_app_shell',
      rationale: ['Shell 可用性问题较多，先修订首页、入口、按钮或移动布局。'],
    };
  }

  if (countTrialOpsIssues(summary) >= 2) {
    return {
      status: 'decision_ready',
      decision: 'revise_trial_pack',
      rationale: ['试用流程问题较多，先修订试用脚本、观察模板或反馈整理。'],
    };
  }

  if (readyForPhase9C && summary.issues.length === 0 && review.status === 'review_ready') {
    return {
      status: 'decision_ready',
      decision: 'ready_for_phase_9C',
      rationale: ['匿名示例信号完整且无阻断问题，可进入内部试用迭代计划。'],
    };
  }

  return {
    status: 'decision_ready',
    decision: 'continue_internal_trials',
    rationale: ['没有足够强的修订或暂停信号，继续内部小范围试用复盘。'],
  };
};

const recommendationForDecision = (
  decision: UserAppTrialDecision,
): UserAppTrialDecisionRecommendation => {
  if (decision === 'pause_for_privacy_or_scope_fix') {
    return recommendation(
      decision,
      '暂停试用和复盘，先移除隐私、敏感数据、后端、上传、AI 分析或训练风险。',
    );
  }
  if (decision === 'revise_template_content') {
    return recommendation(decision, '修订模板内容、步骤、区域说明、工具建议和推荐理由。');
  }
  if (decision === 'revise_user_app_shell') {
    return recommendation(decision, '修订移动 Web Shell 的首页、入口、按钮、状态和管理员分区。');
  }
  if (decision === 'revise_trial_pack') {
    return recommendation(decision, '修订试用任务、主持话术、观察记录模板和反馈整理方式。');
  }
  if (decision === 'ready_for_phase_9C') {
    return recommendation(decision, '进入 Phase 9C，制定内部试用迭代计划。');
  }
  return recommendation(
    decision,
    '继续内部小范围试用，只记录匿名/示例级汇总信号，不上传、不训练。',
  );
};

export const createUserAppTrialDecisionFramework = (
  input: CreateUserAppTrialDecisionFrameworkInput = {},
): UserAppTrialDecisionFramework => {
  const minimumSignals = input.minimumSignals ?? 6;
  const review =
    input.review ??
    createUserAppTrialResultReview({
      minimumSignals,
      readyForPhase9C: input.readyForPhase9C,
    });
  const issueSummary = input.issueSummary ?? review.issueSummary;
  const decisionResult = decide(
    review,
    issueSummary,
    minimumSignals,
    Boolean(input.readyForPhase9C),
  );

  return {
    schemaVersion: USER_APP_TRIAL_DECISION_FRAMEWORK_SCHEMA_VERSION,
    frameworkId: input.frameworkId ?? 'internal-trial-decision-framework-v0',
    title: input.title ?? '内部试用下一步决策框架',
    status: decisionResult.status,
    decision: decisionResult.decision,
    rationale: decisionResult.rationale,
    recommendations: [recommendationForDecision(decisionResult.decision)],
    review,
    issueSummary,
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
