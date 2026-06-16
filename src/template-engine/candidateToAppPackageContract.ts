import type { TemplateLibraryCandidatePackage } from './templateLibraryCandidatePackage';
import type { TemplateLibraryCandidateValidationResult } from './templateLibraryCandidateValidation';

export type CandidateToAppPackageContractStatus =
  | 'contract_preparation_ready'
  | 'contract_preparation_ready_with_warnings'
  | 'contract_preparation_blocked'
  | 'contract_preparation_example_only';

export interface CandidateToAppPackageFieldMapping {
  id: string;
  sourceField: string;
  targetContractField: string;
  previewValue: string;
  status: 'mapped' | 'warning' | 'blocked';
  note: string;
}

export interface CandidateToAppPackageMapping {
  id: string;
  label: string;
  fields: CandidateToAppPackageFieldMapping[];
}

export interface CandidateToAppPackageContractWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface CandidateToAppPackageContractBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface CandidateToAppPackageContractTrace {
  sourceCandidatePackageStatus: TemplateLibraryCandidatePackage['packageStatus'];
  sourceCandidateValidationStatus: TemplateLibraryCandidateValidationResult['status'];
  sourceCandidateReadyForLibraryReview: boolean;
  qaTracePreserved: boolean;
  humanReviewTracePreserved: boolean;
  privacyTracePreserved: boolean;
  noRawImageReference: boolean;
  noFormalUserAppPackageGenerated: true;
  noUserAppPackageRegistryWrite: true;
  noAutoPublish: true;
}

export interface CandidateToAppPackageContractPreparation {
  preparationId: string;
  sourceCandidatePackageId: string;
  sourceCandidateValidationId: string;
  titleMapping: CandidateToAppPackageFieldMapping;
  summaryMapping: CandidateToAppPackageFieldMapping;
  styleTagsMapping: CandidateToAppPackageFieldMapping;
  difficultyMapping: CandidateToAppPackageFieldMapping;
  estimatedTimeMapping: CandidateToAppPackageFieldMapping;
  suitableScenariosMapping: CandidateToAppPackageFieldMapping;
  toolsChecklistMapping: CandidateToAppPackageFieldMapping;
  productPlaceholderMapping: CandidateToAppPackageFieldMapping;
  stepSequenceMapping: CandidateToAppPackageFieldMapping;
  regionGuidanceMapping: CandidateToAppPackageFieldMapping;
  privacyBoundaryMapping: CandidateToAppPackageFieldMapping;
  qaTraceMapping: CandidateToAppPackageFieldMapping;
  humanReviewTraceMapping: CandidateToAppPackageFieldMapping;
  candidateTraceMapping: CandidateToAppPackageFieldMapping;
  mappings: CandidateToAppPackageMapping[];
  warnings: CandidateToAppPackageContractWarning[];
  blockedReasons: CandidateToAppPackageContractBlockedReason[];
  contractStatus: CandidateToAppPackageContractStatus;
  trace: CandidateToAppPackageContractTrace;
  mappingPreviewOnly: true;
  notPublished: true;
  formalUserAppTemplatePackageGenerationBlocked: true;
  userAppPackageRegistryWriteBlocked: true;
}

export interface CreateCandidateToAppPackageContractPreparationInput {
  candidatePackage: TemplateLibraryCandidatePackage;
  candidateValidation: TemplateLibraryCandidateValidationResult;
  preparationId?: string;
  sourceCandidateValidationId?: string;
}

const rawImageReferencePattern =
  /data:image|blob:|object URL|base64|\/Users\/|\/private\/|[A-Z]:\\|file:\/\/|face_landmarker\.task|vision_wasm/i;
const userAppMutationPattern =
  /user_app_template_package_mutation|generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|"appTemplateId"\s*:|"packageId"\s*:|UserAppTemplatePackage mutation|正式 UserAppTemplatePackage 已生成/i;
const finalClaimPattern =
  /最终识别完成|最终识别为|最终结果|final result|final recognition|final approval|AI 已确认|正式模板/i;
const medicalClaimPattern = /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos/i;
const shadeClaimPattern = /色号|shade\s*#?|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s/i;

const preview = (values: readonly unknown[], fallback = 'missing'): string => {
  const text = values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value).trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(' / ');
  return text || fallback;
};

const statusFor = (ready: boolean, warning = false): CandidateToAppPackageFieldMapping['status'] => {
  if (!ready) {
    return 'blocked';
  }
  return warning ? 'warning' : 'mapped';
};

const createFieldMapping = (
  id: string,
  sourceField: string,
  targetContractField: string,
  previewValue: string,
  ready: boolean,
  note: string,
  warning = false,
): CandidateToAppPackageFieldMapping => ({
  id,
  sourceField,
  targetContractField,
  previewValue,
  status: statusFor(ready, warning),
  note,
});

const block = (
  id: string,
  message: string,
  recommendation: string,
): CandidateToAppPackageContractBlockedReason => ({ id, message, recommendation });

const hasApprovedHumanReview = (candidatePackage: TemplateLibraryCandidatePackage): boolean =>
  candidatePackage.approvedHumanReviewDecision === 'approve_for_template_library_candidate' &&
  candidatePackage.humanReviewTrace.reviewWorkflowStatus === 'approved_as_library_candidate' &&
  candidatePackage.humanReviewTrace.humanReviewStatus === 'approved_as_template_library_candidate';

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

export const createCandidateToAppPackageContractPreparation = ({
  candidatePackage,
  candidateValidation,
  preparationId = `candidate-to-app-contract-${candidatePackage.candidateId}`,
  sourceCandidateValidationId = `candidate-validation-${candidatePackage.candidateId}`,
}: CreateCandidateToAppPackageContractPreparationInput): CandidateToAppPackageContractPreparation => {
  const unsafePayloadText = JSON.stringify(
    {
      title: candidatePackage.title,
      summary: candidatePackage.summary,
      styleTags: candidatePackage.styleTags,
      suitableScenarios: candidatePackage.suitableScenarios,
      regionGuidance: candidatePackage.regionGuidance,
      reviewedSteps: candidatePackage.reviewedSteps,
      reviewedAttributeCandidates: candidatePackage.reviewedAttributeCandidates,
      productSuggestionPlaceholders: candidatePackage.productSuggestionPlaceholders,
      candidateBlockedReasons: candidatePackage.blockedReasons,
      validationIssues: candidateValidation.issues,
    },
    null,
    2,
  );
  const blockedReasons: CandidateToAppPackageContractBlockedReason[] = [];
  const warnings: CandidateToAppPackageContractWarning[] = [];

  if (
    candidateValidation.status !== 'candidate_validation_ready' &&
    candidateValidation.status !== 'candidate_validation_ready_with_warnings'
  ) {
    blockedReasons.push(
      block(
        'source_candidate_not_ready',
        'Candidate-to-app contract preparation requires candidate validation ready or ready with warnings.',
        'Fix candidate package validation before preparing app contract mapping.',
      ),
    );
  }

  if (candidatePackage.packageStatus === 'candidate_package_blocked') {
    blockedReasons.push(
      block(
        'candidate_package_blocked',
        'Blocked candidate packages cannot become ready app contract preparations.',
        'Resolve 10C candidate package blockers first.',
      ),
    );
  }

  if (!hasApprovedHumanReview(candidatePackage)) {
    blockedReasons.push(
      block(
        'missing_approved_human_review_trace',
        'Approved human review trace is required before app contract preparation.',
        'Return to human review and approve only as a template library candidate first.',
      ),
    );
  }

  if (!candidatePackage.privacyBoundaryTrace) {
    blockedReasons.push(
      block(
        'missing_privacy_trace',
        'Privacy trace is required for candidate-to-app preparation.',
        'Regenerate the candidate package with privacy boundary trace preserved.',
      ),
    );
  } else if (
    !candidatePackage.privacyBoundaryTrace.noRawImageReference ||
    !candidatePackage.privacyBoundaryTrace.noRealPersonalData
  ) {
    blockedReasons.push(
      block(
        'privacy_trace_unsafe',
        'Privacy trace reports raw image or personal data risk.',
        'Remove unsafe references before contract preparation.',
      ),
    );
  }

  if (rawImageReferencePattern.test(unsafePayloadText)) {
    blockedReasons.push(
      block(
        'raw_image_reference',
        'Contract preparation must not contain image bytes, object URLs, base64, local paths, or MediaPipe runtime asset names.',
        'Keep only durable candidate metadata and reviewed guidance.',
      ),
    );
  }

  if (userAppMutationPattern.test(unsafePayloadText)) {
    blockedReasons.push(
      block(
        'user_app_template_package_mutation',
        'Phase 10D must not generate or mutate UserAppTemplatePackage fields.',
        'Keep this artifact as mapping preview only and defer app package draft creation.',
      ),
    );
  }

  if (finalClaimPattern.test(unsafePayloadText)) {
    blockedReasons.push(
      block(
        'unsupported_final_claim',
        'Contract preparation must not contain final recognition or final approval claims.',
        'Use candidate and preview wording only.',
      ),
    );
  }

  if (medicalClaimPattern.test(unsafePayloadText)) {
    blockedReasons.push(
      block(
        'medical_claim',
        'Contract preparation must not contain medical or skin-health claims.',
        'Remove diagnosis or treatment wording.',
      ),
    );
  }

  if (shadeClaimPattern.test(unsafePayloadText)) {
    blockedReasons.push(
      block(
        'product_shade_claim',
        'Contract preparation must not contain brand or shade specific product claims.',
        'Keep product suggestions as category placeholders.',
      ),
    );
  }

  if (candidateValidation.status === 'candidate_validation_ready_with_warnings') {
    warnings.push({
      id: 'source_candidate_validation_warning',
      message: 'Source candidate validation is ready with warnings.',
      recommendation: 'Review warning details before moving to app package draft preview.',
    });
  }

  if (candidatePackage.regionGuidance.length === 0) {
    blockedReasons.push(
      block(
        'missing_region_guidance',
        'Region guidance is required for app-facing step preparation.',
        'Add reviewed region guidance before preparing app contract mapping.',
      ),
    );
  }

  const titleMapping = createFieldMapping(
    'title_mapping',
    'candidatePackage.title',
    'futureAppTemplate.title',
    candidatePackage.title,
    candidatePackage.title.trim().length > 0,
    'Title is mapped as preview copy only.',
  );
  const summaryMapping = createFieldMapping(
    'summary_mapping',
    'candidatePackage.summary',
    'futureAppTemplate.subtitle',
    candidatePackage.summary,
    candidatePackage.summary.trim().length > 0,
    'Summary is mapped as preview copy only.',
  );
  const styleTagsMapping = createFieldMapping(
    'style_tags_mapping',
    'candidatePackage.styleTags',
    'futureAppTemplate.styleTags',
    preview(candidatePackage.styleTags),
    candidatePackage.styleTags.length > 0,
    'Style tags remain candidate metadata.',
  );
  const difficultyMapping = createFieldMapping(
    'difficulty_mapping',
    'candidatePackage.difficulty',
    'futureAppTemplate.difficulty',
    candidatePackage.difficulty,
    Boolean(candidatePackage.difficulty),
    'Difficulty is normalized only in a later draft phase.',
  );
  const estimatedTimeMapping = createFieldMapping(
    'estimated_time_mapping',
    'candidatePackage.estimatedTime',
    'futureAppTemplate.estimatedDurationMinutes',
    candidatePackage.estimatedTime,
    candidatePackage.estimatedTime.trim().length > 0,
    'Duration is preview-only and not written to an app package.',
  );
  const suitableScenariosMapping = createFieldMapping(
    'suitable_scenarios_mapping',
    'candidatePackage.suitableScenarios',
    'futureAppTemplate.suitableOccasions',
    preview(candidatePackage.suitableScenarios),
    candidatePackage.suitableScenarios.length > 0,
    'Scenarios stay local candidate metadata.',
  );
  const toolsChecklistMapping = createFieldMapping(
    'tools_checklist_mapping',
    'candidatePackage.toolsChecklist',
    'futureAppTemplate.requiredTools',
    preview(candidatePackage.toolsChecklist),
    candidatePackage.toolsChecklist.length > 0,
    'Tools are mapped as checklist preview only.',
  );
  const productPlaceholderMapping = createFieldMapping(
    'product_placeholder_mapping',
    'candidatePackage.productSuggestionPlaceholders',
    'futureAppTemplate.productSuggestions',
    preview(candidatePackage.productSuggestionPlaceholders.map((item) => item.category)),
    candidatePackage.productSuggestionPlaceholders.length > 0 &&
      candidatePackage.productSuggestionPlaceholders.every((item) => item.placeholderOnly),
    'Products must remain category placeholders.',
  );
  const stepSequenceMapping = createFieldMapping(
    'step_sequence_mapping',
    'candidatePackage.reviewedSteps',
    'futureAppTemplate.steps',
    preview(candidatePackage.reviewedSteps.map((step) => `${step.order}. ${step.region}`)),
    candidatePackage.reviewedSteps.length > 0,
    'Reviewed steps become app-step draft inputs later.',
  );
  const regionGuidanceMapping = createFieldMapping(
    'region_guidance_mapping',
    'candidatePackage.regionGuidance',
    'futureAppTemplate.regionInstructions',
    preview(candidatePackage.regionGuidance),
    candidatePackage.regionGuidance.length > 0,
    'Region guidance is required before app package draft preview.',
  );
  const privacyBoundaryMapping = createFieldMapping(
    'privacy_boundary_mapping',
    'candidatePackage.privacyBoundaryTrace',
    'futureAppTemplate.metadata.safetyBoundary',
    candidatePackage.privacyBoundaryTrace.noRawImageReference ? 'no raw image reference' : 'unsafe privacy trace',
    candidatePackage.privacyBoundaryTrace.noRawImageReference &&
      candidatePackage.privacyBoundaryTrace.noRealPersonalData,
    'Privacy boundary is preserved as review trace.',
  );
  const qaTraceMapping = createFieldMapping(
    'qa_trace_mapping',
    'candidatePackage.qaTrace',
    'futureAppTemplate.metadata.qaTrace',
    candidatePackage.qaTrace.qaStatus,
    Boolean(candidatePackage.qaTrace.qaStatus) && candidatePackage.qaTrace.qaStatus !== 'draft_qa_blocked',
    'QA trace is preserved for reviewer audit.',
  );
  const humanReviewTraceMapping = createFieldMapping(
    'human_review_trace_mapping',
    'candidatePackage.humanReviewTrace',
    'futureAppTemplate.metadata.humanReviewTrace',
    candidatePackage.humanReviewTrace.humanReviewStatus,
    hasApprovedHumanReview(candidatePackage),
    'Human review trace must remain visible.',
  );
  const candidateTraceMapping = createFieldMapping(
    'candidate_trace_mapping',
    'candidatePackage.candidateId',
    'futureAppTemplate.metadata.sourceCandidateTrace',
    candidatePackage.candidateId,
    candidatePackage.candidateId.trim().length > 0,
    'Candidate lineage is preserved without registry writes.',
  );

  const mappings: CandidateToAppPackageMapping[] = [
    {
      id: 'display_copy',
      label: 'Display copy preview',
      fields: [titleMapping, summaryMapping, styleTagsMapping, difficultyMapping, estimatedTimeMapping],
    },
    {
      id: 'guidance_preview',
      label: 'Guidance preview',
      fields: [suitableScenariosMapping, toolsChecklistMapping, productPlaceholderMapping, stepSequenceMapping, regionGuidanceMapping],
    },
    {
      id: 'trace_preview',
      label: 'Trace preview',
      fields: [privacyBoundaryMapping, qaTraceMapping, humanReviewTraceMapping, candidateTraceMapping],
    },
  ];

  const blockedField = mappings.flatMap((mapping) => mapping.fields).find((field) => field.status === 'blocked');
  if (blockedField && !blockedReasons.some((reason) => reason.id === blockedField.id)) {
    blockedReasons.push(
      block(
        blockedField.id,
        `${blockedField.sourceField} is not ready for app contract preparation.`,
        'Complete the missing candidate package field before handoff.',
      ),
    );
  }

  const contractStatus: CandidateToAppPackageContractStatus =
    candidatePackage.packageStatus === 'candidate_package_example_only'
      ? 'contract_preparation_example_only'
      : blockedReasons.length > 0
        ? 'contract_preparation_blocked'
        : warnings.length > 0
          ? 'contract_preparation_ready_with_warnings'
          : 'contract_preparation_ready';

  const preparation: CandidateToAppPackageContractPreparation = {
    preparationId,
    sourceCandidatePackageId: candidatePackage.candidateId,
    sourceCandidateValidationId,
    titleMapping,
    summaryMapping,
    styleTagsMapping,
    difficultyMapping,
    estimatedTimeMapping,
    suitableScenariosMapping,
    toolsChecklistMapping,
    productPlaceholderMapping,
    stepSequenceMapping,
    regionGuidanceMapping,
    privacyBoundaryMapping,
    qaTraceMapping,
    humanReviewTraceMapping,
    candidateTraceMapping,
    mappings,
    warnings,
    blockedReasons,
    contractStatus,
    trace: {
      sourceCandidatePackageStatus: candidatePackage.packageStatus,
      sourceCandidateValidationStatus: candidateValidation.status,
      sourceCandidateReadyForLibraryReview: candidateValidation.candidateReadyForLibraryReview,
      qaTracePreserved: qaTraceMapping.status !== 'blocked',
      humanReviewTracePreserved: humanReviewTraceMapping.status !== 'blocked',
      privacyTracePreserved: privacyBoundaryMapping.status !== 'blocked',
      noRawImageReference: !rawImageReferencePattern.test(unsafePayloadText),
      noFormalUserAppPackageGenerated: true,
      noUserAppPackageRegistryWrite: true,
      noAutoPublish: true,
    },
    mappingPreviewOnly: true,
    notPublished: true,
    formalUserAppTemplatePackageGenerationBlocked: true,
    userAppPackageRegistryWriteBlocked: true,
  };

  if (!isJsonRoundTripStable(preparation)) {
    preparation.blockedReasons.push(
      block(
        'json_round_trip_unstable',
        'Contract preparation must survive JSON round-trip.',
        'Remove non-serializable values before handoff.',
      ),
    );
    preparation.contractStatus = 'contract_preparation_blocked';
  }

  return preparation;
};
