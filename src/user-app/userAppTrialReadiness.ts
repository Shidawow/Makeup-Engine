import type { UserAppMvpPolishReport } from './userAppMvpPolish';
import { createUserAppMvpPolishReport } from './userAppMvpPolish';
import type { UserAppPwaReadinessReport } from './userAppPwaReadiness';
import { createUserAppPwaReadinessReport } from './userAppPwaReadiness';
import type { UserAppTrialFeedbackForm } from './userAppTrialFeedback';
import { createUserAppTrialFeedbackForm } from './userAppTrialFeedback';
import type { UserAppTrialPack } from './userAppTrialPack';
import { createUserAppTrialPack } from './userAppTrialPack';

export const USER_APP_TRIAL_READINESS_SCHEMA_VERSION = 'user-app-trial-readiness-v0.1' as const;

export type UserAppTrialReadinessStatus =
  | 'ready_for_internal_trial'
  | 'ready_with_warnings'
  | 'blocked';

export type UserAppTrialReadinessArea =
  | 'trial_tasks'
  | 'feedback_form'
  | 'privacy_copy'
  | 'local_boundary'
  | 'pwa_readiness'
  | 'mobile_shell'
  | 'user_path'
  | 'admin_qa_separation';

export interface UserAppTrialReadinessIssue {
  issueId: string;
  checkId: string;
  area: UserAppTrialReadinessArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppTrialReadinessCheck {
  checkId: string;
  area: UserAppTrialReadinessArea;
  label: string;
  status: 'passed' | 'warning' | 'blocked';
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppTrialReadinessIssue[];
  recommendation: string;
  deterministic: true;
}

export interface CreateUserAppTrialReadinessReportInput {
  trialPack?: UserAppTrialPack;
  feedbackForm?: UserAppTrialFeedbackForm;
  pwaReport?: UserAppPwaReadinessReport;
  mvpPolishReport?: UserAppMvpPolishReport;
  hasPrivacyLocalOnlyCopy?: boolean;
  hasNoUploadCopy?: boolean;
  hasNoTrainingCopy?: boolean;
  hasNoSensitiveDataCopy?: boolean;
  hasUserPathReady?: boolean;
  hasAdminQaSeparation?: boolean;
  usesBackend?: boolean;
  uploadsData?: boolean;
  usesCamera?: boolean;
  usesAr?: boolean;
  writesTrainingInput?: boolean;
  writesProjectStateUserRecords?: boolean;
  createdAt?: string;
}

export interface UserAppTrialReadinessReport {
  schemaVersion: typeof USER_APP_TRIAL_READINESS_SCHEMA_VERSION;
  status: UserAppTrialReadinessStatus;
  createdAt: string;
  checks: UserAppTrialReadinessCheck[];
  issues: UserAppTrialReadinessIssue[];
  summary: string;
  trialPackStatus: UserAppTrialPack['status'];
  feedbackFormStatus: UserAppTrialFeedbackForm['status'];
  pwaStatus: UserAppPwaReadinessReport['status'];
  mvpPolishStatus: UserAppMvpPolishReport['status'];
  localOnly: true;
  deterministic: true;
  productionApp: false;
  productionRelease: false;
  usesBackend: false;
  uploadsData: false;
  usesCamera: false;
  usesAr: false;
  writesTrainingInput: false;
  writesProjectStateUserRecords: false;
}

const TRIAL_READINESS_CREATED_AT = '2026-01-01T00:00:00.000Z';

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 37);

const issue = (
  input: Omit<UserAppTrialReadinessIssue, 'issueId'>,
): UserAppTrialReadinessIssue => ({
  ...input,
  issueId: `${input.checkId}-${input.severity}-${Math.abs(hashText(input.message))}`,
});

const check = (
  input: Omit<UserAppTrialReadinessCheck, 'deterministic'>,
): UserAppTrialReadinessCheck => ({
  ...input,
  deterministic: true,
});

const checkStatus = (
  issues: readonly UserAppTrialReadinessIssue[],
): UserAppTrialReadinessCheck['status'] => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'warning';
  return 'passed';
};

const reportStatus = (
  issues: readonly UserAppTrialReadinessIssue[],
): UserAppTrialReadinessStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'ready_with_warnings';
  return 'ready_for_internal_trial';
};

const booleanIssue = (input: {
  passed: boolean;
  checkId: string;
  area: UserAppTrialReadinessArea;
  severity?: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}): UserAppTrialReadinessIssue[] =>
  input.passed
    ? []
    : [
        issue({
          checkId: input.checkId,
          area: input.area,
          severity: input.severity ?? 'blocking',
          message: input.message,
          recommendation: input.recommendation,
        }),
      ];

const createTrialTasksCheck = (trialPack: UserAppTrialPack): UserAppTrialReadinessCheck => {
  const issues = trialPack.issues.map((packIssue) =>
    issue({
      checkId: 'trial-tasks',
      area: packIssue.area === 'tasks' ? 'trial_tasks' : 'local_boundary',
      severity: packIssue.severity,
      message: packIssue.message,
      recommendation: packIssue.recommendation,
    }),
  );

  return check({
    checkId: 'trial-tasks',
    area: 'trial_tasks',
    label: '试用任务包',
    status: checkStatus(issues),
    required: true,
    summary: `已声明 ${trialPack.scenario.tasks.length} 个本地试用任务。`,
    evidence: [
      `trialPackStatus: ${trialPack.status}`,
      `taskCount: ${trialPack.scenario.tasks.length}`,
      `localOnly: ${String(trialPack.localOnly)}`,
    ],
    issues,
    recommendation: '试用任务必须覆盖打开、推荐、选择模板、详情、跟练、工具、区域、偏好、隐私和恢复。',
  });
};

const createFeedbackCheck = (feedbackForm: UserAppTrialFeedbackForm): UserAppTrialReadinessCheck => {
  const issues = feedbackForm.issues.map((feedbackIssue) =>
    issue({
      checkId: 'feedback-form',
      area: feedbackIssue.area === 'form' ? 'feedback_form' : 'local_boundary',
      severity: feedbackIssue.severity,
      message: feedbackIssue.message,
      recommendation: feedbackIssue.recommendation,
    }),
  );

  return check({
    checkId: 'feedback-form',
    area: 'feedback_form',
    label: '反馈表结构',
    status: checkStatus(issues),
    required: true,
    summary: `已声明 ${feedbackForm.questions.length} 个本地反馈问题。`,
    evidence: [
      `feedbackFormStatus: ${feedbackForm.status}`,
      `questionCount: ${feedbackForm.questions.length}`,
      `submitsToBackend: ${String(feedbackForm.submitsToBackend)}`,
    ],
    issues,
    recommendation: '反馈表只能验证理解、跟练意愿、步骤数量、工具、推荐、隐私和价值感，不收集敏感数据。',
  });
};

const createPrivacyCopyCheck = (
  input: Required<
    Pick<
      CreateUserAppTrialReadinessReportInput,
      'hasPrivacyLocalOnlyCopy' | 'hasNoUploadCopy' | 'hasNoTrainingCopy' | 'hasNoSensitiveDataCopy'
    >
  >,
): UserAppTrialReadinessCheck => {
  const issues = [
    ...booleanIssue({
      passed: input.hasPrivacyLocalOnlyCopy,
      checkId: 'trial-privacy-copy',
      area: 'privacy_copy',
      message: '试用说明缺少本地-only 文案。',
      recommendation: '明确试用不上传、不登录、不写后端。',
    }),
    ...booleanIssue({
      passed: input.hasNoUploadCopy,
      checkId: 'trial-privacy-copy',
      area: 'privacy_copy',
      message: '试用说明缺少不上传数据/照片文案。',
      recommendation: '明确反馈和任务只作为本地/文档化结构。',
    }),
    ...booleanIssue({
      passed: input.hasNoTrainingCopy,
      checkId: 'trial-privacy-copy',
      area: 'privacy_copy',
      message: '试用说明缺少不会用于训练文案。',
      recommendation: '明确 trial feedback 不进入训练数据集。',
    }),
    ...booleanIssue({
      passed: input.hasNoSensitiveDataCopy,
      checkId: 'trial-privacy-copy',
      area: 'privacy_copy',
      message: '试用说明缺少不收集敏感信息文案。',
      recommendation: '明确不收集真实姓名、联系方式、照片、健康或敏感身份信息。',
    }),
  ];

  return check({
    checkId: 'trial-privacy-copy',
    area: 'privacy_copy',
    label: '试用隐私文案',
    status: checkStatus(issues),
    required: true,
    summary: '试用前必须能让用户理解本地、无上传、无训练和无敏感信息边界。',
    evidence: [
      `localOnlyCopy: ${String(input.hasPrivacyLocalOnlyCopy)}`,
      `noUploadCopy: ${String(input.hasNoUploadCopy)}`,
      `noTrainingCopy: ${String(input.hasNoTrainingCopy)}`,
      `noSensitiveDataCopy: ${String(input.hasNoSensitiveDataCopy)}`,
    ],
    issues,
    recommendation: '试用脚本和反馈说明应在用户开始前展示隐私边界。',
  });
};

const createBoundaryCheck = (
  input: Required<
    Pick<
      CreateUserAppTrialReadinessReportInput,
      | 'usesBackend'
      | 'uploadsData'
      | 'usesCamera'
      | 'usesAr'
      | 'writesTrainingInput'
      | 'writesProjectStateUserRecords'
    >
  >,
): UserAppTrialReadinessCheck => {
  const issues = [
    ...booleanIssue({
      passed: !input.usesBackend && !input.uploadsData,
      checkId: 'trial-local-boundary',
      area: 'local_boundary',
      message: '试用包不能接后端或上传数据。',
      recommendation: '仅保留本地示例、文档化结构和管理员验收面板。',
    }),
    ...booleanIssue({
      passed: !input.usesCamera && !input.usesAr,
      checkId: 'trial-local-boundary',
      area: 'local_boundary',
      message: '试用包不能启用相机或 AR。',
      recommendation: '照片、相机和 AR 仍保持暂未启用占位。',
    }),
    ...booleanIssue({
      passed: !input.writesTrainingInput && !input.writesProjectStateUserRecords,
      checkId: 'trial-local-boundary',
      area: 'local_boundary',
      message: '试用反馈不能写入训练输入或 project-state 用户记录。',
      recommendation: 'project-state 只能记录阶段状态，不能记录真实用户试用记录。',
    }),
  ];

  return check({
    checkId: 'trial-local-boundary',
    area: 'local_boundary',
    label: '本地边界',
    status: checkStatus(issues),
    required: true,
    summary: '8C 只允许本地 trial pack 和 mock/example feedback。',
    evidence: [
      `usesBackend: ${String(input.usesBackend)}`,
      `uploadsData: ${String(input.uploadsData)}`,
      `usesCamera: ${String(input.usesCamera)}`,
      `usesAr: ${String(input.usesAr)}`,
      `writesTrainingInput: ${String(input.writesTrainingInput)}`,
      `writesProjectStateUserRecords: ${String(input.writesProjectStateUserRecords)}`,
    ],
    issues,
    recommendation: '继续禁止后端、上传、相机、AR、训练和真实用户记录持久化。',
  });
};

export const createUserAppTrialReadinessReport = (
  input: CreateUserAppTrialReadinessReportInput = {},
): UserAppTrialReadinessReport => {
  const trialPack = input.trialPack ?? createUserAppTrialPack();
  const feedbackForm = input.feedbackForm ?? createUserAppTrialFeedbackForm();
  const pwaReport = input.pwaReport ?? createUserAppPwaReadinessReport();
  const mvpPolishReport = input.mvpPolishReport ?? createUserAppMvpPolishReport();
  const checks: UserAppTrialReadinessCheck[] = [
    createTrialTasksCheck(trialPack),
    createFeedbackCheck(feedbackForm),
    createPrivacyCopyCheck({
      hasPrivacyLocalOnlyCopy: input.hasPrivacyLocalOnlyCopy ?? true,
      hasNoUploadCopy: input.hasNoUploadCopy ?? true,
      hasNoTrainingCopy: input.hasNoTrainingCopy ?? true,
      hasNoSensitiveDataCopy: input.hasNoSensitiveDataCopy ?? true,
    }),
    createBoundaryCheck({
      usesBackend: input.usesBackend ?? false,
      uploadsData: input.uploadsData ?? false,
      usesCamera: input.usesCamera ?? false,
      usesAr: input.usesAr ?? false,
      writesTrainingInput: input.writesTrainingInput ?? false,
      writesProjectStateUserRecords: input.writesProjectStateUserRecords ?? false,
    }),
    check({
      checkId: 'pwa-carried-over',
      area: 'pwa_readiness',
      label: 'PWA 基础能力沿用',
      status: pwaReport.status === 'blocked' ? 'blocked' : pwaReport.status === 'warning' ? 'warning' : 'passed',
      required: true,
      summary: `PWA readiness 当前为 ${pwaReport.status}。`,
      evidence: [`pwaStatus: ${pwaReport.status}`],
      issues:
        pwaReport.status === 'ready'
          ? []
          : [
              issue({
                checkId: 'pwa-carried-over',
                area: 'pwa_readiness',
                severity: pwaReport.status === 'blocked' ? 'blocking' : 'warning',
                message: 'PWA readiness 尚未完全 ready。',
                recommendation: '先修复 manifest、metadata、runtime boundary 或 privacy boundary。',
              }),
            ],
      recommendation: '8C 沿用 8B PWA 骨架，但不新增 service worker/offline/push。',
    }),
    check({
      checkId: 'mobile-shell-carried-over',
      area: 'mobile_shell',
      label: '移动壳沿用',
      status:
        mvpPolishReport.status === 'blocked'
          ? 'blocked'
          : mvpPolishReport.status === 'warning'
            ? 'warning'
            : 'passed',
      required: true,
      summary: `MVP polish readiness 当前为 ${mvpPolishReport.status}。`,
      evidence: [`mvpPolishStatus: ${mvpPolishReport.status}`],
      issues:
        mvpPolishReport.status === 'ready'
          ? []
          : [
              issue({
                checkId: 'mobile-shell-carried-over',
                area: 'mobile_shell',
                severity: mvpPolishReport.status === 'blocked' ? 'blocking' : 'warning',
                message: '移动端 MVP shell polish 尚未完全 ready。',
                recommendation: '先修复移动首页、步骤、隐私文案、普通用户文案或管理员 QA 分离。',
              }),
            ],
      recommendation: '8C 只在已打磨的移动 shell 上增加管理员 trial 验收面板。',
    }),
    check({
      checkId: 'user-path-ready',
      area: 'user_path',
      label: '普通用户路径',
      status: input.hasUserPathReady ?? true ? 'passed' : 'blocked',
      required: true,
      summary: '普通用户路径保持跟练、发现、准备、偏好、照片占位、本地进度、隐私说明。',
      evidence: [`userPathReady: ${String(input.hasUserPathReady ?? true)}`],
      issues: booleanIssue({
        passed: input.hasUserPathReady ?? true,
        checkId: 'user-path-ready',
        area: 'user_path',
        message: '普通用户路径未准备好。',
        recommendation: '不要让 trial 管理信息抢普通用户主流程。',
      }),
      recommendation: '普通用户路径不暴露 trial admin 技术词。',
    }),
    check({
      checkId: 'trial-admin-separated',
      area: 'admin_qa_separation',
      label: '试用管理分离',
      status: input.hasAdminQaSeparation ?? true ? 'passed' : 'blocked',
      required: true,
      summary: 'MVP 试用包、反馈表预览和试用就绪度属于管理员试用管理入口。',
      evidence: [`adminQaSeparation: ${String(input.hasAdminQaSeparation ?? true)}`],
      issues: booleanIssue({
        passed: input.hasAdminQaSeparation ?? true,
        checkId: 'trial-admin-separated',
        area: 'admin_qa_separation',
        message: '试用管理入口没有和普通用户路径分开。',
        recommendation: '把 trial pack / feedback / readiness 放在管理员检查区域。',
      }),
      recommendation: '试用管理面板只能面向管理员/产品验收。',
    }),
  ];
  const issues = checks.flatMap((item) => item.issues);

  return {
    schemaVersion: USER_APP_TRIAL_READINESS_SCHEMA_VERSION,
    status: reportStatus(issues),
    createdAt: input.createdAt ?? TRIAL_READINESS_CREATED_AT,
    checks,
    issues,
    summary:
      issues.length === 0
        ? 'MVP 试用包可进入小范围内部试用。'
        : 'MVP 试用包仍有需要修复或观察的试用就绪问题。',
    trialPackStatus: trialPack.status,
    feedbackFormStatus: feedbackForm.status,
    pwaStatus: pwaReport.status,
    mvpPolishStatus: mvpPolishReport.status,
    localOnly: true,
    deterministic: true,
    productionApp: false,
    productionRelease: false,
    usesBackend: false,
    uploadsData: false,
    usesCamera: false,
    usesAr: false,
    writesTrainingInput: false,
    writesProjectStateUserRecords: false,
  };
};

export const summarizeUserAppTrialReadiness = (
  report: UserAppTrialReadinessReport,
): string =>
  JSON.stringify({
    schemaVersion: report.schemaVersion,
    status: report.status,
    trialPackStatus: report.trialPackStatus,
    feedbackFormStatus: report.feedbackFormStatus,
    pwaStatus: report.pwaStatus,
    mvpPolishStatus: report.mvpPolishStatus,
    localOnly: report.localOnly,
    productionApp: report.productionApp,
    productionRelease: report.productionRelease,
    usesBackend: report.usesBackend,
    uploadsData: report.uploadsData,
    usesCamera: report.usesCamera,
    usesAr: report.usesAr,
    writesTrainingInput: report.writesTrainingInput,
    writesProjectStateUserRecords: report.writesProjectStateUserRecords,
  });
