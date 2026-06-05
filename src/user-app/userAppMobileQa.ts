export const USER_APP_MOBILE_QA_SCHEMA_VERSION = 'user-app-mobile-qa-v0.1' as const;

export type UserAppMobileQaStatus = 'passed' | 'warning' | 'blocked';

export type UserAppMobileQaArea =
  | 'layout'
  | 'touch_target'
  | 'navigation'
  | 'content'
  | 'empty_state'
  | 'blocked_state'
  | 'session'
  | 'privacy';

export interface UserAppMobileViewportProfile {
  viewportId: string;
  label: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  minTouchTargetPx: number;
}

export interface UserAppMobileQaCheck {
  checkId: string;
  area: UserAppMobileQaArea;
  label: string;
  description: string;
  required: boolean;
  status: UserAppMobileQaStatus;
  viewportIds: string[];
  evidence: string[];
  recommendation: string;
  deterministic: true;
}

export interface UserAppMobileQaIssue {
  issueId: string;
  checkId: string;
  area: UserAppMobileQaArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppMobileQaResult {
  schemaVersion: typeof USER_APP_MOBILE_QA_SCHEMA_VERSION;
  status: UserAppMobileQaStatus;
  createdAt: string;
  viewportProfiles: UserAppMobileViewportProfile[];
  checks: UserAppMobileQaCheck[];
  issues: UserAppMobileQaIssue[];
  recommendations: string[];
  summary: string;
  localOnly: true;
  deterministic: true;
  requiresBrowserAutomation: false;
  usesExternalApi: false;
}

export interface CreateMobileQaChecklistInput {
  hasPackage?: boolean;
  templateCount?: number;
  canEnterStepGuide?: boolean;
  hasPrivacyCopy?: boolean;
  hasSessionControls?: boolean;
  hasRecoveryNotice?: boolean;
  hasWarningCopy?: boolean;
  hasBlockedCopy?: boolean;
  hasLargeTapTargets?: boolean;
  hasMobileStackingClasses?: boolean;
  hidesRawJsonByDefault?: boolean;
}

const MOBILE_QA_CREATED_AT = '2026-01-01T00:00:00.000Z';

export const createDefaultMobileViewportProfiles = (): UserAppMobileViewportProfile[] => [
  {
    viewportId: 'phone-375-portrait',
    label: '小屏手机 375px',
    width: 375,
    height: 667,
    orientation: 'portrait',
    minTouchTargetPx: 44,
  },
  {
    viewportId: 'phone-390-portrait',
    label: '常规手机 390px',
    width: 390,
    height: 844,
    orientation: 'portrait',
    minTouchTargetPx: 44,
  },
  {
    viewportId: 'phone-414-portrait',
    label: '大屏手机 414px',
    width: 414,
    height: 896,
    orientation: 'portrait',
    minTouchTargetPx: 44,
  },
  {
    viewportId: 'tablet-768-portrait',
    label: '窄屏平板 768px',
    width: 768,
    height: 1024,
    orientation: 'portrait',
    minTouchTargetPx: 44,
  },
];

const allViewportIds = createDefaultMobileViewportProfiles().map(
  (viewport) => viewport.viewportId,
);

const qaCheck = (
  input: Omit<UserAppMobileQaCheck, 'deterministic'>,
): UserAppMobileQaCheck => ({
  ...input,
  deterministic: true,
});

export const createMobileQaChecklist = (
  input: CreateMobileQaChecklistInput = {},
): UserAppMobileQaCheck[] => {
  const hasPackage = input.hasPackage ?? true;
  const templateCount = input.templateCount ?? 1;
  const canEnterStepGuide = input.canEnterStepGuide ?? true;
  const hasPrivacyCopy = input.hasPrivacyCopy ?? true;
  const hasSessionControls = input.hasSessionControls ?? true;
  const hasRecoveryNotice = input.hasRecoveryNotice ?? true;
  const hasWarningCopy = input.hasWarningCopy ?? true;
  const hasBlockedCopy = input.hasBlockedCopy ?? true;
  const hasLargeTapTargets = input.hasLargeTapTargets ?? true;
  const hasMobileStackingClasses = input.hasMobileStackingClasses ?? true;
  const hidesRawJsonByDefault = input.hidesRawJsonByDefault ?? true;

  return [
    qaCheck({
      checkId: 'mobile-layout-stacks',
      area: 'layout',
      label: '移动端纵向布局',
      description: '窄屏下模板列表、详情、步骤、状态面板需要纵向堆叠，不能挤压主要内容。',
      required: true,
      status: hasMobileStackingClasses ? 'passed' : 'blocked',
      viewportIds: allViewportIds,
      evidence: hasMobileStackingClasses
        ? ['Shell 使用响应式 flex/grid class，窄屏优先纵向阅读。']
        : ['未发现足够的窄屏纵向布局证据。'],
      recommendation: '保持主内容单列优先，辅助面板在小屏下向下堆叠。',
    }),
    qaCheck({
      checkId: 'touch-target-size',
      area: 'touch_target',
      label: '按钮触控尺寸',
      description: '导航、保存、恢复、筛选和步骤按钮在手机上需要可点击，不应过窄。',
      required: true,
      status: hasLargeTapTargets ? 'passed' : 'warning',
      viewportIds: allViewportIds,
      evidence: hasLargeTapTargets
        ? ['主要操作使用 px-3 py-2 或更大的触控区域。']
        : ['部分操作可能低于 44px 触控建议。'],
      recommendation: '按钮保持至少 44px 触控高度，文字过长时允许换行。',
    }),
    qaCheck({
      checkId: 'core-navigation-visible',
      area: 'navigation',
      label: '核心入口可见',
      description: '模板指导、发现、准备、偏好、隐私、会话、就绪度和 QA 入口需要可见。',
      required: true,
      status: hasPackage ? 'passed' : 'warning',
      viewportIds: allViewportIds,
      evidence: hasPackage
        ? ['已加载 UserAppTemplatePackage，核心入口可以展示。']
        : ['无 package 时只能展示明确空状态入口。'],
      recommendation: '无 package 时保留明确空状态，加载后显示完整入口。',
    }),
    qaCheck({
      checkId: 'step-guidance-usable',
      area: 'content',
      label: '步骤指导可用',
      description: '可用模板应能进入步骤指导；blocked 模板必须清楚说明原因。',
      required: true,
      status: canEnterStepGuide ? 'passed' : hasBlockedCopy ? 'warning' : 'blocked',
      viewportIds: allViewportIds,
      evidence: canEnterStepGuide
        ? ['当前 package 可以进入步骤指导。']
        : ['当前 package 或模板存在阻断，需要展示 blocked 文案。'],
      recommendation: '阻断状态不能隐藏，必须给出用户能理解的下一步说明。',
    }),
    qaCheck({
      checkId: 'empty-state-copy',
      area: 'empty_state',
      label: '空状态说明',
      description: '无 package、无模板、无筛选结果、无会话时需要明确告诉 QA 下一步。',
      required: true,
      status: hasPackage && templateCount > 0 ? 'passed' : 'warning',
      viewportIds: allViewportIds,
      evidence:
        hasPackage && templateCount > 0
          ? ['当前 fixture 有模板，可同时检查正常状态和空状态文案。']
          : ['当前没有可用模板，需要空状态说明。'],
      recommendation: '空状态不能只留白，需要说明“先导入/选择有效模板包”。',
    }),
    qaCheck({
      checkId: 'blocked-state-copy',
      area: 'blocked_state',
      label: '阻断状态说明',
      description: 'blocked package 或 blocked template 不能进入跟练，需要展示原因。',
      required: true,
      status: hasBlockedCopy ? 'passed' : 'blocked',
      viewportIds: allViewportIds,
      evidence: hasBlockedCopy ? ['已有 blocked 状态说明。'] : ['缺少 blocked 状态说明。'],
      recommendation: '保留 blocked reason，不用 warning 替代 blocking issue。',
    }),
    qaCheck({
      checkId: 'warning-copy-visible',
      area: 'content',
      label: '提醒状态可见',
      description: 'warning 模板可以预览，但提醒需要持续展示。',
      required: true,
      status: hasWarningCopy ? 'passed' : 'warning',
      viewportIds: allViewportIds,
      evidence: hasWarningCopy
        ? ['warning 文案会在兼容性、详情或推荐区域展示。']
        : ['未确认 warning 文案展示。'],
      recommendation: 'warning 不阻断，但必须保持可读。',
    }),
    qaCheck({
      checkId: 'session-controls-local-only',
      area: 'session',
      label: '本地状态操作',
      description: '保存、恢复、清除进度、重置偏好和清除本地状态需要明确 local-only。',
      required: true,
      status: hasSessionControls && hasRecoveryNotice ? 'passed' : 'warning',
      viewportIds: allViewportIds,
      evidence:
        hasSessionControls && hasRecoveryNotice
          ? ['已提供本地会话操作和恢复提示。']
          : ['会话操作或恢复提示仍需补齐。'],
      recommendation: '本地状态入口必须说明不登录、不同步、不上传、不训练。',
    }),
    qaCheck({
      checkId: 'privacy-boundary-visible',
      area: 'privacy',
      label: '隐私边界可见',
      description: '用户侧 shell 必须说明不收集照片、object URL、base64、路径和生物识别数据。',
      required: true,
      status: hasPrivacyCopy ? 'passed' : 'blocked',
      viewportIds: allViewportIds,
      evidence: hasPrivacyCopy ? ['隐私说明入口存在。'] : ['缺少用户侧隐私边界说明。'],
      recommendation: '隐私边界必须默认可访问，不能只藏在开发文档中。',
    }),
    qaCheck({
      checkId: 'raw-json-hidden',
      area: 'content',
      label: '默认隐藏原始数据',
      description: '移动端用户/产品 QA 默认看任务和状态，不应被 raw JSON 挤压。',
      required: false,
      status: hidesRawJsonByDefault ? 'passed' : 'warning',
      viewportIds: allViewportIds,
      evidence: hidesRawJsonByDefault
        ? ['User App Shell 默认不渲染 raw JSON。']
        : ['发现默认 raw JSON 展示风险。'],
      recommendation: 'raw JSON 只放开发模式或文档，不作为默认主界面。',
    }),
  ];
};

export const summarizeMobileQaIssues = (
  checks: readonly UserAppMobileQaCheck[],
): UserAppMobileQaIssue[] =>
  checks
    .filter((check) => check.status !== 'passed')
    .map((check): UserAppMobileQaIssue => ({
      issueId: `mobile-qa-${check.checkId}`,
      checkId: check.checkId,
      area: check.area,
      severity: check.status === 'blocked' ? 'blocking' : 'warning',
      message: check.evidence[0] ?? check.description,
      recommendation: check.recommendation,
    }));

export const createMobileQaRecommendations = (
  issues: readonly UserAppMobileQaIssue[],
): string[] => {
  if (issues.length === 0) {
    return ['移动端 QA 当前没有阻断项；可以进入 App 就绪度复核。'];
  }

  return Array.from(
    new Set([
      ...issues.map((issue) => issue.recommendation),
      '优先处理 blocking issue，再处理 warning issue；不要通过隐藏状态来绕过问题。',
    ]),
  );
};

export const evaluateMobileQaReadiness = (
  input: CreateMobileQaChecklistInput & { createdAt?: string } = {},
): UserAppMobileQaResult => {
  const checks = createMobileQaChecklist(input);
  const issues = summarizeMobileQaIssues(checks);
  const hasBlocking = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning = issues.some((issue) => issue.severity === 'warning');
  const status: UserAppMobileQaStatus = hasBlocking
    ? 'blocked'
    : hasWarning
      ? 'warning'
      : 'passed';

  return {
    schemaVersion: USER_APP_MOBILE_QA_SCHEMA_VERSION,
    status,
    createdAt: input.createdAt ?? MOBILE_QA_CREATED_AT,
    viewportProfiles: createDefaultMobileViewportProfiles(),
    checks,
    issues,
    recommendations: createMobileQaRecommendations(issues),
    summary:
      status === 'passed'
        ? '移动端交互 QA 通过，未发现阻断项。'
        : status === 'warning'
          ? '移动端交互 QA 有提醒项，需要在 App 原型前复核。'
          : '移动端交互 QA 存在阻断项，不能进入 App 原型验收。',
    localOnly: true,
    deterministic: true,
    requiresBrowserAutomation: false,
    usesExternalApi: false,
  };
};
