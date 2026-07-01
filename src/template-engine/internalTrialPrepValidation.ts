import type { InternalTrialPrepReport } from './internalTrialPrep';

export type InternalTrialPrepValidationStatus =
  | 'internal_trial_prep_ready'
  | 'internal_trial_prep_ready_with_warnings'
  | 'internal_trial_prep_blocked';

export type InternalTrialPrepValidationCheckId =
  | 'trial_prep_report_not_blocked'
  | 'participant_profiles_are_roles_only'
  | 'no_personal_data'
  | 'no_contact_collection'
  | 'no_real_photo_storage'
  | 'no_base64_or_local_photo_path'
  | 'no_analytics_scope'
  | 'no_backend_scope'
  | 'no_database_scope'
  | 'no_registry_write'
  | 'no_publish'
  | 'no_production_writer'
  | 'no_user_app_shell_replacement'
  | 'no_fully_automatic_extraction_claim'
  | 'no_ai_confirmed_claim'
  | 'trial_routes_defined'
  | 'feedback_prompts_safe'
  | 'json_round_trip_safe';

export interface InternalTrialPrepValidationCheck {
  id: InternalTrialPrepValidationCheckId;
  label: string;
  passed: boolean;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface InternalTrialPrepValidationIssue {
  issueId: string;
  checkId: InternalTrialPrepValidationCheckId;
  severity: 'warning' | 'blocking';
  message: string;
}

export interface InternalTrialPrepValidationResult {
  validationId: string;
  sourceReportId: string;
  status: InternalTrialPrepValidationStatus;
  checks: InternalTrialPrepValidationCheck[];
  issues: InternalTrialPrepValidationIssue[];
  safeParticipantProfiles: string[];
  safeFeedbackPromptIds: string[];
  blockedReasons: string[];
  warnings: string[];
  nextAction:
    | 'proceed_to_internal_trial_dry_run'
    | 'revise_internal_trial_prep'
    | 'keep_founder_only';
  jsonRoundTripStable: boolean;
}

const forbiddenPersonalDataPattern =
  /real name|真实姓名|姓名|phone|电话|email|邮箱|contact|联系方式|社交账号|social media|address|住址|precise address|analytics id|biometric|face embedding|健康|health|皮肤敏感|sensitive identity/i;
const forbiddenPhotoPattern =
  /face photo|makeup photo|真实照片|照片|photo upload|上传照片|raw camera|camera data|image bytes|base64|data:image|blob:|object url|\/Users\/|C:\\\\|local photo path|本地照片路径/i;
const fullyAutomaticPattern =
  /fully automatic extraction|fully automatic high-quality|全自动高质量|自动准确拆妆|自动高质量拆妆/i;
const aiConfirmedPattern = /AI confirmed|AI 已确认|AI 自动确认|自动确认/i;

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
  id: InternalTrialPrepValidationCheckId,
  label: string,
  passed: boolean,
  severity: 'warning' | 'blocking',
  message: string,
): InternalTrialPrepValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

export const validateInternalTrialPrep = (
  report: InternalTrialPrepReport,
): InternalTrialPrepValidationResult => {
  const participantText = collectText(
    report.participantProfiles.map((profile) => ({
      id: profile.id,
      label: profile.label,
      purpose: profile.purpose,
      allowedObservation: profile.allowedObservation,
    })),
  );
  const promptText = collectText(
    report.feedbackPrompts.map((prompt) => ({
      id: prompt.id,
      question: prompt.question,
      promptType: prompt.promptType,
    })),
  );
  const reportText = collectText({
    operatorSummary: report.operatorSummary,
    nextAction: report.nextAction,
    routes: report.trialRoutes,
    risks: report.risks,
  });

  const routeIds = report.trialRoutes.map((route) => route.id);
  const requiredRoutes = [
    'user_app_mvp_trial',
    'mobile_demo_trial',
    'template_content_review',
    'photo_to_template_operator_demo',
    'boundary_understanding_check',
  ];

  const promptsSafe =
    report.feedbackPrompts.length > 0 &&
    report.feedbackPrompts.every(
      (prompt) =>
        prompt.safeToRecord &&
        !forbiddenPersonalDataPattern.test(prompt.question) &&
        !forbiddenPhotoPattern.test(prompt.question),
    );

  const checks: InternalTrialPrepValidationCheck[] = [
    makeCheck(
      'trial_prep_report_not_blocked',
      'Trial prep report not blocked',
      report.status !== 'trial_prep_blocked' &&
        report.trialRoutes.every((route) => route.status !== 'trial_prep_blocked'),
      'blocking',
      'Internal trial prep report 或 trial route 仍被阻断，不能进入 dry run。',
    ),
    makeCheck(
      'participant_profiles_are_roles_only',
      'Participant profiles are roles only',
      report.participantProfiles.length > 0 &&
        report.participantProfiles.every((profile) => profile.roleOnly) &&
        !forbiddenPersonalDataPattern.test(participantText),
      'blocking',
      '参与者只能是角色画像，不能包含真实姓名、联系方式、健康/敏感身份或个人资料。',
    ),
    makeCheck(
      'no_personal_data',
      'No personal data',
      report.noRealNames && report.noBiometricIdOrFaceEmbedding && !forbiddenPersonalDataPattern.test(promptText),
      'blocking',
      '14B 不得收集真实姓名、身份资料、健康敏感信息、生物识别或 face embedding。',
    ),
    makeCheck(
      'no_contact_collection',
      'No contact collection',
      report.noContactCollection && !/phone|电话|email|邮箱|contact|联系方式|社交账号|social media/i.test(promptText),
      'blocking',
      '14B 不得收集电话、邮箱、社交账号或其他联系方式。',
    ),
    makeCheck(
      'no_real_photo_storage',
      'No real photo storage',
      report.noRealPhotos && !forbiddenPhotoPattern.test(promptText),
      'blocking',
      '14B 不得要求上传、保存或记录真实照片。',
    ),
    makeCheck(
      'no_base64_or_local_photo_path',
      'No base64 or local photo path',
      report.noBase64OrLocalPhotoPath && !/base64|data:image|blob:|object url|\/Users\/|C:\\\\|本地照片路径/i.test(reportText),
      'blocking',
      '14B 不得记录 base64、object URL 或本地照片路径。',
    ),
    makeCheck(
      'no_analytics_scope',
      'No analytics scope',
      report.noAnalytics && !/analytics id|埋点 id|tracking id/i.test(reportText),
      'blocking',
      '14B 不得接 analytics 或创建 analytics id。',
    ),
    makeCheck(
      'no_backend_scope',
      'No backend scope',
      report.noBackend && !/backend form|后端表单|server collection/i.test(reportText),
      'blocking',
      '14B 不得接 backend 或后端表单。',
    ),
    makeCheck(
      'no_database_scope',
      'No database scope',
      report.noDatabase && !/database table|数据库表|db record/i.test(reportText),
      'blocking',
      '14B 不得接 database 或写数据库记录。',
    ),
    makeCheck(
      'no_registry_write',
      'No registry write',
      report.noRegistryWrite && report.noRegistryMutation,
      'blocking',
      '14B 不得写 registry 或 mutation registry。',
    ),
    makeCheck(
      'no_publish',
      'No publish',
      report.noPublish,
      'blocking',
      '14B 不得 publish 或声称发布。',
    ),
    makeCheck(
      'no_production_writer',
      'No production writer',
      report.noProductionWriter,
      'blocking',
      '14B 不得创建 production writer。',
    ),
    makeCheck(
      'no_user_app_shell_replacement',
      'No User App Shell replacement',
      report.noUserAppShellReplacement,
      'blocking',
      '14B 不得替换当前 User App Shell。',
    ),
    makeCheck(
      'no_fully_automatic_extraction_claim',
      'No fully automatic extraction claim',
      report.noFullyAutomaticExtractionClaim && !fullyAutomaticPattern.test(reportText),
      'blocking',
      '14B 不能声称 fully automatic high-quality makeup extraction。',
    ),
    makeCheck(
      'no_ai_confirmed_claim',
      'No AI confirmed claim',
      report.noAiConfirmedClaim && !aiConfirmedPattern.test(reportText),
      'blocking',
      '14B 不能声称 AI confirmed。',
    ),
    makeCheck(
      'trial_routes_defined',
      'Trial routes defined',
      requiredRoutes.every((routeId) => routeIds.includes(routeId as never)),
      'blocking',
      '试用路线必须覆盖 User App、mobile、template content、operator demo 和 boundary check，且不能引入后端/registry/publish 执行范围。',
    ),
    makeCheck(
      'feedback_prompts_safe',
      'Feedback prompts safe',
      promptsSafe,
      'blocking',
      '反馈问题只能记录匿名理解、困惑、偏好和可用性备注，不能要求个人信息、照片或健康敏感信息。',
    ),
    makeCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      report.jsonRoundTripStable && jsonRoundTripStable(report),
      'warning',
      'Internal trial prep report 必须 JSON round-trip 稳定。',
    ),
  ];

  const issues = checks
    .filter((check) => !check.passed)
    .map(
      (check): InternalTrialPrepValidationIssue => ({
        issueId: `${check.id}-${check.severity}`,
        checkId: check.id,
        severity: check.severity,
        message: check.message,
      }),
    );

  const hasBlocking = issues.some((issue) => issue.severity === 'blocking');
  const warnings = issues
    .filter((issue) => issue.severity === 'warning')
    .map((issue) => issue.message);
  const status: InternalTrialPrepValidationStatus = hasBlocking
    ? 'internal_trial_prep_blocked'
    : warnings.length > 0 || report.status === 'trial_prep_ready_with_warnings'
      ? 'internal_trial_prep_ready_with_warnings'
      : 'internal_trial_prep_ready';

  const result: InternalTrialPrepValidationResult = {
    validationId: `${report.reportId}-validation`,
    sourceReportId: report.reportId,
    status,
    checks,
    issues,
    safeParticipantProfiles: report.participantProfiles
      .filter((profile) => profile.roleOnly)
      .map((profile) => profile.id),
    safeFeedbackPromptIds: report.feedbackPrompts
      .filter((prompt) => prompt.safeToRecord)
      .map((prompt) => prompt.id),
    blockedReasons: issues
      .filter((issue) => issue.severity === 'blocking')
      .map((issue) => issue.message),
    warnings,
    nextAction: hasBlocking
      ? 'keep_founder_only'
      : status === 'internal_trial_prep_ready_with_warnings'
        ? 'revise_internal_trial_prep'
        : 'proceed_to_internal_trial_dry_run',
    jsonRoundTripStable: false,
  };

  return {
    ...result,
    jsonRoundTripStable: jsonRoundTripStable(result),
  };
};
