export const USER_APP_TRIAL_ISSUE_TAXONOMY_SCHEMA_VERSION =
  'user-app-trial-issue-taxonomy-v0.1' as const;

export type UserAppTrialResultSignalDimension =
  | 'task_completion'
  | 'step_comprehension'
  | 'template_value_perception'
  | 'recommendation_usefulness'
  | 'tool_product_clarity'
  | 'privacy_clarity'
  | 'user_confusion_points'
  | 'shell_usability'
  | 'content_quality'
  | 'trial_operation_quality';

export type UserAppTrialIssueCategory =
  | 'content_issue'
  | 'shell_usability_issue'
  | 'guidance_clarity_issue'
  | 'recommendation_issue'
  | 'privacy_copy_issue'
  | 'trial_ops_issue'
  | 'template_selection_issue'
  | 'blocked_boundary_issue'
  | 'unknown_issue';

export type UserAppTrialIssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type UserAppTrialIssueActionability =
  | 'clear_fix'
  | 'needs_more_trials'
  | 'needs_product_decision'
  | 'blocked_by_boundary'
  | 'not_actionable_yet';

export type UserAppTrialIssueSummaryStatus =
  | 'summary_ready'
  | 'summary_ready_with_warnings'
  | 'summary_blocked';

export interface UserAppTrialIssueSignalLike {
  signalId: string;
  dimension: UserAppTrialResultSignalDimension;
  score?: 1 | 2 | 3 | 4 | 5;
  summary: string;
  evidenceCount?: number;
  boundaryRisk?: boolean;
  sensitiveDataRisk?: boolean;
}

export interface UserAppTrialIssueClassification {
  category: UserAppTrialIssueCategory;
  severity: UserAppTrialIssueSeverity;
  actionability: UserAppTrialIssueActionability;
  reason: string;
}

export interface UserAppTrialIssueSummaryItem {
  issueId: string;
  category: UserAppTrialIssueCategory;
  severity: UserAppTrialIssueSeverity;
  actionability: UserAppTrialIssueActionability;
  title: string;
  summary: string;
  recommendation: string;
  signalIds: string[];
  count: number;
}

export interface UserAppTrialIssueSummary {
  schemaVersion: typeof USER_APP_TRIAL_ISSUE_TAXONOMY_SCHEMA_VERSION;
  summaryId: string;
  status: UserAppTrialIssueSummaryStatus;
  issues: UserAppTrialIssueSummaryItem[];
  categoryCounts: Record<UserAppTrialIssueCategory, number>;
  severityCounts: Record<UserAppTrialIssueSeverity, number>;
  actionabilityCounts: Record<UserAppTrialIssueActionability, number>;
  signalsReviewed: number;
  localOnly: true;
  mockOnly: true;
  backendRecordSystem: false;
  usesAiAnalysis: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

const categoryLabels: Record<UserAppTrialIssueCategory, string> = {
  content_issue: '模板内容问题',
  shell_usability_issue: 'Shell 体验问题',
  guidance_clarity_issue: '跟练说明问题',
  recommendation_issue: '推荐理由问题',
  privacy_copy_issue: '隐私说明问题',
  trial_ops_issue: '试用流程问题',
  template_selection_issue: '模板选择问题',
  blocked_boundary_issue: '边界阻断问题',
  unknown_issue: '未归类问题',
};

const categoryRecommendations: Record<UserAppTrialIssueCategory, string> = {
  content_issue: '优先修订模板标题、步骤、区域说明或工具/产品内容。',
  shell_usability_issue: '优先修订首页、入口、按钮、移动布局或状态文案。',
  guidance_clarity_issue: '优先修订分步跟练文案、步骤粒度和卡点提示。',
  recommendation_issue: '优先修订推荐理由、可开始模板提示和替代选择说明。',
  privacy_copy_issue: '先修订隐私说明，确认用户理解本地-only、不上传、不训练。',
  trial_ops_issue: '优先修订试用脚本、主持话术、任务顺序或观察模板。',
  template_selection_issue: '优先调整试用模板覆盖、难度、场景和选择标准。',
  blocked_boundary_issue: '立即暂停复盘或试用，先移除照片、身份、后端、上传或训练风险。',
  unknown_issue: '继续收集匿名示例信号，暂不做过度判断。',
};

const emptyCategoryCounts = (): Record<UserAppTrialIssueCategory, number> => ({
  content_issue: 0,
  shell_usability_issue: 0,
  guidance_clarity_issue: 0,
  recommendation_issue: 0,
  privacy_copy_issue: 0,
  trial_ops_issue: 0,
  template_selection_issue: 0,
  blocked_boundary_issue: 0,
  unknown_issue: 0,
});

const emptySeverityCounts = (): Record<UserAppTrialIssueSeverity, number> => ({
  low: 0,
  medium: 0,
  high: 0,
  critical: 0,
});

const emptyActionabilityCounts = (): Record<UserAppTrialIssueActionability, number> => ({
  clear_fix: 0,
  needs_more_trials: 0,
  needs_product_decision: 0,
  blocked_by_boundary: 0,
  not_actionable_yet: 0,
});

const severityRank: Record<UserAppTrialIssueSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const actionabilityRank: Record<UserAppTrialIssueActionability, number> = {
  not_actionable_yet: 1,
  needs_more_trials: 2,
  needs_product_decision: 3,
  clear_fix: 4,
  blocked_by_boundary: 5,
};

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 83);

const hasUnsafeBoundaryText = (value: string): boolean =>
  /base64|data:image|faceEmbedding|biometric|real name|contact field|email field|phone field|health information|要求.{0,8}(照片|自拍|相机|姓名|联系方式|健康|敏感身份)|收集.{0,8}(照片|自拍|姓名|联系方式|健康|敏感身份|生物识别)|保存.{0,8}(照片|自拍|姓名|联系方式|健康|敏感身份)|写入.{0,8}(训练|project-state)|用于.{0,8}训练|进入.{0,8}训练|真实姓名|健康信息|敏感身份|生物识别/i.test(
    value,
  );

const categoryFromDimension = (
  dimension: UserAppTrialResultSignalDimension,
): UserAppTrialIssueCategory => {
  if (dimension === 'content_quality') return 'content_issue';
  if (dimension === 'shell_usability' || dimension === 'task_completion') {
    return 'shell_usability_issue';
  }
  if (
    dimension === 'step_comprehension' ||
    dimension === 'tool_product_clarity' ||
    dimension === 'user_confusion_points'
  ) {
    return 'guidance_clarity_issue';
  }
  if (dimension === 'recommendation_usefulness') return 'recommendation_issue';
  if (dimension === 'privacy_clarity') return 'privacy_copy_issue';
  if (dimension === 'trial_operation_quality') return 'trial_ops_issue';
  if (dimension === 'template_value_perception') return 'template_selection_issue';
  return 'unknown_issue';
};

const severityFromSignal = (
  signal: UserAppTrialIssueSignalLike,
  category: UserAppTrialIssueCategory,
): UserAppTrialIssueSeverity => {
  if (
    signal.boundaryRisk ||
    signal.sensitiveDataRisk ||
    category === 'blocked_boundary_issue'
  ) {
    return 'critical';
  }
  if (signal.score === undefined) return 'medium';
  if (signal.score <= 1) return 'critical';
  if (signal.score <= 2) return category === 'privacy_copy_issue' ? 'critical' : 'high';
  if (signal.score === 3) return 'medium';
  return 'low';
};

const actionabilityFromSignal = (
  signal: UserAppTrialIssueSignalLike,
  category: UserAppTrialIssueCategory,
  severity: UserAppTrialIssueSeverity,
): UserAppTrialIssueActionability => {
  if (category === 'blocked_boundary_issue' || severity === 'critical') {
    return 'blocked_by_boundary';
  }
  if (category === 'unknown_issue') return 'not_actionable_yet';
  if ((signal.evidenceCount ?? 1) < 2 && severity === 'medium') return 'needs_more_trials';
  if (category === 'template_selection_issue' || category === 'trial_ops_issue') {
    return 'needs_product_decision';
  }
  if (severity === 'high' || severity === 'medium') return 'clear_fix';
  return 'needs_more_trials';
};

export const classifyUserAppTrialIssue = (
  signal: UserAppTrialIssueSignalLike,
): UserAppTrialIssueClassification => {
  const unsafeBoundary =
    signal.boundaryRisk || signal.sensitiveDataRisk || hasUnsafeBoundaryText(signal.summary);
  const category = unsafeBoundary
    ? 'blocked_boundary_issue'
    : categoryFromDimension(signal.dimension);
  const severity = severityFromSignal({ ...signal, boundaryRisk: unsafeBoundary }, category);
  const actionability = actionabilityFromSignal(signal, category, severity);

  return {
    category,
    severity,
    actionability,
    reason: unsafeBoundary
      ? '信号包含照片、身份、联系方式、健康、上传或训练等边界风险。'
      : `信号来自 ${signal.dimension} 维度。`,
  };
};

export const createUserAppTrialIssueSummary = (
  signals: readonly UserAppTrialIssueSignalLike[],
  input: { summaryId?: string } = {},
): UserAppTrialIssueSummary => {
  const grouped = new Map<UserAppTrialIssueCategory, UserAppTrialIssueSummaryItem>();
  const categoryCounts = emptyCategoryCounts();
  const severityCounts = emptySeverityCounts();
  const actionabilityCounts = emptyActionabilityCounts();

  signals.forEach((signal) => {
    const classification = classifyUserAppTrialIssue(signal);
    if (signal.score !== undefined && signal.score >= 4 && classification.severity === 'low') {
      return;
    }

    categoryCounts[classification.category] += 1;
    severityCounts[classification.severity] += 1;
    actionabilityCounts[classification.actionability] += 1;

    const existing = grouped.get(classification.category);
    if (!existing) {
      grouped.set(classification.category, {
        issueId: `trial-issue-${classification.category}-${Math.abs(hashText(signal.summary))}`,
        category: classification.category,
        severity: classification.severity,
        actionability: classification.actionability,
        title: categoryLabels[classification.category],
        summary: signal.summary,
        recommendation: categoryRecommendations[classification.category],
        signalIds: [signal.signalId],
        count: 1,
      });
      return;
    }

    existing.count += 1;
    existing.signalIds.push(signal.signalId);
    existing.summary = `${existing.summary}；${signal.summary}`;
    if (severityRank[classification.severity] > severityRank[existing.severity]) {
      existing.severity = classification.severity;
    }
    if (
      actionabilityRank[classification.actionability] >
      actionabilityRank[existing.actionability]
    ) {
      existing.actionability = classification.actionability;
    }
  });

  const issues = [...grouped.values()].sort((left, right) => {
    const severityDelta = severityRank[right.severity] - severityRank[left.severity];
    if (severityDelta !== 0) return severityDelta;
    return left.category.localeCompare(right.category);
  });
  const status: UserAppTrialIssueSummaryStatus = issues.some(
    (issue) =>
      issue.category === 'blocked_boundary_issue' ||
      issue.severity === 'critical' ||
      issue.actionability === 'blocked_by_boundary',
  )
    ? 'summary_blocked'
    : issues.length > 0
      ? 'summary_ready_with_warnings'
      : 'summary_ready';

  return {
    schemaVersion: USER_APP_TRIAL_ISSUE_TAXONOMY_SCHEMA_VERSION,
    summaryId: input.summaryId ?? 'internal-trial-issue-summary-v0',
    status,
    issues,
    categoryCounts,
    severityCounts,
    actionabilityCounts,
    signalsReviewed: signals.length,
    localOnly: true,
    mockOnly: true,
    backendRecordSystem: false,
    usesAiAnalysis: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};
