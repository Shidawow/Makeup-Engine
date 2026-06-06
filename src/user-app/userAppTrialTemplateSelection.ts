import type { UserAppTemplate, UserAppTemplatePackage } from '../templates/schema';
import {
  createUserAppTemplateContentQaReport,
  type UserAppTemplateContentQaReport,
} from './userAppTemplateContentQa';

export const USER_APP_TRIAL_TEMPLATE_SELECTION_SCHEMA_VERSION =
  'user-app-trial-template-selection-v0.1' as const;

export type UserAppTrialTemplateSelectionStatus =
  | 'ready'
  | 'ready_with_warnings'
  | 'blocked';

export interface UserAppTrialTemplateSelectionIssue {
  issueId: string;
  area: 'coverage' | 'template_content' | 'package' | 'boundary';
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppTrialTemplateSelectionEntry {
  templateId: string;
  title: string;
  qaStatus: UserAppTemplateContentQaReport['status'];
  difficulty: UserAppTemplate['difficulty'];
  estimatedDurationMinutes: number;
  styleTags: string[];
  reasons: string[];
  warnings: string[];
}

export interface UserAppTrialTemplateSelectionReport {
  schemaVersion: typeof USER_APP_TRIAL_TEMPLATE_SELECTION_SCHEMA_VERSION;
  packageId: string;
  status: UserAppTrialTemplateSelectionStatus;
  trialReadyTemplates: UserAppTrialTemplateSelectionEntry[];
  backupTemplates: UserAppTrialTemplateSelectionEntry[];
  blockedTemplates: UserAppTrialTemplateSelectionEntry[];
  contentQaReports: UserAppTemplateContentQaReport[];
  issues: UserAppTrialTemplateSelectionIssue[];
  coverage: {
    hasBeginnerFriendlyTemplate: boolean;
    hasShortDurationTemplate: boolean;
    hasNaturalDailyTemplate: boolean;
  };
  localOnly: true;
  deterministic: true;
  productionRelease: false;
  usesBackend: false;
  callsExternalApi: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
  mutatesTemplatePackage: false;
}

export interface CreateUserAppTrialTemplateSelectionReportInput {
  packageData?: UserAppTemplatePackage | null;
  contentQaReports?: UserAppTemplateContentQaReport[];
}

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 43);

const issue = (
  input: Omit<UserAppTrialTemplateSelectionIssue, 'issueId'>,
): UserAppTrialTemplateSelectionIssue => ({
  ...input,
  issueId: `trial-template-selection-${input.area}-${input.severity}-${Math.abs(
    hashText(input.message),
  )}`,
});

const isBeginnerFriendly = (template: UserAppTemplate): boolean =>
  template.difficulty === 'easy' ||
  template.styleTags.some((tag) => ['beginner', 'easy', 'minimal', 'soft'].includes(tag));

const isShortDuration = (template: UserAppTemplate): boolean =>
  template.estimatedDurationMinutes > 0 && template.estimatedDurationMinutes <= 10;

const isNaturalDaily = (template: UserAppTemplate): boolean =>
  template.makeupCategory === 'natural' ||
  template.styleTags.some((tag) => ['natural', 'daily', 'soft'].includes(tag)) ||
  template.suitableOccasions.some((occasion) => ['daily', 'work', 'casual'].includes(occasion));

const isCoreTrialCandidate = (
  template: UserAppTemplate,
  qaReport: UserAppTemplateContentQaReport,
): boolean =>
  qaReport.status === 'trial_ready' &&
  template.difficulty !== 'advanced' &&
  template.estimatedDurationMinutes <= 12 &&
  template.steps.length >= 3 &&
  template.requiredTools.length > 0 &&
  template.regionInstructions.length >= template.steps.length;

const createEntry = (
  template: UserAppTemplate,
  qaReport: UserAppTemplateContentQaReport,
): UserAppTrialTemplateSelectionEntry => ({
  templateId: template.appTemplateId,
  title: template.title,
  qaStatus: qaReport.status,
  difficulty: template.difficulty,
  estimatedDurationMinutes: template.estimatedDurationMinutes,
  styleTags: [...template.styleTags],
  reasons: [
    isBeginnerFriendly(template) ? 'beginner-friendly' : 'not beginner-first',
    isShortDuration(template) ? 'short-duration' : 'longer-duration',
    isNaturalDaily(template) ? 'natural-or-daily' : 'non-daily-style',
  ],
  warnings: qaReport.issues
    .filter((item) => item.severity !== 'blocking')
    .map((item) => item.message),
});

const reportStatus = (
  issues: readonly UserAppTrialTemplateSelectionIssue[],
  trialReadyTemplates: readonly UserAppTrialTemplateSelectionEntry[],
): UserAppTrialTemplateSelectionStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (trialReadyTemplates.length === 0) return 'blocked';
  if (issues.length > 0) return 'ready_with_warnings';
  return 'ready';
};

export const createUserAppTrialTemplateSelectionReport = (
  input: CreateUserAppTrialTemplateSelectionReportInput = {},
): UserAppTrialTemplateSelectionReport => {
  const packageData = input.packageData ?? null;
  const packageId = packageData?.packageId ?? 'missing-user-app-template-package';
  const contentQaReports =
    input.contentQaReports ??
    (packageData?.templates ?? []).map((template) =>
      createUserAppTemplateContentQaReport({ packageData, template }),
    );
  const reportByTemplateId = new Map(
    contentQaReports.map((report) => [report.templateId, report]),
  );

  const trialReadyTemplates: UserAppTrialTemplateSelectionEntry[] = [];
  const backupTemplates: UserAppTrialTemplateSelectionEntry[] = [];
  const blockedTemplates: UserAppTrialTemplateSelectionEntry[] = [];

  for (const template of packageData?.templates ?? []) {
    const qaReport =
      reportByTemplateId.get(template.appTemplateId) ??
      createUserAppTemplateContentQaReport({ packageData, template });
    const entry = createEntry(template, qaReport);
    if (isCoreTrialCandidate(template, qaReport)) {
      trialReadyTemplates.push(entry);
    } else if (qaReport.status === 'blocked' || qaReport.status === 'needs_content_revision') {
      blockedTemplates.push(entry);
    } else {
      backupTemplates.push(entry);
    }
  }

  const coverage = {
    hasBeginnerFriendlyTemplate: trialReadyTemplates.some((entry) =>
      entry.reasons.includes('beginner-friendly'),
    ),
    hasShortDurationTemplate: trialReadyTemplates.some((entry) =>
      entry.reasons.includes('short-duration'),
    ),
    hasNaturalDailyTemplate: trialReadyTemplates.some((entry) =>
      entry.reasons.includes('natural-or-daily'),
    ),
  };

  const issues: UserAppTrialTemplateSelectionIssue[] = [
    ...(!packageData || packageData.templates.length === 0
      ? [
          issue({
            area: 'package',
            severity: 'blocking',
            message: '没有可选择的 UserAppTemplatePackage 模板。',
            recommendation: '先提供至少一个通过内容 QA 的模板。',
          }),
        ]
      : []),
    ...(trialReadyTemplates.length === 0
      ? [
          issue({
            area: 'template_content',
            severity: 'blocking',
            message: '没有 trial-ready 核心模板。',
            recommendation: '修复阻断内容，至少保留一个简单、短时长、自然/日常模板。',
          }),
        ]
      : []),
    ...(!coverage.hasBeginnerFriendlyTemplate
      ? [
          issue({
            area: 'coverage',
            severity: 'blocking',
            message: '核心试用集合缺少 beginner-friendly 模板。',
            recommendation: '加入 easy/beginner/minimal/soft 模板。',
          }),
        ]
      : []),
    ...(!coverage.hasShortDurationTemplate
      ? [
          issue({
            area: 'coverage',
            severity: 'blocking',
            message: '核心试用集合缺少短时长模板。',
            recommendation: '加入 10 分钟以内模板，降低第一轮试用负担。',
          }),
        ]
      : []),
    ...(!coverage.hasNaturalDailyTemplate
      ? [
          issue({
            area: 'coverage',
            severity: 'blocking',
            message: '核心试用集合缺少自然/日常风格模板。',
            recommendation: '加入 natural/daily/work/casual 场景模板。',
          }),
        ]
      : []),
    ...(backupTemplates.length > 0
      ? [
          issue({
            area: 'template_content',
            severity: 'warning',
            message: '存在 warning 模板，只能作为备用并明确标注。',
            recommendation: '不要把 warning 模板放入第一轮核心任务。',
          }),
        ]
      : []),
  ];

  return {
    schemaVersion: USER_APP_TRIAL_TEMPLATE_SELECTION_SCHEMA_VERSION,
    packageId,
    status: reportStatus(issues, trialReadyTemplates),
    trialReadyTemplates,
    backupTemplates,
    blockedTemplates,
    contentQaReports,
    issues,
    coverage,
    localOnly: true,
    deterministic: true,
    productionRelease: false,
    usesBackend: false,
    callsExternalApi: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
    mutatesTemplatePackage: false,
  };
};

export const summarizeUserAppTrialTemplateSelection = (
  report: UserAppTrialTemplateSelectionReport,
): string =>
  `${report.status}: ${report.trialReadyTemplates.length} trial-ready, ${report.backupTemplates.length} backup, ${report.blockedTemplates.length} blocked.`;
