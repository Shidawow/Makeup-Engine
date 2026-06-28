import { describe, expect, it } from 'vitest';
import {
  createPhotoToTemplateDraftIntegrationReport,
  evaluateTemplateDraftQa,
  type PhotoToTemplateDraftIntegrationReport,
} from '../src/template-engine';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupSemanticExtractionReadyExample,
  makeupTemplateDraftReadyExample,
  photoToTemplateDraftIntegrationBlockedExample,
  photoToTemplateDraftIntegrationInsufficientExample,
  photoToTemplateDraftIntegrationReadyExample,
  phase10aExampleAnalysis,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('photo-to-template draft integration', () => {
  it('binds semantic candidates to draft fields while preserving metadata', () => {
    const report = photoToTemplateDraftIntegrationReadyExample;

    expect(report.status).toBe('integration_ready_for_human_review');
    expect(report.bindings.length).toBeGreaterThanOrEqual(12);
    expect(report.bindings.map((binding) => binding.field)).toEqual(
      expect.arrayContaining(['title', 'summary', 'stepSequence', 'regionGuidance']),
    );
    report.bindings.forEach((binding) => {
      expect(binding.sourceType).toBeTruthy();
      expect(binding.confidenceBand).toBeTruthy();
      expect(binding.evidence.length).toBeGreaterThan(0);
      expect(binding.limitations.length).toBeGreaterThan(0);
      expect(binding.humanReviewRequired).toBe(true);
      expect(binding.notFinal).toBe(true);
      expect(binding.originalCandidateValue).toBeTruthy();
      expect(binding.editableDraftValue).toBeTruthy();
    });
    expect(report.allBindingsHumanReviewRequired).toBe(true);
    expect(report.allBindingsNotFinal).toBe(true);
    expect(report.sourceMetadataPreserved).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });

  it('blocks missing drafts and marks insufficient semantic evidence conservatively', () => {
    expect(photoToTemplateDraftIntegrationBlockedExample.status).toBe('integration_blocked');
    expect(photoToTemplateDraftIntegrationBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'missing_template_draft' }),
      ]),
    );
    expect(photoToTemplateDraftIntegrationInsufficientExample.status).toBe(
      'insufficient_semantic_evidence',
    );
    expect(photoToTemplateDraftIntegrationInsufficientExample.issues.some((issue) =>
      issue.id.endsWith('insufficient_evidence'),
    )).toBe(true);
  });

  it('does not allow semantic candidates to become publish-ready or final template data', () => {
    const report = createPhotoToTemplateDraftIntegrationReport({
      semanticReport: makeupSemanticExtractionReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: makeupTemplateDraftReadyExample,
      reviewerDecisions: {
        title: {
          decision: 'edit_candidate',
          editableDraftValue: 'AI 已确认正式模板',
          reviewerNote: 'unsafe claim fixture',
        },
      },
    });

    expect(report.status).toBe('integration_blocked');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'title_unsafe_claim' }),
      ]),
    );
    expect(report.publishBlocked).toBe(true);
    expect(report.registryWriteBlocked).toBe(true);
    expect(report.userAppTemplatePackageMutationBlocked).toBe(true);
  });

  it('draft QA blocks semantic candidate finalization and unsafe claims', () => {
    const brokenIntegration = {
      ...photoToTemplateDraftIntegrationReadyExample,
      bindings: photoToTemplateDraftIntegrationReadyExample.bindings.map((binding, index) =>
        index === 0 ? { ...binding, notFinal: false } : binding,
      ),
    } as unknown as PhotoToTemplateDraftIntegrationReport;
    const semanticFinalQa = evaluateTemplateDraftQa({
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: makeupTemplateDraftReadyExample,
      draftIntegration: brokenIntegration,
    });

    expect(semanticFinalQa.status).toBe('draft_qa_blocked');
    expect(semanticFinalQa.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'semantic_candidates_not_final' }),
      ]),
    );

    const unsafeDraft = {
      ...makeupTemplateDraftReadyExample,
      draft: {
        ...makeupTemplateDraftReadyExample.draft!,
        name: 'fully automatic extraction AI 已确认 已写入 registry 已发布 production writer Dior shade #001 治疗',
      },
    };
    const unsafeQa = evaluateTemplateDraftQa({
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: unsafeDraft,
      draftIntegration: photoToTemplateDraftIntegrationReadyExample,
    });
    const blockedChecks = unsafeQa.issues.map((issue) => issue.checkId);

    expect(unsafeQa.status).toBe('draft_qa_blocked');
    expect(blockedChecks).toEqual(
      expect.arrayContaining([
        'no_fully_automatic_extraction_claim',
        'no_ai_confirmed',
        'no_product_shade_claims',
        'no_medical_claims',
        'no_registry_write',
        'no_publish',
        'no_production_writer',
      ]),
    );
  });

  it('reality check can label 12C integrated fields without claiming automatic extraction', () => {
    const report = createPhotoToTemplateDraftIntegrationReport({
      semanticReport: makeupSemanticExtractionReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: makeupTemplateDraftReadyExample,
      integrationId: `integration-${phase10aExampleAnalysis.imageId}`,
    });

    expect(report.status).not.toBe('integration_blocked');
    expect(report.fullyAutomaticExtractionClaimBlocked).toBe(true);
  });
});
