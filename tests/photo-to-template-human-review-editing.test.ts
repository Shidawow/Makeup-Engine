import { describe, expect, it } from 'vitest';
import {
  createDefaultPhotoToTemplateHumanReviewChecklist,
  createPhotoToTemplateHumanReviewEditingSession,
} from '../src/template-engine';
import {
  photoToTemplateDraftIntegrationReadyExample,
  photoToTemplateHumanReviewEditingBlockedExample,
  photoToTemplateHumanReviewEditingReadyExample,
} from '../src/templates/examples';

describe('photo-to-template human review editing', () => {
  it('keeps accepted candidates draft-only with original and edited values preserved', () => {
    const session = photoToTemplateHumanReviewEditingReadyExample;

    expect(session.status).toBe('human_review_editing_ready_for_draft_qa');
    expect(session.readyForDraftQa).toBe(true);
    expect(session.allAcceptedFieldsRemainDraftOnly).toBe(true);
    expect(session.originalCandidateTracePreserved).toBe(true);
    expect(session.humanReviewRequiredTracePreserved).toBe(true);

    const title = session.editableFields.find((field) => field.field === 'title');
    expect(title?.reviewerDecision).toBe('edit_candidate');
    expect(title?.originalCandidateValue).toBeTruthy();
    expect(title?.editableDraftValue).toContain('草稿');
    expect(title?.notFinal).toBe(true);
    expect(title?.humanReviewRequired).toBe(true);
  });

  it('rejects candidates without entering them into draft output', () => {
    const session = createPhotoToTemplateHumanReviewEditingSession({
      integration: photoToTemplateDraftIntegrationReadyExample,
      checklist: createDefaultPhotoToTemplateHumanReviewChecklist(true),
      edits: [
        {
          field: 'regionGuidance',
          decision: 'reject_candidate',
          reviewerNote: '区域说明候选不够清楚，不进入草稿。',
        },
      ],
    });
    const regionGuidance = session.editableFields.find(
      (field) => field.field === 'regionGuidance',
    );

    expect(regionGuidance?.reviewerDecision).toBe('reject_candidate');
    expect(regionGuidance?.entersDraft).toBe(false);
    expect(session.publishBlocked).toBe(true);
    expect(session.registryWriteBlocked).toBe(true);
  });

  it('marks insufficient evidence and require-more-review as review warnings', () => {
    const session = createPhotoToTemplateHumanReviewEditingSession({
      integration: photoToTemplateDraftIntegrationReadyExample,
      checklist: createDefaultPhotoToTemplateHumanReviewChecklist(true),
      edits: [
        {
          field: 'stepSequence',
          decision: 'mark_insufficient_evidence',
          reviewerNote: '步骤证据不足，需要继续审核。',
        },
      ],
    });

    expect(session.status).toBe('human_review_editing_needs_more_review');
    expect(session.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'stepSequence_needs_more_review' }),
      ]),
    );
  });

  it('blocks unsafe final, AI, shade, medical, registry, publish, and personal-data wording', () => {
    expect(photoToTemplateHumanReviewEditingBlockedExample.status).toBe(
      'human_review_editing_blocked',
    );
    expect(photoToTemplateHumanReviewEditingBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'title_blocked_by_reviewer' }),
        expect.objectContaining({ id: 'title_unsafe_review_wording' }),
      ]),
    );
    expect(photoToTemplateHumanReviewEditingBlockedExample.aiAutoConfirmationBlocked).toBe(true);
    expect(photoToTemplateHumanReviewEditingBlockedExample.productionWriterBlocked).toBe(true);
    expect(JSON.parse(JSON.stringify(photoToTemplateHumanReviewEditingReadyExample))).toEqual(
      photoToTemplateHumanReviewEditingReadyExample,
    );
  });
});
