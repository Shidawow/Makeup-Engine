export const USER_APP_TRIAL_OUTCOME_SCHEMA_VERSION =
  'user-app-trial-outcome-v0.1' as const;

export type UserAppTrialOutcomeDecision =
  | 'continue_to_more_internal_trials'
  | 'revise_content_before_more_trials'
  | 'revise_shell_before_more_trials'
  | 'block_until_privacy_or_scope_fixed'
  | 'ready_for_phase_9B';

export type UserAppTrialOutcomeSignalId =
  | 'understanding'
  | 'willingness'
  | 'template_value'
  | 'content_clarity'
  | 'shell_usability'
  | 'privacy_trust';

export interface UserAppTrialOutcomeSignal {
  signalId: UserAppTrialOutcomeSignalId;
  label: string;
  score: 1 | 2 | 3 | 4 | 5;
  summary: string;
}

export interface UserAppTrialOutcomeRecommendation {
  recommendationId: string;
  priority: 'continue' | 'content' | 'shell' | 'block' | 'phase_9b';
  message: string;
}

export interface UserAppTrialOutcomeReview {
  schemaVersion: typeof USER_APP_TRIAL_OUTCOME_SCHEMA_VERSION;
  reviewId: string;
  title: string;
  decision: UserAppTrialOutcomeDecision;
  signals: UserAppTrialOutcomeSignal[];
  recommendations: UserAppTrialOutcomeRecommendation[];
  summary: string;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  productionRelease: false;
  backendRecordSystem: false;
  containsRealParticipantRecords: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
  privacyOrScopeIssue: boolean;
}

export interface CreateUserAppTrialOutcomeReviewInput {
  reviewId?: string;
  title?: string;
  participantSessionsReviewed?: number;
  understandingScore?: 1 | 2 | 3 | 4 | 5;
  willingnessScore?: 1 | 2 | 3 | 4 | 5;
  templateValueScore?: 1 | 2 | 3 | 4 | 5;
  contentClarityScore?: 1 | 2 | 3 | 4 | 5;
  shellUsabilityScore?: 1 | 2 | 3 | 4 | 5;
  privacyTrustScore?: 1 | 2 | 3 | 4 | 5;
  contentIssues?: string[];
  shellIssues?: string[];
  privacyOrScopeIssue?: boolean;
  readyForPhase9B?: boolean;
}

const recommendation = (
  priority: UserAppTrialOutcomeRecommendation['priority'],
  message: string,
): UserAppTrialOutcomeRecommendation => ({
  recommendationId: `trial-outcome-${priority}-${Math.abs(
    message.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 79),
  )}`,
  priority,
  message,
});

const decideOutcome = (
  input: Required<
    Pick<
      CreateUserAppTrialOutcomeReviewInput,
      | 'participantSessionsReviewed'
      | 'understandingScore'
      | 'willingnessScore'
      | 'templateValueScore'
      | 'contentClarityScore'
      | 'shellUsabilityScore'
      | 'privacyTrustScore'
      | 'privacyOrScopeIssue'
      | 'readyForPhase9B'
    >
  > & Pick<CreateUserAppTrialOutcomeReviewInput, 'contentIssues' | 'shellIssues'>,
): UserAppTrialOutcomeDecision => {
  if (input.privacyOrScopeIssue || input.privacyTrustScore <= 2) {
    return 'block_until_privacy_or_scope_fixed';
  }
  if ((input.contentIssues?.length ?? 0) > 0 || input.contentClarityScore <= 2) {
    return 'revise_content_before_more_trials';
  }
  if ((input.shellIssues?.length ?? 0) > 0 || input.shellUsabilityScore <= 2) {
    return 'revise_shell_before_more_trials';
  }
  if (
    input.readyForPhase9B &&
    input.participantSessionsReviewed >= 3 &&
    input.understandingScore >= 4 &&
    input.willingnessScore >= 4 &&
    input.templateValueScore >= 4
  ) {
    return 'ready_for_phase_9B';
  }
  return 'continue_to_more_internal_trials';
};

export const createUserAppTrialOutcomeReview = (
  input: CreateUserAppTrialOutcomeReviewInput = {},
): UserAppTrialOutcomeReview => {
  const normalized = {
    participantSessionsReviewed: input.participantSessionsReviewed ?? 1,
    understandingScore: input.understandingScore ?? 4,
    willingnessScore: input.willingnessScore ?? 4,
    templateValueScore: input.templateValueScore ?? 4,
    contentClarityScore: input.contentClarityScore ?? 4,
    shellUsabilityScore: input.shellUsabilityScore ?? 4,
    privacyTrustScore: input.privacyTrustScore ?? 4,
    privacyOrScopeIssue: Boolean(input.privacyOrScopeIssue),
    readyForPhase9B: Boolean(input.readyForPhase9B),
  } satisfies Required<
    Pick<
      CreateUserAppTrialOutcomeReviewInput,
      | 'participantSessionsReviewed'
      | 'understandingScore'
      | 'willingnessScore'
      | 'templateValueScore'
      | 'contentClarityScore'
      | 'shellUsabilityScore'
      | 'privacyTrustScore'
      | 'privacyOrScopeIssue'
      | 'readyForPhase9B'
    >
  >;
  const decision = decideOutcome({
    ...normalized,
    contentIssues: input.contentIssues,
    shellIssues: input.shellIssues,
  });
  const recommendations: UserAppTrialOutcomeRecommendation[] = [];

  if (decision === 'block_until_privacy_or_scope_fixed') {
    recommendations.push(
      recommendation('block', '暂停更多试用，先修复隐私、敏感信息或范围膨胀问题。'),
    );
  } else if (decision === 'revise_content_before_more_trials') {
    recommendations.push(
      recommendation('content', '先修订模板标题、步骤、工具、区域或推荐理由，再扩大内部试用。'),
    );
  } else if (decision === 'revise_shell_before_more_trials') {
    recommendations.push(
      recommendation('shell', '先修订首页、推荐入口、按钮、隐私入口或移动布局，再继续试用。'),
    );
  } else if (decision === 'ready_for_phase_9B') {
    recommendations.push(
      recommendation('phase_9b', '进入 Phase 9B，建立内部试用结果复盘框架。'),
    );
  } else {
    recommendations.push(
      recommendation('continue', '继续更多内部小范围试用，保持匿名汇总和 no-backend 边界。'),
    );
  }

  return {
    schemaVersion: USER_APP_TRIAL_OUTCOME_SCHEMA_VERSION,
    reviewId: input.reviewId ?? 'internal-trial-outcome-review-v0',
    title: input.title ?? '试用结果复盘',
    decision,
    signals: [
      {
        signalId: 'understanding',
        label: '理解流程',
        score: normalized.understandingScore,
        summary: '参与者是否能理解首页、推荐和跟练路径。',
      },
      {
        signalId: 'willingness',
        label: '愿意跟练',
        score: normalized.willingnessScore,
        summary: '参与者是否愿意继续照着步骤做。',
      },
      {
        signalId: 'template_value',
        label: '模板价值',
        score: normalized.templateValueScore,
        summary: '参与者是否觉得模板推荐、步骤和工具建议有价值。',
      },
      {
        signalId: 'content_clarity',
        label: '内容清晰',
        score: normalized.contentClarityScore,
        summary: input.contentIssues?.join('；') ?? '内容没有明显阻断。',
      },
      {
        signalId: 'shell_usability',
        label: 'Shell 可用性',
        score: normalized.shellUsabilityScore,
        summary: input.shellIssues?.join('；') ?? 'Shell 路径没有明显阻断。',
      },
      {
        signalId: 'privacy_trust',
        label: '隐私信任',
        score: normalized.privacyTrustScore,
        summary: normalized.privacyOrScopeIssue
          ? '发现隐私或范围问题。'
          : '隐私边界保持清楚。',
      },
    ],
    recommendations,
    summary: `当前建议：${decision}`,
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    productionRelease: false,
    backendRecordSystem: false,
    containsRealParticipantRecords: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
    privacyOrScopeIssue: normalized.privacyOrScopeIssue,
  };
};
