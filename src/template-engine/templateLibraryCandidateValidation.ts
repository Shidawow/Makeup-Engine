import type { TemplateLibraryCandidatePackage } from './templateLibraryCandidatePackage';

export type TemplateLibraryCandidateValidationSeverity = 'info' | 'warning' | 'blocking';

export type TemplateLibraryCandidateValidationStatus =
  | 'candidate_validation_ready'
  | 'candidate_validation_ready_with_warnings'
  | 'candidate_validation_blocked';

export type TemplateLibraryCandidateValidationCheckId =
  | 'has_approved_human_review'
  | 'source_draft_trace_present'
  | 'qa_trace_present'
  | 'title_summary_ready'
  | 'reviewed_steps_ready'
  | 'region_guidance_ready'
  | 'tools_checklist_ready'
  | 'product_suggestions_are_placeholders'
  | 'privacy_boundary_safe'
  | 'no_raw_image_reference'
  | 'no_auto_publish'
  | 'no_user_app_package_mutation'
  | 'json_round_trip_safe';

export interface TemplateLibraryCandidateValidationCheck {
  id: TemplateLibraryCandidateValidationCheckId;
  label: string;
  passed: boolean;
  severity: TemplateLibraryCandidateValidationSeverity;
  message: string;
}

export interface TemplateLibraryCandidateValidationIssue {
  id: string;
  checkId: TemplateLibraryCandidateValidationCheckId;
  severity: Exclude<TemplateLibraryCandidateValidationSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface TemplateLibraryCandidateValidationRecommendation {
  id: string;
  message: string;
  action:
    | 'continue_to_candidate_library_review'
    | 'request_candidate_package_revision'
    | 'block_candidate_package';
}

export interface TemplateLibraryCandidateValidationResult {
  status: TemplateLibraryCandidateValidationStatus;
  checks: TemplateLibraryCandidateValidationCheck[];
  issues: TemplateLibraryCandidateValidationIssue[];
  recommendations: TemplateLibraryCandidateValidationRecommendation[];
  jsonRoundTripStable: boolean;
  candidateReadyForLibraryReview: boolean;
  notPublished: true;
  formalTemplateLibraryWriteBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
}

const rawImageReferencePattern =
  /data:image|blob:|object URL|base64|\/Users\/|\/private\/|[A-Z]:\\|file:\/\/|face_landmarker\.task|vision_wasm/i;
const userAppMutationPattern =
  /generatedUserAppTemplatePackage|mutatesUserAppTemplatePackage|appTemplateId|packageId|UserAppTemplatePackage mutation/i;
const finalClaimPattern =
  /最终识别完成|最终识别为|最终结果|final result|final recognition|final approval|AI 已确认|正式模板/i;
const medicalClaimPattern = /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos/i;
const shadeClaimPattern = /色号|shade\s*#?|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s/i;

const createCheck = (
  id: TemplateLibraryCandidateValidationCheckId,
  label: string,
  passed: boolean,
  severity: TemplateLibraryCandidateValidationSeverity,
  message: string,
): TemplateLibraryCandidateValidationCheck => ({ id, label, passed, severity, message });

const issueForCheck = (
  check: TemplateLibraryCandidateValidationCheck,
  recommendation: string,
): TemplateLibraryCandidateValidationIssue | null => {
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

const isJsonRoundTripStable = (candidatePackage: TemplateLibraryCandidatePackage): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(candidatePackage))) === JSON.stringify(candidatePackage);
  } catch {
    return false;
  }
};

export const validateTemplateLibraryCandidatePackage = (
  candidatePackage: TemplateLibraryCandidatePackage,
): TemplateLibraryCandidateValidationResult => {
  const packageText = JSON.stringify(candidatePackage, null, 2);
  const jsonRoundTripStable = isJsonRoundTripStable(candidatePackage);
  const productPlaceholderSafe = candidatePackage.productSuggestionPlaceholders.every(
    (item) => item.placeholderOnly === true,
  );
  const packageBlockedForUserAppMutation = candidatePackage.blockedReasons.some(
    (reason) => reason.id === 'user_app_template_package_mutation',
  );
  const privacySafe =
    candidatePackage.privacyBoundaryTrace.noRawImageReference &&
    candidatePackage.privacyBoundaryTrace.noRealPersonalData &&
    candidatePackage.privacyBoundaryTrace.noBackend &&
    candidatePackage.privacyBoundaryTrace.noTraining &&
    candidatePackage.privacyBoundaryTrace.noUpload &&
    !finalClaimPattern.test(packageText) &&
    !medicalClaimPattern.test(packageText) &&
    !shadeClaimPattern.test(packageText);

  const checks: TemplateLibraryCandidateValidationCheck[] = [
    createCheck(
      'has_approved_human_review',
      'Approved human review',
      candidatePackage.approvedHumanReviewDecision === 'approve_for_template_library_candidate' &&
        candidatePackage.humanReviewTrace.reviewWorkflowStatus === 'approved_as_library_candidate',
      'blocking',
      'Candidate package requires approved_as_library_candidate trace from Phase 10B.',
    ),
    createCheck(
      'source_draft_trace_present',
      'Source draft trace present',
      Boolean(candidatePackage.sourceDraftId),
      'blocking',
      'Candidate package must preserve sourceDraftId.',
    ),
    createCheck(
      'qa_trace_present',
      'QA trace present',
      Boolean(candidatePackage.qaTrace.qaStatus) && candidatePackage.qaTrace.qaStatus !== 'draft_qa_blocked',
      'blocking',
      'Candidate package must preserve non-blocked QA trace.',
    ),
    createCheck(
      'title_summary_ready',
      'Title and summary ready',
      candidatePackage.title.trim().length > 0 && candidatePackage.summary.trim().length > 0,
      'blocking',
      'Candidate package needs title and summary.',
    ),
    createCheck(
      'reviewed_steps_ready',
      'Reviewed steps ready',
      candidatePackage.reviewedSteps.length > 0,
      'blocking',
      'Candidate package needs reviewed draft steps.',
    ),
    createCheck(
      'region_guidance_ready',
      'Region guidance ready',
      candidatePackage.regionGuidance.length > 0,
      'blocking',
      'Candidate package needs region guidance.',
    ),
    createCheck(
      'tools_checklist_ready',
      'Tools checklist ready',
      candidatePackage.toolsChecklist.length > 0,
      'blocking',
      'Candidate package needs a tools checklist.',
    ),
    createCheck(
      'product_suggestions_are_placeholders',
      'Product suggestions are placeholders',
      productPlaceholderSafe,
      'blocking',
      'Product suggestions must remain category placeholders.',
    ),
    createCheck(
      'privacy_boundary_safe',
      'Privacy boundary safe',
      privacySafe,
      'blocking',
      'Candidate package must not contain privacy, final claim, medical, or shade claim risk.',
    ),
    createCheck(
      'no_raw_image_reference',
      'No raw image reference',
      !rawImageReferencePattern.test(packageText),
      'blocking',
      'Candidate package must not contain raw image references, object URLs, base64, local paths, or MediaPipe runtime assets.',
    ),
    createCheck(
      'no_auto_publish',
      'No automatic publishing',
      candidatePackage.notPublished &&
        candidatePackage.formalTemplateLibraryWriteBlocked &&
        candidatePackage.packageStatus !== 'candidate_package_blocked',
      candidatePackage.packageStatus === 'candidate_package_blocked' ? 'warning' : 'blocking',
      'Validation confirms the candidate package is not a published template and does not write the formal template library.',
    ),
    createCheck(
      'no_user_app_package_mutation',
      'No UserAppTemplatePackage mutation',
      candidatePackage.userAppTemplatePackageGenerationBlocked &&
        !packageBlockedForUserAppMutation &&
        !userAppMutationPattern.test(packageText),
      'blocking',
      'Candidate package must not mutate or generate UserAppTemplatePackage.',
    ),
    createCheck(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Candidate package must survive JSON round-trip without changing.',
    ),
  ];

  const recommendationByCheck: Record<TemplateLibraryCandidateValidationCheckId, string> = {
    has_approved_human_review: 'Approve the draft as a template library candidate in human review first.',
    source_draft_trace_present: 'Regenerate candidate package from a valid template draft.',
    qa_trace_present: 'Fix draft QA before candidate packaging.',
    title_summary_ready: 'Add package title and summary.',
    reviewed_steps_ready: 'Include reviewed draft steps.',
    region_guidance_ready: 'Add region guidance derived from reviewed steps.',
    tools_checklist_ready: 'Add tools checklist from reviewed steps.',
    product_suggestions_are_placeholders: 'Replace product claims with category placeholders.',
    privacy_boundary_safe: 'Remove unsafe privacy, final, medical, or shade wording.',
    no_raw_image_reference: 'Remove image bytes, object URLs, base64, local paths, and runtime asset references.',
    no_auto_publish: 'Keep candidate packaging separate from publishing and formal library write.',
    no_user_app_package_mutation: 'Keep UserAppTemplatePackage generation in a later explicit phase.',
    json_round_trip_safe: 'Make package JSON serializable and deterministic.',
  };

  const issues = checks
    .map((check) => issueForCheck(check, recommendationByCheck[check.id]))
    .filter((issue): issue is TemplateLibraryCandidateValidationIssue => Boolean(issue));
  const hasBlockingIssue =
    candidatePackage.blockedReasons.length > 0 ||
    issues.some((issue) => issue.severity === 'blocking');
  const hasWarning =
    candidatePackage.packagingWarnings.length > 0 ||
    issues.some((issue) => issue.severity === 'warning');
  const status: TemplateLibraryCandidateValidationStatus = hasBlockingIssue
    ? 'candidate_validation_blocked'
    : hasWarning
      ? 'candidate_validation_ready_with_warnings'
      : 'candidate_validation_ready';

  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: hasBlockingIssue ? 'block_candidate_package' : 'candidate_library_review_next',
        message: hasBlockingIssue
          ? '候选包验证被阻断，不能进入候选库复核。'
          : '候选包可进入候选库复核，但仍不是已发布模板。',
        action: hasBlockingIssue
          ? 'block_candidate_package'
          : hasWarning
            ? 'request_candidate_package_revision'
            : 'continue_to_candidate_library_review',
      },
    ],
    jsonRoundTripStable,
    candidateReadyForLibraryReview: !hasBlockingIssue,
    notPublished: true,
    formalTemplateLibraryWriteBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
  };
};
