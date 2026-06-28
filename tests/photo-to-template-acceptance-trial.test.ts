import { describe, expect, it } from 'vitest';
import { createPhotoToTemplateAcceptanceTrialReport } from '../src/template-engine';
import {
  photoToTemplateAcceptanceTrialBlockedByClaimsExample,
  photoToTemplateAcceptanceTrialBlockedByRegistryExample,
  photoToTemplateAcceptanceTrialReadyExample,
  photoToTemplateAcceptanceTrialWarningExample,
  photoToTemplateDraftPreviewQaReadyExample,
  photoToTemplateOperatorWorkflowReadyExample,
} from '../src/templates/examples';

describe('photo-to-template acceptance trial', () => {
  it('keeps the end-to-end demo trial ready without making it production readiness', () => {
    const report = photoToTemplateAcceptanceTrialReadyExample;

    expect(report.status).toBe('acceptance_trial_ready');
    expect(report.decision).toBe('ready_for_phase_13a_founder_demo_review');
    expect(report.demoRoutes.map((route) => route.id)).toEqual([
      'user_app_mvp',
      'vision_analysis',
      'template_studio_operator',
    ]);
    expect(report.checks.map((check) => check.id)).toEqual(
      expect.arrayContaining([
        'user_app_path_complete',
        'vision_analysis_ready',
        'operator_workflow_complete',
        'draft_preview_qa_present',
        'draft_preview_not_publish',
        'semantic_candidates_not_final',
        'build_and_tests_passed',
      ]),
    );
    expect(report.humanReviewRequired).toBe(true);
    expect(report.operatorOnly).toBe(true);
    expect(report.draftPreviewOnly).toBe(true);
    expect(report.acceptanceTrialNotProductionReady).toBe(true);
    expect(report.registryChainPausedAfter10U).toBe(true);
    expect(report.registryWriteBlocked).toBe(true);
    expect(report.publishBlocked).toBe(true);
    expect(report.productionWriterBlocked).toBe(true);
    expect(report.userAppShellReplacementBlocked).toBe(true);
    expect(report.noBackendOrAiApiScope).toBe(true);
    expect(report.noTrainingScope).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
  });

  it('warns when validation evidence is not recorded yet', () => {
    const report = photoToTemplateAcceptanceTrialWarningExample;

    expect(report.status).toBe('acceptance_trial_ready_with_warnings');
    expect(report.decision).toBe('run_acceptance_trial_with_warnings');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          checkId: 'build_and_tests_passed',
          severity: 'warning',
        }),
      ]),
    );
  });

  it('blocks registry write, publish, production writer, and shell replacement attempts', () => {
    const report = photoToTemplateAcceptanceTrialBlockedByRegistryExample;

    expect(report.status).toBe('acceptance_trial_blocked');
    expect(report.decision).toBe('fix_blockers_before_demo');
    expect(report.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'no_registry_write',
        'no_publish',
        'no_production_writer',
        'no_user_app_shell_replacement',
      ]),
    );
  });

  it('blocks fully automatic, AI confirmed, medical, and product shade claims', () => {
    const report = photoToTemplateAcceptanceTrialBlockedByClaimsExample;

    expect(report.status).toBe('acceptance_trial_blocked');
    expect(report.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'no_fully_automatic_claim',
        'no_ai_confirmed_claim',
        'no_medical_claim',
        'no_product_shade_hard_claim',
      ]),
    );
  });

  it('blocks final semantic candidate claims and ordinary user internal term leakage', () => {
    const report = createPhotoToTemplateAcceptanceTrialReport({
      operatorWorkflow: photoToTemplateOperatorWorkflowReadyExample,
      draftPreviewQa: photoToTemplateDraftPreviewQaReadyExample,
      semanticCandidatesNotFinal: false,
      userPathInternalTermsHidden: false,
      demoClaimText: 'sourceType confidenceBand evidence reviewerDecision notFinal',
      buildAndTestsPassed: true,
      publicMediapipeIgnored: true,
    });

    expect(report.status).toBe('acceptance_trial_blocked');
    expect(report.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'semantic_candidates_not_final',
        'user_path_internal_terms_hidden',
      ]),
    );
  });
});
