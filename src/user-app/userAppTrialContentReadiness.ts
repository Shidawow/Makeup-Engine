import type { UserAppTemplatePackage } from '../templates/schema';
import type { UserAppTrialFeedbackForm } from './userAppTrialFeedback';
import { createUserAppTrialFeedbackForm } from './userAppTrialFeedback';
import type { UserAppTrialPack } from './userAppTrialPack';
import { createUserAppTrialPack } from './userAppTrialPack';
import type { UserAppTrialReadinessReport } from './userAppTrialReadiness';
import { createUserAppTrialReadinessReport } from './userAppTrialReadiness';
import type { UserAppTrialTemplateSelectionReport } from './userAppTrialTemplateSelection';
import { createUserAppTrialTemplateSelectionReport } from './userAppTrialTemplateSelection';

export const USER_APP_TRIAL_CONTENT_READINESS_SCHEMA_VERSION =
  'user-app-trial-content-readiness-v0.1' as const;

export type UserAppTrialContentReadinessStatus =
  | 'ready_for_real_user_trial'
  | 'ready_with_warnings'
  | 'blocked';

export interface UserAppTrialContentReadinessIssue {
  issueId: string;
  area:
    | 'trial_pack'
    | 'feedback'
    | 'template_content'
    | 'template_selection'
    | 'privacy_boundary'
    | 'local_boundary';
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppTrialContentReadinessCheck {
  checkId: string;
  label: string;
  status: 'passed' | 'warning' | 'blocked';
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppTrialContentReadinessIssue[];
  deterministic: true;
}

export interface UserAppTrialContentReadinessReport {
  schemaVersion: typeof USER_APP_TRIAL_CONTENT_READINESS_SCHEMA_VERSION;
  status: UserAppTrialContentReadinessStatus;
  checks: UserAppTrialContentReadinessCheck[];
  issues: UserAppTrialContentReadinessIssue[];
  trialReadinessStatus: UserAppTrialReadinessReport['status'];
  templateSelectionStatus: UserAppTrialTemplateSelectionReport['status'];
  trialReadyTemplateIds: string[];
  backupTemplateIds: string[];
  blockedTemplateIds: string[];
  summary: string;
  localOnly: true;
  deterministic: true;
  productionRelease: false;
  appStoreReadiness: false;
  usesBackend: false;
  callsOpenAiApi: false;
  callsExternalApi: false;
  collectsUserPhotos: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
  mutatesTemplatePackage: false;
}

export interface CreateUserAppTrialContentReadinessReportInput {
  packageData?: UserAppTemplatePackage | null;
  trialPack?: UserAppTrialPack;
  feedbackForm?: UserAppTrialFeedbackForm;
  trialReadinessReport?: UserAppTrialReadinessReport;
  templateSelectionReport?: UserAppTrialTemplateSelectionReport;
  hasPrivacyBoundaryCopy?: boolean;
  usesBackend?: boolean;
  callsOpenAiApi?: boolean;
  callsExternalApi?: boolean;
  collectsUserPhotos?: boolean;
  writesTrainingInput?: boolean;
  writesProjectStateUserRecords?: boolean;
  mutatesTemplatePackage?: boolean;
}

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 47);

const issue = (
  input: Omit<UserAppTrialContentReadinessIssue, 'issueId'>,
): UserAppTrialContentReadinessIssue => ({
  ...input,
  issueId: `trial-content-readiness-${input.area}-${input.severity}-${Math.abs(
    hashText(input.message),
  )}`,
});

const checkStatus = (
  issues: readonly UserAppTrialContentReadinessIssue[],
): UserAppTrialContentReadinessCheck['status'] => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'warning';
  return 'passed';
};

const reportStatus = (
  issues: readonly UserAppTrialContentReadinessIssue[],
): UserAppTrialContentReadinessStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'ready_with_warnings';
  return 'ready_for_real_user_trial';
};

const check = (
  input: Omit<UserAppTrialContentReadinessCheck, 'deterministic'>,
): UserAppTrialContentReadinessCheck => ({
  ...input,
  deterministic: true,
});

const boundaryIssues = (
  input: Required<
    Pick<
      CreateUserAppTrialContentReadinessReportInput,
      | 'usesBackend'
      | 'callsOpenAiApi'
      | 'callsExternalApi'
      | 'collectsUserPhotos'
      | 'writesTrainingInput'
      | 'writesProjectStateUserRecords'
      | 'mutatesTemplatePackage'
    >
  >,
): UserAppTrialContentReadinessIssue[] => [
  ...(input.usesBackend
    ? [
        issue({
          area: 'local_boundary',
          severity: 'blocking',
          message: '试用内容就绪度不能接后端。',
          recommendation: '保持 8D 为本地内容 QA。',
        }),
      ]
    : []),
  ...(input.callsOpenAiApi || input.callsExternalApi
    ? [
        issue({
          area: 'local_boundary',
          severity: 'blocking',
          message: '8D 不能调用 OpenAI 或外部 API。',
          recommendation: '内容 QA 必须是 deterministic/local-only。',
        }),
      ]
    : []),
  ...(input.collectsUserPhotos
    ? [
        issue({
          area: 'privacy_boundary',
          severity: 'blocking',
          message: '8D 不能采集真实用户照片。',
          recommendation: '继续使用照片占位说明，不请求相机或上传。',
        }),
      ]
    : []),
  ...(input.writesTrainingInput
    ? [
        issue({
          area: 'privacy_boundary',
          severity: 'blocking',
          message: '8D 不能把试用内容或反馈写入训练数据。',
          recommendation: '保留文档化 QA 结果，不进入 training dataset。',
        }),
      ]
    : []),
  ...(input.writesProjectStateUserRecords
    ? [
        issue({
          area: 'privacy_boundary',
          severity: 'blocking',
          message: '8D 不能把真实用户试用记录写入 project-state。',
          recommendation: 'project-state 只能记录阶段状态和验证结果。',
        }),
      ]
    : []),
  ...(input.mutatesTemplatePackage
    ? [
        issue({
          area: 'template_content',
          severity: 'blocking',
          message: '内容 QA 不能修改 UserAppTemplatePackage。',
          recommendation: 'QA 报告只能读取模板并生成建议。',
        }),
      ]
    : []),
];

export const createUserAppTrialContentReadinessReport = (
  input: CreateUserAppTrialContentReadinessReportInput = {},
): UserAppTrialContentReadinessReport => {
  const trialPack = input.trialPack ?? createUserAppTrialPack();
  const feedbackForm = input.feedbackForm ?? createUserAppTrialFeedbackForm();
  const trialReadinessReport =
    input.trialReadinessReport ??
    createUserAppTrialReadinessReport({
      trialPack,
      feedbackForm,
      hasPrivacyLocalOnlyCopy: true,
      hasNoUploadCopy: true,
      hasNoTrainingCopy: true,
      hasNoSensitiveDataCopy: true,
      hasUserPathReady: true,
      hasAdminQaSeparation: true,
    });
  const templateSelectionReport =
    input.templateSelectionReport ??
    createUserAppTrialTemplateSelectionReport({ packageData: input.packageData });

  const trialPackIssues =
    trialReadinessReport.status === 'blocked'
      ? [
          issue({
            area: 'trial_pack',
            severity: 'blocking',
            message: '试用任务或反馈基础就绪度被阻断。',
            recommendation: '先修复 Phase 8C trial readiness 的 blocking issue。',
          }),
        ]
      : trialReadinessReport.status === 'ready_with_warnings'
        ? [
            issue({
              area: 'trial_pack',
              severity: 'warning',
              message: '试用任务或反馈基础就绪度仍有 warning。',
              recommendation: '真实试用前复核 warning 是否会影响用户理解。',
            }),
          ]
        : [];

  const selectionIssues =
    templateSelectionReport.status === 'blocked'
      ? [
          issue({
            area: 'template_selection',
            severity: 'blocking',
            message: '试用模板选择被阻断。',
            recommendation: '确保 trial-ready set 包含 beginner、short-duration、natural/daily 覆盖。',
          }),
        ]
      : templateSelectionReport.status === 'ready_with_warnings'
        ? [
            issue({
              area: 'template_selection',
              severity: 'warning',
              message: '试用模板集合包含备用或 warning 模板。',
              recommendation: '备用模板必须标注 warning，核心任务优先 trial-ready 模板。',
            }),
          ]
        : [];

  const privacyCopyIssues =
    input.hasPrivacyBoundaryCopy === false
      ? [
          issue({
            area: 'privacy_boundary',
            severity: 'blocking',
            message: '缺少本地-only、不上传、不训练的隐私边界文案。',
            recommendation: '真实试用前必须让用户看到隐私边界。',
          }),
        ]
      : [];

  const localBoundaryIssues = boundaryIssues({
    usesBackend: Boolean(input.usesBackend),
    callsOpenAiApi: Boolean(input.callsOpenAiApi),
    callsExternalApi: Boolean(input.callsExternalApi),
    collectsUserPhotos: Boolean(input.collectsUserPhotos),
    writesTrainingInput: Boolean(input.writesTrainingInput),
    writesProjectStateUserRecords: Boolean(input.writesProjectStateUserRecords),
    mutatesTemplatePackage: Boolean(input.mutatesTemplatePackage),
  });

  const checks = [
    check({
      checkId: 'trial-pack-readiness',
      label: '试用任务与反馈基础',
      status: checkStatus(trialPackIssues),
      required: true,
      summary: trialReadinessReport.summary,
      evidence: [`trialReadinessStatus: ${trialReadinessReport.status}`],
      issues: trialPackIssues,
    }),
    check({
      checkId: 'trial-template-selection',
      label: '试用模板选择',
      status: checkStatus(selectionIssues),
      required: true,
      summary: `${templateSelectionReport.trialReadyTemplates.length} core templates`,
      evidence: [
        `selectionStatus: ${templateSelectionReport.status}`,
        `trialReady: ${templateSelectionReport.trialReadyTemplates.length}`,
        `backup: ${templateSelectionReport.backupTemplates.length}`,
        `blocked: ${templateSelectionReport.blockedTemplates.length}`,
      ],
      issues: selectionIssues,
    }),
    check({
      checkId: 'privacy-boundary',
      label: '隐私边界',
      status: checkStatus(privacyCopyIssues),
      required: true,
      summary: '本地-only、不上传、不训练、不收集真实照片。',
      evidence: [`hasPrivacyBoundaryCopy: ${String(input.hasPrivacyBoundaryCopy !== false)}`],
      issues: privacyCopyIssues,
    }),
    check({
      checkId: 'local-boundary',
      label: '本地边界',
      status: checkStatus(localBoundaryIssues),
      required: true,
      summary: '不接后端、不调用 API、不写训练、不写真实用户记录。',
      evidence: [
        `usesBackend: ${String(Boolean(input.usesBackend))}`,
        `callsOpenAiApi: ${String(Boolean(input.callsOpenAiApi))}`,
        `collectsUserPhotos: ${String(Boolean(input.collectsUserPhotos))}`,
      ],
      issues: localBoundaryIssues,
    }),
  ];

  const issues = checks.flatMap((item) => item.issues);
  const status = reportStatus(issues);
  return {
    schemaVersion: USER_APP_TRIAL_CONTENT_READINESS_SCHEMA_VERSION,
    status,
    checks,
    issues,
    trialReadinessStatus: trialReadinessReport.status,
    templateSelectionStatus: templateSelectionReport.status,
    trialReadyTemplateIds: templateSelectionReport.trialReadyTemplates.map(
      (template) => template.templateId,
    ),
    backupTemplateIds: templateSelectionReport.backupTemplates.map((template) => template.templateId),
    blockedTemplateIds: templateSelectionReport.blockedTemplates.map(
      (template) => template.templateId,
    ),
    summary:
      status === 'ready_for_real_user_trial'
        ? '试用内容已具备进入小范围真实用户试用的内容基础。'
        : status === 'ready_with_warnings'
          ? '试用内容可继续评审，但 warning 必须在试用脚本中标注。'
          : '试用内容被阻断，不能进入真实用户试用。',
    localOnly: true,
    deterministic: true,
    productionRelease: false,
    appStoreReadiness: false,
    usesBackend: false,
    callsOpenAiApi: false,
    callsExternalApi: false,
    collectsUserPhotos: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
    mutatesTemplatePackage: false,
  };
};

export const summarizeUserAppTrialContentReadiness = (
  report: UserAppTrialContentReadinessReport,
): string =>
  `${report.status}: ${report.trialReadyTemplateIds.length} trial-ready template(s), ${report.backupTemplateIds.length} backup, ${report.blockedTemplateIds.length} blocked.`;
