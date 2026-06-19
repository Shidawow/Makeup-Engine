import type { OfficialUserAppTemplatePackageDraft } from './officialUserAppTemplatePackageDraft';
import {
  isOfficialDraftJsonRoundTripStable,
  officialDraftPayloadText,
} from './officialUserAppTemplatePackageDraft';

export type OfficialUserAppTemplatePackageDraftValidationSeverity =
  | 'info'
  | 'warning'
  | 'blocking';

export type OfficialUserAppTemplatePackageDraftValidationStatus =
  | 'official_draft_validation_ready'
  | 'official_draft_validation_ready_with_warnings'
  | 'official_draft_validation_blocked';

export type OfficialUserAppTemplatePackageDraftValidationCheckId =
  | 'source_gate_ready'
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
  | 'no_user_app_template_package_mutation'
  | 'no_production_package_marker'
  | 'json_round_trip_safe';

export interface OfficialUserAppTemplatePackageDraftValidationCheck {
  id: OfficialUserAppTemplatePackageDraftValidationCheckId;
  label: string;
  passed: boolean;
  severity: OfficialUserAppTemplatePackageDraftValidationSeverity;
  message: string;
}

export interface OfficialUserAppTemplatePackageDraftValidationIssue {
  id: string;
  checkId: OfficialUserAppTemplatePackageDraftValidationCheckId;
  severity: Exclude<OfficialUserAppTemplatePackageDraftValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface OfficialUserAppTemplatePackageDraftValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_draft_publish_gate'
    | 'request_draft_revision'
    | 'block_publish_gate_entry';
}

export interface OfficialUserAppTemplatePackageDraftValidationResult {
  status: OfficialUserAppTemplatePackageDraftValidationStatus;
  checks: OfficialUserAppTemplatePackageDraftValidationCheck[];
  issues: OfficialUserAppTemplatePackageDraftValidationIssue[];
  recommendations: OfficialUserAppTemplatePackageDraftValidationRecommendation[];
  readyForDraftPublishGate: boolean;
  draftOnly: true;
  publishBlocked: true;
  noUserAppPackageRegistryWrite: true;
  noUserAppShellPackageReplacement: true;
  notPublishReady: true;
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
const publishPattern = /自动发布|已发布到用户 App|已上线|production ready|published to user app/i;
const registryWritePattern =
  /writeRegistry|registryWrite|user app package registry write|已写入用户 App registry/i;
const userAppMutationPattern =
  /user_app_template_package_mutation|generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|"appTemplateId"\s*:|UserAppTemplatePackage mutation|正式 UserAppTemplatePackage 已生成/i;
const productionPackagePattern =
  /productionPackageId|正式生产包|generatedProductionPackage|production_package_ready/i;

const createCheck = (
  id: OfficialUserAppTemplatePackageDraftValidationCheckId,
  label: string,
  passed: boolean,
  severity: OfficialUserAppTemplatePackageDraftValidationSeverity,
  message: string,
): OfficialUserAppTemplatePackageDraftValidationCheck => ({
  id,
  label,
  passed,
  severity,
  message,
});

const issueForCheck = (
  check: OfficialUserAppTemplatePackageDraftValidationCheck,
  recommendation: string,
): OfficialUserAppTemplatePackageDraftValidationIssue | null => {
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

export const validateOfficialUserAppTemplatePackageDraft = (
  draft: OfficialUserAppTemplatePackageDraft,
): OfficialUserAppTemplatePackageDraftValidationResult => {
  const jsonRoundTripStable = isOfficialDraftJsonRoundTripStable(draft);
  const payloadText = officialDraftPayloadText(draft);
  const tracePreserved =
    draft.qaTrace.trim().length > 0 &&
    draft.humanReviewTrace.trim().length > 0 &&
    draft.candidateTrace.trim().length > 0 &&
    draft.contractTrace.trim().length > 0 &&
    Boolean(draft.previewTrace) &&
    Boolean(draft.gateTrace);

  const checks: OfficialUserAppTemplatePackageDraftValidationCheck[] = [
    createCheck(
      'source_gate_ready',
      'Source gate ready',
      draft.draftStatus !== 'official_package_draft_blocked' &&
        (draft.gateTrace.sourcePreviewValidationStatus === 'draft_preview_validation_ready' ||
          draft.gateTrace.sourcePreviewValidationStatus === 'draft_preview_validation_ready_with_warnings') &&
        draft.gateTrace.noUserAppPackageRegistryWrite &&
        draft.gateTrace.noAutoPublish,
      'blocking',
      'Official draft validation requires a ready 10F source gate and no registry/publish trace.',
    ),
    createCheck(
      'draft_only_true',
      'Draft-only flag true',
      draft.draftOnly && draft.notProductionUserAppTemplatePackage && draft.productionPackageGenerationBlocked,
      'blocking',
      'Official draft must remain draft-only and must not become a production package.',
    ),
    createCheck(
      'publish_blocked_true',
      'Publish blocked flag true',
      draft.publishBlocked && draft.notPublished,
      'blocking',
      'Official draft must keep publish blocked.',
    ),
    createCheck(
      'title_summary_ready',
      'Title and summary ready',
      draft.title.trim().length > 0 && draft.summary.trim().length > 0,
      'blocking',
      'Official draft requires user-facing title and summary.',
    ),
    createCheck(
      'step_sequence_ready',
      'Step sequence ready',
      draft.stepSequence.length > 0,
      'blocking',
      'Official draft requires reviewed step sequence guidance.',
    ),
    createCheck(
      'region_guidance_ready',
      'Region guidance ready',
      draft.regionGuidance.length > 0,
      'warning',
      'Region guidance should be reviewed before the publish gate.',
    ),
    createCheck(
      'tools_checklist_ready',
      'Tools checklist ready',
      draft.toolsChecklist.length > 0,
      'warning',
      'Tools checklist should be visible in the draft.',
    ),
    createCheck(
      'privacy_notice_ready',
      'Privacy notice ready',
      draft.privacyNotice.includes('不上传') &&
        draft.privacyNotice.includes('不训练') &&
        (draft.privacyNotice.includes('不是正式 UserAppTemplatePackage') ||
          draft.privacyNotice.includes('不生成正式 UserAppTemplatePackage')),
      'blocking',
      'Official draft requires no-upload, no-training, draft-only privacy notice.',
    ),
    createCheck(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Official draft requires QA, human review, candidate, contract, preview, and gate trace.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      draft.gateTrace.noRawImageReference &&
        draft.previewTrace.noRawImageReference &&
        !rawImageReferencePattern.test(payloadText),
      'blocking',
      'Official draft must not contain raw image references, object URLs, base64, local paths, or runtime asset names.',
    ),
    createCheck(
      'no_personal_data',
      'No personal data',
      draft.gateTrace.noPersonalData &&
        draft.previewTrace.noPersonalData &&
        !personalDataPattern.test(payloadText),
      'blocking',
      'Official draft must not contain personal, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      !medicalClaimPattern.test(payloadText),
      'blocking',
      'Official draft must not contain medical, diagnosis, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      !shadeClaimPattern.test(payloadText),
      'blocking',
      'Official draft must not contain product shade or brand-specific claims.',
    ),
    createCheck(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      !finalClaimPattern.test(payloadText),
      'blocking',
      'Official draft must not claim final recognition, final approval, or AI confirmation.',
    ),
    createCheck(
      'no_registry_write',
      'No registry write',
      draft.noUserAppPackageRegistryWrite &&
        draft.noUserAppShellPackageReplacement &&
        !registryWritePattern.test(payloadText),
      'blocking',
      'Official draft must not write registry or replace the User App Shell package.',
    ),
    createCheck(
      'no_user_app_template_package_mutation',
      'No UserAppTemplatePackage mutation',
      draft.notProductionUserAppTemplatePackage &&
        draft.productionPackageGenerationBlocked &&
        !userAppMutationPattern.test(payloadText),
      'blocking',
      'Official draft must not mutate an existing UserAppTemplatePackage.',
    ),
    createCheck(
      'no_production_package_marker',
      'No production package marker',
      !productionPackagePattern.test(payloadText) && !publishPattern.test(payloadText),
      'blocking',
      'Official draft must not carry production or publish markers.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Official draft must survive JSON round-trip unchanged.',
    ),
  ];

  const recommendationsByCheck: Record<
    OfficialUserAppTemplatePackageDraftValidationCheckId,
    string
  > = {
    source_gate_ready: 'Return to Phase 10F gate and fix blocked source checks.',
    draft_only_true: 'Restore draft-only and production-package-blocked flags.',
    publish_blocked_true: 'Restore publish-blocked flags.',
    title_summary_ready: 'Revise user-facing title and summary.',
    step_sequence_ready: 'Add reviewed step sequence guidance.',
    region_guidance_ready: 'Add reviewed region guidance.',
    tools_checklist_ready: 'Add a complete tools checklist.',
    privacy_notice_ready: 'Restore no-upload, no-training, draft-only privacy copy.',
    trace_preserved: 'Restore QA, human review, candidate, contract, preview, and gate trace.',
    no_raw_image_reference: 'Remove image bytes, object URLs, local paths, and runtime asset names.',
    no_personal_data: 'Remove personal, contact, health, sensitive identity, or biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims: 'Keep products as placeholders without specific shade claims.',
    no_unsupported_final_claims: 'Keep wording as draft and human-review-only.',
    no_registry_write: 'Keep the draft local and avoid registry or User App Shell package replacement.',
    no_user_app_template_package_mutation: 'Do not mutate existing UserAppTemplatePackage objects.',
    no_production_package_marker: 'Remove production or publish markers.',
    json_round_trip_safe: 'Remove non-serializable fields.',
  };

  const issues = [
    ...checks
      .map((check) => issueForCheck(check, recommendationsByCheck[check.id]))
      .filter(
        (issue): issue is OfficialUserAppTemplatePackageDraftValidationIssue =>
          Boolean(issue),
      ),
    ...draft.blockedReasons.map((reason): OfficialUserAppTemplatePackageDraftValidationIssue => ({
      id: `draft_${reason.id}`,
      checkId: 'source_gate_ready',
      severity: 'blocking',
      message: reason.message,
      recommendation: reason.recommendation,
    })),
  ];
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning =
    draft.draftStatus === 'official_package_draft_ready_with_warnings' ||
    draft.warnings.length > 0 ||
    issues.some((issue) => issue.severity === 'warning');
  const status: OfficialUserAppTemplatePackageDraftValidationStatus = hasBlockingIssue
    ? 'official_draft_validation_blocked'
    : hasWarning
      ? 'official_draft_validation_ready_with_warnings'
      : 'official_draft_validation_ready';

  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: hasBlockingIssue ? 'block_publish_gate_entry' : 'draft_publish_gate_next',
        message: hasBlockingIssue
          ? '正式用户 App 模板包草稿未通过，不能进入草稿发布闸门。'
          : '草稿可进入后续草稿发布闸门；这仍不是发布许可。',
        action: hasBlockingIssue
          ? 'block_publish_gate_entry'
          : hasWarning
            ? 'request_draft_revision'
            : 'continue_to_draft_publish_gate',
      },
    ],
    readyForDraftPublishGate: !hasBlockingIssue,
    draftOnly: true,
    publishBlocked: true,
    noUserAppPackageRegistryWrite: true,
    noUserAppShellPackageReplacement: true,
    notPublishReady: true,
    jsonRoundTripStable,
  };
};
