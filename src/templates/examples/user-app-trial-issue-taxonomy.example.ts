import {
  createUserAppTrialIssueSummary,
  type UserAppTrialIssueSignalLike,
  type UserAppTrialIssueSummary,
} from '../../user-app/userAppTrialIssueTaxonomy';

export const userAppTrialIssueTaxonomyCleanSignals: UserAppTrialIssueSignalLike[] = [
  {
    signalId: 'clean-task',
    dimension: 'task_completion',
    score: 4,
    summary: '参与者能完成任务路径。',
    evidenceCount: 3,
  },
  {
    signalId: 'clean-privacy',
    dimension: 'privacy_clarity',
    score: 4,
    summary: '参与者理解本地-only、不上传、不训练。',
    evidenceCount: 3,
  },
];

export const userAppTrialIssueTaxonomyContentSignals: UserAppTrialIssueSignalLike[] = [
  {
    signalId: 'content-step',
    dimension: 'step_comprehension',
    score: 2,
    summary: '参与者看不懂步骤方向。',
    evidenceCount: 3,
  },
  {
    signalId: 'content-quality',
    dimension: 'content_quality',
    score: 2,
    summary: '区域说明缺少范围和完成标准。',
    evidenceCount: 3,
  },
];

export const userAppTrialIssueTaxonomyShellSignals: UserAppTrialIssueSignalLike[] = [
  {
    signalId: 'shell-task',
    dimension: 'task_completion',
    score: 2,
    summary: '参与者找不到开始跟练入口。',
    evidenceCount: 2,
  },
  {
    signalId: 'shell-usability',
    dimension: 'shell_usability',
    score: 2,
    summary: '移动端管理员入口容易被误认为主功能。',
    evidenceCount: 2,
  },
];

export const userAppTrialIssueTaxonomyPrivacyBoundarySignals: UserAppTrialIssueSignalLike[] = [
  {
    signalId: 'privacy-boundary',
    dimension: 'privacy_clarity',
    score: 1,
    summary: '观察模板要求上传照片和联系方式。',
    boundaryRisk: true,
    sensitiveDataRisk: true,
    evidenceCount: 1,
  },
];

export const userAppTrialIssueTaxonomyCleanSummary: UserAppTrialIssueSummary =
  createUserAppTrialIssueSummary(userAppTrialIssueTaxonomyCleanSignals, {
    summaryId: 'trial-issue-taxonomy-clean',
  });

export const userAppTrialIssueTaxonomyContentSummary: UserAppTrialIssueSummary =
  createUserAppTrialIssueSummary(userAppTrialIssueTaxonomyContentSignals, {
    summaryId: 'trial-issue-taxonomy-content-heavy',
  });

export const userAppTrialIssueTaxonomyShellSummary: UserAppTrialIssueSummary =
  createUserAppTrialIssueSummary(userAppTrialIssueTaxonomyShellSignals, {
    summaryId: 'trial-issue-taxonomy-shell-heavy',
  });

export const userAppTrialIssueTaxonomyPrivacyBoundarySummary: UserAppTrialIssueSummary =
  createUserAppTrialIssueSummary(userAppTrialIssueTaxonomyPrivacyBoundarySignals, {
    summaryId: 'trial-issue-taxonomy-privacy-boundary',
  });
