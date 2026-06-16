import type { CandidateToAppPackageContractPreparation } from './candidateToAppPackageContract';

export type CandidateToAppPackageValidationSeverity = 'info' | 'warning' | 'blocking';

export type CandidateToAppPackageValidationStatus =
  | 'app_contract_validation_ready'
  | 'app_contract_validation_ready_with_warnings'
  | 'app_contract_validation_blocked';

export type CandidateToAppPackageValidationCheckId =
  | 'source_candidate_ready'
  | 'title_summary_mapped'
  | 'step_sequence_mapped'
  | 'region_guidance_mapped'
  | 'tools_mapped'
  | 'product_placeholders_mapped'
  | 'no_raw_image_reference'
  | 'no_user_personal_data'
  | 'no_auto_publish'
  | 'no_user_app_package_mutation'
  | 'user_app_contract_boundary_safe'
  | 'qa_human_review_trace_preserved'
  | 'json_round_trip_safe';

export interface CandidateToAppPackageValidationCheck {
  id: CandidateToAppPackageValidationCheckId;
  label: string;
  passed: boolean;
  severity: CandidateToAppPackageValidationSeverity;
  message: string;
}

export interface CandidateToAppPackageValidationIssue {
  id: string;
  checkId: CandidateToAppPackageValidationCheckId;
  severity: Exclude<CandidateToAppPackageValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface CandidateToAppPackageValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_app_package_draft_preview'
    | 'request_contract_preparation_revision'
    | 'block_app_package_preparation';
}

export interface CandidateToAppPackageValidationResult {
  status: CandidateToAppPackageValidationStatus;
  checks: CandidateToAppPackageValidationCheck[];
  issues: CandidateToAppPackageValidationIssue[];
  recommendations: CandidateToAppPackageValidationRecommendation[];
  jsonRoundTripStable: boolean;
  readyForUserAppPackageDraftPreview: boolean;
  mappingPreviewOnly: true;
  notPublished: true;
  formalUserAppTemplatePackageGenerationBlocked: true;
  userAppPackageRegistryWriteBlocked: true;
}

const rawImageReferencePattern =
  /data:image|blob:|object URL|base64|\/Users\/|\/private\/|[A-Z]:\\|file:\/\/|face_landmarker\.task|vision_wasm/i;
const personalDataPattern =
  /真实姓名|手机号|邮箱|联系方式|身份证|健康信息|过敏|faceEmbedding|biometricId|biometric identifier|raw camera/i;
const userAppMutationPattern =
  /user_app_template_package_mutation|generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|"appTemplateId"\s*:|"packageId"\s*:|UserAppTemplatePackage mutation|正式 UserAppTemplatePackage 已生成/i;

const createCheck = (
  id: CandidateToAppPackageValidationCheckId,
  label: string,
  passed: boolean,
  severity: CandidateToAppPackageValidationSeverity,
  message: string,
): CandidateToAppPackageValidationCheck => ({ id, label, passed, severity, message });

const issueForCheck = (
  check: CandidateToAppPackageValidationCheck,
  recommendation: string,
): CandidateToAppPackageValidationIssue | null => {
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

const isJsonRoundTripStable = (preparation: CandidateToAppPackageContractPreparation): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(preparation))) === JSON.stringify(preparation);
  } catch {
    return false;
  }
};

export const validateCandidateToAppPackageContract = (
  preparation: CandidateToAppPackageContractPreparation,
): CandidateToAppPackageValidationResult => {
  const preparationText = JSON.stringify(preparation, null, 2);
  const jsonRoundTripStable = isJsonRoundTripStable(preparation);
  const sourceReady =
    preparation.contractStatus === 'contract_preparation_ready' ||
    preparation.contractStatus === 'contract_preparation_ready_with_warnings';
  const hasBlockingPreparationReason = preparation.blockedReasons.length > 0;

  const checks: CandidateToAppPackageValidationCheck[] = [
    createCheck(
      'source_candidate_ready',
      'Source candidate ready',
      sourceReady && !hasBlockingPreparationReason,
      'blocking',
      'App contract validation requires a ready candidate-to-app preparation.',
    ),
    createCheck(
      'title_summary_mapped',
      'Title and summary mapped',
      preparation.titleMapping.status !== 'blocked' && preparation.summaryMapping.status !== 'blocked',
      'blocking',
      'Title and summary mappings are required.',
    ),
    createCheck(
      'step_sequence_mapped',
      'Step sequence mapped',
      preparation.stepSequenceMapping.status !== 'blocked',
      'blocking',
      'Reviewed step sequence mapping is required.',
    ),
    createCheck(
      'region_guidance_mapped',
      'Region guidance mapped',
      preparation.regionGuidanceMapping.status !== 'blocked',
      'blocking',
      'Region guidance mapping is required for future app steps.',
    ),
    createCheck(
      'tools_mapped',
      'Tools mapped',
      preparation.toolsChecklistMapping.status !== 'blocked',
      'blocking',
      'Tool checklist mapping is required.',
    ),
    createCheck(
      'product_placeholders_mapped',
      'Product placeholders mapped',
      preparation.productPlaceholderMapping.status !== 'blocked',
      'blocking',
      'Product suggestions must remain placeholders.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      preparation.trace.noRawImageReference && !rawImageReferencePattern.test(preparationText),
      'blocking',
      'Preparation must not contain raw image references, object URLs, base64, local paths, or MediaPipe asset names.',
    ),
    createCheck(
      'no_user_personal_data',
      'No user personal data',
      !personalDataPattern.test(preparationText),
      'blocking',
      'Preparation must not contain real names, contact, health, sensitive identity, or biometric data.',
    ),
    createCheck(
      'no_auto_publish',
      'No automatic publish',
      preparation.notPublished &&
        preparation.trace.noAutoPublish &&
        preparation.userAppPackageRegistryWriteBlocked,
      'blocking',
      'Preparation must remain local preview only and must not publish or write a registry.',
    ),
    createCheck(
      'no_user_app_package_mutation',
      'No UserAppTemplatePackage mutation',
      preparation.formalUserAppTemplatePackageGenerationBlocked &&
        preparation.trace.noFormalUserAppPackageGenerated &&
        !userAppMutationPattern.test(preparationText),
      'blocking',
      'Preparation must not generate or mutate a formal UserAppTemplatePackage.',
    ),
    createCheck(
      'user_app_contract_boundary_safe',
      'User app contract boundary safe',
      preparation.mappingPreviewOnly &&
        preparation.trace.noUserAppPackageRegistryWrite &&
        preparation.contractStatus !== 'contract_preparation_example_only',
      preparation.contractStatus === 'contract_preparation_example_only' ? 'warning' : 'blocking',
      'Passing validation still means contract preparation ready, not published package ready.',
    ),
    createCheck(
      'qa_human_review_trace_preserved',
      'QA and human review trace preserved',
      preparation.trace.qaTracePreserved &&
        preparation.trace.humanReviewTracePreserved &&
        preparation.trace.privacyTracePreserved,
      'blocking',
      'QA trace, human review trace, and privacy trace must remain preserved.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Preparation must survive JSON round-trip without changing.',
    ),
  ];

  const recommendationByCheck: Record<CandidateToAppPackageValidationCheckId, string> = {
    source_candidate_ready: 'Use a candidate validation ready source before app contract preparation.',
    title_summary_mapped: 'Map title and summary from the candidate package.',
    step_sequence_mapped: 'Preserve reviewed steps before handoff.',
    region_guidance_mapped: 'Add reviewed region guidance.',
    tools_mapped: 'Add reviewed tool checklist.',
    product_placeholders_mapped: 'Keep products as placeholders.',
    no_raw_image_reference: 'Remove raw image references and local runtime asset names.',
    no_user_personal_data: 'Remove personal, health, contact, or biometric data.',
    no_auto_publish: 'Keep publication and registry writes out of Phase 10D.',
    no_user_app_package_mutation: 'Defer UserAppTemplatePackage draft generation to a later explicit phase.',
    user_app_contract_boundary_safe: 'Keep this as mapping preview and handoff only.',
    qa_human_review_trace_preserved: 'Regenerate with QA, human review, and privacy trace preserved.',
    json_round_trip_safe: 'Remove non-serializable values.',
  };

  const issues = checks
    .map((check) => issueForCheck(check, recommendationByCheck[check.id]))
    .filter((issue): issue is CandidateToAppPackageValidationIssue => Boolean(issue));
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning =
    preparation.warnings.length > 0 || issues.some((issue) => issue.severity === 'warning');
  const status: CandidateToAppPackageValidationStatus = hasBlockingIssue
    ? 'app_contract_validation_blocked'
    : hasWarning
      ? 'app_contract_validation_ready_with_warnings'
      : 'app_contract_validation_ready';

  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: hasBlockingIssue ? 'block_app_contract_preparation' : 'app_package_draft_preview_next',
        message: hasBlockingIssue
          ? '候选 App 包契约准备被阻断，不能进入 User App 包草稿预览。'
          : '可进入 User App 包草稿准备，但还不是正式用户模板包。',
        action: hasBlockingIssue
          ? 'block_app_package_preparation'
          : hasWarning
            ? 'request_contract_preparation_revision'
            : 'continue_to_app_package_draft_preview',
      },
    ],
    jsonRoundTripStable,
    readyForUserAppPackageDraftPreview: !hasBlockingIssue,
    mappingPreviewOnly: true,
    notPublished: true,
    formalUserAppTemplatePackageGenerationBlocked: true,
    userAppPackageRegistryWriteBlocked: true,
  };
};
