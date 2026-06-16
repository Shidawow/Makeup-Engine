import { describe, expect, it } from 'vitest';
import {
  createCandidateToAppPackageContractPreparation,
} from '../src/template-engine';
import {
  candidateToAppPackageContractMissingHumanReviewExample,
  candidateToAppPackageContractMissingRegionGuidanceExample,
  candidateToAppPackageContractRawImageBlockedExample,
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageContractUserAppMutationBlockedExample,
  candidateToAppPackageContractWarningExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidateValidationReadyExample,
} from '../src/templates/examples';

describe('candidate-to-app package contract preparation', () => {
  it('creates ready contract preparation only from ready candidate validation', () => {
    expect(candidateToAppPackageContractReadyExample.contractStatus).toBe(
      'contract_preparation_ready',
    );
    expect(candidateToAppPackageContractReadyExample.sourceCandidatePackageId).toBe(
      templateLibraryCandidatePackageReadyExample.candidateId,
    );
    expect(candidateToAppPackageContractReadyExample.trace.sourceCandidateValidationStatus).toBe(
      'candidate_validation_ready',
    );
    expect(candidateToAppPackageContractReadyExample.mappingPreviewOnly).toBe(true);
    expect(candidateToAppPackageContractReadyExample.notPublished).toBe(true);
    expect(candidateToAppPackageContractReadyExample.formalUserAppTemplatePackageGenerationBlocked).toBe(true);
    expect(candidateToAppPackageContractReadyExample.userAppPackageRegistryWriteBlocked).toBe(true);
  });

  it('preserves QA, human review, privacy, and candidate trace mappings', () => {
    expect(candidateToAppPackageContractReadyExample.qaTraceMapping.status).toBe('mapped');
    expect(candidateToAppPackageContractReadyExample.humanReviewTraceMapping.status).toBe('mapped');
    expect(candidateToAppPackageContractReadyExample.privacyBoundaryMapping.status).toBe('mapped');
    expect(candidateToAppPackageContractReadyExample.candidateTraceMapping.previewValue).toContain(
      'candidate-package',
    );
  });

  it('routes source validation warnings to ready-with-warnings preparation', () => {
    expect(candidateToAppPackageContractWarningExample.contractStatus).toBe(
      'contract_preparation_ready_with_warnings',
    );
    expect(candidateToAppPackageContractWarningExample.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'source_candidate_validation_warning' }),
      ]),
    );
  });

  it('blocks missing human review trace', () => {
    expect(candidateToAppPackageContractMissingHumanReviewExample.contractStatus).toBe(
      'contract_preparation_blocked',
    );
    expect(candidateToAppPackageContractMissingHumanReviewExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'missing_approved_human_review_trace' }),
      ]),
    );
  });

  it('blocks raw image references and UserAppTemplatePackage mutation markers', () => {
    expect(candidateToAppPackageContractRawImageBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'raw_image_reference' })]),
    );
    expect(candidateToAppPackageContractUserAppMutationBlockedExample.blockedReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'user_app_template_package_mutation' }),
      ]),
    );
  });

  it('blocks missing region guidance before app package draft preparation', () => {
    expect(candidateToAppPackageContractMissingRegionGuidanceExample.contractStatus).toBe(
      'contract_preparation_blocked',
    );
    expect(candidateToAppPackageContractMissingRegionGuidanceExample.blockedReasons).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'missing_region_guidance' })]),
    );
    expect(candidateToAppPackageContractMissingRegionGuidanceExample.regionGuidanceMapping.status).toBe(
      'blocked',
    );
  });

  it('does not create a formal UserAppTemplatePackage or write a registry', () => {
    const preparation = createCandidateToAppPackageContractPreparation({
      candidatePackage: templateLibraryCandidatePackageReadyExample,
      candidateValidation: templateLibraryCandidateValidationReadyExample,
    });
    const json = JSON.stringify(preparation);

    expect(preparation.mappingPreviewOnly).toBe(true);
    expect(preparation.formalUserAppTemplatePackageGenerationBlocked).toBe(true);
    expect(preparation.userAppPackageRegistryWriteBlocked).toBe(true);
    expect(json).not.toContain('publishedAt');
    expect(json).not.toContain('appTemplateId');
    expect(JSON.parse(JSON.stringify(preparation))).toEqual(preparation);
  });
});
