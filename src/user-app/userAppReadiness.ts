import type { UserAppTemplatePackage } from '../templates/schema';
import {
  validateNoRuntimeOnlyReferences,
  validateUserAppTemplatePackage,
} from '../template-engine/app-contract';
import type { UserLocalPreferences } from './userLocalPreferences';
import { createDefaultUserLocalPreferences, validateUserLocalPreferences } from './userLocalPreferences';
import type { UserOnboardingState } from './userOnboarding';
import { createInitialUserOnboardingState, validateOnboardingState } from './userOnboarding';
import type { UserAppSessionState } from './userAppSession';
import { createInitialUserAppSession, validateUserAppSession } from './userAppSession';
import { createSessionBoundaryWarnings } from './userAppSessionPrivacy';
import type { UserTemplateDiscoveryState } from './userTemplateDiscovery';
import {
  createInitialTemplateDiscoveryState,
  filterTemplatesForDiscovery,
  validateTemplateDiscoveryState,
} from './userTemplateDiscovery';
import {
  evaluateMobileQaReadiness,
  type UserAppMobileQaResult,
} from './userAppMobileQa';
import type { UserAppShellViewModel } from './userAppViewModel';
import { createUserAppShellViewModel } from './userAppViewModel';

export const USER_APP_READINESS_SCHEMA_VERSION = 'user-app-readiness-v0.1' as const;

export type UserAppReadinessStatus =
  | 'ready_for_app_prototype'
  | 'ready_with_warnings'
  | 'needs_qa_hardening'
  | 'blocked';

export type UserAppReadinessCheckArea =
  | 'template_package'
  | 'step_guidance'
  | 'onboarding'
  | 'preferences'
  | 'discovery'
  | 'session_persistence'
  | 'privacy'
  | 'mobile_interaction'
  | 'empty_state'
  | 'blocked_state';

export interface UserAppReadinessIssue {
  issueId: string;
  checkId: string;
  area: UserAppReadinessCheckArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppReadinessCheck {
  checkId: string;
  area: UserAppReadinessCheckArea;
  label: string;
  status: 'passed' | 'warning' | 'blocked';
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppReadinessIssue[];
  recommendation: string;
  deterministic: true;
}

export interface UserAppReadinessRecommendation {
  recommendationId: string;
  priority: 'must_fix' | 'should_fix' | 'monitor';
  area: UserAppReadinessCheckArea;
  message: string;
}

export interface UserAppReadinessReport {
  schemaVersion: typeof USER_APP_READINESS_SCHEMA_VERSION;
  status: UserAppReadinessStatus;
  createdAt: string;
  checks: UserAppReadinessCheck[];
  issues: UserAppReadinessIssue[];
  recommendations: UserAppReadinessRecommendation[];
  summary: string;
  gateLabel: string;
  localOnly: true;
  deterministic: true;
  productionApp: false;
  usesBackend: false;
  usesCamera: false;
  usesAr: false;
  usesTraining: false;
  usesExternalApi: false;
}

export interface CreateUserAppReadinessReportInput {
  packageData?: UserAppTemplatePackage | null;
  shellViewModel?: UserAppShellViewModel;
  onboarding?: UserOnboardingState | null;
  preferences?: UserLocalPreferences | null;
  discoveryState?: UserTemplateDiscoveryState | null;
  session?: UserAppSessionState | null;
  mobileQaResult?: UserAppMobileQaResult | null;
  createdAt?: string;
}

const READINESS_CREATED_AT = '2026-01-01T00:00:00.000Z';

const issue = (input: Omit<UserAppReadinessIssue, 'issueId'>): UserAppReadinessIssue => ({
  ...input,
  issueId: `${input.checkId}-${input.severity}`,
});

const check = (
  input: Omit<UserAppReadinessCheck, 'deterministic'>,
): UserAppReadinessCheck => ({
  ...input,
  deterministic: true,
});

const uniqueStrings = (items: readonly string[]): string[] => Array.from(new Set(items));

const statusFromIssues = (
  issues: readonly UserAppReadinessIssue[],
): UserAppReadinessCheck['status'] => {
  if (issues.some((item) => item.severity === 'blocking')) {
    return 'blocked';
  }

  if (issues.length > 0) {
    return 'warning';
  }

  return 'passed';
};

const issuesFromMessages = (input: {
  checkId: string;
  area: UserAppReadinessCheckArea;
  severity: 'warning' | 'blocking';
  messages: readonly string[];
  recommendation: string;
}): UserAppReadinessIssue[] =>
  uniqueStrings(input.messages).map((message) =>
    issue({
      checkId: input.checkId,
      area: input.area,
      severity: input.severity,
      message,
      recommendation: input.recommendation,
    }),
  );

export const validateUserAppReadinessBoundary = (
  value: unknown,
): UserAppReadinessIssue[] => [
  ...validateNoRuntimeOnlyReferences(value).map((message) =>
    issue({
      checkId: 'privacy-boundary',
      area: 'privacy',
      severity: 'blocking',
      message,
      recommendation: '移除 object URL、本地绝对路径、大图 bytes 或 React runtime 字段后再进入 App 门禁。',
    }),
  ),
  ...createSessionBoundaryWarnings(value).map((privacyIssue) =>
    issue({
      checkId: 'privacy-boundary',
      area: 'privacy',
      severity: 'blocking',
      message: privacyIssue.message,
      recommendation: 'User App readiness 输入只能包含本地轻量状态和 contract 数据。',
    }),
  ),
];

const createTemplatePackageCheck = (input: {
  packageData?: UserAppTemplatePackage | null;
  viewModel: UserAppShellViewModel;
}): UserAppReadinessCheck => {
  if (!input.packageData) {
    const issues = issuesFromMessages({
      checkId: 'template-package',
      area: 'template_package',
      severity: 'blocking',
      messages: ['尚未加载 UserAppTemplatePackage。'],
      recommendation: '先从已发布的本地消费包加载有效 UserAppTemplatePackage。',
    });

    return check({
      checkId: 'template-package',
      area: 'template_package',
      label: '模板包',
      status: 'blocked',
      required: true,
      summary: '没有模板包，不能进入用户 App 原型验收。',
      evidence: ['packageData 为空。'],
      issues,
      recommendation: '先导入有效模板包。',
    });
  }

  const validation = validateUserAppTemplatePackage(input.packageData);
  const runtimeIssues = validateNoRuntimeOnlyReferences(input.packageData);
  const issues = [
    ...issuesFromMessages({
      checkId: 'template-package',
      area: 'template_package',
      severity: 'blocking',
      messages: [...validation.blockingIssues, ...runtimeIssues],
      recommendation: '修复 contract blocking issue，并移除 runtime-only 引用。',
    }),
    ...issuesFromMessages({
      checkId: 'template-package',
      area: 'template_package',
      severity: 'warning',
      messages: validation.warnings,
      recommendation: '保留 warning 文案，同时补齐模板包质量信息。',
    }),
  ];

  return check({
    checkId: 'template-package',
    area: 'template_package',
    label: '模板包',
    status: statusFromIssues(issues),
    required: true,
    summary: `${input.viewModel.packageSummary.templateCount} 个模板 / ${input.viewModel.packageSummary.totalSteps} 个步骤。`,
    evidence: [
      `packageId: ${input.packageData.packageId}`,
      `compatibilityTarget: ${input.packageData.compatibilityTarget}`,
      `onlinePublished: ${String(input.packageData.onlinePublished)}`,
    ],
    issues,
    recommendation: '模板包必须只包含本地消费 contract 数据，不能包含临时资源或生产 App 状态。',
  });
};

const createStepGuidanceCheck = (
  viewModel: UserAppShellViewModel,
): UserAppReadinessCheck => {
  const messages = [
    ...viewModel.compatibility.blockingIssues,
    ...(viewModel.selectedTemplate?.blockingIssues ?? []),
  ];
  const warnings = [
    ...viewModel.compatibility.warnings,
    ...(viewModel.selectedTemplate?.warnings ?? []),
  ];
  const issues = [
    ...issuesFromMessages({
      checkId: 'step-guidance',
      area: 'step_guidance',
      severity: 'blocking',
      messages,
      recommendation: '步骤指导必须有可用模板、有效步骤、区域说明和工具/产品引用。',
    }),
    ...issuesFromMessages({
      checkId: 'step-guidance',
      area: 'step_guidance',
      severity: 'warning',
      messages: warnings,
      recommendation: 'warning 可继续预览，但必须持续展示给 QA 和用户。',
    }),
  ];

  return check({
    checkId: 'step-guidance',
    area: 'step_guidance',
    label: '步骤指导',
    status: statusFromIssues(issues),
    required: true,
    summary: viewModel.compatibility.canEnterStepGuide
      ? '当前模板可以进入本地步骤指导。'
      : '当前模板不能进入步骤指导，需要先处理阻断项。',
    evidence: [
      `canEnterStepGuide: ${String(viewModel.compatibility.canEnterStepGuide)}`,
      `selectedTemplateId: ${viewModel.selection.selectedTemplateId ?? 'none'}`,
      `emptyStates: ${viewModel.emptyStates.join(', ') || 'none'}`,
    ],
    issues,
    recommendation: 'App readiness gate 不能绕过 step guidance blocking issue。',
  });
};

const createOnboardingCheck = (
  onboarding: UserOnboardingState,
): UserAppReadinessCheck => {
  const validationIssues = validateOnboardingState(onboarding);
  const issues = issuesFromMessages({
    checkId: 'onboarding',
    area: 'onboarding',
    severity: 'blocking',
    messages: validationIssues.map((item) => item.message),
    recommendation: '修复本地 onboarding 状态边界，确保不含照片、敏感资料或训练输入。',
  });
  const optionalWarning =
    onboarding.status === 'not_started'
      ? [
          issue({
            checkId: 'onboarding',
            area: 'onboarding',
            severity: 'warning',
            message: 'Onboarding 仍未开始；可以使用默认偏好，但 App 原型 QA 需要看到说明。',
            recommendation: '在空状态中说明 onboarding 可跳过，默认偏好仍可工作。',
          }),
        ]
      : [];

  return check({
    checkId: 'onboarding',
    area: 'onboarding',
    label: '本地引导',
    status: statusFromIssues([...issues, ...optionalWarning]),
    required: false,
    summary: `onboarding: ${onboarding.status} / ${onboarding.progress.progressPercent}%`,
    evidence: [
      `currentStep: ${onboarding.currentStep}`,
      `localOnly: ${String(onboarding.localOnly)}`,
      `writesTrainingInput: ${String(onboarding.writesTrainingInput)}`,
    ],
    issues: [...issues, ...optionalWarning],
    recommendation: 'Onboarding 只能作为本地可跳过引导，不能成为账号系统或画像收集。',
  });
};

const createPreferencesCheck = (
  preferences: UserLocalPreferences,
): UserAppReadinessCheck => {
  const validationIssues = validateUserLocalPreferences(preferences);
  const issues = issuesFromMessages({
    checkId: 'preferences',
    area: 'preferences',
    severity: 'blocking',
    messages: validationIssues.map((item) => item.message),
    recommendation: '偏好只能作为本地非敏感显示提示，不能写入模板、训练数据或 project-state。',
  });

  return check({
    checkId: 'preferences',
    area: 'preferences',
    label: '本地偏好',
    status: statusFromIssues(issues),
    required: true,
    summary: `${preferences.skillLevel} / ${preferences.guidanceVerbosity} / ${preferences.availableTime}`,
    evidence: [
      `preferenceId: ${preferences.preferenceId}`,
      `tools: ${preferences.availableTools.join(', ') || 'none'}`,
      `styles: ${preferences.preferredStyleTags.join(', ') || 'none'}`,
    ],
    issues,
    recommendation: '偏好只影响文案提示，不改变 UserAppTemplatePackage。',
  });
};

const createDiscoveryCheck = (input: {
  packageData?: UserAppTemplatePackage | null;
  discoveryState: UserTemplateDiscoveryState;
}): UserAppReadinessCheck => {
  const validationIssues = validateTemplateDiscoveryState(input.discoveryState);
  const results = filterTemplatesForDiscovery({
    packageData: input.packageData,
    state: input.discoveryState,
  });
  const issues = issuesFromMessages({
    checkId: 'discovery',
    area: 'discovery',
    severity: 'blocking',
    messages: validationIssues.map((item) => item.message),
    recommendation: '修复 discovery 本地筛选状态，确保不写 project-state、不训练、不改模板。',
  });
  const warningIssues =
    input.packageData && results.length === 0
      ? [
          issue({
            checkId: 'discovery',
            area: 'discovery',
            severity: 'warning',
            message: '当前筛选没有可见模板，需要展示清晰空状态。',
            recommendation: '保留“重置筛选/查看不可用原因”的空状态引导。',
          }),
        ]
      : [];

  return check({
    checkId: 'discovery',
    area: 'discovery',
    label: '发现与推荐占位',
    status: statusFromIssues([...issues, ...warningIssues]),
    required: true,
    summary: `当前筛选可见 ${results.length} 个模板。`,
    evidence: [
      `sortMode: ${input.discoveryState.sortMode}`,
      `preferredStyleTags: ${input.discoveryState.preferredStyleTags.join(', ') || 'none'}`,
      `writesProjectState: ${String(input.discoveryState.writesProjectState)}`,
    ],
    issues: [...issues, ...warningIssues],
    recommendation: '发现和推荐必须保持 local-only、rule-based、explainable。',
  });
};

const createSessionCheck = (input: {
  session: UserAppSessionState;
  packageData?: UserAppTemplatePackage | null;
}): UserAppReadinessCheck => {
  const validationIssues = validateUserAppSession(input.session, input.packageData);
  const issues = issuesFromMessages({
    checkId: 'session-persistence',
    area: 'session_persistence',
    severity: 'blocking',
    messages: validationIssues.map((item) => item.message),
    recommendation: '修复本地 session payload，只保存允许的轻量状态。',
  });

  return check({
    checkId: 'session-persistence',
    area: 'session_persistence',
    label: '本地会话',
    status: statusFromIssues(issues),
    required: true,
    summary: `${input.session.status} / ${input.session.scope}`,
    evidence: [
      `schemaVersion: ${input.session.schemaVersion}`,
      `lastVisitedSection: ${input.session.lastVisitedSection}`,
      `containsUserPhoto: ${String(input.session.containsUserPhoto)}`,
      `writesTrainingInput: ${String(input.session.writesTrainingInput)}`,
    ],
    issues,
    recommendation: 'Session 只能保存模板 id、步骤 id、进度、偏好和筛选，不保存照片或用户记录。',
  });
};

const createPrivacyCheck = (
  boundaryIssues: readonly UserAppReadinessIssue[],
): UserAppReadinessCheck => {
  const issues = boundaryIssues.map((item) => ({
    ...item,
    checkId: 'privacy-boundary',
    area: 'privacy' as const,
  }));

  return check({
    checkId: 'privacy-boundary',
    area: 'privacy',
    label: '隐私与边界',
    status: statusFromIssues(issues),
    required: true,
    summary:
      issues.length === 0
        ? '未发现 object URL、base64、照片 bytes、本地路径、生物识别或训练输入。'
        : '发现用户侧 readiness 输入边界问题。',
    evidence: [
      '不调用 OpenAI API。',
      '不启用相机、上传、AR、训练或后端。',
      `blockingIssues: ${issues.length}`,
    ],
    issues,
    recommendation: 'App readiness 只检查本地 shell 能否进入原型，不产生生产用户数据。',
  });
};

const createMobileInteractionCheck = (
  mobileQaResult: UserAppMobileQaResult,
): UserAppReadinessCheck => {
  const issues = mobileQaResult.issues.map((mobileIssue) =>
    issue({
      checkId: 'mobile-interaction',
      area: 'mobile_interaction',
      severity: mobileIssue.severity,
      message: mobileIssue.message,
      recommendation: mobileIssue.recommendation,
    }),
  );

  return check({
    checkId: 'mobile-interaction',
    area: 'mobile_interaction',
    label: '移动端交互 QA',
    status: statusFromIssues(issues),
    required: true,
    summary: mobileQaResult.summary,
    evidence: [
      `mobileQaStatus: ${mobileQaResult.status}`,
      `checks: ${mobileQaResult.checks.length}`,
      `viewportProfiles: ${mobileQaResult.viewportProfiles.length}`,
    ],
    issues,
    recommendation: '移动端 QA 是进入 App 原型前的门禁，不代表真实 iOS 或生产发布。',
  });
};

const createEmptyStateCheck = (
  viewModel: UserAppShellViewModel,
): UserAppReadinessCheck => {
  const hasEmptyStates = viewModel.emptyStates.length > 0 || !viewModel.hasPackage;
  const warningIssues = hasEmptyStates
    ? [
        issue({
          checkId: 'empty-state',
          area: 'empty_state',
          severity: 'warning',
          message: `当前存在空状态：${viewModel.emptyStates.join(', ') || 'no-package'}`,
          recommendation: '空状态需要明确告诉 QA：先导入有效模板包、选择模板或重置筛选。',
        }),
      ]
    : [];

  return check({
    checkId: 'empty-state',
    area: 'empty_state',
    label: '空状态',
    status: statusFromIssues(warningIssues),
    required: false,
    summary: hasEmptyStates ? '存在需要展示的空状态。' : '当前主流程没有空状态阻断。',
    evidence: [`emptyStates: ${viewModel.emptyStates.join(', ') || 'none'}`],
    issues: warningIssues,
    recommendation: '空状态是 QA 必测路径，不能空白或只显示 raw JSON。',
  });
};

const createBlockedStateCheck = (
  viewModel: UserAppShellViewModel,
): UserAppReadinessCheck => {
  const blockingMessages = [
    ...viewModel.compatibility.blockingIssues,
    ...(viewModel.selectedTemplate?.blockingIssues ?? []),
  ];
  const issues = issuesFromMessages({
    checkId: 'blocked-state',
    area: 'blocked_state',
    severity: 'blocking',
    messages: blockingMessages,
    recommendation: '阻断状态必须展示原因，并禁止进入步骤指导。',
  });

  return check({
    checkId: 'blocked-state',
    area: 'blocked_state',
    label: '阻断状态',
    status: issues.length > 0 ? 'blocked' : 'passed',
    required: true,
    summary:
      issues.length > 0
        ? '当前存在阻断状态，需要先修复。'
        : '当前没有阻断状态；blocked 文案仍需通过 fixture 覆盖。',
    evidence: [
      `blockingIssues: ${blockingMessages.length}`,
      `canEnterStepGuide: ${String(viewModel.compatibility.canEnterStepGuide)}`,
    ],
    issues,
    recommendation: 'App readiness 不能通过忽略 blocked state 进入原型。',
  });
};

export const createReadinessRecommendations = (
  issues: readonly UserAppReadinessIssue[],
): UserAppReadinessRecommendation[] => {
  if (issues.length === 0) {
    return [
      {
        recommendationId: 'ready-monitor-mobile-regression',
        priority: 'monitor',
        area: 'mobile_interaction',
        message: '进入 App 原型前继续保留移动端窄屏回归检查。',
      },
    ];
  }

  return uniqueStrings(issues.map((item) => `${item.area}:${item.recommendation}`)).map(
    (entry, index): UserAppReadinessRecommendation => {
      const [area, message] = entry.split(':');
      const hasBlocking = issues.some(
        (item) => item.area === area && item.severity === 'blocking',
      );

      return {
        recommendationId: `readiness-recommendation-${index + 1}`,
        priority: hasBlocking ? 'must_fix' : 'should_fix',
        area: area as UserAppReadinessCheckArea,
        message,
      };
    },
  );
};

export const summarizeUserAppReadiness = (
  report: UserAppReadinessReport,
): string =>
  JSON.stringify({
    schemaVersion: report.schemaVersion,
    status: report.status,
    checks: report.checks.length,
    warnings: report.issues.filter((item) => item.severity === 'warning').length,
    blockingIssues: report.issues.filter((item) => item.severity === 'blocking').length,
    localOnly: report.localOnly,
    productionApp: report.productionApp,
    usesBackend: report.usesBackend,
    usesCamera: report.usesCamera,
    usesAr: report.usesAr,
    usesTraining: report.usesTraining,
  });

export const createUserAppReadinessReport = (
  input: CreateUserAppReadinessReportInput = {},
): UserAppReadinessReport => {
  const viewModel =
    input.shellViewModel ??
    createUserAppShellViewModel({
      packageData: input.packageData,
    });
  const onboarding = input.onboarding ?? createInitialUserOnboardingState();
  const preferences = input.preferences ?? createDefaultUserLocalPreferences();
  const discoveryState = input.discoveryState ?? createInitialTemplateDiscoveryState();
  const session = input.session ?? createInitialUserAppSession();
  const mobileQaResult =
    input.mobileQaResult ??
    evaluateMobileQaReadiness({
      hasPackage: viewModel.hasPackage,
      templateCount: viewModel.packageSummary.templateCount,
      canEnterStepGuide: viewModel.compatibility.canEnterStepGuide,
    });
  const boundaryIssues = validateUserAppReadinessBoundary({
    packageData: input.packageData,
    onboarding,
    preferences,
    discoveryState,
    session,
  });
  const checks = [
    createTemplatePackageCheck({ packageData: input.packageData, viewModel }),
    createStepGuidanceCheck(viewModel),
    createOnboardingCheck(onboarding),
    createPreferencesCheck(preferences),
    createDiscoveryCheck({ packageData: input.packageData, discoveryState }),
    createSessionCheck({ session, packageData: input.packageData }),
    createPrivacyCheck(boundaryIssues),
    createMobileInteractionCheck(mobileQaResult),
    createEmptyStateCheck(viewModel),
    createBlockedStateCheck(viewModel),
  ];
  const issues = checks.flatMap((item) => item.issues);
  const blockingCount = issues.filter((item) => item.severity === 'blocking').length;
  const warningCount = issues.filter((item) => item.severity === 'warning').length;
  const mobileHardeningNeeded = mobileQaResult.status === 'warning';
  const status: UserAppReadinessStatus =
    blockingCount > 0
      ? 'blocked'
      : mobileHardeningNeeded
        ? 'needs_qa_hardening'
        : warningCount > 0
          ? 'ready_with_warnings'
          : 'ready_for_app_prototype';

  return {
    schemaVersion: USER_APP_READINESS_SCHEMA_VERSION,
    status,
    createdAt: input.createdAt ?? READINESS_CREATED_AT,
    checks,
    issues,
    recommendations: createReadinessRecommendations(issues),
    summary:
      status === 'ready_for_app_prototype'
        ? 'User App MVP Shell 已通过本地 App 原型就绪门禁。'
        : status === 'ready_with_warnings'
          ? 'User App MVP Shell 可进入原型，但仍有提醒项需要跟踪。'
          : status === 'needs_qa_hardening'
            ? 'User App MVP Shell 需要移动端交互 QA 加固后再进入原型。'
            : 'User App MVP Shell 存在阻断项，不能进入 App 原型。',
    gateLabel:
      status === 'ready_for_app_prototype'
        ? '允许进入 App 原型'
        : status === 'ready_with_warnings'
          ? '带提醒进入 App 原型'
          : status === 'needs_qa_hardening'
            ? '需要 QA 加固'
            : '阻断',
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
