import type { UserAppPackageDraftPreview } from './userAppPackageDraftPreview';

export type UserAppPackageDraftPreviewValidationSeverity = 'info' | 'warning' | 'blocking';

export type UserAppPackageDraftPreviewValidationStatus =
  | 'draft_preview_validation_ready'
  | 'draft_preview_validation_ready_with_warnings'
  | 'draft_preview_validation_blocked';

export type UserAppPackageDraftPreviewValidationCheckId =
  | 'source_contract_ready'
  | 'title_summary_user_facing'
  | 'steps_user_comprehensible'
  | 'region_guidance_user_safe'
  | 'tools_checklist_ready'
  | 'product_placeholders_safe'
  | 'privacy_notice_present'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_auto_publish'
  | 'no_registry_write'
  | 'no_user_app_template_package_mutation'
  | 'json_round_trip_safe';

export interface UserAppPackageDraftPreviewValidationCheck {
  id: UserAppPackageDraftPreviewValidationCheckId;
  label: string;
  passed: boolean;
  severity: UserAppPackageDraftPreviewValidationSeverity;
  message: string;
}

export interface UserAppPackageDraftPreviewValidationIssue {
  id: string;
  checkId: UserAppPackageDraftPreviewValidationCheckId;
  severity: Exclude<UserAppPackageDraftPreviewValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface UserAppPackageDraftPreviewValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_official_user_app_package_draft_gate'
    | 'request_draft_preview_revision'
    | 'block_user_app_package_creation';
}

export interface UserAppPackageDraftPreviewValidationResult {
  status: UserAppPackageDraftPreviewValidationStatus;
  checks: UserAppPackageDraftPreviewValidationCheck[];
  issues: UserAppPackageDraftPreviewValidationIssue[];
  recommendations: UserAppPackageDraftPreviewValidationRecommendation[];
  jsonRoundTripStable: boolean;
  readyForOfficialUserAppPackageDraftGate: boolean;
  previewOnly: true;
  notFormalUserAppTemplatePackage: true;
  notPublished: true;
  noUserAppPackageRegistryWrite: true;
}

const rawImageReferencePattern =
  /data:image|blob:|object URL|base64|\/Users\/|\/private\/|[A-Z]:\\|file:\/\/|face_landmarker\.task|vision_wasm/i;
const personalDataPattern =
  /真实姓名|手机号|邮箱|联系方式|身份证|健康信息|过敏|faceEmbedding|biometricId|biometric identifier|raw camera/i;
const medicalClaimPattern = /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos/i;
const shadeClaimPattern = /色号|shade\s*#?|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s/i;
const finalClaimPattern =
  /最终识别完成|最终识别为|最终结果|final result|final recognition|final approval|AI 已确认/i;
const autoPublishPattern = /自动发布|已发布到用户 App|已上线|production ready|published to user app/i;
const userAppMutationPattern =
  /user_app_template_package_mutation|generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|"appTemplateId"\s*:|UserAppTemplatePackage mutation|正式 UserAppTemplatePackage 已生成/i;

const createCheck = (
  id: UserAppPackageDraftPreviewValidationCheckId,
  label: string,
  passed: boolean,
  severity: UserAppPackageDraftPreviewValidationSeverity,
  message: string,
): UserAppPackageDraftPreviewValidationCheck => ({ id, label, passed, severity, message });

const issueForCheck = (
  check: UserAppPackageDraftPreviewValidationCheck,
  recommendation: string,
): UserAppPackageDraftPreviewValidationIssue | null => {
  if (check.passed || check.severity === 'info') {
    return null;
  }
  return {
    id: `${check.id}_${check.severity}`,
    checkId: check.id,
    severity: check.severity,
    message: check.message,
    recommendation,
  };
};

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const validateUserAppPackageDraftPreview = (
  preview: UserAppPackageDraftPreview,
): UserAppPackageDraftPreviewValidationResult => {
  const jsonRoundTripStable = isJsonRoundTripStable(preview);
  const sourceReady =
    preview.trace.source.contractValidationStatus === 'app_contract_validation_ready' ||
    preview.trace.source.contractValidationStatus === 'app_contract_validation_ready_with_warnings';
  const payloadText = JSON.stringify({
    titlePreview: preview.titlePreview,
    summaryPreview: preview.summaryPreview,
    styleTagsPreview: preview.styleTagsPreview,
    difficultyPreview: preview.difficultyPreview,
    estimatedTimePreview: preview.estimatedTimePreview,
    suitableScenariosPreview: preview.suitableScenariosPreview,
    toolsChecklistPreview: preview.toolsChecklistPreview,
    productPlaceholderPreview: preview.productPlaceholderPreview,
    stepGuidancePreview: preview.stepGuidancePreview,
    regionGuidancePreview: preview.regionGuidancePreview,
    userFacingCopyPreview: preview.userFacingCopyPreview,
    privacyNoticePreview: preview.privacyNoticePreview,
  });

  const checks: UserAppPackageDraftPreviewValidationCheck[] = [
    createCheck(
      'source_contract_ready',
      'Source contract ready',
      sourceReady && preview.previewStatus !== 'draft_preview_blocked',
      'blocking',
      'Draft preview requires app contract validation ready or ready with warnings.',
    ),
    createCheck(
      'title_summary_user_facing',
      'Title and summary user-facing',
      preview.titlePreview.trim().length > 0 && preview.summaryPreview.trim().length > 0,
      'blocking',
      'Draft preview requires user-facing title and summary copy.',
    ),
    createCheck(
      'steps_user_comprehensible',
      'Steps user comprehensible',
      preview.stepGuidancePreview.length > 0,
      'blocking',
      'Draft preview requires step guidance users can follow.',
    ),
    createCheck(
      'region_guidance_user_safe',
      'Region guidance safe',
      preview.regionGuidancePreview.length > 0,
      'blocking',
      'Draft preview requires reviewed region guidance.',
    ),
    createCheck(
      'tools_checklist_ready',
      'Tools checklist ready',
      preview.toolsChecklistPreview.length > 0,
      'warning',
      'Tool checklist should be visible in user-facing preview.',
    ),
    createCheck(
      'product_placeholders_safe',
      'Product placeholders safe',
      preview.productPlaceholderPreview.length > 0,
      'warning',
      'Product suggestions should remain category placeholders.',
    ),
    createCheck(
      'privacy_notice_present',
      'Privacy notice present',
      preview.privacyNoticePreview.includes('不上传') &&
        preview.privacyNoticePreview.includes('不训练') &&
        preview.privacyNoticePreview.includes('不生成正式 UserAppTemplatePackage'),
      'blocking',
      'Draft preview requires local-only, no-upload, no-training, preview-only privacy copy.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      preview.trace.noRawImageReference && !rawImageReferencePattern.test(payloadText),
      'blocking',
      'Draft preview must not contain image bytes, object URLs, base64, local paths, or MediaPipe asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      preview.trace.noPersonalData && !personalDataPattern.test(payloadText),
      'blocking',
      'Draft preview must not contain real names, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      !medicalClaimPattern.test(payloadText) && !finalClaimPattern.test(payloadText),
      'blocking',
      'Draft preview must not contain medical, diagnosis, treatment, final recognition, or AI confirmation claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      !shadeClaimPattern.test(payloadText),
      'blocking',
      'Draft preview must not contain specific brand or shade claims.',
    ),
    createCheck(
      'no_auto_publish',
      'No auto publish',
      preview.notPublished && preview.trace.noAutoPublish && !autoPublishPattern.test(payloadText),
      'blocking',
      'Draft preview must not publish to the user app.',
    ),
    createCheck(
      'no_registry_write',
      'No registry write',
      preview.noUserAppPackageRegistryWrite && preview.trace.noUserAppPackageRegistryWrite,
      'blocking',
      'Draft preview must not write a user app package registry.',
    ),
    createCheck(
      'no_user_app_template_package_mutation',
      'No UserAppTemplatePackage mutation',
      preview.notFormalUserAppTemplatePackage &&
        preview.formalUserAppTemplatePackageGenerationBlocked &&
        preview.trace.noFormalUserAppTemplatePackageGenerated &&
        !userAppMutationPattern.test(payloadText),
      'blocking',
      'Draft preview must not generate or mutate a formal UserAppTemplatePackage.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Draft preview must survive JSON round-trip unchanged.',
    ),
  ];

  const recommendationsByCheck: Record<UserAppPackageDraftPreviewValidationCheckId, string> = {
    source_contract_ready: 'Use a 10D app contract validation ready source.',
    title_summary_user_facing: 'Revise title and summary for user-facing preview.',
    steps_user_comprehensible: 'Add reviewed step guidance before handoff.',
    region_guidance_user_safe: 'Add reviewed region guidance before handoff.',
    tools_checklist_ready: 'Add a tool checklist for preview completeness.',
    product_placeholders_safe: 'Keep products as category placeholders.',
    privacy_notice_present: 'Restore local-only, no-upload, no-training privacy copy.',
    no_raw_image_reference: 'Remove raw image references and runtime asset names.',
    no_personal_data: 'Remove personal, health, contact, sensitive identity, or biometric data.',
    no_medical_claims: 'Remove medical, final, and AI-confirmation claims.',
    no_product_shade_claims: 'Remove product shade and brand-specific claims.',
    no_auto_publish: 'Keep this phase preview-only and do not publish.',
    no_registry_write: 'Do not write a user app package registry.',
    no_user_app_template_package_mutation: 'Defer formal UserAppTemplatePackage work to a later explicit gate.',
    json_round_trip_safe: 'Remove non-serializable values.',
  };

  const issues = [
    ...checks
      .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
      .filter((issue): issue is UserAppPackageDraftPreviewValidationIssue => Boolean(issue)),
    ...preview.blockedReasons.map((reason): UserAppPackageDraftPreviewValidationIssue => ({
      id: `preview_${reason.id}`,
      checkId: 'source_contract_ready',
      severity: 'blocking',
      message: reason.message,
      recommendation: reason.recommendation,
    })),
  ];
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning =
    preview.previewStatus === 'draft_preview_ready_with_warnings' ||
    preview.warnings.length > 0 ||
    issues.some((issue) => issue.severity === 'warning');
  const status: UserAppPackageDraftPreviewValidationStatus = hasBlockingIssue
    ? 'draft_preview_validation_blocked'
    : hasWarning
      ? 'draft_preview_validation_ready_with_warnings'
      : 'draft_preview_validation_ready';

  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: hasBlockingIssue ? 'block_user_app_package_creation' : 'official_draft_gate_next',
        message: hasBlockingIssue
          ? '用户 App 包草稿预览未通过，不能进入正式用户 App 包草稿准备。'
          : '草稿预览可进入正式用户 App 包草稿 gate；这仍不是正式 UserAppTemplatePackage。',
        action: hasBlockingIssue
          ? 'block_user_app_package_creation'
          : hasWarning
            ? 'request_draft_preview_revision'
            : 'continue_to_official_user_app_package_draft_gate',
      },
    ],
    jsonRoundTripStable,
    readyForOfficialUserAppPackageDraftGate: !hasBlockingIssue,
    previewOnly: true,
    notFormalUserAppTemplatePackage: true,
    notPublished: true,
    noUserAppPackageRegistryWrite: true,
  };
};
