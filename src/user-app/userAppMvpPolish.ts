import type { UserAppPwaReadinessReport } from './userAppPwaReadiness';
import { createUserAppPwaReadinessReport } from './userAppPwaReadiness';

export const USER_APP_MVP_POLISH_SCHEMA_VERSION = 'user-app-mvp-polish-v0.1' as const;

export type UserAppMvpPolishStatus = 'ready' | 'warning' | 'blocked';

export type UserAppMvpPolishArea =
  | 'mobile_home'
  | 'step_guide'
  | 'pwa_manifest'
  | 'privacy_copy'
  | 'user_copy'
  | 'admin_qa_separation'
  | 'local_only_boundary';

export interface CreateUserAppMvpPolishReportInput {
  pwaReport?: UserAppPwaReadinessReport;
  hasMobileHome?: boolean;
  hasPrimaryTemplateCta?: boolean;
  hasCurrentRecommendation?: boolean;
  hasTouchStepActions?: boolean;
  hasPreviousNextCompleteSkipLabels?: boolean;
  hasReadableToolsAndProducts?: boolean;
  hasReadableRegionCopy?: boolean;
  hasPrivacyLocalOnlyCopy?: boolean;
  hasNoUploadCopy?: boolean;
  hasNoTrainingCopy?: boolean;
  hidesInternalTermsFromUserPath?: boolean;
  userPathInternalTerms?: string[];
  hasAdminQaSeparation?: boolean;
  adminQaLabel?: string;
  hasPlaceholderDisabledCopy?: boolean;
  hasLocalOnlyBoundary?: boolean;
  createdAt?: string;
}

export interface UserAppMvpPolishIssue {
  issueId: string;
  checkId: string;
  area: UserAppMvpPolishArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppMvpPolishCheck {
  checkId: string;
  area: UserAppMvpPolishArea;
  label: string;
  status: UserAppMvpPolishStatus;
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppMvpPolishIssue[];
  recommendation: string;
  deterministic: true;
}

export interface UserAppMvpPolishReport {
  schemaVersion: typeof USER_APP_MVP_POLISH_SCHEMA_VERSION;
  status: UserAppMvpPolishStatus;
  createdAt: string;
  checks: UserAppMvpPolishCheck[];
  issues: UserAppMvpPolishIssue[];
  summary: string;
  pwaStatus: UserAppPwaReadinessReport['status'];
  localOnly: true;
  deterministic: true;
  productionApp: false;
  userFacingApp: false;
  usesBackend: false;
  usesCamera: false;
  usesAr: false;
  usesTraining: false;
  usesAnalytics: false;
  usesExternalApi: false;
}

const MVP_POLISH_CREATED_AT = '2026-01-01T00:00:00.000Z';

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 23);

const issue = (input: Omit<UserAppMvpPolishIssue, 'issueId'>): UserAppMvpPolishIssue => ({
  ...input,
  issueId: `${input.checkId}-${input.severity}-${Math.abs(hashText(input.message))}`,
});

const check = (
  input: Omit<UserAppMvpPolishCheck, 'deterministic'>,
): UserAppMvpPolishCheck => ({
  ...input,
  deterministic: true,
});

const statusFromIssues = (
  issues: readonly UserAppMvpPolishIssue[],
): UserAppMvpPolishStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'warning';
  return 'ready';
};

const booleanIssue = (input: {
  passed: boolean;
  checkId: string;
  area: UserAppMvpPolishArea;
  severity?: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}): UserAppMvpPolishIssue[] =>
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

const createMobileHomeCheck = (
  input: Required<
    Pick<
      CreateUserAppMvpPolishReportInput,
      'hasMobileHome' | 'hasPrimaryTemplateCta' | 'hasCurrentRecommendation'
    >
  >,
): UserAppMvpPolishCheck => {
  const issues = [
    ...booleanIssue({
      passed: input.hasMobileHome,
      checkId: 'mobile-home-readiness',
      area: 'mobile_home',
      message: '缺少更像移动端产品入口的首页。',
      recommendation: '首页应优先展示可开始模板、继续跟练和发现入口。',
    }),
    ...booleanIssue({
      passed: input.hasPrimaryTemplateCta,
      checkId: 'mobile-home-readiness',
      area: 'mobile_home',
      message: '缺少明确的模板发现或开始按钮。',
      recommendation: '把“浏览模板/开始跟练”作为普通用户主操作。',
    }),
    ...booleanIssue({
      passed: input.hasCurrentRecommendation,
      checkId: 'mobile-home-readiness',
      area: 'mobile_home',
      severity: 'warning',
      message: '首页缺少当前推荐或可开始模板摘要。',
      recommendation: '展示当前可开始妆容，减少用户在窄屏上来回查找。',
    }),
  ];

  return check({
    checkId: 'mobile-home-readiness',
    area: 'mobile_home',
    label: '移动首页',
    status: statusFromIssues(issues),
    required: true,
    summary: '首页应像用户 App 入口，而不是管理员 contract 预览。',
    evidence: [
      `mobileHome: ${String(input.hasMobileHome)}`,
      `primaryCta: ${String(input.hasPrimaryTemplateCta)}`,
      `currentRecommendation: ${String(input.hasCurrentRecommendation)}`,
    ],
    issues,
    recommendation: '窄屏首屏优先展示用户下一步，不让 QA 面板抢主流程。',
  });
};

const createStepGuideCheck = (
  input: Required<
    Pick<
      CreateUserAppMvpPolishReportInput,
      | 'hasTouchStepActions'
      | 'hasPreviousNextCompleteSkipLabels'
      | 'hasReadableToolsAndProducts'
      | 'hasReadableRegionCopy'
    >
  >,
): UserAppMvpPolishCheck => {
  const issues = [
    ...booleanIssue({
      passed: input.hasTouchStepActions,
      checkId: 'step-guide-readiness',
      area: 'step_guide',
      message: '分步指导按钮不满足触控优先。',
      recommendation: '上一步、下一步、完成、跳过应有足够高度和清楚标签。',
    }),
    ...booleanIssue({
      passed: input.hasPreviousNextCompleteSkipLabels,
      checkId: 'step-guide-readiness',
      area: 'step_guide',
      message: '步骤操作缺少上一步/下一步/完成/跳过标签。',
      recommendation: '保留用户可理解的中文动作标签。',
    }),
    ...booleanIssue({
      passed: input.hasReadableToolsAndProducts,
      checkId: 'step-guide-readiness',
      area: 'step_guide',
      severity: 'warning',
      message: '工具和产品建议在窄屏下可读性不足。',
      recommendation: '工具、产品和每步用量应分组展示，避免挤在一行。',
    }),
    ...booleanIssue({
      passed: input.hasReadableRegionCopy,
      checkId: 'step-guide-readiness',
      area: 'step_guide',
      severity: 'warning',
      message: '区域说明在窄屏下可读性不足。',
      recommendation: '区域说明应使用短段落和清楚标题。',
    }),
  ];

  return check({
    checkId: 'step-guide-readiness',
    area: 'step_guide',
    label: '分步指导',
    status: statusFromIssues(issues),
    required: true,
    summary: '分步指导需要适合手机触控和单手阅读。',
    evidence: [
      `touchActions: ${String(input.hasTouchStepActions)}`,
      `actionLabels: ${String(input.hasPreviousNextCompleteSkipLabels)}`,
      `toolsProductsReadable: ${String(input.hasReadableToolsAndProducts)}`,
      `regionCopyReadable: ${String(input.hasReadableRegionCopy)}`,
    ],
    issues,
    recommendation: '保持按钮高度、文案和分组可读，阻断态不允许进入跟练。',
  });
};

const createPwaManifestCheck = (
  report: UserAppPwaReadinessReport,
): UserAppMvpPolishCheck => {
  const issues = report.status === 'blocked'
    ? [
        issue({
          checkId: 'pwa-manifest-readiness',
          area: 'pwa_manifest',
          severity: 'blocking',
          message: 'PWA manifest readiness 仍有阻断项。',
          recommendation: '修复 manifest、metadata 或运行时边界后再完成 8B。',
        }),
      ]
    : report.status === 'warning'
      ? [
          issue({
            checkId: 'pwa-manifest-readiness',
            area: 'pwa_manifest',
            severity: 'warning',
            message: 'PWA manifest readiness 仍有提醒项。',
            recommendation: '补齐轻量 metadata，但不要添加 service worker 或离线缓存。',
          }),
        ]
      : [];

  return check({
    checkId: 'pwa-manifest-readiness',
    area: 'pwa_manifest',
    label: 'PWA 骨架',
    status: statusFromIssues(issues),
    required: true,
    summary: report.summary,
    evidence: [`pwaStatus: ${report.status}`, `pwaChecks: ${report.checks.length}`],
    issues,
    recommendation: '8B 只需要 install-readiness 骨架，不做线上发布。',
  });
};

const createPrivacyCopyCheck = (
  input: Required<
    Pick<
      CreateUserAppMvpPolishReportInput,
      'hasPrivacyLocalOnlyCopy' | 'hasNoUploadCopy' | 'hasNoTrainingCopy' | 'hasPlaceholderDisabledCopy'
    >
  >,
): UserAppMvpPolishCheck => {
  const issues = [
    ...booleanIssue({
      passed: input.hasPrivacyLocalOnlyCopy,
      checkId: 'privacy-copy-readiness',
      area: 'privacy_copy',
      message: '隐私文案缺少本地-only 表达。',
      recommendation: '用户可见文案必须说明当前只在本地使用。',
    }),
    ...booleanIssue({
      passed: input.hasNoUploadCopy,
      checkId: 'privacy-copy-readiness',
      area: 'privacy_copy',
      message: '隐私文案缺少不上传说明。',
      recommendation: '继续明确当前版本不上传照片或个人数据。',
    }),
    ...booleanIssue({
      passed: input.hasNoTrainingCopy,
      checkId: 'privacy-copy-readiness',
      area: 'privacy_copy',
      message: '隐私文案缺少不训练说明。',
      recommendation: '继续明确不会把用户照片、偏好、会话或推荐用于训练。',
    }),
    ...booleanIssue({
      passed: input.hasPlaceholderDisabledCopy,
      checkId: 'privacy-copy-readiness',
      area: 'privacy_copy',
      severity: 'warning',
      message: '占位能力未说明暂未启用。',
      recommendation: '照片、相机、AR、同步等占位需要说明暂未启用。',
    }),
  ];

  return check({
    checkId: 'privacy-copy-readiness',
    area: 'privacy_copy',
    label: '隐私文案',
    status: statusFromIssues(issues),
    required: true,
    summary: '用户需要能直接理解本地-only、不上传、不训练、暂未启用。',
    evidence: [
      `localOnlyCopy: ${String(input.hasPrivacyLocalOnlyCopy)}`,
      `noUploadCopy: ${String(input.hasNoUploadCopy)}`,
      `noTrainingCopy: ${String(input.hasNoTrainingCopy)}`,
      `placeholderDisabledCopy: ${String(input.hasPlaceholderDisabledCopy)}`,
    ],
    issues,
    recommendation: '隐私文案保持中文直白表达，不暴露内部字段名。',
  });
};

const createUserCopyCheck = (
  input: Required<
    Pick<
      CreateUserAppMvpPolishReportInput,
      'hidesInternalTermsFromUserPath' | 'userPathInternalTerms'
    >
  >,
): UserAppMvpPolishCheck => {
  const issues = input.hidesInternalTermsFromUserPath && input.userPathInternalTerms.length === 0
    ? []
    : [
        issue({
          checkId: 'user-copy-readiness',
          area: 'user_copy',
          severity: 'warning',
          message: `普通用户路径仍暴露内部词：${input.userPathInternalTerms.join('、') || '未列明'}`,
          recommendation: '把 contract、schema、readiness gate、package 等词收进管理员检查区。',
        }),
      ];

  return check({
    checkId: 'user-copy-readiness',
    area: 'user_copy',
    label: '普通用户文案',
    status: statusFromIssues(issues),
    required: true,
    summary: '普通用户入口应使用“妆容、步骤、本地状态、隐私”等中文产品词。',
    evidence: [
      `hidesInternalTerms: ${String(input.hidesInternalTermsFromUserPath)}`,
      `internalTerms: ${input.userPathInternalTerms.join(',') || 'none'}`,
    ],
    issues,
    recommendation: '技术词可以保留在管理员 QA 面板，但不要放在用户主路径。',
  });
};

const createAdminQaSeparationCheck = (
  input: Required<Pick<CreateUserAppMvpPolishReportInput, 'hasAdminQaSeparation' | 'adminQaLabel'>>,
): UserAppMvpPolishCheck => {
  const issues = booleanIssue({
    passed: input.hasAdminQaSeparation,
    checkId: 'admin-qa-separation',
    area: 'admin_qa_separation',
    message: '管理员 QA 入口和普通用户路径没有分开。',
    recommendation: '把 PWA、MVP polish、readiness、mobile QA、interaction checklist 放进管理员检查区。',
  });

  return check({
    checkId: 'admin-qa-separation',
    area: 'admin_qa_separation',
    label: '管理员 QA 分区',
    status: statusFromIssues(issues),
    required: true,
    summary: 'QA 面板需要明确是管理员检查，不是正式用户功能。',
    evidence: [`adminQaLabel: ${input.adminQaLabel || 'missing'}`],
    issues,
    recommendation: '普通用户主路径只保留跟练必要入口，QA 能力收纳在独立区块。',
  });
};

const createLocalOnlyBoundaryCheck = (
  input: Required<Pick<CreateUserAppMvpPolishReportInput, 'hasLocalOnlyBoundary'>>,
): UserAppMvpPolishCheck => {
  const issues = booleanIssue({
    passed: input.hasLocalOnlyBoundary,
    checkId: 'local-only-boundary',
    area: 'local_only_boundary',
    message: '缺少 no backend / no camera / no AR / no training / no API 边界。',
    recommendation: '保留 8B 是本地 prototype polish 的明确边界。',
  });

  return check({
    checkId: 'local-only-boundary',
    area: 'local_only_boundary',
    label: '本地边界',
    status: statusFromIssues(issues),
    required: true,
    summary: '8B 仍不是生产 App，不接后端、相机、AR、训练或外部 API。',
    evidence: [`localOnlyBoundary: ${String(input.hasLocalOnlyBoundary)}`],
    issues,
    recommendation: '所有 polish 只能改善本地 shell 体验，不能扩大运行时能力。',
  });
};

export const createUserAppMvpPolishReport = (
  input: CreateUserAppMvpPolishReportInput = {},
): UserAppMvpPolishReport => {
  const pwaReport = input.pwaReport ?? createUserAppPwaReadinessReport();
  const checks = [
    createMobileHomeCheck({
      hasMobileHome: input.hasMobileHome ?? true,
      hasPrimaryTemplateCta: input.hasPrimaryTemplateCta ?? true,
      hasCurrentRecommendation: input.hasCurrentRecommendation ?? true,
    }),
    createStepGuideCheck({
      hasTouchStepActions: input.hasTouchStepActions ?? true,
      hasPreviousNextCompleteSkipLabels: input.hasPreviousNextCompleteSkipLabels ?? true,
      hasReadableToolsAndProducts: input.hasReadableToolsAndProducts ?? true,
      hasReadableRegionCopy: input.hasReadableRegionCopy ?? true,
    }),
    createPwaManifestCheck(pwaReport),
    createPrivacyCopyCheck({
      hasPrivacyLocalOnlyCopy: input.hasPrivacyLocalOnlyCopy ?? true,
      hasNoUploadCopy: input.hasNoUploadCopy ?? true,
      hasNoTrainingCopy: input.hasNoTrainingCopy ?? true,
      hasPlaceholderDisabledCopy: input.hasPlaceholderDisabledCopy ?? true,
    }),
    createUserCopyCheck({
      hidesInternalTermsFromUserPath: input.hidesInternalTermsFromUserPath ?? true,
      userPathInternalTerms: input.userPathInternalTerms ?? [],
    }),
    createAdminQaSeparationCheck({
      hasAdminQaSeparation: input.hasAdminQaSeparation ?? true,
      adminQaLabel: input.adminQaLabel ?? '管理员检查',
    }),
    createLocalOnlyBoundaryCheck({
      hasLocalOnlyBoundary: input.hasLocalOnlyBoundary ?? true,
    }),
  ];
  const issues = checks.flatMap((item) => item.issues);
  const status = statusFromIssues(issues);

  return {
    schemaVersion: USER_APP_MVP_POLISH_SCHEMA_VERSION,
    status,
    createdAt: input.createdAt ?? MVP_POLISH_CREATED_AT,
    checks,
    issues,
    summary:
      status === 'ready'
        ? '移动 Web MVP Shell 已完成 8B polish readiness。'
        : '移动 Web MVP Shell polish 仍有待修正项。',
    pwaStatus: pwaReport.status,
    localOnly: true,
    deterministic: true,
    productionApp: false,
    userFacingApp: false,
    usesBackend: false,
    usesCamera: false,
    usesAr: false,
    usesTraining: false,
    usesAnalytics: false,
    usesExternalApi: false,
  };
};

export const summarizeUserAppMvpPolish = (
  report: UserAppMvpPolishReport,
): string =>
  JSON.stringify({
    schemaVersion: report.schemaVersion,
    status: report.status,
    pwaStatus: report.pwaStatus,
    checks: report.checks.length,
    issues: report.issues.length,
    localOnly: report.localOnly,
    productionApp: report.productionApp,
    userFacingApp: report.userFacingApp,
    usesBackend: report.usesBackend,
    usesCamera: report.usesCamera,
    usesAr: report.usesAr,
    usesTraining: report.usesTraining,
    usesAnalytics: report.usesAnalytics,
  });
