import type { OfficialUserAppTemplatePackageDraft } from './officialUserAppTemplatePackageDraft';
import {
  isOfficialDraftJsonRoundTripStable,
  officialDraftPayloadText,
} from './officialUserAppTemplatePackageDraft';
import type { UserAppTemplatePackageDraftPublishGateResult } from './userAppTemplatePackageDraftPublishGate';

export type UserAppTemplatePackageRegistryPreparationStatus =
  | 'registry_preparation_ready'
  | 'registry_preparation_ready_with_warnings'
  | 'registry_preparation_blocked'
  | 'registry_preparation_example_only';

export interface UserAppTemplatePackageRegistryPreparationSource {
  draftPublishGateStatus: UserAppTemplatePackageDraftPublishGateResult['status'];
  draftPublishGateDecision: UserAppTemplatePackageDraftPublishGateResult['decision'];
  sourceReadyForRegistryPreparation: boolean;
}

export interface UserAppTemplatePackageRegistryPreparationEntry {
  packageIdCandidate: string;
  packageVersionCandidate: string;
  title: string;
  summary: string;
  styleTags: string[];
  difficulty: string;
  estimatedTime: string;
  stepCount: number;
  safetyFlags: string[];
  privacyNotice: string;
  draftOnly: true;
  publishBlocked: true;
  registryWriteBlocked: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
}

export interface UserAppTemplatePackageRegistryPreparationWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface UserAppTemplatePackageRegistryPreparationBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface UserAppTemplatePackageRegistryPreparationTrace {
  source: UserAppTemplatePackageRegistryPreparationSource;
  sourceDraftPublishGateId: string;
  sourceOfficialDraftId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: OfficialUserAppTemplatePackageDraft['previewTrace'];
  gateTrace: OfficialUserAppTemplatePackageDraft['gateTrace'];
  draftTrace: Pick<
    OfficialUserAppTemplatePackageDraft,
    | 'draftOnly'
    | 'publishBlocked'
    | 'notPublished'
    | 'noUserAppPackageRegistryWrite'
    | 'noUserAppShellPackageReplacement'
    | 'notProductionUserAppTemplatePackage'
  >;
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noProductionPackageMarker: boolean;
  noUserAppShellPackageReplacement: boolean;
}

export interface UserAppTemplatePackageRegistryPreparation {
  preparationId: string;
  sourceDraftPublishGateId: string;
  sourceOfficialDraftId: string;
  sourceCandidatePackageId: string;
  sourcePreviewId: string;
  registryEntryPreview: UserAppTemplatePackageRegistryPreparationEntry;
  packageIdCandidate: string;
  packageVersionCandidate: string;
  title: string;
  summary: string;
  styleTags: string[];
  difficulty: string;
  estimatedTime: string;
  stepCount: number;
  safetyFlags: string[];
  privacyNotice: string;
  draftOnly: true;
  publishBlocked: true;
  registryWriteBlocked: true;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: OfficialUserAppTemplatePackageDraft['previewTrace'];
  gateTrace: OfficialUserAppTemplatePackageDraft['gateTrace'];
  draftTrace: UserAppTemplatePackageRegistryPreparationTrace['draftTrace'];
  warnings: UserAppTemplatePackageRegistryPreparationWarning[];
  blockedReasons: UserAppTemplatePackageRegistryPreparationBlockedReason[];
  preparationStatus: UserAppTemplatePackageRegistryPreparationStatus;
  registryPreparationOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  trace: UserAppTemplatePackageRegistryPreparationTrace;
  jsonRoundTripStable: boolean;
}

export const registryPreparationRawImageReferencePattern =
  /data:image|blob:|object URL|base64|\/Users\/|\/private\/|[A-Z]:\\|file:\/\/|face_landmarker\.task|vision_wasm/i;
export const registryPreparationPersonalDataPattern =
  /真实姓名|手机号|邮箱|联系方式|身份证|健康信息|过敏|faceEmbedding|biometricId|biometric identifier|raw camera/i;
export const registryPreparationMedicalClaimPattern =
  /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos/i;
export const registryPreparationShadeClaimPattern =
  /色号|shade\s*#?|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s/i;
export const registryPreparationFinalClaimPattern =
  /最终识别完成|最终识别为|最终结果|final result|final recognition|final approval|AI 已确认/i;
export const registryPreparationActualRegistryWritePattern =
  /actualRegistryWrite|registryWriteExecuted|writeRegistry\(|registryWrite\s*:\s*true|已写入用户 App registry/i;
export const registryPreparationProductionMarkerPattern =
  /productionPackageId|正式生产包|generatedProductionPackage|production_package_ready|production ready/i;
export const registryPreparationShellReplacementPattern =
  /\breplaceUserAppShellPackage\b|\buserAppShellPackageReplacement\b|已替换当前用户 App 包/i;

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const userAppTemplatePackageRegistryPreparationPayloadText = (
  preparation: Pick<
    UserAppTemplatePackageRegistryPreparation,
    | 'registryEntryPreview'
    | 'packageIdCandidate'
    | 'packageVersionCandidate'
    | 'title'
    | 'summary'
    | 'styleTags'
    | 'difficulty'
    | 'estimatedTime'
    | 'safetyFlags'
    | 'privacyNotice'
  >,
): string =>
  JSON.stringify({
    registryEntryPreview: preparation.registryEntryPreview,
    packageIdCandidate: preparation.packageIdCandidate,
    packageVersionCandidate: preparation.packageVersionCandidate,
    title: preparation.title,
    summary: preparation.summary,
    styleTags: preparation.styleTags,
    difficulty: preparation.difficulty,
    estimatedTime: preparation.estimatedTime,
    safetyFlags: preparation.safetyFlags,
    privacyNotice: preparation.privacyNotice,
  });

const packageIdCandidateForDraft = (draft: OfficialUserAppTemplatePackageDraft): string =>
  `registry-preview-${draft.draftId}`;

const buildBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): UserAppTemplatePackageRegistryPreparationBlockedReason => ({
  id,
  message,
  recommendation,
});

export const createUserAppTemplatePackageRegistryPreparation = ({
  draft,
  gate,
  preparationId = `user-app-template-package-registry-preparation-${gate.gateId}`,
}: {
  draft: OfficialUserAppTemplatePackageDraft;
  gate: UserAppTemplatePackageDraftPublishGateResult;
  preparationId?: string;
}): UserAppTemplatePackageRegistryPreparation => {
  const sourceReady =
    (gate.status === 'draft_publish_gate_ready' ||
      gate.status === 'draft_publish_gate_ready_with_warnings') &&
    gate.eligibleForFutureRegistryPreparation &&
    gate.sourceDraftId === draft.draftId;
  const packageIdCandidate = packageIdCandidateForDraft(draft);
  const packageVersionCandidate = '0.1.0-draft-registry-preview';
  const safetyFlags = [
    'draft_only',
    'publish_blocked',
    'registry_write_blocked',
    'local_admin_preview',
  ];
  const registryEntryPreview: UserAppTemplatePackageRegistryPreparationEntry = {
    packageIdCandidate,
    packageVersionCandidate,
    title: draft.title,
    summary: draft.summary,
    styleTags: [...draft.styleTags],
    difficulty: draft.difficulty,
    estimatedTime: draft.estimatedTime,
    stepCount: draft.stepSequence.length,
    safetyFlags,
    privacyNotice: draft.privacyNotice,
    draftOnly: true,
    publishBlocked: true,
    registryWriteBlocked: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
  };
  const draftPayloadText = officialDraftPayloadText(draft);
  const preparationPayloadText = JSON.stringify({
    registryEntryPreview,
    gateSummary: gate.summary,
    gateDecision: gate.decision,
  });
  const payloadText = `${draftPayloadText}\n${preparationPayloadText}`;
  const noRawImageReference =
    gate.trace.noRawImageReference &&
    draft.gateTrace.noRawImageReference &&
    draft.previewTrace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    gate.trace.noPersonalData &&
    draft.gateTrace.noPersonalData &&
    draft.previewTrace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims = !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims = !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims = !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    gate.noUserAppPackageRegistryWrite &&
    draft.noUserAppPackageRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noProductionPackageMarker =
    draft.notProductionUserAppTemplatePackage &&
    draft.productionPackageGenerationBlocked &&
    gate.notProductionPackage &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    gate.noUserAppShellPackageReplacement &&
    draft.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);

  const blockedReasons = [
    !sourceReady
      ? buildBlockedReason(
          'source_publish_gate_not_ready',
          'Registry preparation requires a ready Phase 10H draft publish gate.',
          'Return to the 10H draft publish gate and resolve blocked checks before preparing a registry entry preview.',
        )
      : null,
    draft.draftOnly !== true
      ? buildBlockedReason(
          'draft_only_missing',
          'Registry preparation requires draftOnly to stay true.',
          'Restore draft-only metadata before any registry preparation.',
        )
      : null,
    draft.publishBlocked !== true
      ? buildBlockedReason(
          'publish_blocked_missing',
          'Registry preparation requires publishBlocked to stay true.',
          'Restore publish-blocked metadata before any registry preparation.',
        )
      : null,
    !noActualRegistryWrite
      ? buildBlockedReason(
          'registry_write_not_blocked',
          'Registry preparation must not execute or mark an actual registry write.',
          'Remove registry write markers and keep registryWriteBlocked true.',
        )
      : null,
    !noRawImageReference
      ? buildBlockedReason(
          'raw_image_reference',
          'Registry preparation must not contain raw image data, object URLs, base64, local paths, or runtime asset names.',
          'Remove raw image references from the draft before preparing registry preview metadata.',
        )
      : null,
    !noPersonalData
      ? buildBlockedReason(
          'personal_data',
          'Registry preparation must not contain personal, contact, health, sensitive identity, or biometric data.',
          'Remove personal data and keep the preparation anonymous/local.',
        )
      : null,
    !noMedicalClaims
      ? buildBlockedReason(
          'medical_claim',
          'Registry preparation must not contain medical, diagnosis, or treatment claims.',
          'Rewrite copy as makeup guidance only.',
        )
      : null,
    !noProductShadeClaims
      ? buildBlockedReason(
          'product_shade_claim',
          'Registry preparation must not contain product shade or brand-specific claims.',
          'Keep product suggestions as category placeholders.',
        )
      : null,
    !noUnsupportedFinalClaims
      ? buildBlockedReason(
          'unsupported_final_claim',
          'Registry preparation must not claim final recognition, final approval, or AI confirmation.',
          'Keep wording as draft and human-review-only.',
        )
      : null,
    !noProductionPackageMarker
      ? buildBlockedReason(
          'production_package_marker',
          'Registry preparation must not carry production package markers.',
          'Remove production package metadata and keep preparation local.',
        )
      : null,
    !noUserAppShellPackageReplacement
      ? buildBlockedReason(
          'user_app_shell_package_replacement',
          'Registry preparation must not replace the current User App Shell package.',
          'Remove shell replacement markers and keep this as a preview only.',
        )
      : null,
  ].filter(
    (
      reason,
    ): reason is UserAppTemplatePackageRegistryPreparationBlockedReason =>
      Boolean(reason),
  );

  const warnings: UserAppTemplatePackageRegistryPreparationWarning[] = [
    gate.status === 'draft_publish_gate_ready_with_warnings'
      ? {
          id: 'source_gate_warnings',
          message: 'Source draft publish gate has warnings.',
          recommendation: 'Keep warnings visible through the future registry write gate.',
        }
      : null,
    draft.toolsChecklist.length === 0
      ? {
          id: 'tools_checklist_missing',
          message: 'Tools checklist is empty.',
          recommendation: 'Review tools metadata before registry write gate.',
        }
      : null,
  ].filter(
    (warning): warning is UserAppTemplatePackageRegistryPreparationWarning =>
      Boolean(warning),
  );

  const preparationStatus: UserAppTemplatePackageRegistryPreparationStatus =
    draft.draftStatus === 'official_package_draft_example_only'
      ? 'registry_preparation_example_only'
      : blockedReasons.length > 0
        ? 'registry_preparation_blocked'
        : warnings.length > 0
          ? 'registry_preparation_ready_with_warnings'
          : 'registry_preparation_ready';

  const preparation: UserAppTemplatePackageRegistryPreparation = {
    preparationId,
    sourceDraftPublishGateId: gate.gateId,
    sourceOfficialDraftId: draft.draftId,
    sourceCandidatePackageId: draft.sourceCandidatePackageId,
    sourcePreviewId: draft.sourcePreviewId,
    registryEntryPreview,
    packageIdCandidate,
    packageVersionCandidate,
    title: draft.title,
    summary: draft.summary,
    styleTags: [...draft.styleTags],
    difficulty: draft.difficulty,
    estimatedTime: draft.estimatedTime,
    stepCount: draft.stepSequence.length,
    safetyFlags,
    privacyNotice: draft.privacyNotice,
    draftOnly: true,
    publishBlocked: true,
    registryWriteBlocked: true,
    qaTrace: draft.qaTrace,
    humanReviewTrace: draft.humanReviewTrace,
    candidateTrace: draft.candidateTrace,
    contractTrace: draft.contractTrace,
    previewTrace: draft.previewTrace,
    gateTrace: draft.gateTrace,
    draftTrace: {
      draftOnly: draft.draftOnly,
      publishBlocked: draft.publishBlocked,
      notPublished: draft.notPublished,
      noUserAppPackageRegistryWrite: draft.noUserAppPackageRegistryWrite,
      noUserAppShellPackageReplacement: draft.noUserAppShellPackageReplacement,
      notProductionUserAppTemplatePackage: draft.notProductionUserAppTemplatePackage,
    },
    warnings,
    blockedReasons,
    preparationStatus,
    registryPreparationOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    trace: {
      source: {
        draftPublishGateStatus: gate.status,
        draftPublishGateDecision: gate.decision,
        sourceReadyForRegistryPreparation: sourceReady,
      },
      sourceDraftPublishGateId: gate.gateId,
      sourceOfficialDraftId: draft.draftId,
      qaTrace: draft.qaTrace,
      humanReviewTrace: draft.humanReviewTrace,
      candidateTrace: draft.candidateTrace,
      contractTrace: draft.contractTrace,
      previewTrace: draft.previewTrace,
      gateTrace: draft.gateTrace,
      draftTrace: {
        draftOnly: draft.draftOnly,
        publishBlocked: draft.publishBlocked,
        notPublished: draft.notPublished,
        noUserAppPackageRegistryWrite: draft.noUserAppPackageRegistryWrite,
        noUserAppShellPackageReplacement: draft.noUserAppShellPackageReplacement,
        notProductionUserAppTemplatePackage: draft.notProductionUserAppTemplatePackage,
      },
      noRawImageReference,
      noPersonalData,
      noMedicalClaims,
      noProductShadeClaims,
      noUnsupportedFinalClaims,
      noActualRegistryWrite,
      noProductionPackageMarker,
      noUserAppShellPackageReplacement,
    },
    jsonRoundTripStable: true,
  };

  preparation.jsonRoundTripStable =
    isOfficialDraftJsonRoundTripStable(draft) && isJsonRoundTripStable(preparation);
  return preparation;
};
