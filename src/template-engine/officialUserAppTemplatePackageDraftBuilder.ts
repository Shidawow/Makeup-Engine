import type {
  OfficialUserAppTemplatePackageDraft,
  OfficialUserAppTemplatePackageDraftBlockedReason,
  OfficialUserAppTemplatePackageDraftSection,
  OfficialUserAppTemplatePackageDraftStatus,
  OfficialUserAppTemplatePackageDraftWarning,
} from './officialUserAppTemplatePackageDraft';
import {
  isOfficialDraftJsonRoundTripStable,
  officialDraftPayloadText,
} from './officialUserAppTemplatePackageDraft';
import type { OfficialUserAppPackageDraftGateResult } from './officialUserAppPackageDraftGate';
import type { OfficialUserAppPackageDraftGateHandoff } from './officialUserAppPackageDraftGateHandoff';
import type { UserAppPackageDraftPreview } from './userAppPackageDraftPreview';

export interface OfficialUserAppTemplatePackageDraftBuilderInput {
  preview: UserAppPackageDraftPreview;
  gate: OfficialUserAppPackageDraftGateResult;
  gateHandoff: OfficialUserAppPackageDraftGateHandoff;
}

export interface OfficialUserAppTemplatePackageDraftBuilderOptions {
  draftId?: string;
}

export interface OfficialUserAppTemplatePackageDraftBuilderResult {
  draft: OfficialUserAppTemplatePackageDraft;
  sourcePreviewId: string;
  sourceGateResultId: string;
  status: OfficialUserAppTemplatePackageDraftStatus;
  warnings: OfficialUserAppTemplatePackageDraftWarning[];
  blockedReasons: OfficialUserAppTemplatePackageDraftBlockedReason[];
  draftOnly: true;
  publishBlocked: true;
  noUserAppPackageRegistryWrite: true;
  noUserAppShellPackageReplacement: true;
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

const createBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): OfficialUserAppTemplatePackageDraftBlockedReason => ({ id, message, recommendation });

const createWarning = (
  id: string,
  message: string,
  recommendation: string,
): OfficialUserAppTemplatePackageDraftWarning => ({ id, message, recommendation });

const sectionStatus = (
  items: string[],
  warning = false,
): OfficialUserAppTemplatePackageDraftSection['status'] => {
  if (items.length === 0) {
    return 'blocked';
  }
  return warning ? 'warning' : 'ready';
};

const isGateReady = (
  gate: OfficialUserAppPackageDraftGateResult,
  handoff: OfficialUserAppPackageDraftGateHandoff,
): boolean =>
  (gate.status === 'official_draft_gate_ready' ||
    gate.status === 'official_draft_gate_ready_with_warnings') &&
  handoff.nextAction === 'ready_for_official_user_app_package_draft_builder';

export const buildOfficialUserAppTemplatePackageDraft = (
  input: OfficialUserAppTemplatePackageDraftBuilderInput,
  options: OfficialUserAppTemplatePackageDraftBuilderOptions = {},
): OfficialUserAppTemplatePackageDraftBuilderResult => {
  const { preview, gate, gateHandoff } = input;
  const draftId = options.draftId ?? `official-user-app-template-package-draft-${gate.gateId}`;
  const warnings: OfficialUserAppTemplatePackageDraftWarning[] = [];
  const blockedReasons: OfficialUserAppTemplatePackageDraftBlockedReason[] = [];
  const sourceReady = isGateReady(gate, gateHandoff);

  if (!sourceReady) {
    blockedReasons.push(
      createBlockedReason(
        'source_gate_not_ready',
        'Official UserAppTemplatePackage draft builder requires a 10F gate ready handoff.',
        'Return to the official draft gate and resolve blocked checks before building a draft.',
      ),
    );
  }

  if (gate.status === 'official_draft_gate_example_only') {
    warnings.push(
      createWarning(
        'example_only_source',
        'Source gate is example-only; the builder may only produce example-only draft output.',
        'Use reviewed local inputs before moving toward a publish gate.',
      ),
    );
  }

  if (gate.status === 'official_draft_gate_ready_with_warnings') {
    warnings.push(
      createWarning(
        'source_gate_warning',
        '10F official draft gate passed with warnings.',
        'Review source warning trace before the draft publish gate.',
      ),
    );
  }

  if (preview.stepGuidancePreview.length === 0) {
    blockedReasons.push(
      createBlockedReason(
        'missing_step_sequence',
        'Official package draft requires reviewed step sequence guidance.',
        'Return to Template Workbench step guidance and fill reviewed user-facing steps.',
      ),
    );
  }

  if (preview.regionGuidancePreview.length === 0) {
    warnings.push(
      createWarning(
        'missing_region_guidance',
        'Region guidance is missing; the draft should be reviewed before any publish gate.',
        'Add reviewed region guidance or block at validation if region guidance is required.',
      ),
    );
  }

  if (
    preview.privacyNoticePreview.trim().length === 0 ||
    !preview.privacyNoticePreview.includes('不上传') ||
    !preview.privacyNoticePreview.includes('不训练')
  ) {
    blockedReasons.push(
      createBlockedReason(
        'missing_privacy_notice',
        'Official package draft requires privacy copy with no-upload and no-training boundaries.',
        'Restore local-only, no-upload, no-training privacy notice before building.',
      ),
    );
  }

  const draftPayload = officialDraftPayloadText({
    title: preview.titlePreview,
    summary: preview.summaryPreview,
    styleTags: preview.styleTagsPreview,
    difficulty: preview.difficultyPreview,
    estimatedTime: preview.estimatedTimePreview,
    suitableScenarios: preview.suitableScenariosPreview,
    toolsChecklist: preview.toolsChecklistPreview,
    productPlaceholders: preview.productPlaceholderPreview,
    stepSequence: preview.stepGuidancePreview,
    regionGuidance: preview.regionGuidancePreview,
    userFacingCopy: preview.userFacingCopyPreview,
    privacyNotice: preview.privacyNoticePreview,
  });

  if (rawImageReferencePattern.test(draftPayload) || !gate.trace.noRawImageReference) {
    blockedReasons.push(
      createBlockedReason(
        'raw_image_reference',
        'Official package draft cannot contain raw image data, object URLs, base64, local paths, or MediaPipe asset names.',
        'Keep only reviewed text guidance and trace identifiers.',
      ),
    );
  }

  if (personalDataPattern.test(draftPayload) || !gate.trace.noPersonalData) {
    blockedReasons.push(
      createBlockedReason(
        'personal_data',
        'Official package draft cannot contain names, contact, health, sensitive identity, or biometric data.',
        'Remove all personal data and keep anonymous template content only.',
      ),
    );
  }

  if (medicalClaimPattern.test(draftPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'medical_claim',
        'Official package draft cannot contain medical, diagnosis, or skin treatment claims.',
        'Rewrite as ordinary makeup guidance without health claims.',
      ),
    );
  }

  if (shadeClaimPattern.test(draftPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'product_shade_claim',
        'Official package draft cannot contain specific brand or shade claims.',
        'Keep product suggestions as category placeholders.',
      ),
    );
  }

  if (finalClaimPattern.test(draftPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'unsupported_final_claim',
        'Official package draft cannot claim final recognition, final approval, or AI confirmation.',
        'Keep wording as draft, candidate, and human review only.',
      ),
    );
  }

  if (
    publishPattern.test(draftPayload) ||
    registryWritePattern.test(draftPayload) ||
    userAppMutationPattern.test(draftPayload) ||
    productionPackagePattern.test(draftPayload) ||
    !gate.noUserAppPackageRegistryWrite ||
    !gate.notPublished ||
    !gate.formalUserAppTemplatePackageGenerationBlocked ||
    !gateHandoff.noUserAppPackageRegistryWrite ||
    !gateHandoff.notPublished ||
    !gateHandoff.formalUserAppTemplatePackageGenerationBlocked
  ) {
    blockedReasons.push(
      createBlockedReason(
        'publish_registry_or_mutation_scope',
        'Official package draft cannot publish, write registry, replace app shell packages, or mutate UserAppTemplatePackage.',
        'Keep this output draft-only and defer publication to a future explicit gate.',
      ),
    );
  }

  const sections: OfficialUserAppTemplatePackageDraftSection[] = [
    {
      id: 'user_facing_copy',
      label: '用户侧文案',
      items: [preview.titlePreview, preview.summaryPreview].filter(Boolean),
      status: sectionStatus([preview.titlePreview, preview.summaryPreview].filter(Boolean)),
    },
    {
      id: 'step_sequence',
      label: '步骤序列',
      items: preview.stepGuidancePreview,
      status: sectionStatus(preview.stepGuidancePreview),
    },
    {
      id: 'region_guidance',
      label: '区域说明',
      items: preview.regionGuidancePreview,
      status: sectionStatus(preview.regionGuidancePreview, preview.regionGuidancePreview.length === 0),
    },
    {
      id: 'tools_products',
      label: '工具和产品占位',
      items: [...preview.toolsChecklistPreview, ...preview.productPlaceholderPreview],
      status: sectionStatus([...preview.toolsChecklistPreview, ...preview.productPlaceholderPreview]),
    },
  ];

  const draftStatus: OfficialUserAppTemplatePackageDraftStatus =
    gate.status === 'official_draft_gate_example_only'
      ? 'official_package_draft_example_only'
      : blockedReasons.length > 0
        ? 'official_package_draft_blocked'
        : warnings.length > 0 || sections.some((section) => section.status === 'warning')
          ? 'official_package_draft_ready_with_warnings'
          : 'official_package_draft_ready';

  const draft: OfficialUserAppTemplatePackageDraft = {
    draftId,
    sourceGateResultId: gate.gateId,
    sourcePreviewId: preview.previewId,
    sourceCandidatePackageId: preview.sourceCandidatePackageId,
    title: preview.titlePreview,
    summary: preview.summaryPreview,
    styleTags: preview.styleTagsPreview,
    difficulty: preview.difficultyPreview,
    estimatedTime: preview.estimatedTimePreview,
    suitableScenarios: preview.suitableScenariosPreview,
    toolsChecklist: preview.toolsChecklistPreview,
    productPlaceholders: preview.productPlaceholderPreview,
    stepSequence: preview.stepGuidancePreview,
    regionGuidance: preview.regionGuidancePreview,
    userFacingCopy: preview.userFacingCopyPreview,
    privacyNotice: preview.privacyNoticePreview,
    sections,
    qaTrace: preview.qaTrace,
    humanReviewTrace: preview.humanReviewTrace,
    candidateTrace: preview.candidateTrace,
    contractTrace: preview.contractTrace,
    previewTrace: preview.trace,
    gateTrace: gate.trace,
    warnings,
    blockedReasons,
    draftStatus,
    draftOnly: true,
    publishBlocked: true,
    notProductionUserAppTemplatePackage: true,
    notPublished: true,
    noUserAppPackageRegistryWrite: true,
    noUserAppShellPackageReplacement: true,
    productionPackageGenerationBlocked: true,
    jsonRoundTripStable: true,
  };

  draft.jsonRoundTripStable = isOfficialDraftJsonRoundTripStable(draft);
  if (!draft.jsonRoundTripStable && draft.draftStatus !== 'official_package_draft_blocked') {
    draft.blockedReasons.push(
      createBlockedReason(
        'json_round_trip_unstable',
        'Official package draft must survive JSON round-trip unchanged.',
        'Remove non-serializable draft fields.',
      ),
    );
    draft.draftStatus = 'official_package_draft_blocked';
  }

  return {
    draft,
    sourcePreviewId: preview.previewId,
    sourceGateResultId: gate.gateId,
    status: draft.draftStatus,
    warnings: draft.warnings,
    blockedReasons: draft.blockedReasons,
    draftOnly: true,
    publishBlocked: true,
    noUserAppPackageRegistryWrite: true,
    noUserAppShellPackageReplacement: true,
    jsonRoundTripStable: isOfficialDraftJsonRoundTripStable(draft),
  };
};
