import type { PhotoToTemplateDraftPreviewQaReport } from './photoToTemplateDraftPreviewQa';
import type { PhotoToTemplateOperatorWorkflowReport } from './photoToTemplateOperatorWorkflow';

export type PhotoToTemplateAcceptanceTrialStatus =
  | 'acceptance_trial_ready'
  | 'acceptance_trial_ready_with_warnings'
  | 'acceptance_trial_blocked';

export type PhotoToTemplateAcceptanceTrialCheckId =
  | 'user_app_path_complete'
  | 'vision_analysis_ready'
  | 'readiness_score_correctly_labeled'
  | 'operator_workflow_complete'
  | 'semantic_candidates_not_final'
  | 'human_review_editing_present'
  | 'draft_preview_qa_present'
  | 'draft_preview_not_publish'
  | 'user_path_internal_terms_hidden'
  | 'no_registry_write'
  | 'no_publish'
  | 'no_production_writer'
  | 'no_user_app_shell_replacement'
  | 'no_fully_automatic_claim'
  | 'no_ai_confirmed_claim'
  | 'no_medical_claim'
  | 'no_product_shade_hard_claim'
  | 'no_real_user_data_storage'
  | 'public_mediapipe_ignored'
  | 'build_and_tests_passed';

export interface PhotoToTemplateAcceptanceTrialCheck {
  id: PhotoToTemplateAcceptanceTrialCheckId;
  label: string;
  passed: boolean;
  severity: 'warning' | 'blocking';
  message: string;
  route: 'user_app_mvp' | 'vision_analysis' | 'template_studio_operator' | 'boundary' | 'validation';
}

export interface PhotoToTemplateAcceptanceTrialIssue {
  id: string;
  checkId: PhotoToTemplateAcceptanceTrialCheckId;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface PhotoToTemplateAcceptanceTrialRecommendation {
  id: string;
  message: string;
  nextAction:
    | 'run_demo_route'
    | 'fix_operator_blockers'
    | 'fix_forbidden_claims'
    | 'collect_validation_evidence'
    | 'keep_as_draft_preview_only'
    | 'ready_for_phase_13a';
}

export type PhotoToTemplateAcceptanceTrialDecision =
  | 'ready_for_phase_13a_founder_demo_review'
  | 'run_acceptance_trial_with_warnings'
  | 'fix_blockers_before_demo'
  | 'keep_as_operator_demo_only';

export interface PhotoToTemplateAcceptanceTrialDemoRouteStatus {
  id: 'user_app_mvp' | 'vision_analysis' | 'template_studio_operator';
  label: string;
  status: 'ready' | 'ready_with_warnings' | 'blocked';
  requiredSteps: string[];
}

export interface PhotoToTemplateAcceptanceTrialReport {
  trialId: string;
  status: PhotoToTemplateAcceptanceTrialStatus;
  decision: PhotoToTemplateAcceptanceTrialDecision;
  checks: PhotoToTemplateAcceptanceTrialCheck[];
  issues: PhotoToTemplateAcceptanceTrialIssue[];
  recommendations: PhotoToTemplateAcceptanceTrialRecommendation[];
  demoRoutes: PhotoToTemplateAcceptanceTrialDemoRouteStatus[];
  sourceOperatorWorkflowId: string;
  sourceDraftPreviewQaId: string;
  humanReviewRequired: true;
  operatorOnly: true;
  draftPreviewOnly: true;
  acceptanceTrialNotProductionReady: true;
  registryChainPausedAfter10U: true;
  realWriteAuthorizationPaused: true;
  registryWriteBlocked: true;
  registryMutationBlocked: true;
  publishBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  userAppTemplatePackageMutationBlocked: true;
  noBackendOrAiApiScope: true;
  noTrainingScope: true;
  noRealUserPhotoStorage: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 13A - MVP Trial Content Pack & Founder Demo Review';
}

export interface PhotoToTemplateAcceptanceTrialInput {
  operatorWorkflow: PhotoToTemplateOperatorWorkflowReport;
  draftPreviewQa: PhotoToTemplateDraftPreviewQaReport;
  trialId?: string;
  userAppPathComplete?: boolean;
  visionAnalysisReady?: boolean;
  readinessScoreCorrectlyLabeled?: boolean;
  userPathInternalTermsHidden?: boolean;
  noRealUserDataStorage?: boolean;
  publicMediapipeIgnored?: boolean;
  buildAndTestsPassed?: boolean;
  semanticCandidatesNotFinal?: boolean;
  demoClaimText?: string;
  registryWriteAttempted?: boolean;
  registryMutationAttempted?: boolean;
  publishAttempted?: boolean;
  productionWriterCreated?: boolean;
  userAppShellReplacementAttempted?: boolean;
}

const userPathInternalTermsPattern =
  /sourceType|confidenceBand|evidence|limitations|reviewerDecision|reviewerNote|humanReviewRequired|notFinal|Draft Integration|Human Review Editing|Operator Workflow|Draft Preview QA|Acceptance Trial|registry|production writer|publish|Template Studio|Pipeline Trace|debug JSON/i;
const fullyAutomaticClaimPattern =
  /已能任意照片全自动高质量拆妆|自动准确拆妆|fully automatic extraction|fully automatic high-quality/i;
const aiConfirmedClaimPattern = /AI 已确认|AI confirmed|auto confirmed|自动确认/i;
const medicalClaimPattern = /医学|医疗|诊断|治疗|肤质判断|medical|diagnos|skin condition/i;
const productShadeHardClaimPattern =
  /具体品牌色号|精准匹配.*色号|brand shade|shade\s*#|MAC\s|NARS\s|Dior\s|YSL\s|Chanel\s/i;

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const makeCheck = (
  id: PhotoToTemplateAcceptanceTrialCheckId,
  label: string,
  passed: boolean,
  severity: 'warning' | 'blocking',
  message: string,
  route: PhotoToTemplateAcceptanceTrialCheck['route'],
): PhotoToTemplateAcceptanceTrialCheck => ({ id, label, passed, severity, message, route });

const issueRecommendation: Record<PhotoToTemplateAcceptanceTrialCheckId, string> = {
  user_app_path_complete: '先完成 User App MVP 首页、模板选择、详情、准备、分步跟练和完成页演示。',
  vision_analysis_ready: '先确认 Vision Analysis 可以显示 FaceMesh / mask / region readiness。',
  readiness_score_correctly_labeled: '把 Readiness Score 描述为规则评分，不要说模型原始置信度。',
  operator_workflow_complete: '先修复 operator workflow 的阻断项。',
  semantic_candidates_not_final: '把 semantic candidates 改回候选和 notFinal，不要当最终识别。',
  human_review_editing_present: '补齐 Human Review Editing，让草稿可人工审核。',
  draft_preview_qa_present: '补齐 Draft Preview QA 后再跑 acceptance trial。',
  draft_preview_not_publish: '保持 draft preview 只是预览，不是 publish 或 production readiness。',
  user_path_internal_terms_hidden: '从普通用户路径移除内部字段、审核术语、registry/publish 术语。',
  no_registry_write: '保持 registry write blocked，不要执行或声称写入 registry。',
  no_publish: '保持 publish blocked，不要声称已发布。',
  no_production_writer: '不要创建或声称 production writer。',
  no_user_app_shell_replacement: '不要替换当前 User App Shell package。',
  no_fully_automatic_claim: '改为 semi-automatic draft + human review，不要声称全自动拆妆。',
  no_ai_confirmed_claim: '移除 AI confirmed / AI 已确认表述。',
  no_medical_claim: '移除医学、肤质诊断或治疗承诺。',
  no_product_shade_hard_claim: '移除具体品牌色号或精准色号断言。',
  no_real_user_data_storage: '不要保存真实用户照片、base64、本地路径、个人资料或生物识别数据。',
  public_mediapipe_ignored: '确认 public/mediapipe 真实资源继续被 .gitignore 忽略。',
  build_and_tests_passed: '补齐 typecheck、build、scoped tests、project status/context 验证证据。',
};

const issueForCheck = (
  check: PhotoToTemplateAcceptanceTrialCheck,
): PhotoToTemplateAcceptanceTrialIssue | null => {
  if (check.passed) return null;
  return {
    id: `${check.id}_${check.severity}`,
    checkId: check.id,
    severity: check.severity,
    message: check.message,
    recommendation: issueRecommendation[check.id],
  };
};

const routeStatus = (
  checks: PhotoToTemplateAcceptanceTrialCheck[],
  route: PhotoToTemplateAcceptanceTrialDemoRouteStatus['id'],
): PhotoToTemplateAcceptanceTrialDemoRouteStatus['status'] => {
  const routeChecks = checks.filter((check) => check.route === route);
  if (routeChecks.some((check) => !check.passed && check.severity === 'blocking')) return 'blocked';
  if (routeChecks.some((check) => !check.passed && check.severity === 'warning')) {
    return 'ready_with_warnings';
  }
  return 'ready';
};

export const createPhotoToTemplateAcceptanceTrialReport = ({
  operatorWorkflow,
  draftPreviewQa,
  trialId = 'phase-12e-photo-to-template-acceptance-trial',
  userAppPathComplete = true,
  visionAnalysisReady = true,
  readinessScoreCorrectlyLabeled = true,
  userPathInternalTermsHidden = true,
  noRealUserDataStorage = true,
  publicMediapipeIgnored = true,
  buildAndTestsPassed = false,
  semanticCandidatesNotFinal = true,
  demoClaimText = '',
  registryWriteAttempted = false,
  registryMutationAttempted = false,
  publishAttempted = false,
  productionWriterCreated = false,
  userAppShellReplacementAttempted = false,
}: PhotoToTemplateAcceptanceTrialInput): PhotoToTemplateAcceptanceTrialReport => {
  const operatorWorkflowComplete =
    operatorWorkflow.steps.length >= 8 &&
    operatorWorkflow.handoff.allowedDestinations.includes('phase_12e_demo_script') &&
    operatorWorkflow.status !== 'blocked';
  const humanReviewEditingPresent = operatorWorkflow.steps.some(
    (step) => step.id === 'human_review_editing' && step.status !== 'not_started',
  );
  const draftPreviewQaPresent = draftPreviewQa.status !== 'draft_preview_qa_blocked';
  const draftPreviewNotPublish =
    draftPreviewQa.notPublishReady &&
    draftPreviewQa.publishBlocked &&
    draftPreviewQa.registryWriteBlocked &&
    draftPreviewQa.productionWriterBlocked;
  const textUserTermsHidden =
    userPathInternalTermsHidden && !userPathInternalTermsPattern.test(demoClaimText);
  const noRegistryWrite =
    operatorWorkflow.registryWriteBlocked &&
    draftPreviewQa.registryWriteBlocked &&
    !registryWriteAttempted &&
    !registryMutationAttempted;
  const noPublish =
    operatorWorkflow.publishBlocked && draftPreviewQa.publishBlocked && !publishAttempted;
  const noProductionWriter =
    operatorWorkflow.productionWriterBlocked &&
    draftPreviewQa.productionWriterBlocked &&
    !productionWriterCreated;
  const noShellReplacement =
    operatorWorkflow.userAppShellReplacementBlocked &&
    draftPreviewQa.userAppShellReplacementBlocked &&
    !userAppShellReplacementAttempted;

  const checks: PhotoToTemplateAcceptanceTrialCheck[] = [
    makeCheck('user_app_path_complete', 'User App MVP path complete', userAppPathComplete, 'blocking', 'User App MVP route must run from home to completion.', 'user_app_mvp'),
    makeCheck('vision_analysis_ready', 'Vision Analysis ready', visionAnalysisReady, 'blocking', 'Vision Analysis must show FaceMesh / mask / readiness.', 'vision_analysis'),
    makeCheck('readiness_score_correctly_labeled', 'Readiness Score correctly labeled', readinessScoreCorrectlyLabeled, 'blocking', 'Readiness Score must be described as rule-based, not raw model confidence.', 'vision_analysis'),
    makeCheck('operator_workflow_complete', 'Operator workflow complete', operatorWorkflowComplete, 'blocking', 'Operator workflow must be complete enough for demo trial.', 'template_studio_operator'),
    makeCheck('semantic_candidates_not_final', 'Semantic candidates not final', semanticCandidatesNotFinal, 'blocking', 'Semantic candidates must remain candidate-only and not final.', 'template_studio_operator'),
    makeCheck('human_review_editing_present', 'Human Review Editing present', humanReviewEditingPresent, 'blocking', 'Human Review Editing must be visible in the operator flow.', 'template_studio_operator'),
    makeCheck('draft_preview_qa_present', 'Draft Preview QA present', draftPreviewQaPresent, 'blocking', 'Draft Preview QA must be present before acceptance trial.', 'template_studio_operator'),
    makeCheck('draft_preview_not_publish', 'Draft preview not publish', draftPreviewNotPublish, 'blocking', 'Draft preview must not be publish-ready or production-ready.', 'template_studio_operator'),
    makeCheck('user_path_internal_terms_hidden', 'User path internal terms hidden', textUserTermsHidden, 'blocking', 'Ordinary user path must not expose internal operator terms.', 'user_app_mvp'),
    makeCheck('no_registry_write', 'No registry write', noRegistryWrite, 'blocking', 'Acceptance trial must not write or mutate registry.', 'boundary'),
    makeCheck('no_publish', 'No publish', noPublish, 'blocking', 'Acceptance trial must not publish.', 'boundary'),
    makeCheck('no_production_writer', 'No production writer', noProductionWriter, 'blocking', 'Acceptance trial must not create a production writer.', 'boundary'),
    makeCheck('no_user_app_shell_replacement', 'No User App Shell replacement', noShellReplacement, 'blocking', 'Acceptance trial must not replace the current User App Shell package.', 'boundary'),
    makeCheck('no_fully_automatic_claim', 'No fully automatic extraction claim', !fullyAutomaticClaimPattern.test(demoClaimText), 'blocking', 'Demo cannot claim fully automatic high-quality extraction.', 'boundary'),
    makeCheck('no_ai_confirmed_claim', 'No AI confirmed claim', !aiConfirmedClaimPattern.test(demoClaimText), 'blocking', 'Demo cannot claim AI confirmed makeup results.', 'boundary'),
    makeCheck('no_medical_claim', 'No medical claim', !medicalClaimPattern.test(demoClaimText), 'blocking', 'Demo cannot make medical or skin diagnosis claims.', 'boundary'),
    makeCheck('no_product_shade_hard_claim', 'No product shade hard claim', !productShadeHardClaimPattern.test(demoClaimText), 'blocking', 'Demo cannot claim exact brand shade matching.', 'boundary'),
    makeCheck('no_real_user_data_storage', 'No real user data storage', noRealUserDataStorage, 'blocking', 'Acceptance trial must not store real user photos, personal data, base64, or local paths.', 'boundary'),
    makeCheck('public_mediapipe_ignored', 'public/mediapipe ignored', publicMediapipeIgnored, 'blocking', 'MediaPipe model/wasm resources must remain ignored and uncommitted.', 'validation'),
    makeCheck('build_and_tests_passed', 'Build and tests passed', buildAndTestsPassed, 'warning', 'Build/typecheck/scoped tests/project status/context evidence should be recorded.', 'validation'),
  ];

  const issues = checks
    .map(issueForCheck)
    .filter((item): item is PhotoToTemplateAcceptanceTrialIssue => Boolean(item));
  const hasBlocking = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning = issues.some((issue) => issue.severity === 'warning');
  const status: PhotoToTemplateAcceptanceTrialStatus = hasBlocking
    ? 'acceptance_trial_blocked'
    : hasWarning
      ? 'acceptance_trial_ready_with_warnings'
      : 'acceptance_trial_ready';
  const decision: PhotoToTemplateAcceptanceTrialDecision = hasBlocking
    ? 'fix_blockers_before_demo'
    : hasWarning
      ? 'run_acceptance_trial_with_warnings'
      : 'ready_for_phase_13a_founder_demo_review';

  const demoRoutes: PhotoToTemplateAcceptanceTrialDemoRouteStatus[] = [
    {
      id: 'user_app_mvp',
      label: 'Demo Route A - User App MVP',
      status: routeStatus(checks, 'user_app_mvp'),
      requiredSteps: ['home', 'template selection', 'template detail', 'preparation', 'step guidance', 'completion'],
    },
    {
      id: 'vision_analysis',
      label: 'Demo Route B - Vision Analysis',
      status: routeStatus(checks, 'vision_analysis'),
      requiredSteps: ['MediaPipe ready', 'upload test photo', 'analyze', 'FaceMesh / mask / overlay', 'Readiness Score label'],
    },
    {
      id: 'template_studio_operator',
      label: 'Demo Route C - Template Studio Operator Workflow',
      status: routeStatus(checks, 'template_studio_operator'),
      requiredSteps: ['Reality Check', 'Semantic candidates', 'Draft Integration', 'Human Review Editing', 'Draft QA', 'Operator Workflow', 'Draft Preview QA'],
    },
  ];

  const report: PhotoToTemplateAcceptanceTrialReport = {
    trialId,
    status,
    decision,
    checks,
    issues,
    recommendations: [
      {
        id: 'demo_routes',
        message: 'Run Demo Route A/B/C before founder review.',
        nextAction: hasBlocking ? 'fix_operator_blockers' : 'run_demo_route',
      },
      {
        id: 'forbidden_claims',
        message: 'Keep fully automatic, AI confirmed, publish, registry, production writer, medical, and brand shade claims blocked.',
        nextAction: hasBlocking ? 'fix_forbidden_claims' : 'keep_as_draft_preview_only',
      },
      {
        id: 'validation_evidence',
        message: 'Record MediaPipe check, scoped tests, typecheck, build, project status/context, and browser validation evidence.',
        nextAction: hasWarning ? 'collect_validation_evidence' : 'ready_for_phase_13a',
      },
    ],
    demoRoutes,
    sourceOperatorWorkflowId: operatorWorkflow.workflowId,
    sourceDraftPreviewQaId: draftPreviewQa.reportId,
    humanReviewRequired: true,
    operatorOnly: true,
    draftPreviewOnly: true,
    acceptanceTrialNotProductionReady: true,
    registryChainPausedAfter10U: true,
    realWriteAuthorizationPaused: true,
    registryWriteBlocked: true,
    registryMutationBlocked: true,
    publishBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    userAppTemplatePackageMutationBlocked: true,
    noBackendOrAiApiScope: true,
    noTrainingScope: true,
    noRealUserPhotoStorage: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase: 'Phase 13A - MVP Trial Content Pack & Founder Demo Review',
  };

  return {
    ...report,
    jsonRoundTripStable: jsonRoundTripStable(report),
  };
};
