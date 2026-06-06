export const USER_APP_PWA_READINESS_SCHEMA_VERSION = 'user-app-pwa-readiness-v0.1' as const;

export type UserAppPwaReadinessStatus = 'ready' | 'warning' | 'blocked';

export type UserAppPwaReadinessArea =
  | 'manifest'
  | 'metadata'
  | 'icon'
  | 'runtime_boundary'
  | 'privacy_boundary';

export interface UserAppPwaManifestMetadata {
  manifestPath?: string;
  appName?: string;
  shortName?: string;
  themeColor?: string;
  displayMode?: string;
  iconPaths?: string[];
  hasManifestLink?: boolean;
  hasThemeColorMeta?: boolean;
}

export interface UserAppPwaBoundaryFlags {
  hasServiceWorker?: boolean;
  hasOfflineCache?: boolean;
  hasPushNotification?: boolean;
  hasBackgroundSync?: boolean;
  hasBackend?: boolean;
  hasAnalytics?: boolean;
  hasInstallTracking?: boolean;
  localOnlyBoundary?: boolean;
}

export interface CreateUserAppPwaReadinessReportInput {
  metadata?: UserAppPwaManifestMetadata;
  boundaryFlags?: UserAppPwaBoundaryFlags;
  createdAt?: string;
}

export interface UserAppPwaReadinessIssue {
  issueId: string;
  checkId: string;
  area: UserAppPwaReadinessArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppPwaReadinessCheck {
  checkId: string;
  area: UserAppPwaReadinessArea;
  label: string;
  status: UserAppPwaReadinessStatus;
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppPwaReadinessIssue[];
  recommendation: string;
  deterministic: true;
}

export interface UserAppPwaReadinessReport {
  schemaVersion: typeof USER_APP_PWA_READINESS_SCHEMA_VERSION;
  status: UserAppPwaReadinessStatus;
  createdAt: string;
  checks: UserAppPwaReadinessCheck[];
  issues: UserAppPwaReadinessIssue[];
  summary: string;
  localOnly: true;
  deterministic: true;
  productionApp: false;
  installsTracked: false;
  usesServiceWorker: false;
  usesOfflineCache: false;
  usesPushNotification: false;
  usesBackgroundSync: false;
  usesBackend: false;
  usesAnalytics: false;
  usesCamera: false;
  usesAr: false;
  usesTraining: false;
  usesExternalApi: false;
}

const PWA_READINESS_CREATED_AT = '2026-01-01T00:00:00.000Z';

export const createDefaultUserAppPwaMetadata = (): Required<UserAppPwaManifestMetadata> => ({
  manifestPath: '/manifest.webmanifest',
  appName: 'Makeup Engine Mobile Shell',
  shortName: 'Makeup Shell',
  themeColor: '#0f766e',
  displayMode: 'standalone',
  iconPaths: ['/pwa-icon.svg'],
  hasManifestLink: true,
  hasThemeColorMeta: true,
});

export const createDefaultUserAppPwaBoundaryFlags =
  (): Required<UserAppPwaBoundaryFlags> => ({
    hasServiceWorker: false,
    hasOfflineCache: false,
    hasPushNotification: false,
    hasBackgroundSync: false,
    hasBackend: false,
    hasAnalytics: false,
    hasInstallTracking: false,
    localOnlyBoundary: true,
  });

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 19);

const issue = (input: Omit<UserAppPwaReadinessIssue, 'issueId'>): UserAppPwaReadinessIssue => ({
  ...input,
  issueId: `${input.checkId}-${input.severity}-${Math.abs(hashText(input.message))}`,
});

const check = (
  input: Omit<UserAppPwaReadinessCheck, 'deterministic'>,
): UserAppPwaReadinessCheck => ({
  ...input,
  deterministic: true,
});

const statusFromIssues = (
  issues: readonly UserAppPwaReadinessIssue[],
): UserAppPwaReadinessStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'warning';
  return 'ready';
};

const checkStatusFromIssues = (
  issues: readonly UserAppPwaReadinessIssue[],
): UserAppPwaReadinessCheck['status'] => statusFromIssues(issues);

const requiredMetadata = (
  input: UserAppPwaManifestMetadata | undefined,
): Required<UserAppPwaManifestMetadata> => ({
  ...createDefaultUserAppPwaMetadata(),
  ...input,
  iconPaths: input?.iconPaths ?? createDefaultUserAppPwaMetadata().iconPaths,
});

const requiredBoundaryFlags = (
  input: UserAppPwaBoundaryFlags | undefined,
): Required<UserAppPwaBoundaryFlags> => ({
  ...createDefaultUserAppPwaBoundaryFlags(),
  ...input,
});

const createManifestCheck = (
  metadata: Required<UserAppPwaManifestMetadata>,
): UserAppPwaReadinessCheck => {
  const issues = [
    ...(!metadata.manifestPath || !metadata.hasManifestLink
      ? [
          issue({
            checkId: 'pwa-manifest',
            area: 'manifest',
            severity: 'blocking',
            message: '缺少 web app manifest 或 HTML manifest 链接。',
            recommendation: '保留 manifest.webmanifest，并在 HTML head 中声明 manifest link。',
          }),
        ]
      : []),
  ];

  return check({
    checkId: 'pwa-manifest',
    area: 'manifest',
    label: 'PWA manifest',
    status: checkStatusFromIssues(issues),
    required: true,
    summary: metadata.manifestPath
      ? `manifest 已声明为 ${metadata.manifestPath}。`
      : 'manifest 尚未声明。',
    evidence: [
      `manifestPath: ${metadata.manifestPath || 'missing'}`,
      `hasManifestLink: ${String(metadata.hasManifestLink)}`,
    ],
    issues,
    recommendation: 'PWA MVP 只需要基础 manifest 骨架，不启用离线缓存。',
  });
};

const createMetadataCheck = (
  metadata: Required<UserAppPwaManifestMetadata>,
): UserAppPwaReadinessCheck => {
  const issues = [
    ...(!metadata.appName
      ? [
          issue({
            checkId: 'pwa-metadata',
            area: 'metadata',
            severity: 'blocking',
            message: '缺少应用名称。',
            recommendation: 'manifest 必须声明面向安装入口的 name。',
          }),
        ]
      : []),
    ...(!metadata.shortName
      ? [
          issue({
            checkId: 'pwa-metadata',
            area: 'metadata',
            severity: 'warning',
            message: '缺少短名称。',
            recommendation: '补充 short_name，避免移动端安装入口名称过长。',
          }),
        ]
      : []),
    ...(!metadata.themeColor || !metadata.hasThemeColorMeta
      ? [
          issue({
            checkId: 'pwa-metadata',
            area: 'metadata',
            severity: 'warning',
            message: '缺少 theme color 或 HTML theme-color meta。',
            recommendation: '保留 theme_color 和 theme-color meta，方便移动浏览器使用一致色彩。',
          }),
        ]
      : []),
    ...(metadata.displayMode !== 'standalone'
      ? [
          issue({
            checkId: 'pwa-metadata',
            area: 'metadata',
            severity: 'warning',
            message: 'display mode 不是 standalone。',
            recommendation: 'MVP 安装壳应使用 standalone，但不要开启生产发布能力。',
          }),
        ]
      : []),
  ];

  return check({
    checkId: 'pwa-metadata',
    area: 'metadata',
    label: '应用名称和主题',
    status: checkStatusFromIssues(issues),
    required: true,
    summary: `${metadata.appName || '未命名'} / ${metadata.shortName || '无短名称'} / ${metadata.displayMode || '无显示模式'}`,
    evidence: [
      `themeColor: ${metadata.themeColor || 'missing'}`,
      `hasThemeColorMeta: ${String(metadata.hasThemeColorMeta)}`,
    ],
    issues,
    recommendation: '保持 name、short_name、theme_color 和 display 这些轻量 metadata 完整。',
  });
};

const createIconCheck = (
  metadata: Required<UserAppPwaManifestMetadata>,
): UserAppPwaReadinessCheck => {
  const issues =
    metadata.iconPaths.length > 0
      ? []
      : [
          issue({
            checkId: 'pwa-icon-placeholder',
            area: 'icon',
            severity: 'warning',
            message: '缺少轻量图标占位。',
            recommendation: '使用 SVG 或小型静态图标占位，不放入大图资源。',
          }),
        ];

  return check({
    checkId: 'pwa-icon-placeholder',
    area: 'icon',
    label: '图标占位',
    status: checkStatusFromIssues(issues),
    required: true,
    summary:
      metadata.iconPaths.length > 0
        ? `已声明 ${metadata.iconPaths.length} 个轻量图标资源。`
        : '尚未声明图标资源。',
    evidence: metadata.iconPaths.length > 0 ? metadata.iconPaths : ['iconPaths: empty'],
    issues,
    recommendation: '图标只做安装入口占位，不加入照片、素材大图或用户数据。',
  });
};

const createRuntimeBoundaryCheck = (
  flags: Required<UserAppPwaBoundaryFlags>,
): UserAppPwaReadinessCheck => {
  const blockedFlags: Array<[keyof UserAppPwaBoundaryFlags, string]> = [
    ['hasServiceWorker', '当前 8B 不应启用 service worker。'],
    ['hasOfflineCache', '当前 8B 不应启用离线缓存。'],
    ['hasPushNotification', '当前 8B 不应启用推送通知。'],
    ['hasBackgroundSync', '当前 8B 不应启用后台同步。'],
    ['hasBackend', '当前 8B 不应连接后端。'],
    ['hasAnalytics', '当前 8B 不应启用 analytics。'],
    ['hasInstallTracking', '当前 8B 不应追踪安装行为。'],
  ];
  const issues = blockedFlags.flatMap(([flag, message]) =>
    flags[flag]
      ? [
          issue({
            checkId: 'pwa-runtime-boundary',
            area: 'runtime_boundary',
            severity: 'blocking',
            message,
            recommendation: '移除该运行时能力，8B 只保留 manifest 和 metadata readiness。',
          }),
        ]
      : [],
  );

  return check({
    checkId: 'pwa-runtime-boundary',
    area: 'runtime_boundary',
    label: '运行时边界',
    status: checkStatusFromIssues(issues),
    required: true,
    summary:
      issues.length === 0
        ? '未启用 service worker、离线缓存、推送、后台同步、后端、analytics 或安装追踪。'
        : '发现超出 8B 范围的 PWA 运行时能力。',
    evidence: [
      `serviceWorker: ${String(flags.hasServiceWorker)}`,
      `offlineCache: ${String(flags.hasOfflineCache)}`,
      `backend: ${String(flags.hasBackend)}`,
      `analytics: ${String(flags.hasAnalytics)}`,
    ],
    issues,
    recommendation: 'PWA MVP polish 保持本地-only，不做生产运行时扩展。',
  });
};

const createPrivacyBoundaryCheck = (
  flags: Required<UserAppPwaBoundaryFlags>,
): UserAppPwaReadinessCheck => {
  const issues = flags.localOnlyBoundary
    ? []
    : [
        issue({
          checkId: 'pwa-local-only-boundary',
          area: 'privacy_boundary',
          severity: 'blocking',
          message: 'PWA readiness 缺少本地-only 边界声明。',
          recommendation: '补充不上传、不训练、不采集照片、不连接后端的用户可读说明。',
        }),
      ];

  return check({
    checkId: 'pwa-local-only-boundary',
    area: 'privacy_boundary',
    label: '本地-only 边界',
    status: checkStatusFromIssues(issues),
    required: true,
    summary: flags.localOnlyBoundary
      ? 'PWA 壳仍保持本地-only，不上传、不训练、不接后端。'
      : 'PWA 壳缺少本地-only 边界。',
    evidence: [`localOnlyBoundary: ${String(flags.localOnlyBoundary)}`],
    issues,
    recommendation: '隐私说明应持续告诉用户：照片/相机/AR 暂未启用，数据不上传不训练。',
  });
};

export const createUserAppPwaReadinessReport = (
  input: CreateUserAppPwaReadinessReportInput = {},
): UserAppPwaReadinessReport => {
  const metadata = requiredMetadata(input.metadata);
  const flags = requiredBoundaryFlags(input.boundaryFlags);
  const checks = [
    createManifestCheck(metadata),
    createMetadataCheck(metadata),
    createIconCheck(metadata),
    createRuntimeBoundaryCheck(flags),
    createPrivacyBoundaryCheck(flags),
  ];
  const issues = checks.flatMap((item) => item.issues);
  const status = statusFromIssues(issues);

  return {
    schemaVersion: USER_APP_PWA_READINESS_SCHEMA_VERSION,
    status,
    createdAt: input.createdAt ?? PWA_READINESS_CREATED_AT,
    checks,
    issues,
    summary:
      status === 'ready'
        ? 'PWA 基础 metadata 已具备，且未启用生产运行时能力。'
        : 'PWA 基础 metadata 或运行时边界仍需修正。',
    localOnly: true,
    deterministic: true,
    productionApp: false,
    installsTracked: false,
    usesServiceWorker: false,
    usesOfflineCache: false,
    usesPushNotification: false,
    usesBackgroundSync: false,
    usesBackend: false,
    usesAnalytics: false,
    usesCamera: false,
    usesAr: false,
    usesTraining: false,
    usesExternalApi: false,
  };
};

export const summarizeUserAppPwaReadiness = (
  report: UserAppPwaReadinessReport,
): string =>
  JSON.stringify({
    schemaVersion: report.schemaVersion,
    status: report.status,
    checks: report.checks.length,
    issues: report.issues.length,
    localOnly: report.localOnly,
    productionApp: report.productionApp,
    usesServiceWorker: report.usesServiceWorker,
    usesBackend: report.usesBackend,
    usesAnalytics: report.usesAnalytics,
    usesTraining: report.usesTraining,
  });
