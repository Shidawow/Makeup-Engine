import type { UserAppMvpPolishReport } from './userAppMvpPolish';
import { createUserAppMvpPolishReport } from './userAppMvpPolish';
import type { UserAppPwaReadinessReport } from './userAppPwaReadiness';
import { createUserAppPwaReadinessReport } from './userAppPwaReadiness';
import type { UserAppTrialFeedbackForm } from './userAppTrialFeedback';
import { createUserAppTrialFeedbackForm } from './userAppTrialFeedback';
import type { UserAppTrialContentReadinessReport } from './userAppTrialContentReadiness';
import { createUserAppTrialContentReadinessReport } from './userAppTrialContentReadiness';
import type { UserAppTrialReadinessReport } from './userAppTrialReadiness';
import { createUserAppTrialReadinessReport } from './userAppTrialReadiness';
import type { UserAppTrialTemplateSelectionReport } from './userAppTrialTemplateSelection';

export const USER_APP_MVP_RELEASE_READINESS_SCHEMA_VERSION =
  'user-app-mvp-release-readiness-v0.1' as const;

export type UserAppMvpReleaseReadinessStatus =
  | 'ready_for_internal_user_trial'
  | 'ready_with_warnings'
  | 'blocked';

export type UserAppMvpReleaseReadinessArea =
  | 'technology_route'
  | 'pwa_mobile_shell'
  | 'pwa_manifest'
  | 'user_path'
  | 'privacy_local_boundary'
  | 'trial_pack'
  | 'feedback_form'
  | 'template_content_qa'
  | 'trial_template_selection'
  | 'browser_mobile_qa'
  | 'validation_status'
  | 'known_limitations'
  | 'production_non_goals';

export interface UserAppMvpReleaseReadinessIssue {
  issueId: string;
  checkId: string;
  area: UserAppMvpReleaseReadinessArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppMvpReleaseReadinessCheck {
  checkId: string;
  area: UserAppMvpReleaseReadinessArea;
  label: string;
  status: 'passed' | 'warning' | 'blocked';
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppMvpReleaseReadinessIssue[];
  deterministic: true;
}

export interface UserAppMvpReleaseReadinessRecommendation {
  recommendationId: string;
  priority: 'next' | 'warning' | 'blocker';
  message: string;
}

export interface CreateUserAppMvpReleaseReadinessReportInput {
  pwaReport?: UserAppPwaReadinessReport;
  mvpPolishReport?: UserAppMvpPolishReport;
  trialReadinessReport?: UserAppTrialReadinessReport;
  feedbackForm?: UserAppTrialFeedbackForm;
  trialContentReadinessReport?: UserAppTrialContentReadinessReport;
  trialTemplateSelectionReport?: UserAppTrialTemplateSelectionReport;
  technologyRouteDecided?: boolean;
  browserMobileQaPassed?: boolean;
  browserMobileQaSummary?: string;
  testsPassed?: boolean;
  knownLimitationsAccepted?: boolean;
  productionNonGoalsDocumented?: boolean;
  ordinaryUserPathReady?: boolean;
  ordinaryUserPathHidesAdminTerms?: boolean;
  privacyLocalOnlyCopyReady?: boolean;
  noUploadCopyReady?: boolean;
  noTrainingCopyReady?: boolean;
  noSensitiveDataCopyReady?: boolean;
  usesBackend?: boolean;
  usesCamera?: boolean;
  usesAr?: boolean;
  usesAnalytics?: boolean;
  callsOpenAiApi?: boolean;
  callsExternalApi?: boolean;
  writesTrainingInput?: boolean;
  writesProjectStateUserRecords?: boolean;
  mutatesTemplatePackage?: boolean;
  breaksUserAppTemplatePackageContract?: boolean;
  createdAt?: string;
}

export interface UserAppMvpReleaseReadinessReport {
  schemaVersion: typeof USER_APP_MVP_RELEASE_READINESS_SCHEMA_VERSION;
  status: UserAppMvpReleaseReadinessStatus;
  createdAt: string;
  checks: UserAppMvpReleaseReadinessCheck[];
  issues: UserAppMvpReleaseReadinessIssue[];
  recommendations: UserAppMvpReleaseReadinessRecommendation[];
  summary: string;
  nextRecommendedPhase: '9A' | '8E-1';
  nextRecommendedPhaseName: 'Internal Trial Operations Pack' | 'Release Readiness Fixes';
  readyForProductionRelease: false;
  readyForAppStoreRelease: false;
  readyForInternalUserTrial: boolean;
  localOnly: true;
  deterministic: true;
  productionApp: false;
  productionRelease: false;
  appStoreRelease: false;
  usesBackend: boolean;
  usesCamera: boolean;
  usesAr: boolean;
  usesAnalytics: boolean;
  callsOpenAiApi: boolean;
  callsExternalApi: boolean;
  writesTrainingInput: boolean;
  writesProjectStateUserRecords: boolean;
  mutatesTemplatePackage: boolean;
  breaksUserAppTemplatePackageContract: boolean;
}

const RELEASE_READINESS_CREATED_AT = '2026-01-01T00:00:00.000Z';

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 53);

const issue = (
  input: Omit<UserAppMvpReleaseReadinessIssue, 'issueId'>,
): UserAppMvpReleaseReadinessIssue => ({
  ...input,
  issueId: `mvp-release-readiness-${input.area}-${input.severity}-${Math.abs(
    hashText(input.message),
  )}`,
});

const check = (
  input: Omit<UserAppMvpReleaseReadinessCheck, 'deterministic'>,
): UserAppMvpReleaseReadinessCheck => ({
  ...input,
  deterministic: true,
});

const checkStatus = (
  issues: readonly UserAppMvpReleaseReadinessIssue[],
): UserAppMvpReleaseReadinessCheck['status'] => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'warning';
  return 'passed';
};

const reportStatus = (
  issues: readonly UserAppMvpReleaseReadinessIssue[],
): UserAppMvpReleaseReadinessStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.length > 0) return 'ready_with_warnings';
  return 'ready_for_internal_user_trial';
};

const booleanIssue = (input: {
  passed: boolean;
  checkId: string;
  area: UserAppMvpReleaseReadinessArea;
  severity?: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}): UserAppMvpReleaseReadinessIssue[] =>
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

const statusIssue = (input: {
  passed: boolean;
  warning: boolean;
  checkId: string;
  area: UserAppMvpReleaseReadinessArea;
  blockedMessage: string;
  warningMessage: string;
  recommendation: string;
}): UserAppMvpReleaseReadinessIssue[] => {
  if (!input.passed) {
    return [
      issue({
        checkId: input.checkId,
        area: input.area,
        severity: 'blocking',
        message: input.blockedMessage,
        recommendation: input.recommendation,
      }),
    ];
  }
  if (input.warning) {
    return [
      issue({
        checkId: input.checkId,
        area: input.area,
        severity: 'warning',
        message: input.warningMessage,
        recommendation: input.recommendation,
      }),
    ];
  }
  return [];
};

const boundaryIssues = (
  input: Required<
    Pick<
      CreateUserAppMvpReleaseReadinessReportInput,
      | 'usesBackend'
      | 'usesCamera'
      | 'usesAr'
      | 'usesAnalytics'
      | 'callsOpenAiApi'
      | 'callsExternalApi'
      | 'writesTrainingInput'
      | 'writesProjectStateUserRecords'
      | 'mutatesTemplatePackage'
      | 'breaksUserAppTemplatePackageContract'
    >
  >,
): UserAppMvpReleaseReadinessIssue[] => [
  ...booleanIssue({
    passed: !input.usesBackend && !input.usesAnalytics,
    checkId: 'privacy-local-boundary',
    area: 'privacy_local_boundary',
    message: '8E 不能把 MVP gate 接成后端或 analytics 流程。',
    recommendation: '保持 release readiness 为本地管理员报告，不接服务端或埋点。',
  }),
  ...booleanIssue({
    passed: !input.usesCamera && !input.usesAr,
    checkId: 'privacy-local-boundary',
    area: 'privacy_local_boundary',
    message: '8E 不能启用相机或 AR。',
    recommendation: '照片、相机和 AR 仍保持暂未启用占位。',
  }),
  ...booleanIssue({
    passed: !input.callsOpenAiApi && !input.callsExternalApi,
    checkId: 'privacy-local-boundary',
    area: 'privacy_local_boundary',
    message: '8E 不能调用 OpenAI 或外部 API。',
    recommendation: 'readiness 和 go/no-go 必须 deterministic/local-only。',
  }),
  ...booleanIssue({
    passed: !input.writesTrainingInput && !input.writesProjectStateUserRecords,
    checkId: 'privacy-local-boundary',
    area: 'privacy_local_boundary',
    message: '8E 不能写训练输入或真实用户 trial records。',
    recommendation: 'project-state 只能记录阶段状态和验证结果。',
  }),
  ...booleanIssue({
    passed: !input.mutatesTemplatePackage && !input.breaksUserAppTemplatePackageContract,
    checkId: 'privacy-local-boundary',
    area: 'privacy_local_boundary',
    message: '8E 不能修改或破坏 UserAppTemplatePackage contract。',
    recommendation: 'release gate 只能读取既有 readiness evidence。',
  }),
];

export const createUserAppMvpReleaseReadinessReport = (
  input: CreateUserAppMvpReleaseReadinessReportInput = {},
): UserAppMvpReleaseReadinessReport => {
  const pwaReport = input.pwaReport ?? createUserAppPwaReadinessReport();
  const mvpPolishReport = input.mvpPolishReport ?? createUserAppMvpPolishReport({ pwaReport });
  const feedbackForm = input.feedbackForm ?? createUserAppTrialFeedbackForm();
  const trialReadinessReport =
    input.trialReadinessReport ??
    createUserAppTrialReadinessReport({
      feedbackForm,
      pwaReport,
      mvpPolishReport,
      hasPrivacyLocalOnlyCopy: true,
      hasNoUploadCopy: true,
      hasNoTrainingCopy: true,
      hasNoSensitiveDataCopy: true,
      hasUserPathReady: true,
      hasAdminQaSeparation: true,
    });
  const trialContentReadinessReport =
    input.trialContentReadinessReport ??
    createUserAppTrialContentReadinessReport({
      trialReadinessReport,
      feedbackForm,
      hasPrivacyBoundaryCopy: true,
    });
  const trialTemplateSelectionReport =
    input.trialTemplateSelectionReport ?? {
      status: trialContentReadinessReport.templateSelectionStatus,
      trialReadyTemplates: trialContentReadinessReport.trialReadyTemplateIds.map((templateId) => ({
        templateId,
        title: templateId,
        qaStatus: 'trial_ready' as const,
        difficulty: 'easy' as const,
        estimatedDurationMinutes: 8,
        styleTags: ['trial-ready'],
        reasons: ['from trial content readiness'],
        warnings: [],
      })),
      backupTemplates: [],
      blockedTemplates: [],
      coverage: {
        hasBeginnerFriendlyTemplate: trialContentReadinessReport.trialReadyTemplateIds.length > 0,
        hasShortDurationTemplate: trialContentReadinessReport.trialReadyTemplateIds.length > 0,
        hasNaturalDailyTemplate: trialContentReadinessReport.trialReadyTemplateIds.length > 0,
      },
    };

  const technologyRouteIssues = booleanIssue({
    passed: input.technologyRouteDecided ?? true,
    checkId: 'technology-route-decision',
    area: 'technology_route',
    message: '8A React Web / PWA MVP first 路线尚未确认。',
    recommendation: '先完成路线决策，不能在 gate 中临时切换到 native/backend/camera 范围。',
  });

  const pwaMobileIssues = statusIssue({
    passed: mvpPolishReport.status !== 'blocked',
    warning: mvpPolishReport.status === 'warning',
    checkId: 'pwa-mobile-shell-readiness',
    area: 'pwa_mobile_shell',
    blockedMessage: '8B PWA/mobile shell polish 有阻断项。',
    warningMessage: '8B PWA/mobile shell polish 有 warning。',
    recommendation: '修复移动首页、触控步骤、隐私文案或管理员分离问题。',
  });

  const pwaManifestIssues = statusIssue({
    passed: pwaReport.status !== 'blocked',
    warning: pwaReport.status === 'warning',
    checkId: 'pwa-manifest-readiness',
    area: 'pwa_manifest',
    blockedMessage: 'PWA manifest readiness 有阻断项。',
    warningMessage: 'PWA manifest readiness 有 warning。',
    recommendation: '保留轻量 manifest metadata，但不要添加 service worker 或离线能力。',
  });

  const userPathIssues = [
    ...booleanIssue({
      passed: input.ordinaryUserPathReady ?? true,
      checkId: 'ordinary-user-path-readiness',
      area: 'user_path',
      message: '普通用户路径尚不适合内部试用。',
      recommendation: '跟练、发现妆容、准备、偏好、本地进度和隐私说明必须保持可用。',
    }),
    ...booleanIssue({
      passed: input.ordinaryUserPathHidesAdminTerms ?? true,
      checkId: 'ordinary-user-path-readiness',
      area: 'user_path',
      message: '普通用户路径暴露 release gate / QA / contract 等管理员术语。',
      recommendation: '普通用户路径只使用妆容、跟练、本地进度、隐私说明等产品文案。',
    }),
  ];

  const privacyCopyIssues = [
    ...booleanIssue({
      passed: input.privacyLocalOnlyCopyReady ?? true,
      checkId: 'privacy-copy-and-boundary',
      area: 'privacy_local_boundary',
      message: '缺少本地-only 隐私文案。',
      recommendation: '内部试用前必须说明当前只在本地使用。',
    }),
    ...booleanIssue({
      passed: input.noUploadCopyReady ?? true,
      checkId: 'privacy-copy-and-boundary',
      area: 'privacy_local_boundary',
      message: '缺少不上传说明。',
      recommendation: '内部试用前必须说明不上传照片或个人数据。',
    }),
    ...booleanIssue({
      passed: input.noTrainingCopyReady ?? true,
      checkId: 'privacy-copy-and-boundary',
      area: 'privacy_local_boundary',
      message: '缺少不训练说明。',
      recommendation: '内部试用前必须说明试用反馈和本地状态不会进入训练数据。',
    }),
    ...booleanIssue({
      passed: input.noSensitiveDataCopyReady ?? true,
      checkId: 'privacy-copy-and-boundary',
      area: 'privacy_local_boundary',
      message: '缺少不收集敏感信息说明。',
      recommendation: '明确不要收集真实姓名、联系方式、照片、健康或敏感身份信息。',
    }),
    ...boundaryIssues({
      usesBackend: Boolean(input.usesBackend),
      usesCamera: Boolean(input.usesCamera),
      usesAr: Boolean(input.usesAr),
      usesAnalytics: Boolean(input.usesAnalytics),
      callsOpenAiApi: Boolean(input.callsOpenAiApi),
      callsExternalApi: Boolean(input.callsExternalApi),
      writesTrainingInput: Boolean(input.writesTrainingInput),
      writesProjectStateUserRecords: Boolean(input.writesProjectStateUserRecords),
      mutatesTemplatePackage: Boolean(input.mutatesTemplatePackage),
      breaksUserAppTemplatePackageContract: Boolean(input.breaksUserAppTemplatePackageContract),
    }),
  ];

  const trialPackIssues = statusIssue({
    passed: trialReadinessReport.status !== 'blocked',
    warning: trialReadinessReport.status === 'ready_with_warnings',
    checkId: 'trial-pack-readiness',
    area: 'trial_pack',
    blockedMessage: '8C trial pack readiness 被阻断。',
    warningMessage: '8C trial pack readiness 有 warning。',
    recommendation: '补齐试用任务、反馈结构、隐私说明和管理员分离。',
  });

  const feedbackIssues = statusIssue({
    passed: feedbackForm.status !== 'blocked',
    warning: feedbackForm.status === 'warning',
    checkId: 'feedback-form-readiness',
    area: 'feedback_form',
    blockedMessage: '反馈表隐私或结构不安全。',
    warningMessage: '反馈表仍有 warning。',
    recommendation: '反馈表不能收集真实姓名、联系方式、照片、健康、敏感身份或训练数据。',
  });

  const contentIssues = statusIssue({
    passed: trialContentReadinessReport.status !== 'blocked',
    warning: trialContentReadinessReport.status === 'ready_with_warnings',
    checkId: 'template-content-readiness',
    area: 'template_content_qa',
    blockedMessage: '8D trial content readiness 被阻断。',
    warningMessage: '8D trial content readiness 有 warning。',
    recommendation: '修复内容 QA、模板选择、隐私或本地边界阻断项。',
  });

  const selectionIssues = [
    ...statusIssue({
      passed: trialTemplateSelectionReport.status !== 'blocked',
      warning: trialTemplateSelectionReport.status === 'ready_with_warnings',
      checkId: 'trial-template-selection-readiness',
      area: 'trial_template_selection',
      blockedMessage: '试用模板选择被阻断。',
      warningMessage: '试用模板选择仍有 warning。',
      recommendation: '核心集合必须包含 beginner-friendly、short-duration、natural/daily 覆盖。',
    }),
    ...booleanIssue({
      passed: trialTemplateSelectionReport.trialReadyTemplates.length > 0,
      checkId: 'trial-template-selection-readiness',
      area: 'trial_template_selection',
      message: '没有 trial-ready 模板。',
      recommendation: '至少保留一个通过内容 QA 的核心试用模板。',
    }),
  ];

  const browserQaIssues = booleanIssue({
    passed: input.browserMobileQaPassed ?? true,
    checkId: 'browser-mobile-qa-readiness',
    area: 'browser_mobile_qa',
    message: 'browser/mobile QA evidence 未通过。',
    recommendation: '先恢复本地 HTTP smoke、中文文案、隐私文案和 forbidden-token 检查。',
  });

  const validationIssues = booleanIssue({
    passed: input.testsPassed ?? true,
    checkId: 'validation-status',
    area: 'validation_status',
    message: '测试或项目验证未通过。',
    recommendation: '先通过 typecheck、tests、build、project status 和 context pack。',
  });

  const knownLimitationIssues = booleanIssue({
    passed: input.knownLimitationsAccepted ?? true,
    checkId: 'known-limitations-accepted',
    area: 'known_limitations',
    severity: 'warning',
    message: '已知限制尚未被明确接受。',
    recommendation: '内部试用前必须接受当前没有生产 app、backend、camera、AR、training 等限制。',
  });

  const productionNonGoalIssues = booleanIssue({
    passed: input.productionNonGoalsDocumented ?? true,
    checkId: 'production-non-goals-documented',
    area: 'production_non_goals',
    message: '生产发布 non-goals 尚未明确记录。',
    recommendation: '必须说明 ready_for_internal_user_trial 不等于 production ready。',
  });

  const checks = [
    check({
      checkId: 'technology-route-decision',
      area: 'technology_route',
      label: '8A 技术路线',
      status: checkStatus(technologyRouteIssues),
      required: true,
      summary: 'React Web / PWA MVP first 路线已作为内部试用前提。',
      evidence: [`technologyRouteDecided: ${String(input.technologyRouteDecided ?? true)}`],
      issues: technologyRouteIssues,
    }),
    check({
      checkId: 'pwa-mobile-shell-readiness',
      area: 'pwa_mobile_shell',
      label: '8B Mobile Web Shell',
      status: checkStatus(pwaMobileIssues),
      required: true,
      summary: mvpPolishReport.summary,
      evidence: [`mvpPolishStatus: ${mvpPolishReport.status}`],
      issues: pwaMobileIssues,
    }),
    check({
      checkId: 'pwa-manifest-readiness',
      area: 'pwa_manifest',
      label: 'PWA manifest 骨架',
      status: checkStatus(pwaManifestIssues),
      required: true,
      summary: pwaReport.summary,
      evidence: [`pwaStatus: ${pwaReport.status}`],
      issues: pwaManifestIssues,
    }),
    check({
      checkId: 'ordinary-user-path-readiness',
      area: 'user_path',
      label: '普通用户路径',
      status: checkStatus(userPathIssues),
      required: true,
      summary: '跟练、发现、准备、偏好、本地进度和隐私说明应保持主路径清晰。',
      evidence: [
        `ordinaryUserPathReady: ${String(input.ordinaryUserPathReady ?? true)}`,
        `hidesAdminTerms: ${String(input.ordinaryUserPathHidesAdminTerms ?? true)}`,
      ],
      issues: userPathIssues,
    }),
    check({
      checkId: 'privacy-copy-and-boundary',
      area: 'privacy_local_boundary',
      label: '隐私与本地边界',
      status: checkStatus(privacyCopyIssues),
      required: true,
      summary: '本地-only、不上传、不训练、不收集照片或敏感信息。',
      evidence: [
        `localOnlyCopy: ${String(input.privacyLocalOnlyCopyReady ?? true)}`,
        `noUploadCopy: ${String(input.noUploadCopyReady ?? true)}`,
        `noTrainingCopy: ${String(input.noTrainingCopyReady ?? true)}`,
      ],
      issues: privacyCopyIssues,
    }),
    check({
      checkId: 'trial-pack-readiness',
      area: 'trial_pack',
      label: '8C 试用包',
      status: checkStatus(trialPackIssues),
      required: true,
      summary: trialReadinessReport.summary,
      evidence: [`trialReadinessStatus: ${trialReadinessReport.status}`],
      issues: trialPackIssues,
    }),
    check({
      checkId: 'feedback-form-readiness',
      area: 'feedback_form',
      label: '反馈表',
      status: checkStatus(feedbackIssues),
      required: true,
      summary: `feedbackFormStatus: ${feedbackForm.status}`,
      evidence: [`questionCount: ${feedbackForm.questions.length}`],
      issues: feedbackIssues,
    }),
    check({
      checkId: 'template-content-readiness',
      area: 'template_content_qa',
      label: '8D 内容 QA',
      status: checkStatus(contentIssues),
      required: true,
      summary: trialContentReadinessReport.summary,
      evidence: [`trialContentStatus: ${trialContentReadinessReport.status}`],
      issues: contentIssues,
    }),
    check({
      checkId: 'trial-template-selection-readiness',
      area: 'trial_template_selection',
      label: '试用模板选择',
      status: checkStatus(selectionIssues),
      required: true,
      summary: `${trialTemplateSelectionReport.trialReadyTemplates.length} trial-ready templates`,
      evidence: [
        `selectionStatus: ${trialTemplateSelectionReport.status}`,
        `trialReady: ${trialTemplateSelectionReport.trialReadyTemplates.length}`,
      ],
      issues: selectionIssues,
    }),
    check({
      checkId: 'browser-mobile-qa-readiness',
      area: 'browser_mobile_qa',
      label: 'Browser / Mobile QA',
      status: checkStatus(browserQaIssues),
      required: true,
      summary: input.browserMobileQaSummary ?? 'Phase 7H/8B browser/mobile QA evidence accepted.',
      evidence: [`browserMobileQaPassed: ${String(input.browserMobileQaPassed ?? true)}`],
      issues: browserQaIssues,
    }),
    check({
      checkId: 'validation-status',
      area: 'validation_status',
      label: '测试与验证',
      status: checkStatus(validationIssues),
      required: true,
      summary: 'typecheck、tests、build、project status 和 context pack 必须通过。',
      evidence: [`testsPassed: ${String(input.testsPassed ?? true)}`],
      issues: validationIssues,
    }),
    check({
      checkId: 'known-limitations-accepted',
      area: 'known_limitations',
      label: '已知限制接受',
      status: checkStatus(knownLimitationIssues),
      required: true,
      summary: '当前限制不阻止内部小范围试用，但阻止正式生产发布。',
      evidence: [`knownLimitationsAccepted: ${String(input.knownLimitationsAccepted ?? true)}`],
      issues: knownLimitationIssues,
    }),
    check({
      checkId: 'production-non-goals-documented',
      area: 'production_non_goals',
      label: '生产 non-goals',
      status: checkStatus(productionNonGoalIssues),
      required: true,
      summary: 'ready_for_internal_user_trial 不等于 production ready。',
      evidence: [
        `productionNonGoalsDocumented: ${String(input.productionNonGoalsDocumented ?? true)}`,
      ],
      issues: productionNonGoalIssues,
    }),
  ];

  const issues = checks.flatMap((item) => item.issues);
  const status = reportStatus(issues);
  const recommendations: UserAppMvpReleaseReadinessRecommendation[] =
    status === 'blocked'
      ? [
          {
            recommendationId: 'fix-blockers-before-trial',
            priority: 'blocker',
            message: '先进入 Phase 8E-1 修复 release readiness 阻断项，不能进入内部试用准备。',
          },
        ]
      : status === 'ready_with_warnings'
        ? [
            {
              recommendationId: 'prepare-internal-trial-with-warning-log',
              priority: 'warning',
              message: '可以进入 Phase 9A，但试用运营包必须显式记录 warning 和备用模板限制。',
            },
          ]
        : [
            {
              recommendationId: 'prepare-internal-trial-operations',
              priority: 'next',
              message: '可以进入 Phase 9A Internal Trial Operations Pack，准备内部小范围试用运营材料。',
            },
          ];

  return {
    schemaVersion: USER_APP_MVP_RELEASE_READINESS_SCHEMA_VERSION,
    status,
    createdAt: input.createdAt ?? RELEASE_READINESS_CREATED_AT,
    checks,
    issues,
    recommendations,
    summary:
      status === 'blocked'
        ? 'MVP release readiness 被阻断，不能进入内部小范围真实用户试用准备。'
        : status === 'ready_with_warnings'
          ? 'MVP 可以进入内部小范围试用准备，但必须带 warning 清单。'
          : 'MVP 可以进入内部小范围真实用户试用准备；这不是正式生产发布。',
    nextRecommendedPhase: status === 'blocked' ? '8E-1' : '9A',
    nextRecommendedPhaseName:
      status === 'blocked' ? 'Release Readiness Fixes' : 'Internal Trial Operations Pack',
    readyForProductionRelease: false,
    readyForAppStoreRelease: false,
    readyForInternalUserTrial: status !== 'blocked',
    localOnly: true,
    deterministic: true,
    productionApp: false,
    productionRelease: false,
    appStoreRelease: false,
    usesBackend: Boolean(input.usesBackend),
    usesCamera: Boolean(input.usesCamera),
    usesAr: Boolean(input.usesAr),
    usesAnalytics: Boolean(input.usesAnalytics),
    callsOpenAiApi: Boolean(input.callsOpenAiApi),
    callsExternalApi: Boolean(input.callsExternalApi),
    writesTrainingInput: Boolean(input.writesTrainingInput),
    writesProjectStateUserRecords: Boolean(input.writesProjectStateUserRecords),
    mutatesTemplatePackage: Boolean(input.mutatesTemplatePackage),
    breaksUserAppTemplatePackageContract: Boolean(input.breaksUserAppTemplatePackageContract),
  };
};

export const summarizeUserAppMvpReleaseReadiness = (
  report: UserAppMvpReleaseReadinessReport,
): string =>
  `${report.status}: ${report.checks.length} checks, ${report.issues.length} issues, next ${report.nextRecommendedPhase}.`;
