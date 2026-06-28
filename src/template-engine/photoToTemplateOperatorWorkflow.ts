import type { FaceMeshRegionQaReport, MakeupSemanticExtractionReport } from '../vision';
import type { PhotoToTemplateDraftPreviewQaReport } from './photoToTemplateDraftPreviewQa';
import type { PhotoToTemplateDraftIntegrationReport } from './photoToTemplateDraftIntegration';
import type { PhotoToTemplateHumanReviewEditingSession } from './photoToTemplateHumanReviewEditing';
import type { PhotoToTemplateRealityCheckReport } from './photoToTemplateRealityCheck';
import type { TemplateDraftQaResult } from './templateDraftQa';

export type PhotoToTemplateOperatorWorkflowStatus =
  | 'ready'
  | 'ready_with_warnings'
  | 'blocked'
  | 'not_started'
  | 'not_applicable';

export type PhotoToTemplateOperatorWorkflowStepId =
  | 'vision_readiness'
  | 'reality_check'
  | 'semantic_extraction'
  | 'draft_integration'
  | 'human_review_editing'
  | 'draft_qa'
  | 'user_app_draft_preview_qa'
  | 'operator_handoff';

export type PhotoToTemplateOperatorWorkflowNextAction =
  | 'run_vision_analysis'
  | 'fix_region_quality'
  | 'run_reality_check'
  | 'run_semantic_extraction'
  | 'fix_semantic_candidate_metadata'
  | 'continue_to_draft_integration'
  | 'continue_human_review_editing'
  | 'fix_draft_qa_blockers'
  | 'run_draft_preview_qa'
  | 'request_user_visible_copy_revision'
  | 'keep_operator_only'
  | 'ready_for_phase_12e_demo_script'
  | 'blocked_do_not_publish';

export interface PhotoToTemplateOperatorWorkflowIssue {
  id: string;
  stepId: PhotoToTemplateOperatorWorkflowStepId;
  severity: 'warning' | 'blocking';
  message: string;
  recommendation: string;
}

export interface PhotoToTemplateOperatorWorkflowRecommendation {
  id: string;
  message: string;
  nextAction: PhotoToTemplateOperatorWorkflowNextAction;
}

export interface PhotoToTemplateOperatorWorkflowStep {
  id: PhotoToTemplateOperatorWorkflowStepId;
  label: string;
  status: PhotoToTemplateOperatorWorkflowStatus;
  summary: string;
  requiredInputs: string[];
  producedOutputs: string[];
  blockingIssues: PhotoToTemplateOperatorWorkflowIssue[];
  warnings: PhotoToTemplateOperatorWorkflowIssue[];
  humanReviewRequired: boolean;
  internalOnly: boolean;
  nextAction: PhotoToTemplateOperatorWorkflowNextAction;
}

export interface PhotoToTemplateOperatorWorkflowHandoff {
  status: 'handoff_ready_for_12e' | 'handoff_ready_with_warnings' | 'handoff_blocked';
  nextAction: PhotoToTemplateOperatorWorkflowNextAction;
  message: string;
  allowedDestinations: Array<'draft_preview_qa' | 'human_review_editing' | 'phase_12e_demo_script'>;
  forbiddenDestinations: Array<'publish' | 'registry_write' | 'production_writer' | 'user_app_shell_replacement'>;
}

export interface PhotoToTemplateOperatorWorkflowReport {
  workflowId: string;
  status: PhotoToTemplateOperatorWorkflowStatus;
  steps: PhotoToTemplateOperatorWorkflowStep[];
  issues: PhotoToTemplateOperatorWorkflowIssue[];
  recommendations: PhotoToTemplateOperatorWorkflowRecommendation[];
  handoff: PhotoToTemplateOperatorWorkflowHandoff;
  readyStepCount: number;
  warningStepCount: number;
  blockedStepCount: number;
  humanReviewRequired: true;
  operatorOnly: true;
  draftPreviewOnly: true;
  publishBlocked: true;
  registryWriteBlocked: true;
  registryMutationBlocked: true;
  productionWriterBlocked: true;
  userAppShellReplacementBlocked: true;
  userAppTemplatePackageGenerationBlocked: true;
  fullyAutomaticExtractionClaimBlocked: true;
  jsonRoundTripStable: boolean;
  nextRecommendedPhase: 'Phase 12E - Photo-to-Template End-to-End Demo Script & Acceptance Trial';
}

export interface PhotoToTemplateOperatorWorkflowInput {
  regionQa?: FaceMeshRegionQaReport | null;
  realityReport?: PhotoToTemplateRealityCheckReport | null;
  semanticReport?: MakeupSemanticExtractionReport | null;
  draftIntegration?: PhotoToTemplateDraftIntegrationReport | null;
  humanReviewEditing?: PhotoToTemplateHumanReviewEditingSession | null;
  draftQa?: TemplateDraftQaResult | null;
  draftPreviewQa?: PhotoToTemplateDraftPreviewQaReport | null;
  workflowId?: string;
}

const workflowStepOrder: PhotoToTemplateOperatorWorkflowStepId[] = [
  'vision_readiness',
  'reality_check',
  'semantic_extraction',
  'draft_integration',
  'human_review_editing',
  'draft_qa',
  'user_app_draft_preview_qa',
  'operator_handoff',
];

const labelByStep: Record<PhotoToTemplateOperatorWorkflowStepId, string> = {
  vision_readiness: 'Vision / FaceMesh readiness',
  reality_check: 'Photo-to-Template Reality Check',
  semantic_extraction: 'Makeup Semantic Extraction candidates',
  draft_integration: 'Semantic candidate → Draft field integration',
  human_review_editing: 'Human Review Editing',
  draft_qa: 'Draft QA',
  user_app_draft_preview_qa: 'User App Draft Preview QA',
  operator_handoff: 'Next action / blocked reason / handoff',
};

const requiredInputsByStep: Record<PhotoToTemplateOperatorWorkflowStepId, string[]> = {
  vision_readiness: ['local image analysis', 'FaceMesh Region QA'],
  reality_check: ['Vision readiness', 'field source matrix'],
  semantic_extraction: ['FaceMesh region QA', 'local pixel evidence'],
  draft_integration: ['semantic extraction report', 'template draft'],
  human_review_editing: ['draft integration report', 'reviewer checklist'],
  draft_qa: ['region QA', 'candidate report', 'step sequence', 'template draft', 'draft integration'],
  user_app_draft_preview_qa: ['human review editing', 'draft QA result'],
  operator_handoff: ['workflow step statuses', 'draft preview QA result'],
};

const producedOutputsByStep: Record<PhotoToTemplateOperatorWorkflowStepId, string[]> = {
  vision_readiness: ['readiness score', 'region coverage', 'FaceMesh runtime status'],
  reality_check: ['source labels', 'semi-automatic draft boundary', 'human-review-required decision'],
  semantic_extraction: ['semantic candidates', 'source type', 'confidence band', 'evidence', 'limitations'],
  draft_integration: ['binding matrix', 'editable draft fields', 'notFinal trace'],
  human_review_editing: ['reviewer decisions', 'editable draft values', 'reviewer notes'],
  draft_qa: ['draft QA checks', 'blocked reasons', 'human review readiness'],
  user_app_draft_preview_qa: ['user-visible draft fields', 'internal-field leakage checks', 'privacy notice check'],
  operator_handoff: ['next action', 'allowed handoff', 'blocked destinations'],
};

const unsafeWorkflowPattern =
  /fully automatic|全自动高质量|AI 已确认|最终识别|最终结果|正式模板|production ready|已发布|registry write|写入 registry|registry mutation|production writer|UserAppTemplatePackage mutation|generatedUserAppTemplatePackage|替换当前 User App Shell/i;

const jsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const issue = (
  id: string,
  stepId: PhotoToTemplateOperatorWorkflowStepId,
  severity: 'warning' | 'blocking',
  message: string,
  recommendation: string,
): PhotoToTemplateOperatorWorkflowIssue => ({
  id,
  stepId,
  severity,
  message,
  recommendation,
});

const splitIssues = (
  issues: PhotoToTemplateOperatorWorkflowIssue[],
): Pick<PhotoToTemplateOperatorWorkflowStep, 'blockingIssues' | 'warnings'> => ({
  blockingIssues: issues.filter((item) => item.severity === 'blocking'),
  warnings: issues.filter((item) => item.severity === 'warning'),
});

const statusFromIssues = (
  issues: PhotoToTemplateOperatorWorkflowIssue[],
  fallback: PhotoToTemplateOperatorWorkflowStatus,
): PhotoToTemplateOperatorWorkflowStatus => {
  if (issues.some((item) => item.severity === 'blocking')) return 'blocked';
  if (issues.some((item) => item.severity === 'warning')) return 'ready_with_warnings';
  return fallback;
};

const step = ({
  id,
  status,
  summary,
  issues = [],
  humanReviewRequired = true,
  internalOnly = true,
  nextAction,
}: {
  id: PhotoToTemplateOperatorWorkflowStepId;
  status: PhotoToTemplateOperatorWorkflowStatus;
  summary: string;
  issues?: PhotoToTemplateOperatorWorkflowIssue[];
  humanReviewRequired?: boolean;
  internalOnly?: boolean;
  nextAction: PhotoToTemplateOperatorWorkflowNextAction;
}): PhotoToTemplateOperatorWorkflowStep => ({
  id,
  label: labelByStep[id],
  status: statusFromIssues(issues, status),
  summary,
  requiredInputs: requiredInputsByStep[id],
  producedOutputs: producedOutputsByStep[id],
  ...splitIssues(issues),
  humanReviewRequired,
  internalOnly,
  nextAction,
});

export const createPhotoToTemplateOperatorWorkflowReport = ({
  regionQa = null,
  realityReport = null,
  semanticReport = null,
  draftIntegration = null,
  humanReviewEditing = null,
  draftQa = null,
  draftPreviewQa = null,
  workflowId = 'phase-12d-photo-to-template-operator-workflow',
}: PhotoToTemplateOperatorWorkflowInput): PhotoToTemplateOperatorWorkflowReport => {
  const semanticIssues: PhotoToTemplateOperatorWorkflowIssue[] = [];
  const integrationIssues: PhotoToTemplateOperatorWorkflowIssue[] = [];
  const humanReviewIssues: PhotoToTemplateOperatorWorkflowIssue[] = [];
  const draftQaIssues: PhotoToTemplateOperatorWorkflowIssue[] = [];
  const previewIssues: PhotoToTemplateOperatorWorkflowIssue[] = [];

  if (semanticReport) {
    Object.values(semanticReport.candidates).forEach((candidate) => {
      if (!candidate.sourceType || candidate.evidence.length === 0 || candidate.humanReviewRequired !== true) {
        semanticIssues.push(
          issue(
            `${candidate.field}_semantic_metadata_missing`,
            'semantic_extraction',
            'blocking',
            `${candidate.field} is missing sourceType, evidence, or humanReviewRequired.`,
            'Regenerate the semantic candidate with complete source metadata before draft integration.',
          ),
        );
      }
      if (candidate.notFinal !== true) {
        semanticIssues.push(
          issue(
            `${candidate.field}_semantic_final_marker`,
            'semantic_extraction',
            'blocking',
            `${candidate.field} was marked final.`,
            'Semantic candidates must stay candidate-only and notFinal.',
          ),
        );
      }
    });
  }

  if (draftIntegration) {
    draftIntegration.bindings.forEach((binding) => {
      if (!binding.sourceType || binding.evidence.length === 0 || binding.humanReviewRequired !== true) {
        integrationIssues.push(
          issue(
            `${binding.field}_binding_metadata_missing`,
            'draft_integration',
            'blocking',
            `${binding.field} is missing sourceType, evidence, or humanReviewRequired.`,
            'Keep semantic candidate metadata attached to every draft field binding.',
          ),
        );
      }
      if (binding.notFinal !== true) {
        integrationIssues.push(
          issue(
            `${binding.field}_binding_final_marker`,
            'draft_integration',
            'blocking',
            `${binding.field} was marked final inside draft integration.`,
            'Block the workflow until the binding is regenerated as notFinal.',
          ),
        );
      }
    });
    if (draftIntegration.status === 'integration_blocked') {
      integrationIssues.push(
        issue(
          'draft_integration_blocked',
          'draft_integration',
          'blocking',
          'Draft integration is blocked.',
          'Resolve integration issues before human review editing.',
        ),
      );
    }
    if (
      draftIntegration.status === 'integration_ready_with_warnings' ||
      draftIntegration.status === 'insufficient_semantic_evidence' ||
      draftIntegration.status === 'demo_only'
    ) {
      integrationIssues.push(
        issue(
          'draft_integration_warnings',
          'draft_integration',
          'warning',
          `Draft integration status is ${draftIntegration.status}.`,
          'Keep the workflow operator-only and ask a reviewer to resolve warnings.',
        ),
      );
    }
  }

  if (humanReviewEditing) {
    const missingCriticalDecision = humanReviewEditing.editableFields.some(
      (field) =>
        ['title', 'summary', 'toolList', 'stepSequence', 'regionGuidance'].includes(field.field) &&
        (!field.reviewerDecision || field.reviewerDecision === 'pending_review'),
    );
    const missingAnyDecision = humanReviewEditing.editableFields.some(
      (field) => !field.reviewerDecision || field.reviewerDecision === 'pending_review',
    );

    if (humanReviewEditing.status === 'human_review_editing_blocked') {
      humanReviewIssues.push(
        issue(
          'human_review_editing_blocked',
          'human_review_editing',
          'blocking',
          'Human review editing is blocked.',
          'Fix unsafe wording or reviewer blocks before draft QA.',
        ),
      );
    }
    if (missingCriticalDecision) {
      humanReviewIssues.push(
        issue(
          'critical_reviewer_decision_missing',
          'human_review_editing',
          'blocking',
          'Critical user-visible fields are missing reviewer decisions.',
          'Review title, summary, tools, steps, and region guidance before preview QA.',
        ),
      );
    } else if (missingAnyDecision || humanReviewEditing.status === 'human_review_editing_needs_more_review') {
      humanReviewIssues.push(
        issue(
          'reviewer_decisions_incomplete',
          'human_review_editing',
          'warning',
          'Some editable fields still need reviewer decisions.',
          'Continue human review editing before a clean handoff.',
        ),
      );
    }
  }

  if (draftQa?.status === 'draft_qa_blocked') {
    draftQaIssues.push(
      issue(
        'draft_qa_blocked',
        'draft_qa',
        'blocking',
        'Draft QA is blocked.',
        'Preview QA must stay blocked until draft QA blockers are fixed.',
      ),
    );
  } else if (draftQa?.status === 'draft_qa_ready_with_warnings') {
    draftQaIssues.push(
      issue(
        'draft_qa_warnings',
        'draft_qa',
        'warning',
        'Draft QA is ready with warnings.',
        'Operator should review warnings before preview QA.',
      ),
    );
  }

  if (draftPreviewQa?.status === 'draft_preview_qa_blocked') {
    previewIssues.push(
      issue(
        'draft_preview_qa_blocked',
        'user_app_draft_preview_qa',
        'blocking',
        'Draft Preview QA is blocked.',
        'Fix missing user copy or internal terminology leakage before preview.',
      ),
    );
  } else if (draftPreviewQa?.status === 'draft_preview_qa_ready_with_warnings') {
    previewIssues.push(
      issue(
        'draft_preview_qa_warnings',
        'user_app_draft_preview_qa',
        'warning',
        'Draft Preview QA is ready with warnings.',
        'Review warning checks before Phase 12E demo script work.',
      ),
    );
  }

  const unsafeWorkflowText = JSON.stringify({
    semanticCandidates: semanticReport
      ? Object.values(semanticReport.candidates).map((candidate) => ({
          field: candidate.field,
          value: candidate.value,
          evidence: candidate.evidence.flatMap((item) => item.notes),
          limitations: candidate.limitations,
        }))
      : [],
    draftBindings: draftIntegration?.bindings.map((binding) => ({
      field: binding.field,
      originalCandidateValue: binding.originalCandidateValue,
      editableDraftValue: binding.editableDraftValue,
      reviewerNote: binding.reviewerNote,
    })),
    humanReviewFields: humanReviewEditing?.editableFields.map((field) => ({
      field: field.field,
      originalCandidateValue: field.originalCandidateValue,
      editableDraftValue: field.editableDraftValue,
      reviewerNote: field.reviewerNote,
    })),
    draftQaNotes: draftQa?.notes,
    draftPreviewUserFields: draftPreviewQa?.userVisibleFields.map((field) => ({
      field: field.field,
      value: field.value,
    })),
  });
  const boundaryIssues = unsafeWorkflowPattern.test(unsafeWorkflowText)
    ? [
        issue(
          'unsafe_workflow_claim',
          'operator_handoff',
          'blocking',
          'Workflow contains final, publish, registry, production writer, or mutation wording.',
          'Remove unsafe wording before any handoff.',
        ),
      ]
    : [];

  const steps: PhotoToTemplateOperatorWorkflowStep[] = [
    step({
      id: 'vision_readiness',
      status: !regionQa
        ? 'not_started'
        : regionQa.status === 'region_qa_blocked'
          ? 'blocked'
          : regionQa.status === 'region_qa_ready_with_warnings'
            ? 'ready_with_warnings'
            : 'ready',
      summary: regionQa
        ? `${regionQa.provider} / ${regionQa.landmarkCount} landmarks / ${regionQa.status}`
        : 'Vision Analysis has not produced FaceMesh Region QA yet.',
      issues:
        !regionQa
          ? [
              issue(
                'vision_not_started',
                'vision_readiness',
                'warning',
                'Vision readiness is not started.',
                'Run Vision Analysis before the operator workflow.',
              ),
            ]
          : regionQa.status === 'region_qa_blocked'
            ? [
                issue(
                  'vision_region_qa_blocked',
                  'vision_readiness',
                  'blocking',
                  'Region QA is blocked.',
                  'Return to Vision Analysis and fix photo or region quality.',
                ),
              ]
            : [],
      nextAction: !regionQa
        ? 'run_vision_analysis'
        : regionQa.status === 'region_qa_blocked'
          ? 'fix_region_quality'
          : 'run_reality_check',
    }),
    step({
      id: 'reality_check',
      status: !realityReport
        ? 'not_started'
        : realityReport.decision === 'blocked_do_not_claim_automatic_extraction'
          ? 'blocked'
          : realityReport.risks.some((risk) => risk.severity === 'blocking')
            ? 'blocked'
            : realityReport.risks.some((risk) => risk.severity === 'warning')
              ? 'ready_with_warnings'
              : 'ready',
      summary: realityReport
        ? `${realityReport.decision}; semi-automatic draft=${realityReport.supportsSemiAutomaticDraft}`
        : 'Photo-to-Template Reality Check has not run.',
      issues:
        !realityReport
          ? [
              issue(
                'reality_check_missing',
                'reality_check',
                'warning',
                'Reality check is missing.',
                'Run the Phase 12A reality check before semantic extraction.',
              ),
            ]
          : [],
      nextAction: !realityReport ? 'run_reality_check' : 'run_semantic_extraction',
    }),
    step({
      id: 'semantic_extraction',
      status: !semanticReport
        ? 'not_started'
        : semanticReport.status === 'semantic_extraction_blocked'
          ? 'blocked'
          : semanticReport.status === 'semantic_extraction_insufficient_evidence' ||
              semanticReport.status === 'semantic_extraction_ready_with_warnings'
            ? 'ready_with_warnings'
            : 'ready',
      summary: semanticReport
        ? `${Object.keys(semanticReport.candidates).length} candidate fields; ${semanticReport.status}`
        : 'Semantic extraction candidates are not available.',
      issues:
        !semanticReport
          ? [
              issue(
                'semantic_extraction_missing',
                'semantic_extraction',
                'warning',
                'Semantic extraction report is missing.',
                'Run Makeup Semantic Extraction before draft integration.',
              ),
            ]
          : semanticIssues,
      nextAction:
        semanticIssues.length > 0
          ? 'fix_semantic_candidate_metadata'
          : 'continue_to_draft_integration',
    }),
    step({
      id: 'draft_integration',
      status: !draftIntegration
        ? 'not_started'
        : draftIntegration.status === 'integration_blocked'
          ? 'blocked'
          : draftIntegration.status === 'integration_ready_for_human_review'
            ? 'ready'
            : 'ready_with_warnings',
      summary: draftIntegration
        ? `${draftIntegration.bindings.length} semantic bindings; ${draftIntegration.status}`
        : 'Draft integration is not available.',
      issues:
        !draftIntegration
          ? [
              issue(
                'draft_integration_missing',
                'draft_integration',
                'warning',
                'Draft integration report is missing.',
                'Create the semantic candidate to draft field binding matrix.',
              ),
            ]
          : integrationIssues,
      nextAction:
        integrationIssues.some((item) => item.severity === 'blocking')
          ? 'blocked_do_not_publish'
          : 'continue_human_review_editing',
    }),
    step({
      id: 'human_review_editing',
      status: !humanReviewEditing
        ? 'not_started'
        : humanReviewEditing.status === 'human_review_editing_blocked'
          ? 'blocked'
          : humanReviewEditing.status === 'human_review_editing_needs_more_review'
            ? 'ready_with_warnings'
            : 'ready',
      summary: humanReviewEditing
        ? `${humanReviewEditing.editableFields.length} editable fields; ${humanReviewEditing.status}`
        : 'Human review editing is not available.',
      issues:
        !humanReviewEditing
          ? [
              issue(
                'human_review_editing_missing',
                'human_review_editing',
                'warning',
                'Human review editing session is missing.',
                'Create a local reviewer editing session before draft QA.',
              ),
            ]
          : humanReviewIssues,
      nextAction:
        humanReviewIssues.some((item) => item.severity === 'blocking')
          ? 'continue_human_review_editing'
          : 'fix_draft_qa_blockers',
    }),
    step({
      id: 'draft_qa',
      status: !draftQa
        ? 'not_started'
        : draftQa.status === 'draft_qa_blocked'
          ? 'blocked'
          : draftQa.status === 'draft_qa_ready_with_warnings'
            ? 'ready_with_warnings'
            : 'ready',
      summary: draftQa ? `${draftQa.status}; readyForHumanReview=${draftQa.readyForHumanReview}` : 'Draft QA has not run.',
      issues:
        !draftQa
          ? [
              issue(
                'draft_qa_missing',
                'draft_qa',
                'warning',
                'Draft QA result is missing.',
                'Run Draft QA before user app draft preview QA.',
              ),
            ]
          : draftQaIssues,
      nextAction:
        draftQaIssues.some((item) => item.severity === 'blocking')
          ? 'fix_draft_qa_blockers'
          : 'run_draft_preview_qa',
    }),
    step({
      id: 'user_app_draft_preview_qa',
      status: !draftPreviewQa
        ? 'not_started'
        : draftPreviewQa.status === 'draft_preview_qa_blocked'
          ? 'blocked'
          : draftPreviewQa.status === 'draft_preview_qa_ready_with_warnings'
            ? 'ready_with_warnings'
            : 'ready',
      summary: draftPreviewQa
        ? `${draftPreviewQa.userVisibleFields.length} user-visible fields; ${draftPreviewQa.status}`
        : 'Draft Preview QA has not run.',
      issues:
        !draftPreviewQa
          ? [
              issue(
                'draft_preview_qa_missing',
                'user_app_draft_preview_qa',
                'warning',
                'Draft Preview QA report is missing.',
                'Run Draft Preview QA before handoff.',
              ),
            ]
          : previewIssues,
      nextAction:
        previewIssues.some((item) => item.severity === 'blocking')
          ? 'request_user_visible_copy_revision'
          : 'ready_for_phase_12e_demo_script',
    }),
  ];

  const workflowIssuesBeforeHandoff = steps.flatMap((item) => [
    ...item.blockingIssues,
    ...item.warnings,
  ]);
  const operatorHandoffIssues = [
    ...boundaryIssues,
    ...(workflowIssuesBeforeHandoff.some((item) => item.severity === 'blocking')
      ? [
          issue(
            'handoff_blocked_by_prior_step',
            'operator_handoff',
            'blocking',
            'One or more prior workflow steps are blocked.',
            'Resolve blocking steps before Phase 12E handoff.',
          ),
        ]
      : workflowIssuesBeforeHandoff.some((item) => item.severity === 'warning')
        ? [
            issue(
              'handoff_ready_with_warnings',
              'operator_handoff',
              'warning',
              'Workflow has warnings that should be reviewed before demo scripting.',
              'Operator may continue with warnings only if limitations stay visible.',
            ),
          ]
        : []),
  ];

  steps.push(
    step({
      id: 'operator_handoff',
      status: operatorHandoffIssues.some((item) => item.severity === 'blocking')
        ? 'blocked'
        : operatorHandoffIssues.some((item) => item.severity === 'warning')
          ? 'ready_with_warnings'
          : 'ready',
      summary: 'Handoff can go only to draft preview QA, human review editing, or Phase 12E demo script planning.',
      issues: operatorHandoffIssues,
      nextAction: operatorHandoffIssues.some((item) => item.severity === 'blocking')
        ? 'blocked_do_not_publish'
        : operatorHandoffIssues.some((item) => item.severity === 'warning')
          ? 'continue_human_review_editing'
          : 'ready_for_phase_12e_demo_script',
    }),
  );

  const issues = steps.flatMap((item) => [...item.blockingIssues, ...item.warnings]);
  const hasBlocking = issues.some((item) => item.severity === 'blocking');
  const hasWarning = issues.some((item) => item.severity === 'warning');
  const status: PhotoToTemplateOperatorWorkflowStatus = hasBlocking
    ? 'blocked'
    : hasWarning
      ? 'ready_with_warnings'
      : 'ready';
  const handoff: PhotoToTemplateOperatorWorkflowHandoff = {
    status: hasBlocking
      ? 'handoff_blocked'
      : hasWarning
        ? 'handoff_ready_with_warnings'
        : 'handoff_ready_for_12e',
    nextAction: hasBlocking
      ? 'blocked_do_not_publish'
      : hasWarning
        ? 'continue_human_review_editing'
        : 'ready_for_phase_12e_demo_script',
    message: hasBlocking
      ? '存在阻断项，不能进入发布、registry 或生产 writer。'
      : hasWarning
        ? '可以继续 operator review，但需要在 12E demo script 前说明 warning。'
        : '可进入 Phase 12E demo script and acceptance trial 准备。',
    allowedDestinations: ['draft_preview_qa', 'human_review_editing', 'phase_12e_demo_script'],
    forbiddenDestinations: ['publish', 'registry_write', 'production_writer', 'user_app_shell_replacement'],
  };

  const report: PhotoToTemplateOperatorWorkflowReport = {
    workflowId,
    status,
    steps: workflowStepOrder.map((id) => steps.find((item) => item.id === id)!).filter(Boolean),
    issues,
    recommendations: [
      {
        id: 'operator_only_workflow',
        message: '当前是 operator workflow，不是用户 App 页面。',
        nextAction: 'keep_operator_only',
      },
      {
        id: 'draft_preview_not_publish',
        message: '当前是 draft preview QA，不是发布；不能写 registry / 不能 publish。',
        nextAction: 'blocked_do_not_publish',
      },
      {
        id: 'phase_12e_handoff',
        message: handoff.message,
        nextAction: handoff.nextAction,
      },
    ],
    handoff,
    readyStepCount: steps.filter((item) => item.status === 'ready').length,
    warningStepCount: steps.filter((item) => item.status === 'ready_with_warnings').length,
    blockedStepCount: steps.filter((item) => item.status === 'blocked').length,
    humanReviewRequired: true,
    operatorOnly: true,
    draftPreviewOnly: true,
    publishBlocked: true,
    registryWriteBlocked: true,
    registryMutationBlocked: true,
    productionWriterBlocked: true,
    userAppShellReplacementBlocked: true,
    userAppTemplatePackageGenerationBlocked: true,
    fullyAutomaticExtractionClaimBlocked: true,
    jsonRoundTripStable: false,
    nextRecommendedPhase:
      'Phase 12E - Photo-to-Template End-to-End Demo Script & Acceptance Trial',
  };

  return {
    ...report,
    jsonRoundTripStable: jsonRoundTripStable(report),
  };
};
