import type { PhotoToTemplateRealityCheckReport } from './photoToTemplateRealityCheck';
import type { PhotoToTemplateRealityValidationResult } from './photoToTemplateRealityValidation';

export type PhotoToTemplateRealityNextAction =
  | 'ready_for_makeup_semantic_extraction_baseline'
  | 'request_reality_source_labeling_revision'
  | 'request_fixture_vs_real_analysis_clarification'
  | 'request_human_review_workflow_improvement'
  | 'keep_as_demo_only'
  | 'blocked_do_not_claim_automatic_extraction';

export type PhotoToTemplateRealityHandoffStatus =
  | 'reality_handoff_ready'
  | 'reality_handoff_ready_with_warnings'
  | 'reality_handoff_blocked'
  | 'reality_handoff_demo_only';

export interface PhotoToTemplateRealityHandoffItem {
  id: string;
  label: string;
  sourceSummary: string;
  requiredAction: string;
}

export interface PhotoToTemplateRealityHandoff {
  handoffId: string;
  reportId: string;
  status: PhotoToTemplateRealityHandoffStatus;
  nextAction: PhotoToTemplateRealityNextAction;
  nextRecommendedPhase: 'Phase 12B - Makeup Semantic Extraction Baseline';
  decisionSummary: string;
  items: PhotoToTemplateRealityHandoffItem[];
  validationStatus: PhotoToTemplateRealityValidationResult['status'];
  humanReviewRequired: true;
  notFullyAutomaticExtraction: true;
  registryChainPausedAfter10U: true;
  noRegistryWrite: true;
  noRegistryMutation: true;
  noPublish: true;
  noProductionWriter: true;
  noUserAppShellReplacement: true;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const nextActionFor = (
  report: PhotoToTemplateRealityCheckReport,
  validation: PhotoToTemplateRealityValidationResult,
): PhotoToTemplateRealityNextAction => {
  if (report.capabilityStatus === 'demo_only') {
    return 'keep_as_demo_only';
  }
  if (validation.status === 'reality_check_blocked') {
    if (validation.issues.some((issue) => issue.checkId === 'no_fully_automatic_claim')) {
      return 'blocked_do_not_claim_automatic_extraction';
    }
    if (validation.issues.some((issue) => issue.checkId === 'source_label_integrity')) {
      return 'request_fixture_vs_real_analysis_clarification';
    }
    if (validation.issues.some((issue) => issue.checkId === 'human_required_fields_identified')) {
      return 'request_human_review_workflow_improvement';
    }
    return 'request_reality_source_labeling_revision';
  }
  if (validation.status === 'reality_check_ready_with_warnings') {
    return 'request_reality_source_labeling_revision';
  }
  return 'ready_for_makeup_semantic_extraction_baseline';
};

export const createPhotoToTemplateRealityHandoff = ({
  report,
  validation,
  handoffId = `handoff-${report.reportId}`,
}: {
  report: PhotoToTemplateRealityCheckReport;
  validation: PhotoToTemplateRealityValidationResult;
  handoffId?: string;
}): PhotoToTemplateRealityHandoff => {
  const nextAction = nextActionFor(report, validation);
  const status: PhotoToTemplateRealityHandoffStatus =
    nextAction === 'keep_as_demo_only'
      ? 'reality_handoff_demo_only'
      : validation.status === 'reality_check_blocked'
        ? 'reality_handoff_blocked'
        : validation.status === 'reality_check_ready_with_warnings'
          ? 'reality_handoff_ready_with_warnings'
          : 'reality_handoff_ready';

  const handoff: PhotoToTemplateRealityHandoff = {
    handoffId,
    reportId: report.reportId,
    status,
    nextAction,
    nextRecommendedPhase: 'Phase 12B - Makeup Semantic Extraction Baseline',
    decisionSummary:
      status === 'reality_handoff_ready'
        ? 'Current chain can hand off to Phase 12B for semantic extraction baseline work; it is still semi-automatic draft generation with human review.'
        : status === 'reality_handoff_ready_with_warnings'
          ? 'Reality labels need cleanup before stronger semantic extraction work, but no automatic extraction claim is allowed.'
          : status === 'reality_handoff_demo_only'
            ? 'Keep current path as demo-only until real analysis and draft reports exist.'
            : 'Do not claim automatic extraction until blocked reality checks are fixed.',
    items: [
      {
        id: 'real_fields',
        label: 'Real / FaceMesh fields',
        sourceSummary: `${report.sourceSummary.real_from_photo} real, ${report.sourceSummary.facemesh_derived} FaceMesh-derived, ${report.sourceSummary.region_qa_derived} region-QA-derived fields.`,
        requiredAction: 'Use these fields as geometry/readiness evidence only.',
      },
      {
        id: 'rule_fields',
        label: 'Rule-derived fields',
        sourceSummary: `${report.sourceSummary.pixel_rule_derived + report.sourceSummary.semantic_rule_derived + report.sourceSummary.template_rule_derived} rule-derived fields.`,
        requiredAction: 'Keep candidate wording and require human review.',
      },
      {
        id: 'fixture_placeholder_fields',
        label: 'Fixture / placeholder fields',
        sourceSummary: `${report.sourceSummary.demo_fixture} demo fixture and ${report.sourceSummary.placeholder} placeholder fields.`,
        requiredAction: 'Do not present these as photo-derived semantic extraction.',
      },
      {
        id: 'unsupported_fields',
        label: 'Unsupported automatic extraction fields',
        sourceSummary: `${report.sourceSummary.unsupported} unsupported fields.`,
        requiredAction: 'Move these into Phase 12B semantic extraction baseline scope.',
      },
    ],
    validationStatus: validation.status,
    humanReviewRequired: true,
    notFullyAutomaticExtraction: true,
    registryChainPausedAfter10U: true,
    noRegistryWrite: true,
    noRegistryMutation: true,
    noPublish: true,
    noProductionWriter: true,
    noUserAppShellReplacement: true,
    jsonRoundTripStable: true,
  };

  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
