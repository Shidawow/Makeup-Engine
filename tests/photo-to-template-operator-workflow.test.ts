import { describe, expect, it } from 'vitest';
import {
  createPhotoToTemplateDraftPreviewQaReport,
  createPhotoToTemplateOperatorWorkflowReport,
  type PhotoToTemplateDraftIntegrationReport,
  type TemplateDraftQaResult,
} from '../src/template-engine';
import type { MakeupSemanticExtractionReport } from '../src/vision';
import {
  faceMeshRegionQaReadyExample,
  makeupSemanticExtractionReadyExample,
  photoToTemplateDraftIntegrationReadyExample,
  photoToTemplateDraftPreviewQaBlockedInternalTermsExample,
  photoToTemplateDraftPreviewQaReadyExample,
  photoToTemplateOperatorDraftQaReadyExample,
  photoToTemplateOperatorHumanReviewReadyExample,
  photoToTemplateOperatorWorkflowReadyExample,
  photoToTemplateRealitySemanticIntegratedExample,
} from '../src/templates/examples';

const stepIds = photoToTemplateOperatorWorkflowReadyExample.steps.map((step) => step.id);

describe('photo-to-template operator workflow', () => {
  it('orders the operator-only path from vision readiness to Phase 12E handoff', () => {
    const report = photoToTemplateOperatorWorkflowReadyExample;

    expect(report.status).toBe('ready');
    expect(stepIds).toEqual([
      'vision_readiness',
      'reality_check',
      'semantic_extraction',
      'draft_integration',
      'human_review_editing',
      'draft_qa',
      'user_app_draft_preview_qa',
      'operator_handoff',
    ]);
    expect(report.handoff.status).toBe('handoff_ready_for_12e');
    expect(report.handoff.nextAction).toBe('ready_for_phase_12e_demo_script');
    expect(report.handoff.allowedDestinations).toEqual([
      'draft_preview_qa',
      'human_review_editing',
      'phase_12e_demo_script',
    ]);
    expect(report.handoff.forbiddenDestinations).toEqual([
      'publish',
      'registry_write',
      'production_writer',
      'user_app_shell_replacement',
    ]);
    expect(report.humanReviewRequired).toBe(true);
    expect(report.operatorOnly).toBe(true);
    expect(report.draftPreviewOnly).toBe(true);
    expect(report.registryWriteBlocked).toBe(true);
    expect(report.userAppTemplatePackageGenerationBlocked).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
  });

  it('blocks semantic candidates that lose source metadata, evidence, or human review trace', () => {
    const brokenSemantic = {
      ...makeupSemanticExtractionReadyExample,
      candidates: {
        ...makeupSemanticExtractionReadyExample.candidates,
        lipColorCandidate: {
          ...makeupSemanticExtractionReadyExample.candidates.lipColorCandidate,
          sourceType: '',
          evidence: [],
          humanReviewRequired: false,
        },
      },
    } as unknown as MakeupSemanticExtractionReport;
    const report = createPhotoToTemplateOperatorWorkflowReport({
      regionQa: faceMeshRegionQaReadyExample,
      realityReport: photoToTemplateRealitySemanticIntegratedExample,
      semanticReport: brokenSemantic,
      draftIntegration: photoToTemplateDraftIntegrationReadyExample,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: photoToTemplateOperatorDraftQaReadyExample,
      draftPreviewQa: photoToTemplateDraftPreviewQaReadyExample,
    });

    expect(report.status).toBe('blocked');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'lipColorCandidate_semantic_metadata_missing',
          stepId: 'semantic_extraction',
        }),
      ]),
    );
    expect(report.handoff.status).toBe('handoff_blocked');
    expect(report.handoff.nextAction).toBe('blocked_do_not_publish');
  });

  it('blocks draft integration bindings marked as final', () => {
    const brokenIntegration = {
      ...photoToTemplateDraftIntegrationReadyExample,
      bindings: photoToTemplateDraftIntegrationReadyExample.bindings.map((binding, index) =>
        index === 0 ? { ...binding, notFinal: false } : binding,
      ),
    } as unknown as PhotoToTemplateDraftIntegrationReport;
    const previewQa = createPhotoToTemplateDraftPreviewQaReport({
      integration: brokenIntegration,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: photoToTemplateOperatorDraftQaReadyExample,
    });
    const report = createPhotoToTemplateOperatorWorkflowReport({
      regionQa: faceMeshRegionQaReadyExample,
      realityReport: photoToTemplateRealitySemanticIntegratedExample,
      semanticReport: makeupSemanticExtractionReadyExample,
      draftIntegration: brokenIntegration,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: photoToTemplateOperatorDraftQaReadyExample,
      draftPreviewQa: previewQa,
    });

    expect(report.status).toBe('blocked');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: `${brokenIntegration.bindings[0].field}_binding_final_marker`,
          stepId: 'draft_integration',
        }),
      ]),
    );
  });

  it('blocks handoff when draft QA or draft preview QA is blocked', () => {
    const blockedDraftQa = {
      ...photoToTemplateOperatorDraftQaReadyExample,
      status: 'draft_qa_blocked',
      readyForHumanReview: false,
    } as TemplateDraftQaResult;
    const blockedDraftQaPreview = createPhotoToTemplateDraftPreviewQaReport({
      integration: photoToTemplateDraftIntegrationReadyExample,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: blockedDraftQa,
    });
    const blockedByDraftQa = createPhotoToTemplateOperatorWorkflowReport({
      regionQa: faceMeshRegionQaReadyExample,
      realityReport: photoToTemplateRealitySemanticIntegratedExample,
      semanticReport: makeupSemanticExtractionReadyExample,
      draftIntegration: photoToTemplateDraftIntegrationReadyExample,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: blockedDraftQa,
      draftPreviewQa: blockedDraftQaPreview,
    });
    const blockedByPreview = createPhotoToTemplateOperatorWorkflowReport({
      regionQa: faceMeshRegionQaReadyExample,
      realityReport: photoToTemplateRealitySemanticIntegratedExample,
      semanticReport: makeupSemanticExtractionReadyExample,
      draftIntegration: photoToTemplateDraftIntegrationReadyExample,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: photoToTemplateOperatorDraftQaReadyExample,
      draftPreviewQa: photoToTemplateDraftPreviewQaBlockedInternalTermsExample,
    });

    expect(blockedByDraftQa.status).toBe('blocked');
    expect(blockedByDraftQa.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'draft_qa_blocked' }),
      ]),
    );
    expect(blockedByPreview.status).toBe('blocked');
    expect(blockedByPreview.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'draft_preview_qa_blocked' }),
      ]),
    );
  });
});
