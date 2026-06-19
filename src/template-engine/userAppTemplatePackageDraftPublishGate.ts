import type { OfficialUserAppTemplatePackageDraft } from './officialUserAppTemplatePackageDraft';
import {
  isOfficialDraftJsonRoundTripStable,
  officialDraftPayloadText,
} from './officialUserAppTemplatePackageDraft';
import type { OfficialUserAppTemplatePackageDraftValidationResult } from './officialUserAppTemplatePackageDraftValidation';

export type UserAppTemplatePackageDraftPublishGateSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type UserAppTemplatePackageDraftPublishGateStatus =
  | 'draft_publish_gate_ready'
  | 'draft_publish_gate_ready_with_warnings'
  | 'draft_publish_gate_blocked'
  | 'draft_publish_gate_example_only';

export type UserAppTemplatePackageDraftPublishGateDecision =
  | 'eligible_for_future_registry_preparation'
  | 'request_user_facing_copy_revision'
  | 'request_step_guidance_revision'
  | 'request_region_guidance_revision'
  | 'request_privacy_notice_revision'
  | 'keep_as_draft_only'
  | 'blocked_do_not_prepare_registry';

export type UserAppTemplatePackageDraftPublishGateCheckId =
  | 'source_official_draft_validation_ready'
  | 'draft_only_true'
  | 'publish_blocked_true'
  | 'title_summary_ready'
  | 'step_sequence_ready'
  | 'region_guidance_ready'
  | 'tools_checklist_ready'
  | 'privacy_notice_ready'
  | 'trace_preserved'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_registry_write'
  | 'no_auto_publish'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_package_marker'
  | 'user_app_contract_boundary_safe'
  | 'json_round_trip_safe';

export interface UserAppTemplatePackageDraftPublishGateCheck {
  id: UserAppTemplatePackageDraftPublishGateCheckId;
  label: string;
  passed: boolean;
  severity: UserAppTemplatePackageDraftPublishGateSeverity;
  message: string;
}

export interface UserAppTemplatePackageDraftPublishGateIssue {
  id: string;
  checkId: UserAppTemplatePackageDraftPublishGateCheckId;
  severity: Exclude<UserAppTemplatePackageDraftPublishGateSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface UserAppTemplatePackageDraftPublishGateBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface UserAppTemplatePackageDraftPublishGateTrace {
  sourceDraftId: string;
  sourceDraftStatus: OfficialUserAppTemplatePackageDraft['draftStatus'];
  sourceOfficialDraftValidationStatus: OfficialUserAppTemplatePackageDraftValidationResult['status'];
  qaTracePreserved: boolean;
  humanReviewTracePreserved: boolean;
  candidateTracePreserved: boolean;
  contractTracePreserved: boolean;
  previewTracePreserved: boolean;
  gateTracePreserved: boolean;
  draftOnly: boolean;
  publishBlocked: boolean;
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noRegistryWrite: boolean;
  noAutoPublish: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
  userAppContractBoundarySafe: boolean;
}

export interface UserAppTemplatePackageDraftPublishGateResult {
  gateId: string;
  sourceDraftId: string;
  sourceDraftValidationStatus: OfficialUserAppTemplatePackageDraftValidationResult['status'];
  sourceCandidatePackageId: string;
  sourcePreviewId: string;
  status: UserAppTemplatePackageDraftPublishGateStatus;
  decision: UserAppTemplatePackageDraftPublishGateDecision;
  summary: string;
  checks: UserAppTemplatePackageDraftPublishGateCheck[];
  issues: UserAppTemplatePackageDraftPublishGateIssue[];
  warnings: UserAppTemplatePackageDraftPublishGateIssue[];
  blockedReasons: UserAppTemplatePackageDraftPublishGateBlockedReason[];
  trace: UserAppTemplatePackageDraftPublishGateTrace;
  eligibleForFutureRegistryPreparation: boolean;
  draftOnly: true;
  publishBlocked: true;
  noUserAppPackageRegistryWrite: true;
  noUserAppShellPackageReplacement: true;
  notPublished: true;
  notProductionPackage: true;
  registryPreparationOnly: true;
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
const registryWritePattern =
  /writeRegistry|registryWrite|user app package registry write|已写入用户 App registry/i;
const productionPackagePattern =
  /productionPackageId|正式生产包|generatedProductionPackage|production_package_ready/i;
const userAppTemplatePackageMutationPattern =
  /user_app_template_package_mutation|generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|"appTemplateId"\s*:|UserAppTemplatePackage mutation|正式 UserAppTemplatePackage 已生成/i;

const createCheck = (
  id: UserAppTemplatePackageDraftPublishGateCheckId,
  label: string,
  passed: boolean,
  severity: UserAppTemplatePackageDraftPublishGateSeverity,
  message: string,
): UserAppTemplatePackageDraftPublishGateCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const createBoundaryCheck = (
  id: UserAppTemplatePackageDraftPublishGateCheckId,
  label: string,
  passed: boolean,
  message: string,
): UserAppTemplatePackageDraftPublishGateCheck =>
  createCheck(id, label, passed, 'blocking', message);

const issueForCheck = (
  check: UserAppTemplatePackageDraftPublishGateCheck,
  recommendation: string,
): UserAppTemplatePackageDraftPublishGateIssue | null => {
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

const decisionForIssues = (
  status: UserAppTemplatePackageDraftPublishGateStatus,
  issues: UserAppTemplatePackageDraftPublishGateIssue[],
): UserAppTemplatePackageDraftPublishGateDecision => {
  if (status === 'draft_publish_gate_example_only') {
    return 'keep_as_draft_only';
  }

  const checkIds = new Set(issues.map((issue) => issue.checkId));
  if (
    checkIds.has('draft_only_true') ||
    checkIds.has('publish_blocked_true') ||
    checkIds.has('source_official_draft_validation_ready') ||
    checkIds.has('no_registry_write') ||
    checkIds.has('no_auto_publish') ||
    checkIds.has('no_user_app_shell_package_replacement') ||
    checkIds.has('no_production_package_marker') ||
    checkIds.has('user_app_contract_boundary_safe')
  ) {
    return 'blocked_do_not_prepare_registry';
  }
  if (checkIds.has('step_sequence_ready')) {
    return 'request_step_guidance_revision';
  }
  if (checkIds.has('region_guidance_ready')) {
    return 'request_region_guidance_revision';
  }
  if (checkIds.has('title_summary_ready')) {
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
    return 'request_privacy_notice_revision';
  }
  if (issues.some((issue) => issue.severity === 'blocking')) {
    return 'blocked_do_not_prepare_registry';
  }
  if (issues.length > 0) {
    return 'keep_as_draft_only';
  }
  return 'eligible_for_future_registry_preparation';
};

export const createUserAppTemplatePackageDraftPublishGate = ({
  draft,
  validation,
  gateId = `user-app-template-package-draft-publish-gate-${draft.draftId}`,
}: {
  draft: OfficialUserAppTemplatePackageDraft;
  validation: OfficialUserAppTemplatePackageDraftValidationResult;
  gateId?: string;
}): UserAppTemplatePackageDraftPublishGateResult => {
  const sourceValidationReady =
    validation.status === 'official_draft_validation_ready' ||
    validation.status === 'official_draft_validation_ready_with_warnings';
  const payloadText = officialDraftPayloadText(draft);
  const tracePreserved = {
    qa: draft.qaTrace.trim().length > 0,
    humanReview: draft.humanReviewTrace.trim().length > 0,
    candidate: draft.candidateTrace.trim().length > 0,
    contract: draft.contractTrace.trim().length > 0,
    preview: Boolean(draft.previewTrace),
    gate: Boolean(draft.gateTrace),
  };
  const jsonRoundTripStable =
    isOfficialDraftJsonRoundTripStable(draft) &&
    validation.jsonRoundTripStable;
  const userAppContractBoundarySafe =
    draft.draftOnly &&
    draft.publishBlocked &&
    draft.notProductionUserAppTemplatePackage &&
    draft.noUserAppPackageRegistryWrite &&
    draft.noUserAppShellPackageReplacement &&
    draft.productionPackageGenerationBlocked;

  const checks: UserAppTemplatePackageDraftPublishGateCheck[] = [
    createBoundaryCheck(
      'source_official_draft_validation_ready',
      'Source official draft validation ready',
      sourceValidationReady &&
        validation.readyForDraftPublishGate &&
        draft.draftStatus !== 'official_package_draft_blocked',
      'Draft publish gate requires Phase 10G official draft validation ready or ready with warnings.',
    ),
    createBoundaryCheck(
      'draft_only_true',
      'Draft-only flag true',
      draft.draftOnly === true && draft.notProductionUserAppTemplatePackage === true,
      'Draft publish gate requires draftOnly and not-production flags.',
    ),
    createBoundaryCheck(
      'publish_blocked_true',
      'Publish blocked flag true',
      draft.publishBlocked === true && draft.notPublished === true,
      'Draft publish gate requires publishBlocked and notPublished flags.',
    ),
    createBoundaryCheck(
      'title_summary_ready',
      'Title and summary ready',
      draft.title.trim().length > 0 && draft.summary.trim().length > 0,
      'Draft publish gate requires reviewed user-facing title and summary.',
    ),
    createBoundaryCheck(
      'step_sequence_ready',
      'Step sequence ready',
      draft.stepSequence.length > 0,
      'Draft publish gate requires reviewed step sequence.',
    ),
    createCheck(
      'region_guidance_ready',
      'Region guidance ready',
      draft.regionGuidance.length > 0,
      'warning',
      'Region guidance should be complete before future registry preparation.',
    ),
    createCheck(
      'tools_checklist_ready',
      'Tools checklist ready',
      draft.toolsChecklist.length > 0,
      'warning',
      'Tools checklist should be complete before future registry preparation.',
    ),
    createBoundaryCheck(
      'privacy_notice_ready',
      'Privacy notice ready',
      draft.privacyNotice.includes('不上传') &&
        draft.privacyNotice.includes('不训练') &&
        (draft.privacyNotice.includes('不是正式 UserAppTemplatePackage') ||
          draft.privacyNotice.includes('不生成正式 UserAppTemplatePackage')),
      'Draft publish gate requires no-upload, no-training, draft-only privacy notice.',
    ),
    createBoundaryCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved.qa &&
        tracePreserved.humanReview &&
        tracePreserved.candidate &&
        tracePreserved.contract &&
        tracePreserved.preview &&
        tracePreserved.gate,
      'Draft publish gate requires QA, human review, candidate, contract, preview, and gate trace.',
    ),
    createBoundaryCheck(
      'no_raw_image_reference',
      'No raw image reference',
      draft.gateTrace.noRawImageReference &&
        draft.previewTrace.noRawImageReference &&
        !rawImageReferencePattern.test(payloadText),
      'Draft publish gate must not include raw image data, object URLs, base64, local paths, or runtime asset names.',
    ),
    createBoundaryCheck(
      'no_personal_data',
      'No personal data',
      draft.gateTrace.noPersonalData &&
        draft.previewTrace.noPersonalData &&
        !personalDataPattern.test(payloadText),
      'Draft publish gate must not include names, contact, health, sensitive identity, or biometric data.',
    ),
    createBoundaryCheck(
      'no_medical_claims',
      'No medical claims',
      !medicalClaimPattern.test(payloadText),
      'Draft publish gate must not include medical, diagnosis, or treatment claims.',
    ),
    createBoundaryCheck(
      'no_product_shade_claims',
      'No product shade claims',
      !shadeClaimPattern.test(payloadText),
      'Draft publish gate must keep product suggestions as placeholders without brand or shade claims.',
    ),
    createBoundaryCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      !finalClaimPattern.test(payloadText),
      'Draft publish gate must not claim final recognition, final approval, or AI confirmation.',
    ),
    createBoundaryCheck(
      'no_registry_write',
      'No registry write',
      draft.noUserAppPackageRegistryWrite && !registryWritePattern.test(payloadText),
      'Draft publish gate must not write a user app package registry.',
    ),
    createBoundaryCheck(
      'no_auto_publish',
      'No auto publish',
      draft.publishBlocked && draft.notPublished && !autoPublishPattern.test(payloadText),
      'Draft publish gate must not publish to the user app.',
    ),
    createBoundaryCheck(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      draft.noUserAppShellPackageReplacement,
      'Draft publish gate must not replace the current User App Shell package.',
    ),
    createBoundaryCheck(
      'no_production_package_marker',
      'No production package marker',
      draft.notProductionUserAppTemplatePackage &&
        draft.productionPackageGenerationBlocked &&
        !productionPackagePattern.test(payloadText),
      'Draft publish gate must not carry production package markers.',
    ),
    createBoundaryCheck(
      'user_app_contract_boundary_safe',
      'User app contract boundary safe',
      userAppContractBoundarySafe &&
        !userAppTemplatePackageMutationPattern.test(payloadText),
      'Draft publish gate must not mutate a UserAppTemplatePackage contract or cross into production package scope.',
    ),
    createBoundaryCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'Draft publish gate input must survive JSON round-trip unchanged.',
    ),
  ];

  const recommendationsByCheck: Record<
    UserAppTemplatePackageDraftPublishGateCheckId,
    string
  > = {
    source_official_draft_validation_ready:
      'Return to Phase 10G official draft validation and resolve blocked checks.',
    draft_only_true: 'Restore draft-only and not-production flags before any registry preparation.',
    publish_blocked_true: 'Restore publish-blocked and not-published flags.',
    title_summary_ready: 'Revise user-facing title and summary.',
    step_sequence_ready: 'Add reviewed step guidance.',
    region_guidance_ready: 'Add reviewed region guidance.',
    tools_checklist_ready: 'Complete tools checklist copy.',
    privacy_notice_ready: 'Restore no-upload, no-training, draft-only privacy copy.',
    trace_preserved: 'Restore QA, human review, candidate, contract, preview, and gate trace.',
    no_raw_image_reference: 'Remove image bytes, object URLs, local paths, and runtime asset names.',
    no_personal_data: 'Remove personal, contact, health, sensitive identity, or biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims: 'Keep products as category placeholders without shade claims.',
    no_unsupported_final_claims: 'Keep wording as draft and human-review-only.',
    no_registry_write: 'Do not write or mark a user app package registry.',
    no_auto_publish: 'Keep publication blocked and defer launch to a future explicit phase.',
    no_user_app_shell_package_replacement: 'Do not replace the current User App Shell package.',
    no_production_package_marker: 'Remove production package markers.',
    user_app_contract_boundary_safe: 'Keep the output as a draft gate result, not a UserAppTemplatePackage mutation.',
    json_round_trip_safe: 'Remove non-serializable values.',
  };

  const checkIssues = checks
    .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
    .filter(
      (issue): issue is UserAppTemplatePackageDraftPublishGateIssue =>
        Boolean(issue),
    );
  const validationIssues = validation.issues.map(
    (issue): UserAppTemplatePackageDraftPublishGateIssue => ({
      id: `source_validation_${issue.id}`,
      checkId:
        issue.checkId === 'json_round_trip_safe'
          ? 'json_round_trip_safe'
          : 'source_official_draft_validation_ready',
      severity: issue.severity,
      message: issue.message,
      recommendation: issue.recommendation,
    }),
  );
  const draftWarnings = draft.warnings.map(
    (warning): UserAppTemplatePackageDraftPublishGateIssue => ({
      id: `draft_warning_${warning.id}`,
      checkId: 'source_official_draft_validation_ready',
      severity: 'warning',
      message: warning.message,
      recommendation: warning.recommendation,
    }),
  );
  const issues = [...checkIssues, ...validationIssues, ...draftWarnings];
  const blockedReasons = issues
    .filter((issue) => issue.severity === 'blocking')
    .map(
      (issue): UserAppTemplatePackageDraftPublishGateBlockedReason => ({
        id: issue.id,
        message: issue.message,
        recommendation: issue.recommendation,
      }),
    );
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const hasBlockingIssue = blockedReasons.length > 0;
  const hasWarning =
    warnings.length > 0 ||
    draft.draftStatus === 'official_package_draft_ready_with_warnings' ||
    validation.status === 'official_draft_validation_ready_with_warnings';
  const status: UserAppTemplatePackageDraftPublishGateStatus =
    draft.draftStatus === 'official_package_draft_example_only'
      ? 'draft_publish_gate_example_only'
      : hasBlockingIssue
        ? 'draft_publish_gate_blocked'
        : hasWarning
          ? 'draft_publish_gate_ready_with_warnings'
          : 'draft_publish_gate_ready';
  const decision = decisionForIssues(status, issues);
  const noRawImageReference =
    draft.gateTrace.noRawImageReference &&
    draft.previewTrace.noRawImageReference &&
    !rawImageReferencePattern.test(payloadText);
  const noPersonalData =
    draft.gateTrace.noPersonalData &&
    draft.previewTrace.noPersonalData &&
    !personalDataPattern.test(payloadText);

  const gate: UserAppTemplatePackageDraftPublishGateResult = {
    gateId,
    sourceDraftId: draft.draftId,
    sourceDraftValidationStatus: validation.status,
    sourceCandidatePackageId: draft.sourceCandidatePackageId,
    sourcePreviewId: draft.sourcePreviewId,
    status,
    decision,
    summary:
      status === 'draft_publish_gate_ready'
        ? 'Gate passed: the draft is eligible for a future registry preparation phase only.'
        : 'Gate has warnings or blockers; this is not publication and no registry is written.',
    checks,
    issues,
    warnings,
    blockedReasons,
    trace: {
      sourceDraftId: draft.draftId,
      sourceDraftStatus: draft.draftStatus,
      sourceOfficialDraftValidationStatus: validation.status,
      qaTracePreserved: tracePreserved.qa,
      humanReviewTracePreserved: tracePreserved.humanReview,
      candidateTracePreserved: tracePreserved.candidate,
      contractTracePreserved: tracePreserved.contract,
      previewTracePreserved: tracePreserved.preview,
      gateTracePreserved: tracePreserved.gate,
      draftOnly: draft.draftOnly,
      publishBlocked: draft.publishBlocked,
      noRawImageReference,
      noPersonalData,
      noRegistryWrite:
        draft.noUserAppPackageRegistryWrite && !registryWritePattern.test(payloadText),
      noAutoPublish:
        draft.publishBlocked && draft.notPublished && !autoPublishPattern.test(payloadText),
      noUserAppShellPackageReplacement: draft.noUserAppShellPackageReplacement,
      noProductionPackageMarker:
        draft.notProductionUserAppTemplatePackage &&
        draft.productionPackageGenerationBlocked &&
        !productionPackagePattern.test(payloadText),
      userAppContractBoundarySafe:
        userAppContractBoundarySafe &&
        !userAppTemplatePackageMutationPattern.test(payloadText),
    },
    eligibleForFutureRegistryPreparation:
      status === 'draft_publish_gate_ready' ||
      status === 'draft_publish_gate_ready_with_warnings',
    draftOnly: true,
    publishBlocked: true,
    noUserAppPackageRegistryWrite: true,
    noUserAppShellPackageReplacement: true,
    notPublished: true,
    notProductionPackage: true,
    registryPreparationOnly: true,
    jsonRoundTripStable: true,
  };

  gate.jsonRoundTripStable = isJsonRoundTripStable(gate);
  return gate;
};
