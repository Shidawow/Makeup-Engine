import type { PhotoToTemplateAcceptanceTrialReport } from './photoToTemplateAcceptanceTrial';
import {
  countCompleteMvpTrialTemplates,
  type MvpTrialContentPack,
} from './mvpTrialContentPack';

export type FounderDemoReviewStatus =
  | 'founder_review_ready'
  | 'founder_review_ready_with_warnings'
  | 'founder_review_blocked';

export type FounderDemoReviewCheckId =
  | 'user_app_first_impression'
  | 'template_selection_clear'
  | 'template_detail_understandable'
  | 'preparation_page_clear'
  | 'step_guidance_clear'
  | 'completion_page_satisfying'
  | 'mobile_demo_usable'
  | 'trial_content_quality'
  | 'operator_workflow_explainable'
  | 'photo_to_template_boundary_clear'
  | 'forbidden_claims_absent'
  | 'privacy_boundary_clear'
  | 'next_iteration_decision_ready';

export type FounderDemoReviewCheckArea =
  | 'user_app'
  | 'trial_content'
  | 'operator_workflow'
  | 'boundary'
  | 'privacy'
  | 'decision';

export type FounderDemoReviewSeverity = 'warning' | 'blocking';

export type FounderDemoReviewRecommendation =
  | 'ready_for_phase_13b_feedback_capture'
  | 'run_founder_review_with_warnings'
  | 'revise_trial_content_before_founder_review'
  | 'revise_user_app_demo_path_before_founder_review'
  | 'clarify_boundary_before_founder_review'
  | 'keep_as_internal_demo_only';

export type FounderDemoReviewDecision =
  | 'ready_for_founder_demo_review'
  | 'ready_with_warnings_for_founder_demo_review'
  | 'blocked_fix_before_founder_demo_review';

export interface FounderDemoReviewCheck {
  id: FounderDemoReviewCheckId;
  label: string;
  area: FounderDemoReviewCheckArea;
  passed: boolean;
  severity: FounderDemoReviewSeverity;
  message: string;
}

export interface FounderDemoReviewIssue {
  id: string;
  checkId: FounderDemoReviewCheckId;
  severity: FounderDemoReviewSeverity;
  message: string;
  recommendation: FounderDemoReviewRecommendation;
}

export interface FounderDemoReviewReport {
  reviewId: string;
  status: FounderDemoReviewStatus;
  decision: FounderDemoReviewDecision;
  checks: FounderDemoReviewCheck[];
  issues: FounderDemoReviewIssue[];
  recommendations: FounderDemoReviewRecommendation[];
  trialContentPackId: string;
  trialTemplateCount: number;
  completeTrialTemplateCount: number;
  recommendedTemplateTitles: string[];
  demoRoutes: PhotoToTemplateAcceptanceTrialReport['demoRoutes'];
  sourceAcceptanceTrialId: string;
  founderReviewNotProductionReadiness: true;
  trialContentNotOfficialTemplateLibrary: true;
  semiAutomaticDraftHumanReviewRequired: true;
  registryChainPausedAfter10U: true;
  realWriteAuthorizationPaused: true;
  registryWriteBlocked: true;
  registryMutationBlocked: true;
  publishBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  noBackendCameraArAiTrainingScope: true;
  noRealUserPhotoOrPersonalData: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 13B - Founder Trial Feedback Capture & MVP Gap Prioritization';
}

export interface CreateFounderDemoReviewReportInput {
  reviewId?: string;
  contentPack: MvpTrialContentPack;
  acceptanceTrial: PhotoToTemplateAcceptanceTrialReport;
  userAppFirstImpression?: boolean;
  templateSelectionClear?: boolean;
  templateDetailUnderstandable?: boolean;
  preparationPageClear?: boolean;
  stepGuidanceClear?: boolean;
  completionPageSatisfying?: boolean;
  mobileDemoUsable?: boolean;
  operatorWorkflowExplainable?: boolean;
  photoToTemplateBoundaryClear?: boolean;
  privacyBoundaryClear?: boolean;
  nextIterationDecisionReady?: boolean;
  ordinaryUserPathInternalTermsHidden?: boolean;
  founderClaimText?: string;
}

const INTERNAL_TERMS_PATTERN =
  /Founder Demo Review|trial content pack|sourceLabel|demo_fixture|notFromAutomaticExtraction|humanReviewRecommended|Operator Workflow|Draft Preview QA|Acceptance Trial|registry|production writer|publish|Template Studio|Pipeline Trace|debug JSON/i;

const FORBIDDEN_CLAIM_PATTERN =
  /fully automatic|全自动|自动准确拆妆|自动高质量拆妆|AI 已确认|AI confirmed|published|已发布|registry written|已写入 registry|production ready|production writer|正式模板库|正式发布|medical diagnosis|医疗诊断|exact product shade|精准匹配.*色号/i;

const checkLabels: Record<FounderDemoReviewCheckId, string> = {
  user_app_first_impression: '用户 App 第一印象清楚',
  template_selection_clear: '模板选择路径清楚',
  template_detail_understandable: '模板详情看得懂',
  preparation_page_clear: '准备页和工具清单清楚',
  step_guidance_clear: '分步跟练清楚',
  completion_page_satisfying: '完成页有反馈感',
  mobile_demo_usable: '移动端 demo 可用',
  trial_content_quality: '试用内容质量足够',
  operator_workflow_explainable: 'Operator workflow 可解释',
  photo_to_template_boundary_clear: 'Photo-to-template 边界清楚',
  forbidden_claims_absent: '没有自动化 / 发布 / registry 禁用断言',
  privacy_boundary_clear: '隐私边界清楚',
  next_iteration_decision_ready: '下一轮迭代判断可执行',
};

const createCheck = (
  id: FounderDemoReviewCheckId,
  area: FounderDemoReviewCheckArea,
  passed: boolean,
  severity: FounderDemoReviewSeverity,
  message: string,
): FounderDemoReviewCheck => ({
  id,
  label: checkLabels[id],
  area,
  passed,
  severity,
  message,
});

const packText = (pack: MvpTrialContentPack): string =>
  [
    ...pack.templates.flatMap((template) => [
      template.title,
      template.summary,
      ...template.suitableScenarios,
      ...template.toolsChecklist,
      ...template.productPlaceholders,
      ...template.steps.flatMap((step) => [
        step.goal,
        step.instruction,
        step.beginnerTip,
        ...step.commonMistakes,
        ...step.correctionTips,
      ]),
      ...template.completionReview,
    ]),
  ].join(' ');

const toIssue = (check: FounderDemoReviewCheck): FounderDemoReviewIssue => {
  let recommendation: FounderDemoReviewRecommendation =
    'run_founder_review_with_warnings';

  if (check.id === 'trial_content_quality') {
    recommendation = 'revise_trial_content_before_founder_review';
  } else if (
    [
      'user_app_first_impression',
      'template_selection_clear',
      'template_detail_understandable',
      'preparation_page_clear',
      'step_guidance_clear',
      'completion_page_satisfying',
      'mobile_demo_usable',
    ].includes(check.id)
  ) {
    recommendation = 'revise_user_app_demo_path_before_founder_review';
  } else if (
    [
      'operator_workflow_explainable',
      'photo_to_template_boundary_clear',
      'forbidden_claims_absent',
      'privacy_boundary_clear',
    ].includes(check.id)
  ) {
    recommendation = 'clarify_boundary_before_founder_review';
  }

  return {
    id: `${check.id}-${check.severity}`,
    checkId: check.id,
    severity: check.severity,
    message: check.message,
    recommendation,
  };
};

export const createFounderDemoReviewReport = ({
  reviewId = 'founder-demo-review-13a',
  contentPack,
  acceptanceTrial,
  userAppFirstImpression = true,
  templateSelectionClear = true,
  templateDetailUnderstandable = true,
  preparationPageClear = true,
  stepGuidanceClear = true,
  completionPageSatisfying = true,
  mobileDemoUsable = true,
  operatorWorkflowExplainable = true,
  photoToTemplateBoundaryClear = true,
  privacyBoundaryClear = true,
  nextIterationDecisionReady = true,
  ordinaryUserPathInternalTermsHidden = true,
  founderClaimText = '',
}: CreateFounderDemoReviewReportInput): FounderDemoReviewReport => {
  const completeTrialTemplateCount =
    countCompleteMvpTrialTemplates(contentPack);
  const trialTemplateCount = contentPack.templates.length;
  const combinedClaimText = `${founderClaimText} ${packText(contentPack)}`;
  const internalTermsHidden =
    ordinaryUserPathInternalTermsHidden &&
    !INTERNAL_TERMS_PATTERN.test(founderClaimText);
  const forbiddenClaimsAbsent =
    !FORBIDDEN_CLAIM_PATTERN.test(combinedClaimText);

  const userPathComplete =
    userAppFirstImpression &&
    templateSelectionClear &&
    templateDetailUnderstandable &&
    preparationPageClear &&
    stepGuidanceClear &&
    completionPageSatisfying &&
    mobileDemoUsable &&
    internalTermsHidden;

  const contentBoundarySafe =
    contentPack.registryChainPausedAfter10U &&
    contentPack.trialContentNotOfficialTemplateLibrary &&
    contentPack.noRealUserPhotoIncluded &&
    contentPack.noRegistryWrite &&
    contentPack.noPublish;

  const trialContentPassed =
    completeTrialTemplateCount >= 2 && contentBoundarySafe;
  const trialContentSeverity: FounderDemoReviewSeverity =
    completeTrialTemplateCount === 0 || !contentBoundarySafe
      ? 'blocking'
      : 'warning';

  const checks: FounderDemoReviewCheck[] = [
    createCheck(
      'user_app_first_impression',
      'user_app',
      userAppFirstImpression && internalTermsHidden,
      'blocking',
      userAppFirstImpression && internalTermsHidden
        ? '用户默认路径第一屏可以解释这是什么。'
        : '用户默认路径不完整，或暴露了 Founder Demo Review / registry / Template Studio 等后台术语。',
    ),
    createCheck(
      'template_selection_clear',
      'user_app',
      templateSelectionClear,
      'blocking',
      templateSelectionClear
        ? '用户可以看懂并选择试用模板。'
        : '模板选择路径不清楚，Founder Demo 前需要修正。',
    ),
    createCheck(
      'template_detail_understandable',
      'user_app',
      templateDetailUnderstandable,
      'blocking',
      templateDetailUnderstandable
        ? '模板详情使用普通用户能理解的语言。'
        : '模板详情仍不够用户化。',
    ),
    createCheck(
      'preparation_page_clear',
      'user_app',
      preparationPageClear,
      'blocking',
      preparationPageClear
        ? '准备页和工具清单可以支持跟练。'
        : '准备页缺失或工具清单不清楚。',
    ),
    createCheck(
      'step_guidance_clear',
      'user_app',
      stepGuidanceClear,
      'blocking',
      stepGuidanceClear
        ? '分步跟练文案清楚且适合触控。'
        : '分步跟练不足以支撑 Founder Demo。',
    ),
    createCheck(
      'completion_page_satisfying',
      'user_app',
      completionPageSatisfying,
      'warning',
      completionPageSatisfying
        ? '完成页能给出基本反馈感。'
        : '完成页反馈感不足，可带 warning 进入 demo。',
    ),
    createCheck(
      'mobile_demo_usable',
      'user_app',
      mobileDemoUsable,
      'blocking',
      mobileDemoUsable
        ? '移动端路径可用于演示。'
        : '移动端路径不可用，Founder Demo 应阻断。',
    ),
    createCheck(
      'trial_content_quality',
      'trial_content',
      trialContentPassed,
      trialContentSeverity,
      trialContentPassed
        ? `试用内容包含 ${completeTrialTemplateCount} 套完整模板，可支撑 founder review。`
        : completeTrialTemplateCount === 1
          ? '试用内容只有 1 套完整模板，建议补到至少 2 套后再做 founder review。'
          : '试用内容不足或越过 registry / publish / official library 边界。',
    ),
    createCheck(
      'operator_workflow_explainable',
      'operator_workflow',
      operatorWorkflowExplainable &&
        acceptanceTrial.status !== 'acceptance_trial_blocked',
      'warning',
      operatorWorkflowExplainable &&
        acceptanceTrial.status !== 'acceptance_trial_blocked'
        ? 'Photo-to-template operator workflow 可以解释给 founder。'
        : 'Operator workflow 仍有阻断或解释成本较高。',
    ),
    createCheck(
      'photo_to_template_boundary_clear',
      'boundary',
      photoToTemplateBoundaryClear &&
        acceptanceTrial.registryChainPausedAfter10U &&
        acceptanceTrial.registryWriteBlocked &&
        acceptanceTrial.publishBlocked,
      'blocking',
      photoToTemplateBoundaryClear
        ? '边界清楚：半自动草稿、人工审核、10U 后 registry 链暂停。'
        : 'Photo-to-template 边界不清楚，容易被误解为自动生成正式模板。',
    ),
    createCheck(
      'forbidden_claims_absent',
      'boundary',
      forbiddenClaimsAbsent,
      'blocking',
      forbiddenClaimsAbsent
        ? '没有全自动、已发布、registry written、production ready、AI confirmed 等禁用断言。'
        : '出现全自动 / 发布 / registry / production / 医疗或色号硬断言，Founder Demo 必须阻断。',
    ),
    createCheck(
      'privacy_boundary_clear',
      'privacy',
      privacyBoundaryClear && contentPack.noRealUserPhotoIncluded,
      'blocking',
      privacyBoundaryClear && contentPack.noRealUserPhotoIncluded
        ? '隐私边界清楚：不上传照片、不保存真实用户资料、不训练。'
        : '隐私边界不清楚或试用内容含真实照片风险。',
    ),
    createCheck(
      'next_iteration_decision_ready',
      'decision',
      nextIterationDecisionReady,
      'warning',
      nextIterationDecisionReady
        ? 'Founder Demo 后可以进入反馈捕获和 MVP gap prioritization。'
        : 'Demo 后的下一步判断还不够清楚。',
    ),
  ];

  const issues = checks.filter((check) => !check.passed).map(toIssue);
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const hasWarningIssue = issues.some((issue) => issue.severity === 'warning');

  let status: FounderDemoReviewStatus = 'founder_review_ready';
  let decision: FounderDemoReviewDecision = 'ready_for_founder_demo_review';
  const recommendations = new Set<FounderDemoReviewRecommendation>([
    'ready_for_phase_13b_feedback_capture',
  ]);

  if (hasBlockingIssue || !userPathComplete) {
    status = 'founder_review_blocked';
    decision = 'blocked_fix_before_founder_demo_review';
    recommendations.clear();
    recommendations.add('keep_as_internal_demo_only');
    issues.forEach((issue) => recommendations.add(issue.recommendation));
  } else if (hasWarningIssue) {
    status = 'founder_review_ready_with_warnings';
    decision = 'ready_with_warnings_for_founder_demo_review';
    recommendations.add('run_founder_review_with_warnings');
    issues.forEach((issue) => recommendations.add(issue.recommendation));
  }

  const report: FounderDemoReviewReport = {
    reviewId,
    status,
    decision,
    checks,
    issues,
    recommendations: Array.from(recommendations),
    trialContentPackId: contentPack.packId,
    trialTemplateCount,
    completeTrialTemplateCount,
    recommendedTemplateTitles: contentPack.templates.map(
      (template) => template.title,
    ),
    demoRoutes: acceptanceTrial.demoRoutes,
    sourceAcceptanceTrialId: acceptanceTrial.trialId,
    founderReviewNotProductionReadiness: true,
    trialContentNotOfficialTemplateLibrary: true,
    semiAutomaticDraftHumanReviewRequired: true,
    registryChainPausedAfter10U: true,
    realWriteAuthorizationPaused: true,
    registryWriteBlocked: true,
    registryMutationBlocked: true,
    publishBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    noBackendCameraArAiTrainingScope: true,
    noRealUserPhotoOrPersonalData: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase:
      'Phase 13B - Founder Trial Feedback Capture & MVP Gap Prioritization',
  };

  report.jsonRoundTripStable =
    JSON.stringify(JSON.parse(JSON.stringify(report))) === JSON.stringify(report);

  return report;
};
