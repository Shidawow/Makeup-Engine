import type { UserAppPackageDraftPreview } from './userAppPackageDraftPreview';
import type { UserAppPackageDraftPreviewValidationResult } from './userAppPackageDraftPreviewValidation';

export type OfficialUserAppPackageDraftGateSeverity = 'info' | 'warning' | 'blocking';

export type OfficialUserAppPackageDraftGateStatus =
  | 'official_draft_gate_ready'
  | 'official_draft_gate_ready_with_warnings'
  | 'official_draft_gate_blocked'
  | 'official_draft_gate_example_only';

export type OfficialUserAppPackageDraftGateDecision =
  | 'eligible_for_official_user_app_package_draft_builder'
  | 'request_user_facing_copy_revision'
  | 'request_step_guidance_revision'
  | 'request_region_guidance_revision'
  | 'request_privacy_review'
  | 'keep_as_preview_only'
  | 'blocked_do_not_create_official_package_draft';

export type OfficialUserAppPackageDraftGateCheckId =
  | 'source_preview_validation_ready'
  | 'user_facing_title_summary_ready'
  | 'step_guidance_complete'
  | 'region_guidance_complete'
  | 'tools_checklist_ready'
  | 'privacy_notice_ready'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_registry_write'
  | 'no_auto_publish'
  | 'no_user_app_template_package_mutation'
  | 'user_app_contract_boundary_safe'
  | 'qa_human_review_candidate_contract_trace_preserved'
  | 'json_round_trip_safe';

export interface OfficialUserAppPackageDraftGateCheck {
  id: OfficialUserAppPackageDraftGateCheckId;
  label: string;
  passed: boolean;
  severity: OfficialUserAppPackageDraftGateSeverity;
  message: string;
}

export interface OfficialUserAppPackageDraftGateIssue {
  id: string;
  checkId: OfficialUserAppPackageDraftGateCheckId;
  severity: Exclude<OfficialUserAppPackageDraftGateSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface OfficialUserAppPackageDraftGateBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface OfficialUserAppPackageDraftGateTrace {
  sourcePreviewStatus: UserAppPackageDraftPreview['previewStatus'];
  sourcePreviewValidationStatus: UserAppPackageDraftPreviewValidationResult['status'];
  qaTracePreserved: boolean;
  humanReviewTracePreserved: boolean;
  candidateTracePreserved: boolean;
  contractTracePreserved: boolean;
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noFormalUserAppTemplatePackageGenerated: true;
  noUserAppPackageRegistryWrite: true;
  noAutoPublish: true;
}

export interface OfficialUserAppPackageDraftGateResult {
  gateId: string;
  sourcePreviewId: string;
  sourceContractPreparationId: string;
  sourceCandidatePackageId: string;
  status: OfficialUserAppPackageDraftGateStatus;
  decision: OfficialUserAppPackageDraftGateDecision;
  summary: string;
  checks: OfficialUserAppPackageDraftGateCheck[];
  issues: OfficialUserAppPackageDraftGateIssue[];
  warnings: OfficialUserAppPackageDraftGateIssue[];
  blockedReasons: OfficialUserAppPackageDraftGateBlockedReason[];
  trace: OfficialUserAppPackageDraftGateTrace;
  eligibleForOfficialUserAppPackageDraftBuilder: boolean;
  gateOnly: true;
  notFormalUserAppTemplatePackage: true;
  notPublished: true;
  noUserAppPackageRegistryWrite: true;
  formalUserAppTemplatePackageGenerationBlocked: true;
  jsonRoundTripStable: boolean;
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
  id: OfficialUserAppPackageDraftGateCheckId,
  label: string,
  passed: boolean,
  severity: OfficialUserAppPackageDraftGateSeverity,
  message: string,
): OfficialUserAppPackageDraftGateCheck => ({ id, label, passed, severity, message });

const createBoundaryCheck = (
  id: OfficialUserAppPackageDraftGateCheckId,
  label: string,
  passed: boolean,
  message: string,
): OfficialUserAppPackageDraftGateCheck => createCheck(id, label, passed, 'blocking', message);

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const issueForCheck = (
  check: OfficialUserAppPackageDraftGateCheck,
  recommendation: string,
): OfficialUserAppPackageDraftGateIssue | null => {
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

const decisionForIssues = (
  status: OfficialUserAppPackageDraftGateStatus,
  issues: OfficialUserAppPackageDraftGateIssue[],
): OfficialUserAppPackageDraftGateDecision => {
  if (status === 'official_draft_gate_example_only') {
    return 'keep_as_preview_only';
  }

  const checkIds = new Set(issues.map((issue) => issue.checkId));
  if (checkIds.has('step_guidance_complete')) {
    return 'request_step_guidance_revision';
  }
  if (checkIds.has('region_guidance_complete')) {
    return 'request_region_guidance_revision';
  }
  if (checkIds.has('user_facing_title_summary_ready')) {
    return 'request_user_facing_copy_revision';
  }
  if (
    checkIds.has('privacy_notice_ready') ||
    checkIds.has('no_raw_image_reference') ||
    checkIds.has('no_personal_data') ||
    checkIds.has('no_medical_claims') ||
    checkIds.has('no_product_shade_claims') ||
    checkIds.has('no_unsupported_final_claims')
  ) {
    return 'request_privacy_review';
  }
  if (issues.some((issue) => issue.severity === 'blocking')) {
    return 'blocked_do_not_create_official_package_draft';
  }
  if (issues.length > 0) {
    return 'request_user_facing_copy_revision';
  }
  return 'eligible_for_official_user_app_package_draft_builder';
};

export const createOfficialUserAppPackageDraftGate = ({
  preview,
  validation,
  gateId = `official-user-app-package-draft-gate-${preview.previewId}`,
}: {
  preview: UserAppPackageDraftPreview;
  validation: UserAppPackageDraftPreviewValidationResult;
  gateId?: string;
}): OfficialUserAppPackageDraftGateResult => {
  const sourcePreviewValidationReady =
    validation.status === 'draft_preview_validation_ready' ||
    validation.status === 'draft_preview_validation_ready_with_warnings';
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

  const tracesPreserved = {
    qa: preview.qaTrace.trim().length > 0,
    humanReview: preview.humanReviewTrace.trim().length > 0,
    candidate: preview.candidateTrace.trim().length > 0,
    contract: preview.contractTrace.trim().length > 0,
  };

  const titleSummaryReady =
    preview.titlePreview.trim().length > 0 && preview.summaryPreview.trim().length > 0;
  const titleSummaryThin =
    titleSummaryReady &&
    (preview.titlePreview.trim().length < 4 || preview.summaryPreview.trim().length < 12);
  const jsonRoundTripStable = isJsonRoundTripStable(preview) && validation.jsonRoundTripStable;

  const checks: OfficialUserAppPackageDraftGateCheck[] = [
    createBoundaryCheck(
      'source_preview_validation_ready',
      'Source preview validation ready',
      sourcePreviewValidationReady && preview.previewStatus !== 'draft_preview_blocked',
      'Official draft gate requires 10E draft preview validation ready or ready with warnings.',
    ),
    createCheck(
      'user_facing_title_summary_ready',
      'User-facing title and summary ready',
      titleSummaryReady && !titleSummaryThin,
      titleSummaryReady ? 'warning' : 'blocking',
      titleSummaryReady
        ? 'User-facing title or summary is thin and should be reviewed before the builder.'
        : 'Official draft gate requires user-facing title and summary copy.',
    ),
    createBoundaryCheck(
      'step_guidance_complete',
      'Step guidance complete',
      preview.stepGuidancePreview.length > 0,
      'Official draft gate requires complete step guidance.',
    ),
    createBoundaryCheck(
      'region_guidance_complete',
      'Region guidance complete',
      preview.regionGuidancePreview.length > 0,
      'Official draft gate requires reviewed region guidance.',
    ),
    createCheck(
      'tools_checklist_ready',
      'Tools checklist ready',
      preview.toolsChecklistPreview.length > 0,
      'warning',
      'Tools checklist should be complete before the official draft builder.',
    ),
    createBoundaryCheck(
      'privacy_notice_ready',
      'Privacy notice ready',
      preview.privacyNoticePreview.includes('不上传') &&
        preview.privacyNoticePreview.includes('不训练') &&
        (preview.privacyNoticePreview.includes('不生成正式 UserAppTemplatePackage') ||
          preview.privacyNoticePreview.includes('不是正式 UserAppTemplatePackage')),
      'Official draft gate requires no-upload, no-training, not-formal-package privacy copy.',
    ),
    createBoundaryCheck(
      'no_raw_image_reference',
      'No raw image reference',
      preview.trace.noRawImageReference && !rawImageReferencePattern.test(payloadText),
      'Official draft gate must not include raw image data, object URLs, local paths, or runtime asset names.',
    ),
    createBoundaryCheck(
      'no_personal_data',
      'No personal data',
      preview.trace.noPersonalData && !personalDataPattern.test(payloadText),
      'Official draft gate must not include names, contact, health, sensitive identity, or biometric data.',
    ),
    createBoundaryCheck(
      'no_medical_claims',
      'No medical claims',
      !medicalClaimPattern.test(payloadText),
      'Official draft gate must not include medical, diagnosis, or treatment claims.',
    ),
    createBoundaryCheck(
      'no_product_shade_claims',
      'No product shade claims',
      !shadeClaimPattern.test(payloadText),
      'Official draft gate must keep product suggestions as category placeholders.',
    ),
    createBoundaryCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      !finalClaimPattern.test(payloadText),
      'Official draft gate must not claim final recognition, final approval, or AI confirmation.',
    ),
    createBoundaryCheck(
      'no_registry_write',
      'No registry write',
      preview.noUserAppPackageRegistryWrite && preview.trace.noUserAppPackageRegistryWrite,
      'Official draft gate must not write a user app package registry.',
    ),
    createBoundaryCheck(
      'no_auto_publish',
      'No auto publish',
      preview.notPublished && preview.trace.noAutoPublish && !autoPublishPattern.test(payloadText),
      'Official draft gate must not publish to the user app.',
    ),
    createBoundaryCheck(
      'no_user_app_template_package_mutation',
      'No UserAppTemplatePackage mutation',
      preview.notFormalUserAppTemplatePackage &&
        preview.formalUserAppTemplatePackageGenerationBlocked &&
        preview.trace.noFormalUserAppTemplatePackageGenerated &&
        !userAppMutationPattern.test(payloadText),
      'Official draft gate must not generate or mutate a formal UserAppTemplatePackage.',
    ),
    createBoundaryCheck(
      'user_app_contract_boundary_safe',
      'User app contract boundary safe',
      preview.draftPreviewOnly &&
        preview.notFormalUserAppTemplatePackage &&
        preview.noUserAppPackageRegistryWrite &&
        preview.formalUserAppTemplatePackageGenerationBlocked,
      'Official draft gate must remain gate-only and must not cross the UserAppTemplatePackage boundary.',
    ),
    createBoundaryCheck(
      'qa_human_review_candidate_contract_trace_preserved',
      'QA, human review, candidate, and contract trace preserved',
      tracesPreserved.qa &&
        tracesPreserved.humanReview &&
        tracesPreserved.candidate &&
        tracesPreserved.contract,
      'Official draft gate requires QA, human review, candidate, and contract trace.',
    ),
    createBoundaryCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'Official draft gate input must survive JSON round-trip unchanged.',
    ),
  ];

  const recommendationsByCheck: Record<OfficialUserAppPackageDraftGateCheckId, string> = {
    source_preview_validation_ready: 'Return to Phase 10E preview validation and fix blocked checks first.',
    user_facing_title_summary_ready: 'Revise user-facing title and summary before the builder.',
    step_guidance_complete: 'Complete reviewed step guidance before the builder.',
    region_guidance_complete: 'Complete reviewed region guidance before the builder.',
    tools_checklist_ready: 'Complete the tools checklist for better user preview quality.',
    privacy_notice_ready: 'Restore no-upload, no-training, not-formal-package privacy copy.',
    no_raw_image_reference: 'Remove image bytes, object URLs, local paths, and runtime asset names.',
    no_personal_data: 'Remove personal, health, contact, sensitive identity, or biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, treatment, or skin-health claims.',
    no_product_shade_claims: 'Replace brand or shade claims with category placeholders.',
    no_unsupported_final_claims: 'Keep wording as draft, candidate, and human review only.',
    no_registry_write: 'Keep the gate local and do not write a user app package registry.',
    no_auto_publish: 'Keep the gate local and do not publish to the user app.',
    no_user_app_template_package_mutation: 'Defer formal UserAppTemplatePackage draft creation to a later explicit builder.',
    user_app_contract_boundary_safe: 'Keep this phase as a gate, not a formal package generator.',
    qa_human_review_candidate_contract_trace_preserved: 'Restore QA, human review, candidate, and contract trace before handoff.',
    json_round_trip_safe: 'Remove non-serializable values.',
  };

  const checkIssues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter((issue): issue is OfficialUserAppPackageDraftGateIssue => Boolean(issue));
  const validationIssues = validation.issues.map((issue): OfficialUserAppPackageDraftGateIssue => ({
    id: `source_validation_${issue.id}`,
    checkId: issue.checkId === 'json_round_trip_safe' ? 'json_round_trip_safe' : 'source_preview_validation_ready',
    severity: issue.severity,
    message: issue.message,
    recommendation: issue.recommendation,
  }));
  const previewWarnings = preview.warnings.map((warning): OfficialUserAppPackageDraftGateIssue => ({
    id: `preview_warning_${warning.id}`,
    checkId: 'source_preview_validation_ready',
    severity: 'warning',
    message: warning.message,
    recommendation: warning.recommendation,
  }));
  const issues = [...checkIssues, ...validationIssues, ...previewWarnings];
  const blockedReasons = issues
    .filter((issue) => issue.severity === 'blocking')
    .map((issue): OfficialUserAppPackageDraftGateBlockedReason => ({
      id: issue.id,
      message: issue.message,
      recommendation: issue.recommendation,
    }));
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const hasBlockingIssue = blockedReasons.length > 0;
  const hasWarning =
    warnings.length > 0 ||
    preview.previewStatus === 'draft_preview_ready_with_warnings' ||
    validation.status === 'draft_preview_validation_ready_with_warnings';
  const status: OfficialUserAppPackageDraftGateStatus =
    preview.previewStatus === 'draft_preview_example_only'
      ? 'official_draft_gate_example_only'
      : hasBlockingIssue
        ? 'official_draft_gate_blocked'
        : hasWarning
          ? 'official_draft_gate_ready_with_warnings'
          : 'official_draft_gate_ready';
  const decision = decisionForIssues(status, issues);

  const gate: OfficialUserAppPackageDraftGateResult = {
    gateId,
    sourcePreviewId: preview.previewId,
    sourceContractPreparationId: preview.sourceContractPreparationId,
    sourceCandidatePackageId: preview.sourceCandidatePackageId,
    status,
    decision,
    summary:
      status === 'official_draft_gate_ready'
        ? 'Gate passed: the preview is eligible for a future official User App package draft builder.'
        : 'Gate has warnings or blockers; no formal UserAppTemplatePackage has been created.',
    checks,
    issues,
    warnings,
    blockedReasons,
    trace: {
      sourcePreviewStatus: preview.previewStatus,
      sourcePreviewValidationStatus: validation.status,
      qaTracePreserved: tracesPreserved.qa,
      humanReviewTracePreserved: tracesPreserved.humanReview,
      candidateTracePreserved: tracesPreserved.candidate,
      contractTracePreserved: tracesPreserved.contract,
      noRawImageReference: preview.trace.noRawImageReference && !rawImageReferencePattern.test(payloadText),
      noPersonalData: preview.trace.noPersonalData && !personalDataPattern.test(payloadText),
      noFormalUserAppTemplatePackageGenerated: true,
      noUserAppPackageRegistryWrite: true,
      noAutoPublish: true,
    },
    eligibleForOfficialUserAppPackageDraftBuilder:
      status === 'official_draft_gate_ready' || status === 'official_draft_gate_ready_with_warnings',
    gateOnly: true,
    notFormalUserAppTemplatePackage: true,
    notPublished: true,
    noUserAppPackageRegistryWrite: true,
    formalUserAppTemplatePackageGenerationBlocked: true,
    jsonRoundTripStable: true,
  };

  gate.jsonRoundTripStable = isJsonRoundTripStable(gate);
  return gate;
};
