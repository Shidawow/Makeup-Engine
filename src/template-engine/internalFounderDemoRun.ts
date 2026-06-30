import type { MvpDemoGapResolutionSprint1Report } from './mvpDemoGapResolutionSprint1';

export type InternalFounderDemoRouteId =
  | 'route_a_user_app_mvp'
  | 'route_b_vision_analysis'
  | 'route_c_template_studio_operator_workflow'
  | 'route_d_mobile_demo'
  | 'route_e_boundary_explanation';

export type InternalFounderDemoStatus =
  | 'demo_pass'
  | 'demo_pass_with_warnings'
  | 'demo_blocked'
  | 'not_run';

export type InternalFounderDemoDecision =
  | 'proceed_to_internal_trial_prep'
  | 'run_second_gap_resolution_sprint'
  | 'revise_trial_content'
  | 'revise_operator_explanation'
  | 'keep_as_demo_only'
  | 'founder_decision_required';

export type InternalFounderDemoRecommendation =
  | 'ready_for_phase_14b_internal_trial_prep'
  | 'run_phase_13e_gap_resolution_sprint_2'
  | 'revise_trial_content_before_trial_prep'
  | 'revise_operator_explanation_before_trial_prep'
  | 'keep_as_local_demo_only'
  | 'request_founder_decision';

export interface InternalFounderDemoIssue {
  issueId: string;
  routeId: InternalFounderDemoRouteId;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: InternalFounderDemoRecommendation;
}

export interface InternalFounderDemoCheck {
  id: string;
  label: string;
  routeId: InternalFounderDemoRouteId;
  passed: boolean;
  severity: 'warning' | 'blocking';
  evidence: string[];
  blockers: string[];
}

export interface InternalFounderDemoRoute {
  id: InternalFounderDemoRouteId;
  label: string;
  goal: string;
  passCriteria: string[];
  evidence: string[];
  warnings: string[];
  blockers: string[];
  nextAction: string;
  status: InternalFounderDemoStatus;
}

export interface InternalFounderDemoRunReport {
  reportId: string;
  sourceResolutionReportId: string;
  status: InternalFounderDemoStatus;
  decision: InternalFounderDemoDecision;
  routes: InternalFounderDemoRoute[];
  checks: InternalFounderDemoCheck[];
  issues: InternalFounderDemoIssue[];
  recommendations: InternalFounderDemoRecommendation[];
  founderFacingSummary: string;
  finalFounderDecision: string;
  nextAction: string;
  registryChainPausedAfter10U: true;
  realWriteAuthorizationPaused: true;
  noRegistryWrite: boolean;
  noRegistryMutation: boolean;
  noPublish: boolean;
  noProductionWriter: boolean;
  noUserAppShellReplacement: boolean;
  noBackend: true;
  noAnalytics: boolean;
  noCameraOrAr: true;
  noAiApi: true;
  noTraining: true;
  noRealUserPhotos: boolean;
  noBase64OrLocalPhotoPath: boolean;
  noPersonalData: boolean;
  noRealUserFeedbackCollection: boolean;
  noFullyAutomaticExtractionClaim: boolean;
  noAiConfirmedClaim: boolean;
  notProductionReadiness: true;
  notRealUserResearch: true;
  notPublishReadiness: true;
  localMvpDemoOnly: true;
  semiAutomaticDraftHumanReviewRequired: true;
  ordinaryUserInternalTermLeaks: string[];
  jsonRoundTripStable: boolean;
  nextRecommendedPhase:
    | 'Phase 14B - Internal Trial Prep'
    | 'Phase 13E - MVP Demo Gap Resolution Sprint 2';
}

export interface CreateInternalFounderDemoRunReportInput {
  reportId?: string;
  sourceResolutionReport: MvpDemoGapResolutionSprint1Report;
  userAppPathComplete?: boolean;
  trialTemplatesUnderstandable?: boolean;
  stepGuidanceTrustworthy?: boolean;
  mobileDemoUsable?: boolean;
  visionAnalysisExplainable?: boolean;
  readinessScoreCorrectlyLabeled?: boolean;
  templateStudioOperatorWorkflowExplainable?: boolean;
  draftPreviewNotPublish?: boolean;
  boundaryExplanationClear?: boolean;
  founderDecisionRequired?: boolean;
  ordinaryUserInternalTermLeaks?: string[];
  noRegistryWrite?: boolean;
  noRegistryMutation?: boolean;
  noPublish?: boolean;
  noProductionWriter?: boolean;
  noUserAppShellReplacement?: boolean;
  noAnalytics?: boolean;
  noRealUserPhotos?: boolean;
  noBase64OrLocalPhotoPath?: boolean;
  noPersonalData?: boolean;
  noRealUserFeedbackCollection?: boolean;
  noFullyAutomaticExtractionClaim?: boolean;
  noAiConfirmedClaim?: boolean;
}

const routeLabels: Record<InternalFounderDemoRouteId, string> = {
  route_a_user_app_mvp: 'Route A - User App MVP',
  route_b_vision_analysis: 'Route B - Vision Analysis',
  route_c_template_studio_operator_workflow:
    'Route C - Template Studio operator workflow',
  route_d_mobile_demo: 'Route D - Mobile demo',
  route_e_boundary_explanation: 'Route E - Boundary explanation',
};

const routeGoal: Record<InternalFounderDemoRouteId, string> = {
  route_a_user_app_mvp:
    '验证普通用户能完成首页、模板选择、详情、准备、分步跟练和完成页。',
  route_b_vision_analysis:
    '验证 FaceMesh / mask / region QA 可解释，Readiness Score 不被说成模型原始置信度。',
  route_c_template_studio_operator_workflow:
    '验证后台操作员能解释候选、草稿、人工审核、草稿预览 QA 和候选 handoff。',
  route_d_mobile_demo: '验证窄屏演示中的触控、间距、主操作和完成路径可用。',
  route_e_boundary_explanation:
    '验证 founder demo 中能清楚说明本地 demo、非发布、非真实用户研究和 registry 暂停边界。',
};

const routePassCriteria: Record<InternalFounderDemoRouteId, string[]> = {
  route_a_user_app_mvp: [
    '普通用户路径完整',
    '三套 trial templates 能看懂',
    '步骤引导可信且不暗示真实识别',
  ],
  route_b_vision_analysis: [
    'FaceMesh、overlay、mask、region QA 可解释',
    'Readiness Score 标注为规则评分',
    'MediaPipe 与 fallback 状态可说明',
  ],
  route_c_template_studio_operator_workflow: [
    '候选属性、步骤草稿、模板草稿均需人工审核',
    'draft preview 不是 publish',
    '不写 registry、不创建 production writer',
  ],
  route_d_mobile_demo: [
    '移动端首页、详情、准备、步骤、完成路径可操作',
    '按钮和 sticky actions 不遮挡核心内容',
  ],
  route_e_boundary_explanation: [
    '不是 production readiness',
    '不是真实用户研究',
    '不收集真实用户数据、不上传、不训练',
  ],
};

const routeStatusFrom = (
  blockers: string[],
  warnings: string[],
): InternalFounderDemoStatus => {
  if (blockers.length > 0) return 'demo_blocked';
  if (warnings.length > 0) return 'demo_pass_with_warnings';
  return 'demo_pass';
};

const makeRoute = ({
  id,
  evidence,
  warnings = [],
  blockers = [],
  nextAction,
}: {
  id: InternalFounderDemoRouteId;
  evidence: string[];
  warnings?: string[];
  blockers?: string[];
  nextAction: string;
}): InternalFounderDemoRoute => ({
  id,
  label: routeLabels[id],
  goal: routeGoal[id],
  passCriteria: routePassCriteria[id],
  evidence,
  warnings,
  blockers,
  nextAction,
  status: routeStatusFrom(blockers, warnings),
});

const makeCheck = (
  id: string,
  label: string,
  routeId: InternalFounderDemoRouteId,
  passed: boolean,
  severity: 'warning' | 'blocking',
  evidence: string[],
  blockers: string[],
): InternalFounderDemoCheck => ({
  id,
  label,
  routeId,
  passed,
  severity,
  evidence,
  blockers,
});

const issueForCheck = (
  check: InternalFounderDemoCheck,
): InternalFounderDemoIssue | null => {
  if (check.passed) return null;

  let recommendation: InternalFounderDemoRecommendation =
    'run_phase_13e_gap_resolution_sprint_2';

  if (check.routeId === 'route_a_user_app_mvp') {
    recommendation = 'revise_trial_content_before_trial_prep';
  }
  if (check.routeId === 'route_c_template_studio_operator_workflow') {
    recommendation = 'revise_operator_explanation_before_trial_prep';
  }
  if (check.routeId === 'route_e_boundary_explanation') {
    recommendation = 'keep_as_local_demo_only';
  }

  return {
    issueId: `${check.id}-${check.severity}`,
    routeId: check.routeId,
    severity: check.severity,
    message: check.blockers[0] ?? `${check.label} 未通过。`,
    recommendation,
  };
};

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createInternalFounderDemoRunReport = ({
  reportId = 'internal-founder-demo-run-14a',
  sourceResolutionReport,
  userAppPathComplete = sourceResolutionReport.status !== 'not_resolved',
  trialTemplatesUnderstandable = sourceResolutionReport.items.some(
    (item) => item.category === 'trial_template_consistency' && item.status === 'resolved',
  ),
  stepGuidanceTrustworthy = sourceResolutionReport.items.some(
    (item) => item.category === 'trust_wording' && item.status === 'resolved',
  ),
  mobileDemoUsable = sourceResolutionReport.items.some(
    (item) => item.category === 'mobile_demo_usability' && item.status === 'resolved',
  ),
  visionAnalysisExplainable = true,
  readinessScoreCorrectlyLabeled = true,
  templateStudioOperatorWorkflowExplainable = sourceResolutionReport.items.some(
    (item) => item.category === 'operator_workflow_explanation' && item.status === 'resolved',
  ),
  draftPreviewNotPublish = true,
  boundaryExplanationClear = true,
  founderDecisionRequired = false,
  ordinaryUserInternalTermLeaks = [],
  noRegistryWrite = sourceResolutionReport.noRegistryWrite,
  noRegistryMutation = sourceResolutionReport.noRegistryMutation,
  noPublish = sourceResolutionReport.noPublish,
  noProductionWriter = sourceResolutionReport.noProductionWriter,
  noUserAppShellReplacement = sourceResolutionReport.noUserAppShellReplacement,
  noAnalytics = sourceResolutionReport.noAnalytics,
  noRealUserPhotos = sourceResolutionReport.noRealUserPhotos,
  noBase64OrLocalPhotoPath = sourceResolutionReport.noBase64OrLocalPhotoPath,
  noPersonalData = sourceResolutionReport.noPersonalData,
  noRealUserFeedbackCollection = true,
  noFullyAutomaticExtractionClaim = true,
  noAiConfirmedClaim = true,
}: CreateInternalFounderDemoRunReportInput): InternalFounderDemoRunReport => {
  const checks: InternalFounderDemoCheck[] = [
    makeCheck(
      'user_app_path_complete',
      'User App path complete',
      'route_a_user_app_mvp',
      userAppPathComplete,
      'blocking',
      ['首页、模板选择、模板详情、准备页、分步跟练、完成页。'],
      userAppPathComplete ? [] : ['User App MVP 路径未完整演示。'],
    ),
    makeCheck(
      'trial_templates_understandable',
      'Trial templates understandable',
      'route_a_user_app_mvp',
      trialTemplatesUnderstandable,
      'blocking',
      ['三套 MVP trial templates 字段一致，适合 founder demo。'],
      trialTemplatesUnderstandable ? [] : ['试用模板仍不够完整或不易理解。'],
    ),
    makeCheck(
      'step_guidance_trustworthy',
      'Step guidance trustworthy',
      'route_a_user_app_mvp',
      stepGuidanceTrustworthy,
      'blocking',
      ['步骤引导保持演示模板口径，不声称系统已识别真实妆容。'],
      stepGuidanceTrustworthy ? [] : ['步骤文案仍可能被理解为真实识别结果。'],
    ),
    makeCheck(
      'vision_analysis_explainable',
      'Vision Analysis explainable',
      'route_b_vision_analysis',
      visionAnalysisExplainable,
      'blocking',
      ['FaceMesh、overlay、mask、region QA、missing assets recovery 可解释。'],
      visionAnalysisExplainable ? [] : ['视觉分析路线无法向 founder 清楚说明。'],
    ),
    makeCheck(
      'readiness_score_correctly_labeled',
      'Readiness Score correctly labeled',
      'route_b_vision_analysis',
      readinessScoreCorrectlyLabeled,
      'blocking',
      ['Readiness Score 标注为规则评分，不是模型原始置信度。'],
      readinessScoreCorrectlyLabeled ? [] : ['Readiness Score 仍可能被误解为模型原始置信度。'],
    ),
    makeCheck(
      'operator_workflow_explainable',
      'Template Studio operator workflow explainable',
      'route_c_template_studio_operator_workflow',
      templateStudioOperatorWorkflowExplainable,
      'blocking',
      ['候选属性、步骤草稿、模板草稿、人工审核和 handoff 边界可说明。'],
      templateStudioOperatorWorkflowExplainable ? [] : ['后台 operator workflow 说明不清。'],
    ),
    makeCheck(
      'draft_preview_not_publish',
      'Draft preview not publish',
      'route_c_template_studio_operator_workflow',
      draftPreviewNotPublish,
      'blocking',
      ['草稿预览只进入 review / candidate handoff，不是发布。'],
      draftPreviewNotPublish ? [] : ['草稿预览被描述成发布或正式模板。'],
    ),
    makeCheck(
      'mobile_demo_usable',
      'Mobile demo usable',
      'route_d_mobile_demo',
      mobileDemoUsable,
      'blocking',
      ['390px 窄屏下首页、详情、准备、步骤和完成路径可用。'],
      mobileDemoUsable ? [] : ['移动端演示仍存在阻断。'],
    ),
    makeCheck(
      'boundary_explanation_clear',
      'Boundary explanation clear',
      'route_e_boundary_explanation',
      boundaryExplanationClear,
      'blocking',
      ['本地 MVP demo、非发布、非 production readiness、非真实用户研究边界清楚。'],
      boundaryExplanationClear ? [] : ['边界说明不够清楚。'],
    ),
    makeCheck(
      'no_registry_or_publish_claim',
      'No registry or publish claim',
      'route_e_boundary_explanation',
      noRegistryWrite && noRegistryMutation && noPublish && noProductionWriter,
      'blocking',
      ['registry chain paused after 10U；不写 registry、不 publish、不创建 production writer。'],
      noRegistryWrite && noRegistryMutation && noPublish && noProductionWriter
        ? []
        : ['出现 registry、publish 或 production writer 越界。'],
    ),
    makeCheck(
      'no_shell_replacement_or_real_data',
      'No shell replacement or real data',
      'route_e_boundary_explanation',
      noUserAppShellReplacement &&
        noAnalytics &&
        noRealUserPhotos &&
        noBase64OrLocalPhotoPath &&
        noPersonalData &&
        noRealUserFeedbackCollection,
      'blocking',
      ['不替换 User App Shell，不收集真实用户数据、照片、base64、本地路径或 analytics。'],
      noUserAppShellReplacement &&
      noAnalytics &&
      noRealUserPhotos &&
      noBase64OrLocalPhotoPath &&
      noPersonalData &&
      noRealUserFeedbackCollection
        ? []
        : ['出现真实用户数据、analytics、照片或 shell replacement 越界。'],
    ),
    makeCheck(
      'no_automation_overclaim',
      'No automation overclaim',
      'route_e_boundary_explanation',
      noFullyAutomaticExtractionClaim && noAiConfirmedClaim,
      'blocking',
      ['只能说半自动草稿 + 人工审核，不说全自动拆妆或 AI 已确认。'],
      noFullyAutomaticExtractionClaim && noAiConfirmedClaim
        ? []
        : ['出现全自动拆妆或 AI 已确认的越界表述。'],
    ),
    makeCheck(
      'ordinary_user_terms_hidden',
      'Ordinary user path hides internal terms',
      'route_e_boundary_explanation',
      ordinaryUserInternalTermLeaks.length === 0,
      'blocking',
      ['普通用户路径不暴露 Internal Founder Demo Run / demo blocker / registry 等后台术语。'],
      ordinaryUserInternalTermLeaks.length === 0
        ? []
        : [`普通用户路径泄露内部术语：${ordinaryUserInternalTermLeaks.join(', ')}`],
    ),
  ];

  const routeChecks = (routeId: InternalFounderDemoRouteId) =>
    checks.filter((check) => check.routeId === routeId);
  const routeBlockers = (routeId: InternalFounderDemoRouteId) =>
    routeChecks(routeId)
      .filter((check) => !check.passed && check.severity === 'blocking')
      .flatMap((check) => check.blockers);
  const routeWarnings = (routeId: InternalFounderDemoRouteId) =>
    routeChecks(routeId)
      .filter((check) => !check.passed && check.severity === 'warning')
      .flatMap((check) => check.blockers);

  const routes: InternalFounderDemoRoute[] = [
    makeRoute({
      id: 'route_a_user_app_mvp',
      evidence: [
        'User App MVP 默认进入普通用户路径。',
        '首页、模板列表、详情、准备、分步跟练、完成页可串起 founder demo。',
        '三套 trial templates 使用一致字段和新手可读步骤。',
      ],
      warnings: routeWarnings('route_a_user_app_mvp'),
      blockers: routeBlockers('route_a_user_app_mvp'),
      nextAction: '若通过，可让 founder 按普通用户路径完整走一遍。',
    }),
    makeRoute({
      id: 'route_b_vision_analysis',
      evidence: [
        'Vision Analysis 展示 FaceMesh / mask / region QA / 图片质量信息。',
        'Readiness Score 是规则评分，不是模型原始置信度。',
        'MediaPipe 缺失时显示恢复说明；本地可使用 mock fallback。',
      ],
      warnings: routeWarnings('route_b_vision_analysis'),
      blockers: routeBlockers('route_b_vision_analysis'),
      nextAction: '用一张本地 demo 图片解释视觉分析如何支持后续模板草稿。',
    }),
    makeRoute({
      id: 'route_c_template_studio_operator_workflow',
      evidence: [
        'Template Studio 说明候选属性、规则步骤、模板草稿、草稿 QA、人工审核。',
        'approve 只能成为模板库候选，不是发布。',
        'registry / real write chain 仍在 Phase 10U 后暂停。',
      ],
      warnings: routeWarnings('route_c_template_studio_operator_workflow'),
      blockers: routeBlockers('route_c_template_studio_operator_workflow'),
      nextAction: '用后台面板解释 photo-to-template 仍是 operator-assisted draft workflow。',
    }),
    makeRoute({
      id: 'route_d_mobile_demo',
      evidence: [
        '窄屏下主 CTA、准备清单、步骤操作、完成页可点击。',
        '移动端演示仍为本地 Web/PWA MVP，不是 App Store 或 production app。',
      ],
      warnings: routeWarnings('route_d_mobile_demo'),
      blockers: routeBlockers('route_d_mobile_demo'),
      nextAction: '在 390px 左右宽度复核普通用户主路径。',
    }),
    makeRoute({
      id: 'route_e_boundary_explanation',
      evidence: [
        '明确不是发布、不是 production readiness、不是正式用户研究。',
        '不写 registry、不 publish、不创建 production writer、不替换 User App Shell。',
        '不采集真实照片、个人资料、analytics，不调用 AI API，不训练。',
      ],
      warnings: routeWarnings('route_e_boundary_explanation'),
      blockers: routeBlockers('route_e_boundary_explanation'),
      nextAction: 'demo 结尾让 founder 在继续内部试用准备或继续 gap sprint 中做判断。',
    }),
  ];

  const issues = checks
    .map(issueForCheck)
    .filter((issue): issue is InternalFounderDemoIssue => Boolean(issue));
  const hasBlocker = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning = routes.some((route) => route.status === 'demo_pass_with_warnings');
  const status: InternalFounderDemoStatus = hasBlocker
    ? 'demo_blocked'
    : hasWarning
      ? 'demo_pass_with_warnings'
      : 'demo_pass';

  const decision: InternalFounderDemoDecision = hasBlocker
    ? issues.some((issue) => issue.recommendation === 'revise_trial_content_before_trial_prep')
      ? 'revise_trial_content'
      : issues.some(
            (issue) =>
              issue.recommendation === 'revise_operator_explanation_before_trial_prep',
          )
        ? 'revise_operator_explanation'
        : 'run_second_gap_resolution_sprint'
    : founderDecisionRequired
      ? 'founder_decision_required'
      : 'proceed_to_internal_trial_prep';

  const recommendations: InternalFounderDemoRecommendation[] = hasBlocker
    ? Array.from(new Set(issues.map((issue) => issue.recommendation)))
    : founderDecisionRequired
      ? ['request_founder_decision']
      : ['ready_for_phase_14b_internal_trial_prep'];

  const report: InternalFounderDemoRunReport = {
    reportId,
    sourceResolutionReportId: sourceResolutionReport.reportId,
    status,
    decision,
    routes,
    checks,
    issues,
    recommendations,
    founderFacingSummary:
      'Internal Founder Demo Run：用本地 MVP demo 串起普通用户体验、视觉分析、后台草稿工作流、移动端体验和边界说明。',
    finalFounderDecision:
      decision === 'proceed_to_internal_trial_prep'
        ? 'Founder demo can proceed to internal trial prep if the live run matches this checklist.'
        : 'Founder decision or additional gap resolution is required before internal trial prep.',
    nextAction:
      status === 'demo_pass'
        ? 'Proceed to Phase 14B - Internal Trial Prep.'
        : 'Resolve blockers or warnings before moving beyond founder demo.',
    registryChainPausedAfter10U: true,
    realWriteAuthorizationPaused: true,
    noRegistryWrite,
    noRegistryMutation,
    noPublish,
    noProductionWriter,
    noUserAppShellReplacement,
    noBackend: true,
    noAnalytics,
    noCameraOrAr: true,
    noAiApi: true,
    noTraining: true,
    noRealUserPhotos,
    noBase64OrLocalPhotoPath,
    noPersonalData,
    noRealUserFeedbackCollection,
    noFullyAutomaticExtractionClaim,
    noAiConfirmedClaim,
    notProductionReadiness: true,
    notRealUserResearch: true,
    notPublishReadiness: true,
    localMvpDemoOnly: true,
    semiAutomaticDraftHumanReviewRequired: true,
    ordinaryUserInternalTermLeaks,
    jsonRoundTripStable: false,
    nextRecommendedPhase: hasBlocker
      ? 'Phase 13E - MVP Demo Gap Resolution Sprint 2'
      : 'Phase 14B - Internal Trial Prep',
  };

  report.jsonRoundTripStable = jsonRoundTripStable(report);

  return report;
};
