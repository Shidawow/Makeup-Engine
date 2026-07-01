import type { InternalFounderDemoRunReport } from './internalFounderDemoRun';

export type InternalTrialParticipantProfileId =
  | 'founder'
  | 'friend_or_family'
  | 'makeup_beginner'
  | 'makeup_interested_user'
  | 'operator_reviewer'
  | 'product_reviewer';

export type InternalTrialRouteId =
  | 'user_app_mvp_trial'
  | 'mobile_demo_trial'
  | 'template_content_review'
  | 'photo_to_template_operator_demo'
  | 'boundary_understanding_check';

export type InternalTrialStatus =
  | 'trial_prep_ready'
  | 'trial_prep_ready_with_warnings'
  | 'trial_prep_blocked';

export type InternalTrialDecision =
  | 'ready_for_internal_trial'
  | 'revise_demo_before_trial'
  | 'reduce_trial_scope'
  | 'keep_founder_only'
  | 'founder_decision_required';

export type InternalTrialRecommendation =
  | 'proceed_to_phase_14c_internal_trial_dry_run'
  | 'revise_demo_before_internal_trial'
  | 'reduce_scope_to_founder_and_operator_only'
  | 'keep_as_founder_demo_only'
  | 'request_founder_decision';

export interface InternalTrialParticipantProfile {
  id: InternalTrialParticipantProfileId;
  label: string;
  roleOnly: true;
  purpose: string;
  allowedObservation: string[];
  forbiddenData: string[];
}

export interface InternalTrialRoute {
  id: InternalTrialRouteId;
  label: string;
  goal: string;
  checklist: string[];
  expectedEvidence: string[];
  blockers: string[];
  status: InternalTrialStatus;
}

export interface InternalTrialChecklistItem {
  id: string;
  label: string;
  section:
    | 'before_trial'
    | 'during_trial'
    | 'after_trial'
    | 'privacy_boundary'
    | 'scope_boundary';
  completed: boolean;
  blocking: boolean;
}

export interface InternalTrialFeedbackPrompt {
  id: string;
  question: string;
  promptType: 'single_choice' | 'rating' | 'free_text_short';
  safeToRecord: boolean;
  forbiddenCollection: string[];
}

export interface InternalTrialRisk {
  riskId: string;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: InternalTrialRecommendation;
}

export interface InternalTrialPrepReport {
  reportId: string;
  sourceFounderDemoRunReportId: string;
  status: InternalTrialStatus;
  decision: InternalTrialDecision;
  participantProfiles: InternalTrialParticipantProfile[];
  trialRoutes: InternalTrialRoute[];
  checklist: InternalTrialChecklistItem[];
  feedbackPrompts: InternalTrialFeedbackPrompt[];
  risks: InternalTrialRisk[];
  recommendations: InternalTrialRecommendation[];
  operatorSummary: string;
  nextAction: string;
  registryChainPausedAfter10U: true;
  realWriteAuthorizationPaused: true;
  localMvpDemoOnly: true;
  internalPrepOnly: true;
  notPublicBeta: true;
  notRealUserResearchSystem: true;
  notProductionReadiness: true;
  noRealNames: boolean;
  noContactCollection: boolean;
  noRealPhotos: boolean;
  noBase64OrLocalPhotoPath: boolean;
  noAnalytics: boolean;
  noBackend: boolean;
  noDatabase: boolean;
  noCameraOrAr: true;
  noAiApi: true;
  noTraining: true;
  noRegistryWrite: boolean;
  noRegistryMutation: boolean;
  noPublish: boolean;
  noProductionWriter: boolean;
  noUserAppShellReplacement: boolean;
  noBiometricIdOrFaceEmbedding: boolean;
  noFullyAutomaticExtractionClaim: boolean;
  noAiConfirmedClaim: boolean;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 14C - Internal Trial Dry Run';
}

export interface CreateInternalTrialPrepReportInput {
  reportId?: string;
  sourceFounderDemoRunReport: InternalFounderDemoRunReport;
  participantProfiles?: InternalTrialParticipantProfile[];
  trialRoutes?: InternalTrialRoute[];
  feedbackPrompts?: InternalTrialFeedbackPrompt[];
  checklist?: InternalTrialChecklistItem[];
  founderDecisionRequired?: boolean;
  noRealNames?: boolean;
  noContactCollection?: boolean;
  noRealPhotos?: boolean;
  noBase64OrLocalPhotoPath?: boolean;
  noAnalytics?: boolean;
  noBackend?: boolean;
  noDatabase?: boolean;
  noRegistryWrite?: boolean;
  noRegistryMutation?: boolean;
  noPublish?: boolean;
  noProductionWriter?: boolean;
  noUserAppShellReplacement?: boolean;
  noBiometricIdOrFaceEmbedding?: boolean;
  noFullyAutomaticExtractionClaim?: boolean;
  noAiConfirmedClaim?: boolean;
}

const participantProfiles: InternalTrialParticipantProfile[] = [
  {
    id: 'founder',
    label: 'Founder / owner reviewer',
    roleOnly: true,
    purpose: '确认内部试用目标、边界和是否值得进入 dry run。',
    allowedObservation: ['是否理解 MVP 价值', '是否同意进入小范围内部试用'],
    forbiddenData: ['真实姓名', '联系方式', '照片', '健康/敏感身份信息'],
  },
  {
    id: 'friend_or_family',
    label: 'Friend or family role profile',
    roleOnly: true,
    purpose: '模拟低压力内部试用对象，不记录身份。',
    allowedObservation: ['是否看懂 App', '是否愿意照着步骤练习'],
    forbiddenData: ['真实关系身份', '电话', '邮箱', '社交账号'],
  },
  {
    id: 'makeup_beginner',
    label: 'Makeup beginner role profile',
    roleOnly: true,
    purpose: '观察新手是否理解模板、工具和步骤。',
    allowedObservation: ['哪一步最困惑', '按钮和文字是否舒服'],
    forbiddenData: ['年龄', '健康信息', '皮肤敏感信息', '面部照片'],
  },
  {
    id: 'makeup_interested_user',
    label: 'Makeup interested user role profile',
    roleOnly: true,
    purpose: '观察对妆容感兴趣的人是否觉得模板有价值。',
    allowedObservation: ['三套模板偏好', '是否愿意看更多模板'],
    forbiddenData: ['账号', '购买记录', '社交媒体账号', '支付信息'],
  },
  {
    id: 'operator_reviewer',
    label: 'Operator reviewer role profile',
    roleOnly: true,
    purpose: '检查 Template Studio 和 photo-to-template operator demo 是否讲得清楚。',
    allowedObservation: ['操作员是否能解释候选/草稿/人工审核'],
    forbiddenData: ['真实操作者个人资料', '本地图片路径', 'base64'],
  },
  {
    id: 'product_reviewer',
    label: 'Product reviewer role profile',
    roleOnly: true,
    purpose: '判断 trial scope、风险边界和下一阶段 dry run 是否合理。',
    allowedObservation: ['是否建议缩小范围', '是否需要修改试用说明'],
    forbiddenData: ['analytics id', '后台记录', '真实用户研究记录'],
  },
];

const feedbackPrompts: InternalTrialFeedbackPrompt[] = [
  {
    id: 'understand_app_purpose',
    question: '你是否一眼看懂这个 App 是做什么的？',
    promptType: 'single_choice',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'favorite_template',
    question: '三套模板哪套最吸引你？',
    promptType: 'single_choice',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'most_real_guidance_step',
    question: '哪一步最像真实化妆指导？',
    promptType: 'free_text_short',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'least_clear_step',
    question: '哪一步最不清楚？',
    promptType: 'free_text_short',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'trust_step_practice',
    question: '你是否相信这些步骤可以跟练？',
    promptType: 'rating',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'misunderstood_personal_recognition',
    question: '是否有地方让你误以为系统正在识别你本人？',
    promptType: 'free_text_short',
    safeToRecord: true,
    forbiddenCollection: ['真实照片', '姓名', '联系方式'],
  },
  {
    id: 'mobile_comfort',
    question: '手机上按钮和文字是否舒服？',
    promptType: 'rating',
    safeToRecord: true,
    forbiddenCollection: [],
  },
  {
    id: 'willing_more_templates',
    question: '你是否愿意继续看更多妆容模板？',
    promptType: 'single_choice',
    safeToRecord: true,
    forbiddenCollection: [],
  },
];

const trialRoutes: InternalTrialRoute[] = [
  {
    id: 'user_app_mvp_trial',
    label: 'User App MVP trial',
    goal: '观察普通用户是否能理解首页、模板、准备、跟练和完成路径。',
    checklist: ['打开本地 User App MVP', '选择一套模板', '完成至少 3 个步骤', '查看完成页'],
    expectedEvidence: ['匿名任务完成记录', '匿名困惑点', '匿名价值判断'],
    blockers: [],
    status: 'trial_prep_ready',
  },
  {
    id: 'mobile_demo_trial',
    label: 'Mobile demo trial',
    goal: '观察窄屏下按钮、文字、滚动和 sticky action 是否舒服。',
    checklist: ['390px 窄屏打开', '进入模板详情', '完成准备清单', '使用上一步/下一步/完成'],
    expectedEvidence: ['匿名移动可用性备注', '触控/遮挡问题'],
    blockers: [],
    status: 'trial_prep_ready',
  },
  {
    id: 'template_content_review',
    label: 'Template content review',
    goal: '观察三套 trial templates 是否清楚、有吸引力、可跟练。',
    checklist: ['比较三套模板', '记录最吸引模板', '记录最不清楚步骤'],
    expectedEvidence: ['匿名模板偏好', '匿名内容修订建议'],
    blockers: [],
    status: 'trial_prep_ready',
  },
  {
    id: 'photo_to_template_operator_demo',
    label: 'Photo-to-template operator demo',
    goal: '由管理员解释照片到模板仍是半自动草稿，需要人工审核。',
    checklist: ['说明 FaceMesh / region QA', '说明候选/草稿/人工审核', '说明不是自动发布'],
    expectedEvidence: ['匿名理解备注', 'operator 说明是否清楚'],
    blockers: [],
    status: 'trial_prep_ready',
  },
  {
    id: 'boundary_understanding_check',
    label: 'Boundary understanding check',
    goal: '确认试用者不会误以为这是公开 beta、生产 App、自动识别或数据采集系统。',
    checklist: ['说明不上传照片', '说明不接 analytics', '说明不保存个人资料', '说明不写 registry'],
    expectedEvidence: ['匿名边界理解备注', '误解点'],
    blockers: [],
    status: 'trial_prep_ready',
  },
];

const checklist: InternalTrialChecklistItem[] = [
  {
    id: 'explain_internal_only',
    label: '已说明这是内部小范围试用准备，不是公开试用。',
    section: 'before_trial',
    completed: true,
    blocking: true,
  },
  {
    id: 'role_profiles_only',
    label: '已确认只使用角色画像，不记录真实身份。',
    section: 'before_trial',
    completed: true,
    blocking: true,
  },
  {
    id: 'no_photo_upload',
    label: '已说明不上传照片 / 不保存照片。',
    section: 'privacy_boundary',
    completed: true,
    blocking: true,
  },
  {
    id: 'no_contact_collection',
    label: '已说明不收集姓名、电话、邮箱或社交账号。',
    section: 'privacy_boundary',
    completed: true,
    blocking: true,
  },
  {
    id: 'no_analytics_backend',
    label: '已说明不接 analytics / backend / database。',
    section: 'scope_boundary',
    completed: true,
    blocking: true,
  },
  {
    id: 'no_registry_publish',
    label: '已说明不能写 registry / 不能 publish / 不能创建 production writer。',
    section: 'scope_boundary',
    completed: true,
    blocking: true,
  },
  {
    id: 'feedback_safe',
    label: '反馈问题只记录匿名理解、困惑、偏好和可用性备注。',
    section: 'during_trial',
    completed: true,
    blocking: true,
  },
  {
    id: 'handoff_after_trial',
    label: '试用结束后只输出匿名总结和是否进入下一步的建议。',
    section: 'after_trial',
    completed: true,
    blocking: false,
  },
];

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const statusFrom = (risks: InternalTrialRisk[]): InternalTrialStatus => {
  if (risks.some((risk) => risk.severity === 'blocking')) return 'trial_prep_blocked';
  if (risks.some((risk) => risk.severity === 'warning')) {
    return 'trial_prep_ready_with_warnings';
  }
  return 'trial_prep_ready';
};

const routeStatusFromSource = (
  sourceFounderDemoRunReport: InternalFounderDemoRunReport,
): InternalTrialStatus =>
  sourceFounderDemoRunReport.status === 'demo_blocked'
    ? 'trial_prep_blocked'
    : sourceFounderDemoRunReport.status === 'demo_pass_with_warnings'
      ? 'trial_prep_ready_with_warnings'
      : 'trial_prep_ready';

export const createInternalTrialPrepReport = ({
  reportId = 'internal-trial-prep-v0',
  sourceFounderDemoRunReport,
  participantProfiles: providedProfiles = participantProfiles,
  trialRoutes: providedRoutes = trialRoutes,
  feedbackPrompts: providedPrompts = feedbackPrompts,
  checklist: providedChecklist = checklist,
  founderDecisionRequired = false,
  noRealNames = true,
  noContactCollection = true,
  noRealPhotos = true,
  noBase64OrLocalPhotoPath = true,
  noAnalytics = true,
  noBackend = true,
  noDatabase = true,
  noRegistryWrite = true,
  noRegistryMutation = true,
  noPublish = true,
  noProductionWriter = true,
  noUserAppShellReplacement = true,
  noBiometricIdOrFaceEmbedding = true,
  noFullyAutomaticExtractionClaim = true,
  noAiConfirmedClaim = true,
}: CreateInternalTrialPrepReportInput): InternalTrialPrepReport => {
  const sourceReady = sourceFounderDemoRunReport.status !== 'demo_blocked';
  const normalizedRoutes = providedRoutes.map((route) => ({
    ...route,
    status:
      route.status === 'trial_prep_blocked'
        ? route.status
        : routeStatusFromSource(sourceFounderDemoRunReport),
  }));

  const risks: InternalTrialRisk[] = [];

  if (!sourceReady) {
    risks.push({
      riskId: 'source_founder_demo_blocked',
      severity: 'blocking',
      message: '14A founder demo run 仍有阻断，不能进入内部试用准备完成态。',
      recommendation: 'revise_demo_before_internal_trial',
    });
  }

  const boundaryChecks = [
    [noRealNames, 'real_name_scope', '不得记录真实姓名。'],
    [noContactCollection, 'contact_collection_scope', '不得收集电话、邮箱、社交账号或联系方式。'],
    [noRealPhotos, 'real_photo_scope', '不得上传、保存或要求真实照片。'],
    [noBase64OrLocalPhotoPath, 'image_payload_scope', '不得记录 base64、object URL 或本地照片路径。'],
    [noAnalytics, 'analytics_scope', '不得接 analytics 或写 analytics id。'],
    [noBackend, 'backend_scope', '不得接 backend。'],
    [noDatabase, 'database_scope', '不得接 database。'],
    [noRegistryWrite && noRegistryMutation, 'registry_scope', '不得写 registry 或 mutation registry。'],
    [noPublish, 'publish_scope', '不得 publish。'],
    [noProductionWriter, 'production_writer_scope', '不得创建 production writer。'],
    [noUserAppShellReplacement, 'shell_replacement_scope', '不得替换当前 User App Shell。'],
    [noBiometricIdOrFaceEmbedding, 'biometric_scope', '不得记录 biometric id 或 face embedding。'],
    [noFullyAutomaticExtractionClaim, 'fully_automatic_claim', '不得声称 fully automatic high-quality extraction。'],
    [noAiConfirmedClaim, 'ai_confirmed_claim', '不得声称 AI confirmed。'],
  ] as const;

  for (const [passed, riskId, message] of boundaryChecks) {
    if (!passed) {
      risks.push({
        riskId,
        severity: 'blocking',
        message,
        recommendation: 'keep_as_founder_demo_only',
      });
    }
  }

  if (founderDecisionRequired) {
    risks.push({
      riskId: 'founder_decision_required',
      severity: 'warning',
      message: '需要老板确认内部试用对象和范围。',
      recommendation: 'request_founder_decision',
    });
  }

  const status = statusFrom(risks);
  const decision: InternalTrialDecision =
    status === 'trial_prep_blocked'
      ? 'keep_founder_only'
      : founderDecisionRequired
        ? 'founder_decision_required'
        : status === 'trial_prep_ready_with_warnings'
          ? 'reduce_trial_scope'
          : 'ready_for_internal_trial';

  const recommendations = Array.from(
    new Set<InternalTrialRecommendation>([
      ...(status === 'trial_prep_ready'
        ? ['proceed_to_phase_14c_internal_trial_dry_run' as const]
        : []),
      ...risks.map((risk) => risk.recommendation),
    ]),
  );

  const report: InternalTrialPrepReport = {
    reportId,
    sourceFounderDemoRunReportId: sourceFounderDemoRunReport.reportId,
    status,
    decision,
    participantProfiles: providedProfiles,
    trialRoutes: normalizedRoutes,
    checklist: providedChecklist,
    feedbackPrompts: providedPrompts,
    risks,
    recommendations,
    operatorSummary:
      '14B 将 14A founder demo 转成内部小范围试用准备包：角色画像、试用路线、安全反馈问题、隐私/范围边界和试用前 checklist。',
    nextAction:
      status === 'trial_prep_ready'
        ? '进入 Phase 14C - Internal Trial Dry Run。'
        : '先修复阻断或缩小试用范围，再进入 dry run。',
    registryChainPausedAfter10U: true,
    realWriteAuthorizationPaused: true,
    localMvpDemoOnly: true,
    internalPrepOnly: true,
    notPublicBeta: true,
    notRealUserResearchSystem: true,
    notProductionReadiness: true,
    noRealNames,
    noContactCollection,
    noRealPhotos,
    noBase64OrLocalPhotoPath,
    noAnalytics,
    noBackend,
    noDatabase,
    noCameraOrAr: true,
    noAiApi: true,
    noTraining: true,
    noRegistryWrite,
    noRegistryMutation,
    noPublish,
    noProductionWriter,
    noUserAppShellReplacement,
    noBiometricIdOrFaceEmbedding,
    noFullyAutomaticExtractionClaim,
    noAiConfirmedClaim,
    jsonRoundTripStable: false,
    nextRecommendedPhase: 'Phase 14C - Internal Trial Dry Run',
  };

  return {
    ...report,
    jsonRoundTripStable: jsonRoundTripStable(report),
  };
};
