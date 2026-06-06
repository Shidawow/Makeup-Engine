import type { UserAppTrialFeedbackForm } from './userAppTrialFeedback';
import { createUserAppTrialFeedbackForm } from './userAppTrialFeedback';
import type { UserAppMvpReleaseReadinessReport } from './userAppMvpReleaseReadiness';
import { createUserAppMvpReleaseReadinessReport } from './userAppMvpReleaseReadiness';
import type { UserAppTrialContentReadinessReport } from './userAppTrialContentReadiness';
import type { UserAppTrialTemplateSelectionReport } from './userAppTrialTemplateSelection';

export const USER_APP_TRIAL_GO_NO_GO_SCHEMA_VERSION =
  'user-app-trial-go-no-go-v0.1' as const;

export type UserAppTrialGoNoGoResult =
  | 'go_for_internal_trial'
  | 'go_with_warnings'
  | 'no_go';

export type UserAppTrialGoNoGoArea =
  | 'phase_8a_route'
  | 'phase_8b_pwa_mobile'
  | 'phase_8c_trial_pack'
  | 'phase_8d_content_qa'
  | 'trial_template_selection'
  | 'feedback_privacy'
  | 'privacy_boundary'
  | 'user_copy'
  | 'test_validation'
  | 'known_limitations'
  | 'production_boundary'
  | 'contract_boundary';

export interface UserAppTrialGoNoGoIssue {
  issueId: string;
  signalId: string;
  area: UserAppTrialGoNoGoArea;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface UserAppTrialGoNoGoSignal {
  signalId: string;
  area: UserAppTrialGoNoGoArea;
  label: string;
  status: 'go' | 'warning' | 'no_go';
  required: boolean;
  summary: string;
  evidence: string[];
  issues: UserAppTrialGoNoGoIssue[];
  deterministic: true;
}

export interface UserAppTrialGoNoGoRecommendation {
  recommendationId: string;
  priority: 'go' | 'warning' | 'blocker';
  message: string;
}

export interface CreateUserAppTrialGoNoGoDecisionInput {
  releaseReadinessReport?: UserAppMvpReleaseReadinessReport;
  trialTemplateSelectionReport?: UserAppTrialTemplateSelectionReport;
  trialContentReadinessReport?: UserAppTrialContentReadinessReport;
  feedbackForm?: UserAppTrialFeedbackForm;
  testsPassed?: boolean;
  knownLimitationsDocumented?: boolean;
  ordinaryUserPathExposesInternalTerms?: boolean;
  hasBlockedContentQa?: boolean;
  productionNonGoalsViolated?: boolean;
  usesBackend?: boolean;
  usesCamera?: boolean;
  usesAr?: boolean;
  usesAnalytics?: boolean;
  callsOpenAiApi?: boolean;
  callsExternalApi?: boolean;
  writesTrainingInput?: boolean;
  writesProjectStateUserRecords?: boolean;
  userAppTemplatePackageContractBroken?: boolean;
  createdAt?: string;
}

export interface UserAppTrialGoNoGoDecision {
  schemaVersion: typeof USER_APP_TRIAL_GO_NO_GO_SCHEMA_VERSION;
  decision: UserAppTrialGoNoGoResult;
  createdAt: string;
  signals: UserAppTrialGoNoGoSignal[];
  issues: UserAppTrialGoNoGoIssue[];
  recommendations: UserAppTrialGoNoGoRecommendation[];
  summary: string;
  nextRecommendedPhase: '9A' | '8E-1';
  nextRecommendedPhaseName: 'Internal Trial Operations Pack' | 'Release Readiness Fixes';
  internalTrialOnly: true;
  productionRelease: false;
  appStoreRelease: false;
  localOnly: true;
  deterministic: true;
  usesBackend: boolean;
  usesCamera: boolean;
  usesAr: boolean;
  usesAnalytics: boolean;
  callsOpenAiApi: boolean;
  callsExternalApi: boolean;
  writesTrainingInput: boolean;
  writesProjectStateUserRecords: boolean;
  userAppTemplatePackageContractBroken: boolean;
}

const GO_NO_GO_CREATED_AT = '2026-01-01T00:00:00.000Z';

const hashText = (value: string): number =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 59);

const issue = (input: Omit<UserAppTrialGoNoGoIssue, 'issueId'>): UserAppTrialGoNoGoIssue => ({
  ...input,
  issueId: `trial-go-no-go-${input.area}-${input.severity}-${Math.abs(
    hashText(input.message),
  )}`,
});

const signal = (
  input: Omit<UserAppTrialGoNoGoSignal, 'deterministic'>,
): UserAppTrialGoNoGoSignal => ({
  ...input,
  deterministic: true,
});

const signalStatus = (
  issues: readonly UserAppTrialGoNoGoIssue[],
): UserAppTrialGoNoGoSignal['status'] => {
  if (issues.some((item) => item.severity === 'blocking')) return 'no_go';
  if (issues.length > 0) return 'warning';
  return 'go';
};

const decisionFromIssues = (
  issues: readonly UserAppTrialGoNoGoIssue[],
): UserAppTrialGoNoGoResult => {
  if (issues.some((item) => item.severity === 'blocking')) return 'no_go';
  if (issues.length > 0) return 'go_with_warnings';
  return 'go_for_internal_trial';
};

const booleanIssue = (input: {
  passed: boolean;
  signalId: string;
  area: UserAppTrialGoNoGoArea;
  severity?: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}): UserAppTrialGoNoGoIssue[] =>
  input.passed
    ? []
    : [
        issue({
          signalId: input.signalId,
          area: input.area,
          severity: input.severity ?? 'blocking',
          message: input.message,
          recommendation: input.recommendation,
        }),
      ];

const releaseStatusIssues = (
  report: UserAppMvpReleaseReadinessReport,
): UserAppTrialGoNoGoIssue[] => {
  if (report.status === 'blocked') {
    return [
      issue({
        signalId: 'mvp-release-readiness',
        area: 'phase_8b_pwa_mobile',
        severity: 'blocking',
        message: 'MVP release readiness gate 被阻断。',
        recommendation: '先修复 release readiness blocking issues。',
      }),
    ];
  }
  if (report.status === 'ready_with_warnings') {
    return [
      issue({
        signalId: 'mvp-release-readiness',
        area: 'phase_8b_pwa_mobile',
        severity: 'warning',
        message: 'MVP release readiness gate 有 warning。',
        recommendation: '可以进入内部试用准备，但运营包必须记录 warning。',
      }),
    ];
  }
  return [];
};

export const createUserAppTrialGoNoGoDecision = (
  input: CreateUserAppTrialGoNoGoDecisionInput = {},
): UserAppTrialGoNoGoDecision => {
  const feedbackForm = input.feedbackForm ?? createUserAppTrialFeedbackForm();
  const releaseReadinessReport =
    input.releaseReadinessReport ??
    createUserAppMvpReleaseReadinessReport({
      feedbackForm,
      trialContentReadinessReport: input.trialContentReadinessReport,
      trialTemplateSelectionReport: input.trialTemplateSelectionReport,
      testsPassed: input.testsPassed,
      knownLimitationsAccepted: input.knownLimitationsDocumented,
      ordinaryUserPathHidesAdminTerms: !input.ordinaryUserPathExposesInternalTerms,
      usesBackend: input.usesBackend,
      usesCamera: input.usesCamera,
      usesAr: input.usesAr,
      usesAnalytics: input.usesAnalytics,
      callsOpenAiApi: input.callsOpenAiApi,
      callsExternalApi: input.callsExternalApi,
      writesTrainingInput: input.writesTrainingInput,
      writesProjectStateUserRecords: input.writesProjectStateUserRecords,
      breaksUserAppTemplatePackageContract: input.userAppTemplatePackageContractBroken,
      productionNonGoalsDocumented: !input.productionNonGoalsViolated,
    });

  const trialReadyTemplateCount =
    input.trialTemplateSelectionReport?.trialReadyTemplates.length ??
    input.trialContentReadinessReport?.trialReadyTemplateIds.length ??
    0;

  const releaseIssues = releaseStatusIssues(releaseReadinessReport);
  const routeIssues = releaseReadinessReport.checks
    .filter((checkItem) => checkItem.area === 'technology_route' && checkItem.status === 'blocked')
    .flatMap((checkItem) =>
      checkItem.issues.map((readinessIssue) =>
        issue({
          signalId: 'phase-8a-route',
          area: 'phase_8a_route',
          severity: readinessIssue.severity,
          message: readinessIssue.message,
          recommendation: readinessIssue.recommendation,
        }),
      ),
    );

  const trialPackIssues = releaseReadinessReport.checks
    .filter((checkItem) => checkItem.area === 'trial_pack' && checkItem.status !== 'passed')
    .flatMap((checkItem) =>
      checkItem.issues.map((readinessIssue) =>
        issue({
          signalId: 'phase-8c-trial-pack',
          area: 'phase_8c_trial_pack',
          severity: readinessIssue.severity,
          message: readinessIssue.message,
          recommendation: readinessIssue.recommendation,
        }),
      ),
    );

  const contentQaIssues = [
    ...(releaseReadinessReport.checks
      .filter((checkItem) => checkItem.area === 'template_content_qa' && checkItem.status !== 'passed')
      .flatMap((checkItem) =>
        checkItem.issues.map((readinessIssue) =>
          issue({
            signalId: 'phase-8d-content-qa',
            area: 'phase_8d_content_qa',
            severity: readinessIssue.severity,
            message: readinessIssue.message,
            recommendation: readinessIssue.recommendation,
          }),
        ),
      )),
    ...booleanIssue({
      passed: !input.hasBlockedContentQa,
      signalId: 'phase-8d-content-qa',
      area: 'phase_8d_content_qa',
      message: '内容 QA 存在 blocking 模板。',
      recommendation: 'blocked 内容不能进入内部试用；先修复或从试用集合移除。',
    }),
  ];

  const selectionIssues = [
    ...booleanIssue({
      passed: trialReadyTemplateCount > 0,
      signalId: 'trial-template-selection',
      area: 'trial_template_selection',
      message: '没有 trial-ready 模板。',
      recommendation: '至少准备一个 beginner-friendly、short-duration、natural/daily 核心模板。',
    }),
    ...(input.trialTemplateSelectionReport?.status === 'ready_with_warnings'
      ? [
          issue({
            signalId: 'trial-template-selection',
            area: 'trial_template_selection',
            severity: 'warning',
            message: '试用模板选择包含 warning 或备用模板。',
            recommendation: '内部试用准备可以继续，但 warning 必须写入运营包。',
          }),
        ]
      : []),
    ...(input.trialTemplateSelectionReport?.status === 'blocked'
      ? [
          issue({
            signalId: 'trial-template-selection',
            area: 'trial_template_selection',
            severity: 'blocking',
            message: '试用模板选择报告被阻断。',
            recommendation: '修复模板选择 coverage 和内容 QA 后再试用。',
          }),
        ]
      : []),
  ];

  const feedbackIssues = [
    ...booleanIssue({
      passed: feedbackForm.status !== 'blocked',
      signalId: 'feedback-privacy',
      area: 'feedback_privacy',
      message: '反馈表隐私安全被阻断。',
      recommendation: '反馈不能收集真实姓名、联系方式、照片、健康、敏感身份或训练数据。',
    }),
    ...(feedbackForm.status === 'warning'
      ? [
          issue({
            signalId: 'feedback-privacy',
            area: 'feedback_privacy',
            severity: 'warning',
            message: '反馈表仍有 warning。',
            recommendation: '试用前复核反馈问题，避免误收集敏感信息。',
          }),
        ]
      : []),
  ];

  const privacyIssues = releaseReadinessReport.checks
    .filter((checkItem) => checkItem.area === 'privacy_local_boundary' && checkItem.status !== 'passed')
    .flatMap((checkItem) =>
      checkItem.issues.map((readinessIssue) =>
        issue({
          signalId: 'privacy-boundary',
          area: 'privacy_boundary',
          severity: readinessIssue.severity,
          message: readinessIssue.message,
          recommendation: readinessIssue.recommendation,
        }),
      ),
    );

  const userCopyIssues = booleanIssue({
    passed: !input.ordinaryUserPathExposesInternalTerms,
    signalId: 'user-copy',
    area: 'user_copy',
    message: '普通用户路径暴露 release gate / QA / contract 等内部术语。',
    recommendation: '用户路径只保留妆容、跟练、本地进度和隐私说明等产品语言。',
  });

  const validationIssues = booleanIssue({
    passed: input.testsPassed ?? true,
    signalId: 'test-validation',
    area: 'test_validation',
    message: '测试或项目验证未通过。',
    recommendation: '先通过 scoped tests、full tests、typecheck、build 和 project-state 命令。',
  });

  const limitationsIssues = booleanIssue({
    passed: input.knownLimitationsDocumented ?? true,
    signalId: 'known-limitations',
    area: 'known_limitations',
    message: '已知限制没有文档化。',
    recommendation: '必须说明哪些限制不阻止内部试用，但阻止正式生产发布。',
  });

  const productionBoundaryIssues = [
    ...booleanIssue({
      passed: !input.productionNonGoalsViolated,
      signalId: 'production-boundary',
      area: 'production_boundary',
      message: '生产发布 non-goals 被违反。',
      recommendation: '8E 只能做 gate；不能添加正式发布、App Store/TestFlight、backend、camera、AR、training。',
    }),
    ...booleanIssue({
      passed:
        !input.usesBackend &&
        !input.usesCamera &&
        !input.usesAr &&
        !input.usesAnalytics &&
        !input.callsOpenAiApi &&
        !input.callsExternalApi &&
        !input.writesTrainingInput &&
        !input.writesProjectStateUserRecords,
      signalId: 'production-boundary',
      area: 'production_boundary',
      message: '发现 backend/camera/AR/analytics/API/training/project-state 用户记录边界违规。',
      recommendation: '移除生产能力或数据收集路径，保持 internal trial readiness gate。',
    }),
  ];

  const contractIssues = booleanIssue({
    passed: !input.userAppTemplatePackageContractBroken,
    signalId: 'contract-boundary',
    area: 'contract_boundary',
    message: 'UserAppTemplatePackage contract 被破坏。',
    recommendation: 'release gate 必须只读消费 contract，不能修改消费契约。',
  });

  const signals = [
    signal({
      signalId: 'phase-8a-route',
      area: 'phase_8a_route',
      label: '8A 路线决策',
      status: signalStatus(routeIssues),
      required: true,
      summary: 'React Web / PWA MVP first 已作为内部试用路线。',
      evidence: [`releaseStatus: ${releaseReadinessReport.status}`],
      issues: routeIssues,
    }),
    signal({
      signalId: 'mvp-release-readiness',
      area: 'phase_8b_pwa_mobile',
      label: 'MVP 发布就绪度',
      status: signalStatus(releaseIssues),
      required: true,
      summary: releaseReadinessReport.summary,
      evidence: [`releaseReadinessStatus: ${releaseReadinessReport.status}`],
      issues: releaseIssues,
    }),
    signal({
      signalId: 'phase-8c-trial-pack',
      area: 'phase_8c_trial_pack',
      label: '8C 试用包',
      status: signalStatus(trialPackIssues),
      required: true,
      summary: '试用任务和反馈基础必须完整。',
      evidence: [`issueCount: ${trialPackIssues.length}`],
      issues: trialPackIssues,
    }),
    signal({
      signalId: 'phase-8d-content-qa',
      area: 'phase_8d_content_qa',
      label: '8D 内容 QA',
      status: signalStatus(contentQaIssues),
      required: true,
      summary: '内容 QA 和试用内容就绪度必须没有阻断项。',
      evidence: [
        `trialContentStatus: ${input.trialContentReadinessReport?.status ?? 'from release gate'}`,
        `hasBlockedContentQa: ${String(Boolean(input.hasBlockedContentQa))}`,
      ],
      issues: contentQaIssues,
    }),
    signal({
      signalId: 'trial-template-selection',
      area: 'trial_template_selection',
      label: '试用模板选择',
      status: signalStatus(selectionIssues),
      required: true,
      summary: `${trialReadyTemplateCount} trial-ready templates`,
      evidence: [`trialReadyTemplateCount: ${trialReadyTemplateCount}`],
      issues: selectionIssues,
    }),
    signal({
      signalId: 'feedback-privacy',
      area: 'feedback_privacy',
      label: '反馈隐私',
      status: signalStatus(feedbackIssues),
      required: true,
      summary: `feedbackFormStatus: ${feedbackForm.status}`,
      evidence: [`questionCount: ${feedbackForm.questions.length}`],
      issues: feedbackIssues,
    }),
    signal({
      signalId: 'privacy-boundary',
      area: 'privacy_boundary',
      label: '隐私边界',
      status: signalStatus(privacyIssues),
      required: true,
      summary: '不上传、不训练、不采集照片、不收集敏感信息。',
      evidence: [`issueCount: ${privacyIssues.length}`],
      issues: privacyIssues,
    }),
    signal({
      signalId: 'user-copy',
      area: 'user_copy',
      label: '用户文案',
      status: signalStatus(userCopyIssues),
      required: true,
      summary: '普通用户路径不能暴露管理员 release gate 术语。',
      evidence: [
        `ordinaryUserPathExposesInternalTerms: ${String(
          Boolean(input.ordinaryUserPathExposesInternalTerms),
        )}`,
      ],
      issues: userCopyIssues,
    }),
    signal({
      signalId: 'test-validation',
      area: 'test_validation',
      label: '测试验证',
      status: signalStatus(validationIssues),
      required: true,
      summary: '8E scoped tests 和 full validation 必须通过。',
      evidence: [`testsPassed: ${String(input.testsPassed ?? true)}`],
      issues: validationIssues,
    }),
    signal({
      signalId: 'known-limitations',
      area: 'known_limitations',
      label: '已知限制',
      status: signalStatus(limitationsIssues),
      required: true,
      summary: '当前限制阻止生产发布，但可被内部试用接受。',
      evidence: [`knownLimitationsDocumented: ${String(input.knownLimitationsDocumented ?? true)}`],
      issues: limitationsIssues,
    }),
    signal({
      signalId: 'production-boundary',
      area: 'production_boundary',
      label: '生产边界',
      status: signalStatus(productionBoundaryIssues),
      required: true,
      summary: '8E 不是正式发布、App Store/TestFlight 或线上增长。',
      evidence: [
        `usesBackend: ${String(Boolean(input.usesBackend))}`,
        `usesCamera: ${String(Boolean(input.usesCamera))}`,
        `writesTrainingInput: ${String(Boolean(input.writesTrainingInput))}`,
      ],
      issues: productionBoundaryIssues,
    }),
    signal({
      signalId: 'contract-boundary',
      area: 'contract_boundary',
      label: 'Contract 边界',
      status: signalStatus(contractIssues),
      required: true,
      summary: 'UserAppTemplatePackage 必须保持只读消费契约。',
      evidence: [
        `contractBroken: ${String(Boolean(input.userAppTemplatePackageContractBroken))}`,
      ],
      issues: contractIssues,
    }),
  ];

  const issues = signals.flatMap((item) => item.issues);
  const decision = decisionFromIssues(issues);
  const recommendations: UserAppTrialGoNoGoRecommendation[] =
    decision === 'no_go'
      ? [
          {
            recommendationId: 'fix-no-go-blockers',
            priority: 'blocker',
            message: 'No-go：先进入 Phase 8E-1 修复阻断项，再重新评审。',
          },
        ]
      : decision === 'go_with_warnings'
        ? [
            {
              recommendationId: 'go-with-warning-log',
              priority: 'warning',
              message: 'Go with warnings：进入 Phase 9A，同时在运营包中记录所有 warning、限制和退出条件。',
            },
          ]
        : [
            {
              recommendationId: 'go-internal-trial-ops',
              priority: 'go',
              message: 'Go：进入 Phase 9A Internal Trial Operations Pack。',
            },
          ];

  return {
    schemaVersion: USER_APP_TRIAL_GO_NO_GO_SCHEMA_VERSION,
    decision,
    createdAt: input.createdAt ?? GO_NO_GO_CREATED_AT,
    signals,
    issues,
    recommendations,
    summary:
      decision === 'no_go'
        ? 'No-go：当前 MVP 不能进入内部小范围真实用户试用准备。'
        : decision === 'go_with_warnings'
          ? 'Go with warnings：可以进入内部试用准备，但必须带 warning 清单。'
          : 'Go：可以进入内部小范围真实用户试用准备；这不是正式生产发布。',
    nextRecommendedPhase: decision === 'no_go' ? '8E-1' : '9A',
    nextRecommendedPhaseName:
      decision === 'no_go' ? 'Release Readiness Fixes' : 'Internal Trial Operations Pack',
    internalTrialOnly: true,
    productionRelease: false,
    appStoreRelease: false,
    localOnly: true,
    deterministic: true,
    usesBackend: Boolean(input.usesBackend),
    usesCamera: Boolean(input.usesCamera),
    usesAr: Boolean(input.usesAr),
    usesAnalytics: Boolean(input.usesAnalytics),
    callsOpenAiApi: Boolean(input.callsOpenAiApi),
    callsExternalApi: Boolean(input.callsExternalApi),
    writesTrainingInput: Boolean(input.writesTrainingInput),
    writesProjectStateUserRecords: Boolean(input.writesProjectStateUserRecords),
    userAppTemplatePackageContractBroken: Boolean(input.userAppTemplatePackageContractBroken),
  };
};

export const summarizeUserAppTrialGoNoGoDecision = (
  decision: UserAppTrialGoNoGoDecision,
): string =>
  `${decision.decision}: ${decision.signals.length} signals, ${decision.issues.length} issues, next ${decision.nextRecommendedPhase}.`;
