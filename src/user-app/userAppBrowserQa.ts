import type { UserAppMobileQaResult } from './userAppMobileQa';
import type { UserAppReadinessReport } from './userAppReadiness';

export const USER_APP_BROWSER_QA_SCHEMA_VERSION = 'user-app-browser-qa-v0.1' as const;

export type UserAppBrowserQaStatus = 'passed' | 'passed_with_warnings' | 'blocked';

export type UserAppBrowserQaArea =
  | 'browser_smoke'
  | 'mobile_viewport'
  | 'critical_path'
  | 'empty_state'
  | 'blocked_state'
  | 'recovery_state'
  | 'privacy_copy'
  | 'chinese_copy';

export interface UserAppBrowserQaCheck {
  checkId: string;
  area: UserAppBrowserQaArea;
  label: string;
  status: UserAppBrowserQaStatus;
  evidence: string[];
  issues: string[];
  recommendation: string;
  deterministic: true;
}

export interface UserAppBrowserQaReport {
  schemaVersion: typeof USER_APP_BROWSER_QA_SCHEMA_VERSION;
  status: UserAppBrowserQaStatus;
  createdAt: string;
  browserSmokeStatus: UserAppBrowserQaStatus;
  mobileQaStatus: UserAppBrowserQaStatus;
  criticalPathStatus: UserAppBrowserQaStatus;
  blockedStateStatus: UserAppBrowserQaStatus;
  privacyCopyStatus: UserAppBrowserQaStatus;
  chineseCopyStatus: UserAppBrowserQaStatus;
  checks: UserAppBrowserQaCheck[];
  summary: string;
  nextRecommendation: string;
  localOnly: true;
  deterministic: true;
  productionApp: false;
  usesBackend: false;
  usesCamera: false;
  usesAr: false;
  usesTraining: false;
  usesExternalApi: false;
}

export interface CreateUserAppBrowserQaReportInput {
  httpStatus?: number;
  pageLoaded?: boolean;
  runtimeCrashDetected?: boolean;
  renderedText?: string;
  mobileQaResult?: UserAppMobileQaResult | null;
  readinessReport?: UserAppReadinessReport | null;
  criticalPathEvidence?: readonly string[];
  emptyStateEvidence?: readonly string[];
  blockedStateEvidence?: readonly string[];
  recoveryStateEvidence?: readonly string[];
  createdAt?: string;
}

const BROWSER_QA_CREATED_AT = '2026-01-01T00:00:00.000Z';

const requiredCopySnippets = [
  '用户 App MVP Shell',
  '模板指导',
  '发现妆容',
  '我的准备',
  '我的偏好',
  '本地状态',
  'App 就绪度',
  '移动端 QA',
  '交互检查',
  '隐私说明',
];

const forbiddenRenderedTokens = [
  'blob:',
  'data:image/',
  'trainingInput',
  'imageBytes',
  'photoBytes',
  'faceEmbedding',
  'biometricId',
];

const mojibakePatterns = [
  /灏辩华|绉诲姩|鐢ㄦ埛|妯℃澘|闅愮|姝ラ|閫氳繃|鎻愰啋/,
  /鍙|杩涘|褰撳|鏈|涓嶆|浜や/,
];

const toReportStatus = (statuses: readonly UserAppBrowserQaStatus[]): UserAppBrowserQaStatus => {
  if (statuses.includes('blocked')) return 'blocked';
  if (statuses.includes('passed_with_warnings')) return 'passed_with_warnings';
  return 'passed';
};

const check = (
  input: Omit<UserAppBrowserQaCheck, 'deterministic'>,
): UserAppBrowserQaCheck => ({
  ...input,
  deterministic: true,
});

const statusFromIssues = (
  blockingIssues: readonly string[],
  warnings: readonly string[] = [],
): UserAppBrowserQaStatus => {
  if (blockingIssues.length > 0) return 'blocked';
  if (warnings.length > 0) return 'passed_with_warnings';
  return 'passed';
};

const createBrowserSmokeCheck = (
  input: CreateUserAppBrowserQaReportInput,
): UserAppBrowserQaCheck => {
  const blocking = [
    ...(input.httpStatus && input.httpStatus >= 200 && input.httpStatus < 300
      ? []
      : [`HTTP status is ${input.httpStatus ?? 'unknown'}`]),
    ...(input.pageLoaded ? [] : ['页面没有确认加载完成']),
    ...(input.runtimeCrashDetected ? ['检测到 runtime crash 标记'] : []),
  ];

  return check({
    checkId: 'browser-http-smoke',
    area: 'browser_smoke',
    label: '浏览器 HTTP smoke',
    status: statusFromIssues(blocking),
    evidence: [
      `httpStatus: ${input.httpStatus ?? 'unknown'}`,
      `pageLoaded: ${String(input.pageLoaded ?? false)}`,
      `runtimeCrashDetected: ${String(input.runtimeCrashDetected ?? false)}`,
    ],
    issues: blocking,
    recommendation: 'Vite 本地页面必须返回 200，并且不能出现明显 runtime crash。',
  });
};

const createMobileViewportCheck = (
  mobileQaResult?: UserAppMobileQaResult | null,
): UserAppBrowserQaCheck => {
  const blocking =
    mobileQaResult?.status === 'blocked' ? mobileQaResult.issues.map((item) => item.message) : [];
  const warnings =
    mobileQaResult?.status === 'warning' ? mobileQaResult.issues.map((item) => item.message) : [];

  return check({
    checkId: 'mobile-viewport-coverage',
    area: 'mobile_viewport',
    label: '移动端视口覆盖',
    status: statusFromIssues(blocking, warnings),
    evidence:
      mobileQaResult?.viewportProfiles.map(
        (viewport) => `${viewport.label}: ${viewport.width}x${viewport.height}`,
      ) ?? ['未提供 mobile QA report'],
    issues: [...blocking, ...warnings],
    recommendation: '覆盖 375、390、414 和 768 宽度，确认主要入口和步骤指导可读。',
  });
};

const createCriticalPathCheck = (
  evidence: readonly string[] = [],
): UserAppBrowserQaCheck => {
  const required = [
    'open-shell',
    'template-list',
    'template-detail',
    'step-guide',
    'session-panel',
    'readiness-panel',
  ];
  const missing = required.filter((item) => !evidence.includes(item));

  return check({
    checkId: 'critical-user-paths',
    area: 'critical_path',
    label: '关键路径覆盖',
    status: statusFromIssues(missing.map((item) => `缺少关键路径证据：${item}`)),
    evidence: evidence.length > 0 ? [...evidence] : ['未提供关键路径证据'],
    issues: missing.map((item) => `缺少关键路径证据：${item}`),
    recommendation: '至少覆盖打开 shell、模板列表、模板详情、步骤指导、本地会话和就绪度面板。',
  });
};

const createEvidenceCheck = (input: {
  checkId: string;
  area: UserAppBrowserQaArea;
  label: string;
  evidence?: readonly string[];
  requiredEvidence: readonly string[];
  recommendation: string;
}): UserAppBrowserQaCheck => {
  const evidence = input.evidence ?? [];
  const missing = input.requiredEvidence.filter((item) => !evidence.includes(item));

  return check({
    checkId: input.checkId,
    area: input.area,
    label: input.label,
    status: statusFromIssues(missing.map((item) => `缺少状态证据：${item}`)),
    evidence: evidence.length > 0 ? [...evidence] : ['未提供证据'],
    issues: missing.map((item) => `缺少状态证据：${item}`),
    recommendation: input.recommendation,
  });
};

const createPrivacyCopyCheck = (renderedText = ''): UserAppBrowserQaCheck => {
  const forbiddenHits = forbiddenRenderedTokens.filter((token) => renderedText.includes(token));
  const required = ['不采集真实用户照片', '不上传照片', '不会把用户照片、偏好、会话或推荐记录用于训练'];
  const missing = required.filter((snippet) => !renderedText.includes(snippet));

  return check({
    checkId: 'privacy-copy-readable',
    area: 'privacy_copy',
    label: '隐私文案可读',
    status: statusFromIssues(
      forbiddenHits.map((token) => `暴露了技术或敏感字段：${token}`),
      missing.map((snippet) => `缺少隐私文案：${snippet}`),
    ),
    evidence: [
      `forbiddenTokenHits: ${forbiddenHits.length}`,
      `requiredPrivacyCopyPresent: ${String(missing.length === 0)}`,
    ],
    issues: [
      ...forbiddenHits.map((token) => `暴露了技术或敏感字段：${token}`),
      ...missing.map((snippet) => `缺少隐私文案：${snippet}`),
    ],
    recommendation: '用户侧隐私文案必须用中文说明 local-only、不上传、不训练、不保存照片或生物识别数据。',
  });
};

const createChineseCopyCheck = (renderedText = ''): UserAppBrowserQaCheck => {
  const missing = requiredCopySnippets.filter((snippet) => !renderedText.includes(snippet));
  const mojibakeHits = mojibakePatterns
    .filter((pattern) => pattern.test(renderedText))
    .map((pattern) => pattern.source);

  return check({
    checkId: 'chinese-copy-readable',
    area: 'chinese_copy',
    label: '中文文案可读',
    status: statusFromIssues(
      mojibakeHits.map((pattern) => `疑似乱码模式：${pattern}`),
      missing.map((snippet) => `缺少核心中文入口：${snippet}`),
    ),
    evidence: [
      `requiredCopySnippets: ${requiredCopySnippets.length}`,
      `missingCopySnippets: ${missing.length}`,
      `mojibakePatterns: ${mojibakeHits.length}`,
    ],
    issues: [
      ...mojibakeHits.map((pattern) => `疑似乱码模式：${pattern}`),
      ...missing.map((snippet) => `缺少核心中文入口：${snippet}`),
    ],
    recommendation: '用户侧默认界面必须使用可读中文，不直接暴露乱码、内部字段或技术路径。',
  });
};

export const createUserAppBrowserQaReport = (
  input: CreateUserAppBrowserQaReportInput = {},
): UserAppBrowserQaReport => {
  const checks = [
    createBrowserSmokeCheck(input),
    createMobileViewportCheck(input.mobileQaResult),
    createCriticalPathCheck(input.criticalPathEvidence),
    createEvidenceCheck({
      checkId: 'empty-state-coverage',
      area: 'empty_state',
      label: '空状态覆盖',
      evidence: input.emptyStateEvidence,
      requiredEvidence: ['no-package', 'no-templates', 'no-recommendations'],
      recommendation: '空状态必须告诉 QA 下一步，而不是留白或显示 raw JSON。',
    }),
    createEvidenceCheck({
      checkId: 'blocked-state-coverage',
      area: 'blocked_state',
      label: '阻断状态覆盖',
      evidence: input.blockedStateEvidence,
      requiredEvidence: ['blocked-package', 'blocked-guide'],
      recommendation: '阻断状态必须展示原因，并阻止继续步骤指导。',
    }),
    createEvidenceCheck({
      checkId: 'recovery-state-coverage',
      area: 'recovery_state',
      label: '恢复状态覆盖',
      evidence: input.recoveryStateEvidence,
      requiredEvidence: ['partial-restore', 'session-reset'],
      recommendation: '本地会话恢复必须清楚说明恢复结果和可继续操作。',
    }),
    createPrivacyCopyCheck(input.renderedText),
    createChineseCopyCheck(input.renderedText),
  ];
  const browserSmokeStatus = checks.find((item) => item.area === 'browser_smoke')?.status ?? 'blocked';
  const mobileQaStatus = checks.find((item) => item.area === 'mobile_viewport')?.status ?? 'blocked';
  const criticalPathStatus = checks.find((item) => item.area === 'critical_path')?.status ?? 'blocked';
  const blockedStateStatus = checks.find((item) => item.area === 'blocked_state')?.status ?? 'blocked';
  const privacyCopyStatus = checks.find((item) => item.area === 'privacy_copy')?.status ?? 'blocked';
  const chineseCopyStatus = checks.find((item) => item.area === 'chinese_copy')?.status ?? 'blocked';
  const status = toReportStatus(checks.map((item) => item.status));

  return {
    schemaVersion: USER_APP_BROWSER_QA_SCHEMA_VERSION,
    status,
    createdAt: input.createdAt ?? BROWSER_QA_CREATED_AT,
    browserSmokeStatus,
    mobileQaStatus,
    criticalPathStatus,
    blockedStateStatus,
    privacyCopyStatus,
    chineseCopyStatus,
    checks,
    summary:
      status === 'passed'
        ? 'User App MVP Shell 浏览器与移动端 QA 通过。'
        : status === 'passed_with_warnings'
          ? 'User App MVP Shell 浏览器与移动端 QA 通过，但仍有提醒项。'
          : 'User App MVP Shell 浏览器与移动端 QA 存在阻断项。',
    nextRecommendation:
      status === 'blocked'
        ? '先修复阻断项，再进入 App 技术路线讨论。'
        : '可进入 Phase 8A App Technology Route Decision；若希望先继续打磨移动端，可选择 Phase 7H-1。',
    localOnly: true,
    deterministic: true,
    productionApp: false,
    usesBackend: false,
    usesCamera: false,
    usesAr: false,
    usesTraining: false,
    usesExternalApi: false,
  };
};
