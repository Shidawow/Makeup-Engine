import { describe, expect, it } from 'vitest';
import {
  createTemplateLibraryCandidatePackage,
} from '../src/template-engine';
import {
  templateLibraryCandidatePackageMissingHumanReviewExample,
  templateLibraryCandidatePackageQaBlockedExample,
  templateLibraryCandidatePackageRawImageBlockedExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidatePackageUserAppMutationBlockedExample,
  templateLibraryCandidatePackageWarningExample,
  templateDraftHumanReviewApprovedCandidateExample,
  templateDraftReviewWorkflowApprovedCandidateExample,
  templateDraftQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('template library candidate package', () => {
  it('creates ready package only from approved_as_library_candidate review workflow', () => {
    expect(templateLibraryCandidatePackageReadyExample.packageStatus).toBe(
      'candidate_package_ready',
    );
    expect(templateLibraryCandidatePackageReadyExample.approvedHumanReviewDecision).toBe(
      'approve_for_template_library_candidate',
    );
    expect(templateLibraryCandidatePackageReadyExample.qaTrace.reviewWorkflowStatus).toBe(
      'approved_as_library_candidate',
    );
    expect(templateLibraryCandidatePackageReadyExample.notPublished).toBe(true);
    expect(templateLibraryCandidatePackageReadyExample.formalTemplateLibraryWriteBlocked).toBe(true);
    expect(templateLibraryCandidatePackageReadyExample.userAppTemplatePackageGenerationBlocked).toBe(true);
  });

  it('blocks package without human review decision', () => {
    expect(templateLibraryCandidatePackageMissingHumanReviewExample.packageStatus).toBe(
      'candidate_package_blocked',
    );
    expect(templateLibraryCandidatePackageMissingHumanReviewExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'missing_human_review_approval' }),
      ]),
    );
  });

  it('blocks package when QA is blocked', () => {
    expect(templateLibraryCandidatePackageQaBlockedExample.packageStatus).toBe(
      'candidate_package_blocked',
    );
    expect(templateLibraryCandidatePackageQaBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'qa_blocked' })]),
    );
  });

  it('blocks raw image references and UserAppTemplatePackage mutation markers', () => {
    expect(templateLibraryCandidatePackageRawImageBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'raw_image_reference' })]),
    );
    expect(templateLibraryCandidatePackageUserAppMutationBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'user_app_template_package_mutation' }),
      ]),
    );
  });

  it('blocks product shade, medical, and unsupported final claims', () => {
    const blocked = createTemplateLibraryCandidatePackage({
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: {
        ...ruleBasedStepSequenceReadyExample,
        steps: [
          {
            ...ruleBasedStepSequenceReadyExample.steps[0],
            instruction: '最终识别完成，请治疗过敏并使用 Dior shade #001。',
          },
        ],
      },
      templateDraft: makeupTemplateDraftReadyExample,
      draftQa: templateDraftQaReadyExample,
      humanReview: templateDraftHumanReviewApprovedCandidateExample,
      reviewWorkflow: templateDraftReviewWorkflowApprovedCandidateExample,
    });

    expect(blocked.packageStatus).toBe('candidate_package_blocked');
    expect(blocked.blockedReasons.map((reason) => reason.id)).toEqual(
      expect.arrayContaining([
        'unsupported_final_claim',
        'medical_claim',
        'product_shade_claim',
      ]),
    );
  });

  it('keeps JSON round-trip stable for ready and warning packages', () => {
    const readyRoundTrip = JSON.parse(
      JSON.stringify(templateLibraryCandidatePackageReadyExample),
    );
    const warningRoundTrip = JSON.parse(
      JSON.stringify(templateLibraryCandidatePackageWarningExample),
    );

    expect(readyRoundTrip).toEqual(templateLibraryCandidatePackageReadyExample);
    expect(warningRoundTrip).toEqual(templateLibraryCandidatePackageWarningExample);
  });
});
