import { describe, expect, it } from 'vitest';
import {
  validateTemplateLibraryCandidatePackage,
} from '../src/template-engine';
import {
  templateLibraryCandidatePackageRawImageBlockedExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidatePackageUserAppMutationBlockedExample,
  templateLibraryCandidateValidationMissingHumanReviewExample,
  templateLibraryCandidateValidationQaBlockedExample,
  templateLibraryCandidateValidationRawImageBlockedExample,
  templateLibraryCandidateValidationReadyExample,
  templateLibraryCandidateValidationUserAppMutationBlockedExample,
} from '../src/templates/examples';

describe('template library candidate validation', () => {
  it('validates ready candidate package as not published and not user app package mutation', () => {
    expect(templateLibraryCandidateValidationReadyExample.status).toBe(
      'candidate_validation_ready',
    );
    expect(templateLibraryCandidateValidationReadyExample.candidateReadyForLibraryReview).toBe(true);
    expect(templateLibraryCandidateValidationReadyExample.notPublished).toBe(true);
    expect(templateLibraryCandidateValidationReadyExample.formalTemplateLibraryWriteBlocked).toBe(true);
    expect(templateLibraryCandidateValidationReadyExample.userAppTemplatePackageGenerationBlocked).toBe(true);
    expect(templateLibraryCandidateValidationReadyExample.jsonRoundTripStable).toBe(true);
  });

  it('blocks missing human review and QA blocked packages', () => {
    expect(templateLibraryCandidateValidationMissingHumanReviewExample.status).toBe(
      'candidate_validation_blocked',
    );
    expect(templateLibraryCandidateValidationMissingHumanReviewExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'has_approved_human_review' }),
      ]),
    );
    expect(templateLibraryCandidateValidationQaBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'qa_trace_present' })]),
    );
  });

  it('blocks raw image references', () => {
    expect(templateLibraryCandidateValidationRawImageBlockedExample.status).toBe(
      'candidate_validation_blocked',
    );
    expect(templateLibraryCandidateValidationRawImageBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_raw_image_reference' })]),
    );
  });

  it('blocks UserAppTemplatePackage mutation markers', () => {
    expect(templateLibraryCandidateValidationUserAppMutationBlockedExample.status).toBe(
      'candidate_validation_blocked',
    );
    expect(templateLibraryCandidateValidationUserAppMutationBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_user_app_package_mutation' }),
      ]),
    );
  });

  it('keeps validation JSON round-trip stable', () => {
    const validation = validateTemplateLibraryCandidatePackage(
      templateLibraryCandidatePackageReadyExample,
    );
    expect(JSON.parse(JSON.stringify(validation))).toEqual(validation);
  });

  it('does not become a published template or write Template Library automatically', () => {
    const validation = validateTemplateLibraryCandidatePackage(
      templateLibraryCandidatePackageReadyExample,
    );
    const packageJson = JSON.stringify(templateLibraryCandidatePackageReadyExample);

    expect(validation.checks.find((check) => check.id === 'no_auto_publish')?.passed).toBe(true);
    expect(templateLibraryCandidatePackageReadyExample.formalTemplateLibraryWriteBlocked).toBe(true);
    expect(packageJson).not.toContain('publishedAt');
    expect(templateLibraryCandidatePackageRawImageBlockedExample.notPublished).toBe(true);
    expect(templateLibraryCandidatePackageUserAppMutationBlockedExample.userAppTemplatePackageGenerationBlocked).toBe(true);
  });
});
