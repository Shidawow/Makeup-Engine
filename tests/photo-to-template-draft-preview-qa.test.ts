import { describe, expect, it } from 'vitest';
import {
  createPhotoToTemplateDraftPreviewQaReport,
  type TemplateDraftQaResult,
} from '../src/template-engine';
import {
  photoToTemplateDraftIntegrationReadyExample,
  photoToTemplateDraftPreviewQaBlockedClaimsExample,
  photoToTemplateDraftPreviewQaBlockedInternalTermsExample,
  photoToTemplateDraftPreviewQaReadyExample,
  photoToTemplateOperatorDraftQaReadyExample,
  photoToTemplateOperatorHumanReviewReadyExample,
} from '../src/templates/examples';

describe('photo-to-template draft preview QA', () => {
  it('keeps user-visible draft preview fields reviewable without making them publish-ready', () => {
    const report = photoToTemplateDraftPreviewQaReadyExample;

    expect(report.status).toBe('draft_preview_qa_ready');
    expect(report.userAppPreviewSuitable).toBe(true);
    expect(report.userVisibleFields.map((field) => field.field)).toEqual(
      expect.arrayContaining([
        'title',
        'summary',
        'suitableScenario',
        'difficulty',
        'estimatedTime',
        'toolList',
        'stepSequence',
        'regionGuidance',
      ]),
    );
    expect(report.localOnlyPrivacyNoticePresent).toBe(true);
    expect(report.internalFieldsHiddenFromUserPath).toBe(true);
    expect(report.humanReviewTracePreservedInternally).toBe(true);
    expect(report.notPublishReady).toBe(true);
    expect(report.publishBlocked).toBe(true);
    expect(report.registryWriteBlocked).toBe(true);
    expect(report.productionWriterBlocked).toBe(true);
    expect(report.userAppShellReplacementBlocked).toBe(true);
    expect(report.userAppTemplatePackageGenerationBlocked).toBe(true);
    expect(report.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });

  it('blocks missing draft QA and blocked draft QA before any user app draft preview', () => {
    const missingQaReport = createPhotoToTemplateDraftPreviewQaReport({
      integration: photoToTemplateDraftIntegrationReadyExample,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: null,
    });
    const blockedQa = {
      ...photoToTemplateOperatorDraftQaReadyExample,
      status: 'draft_qa_blocked',
      readyForHumanReview: false,
    } as TemplateDraftQaResult;
    const blockedQaReport = createPhotoToTemplateDraftPreviewQaReport({
      integration: photoToTemplateDraftIntegrationReadyExample,
      humanReviewEditing: photoToTemplateOperatorHumanReviewReadyExample,
      draftQa: blockedQa,
    });

    expect(missingQaReport.status).toBe('draft_preview_qa_blocked');
    expect(missingQaReport.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'not_publish_ready' }),
      ]),
    );
    expect(blockedQaReport.status).toBe('draft_preview_qa_blocked');
    expect(blockedQaReport.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Draft QA is blocked, so preview QA is blocked.' }),
      ]),
    );
  });

  it('blocks internal source metadata, confidence bands, reviewer notes, registry, and publish wording', () => {
    const report = photoToTemplateDraftPreviewQaBlockedInternalTermsExample;
    const blockedChecks = report.issues.map((issue) => issue.checkId);

    expect(report.status).toBe('draft_preview_qa_blocked');
    expect(blockedChecks).toEqual(
      expect.arrayContaining([
        'no_internal_source_type_visible',
        'no_confidence_band_visible',
        'no_reviewer_note_visible',
        'no_registry_terms_visible',
      ]),
    );
  });

  it('blocks AI confirmation, fully automatic, medical, and product shade claims', () => {
    const report = photoToTemplateDraftPreviewQaBlockedClaimsExample;
    const blockedChecks = report.issues.map((issue) => issue.checkId);

    expect(report.status).toBe('draft_preview_qa_blocked');
    expect(blockedChecks).toEqual(
      expect.arrayContaining([
        'no_ai_confirmed_claim',
        'no_fully_automatic_claim',
        'no_medical_claim',
        'no_product_shade_hard_claim',
      ]),
    );
  });
});
