import type { CandidateToAppPackageContractPreparation } from './candidateToAppPackageContract';
import type { CandidateToAppPackageValidationResult } from './candidateToAppPackageValidation';

export type UserAppPackageDraftPreviewStatus =
  | 'draft_preview_ready'
  | 'draft_preview_ready_with_warnings'
  | 'draft_preview_blocked'
  | 'draft_preview_example_only';

export interface UserAppPackageDraftPreviewSource {
  contractPreparationStatus: CandidateToAppPackageContractPreparation['contractStatus'];
  contractValidationStatus: CandidateToAppPackageValidationResult['status'];
  sourceReadyForDraftPreview: boolean;
}

export interface UserAppPackageDraftPreviewSection {
  id: string;
  label: string;
  items: string[];
  status: 'ready' | 'warning' | 'blocked';
}

export interface UserAppPackageDraftPreviewWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface UserAppPackageDraftPreviewBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface UserAppPackageDraftPreviewTrace {
  source: UserAppPackageDraftPreviewSource;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noFormalUserAppTemplatePackageGenerated: true;
  noUserAppPackageRegistryWrite: true;
  noAutoPublish: true;
}

export interface UserAppPackageDraftPreview {
  previewId: string;
  sourceContractPreparationId: string;
  sourceCandidatePackageId: string;
  titlePreview: string;
  summaryPreview: string;
  styleTagsPreview: string[];
  difficultyPreview: string;
  estimatedTimePreview: string;
  suitableScenariosPreview: string[];
  toolsChecklistPreview: string[];
  productPlaceholderPreview: string[];
  stepGuidancePreview: string[];
  regionGuidancePreview: string[];
  userFacingCopyPreview: {
    title: string;
    summary: string;
    primaryAction: string;
    boundaryNotice: string;
  };
  privacyNoticePreview: string;
  sections: UserAppPackageDraftPreviewSection[];
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  trace: UserAppPackageDraftPreviewTrace;
  warnings: UserAppPackageDraftPreviewWarning[];
  blockedReasons: UserAppPackageDraftPreviewBlockedReason[];
  previewStatus: UserAppPackageDraftPreviewStatus;
  draftPreviewOnly: true;
  notFormalUserAppTemplatePackage: true;
  notPublished: true;
  noUserAppPackageRegistryWrite: true;
  formalUserAppTemplatePackageGenerationBlocked: true;
  jsonRoundTripStable: boolean;
}

export interface CreateUserAppPackageDraftPreviewInput {
  preparation: CandidateToAppPackageContractPreparation;
  validation: CandidateToAppPackageValidationResult;
  previewId?: string;
}

const splitPreview = (value: string): string[] =>
  value
    .split(/\s*\/\s*|\s*,\s*|\s*；\s*|\s*;\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item !== 'missing');

const rawImageReferencePattern =
  /data:image|blob:|object URL|base64|\/Users\/|\/private\/|[A-Z]:\\|file:\/\/|face_landmarker\.task|vision_wasm/i;
const personalDataPattern =
  /真实姓名|手机号|邮箱|联系方式|身份证|健康信息|过敏|faceEmbedding|biometricId|biometric identifier|raw camera/i;
const userAppMutationPattern =
  /user_app_template_package_mutation|generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|"appTemplateId"\s*:|UserAppTemplatePackage mutation|正式 UserAppTemplatePackage 已生成/i;
const autoPublishPattern = /自动发布|已发布到用户 App|已上线|production ready|published to user app/i;
const medicalClaimPattern = /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos/i;
const shadeClaimPattern = /色号|shade\s*#?|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s/i;
const finalClaimPattern =
  /最终识别完成|最终识别为|最终结果|final result|final recognition|final approval|AI 已确认/i;

const createBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): UserAppPackageDraftPreviewBlockedReason => ({ id, message, recommendation });

const createWarning = (
  id: string,
  message: string,
  recommendation: string,
): UserAppPackageDraftPreviewWarning => ({ id, message, recommendation });

const isMissing = (value: string): boolean => value.trim().length === 0 || value.trim() === 'missing';

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const sectionStatus = (items: string[], warning = false): UserAppPackageDraftPreviewSection['status'] => {
  if (items.length === 0) {
    return 'blocked';
  }
  return warning ? 'warning' : 'ready';
};

export const createUserAppPackageDraftPreview = ({
  preparation,
  validation,
  previewId = `user-app-draft-preview-${preparation.preparationId}`,
}: CreateUserAppPackageDraftPreviewInput): UserAppPackageDraftPreview => {
  const titlePreview = preparation.titleMapping.previewValue;
  const summaryPreview = preparation.summaryMapping.previewValue;
  const styleTagsPreview = splitPreview(preparation.styleTagsMapping.previewValue);
  const suitableScenariosPreview = splitPreview(preparation.suitableScenariosMapping.previewValue);
  const toolsChecklistPreview = splitPreview(preparation.toolsChecklistMapping.previewValue);
  const productPlaceholderPreview = splitPreview(preparation.productPlaceholderMapping.previewValue);
  const stepGuidancePreview = splitPreview(preparation.stepSequenceMapping.previewValue);
  const regionGuidancePreview = splitPreview(preparation.regionGuidanceMapping.previewValue);
  const privacyNoticePreview =
    '本地草稿预览：不上传照片、不写用户 App 包 registry、不训练模型、不生成正式 UserAppTemplatePackage。';

  const blockedReasons: UserAppPackageDraftPreviewBlockedReason[] = [];
  const warnings: UserAppPackageDraftPreviewWarning[] = [];
  const sourceReady =
    validation.status === 'app_contract_validation_ready' ||
    validation.status === 'app_contract_validation_ready_with_warnings';

  if (!sourceReady || preparation.contractStatus === 'contract_preparation_blocked') {
    blockedReasons.push(
      createBlockedReason(
        'source_contract_not_ready',
        'User App 包草稿预览需要 10D app contract validation ready 或 ready with warnings。',
        '先修复 candidate-to-app contract preparation / validation。',
      ),
    );
  }

  if (preparation.contractStatus === 'contract_preparation_example_only') {
    warnings.push(
      createWarning(
        'example_only_source',
        '当前 source 仅为 example-only，不能作为正式用户 App 包草稿输入。',
        '仅保留为管理员预览或测试 fixture。',
      ),
    );
  }

  if (isMissing(titlePreview) || isMissing(summaryPreview)) {
    blockedReasons.push(
      createBlockedReason(
        'missing_user_facing_copy',
        '缺少用户可见标题或摘要，不能生成 ready draft preview。',
        '补充用户能看懂的标题和摘要文案。',
      ),
    );
  } else if (titlePreview.length < 4 || summaryPreview.length < 12) {
    warnings.push(
      createWarning(
        'thin_user_facing_copy',
        '用户可见文案偏短，预览可以生成但需要文案复核。',
        '补充更清楚的用户侧说明。',
      ),
    );
  }

  if (stepGuidancePreview.length === 0 || preparation.stepSequenceMapping.status === 'blocked') {
    blockedReasons.push(
      createBlockedReason(
        'missing_step_guidance',
        '缺少步骤引导，不能生成用户 App 包草稿预览。',
        '回到模板工作台补齐 reviewed step guidance。',
      ),
    );
  }

  if (regionGuidancePreview.length === 0 || preparation.regionGuidanceMapping.status === 'blocked') {
    blockedReasons.push(
      createBlockedReason(
        'missing_region_guidance',
        '缺少区域说明，用户 App 包草稿预览不可用。',
        '补齐安全、可理解的区域说明。',
      ),
    );
  }

  const unsafePreviewPayload = JSON.stringify({
    titlePreview,
    summaryPreview,
    styleTagsPreview,
    difficultyPreview: preparation.difficultyMapping.previewValue,
    estimatedTimePreview: preparation.estimatedTimeMapping.previewValue,
    suitableScenariosPreview,
    toolsChecklistPreview,
    productPlaceholderPreview,
    stepGuidancePreview,
    regionGuidancePreview,
    privacyNoticePreview,
  });

  if (rawImageReferencePattern.test(unsafePreviewPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'raw_image_reference',
        'Draft preview 不能包含图片 bytes、object URL、base64、本地路径或 MediaPipe runtime 资源名。',
        '只保留 reviewed text guidance 和 trace id。',
      ),
    );
  }

  if (personalDataPattern.test(unsafePreviewPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'personal_data',
        'Draft preview 不能包含真实姓名、联系方式、健康信息、敏感身份或生物识别信息。',
        '移除个人数据，只保留匿名模板信息。',
      ),
    );
  }

  if (medicalClaimPattern.test(unsafePreviewPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'medical_claim',
        'Draft preview 不能包含医疗、诊断或皮肤健康治疗承诺。',
        '改为普通妆容指导文案。',
      ),
    );
  }

  if (shadeClaimPattern.test(unsafePreviewPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'product_shade_claim',
        'Draft preview 不能包含具体品牌色号或未经验证的产品色号承诺。',
        '保持产品建议为类别占位。',
      ),
    );
  }

  if (finalClaimPattern.test(unsafePreviewPayload)) {
    blockedReasons.push(
      createBlockedReason(
        'unsupported_final_claim',
        'Draft preview 不能声称最终识别、最终确认或 AI 已确认。',
        '保持候选 / 草稿 / 人工审核文案。',
      ),
    );
  }

  if (userAppMutationPattern.test(unsafePreviewPayload) || !preparation.formalUserAppTemplatePackageGenerationBlocked) {
    blockedReasons.push(
      createBlockedReason(
        'user_app_template_package_mutation',
        'Phase 10E 不能生成或 mutation 正式 UserAppTemplatePackage。',
        '只保留 draft preview，并把正式草稿 gate 留给后续阶段。',
      ),
    );
  }

  if (autoPublishPattern.test(unsafePreviewPayload) || !preparation.userAppPackageRegistryWriteBlocked) {
    blockedReasons.push(
      createBlockedReason(
        'auto_publish_or_registry_write',
        'Draft preview 不能发布到用户 App，也不能写用户 App 包 registry。',
        '保留本地管理员预览和后续 handoff。',
      ),
    );
  }

  if (validation.status === 'app_contract_validation_ready_with_warnings') {
    warnings.push(
      createWarning(
        'source_contract_validation_warning',
        '10D app contract validation 带警告。',
        '进入正式用户 App 包草稿 gate 前复核 10D warning。',
      ),
    );
  }

  const sections: UserAppPackageDraftPreviewSection[] = [
    {
      id: 'display_copy',
      label: '用户侧文案',
      items: [titlePreview, summaryPreview].filter((item) => !isMissing(item)),
      status: sectionStatus([titlePreview, summaryPreview].filter((item) => !isMissing(item))),
    },
    {
      id: 'step_guidance',
      label: '步骤引导',
      items: stepGuidancePreview,
      status: sectionStatus(stepGuidancePreview),
    },
    {
      id: 'region_guidance',
      label: '区域说明',
      items: regionGuidancePreview,
      status: sectionStatus(regionGuidancePreview),
    },
    {
      id: 'tools_products',
      label: '工具 / 产品占位',
      items: [...toolsChecklistPreview, ...productPlaceholderPreview],
      status: sectionStatus([...toolsChecklistPreview, ...productPlaceholderPreview]),
    },
  ];

  const previewStatus: UserAppPackageDraftPreviewStatus =
    preparation.contractStatus === 'contract_preparation_example_only'
      ? 'draft_preview_example_only'
      : blockedReasons.length > 0
        ? 'draft_preview_blocked'
        : warnings.length > 0 || sections.some((section) => section.status === 'warning')
          ? 'draft_preview_ready_with_warnings'
          : 'draft_preview_ready';

  const preview: UserAppPackageDraftPreview = {
    previewId,
    sourceContractPreparationId: preparation.preparationId,
    sourceCandidatePackageId: preparation.sourceCandidatePackageId,
    titlePreview,
    summaryPreview,
    styleTagsPreview,
    difficultyPreview: preparation.difficultyMapping.previewValue,
    estimatedTimePreview: preparation.estimatedTimeMapping.previewValue,
    suitableScenariosPreview,
    toolsChecklistPreview,
    productPlaceholderPreview,
    stepGuidancePreview,
    regionGuidancePreview,
    userFacingCopyPreview: {
      title: titlePreview,
      summary: summaryPreview,
      primaryAction: '开始跟练草稿预览',
      boundaryNotice: '这是用户 App 包草稿预览，不是正式 UserAppTemplatePackage。',
    },
    privacyNoticePreview,
    sections,
    qaTrace: preparation.qaTraceMapping.previewValue,
    humanReviewTrace: preparation.humanReviewTraceMapping.previewValue,
    candidateTrace: preparation.candidateTraceMapping.previewValue,
    contractTrace: preparation.preparationId,
    trace: {
      source: {
        contractPreparationStatus: preparation.contractStatus,
        contractValidationStatus: validation.status,
        sourceReadyForDraftPreview: sourceReady,
      },
      qaTrace: preparation.qaTraceMapping.previewValue,
      humanReviewTrace: preparation.humanReviewTraceMapping.previewValue,
      candidateTrace: preparation.candidateTraceMapping.previewValue,
      contractTrace: preparation.preparationId,
      noRawImageReference: !rawImageReferencePattern.test(unsafePreviewPayload),
      noPersonalData: !personalDataPattern.test(unsafePreviewPayload),
      noFormalUserAppTemplatePackageGenerated: true,
      noUserAppPackageRegistryWrite: true,
      noAutoPublish: true,
    },
    warnings,
    blockedReasons,
    previewStatus,
    draftPreviewOnly: true,
    notFormalUserAppTemplatePackage: true,
    notPublished: true,
    noUserAppPackageRegistryWrite: true,
    formalUserAppTemplatePackageGenerationBlocked: true,
    jsonRoundTripStable: true,
  };

  preview.jsonRoundTripStable = isJsonRoundTripStable(preview);
  if (!preview.jsonRoundTripStable && preview.previewStatus !== 'draft_preview_blocked') {
    preview.blockedReasons.push(
      createBlockedReason(
        'json_round_trip_unstable',
        'Draft preview 必须 JSON round-trip 稳定。',
        '移除不可序列化字段后再预览。',
      ),
    );
    preview.previewStatus = 'draft_preview_blocked';
  }

  return preview;
};
