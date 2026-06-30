import type {
  InternalFounderDemoRunReport,
  InternalFounderDemoRouteId,
} from './internalFounderDemoRun';

export type InternalFounderDemoRunValidationStatus =
  | 'demo_run_ready'
  | 'demo_run_ready_with_warnings'
  | 'demo_run_blocked';

export type InternalFounderDemoRunValidationCheckId =
  | 'route_a_user_app_complete'
  | 'route_b_vision_analysis_explainable'
  | 'route_c_operator_workflow_explainable'
  | 'route_d_mobile_demo_usable'
  | 'route_e_boundary_explanation_clear'
  | 'no_registry_write'
  | 'no_publish'
  | 'no_production_writer'
  | 'no_user_app_shell_replacement'
  | 'no_real_user_data_collection'
  | 'no_fully_automatic_extraction_claim'
  | 'no_ai_confirmed_claim'
  | 'ordinary_user_path_internal_terms_hidden'
  | 'json_round_trip_safe';

export interface InternalFounderDemoRunValidationCheck {
  id: InternalFounderDemoRunValidationCheckId;
  label: string;
  passed: boolean;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface InternalFounderDemoRunValidationIssue {
  issueId: string;
  checkId: InternalFounderDemoRunValidationCheckId;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface InternalFounderDemoRunValidationResult {
  validationId: string;
  sourceReportId: string;
  status: InternalFounderDemoRunValidationStatus;
  checks: InternalFounderDemoRunValidationCheck[];
  issues: InternalFounderDemoRunValidationIssue[];
  readyRoutes: InternalFounderDemoRouteId[];
  blockedRoutes: InternalFounderDemoRouteId[];
  warnings: string[];
  nextAction:
    | 'proceed_to_internal_trial_prep'
    | 'run_second_gap_resolution_sprint'
    | 'keep_as_demo_only';
  jsonRoundTripStable: boolean;
}

const routeIdForCheck: Record<
  Extract<
    InternalFounderDemoRunValidationCheckId,
    | 'route_a_user_app_complete'
    | 'route_b_vision_analysis_explainable'
    | 'route_c_operator_workflow_explainable'
    | 'route_d_mobile_demo_usable'
    | 'route_e_boundary_explanation_clear'
  >,
  InternalFounderDemoRouteId
> = {
  route_a_user_app_complete: 'route_a_user_app_mvp',
  route_b_vision_analysis_explainable: 'route_b_vision_analysis',
  route_c_operator_workflow_explainable: 'route_c_template_studio_operator_workflow',
  route_d_mobile_demo_usable: 'route_d_mobile_demo',
  route_e_boundary_explanation_clear: 'route_e_boundary_explanation',
};

const fullyAutomaticClaimPattern =
  /fully automatic extraction|fully automatic high-quality|已能任意照片全自动高质量拆妆|自动准确拆妆|自动高质量拆妆/i;
const aiConfirmedClaimPattern =
  /AI confirmed|AI 已确认|auto confirmed|自动确认|AI 自动确认/i;

const collectText = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(collectText).join(' ');
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).map(collectText).join(' ');
  }
  return '';
};

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const makeCheck = (
  id: InternalFounderDemoRunValidationCheckId,
  label: string,
  passed: boolean,
  severity: 'warning' | 'blocking',
  message: string,
): InternalFounderDemoRunValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

export const validateInternalFounderDemoRun = (
  report: InternalFounderDemoRunReport,
): InternalFounderDemoRunValidationResult => {
  const routeById = new Map(report.routes.map((route) => [route.id, route]));
  const routeReady = (routeId: InternalFounderDemoRouteId) => {
    const route = routeById.get(routeId);
    return Boolean(route && route.status !== 'demo_blocked' && route.status !== 'not_run');
  };

  const text = collectText({
    summary: report.founderFacingSummary,
    finalFounderDecision: report.finalFounderDecision,
    routes: report.routes,
  });

  const checks: InternalFounderDemoRunValidationCheck[] = [
    makeCheck(
      'route_a_user_app_complete',
      'Route A User App MVP complete',
      routeReady(routeIdForCheck.route_a_user_app_complete),
      'blocking',
      '普通用户 MVP 路径必须可完整演示。',
    ),
    makeCheck(
      'route_b_vision_analysis_explainable',
      'Route B Vision Analysis explainable',
      routeReady(routeIdForCheck.route_b_vision_analysis_explainable),
      'blocking',
      '视觉分析必须可解释，且 Readiness Score 不可被误读为模型原始置信度。',
    ),
    makeCheck(
      'route_c_operator_workflow_explainable',
      'Route C operator workflow explainable',
      routeReady(routeIdForCheck.route_c_operator_workflow_explainable),
      'blocking',
      'Template Studio operator workflow 必须可解释且保留人工审核。',
    ),
    makeCheck(
      'route_d_mobile_demo_usable',
      'Route D mobile demo usable',
      routeReady(routeIdForCheck.route_d_mobile_demo_usable),
      'blocking',
      '移动端 founder demo 路径必须可用。',
    ),
    makeCheck(
      'route_e_boundary_explanation_clear',
      'Route E boundary explanation clear',
      routeReady(routeIdForCheck.route_e_boundary_explanation_clear),
      'blocking',
      '必须能清楚说明这不是发布、不是 production readiness、不是正式用户研究。',
    ),
    makeCheck(
      'no_registry_write',
      'No registry write',
      report.noRegistryWrite && report.noRegistryMutation,
      'blocking',
      '14A 不得写 registry，也不得 mutation registry。',
    ),
    makeCheck(
      'no_publish',
      'No publish',
      report.noPublish && report.notPublishReadiness,
      'blocking',
      '14A 不得发布或声称发布准备完成。',
    ),
    makeCheck(
      'no_production_writer',
      'No production writer',
      report.noProductionWriter,
      'blocking',
      '14A 不得创建或声称 production writer。',
    ),
    makeCheck(
      'no_user_app_shell_replacement',
      'No User App Shell replacement',
      report.noUserAppShellReplacement,
      'blocking',
      '14A 不得替换普通 User App Shell。',
    ),
    makeCheck(
      'no_real_user_data_collection',
      'No real user data collection',
      report.noRealUserPhotos &&
        report.noBase64OrLocalPhotoPath &&
        report.noPersonalData &&
        report.noRealUserFeedbackCollection &&
        report.noAnalytics,
      'blocking',
      '14A 不得收集真实照片、个人资料、本地图片路径、base64 或 analytics。',
    ),
    makeCheck(
      'no_fully_automatic_extraction_claim',
      'No fully automatic extraction claim',
      report.noFullyAutomaticExtractionClaim && !fullyAutomaticClaimPattern.test(text),
      'blocking',
      '14A 不能声称全自动高质量拆妆。',
    ),
    makeCheck(
      'no_ai_confirmed_claim',
      'No AI confirmed claim',
      report.noAiConfirmedClaim && !aiConfirmedClaimPattern.test(text),
      'blocking',
      '14A 不能声称 AI 已确认或自动确认。',
    ),
    makeCheck(
      'ordinary_user_path_internal_terms_hidden',
      'Ordinary user path internal terms hidden',
      report.ordinaryUserInternalTermLeaks.length === 0,
      'blocking',
      '普通用户路径不得暴露 Internal Founder Demo Run、demo blocker、registry 等后台术语。',
    ),
    makeCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      report.jsonRoundTripStable && jsonRoundTripStable(report),
      'warning',
      '报告必须 JSON round-trip 稳定。',
    ),
  ];

  const issues = checks
    .filter((check) => !check.passed)
    .map(
      (check): InternalFounderDemoRunValidationIssue => ({
        issueId: `${check.id}-${check.severity}`,
        checkId: check.id,
        severity: check.severity,
        message: check.message,
      }),
    );

  const blockedRoutes = report.routes
    .filter((route) => route.status === 'demo_blocked' || route.status === 'not_run')
    .map((route) => route.id);
  const readyRoutes = report.routes
    .filter((route) => route.status === 'demo_pass' || route.status === 'demo_pass_with_warnings')
    .map((route) => route.id);
  const warnings = [
    ...report.routes.flatMap((route) => route.warnings),
    ...issues.filter((issue) => issue.severity === 'warning').map((issue) => issue.message),
  ];
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const status: InternalFounderDemoRunValidationStatus = hasBlockingIssue
    ? 'demo_run_blocked'
    : warnings.length > 0 || report.status === 'demo_pass_with_warnings'
      ? 'demo_run_ready_with_warnings'
      : 'demo_run_ready';

  const result: InternalFounderDemoRunValidationResult = {
    validationId: `${report.reportId}-validation`,
    sourceReportId: report.reportId,
    status,
    checks,
    issues,
    readyRoutes,
    blockedRoutes,
    warnings,
    nextAction:
      status === 'demo_run_ready'
        ? 'proceed_to_internal_trial_prep'
        : status === 'demo_run_ready_with_warnings'
          ? 'keep_as_demo_only'
          : 'run_second_gap_resolution_sprint',
    jsonRoundTripStable: false,
  };

  result.jsonRoundTripStable = jsonRoundTripStable(result);

  return result;
};
