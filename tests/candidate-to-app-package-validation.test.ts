import { describe, expect, it } from 'vitest';
import { validateCandidateToAppPackageContract } from '../src/template-engine';
import {
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageValidationMissingHumanReviewExample,
  candidateToAppPackageValidationMissingRegionGuidanceExample,
  candidateToAppPackageValidationRawImageBlockedExample,
  candidateToAppPackageValidationReadyExample,
  candidateToAppPackageValidationUserAppMutationBlockedExample,
  candidateToAppPackageValidationWarningExample,
} from '../src/templates/examples';

describe('candidate-to-app package validation', () => {
  it('validates ready contract preparation as preview-only', () => {
    expect(candidateToAppPackageValidationReadyExample.status).toBe(
      'app_contract_validation_ready',
    );
    expect(candidateToAppPackageValidationReadyExample.readyForUserAppPackageDraftPreview).toBe(true);
    expect(candidateToAppPackageValidationReadyExample.mappingPreviewOnly).toBe(true);
    expect(candidateToAppPackageValidationReadyExample.notPublished).toBe(true);
    expect(candidateToAppPackageValidationReadyExample.formalUserAppTemplatePackageGenerationBlocked).toBe(true);
    expect(candidateToAppPackageValidationReadyExample.userAppPackageRegistryWriteBlocked).toBe(true);
  });

  it('keeps ready-with-warnings separate from formal package readiness', () => {
    expect(candidateToAppPackageValidationWarningExample.status).toBe(
      'app_contract_validation_ready_with_warnings',
    );
    expect(candidateToAppPackageValidationWarningExample.recommendations[0].action).toBe(
      'request_contract_preparation_revision',
    );
  });

  it('blocks missing source approval and missing human review trace', () => {
    expect(candidateToAppPackageValidationMissingHumanReviewExample.status).toBe(
      'app_contract_validation_blocked',
    );
    expect(candidateToAppPackageValidationMissingHumanReviewExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'source_candidate_ready' }),
        expect.objectContaining({ checkId: 'qa_human_review_trace_preserved' }),
      ]),
    );
  });

  it('blocks raw image references and UserAppTemplatePackage mutation markers', () => {
    expect(candidateToAppPackageValidationRawImageBlockedExample.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ checkId: 'no_raw_image_reference' })]),
    );
    expect(candidateToAppPackageValidationUserAppMutationBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_user_app_package_mutation' }),
      ]),
    );
  });

  it('blocks missing region guidance mapping', () => {
    expect(candidateToAppPackageValidationMissingRegionGuidanceExample.status).toBe(
      'app_contract_validation_blocked',
    );
    expect(candidateToAppPackageValidationMissingRegionGuidanceExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'region_guidance_mapped' }),
      ]),
    );
  });

  it('keeps validation JSON round-trip stable', () => {
    const validation = validateCandidateToAppPackageContract(
      candidateToAppPackageContractReadyExample,
    );

    expect(validation.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(validation))).toEqual(validation);
  });
});
