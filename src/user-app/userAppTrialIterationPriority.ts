import type {
  UserAppTrialIssueActionability,
  UserAppTrialIssueCategory,
  UserAppTrialIssueSeverity,
} from './userAppTrialIssueTaxonomy';

export const USER_APP_TRIAL_ITERATION_PRIORITY_SCHEMA_VERSION =
  'user-app-trial-iteration-priority-v0.1' as const;

export type UserAppTrialIterationPriorityLevel =
  | 'p0_blocker'
  | 'p1_high'
  | 'p2_medium'
  | 'p3_low'
  | 'observe_more';

export type UserAppTrialIterationConfidence = 'low' | 'medium' | 'high';

export interface UserAppTrialIterationPriorityScore {
  priority: UserAppTrialIterationPriorityLevel;
  score: number;
  confidence: UserAppTrialIterationConfidence;
  reason: string;
}

export interface UserAppTrialIterationPriorityRule {
  ruleId: string;
  priority: UserAppTrialIterationPriorityLevel;
  description: string;
}

export interface UserAppTrialIterationPriorityRecommendation {
  schemaVersion: typeof USER_APP_TRIAL_ITERATION_PRIORITY_SCHEMA_VERSION;
  recommendationId: string;
  issueCategory: UserAppTrialIssueCategory;
  severity: UserAppTrialIssueSeverity;
  actionability: UserAppTrialIssueActionability;
  priority: UserAppTrialIterationPriorityLevel;
  score: UserAppTrialIterationPriorityScore;
  nextAction: string;
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface ScoreUserAppTrialIterationPriorityInput {
  issueCategory: UserAppTrialIssueCategory;
  severity: UserAppTrialIssueSeverity;
  actionability: UserAppTrialIssueActionability;
  confidence?: UserAppTrialIterationConfidence;
  issueCount?: number;
  repeated?: boolean;
}

export const userAppTrialIterationPriorityRules: UserAppTrialIterationPriorityRule[] = [
  {
    ruleId: 'privacy-boundary-p0',
    priority: 'p0_blocker',
    description: 'critical privacy or boundary issues must pause trials before any other iteration.',
  },
  {
    ruleId: 'high-shell-content-p1',
    priority: 'p1_high',
    description: 'high severity shell or content blockers are immediate next-iteration fixes.',
  },
  {
    ruleId: 'repeated-medium-upgrade',
    priority: 'p1_high',
    description: 'repeated medium issues can upgrade when multiple anonymous signals agree.',
  },
  {
    ruleId: 'low-confidence-observe',
    priority: 'observe_more',
    description: 'low confidence and not-actionable issues should stay in observe-more.',
  },
];

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 101);

const isBoundaryIssue = (input: ScoreUserAppTrialIterationPriorityInput): boolean =>
  input.issueCategory === 'blocked_boundary_issue' ||
  input.issueCategory === 'privacy_copy_issue' ||
  input.severity === 'critical' ||
  input.actionability === 'blocked_by_boundary';

const isShellOrContentBlocker = (
  input: ScoreUserAppTrialIterationPriorityInput,
): boolean =>
  input.severity === 'high' &&
  (input.issueCategory === 'shell_usability_issue' ||
    input.issueCategory === 'content_issue' ||
    input.issueCategory === 'guidance_clarity_issue' ||
    input.issueCategory === 'recommendation_issue' ||
    input.issueCategory === 'template_selection_issue');

const nextActionForPriority = (
  priority: UserAppTrialIterationPriorityLevel,
  category: UserAppTrialIssueCategory,
): string => {
  if (priority === 'p0_blocker') {
    return '暂停下一轮试用，先修复隐私、敏感数据、上传、后端、AI 分析或训练边界。';
  }
  if (priority === 'observe_more') {
    return '继续收集匿名示例信号，暂不进入立即修复。';
  }
  if (category === 'shell_usability_issue') {
    return '进入下一轮 Shell 体验修订，优先处理首页、入口、按钮、移动布局或状态文案。';
  }
  if (
    category === 'content_issue' ||
    category === 'guidance_clarity_issue' ||
    category === 'template_selection_issue'
  ) {
    return '进入下一轮模板内容修订，优先处理步骤、区域说明、工具/产品和模板选择。';
  }
  if (category === 'recommendation_issue') {
    return '进入发现与推荐说明修订，优先处理推荐理由和可开始模板提示。';
  }
  if (category === 'trial_ops_issue') {
    return '进入试用包修订，优先处理任务顺序、主持话术、观察模板和反馈整理。';
  }
  return '放入下一轮迭代 backlog，并补充验收标准。';
};

export const scoreUserAppTrialIterationPriority = (
  input: ScoreUserAppTrialIterationPriorityInput,
): UserAppTrialIterationPriorityScore => {
  const confidence = input.confidence ?? (input.issueCount && input.issueCount >= 2 ? 'high' : 'medium');
  const count = input.issueCount ?? 1;

  if (isBoundaryIssue(input)) {
    return {
      priority: 'p0_blocker',
      score: 100,
      confidence,
      reason: '发现隐私、敏感数据或范围边界风险，必须最高优先级处理。',
    };
  }

  if (confidence === 'low' || input.actionability === 'not_actionable_yet') {
    return {
      priority: 'observe_more',
      score: 20,
      confidence,
      reason: '信号置信度低或暂不可行动，先继续观察。',
    };
  }

  if (input.actionability === 'needs_more_trials' && count < 2) {
    return {
      priority: 'observe_more',
      score: 25,
      confidence,
      reason: '匿名信号不足，不能直接进入修复批次。',
    };
  }

  if (isShellOrContentBlocker(input)) {
    return {
      priority: 'p1_high',
      score: 80,
      confidence,
      reason: '高严重度内容或 Shell 阻断应进入下一轮优先修复。',
    };
  }

  if (input.severity === 'medium' && (input.repeated || count >= 3)) {
    return {
      priority: 'p1_high',
      score: 70,
      confidence,
      reason: '重复出现的 medium 问题已升级为高优先级。',
    };
  }

  if (input.severity === 'medium' || input.actionability === 'needs_product_decision') {
    return {
      priority: 'p2_medium',
      score: 50,
      confidence,
      reason: '问题可进入下一轮计划，但需要正常排期或产品判断。',
    };
  }

  if (input.severity === 'low') {
    return {
      priority: 'p3_low',
      score: 30,
      confidence,
      reason: '低严重度问题进入低优先级修订或观察。',
    };
  }

  return {
    priority: 'observe_more',
    score: 10,
    confidence,
    reason: '无法形成明确迭代动作，继续观察。',
  };
};

export const createUserAppTrialIterationPriorityRecommendation = (
  input: ScoreUserAppTrialIterationPriorityInput,
): UserAppTrialIterationPriorityRecommendation => {
  const score = scoreUserAppTrialIterationPriority(input);
  const key = `${input.issueCategory}-${input.severity}-${input.actionability}-${score.priority}`;

  return {
    schemaVersion: USER_APP_TRIAL_ITERATION_PRIORITY_SCHEMA_VERSION,
    recommendationId: `trial-iteration-priority-${Math.abs(hashText(key))}`,
    issueCategory: input.issueCategory,
    severity: input.severity,
    actionability: input.actionability,
    priority: score.priority,
    score,
    nextAction: nextActionForPriority(score.priority, input.issueCategory),
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
