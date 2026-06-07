import type {
  UserAppTrialIssueActionability,
  UserAppTrialIssueCategory,
  UserAppTrialIssueSeverity,
  UserAppTrialIssueSummary,
  UserAppTrialIssueSummaryItem,
} from './userAppTrialIssueTaxonomy';
import {
  createUserAppTrialIterationPriorityRecommendation,
  type UserAppTrialIterationConfidence,
  type UserAppTrialIterationPriorityRecommendation,
} from './userAppTrialIterationPriority';

export const USER_APP_TRIAL_ITERATION_BACKLOG_SCHEMA_VERSION =
  'user-app-trial-iteration-backlog-v0.1' as const;

export type UserAppTrialIterationBacklogStatus =
  | 'backlog_ready'
  | 'backlog_ready_with_warnings'
  | 'backlog_blocked';

export type UserAppTrialIterationOwnerArea =
  | 'template_content'
  | 'user_app_shell'
  | 'trial_pack'
  | 'privacy_boundary'
  | 'discovery_recommendation'
  | 'session_preference'
  | 'observe_more';

export type UserAppTrialIterationFixType =
  | 'copy_revision'
  | 'layout_revision'
  | 'task_script_revision'
  | 'privacy_boundary_fix'
  | 'recommendation_reason_revision'
  | 'session_preference_copy_revision'
  | 'observe_more';

export type UserAppTrialIterationTarget =
  | 'next_internal_trial'
  | 'before_next_internal_trial'
  | 'future_iteration'
  | 'blocked_until_fixed';

export interface UserAppTrialIterationBacklogSource {
  sourceId: string;
  sourceType: 'trial_result_review' | 'issue_taxonomy' | 'decision_framework' | 'mock_example';
  summary: string;
  anonymousOrExampleOnly: true;
}

export interface UserAppTrialIterationBacklogItem {
  itemId: string;
  title: string;
  issueCategory: UserAppTrialIssueCategory;
  severity: UserAppTrialIssueSeverity;
  confidence: UserAppTrialIterationConfidence;
  actionability: UserAppTrialIssueActionability;
  ownerArea: UserAppTrialIterationOwnerArea;
  recommendedFixType: UserAppTrialIterationFixType;
  targetIteration: UserAppTrialIterationTarget;
  acceptanceCriteria: string[];
  blockedReason?: string;
  source: UserAppTrialIterationBacklogSource;
  priorityRecommendation: UserAppTrialIterationPriorityRecommendation;
}

export interface UserAppTrialIterationBacklog {
  schemaVersion: typeof USER_APP_TRIAL_ITERATION_BACKLOG_SCHEMA_VERSION;
  backlogId: string;
  title: string;
  status: UserAppTrialIterationBacklogStatus;
  items: UserAppTrialIterationBacklogItem[];
  sources: UserAppTrialIterationBacklogSource[];
  localOnly: true;
  deterministic: true;
  mockOnly: true;
  anonymousOrExampleOnly: true;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

export interface CreateUserAppTrialIterationBacklogInput {
  backlogId?: string;
  title?: string;
  issueSummary?: UserAppTrialIssueSummary;
  sources?: UserAppTrialIterationBacklogSource[];
  confidenceByCategory?: Partial<Record<UserAppTrialIssueCategory, UserAppTrialIterationConfidence>>;
}

const ownerAreaByCategory: Record<UserAppTrialIssueCategory, UserAppTrialIterationOwnerArea> = {
  content_issue: 'template_content',
  shell_usability_issue: 'user_app_shell',
  guidance_clarity_issue: 'template_content',
  recommendation_issue: 'discovery_recommendation',
  privacy_copy_issue: 'privacy_boundary',
  trial_ops_issue: 'trial_pack',
  template_selection_issue: 'template_content',
  blocked_boundary_issue: 'privacy_boundary',
  unknown_issue: 'observe_more',
};

const fixTypeByCategory: Record<UserAppTrialIssueCategory, UserAppTrialIterationFixType> = {
  content_issue: 'copy_revision',
  shell_usability_issue: 'layout_revision',
  guidance_clarity_issue: 'copy_revision',
  recommendation_issue: 'recommendation_reason_revision',
  privacy_copy_issue: 'privacy_boundary_fix',
  trial_ops_issue: 'task_script_revision',
  template_selection_issue: 'copy_revision',
  blocked_boundary_issue: 'privacy_boundary_fix',
  unknown_issue: 'observe_more',
};

const categoryTitle: Record<UserAppTrialIssueCategory, string> = {
  content_issue: '修订模板内容',
  shell_usability_issue: '修订移动 Shell 体验',
  guidance_clarity_issue: '修订分步跟练说明',
  recommendation_issue: '修订发现与推荐理由',
  privacy_copy_issue: '修订隐私说明',
  trial_ops_issue: '修订试用流程',
  template_selection_issue: '修订试用模板选择',
  blocked_boundary_issue: '暂停并修复边界',
  unknown_issue: '继续观察未归类问题',
};

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 109);

const confidenceFromIssue = (
  issue: UserAppTrialIssueSummaryItem,
  override?: UserAppTrialIterationConfidence,
): UserAppTrialIterationConfidence => {
  if (override) return override;
  if (issue.count >= 2) return 'high';
  if (issue.actionability === 'needs_more_trials' || issue.actionability === 'not_actionable_yet') {
    return 'low';
  }
  return 'medium';
};

const targetFromPriority = (
  priority: UserAppTrialIterationPriorityRecommendation['priority'],
): UserAppTrialIterationTarget => {
  if (priority === 'p0_blocker') return 'blocked_until_fixed';
  if (priority === 'p1_high' || priority === 'p2_medium') {
    return 'before_next_internal_trial';
  }
  if (priority === 'observe_more') return 'future_iteration';
  return 'next_internal_trial';
};

const criteriaForIssue = (
  issue: UserAppTrialIssueSummaryItem,
  ownerArea: UserAppTrialIterationOwnerArea,
): string[] => {
  if (ownerArea === 'privacy_boundary') {
    return [
      '试用路径不要求照片、相机、真实姓名、联系方式、健康或敏感身份信息。',
      '文案明确本地-only、不上传、不训练、不写入真实用户记录。',
    ];
  }
  if (ownerArea === 'user_app_shell') {
    return [
      '移动端入口、按钮、状态和管理员分区在窄屏下可理解。',
      '普通用户路径不暴露 trial admin 或内部复盘术语。',
    ];
  }
  if (ownerArea === 'trial_pack') {
    return [
      '试用任务顺序、主持话术和观察模板能区分内容、Shell 与边界问题。',
      '反馈整理仍为匿名/示例/本地结构，不变成后端表单。',
    ];
  }
  if (ownerArea === 'observe_more') {
    return ['下一轮只补充匿名示例信号，不进入立即修复。'];
  }
  return [
    '修订后参与者能理解步骤、区域、工具/产品和推荐理由。',
    `覆盖原问题：${issue.summary}`,
  ];
};

const sourceFromIssue = (
  issue: UserAppTrialIssueSummaryItem,
): UserAppTrialIterationBacklogSource => ({
  sourceId: `source-${issue.issueId}`,
  sourceType: 'issue_taxonomy',
  summary: issue.summary,
  anonymousOrExampleOnly: true,
});

const itemFromIssue = (
  issue: UserAppTrialIssueSummaryItem,
  confidence: UserAppTrialIterationConfidence,
): UserAppTrialIterationBacklogItem => {
  const priorityRecommendation = createUserAppTrialIterationPriorityRecommendation({
    issueCategory: issue.category,
    severity: issue.severity,
    actionability: issue.actionability,
    confidence,
    issueCount: issue.count,
    repeated: issue.count >= 2,
  });
  const ownerArea = ownerAreaByCategory[issue.category];
  const source = sourceFromIssue(issue);

  return {
    itemId: `trial-iteration-backlog-${Math.abs(hashText(issue.issueId + issue.summary))}`,
    title: categoryTitle[issue.category],
    issueCategory: issue.category,
    severity: issue.severity,
    confidence,
    actionability: issue.actionability,
    ownerArea,
    recommendedFixType: fixTypeByCategory[issue.category],
    targetIteration: targetFromPriority(priorityRecommendation.priority),
    acceptanceCriteria: criteriaForIssue(issue, ownerArea),
    blockedReason:
      priorityRecommendation.priority === 'p0_blocker'
        ? '隐私、敏感数据、后端、上传、AI 分析、训练或范围边界未修复。'
        : undefined,
    source,
    priorityRecommendation,
  };
};

const statusFromItems = (
  items: readonly UserAppTrialIterationBacklogItem[],
): UserAppTrialIterationBacklogStatus => {
  if (items.some((item) => item.priorityRecommendation.priority === 'p0_blocker')) {
    return 'backlog_blocked';
  }
  if (items.length > 0) return 'backlog_ready_with_warnings';
  return 'backlog_ready';
};

export const createUserAppTrialIterationBacklog = (
  input: CreateUserAppTrialIterationBacklogInput = {},
): UserAppTrialIterationBacklog => {
  const items =
    input.issueSummary?.issues.map((issue) =>
      itemFromIssue(
        issue,
        confidenceFromIssue(issue, input.confidenceByCategory?.[issue.category]),
      ),
    ) ?? [];
  const itemSources = items.map((item) => item.source);
  const sources = [...(input.sources ?? []), ...itemSources];

  return {
    schemaVersion: USER_APP_TRIAL_ITERATION_BACKLOG_SCHEMA_VERSION,
    backlogId: input.backlogId ?? 'internal-trial-iteration-backlog-v0',
    title: input.title ?? '内部试用迭代 backlog',
    status: statusFromItems(items),
    items,
    sources,
    localOnly: true,
    deterministic: true,
    mockOnly: true,
    anonymousOrExampleOnly: true,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
