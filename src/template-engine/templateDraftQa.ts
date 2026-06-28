import type { FaceMeshRegionQaReport } from '../vision';
import type { MakeupAttributeCandidateReport } from './makeupAttributeCandidates';
import type { PhotoToTemplateDraftIntegrationReport } from './photoToTemplateDraftIntegration';
import type { MakeupTemplateDraftReport } from './templateDraftGenerator';
import type { RuleBasedStepSequence } from './ruleBasedStepGenerator';

export type TemplateDraftQaSeverity = 'info' | 'warning' | 'blocking';

export type TemplateDraftQaStatus =
  | 'draft_qa_ready_for_human_review'
  | 'draft_qa_ready_with_warnings'
  | 'draft_qa_blocked';

export type TemplateDraftQaCheckId =
  | 'region_qa_ready'
  | 'candidates_have_source_confidence_review_status'
  | 'steps_have_target_regions'
  | 'steps_have_beginner_guidance'
  | 'tools_checklist_present'
  | 'product_suggestions_are_placeholders'
  | 'semantic_candidates_not_final'
  | 'semantic_candidate_human_review_required'
  | 'semantic_candidate_source_type_preserved'
  | 'semantic_candidate_confidence_band_preserved'
  | 'semantic_candidate_evidence_preserved'
  | 'semantic_candidate_limitations_preserved'
  | 'no_final_claims'
  | 'no_fully_automatic_extraction_claim'
  | 'no_ai_confirmed'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_registry_write'
  | 'no_publish'
  | 'no_production_writer'
  | 'publish_blocked_is_true'
  | 'human_review_required'
  | 'user_app_contract_not_mutated'
  | 'privacy_boundary_safe';

export interface TemplateDraftQaCheck {
  id: TemplateDraftQaCheckId;
  label: string;
  passed: boolean;
  severity: TemplateDraftQaSeverity;
  message: string;
}

export interface TemplateDraftQaIssue {
  id: string;
  checkId: TemplateDraftQaCheckId;
  severity: Exclude<TemplateDraftQaSeverity, 'info'>;
  message: string;
  recommendation: string;
}

export interface TemplateDraftQaRecommendation {
  id: string;
  message: string;
  action: 'continue_to_human_review' | 'request_revision' | 'block_draft';
}

export interface TemplateDraftQaResult {
  status: TemplateDraftQaStatus;
  checks: TemplateDraftQaCheck[];
  issues: TemplateDraftQaIssue[];
  recommendations: TemplateDraftQaRecommendation[];
  readyForHumanReview: boolean;
  publishBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
  notes: string[];
}

export interface TemplateDraftQaInput {
  regionQa: FaceMeshRegionQaReport;
  attributeCandidates: MakeupAttributeCandidateReport;
  stepSequence: RuleBasedStepSequence;
  templateDraft: MakeupTemplateDraftReport;
  draftIntegration?: PhotoToTemplateDraftIntegrationReport | null;
}

const finalClaimPattern =
  /最终识别完成|最终识别为|最终结果|final result|final recognition|final approval|confirmed result|AI 已确认|识别完成|正式模板/i;
const fullyAutomaticClaimPattern =
  /fully automatic extraction|fully automatic high-quality|全自动高质量拆妆|自动高质量拆妆|任意照片自动拆妆/i;
const aiConfirmedPattern = /AI 已确认|AI confirmed|auto confirmed|自动确认/i;
const medicalClaimPattern = /治疗|修复皮肤病|痤疮治疗|过敏改善|medical|diagnos/i;
const shadeClaimPattern = /色号|shade\s*#?|mac\s|nars\s|armani\s|dior\s|ysl\s|chanel\s/i;
const registryWriteClaimPattern = /registry write|writeRegistry|写入 registry|已写入 registry|registry mutation/i;
const publishClaimPattern = /已发布|发布到用户 App|published to user app|自动发布|上线/i;
const productionWriterClaimPattern = /production writer|生产 writer|创建 production writer/i;
const privacyRiskPattern =
  /data:image|blob:|object URL|faceEmbedding|biometricId|raw camera|base64|真实姓名|手机号|邮箱|健康信息/i;

const stringifyDraft = (input: TemplateDraftQaInput): string =>
  JSON.stringify(
    {
      candidates: input.attributeCandidates.candidates,
      steps: input.stepSequence.steps,
      draft: input.templateDraft.draft,
      notes: input.templateDraft.notes,
      draftIntegration: input.draftIntegration,
    },
    null,
    2,
  );

const createCheck = (
  id: TemplateDraftQaCheckId,
  label: string,
  passed: boolean,
  severity: TemplateDraftQaSeverity,
  message: string,
): TemplateDraftQaCheck => ({ id, label, passed, severity, message });

const issueForCheck = (
  check: TemplateDraftQaCheck,
  recommendation: string,
): TemplateDraftQaIssue | null => {
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

export const evaluateTemplateDraftQa = (
  input: TemplateDraftQaInput,
): TemplateDraftQaResult => {
  const draftText = stringifyDraft(input);
  const candidates = input.attributeCandidates.candidates;
  const steps = input.stepSequence.steps;
  const draft = input.templateDraft.draft;

  const missingCandidateContract = candidates.some(
    (candidate) =>
      !candidate.source ||
      typeof candidate.confidence !== 'number' ||
      candidate.reviewStatus !== 'needs_human_review',
  );
  const lowConfidenceCandidate = candidates.some(
    (candidate) => candidate.confidence < 0.45,
  );
  const missingStepRegion = steps.some(
    (step) => !step.region || !step.placement?.region || step.region !== step.placement.region,
  );
  const missingBeginnerGuidance = steps.some(
    (step) => step.instruction.trim().length < 10 || step.rationale.trim().length < 10,
  );
  const toolChecklist = Array.from(new Set(steps.map((step) => step.tool))).filter(Boolean);
  const userAppContractMutated = /appTemplateId|packageId|generatedUserAppTemplatePackage/.test(
    draftText,
  );
  const semanticBindings = input.draftIntegration?.bindings ?? [];
  const semanticCandidates = [
    ...semanticBindings,
    ...candidates
      .filter((candidate) => candidate.semanticCandidate)
      .map((candidate) => ({
        notFinal: candidate.notFinal,
        humanReviewRequired: candidate.humanReviewRequired,
        sourceType: candidate.source,
        confidenceBand: candidate.confidence > 0 ? 'attribute_confidence' : '',
        evidence: candidate.evidence,
        limitations: ['Attribute candidate inherits Phase 12B candidate-only boundary.'],
      })),
  ];
  const hasSemanticCandidates = semanticCandidates.length > 0;
  const semanticCandidatesFinal = semanticCandidates.some((candidate) => candidate.notFinal !== true);
  const semanticCandidatesMissingReview = semanticCandidates.some(
    (candidate) => candidate.humanReviewRequired !== true,
  );
  const semanticCandidatesMissingSource = semanticCandidates.some(
    (candidate) => !candidate.sourceType,
  );
  const semanticCandidatesMissingConfidence = semanticCandidates.some(
    (candidate) => !candidate.confidenceBand,
  );
  const semanticCandidatesMissingEvidence = semanticCandidates.some(
    (candidate) => !candidate.evidence || candidate.evidence.length === 0,
  );
  const semanticCandidatesMissingLimitations = semanticCandidates.some(
    (candidate) => !candidate.limitations || candidate.limitations.length === 0,
  );

  const checks: TemplateDraftQaCheck[] = [
    createCheck(
      'region_qa_ready',
      'Region QA ready',
      input.regionQa.status !== 'region_qa_blocked',
      input.regionQa.status === 'region_qa_ready_with_warnings' ? 'warning' : 'blocking',
      input.regionQa.status === 'region_qa_blocked'
        ? 'Region QA is blocked; draft QA cannot continue.'
        : input.regionQa.status === 'region_qa_ready_with_warnings'
          ? 'Region QA is ready with warnings; human reviewer should confirm coverage.'
          : 'Region QA is ready.',
    ),
    createCheck(
      'candidates_have_source_confidence_review_status',
      'Candidates have source, confidence, and review status',
      !missingCandidateContract && !lowConfidenceCandidate,
      missingCandidateContract ? 'blocking' : 'warning',
      missingCandidateContract
        ? 'One or more candidates are missing source, confidence, or needs_human_review status.'
        : lowConfidenceCandidate
          ? 'One or more candidates have low confidence and need reviewer attention.'
          : 'Every candidate keeps source, confidence, and needs_human_review status.',
    ),
    createCheck(
      'steps_have_target_regions',
      'Steps have target regions',
      steps.length > 0 && !missingStepRegion,
      'blocking',
      missingStepRegion
        ? 'One or more generated steps are missing a matching target region.'
        : 'Every generated step has a target region and placement region.',
    ),
    createCheck(
      'steps_have_beginner_guidance',
      'Steps have beginner guidance',
      steps.length > 0 && !missingBeginnerGuidance,
      'blocking',
      missingBeginnerGuidance
        ? 'One or more steps need clearer beginner-friendly instruction and rationale.'
        : 'Generated steps include beginner-facing instruction and rationale.',
    ),
    createCheck(
      'tools_checklist_present',
      'Tools checklist present',
      toolChecklist.length > 0,
      'blocking',
      toolChecklist.length > 0
        ? `Tools are present: ${toolChecklist.join(', ')}.`
        : 'No tool checklist can be derived from the draft steps.',
    ),
    createCheck(
      'product_suggestions_are_placeholders',
      'Product suggestions remain placeholders',
      !shadeClaimPattern.test(
        steps
          .map((step) => `${step.productCategory} ${step.colorFamily ?? ''} ${step.finish ?? ''}`)
          .join('\n'),
      ),
      'blocking',
      'Product suggestions must remain category placeholders, not brand or shade claims.',
    ),
    createCheck(
      'semantic_candidates_not_final',
      'Semantic candidates stay notFinal',
      !hasSemanticCandidates || !semanticCandidatesFinal,
      'blocking',
      'Semantic candidates integrated into draft fields must keep notFinal=true.',
    ),
    createCheck(
      'semantic_candidate_human_review_required',
      'Semantic candidates require human review',
      !hasSemanticCandidates || !semanticCandidatesMissingReview,
      'blocking',
      'Semantic candidates must keep humanReviewRequired=true after draft integration.',
    ),
    createCheck(
      'semantic_candidate_source_type_preserved',
      'Semantic candidate source type preserved',
      !hasSemanticCandidates || !semanticCandidatesMissingSource,
      'blocking',
      'Semantic candidate sourceType must be preserved for draft QA.',
    ),
    createCheck(
      'semantic_candidate_confidence_band_preserved',
      'Semantic candidate confidence band preserved',
      !hasSemanticCandidates || !semanticCandidatesMissingConfidence,
      'blocking',
      'Semantic candidate confidenceBand must be preserved for draft QA.',
    ),
    createCheck(
      'semantic_candidate_evidence_preserved',
      'Semantic candidate evidence preserved',
      !hasSemanticCandidates || !semanticCandidatesMissingEvidence,
      'blocking',
      'Semantic candidate evidence must be preserved for draft QA.',
    ),
    createCheck(
      'semantic_candidate_limitations_preserved',
      'Semantic candidate limitations preserved',
      !hasSemanticCandidates || !semanticCandidatesMissingLimitations,
      'blocking',
      'Semantic candidate limitations must be preserved for draft QA.',
    ),
    createCheck(
      'no_final_claims',
      'No final claims',
      !finalClaimPattern.test(draftText),
      'blocking',
      'Draft content must not claim final recognition or final approval.',
    ),
    createCheck(
      'no_fully_automatic_extraction_claim',
      'No fully automatic extraction claim',
      !fullyAutomaticClaimPattern.test(draftText),
      'blocking',
      'Draft content must not claim fully automatic high-quality makeup extraction.',
    ),
    createCheck(
      'no_ai_confirmed',
      'No AI confirmed claim',
      !aiConfirmedPattern.test(draftText),
      'blocking',
      'Draft content must not claim AI confirmation or automatic confirmation.',
    ),
    createCheck(
      'no_medical_claims',
      'No medical claims',
      !medicalClaimPattern.test(draftText),
      'blocking',
      'Draft content must not contain medical, skin-health, or treatment claims.',
    ),
    createCheck(
      'no_product_shade_claims',
      'No product shade claims',
      !shadeClaimPattern.test(draftText),
      'blocking',
      'Draft content must not contain brand-specific or shade-specific product claims.',
    ),
    createCheck(
      'no_registry_write',
      'No registry write',
      !registryWriteClaimPattern.test(draftText),
      'blocking',
      'Draft QA must not perform or claim registry writes or registry mutation.',
    ),
    createCheck(
      'no_publish',
      'No publish',
      !publishClaimPattern.test(draftText),
      'blocking',
      'Draft QA must not publish or claim publication.',
    ),
    createCheck(
      'no_production_writer',
      'No production writer',
      !productionWriterClaimPattern.test(draftText),
      'blocking',
      'Draft QA must not create or claim a production writer.',
    ),
    createCheck(
      'publish_blocked_is_true',
      'Publish is blocked',
      input.templateDraft.publishBlocked === true,
      'blocking',
      'Template draft QA requires publishBlocked to remain true.',
    ),
    createCheck(
      'human_review_required',
      'Human review required',
      input.templateDraft.humanReviewRequired === true,
      'blocking',
      'Template draft QA requires humanReviewRequired to remain true.',
    ),
    createCheck(
      'user_app_contract_not_mutated',
      'User app contract not mutated',
      !userAppContractMutated,
      'blocking',
      'Draft QA must not generate or mutate UserAppTemplatePackage contract fields.',
    ),
    createCheck(
      'privacy_boundary_safe',
      'Privacy boundary safe',
      !privacyRiskPattern.test(draftText),
      'blocking',
      'Draft QA must not contain photo bytes, object URLs, biometric IDs, or real user data.',
    ),
  ];

  const recommendationByCheck: Record<TemplateDraftQaCheckId, string> = {
    region_qa_ready: 'Return to Vision Analysis and fix region quality before drafting.',
    candidates_have_source_confidence_review_status:
      'Regenerate or revise candidates so every item has source, confidence, and review status.',
    steps_have_target_regions: 'Revise generated steps so each one targets a clear makeup region.',
    steps_have_beginner_guidance:
      'Rewrite steps with concrete beginner-friendly guidance before human review.',
    tools_checklist_present: 'Add tool categories through draft step generation.',
    product_suggestions_are_placeholders:
      'Replace brand or shade-specific wording with category-level placeholders.',
    semantic_candidates_not_final:
      'Keep semantic candidate bindings marked notFinal and block any final-template marker.',
    semantic_candidate_human_review_required:
      'Keep semantic candidate bindings human-review-required after draft integration.',
    semantic_candidate_source_type_preserved:
      'Preserve the semantic candidate sourceType through draft integration.',
    semantic_candidate_confidence_band_preserved:
      'Preserve the semantic candidate confidenceBand through draft integration.',
    semantic_candidate_evidence_preserved:
      'Preserve semantic candidate evidence through draft integration.',
    semantic_candidate_limitations_preserved:
      'Preserve semantic candidate limitations through draft integration.',
    no_final_claims: 'Replace final-result wording with candidate or draft wording.',
    no_fully_automatic_extraction_claim:
      'Replace automatic extraction claims with semi-automatic draft + human review wording.',
    no_ai_confirmed: 'Replace AI-confirmed wording with human-review-required draft wording.',
    no_medical_claims: 'Remove medical or skin-health claims before review.',
    no_product_shade_claims: 'Remove brand and shade-specific claims before review.',
    no_registry_write: 'Keep registry writes outside draft QA and blocked after Phase 10U.',
    no_publish: 'Keep publication outside draft QA and blocked in this phase.',
    no_production_writer: 'Do not create or claim a production writer in draft QA.',
    publish_blocked_is_true: 'Keep template draft output blocked from publishing.',
    human_review_required: 'Require human review before candidate handoff.',
    user_app_contract_not_mutated:
      'Keep UserAppTemplatePackage generation outside the draft review workflow.',
    privacy_boundary_safe: 'Remove private or biometric data and block the draft if needed.',
  };

  const issues = checks
    .map((check) => issueForCheck(check, recommendationByCheck[check.id]))
    .filter((issue): issue is TemplateDraftQaIssue => Boolean(issue));
  const hasBlockingIssue = issues.some((issue) => issue.severity === 'blocking');
  const hasWarning = issues.some((issue) => issue.severity === 'warning');
  const status: TemplateDraftQaStatus = hasBlockingIssue
    ? 'draft_qa_blocked'
    : hasWarning
      ? 'draft_qa_ready_with_warnings'
      : 'draft_qa_ready_for_human_review';

  return {
    status,
    checks,
    issues,
    recommendations: [
      {
        id: hasBlockingIssue ? 'block_before_review' : 'human_review_next',
        message: hasBlockingIssue
          ? '草稿 QA 被阻断，必须先修正阻断项。'
          : '草稿可进入人工审核，但不能发布。',
        action: hasBlockingIssue ? 'block_draft' : hasWarning ? 'request_revision' : 'continue_to_human_review',
      },
      {
        id: 'contract_boundary',
        message: 'QA 通过只代表可以人工审核，不会自动生成 UserAppTemplatePackage。',
        action: 'continue_to_human_review',
      },
    ],
    readyForHumanReview: !hasBlockingIssue && Boolean(draft),
    publishBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
    notes: [
      'Template draft QA is deterministic and local.',
      'QA ready means ready for human review only.',
      'No backend, upload, training, automatic publishing, or user app package generation.',
    ],
  };
};
