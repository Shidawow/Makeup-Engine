import { describe, expect, it } from 'vitest';
import { validatePhotoToTemplateRealityCheck } from '../src/template-engine';
import {
  photoToTemplateRealityFixtureAsRealBlockedExample,
  photoToTemplateRealityFullyAutomaticClaimBlockedExample,
  photoToTemplateRealityLipColorRealBlockedExample,
  photoToTemplateRealityMissingHumanRequiredBlockedExample,
  photoToTemplateRealityMissingPlaceholderWarningExample,
  photoToTemplateRealityModelConfidenceMislabelBlockedExample,
  photoToTemplateRealityReadyExample,
  photoToTemplateRealityRegistryClaimBlockedExample,
  photoToTemplateRealitySemanticIntegratedExample,
  photoToTemplateRealityValidationFixtureAsRealBlockedExample,
  photoToTemplateRealityValidationFullyAutomaticBlockedExample,
  photoToTemplateRealityValidationLipColorRealBlockedExample,
  photoToTemplateRealityValidationMissingHumanRequiredBlockedExample,
  photoToTemplateRealityValidationModelConfidenceBlockedExample,
  photoToTemplateRealityValidationReadyExample,
  photoToTemplateRealityValidationRegistryClaimBlockedExample,
  photoToTemplateRealityValidationWarningExample,
} from '../src/templates/examples';

describe('photo-to-template reality validation', () => {
  it('passes a properly labeled semi-automatic draft reality report', () => {
    expect(photoToTemplateRealityValidationReadyExample.status).toBe('reality_check_ready');
    expect(photoToTemplateRealityValidationReadyExample.readyForPhase12B).toBe(true);
    expect(photoToTemplateRealityValidationReadyExample.humanReviewRequired).toBe(true);
    expect(photoToTemplateRealityValidationReadyExample.noFullyAutomaticExtractionClaim).toBe(true);
    expect(photoToTemplateRealityValidationReadyExample.noRegistryWrite).toBe(true);
  });

  it('keeps missing placeholder labeling as a warning, not a false automatic claim', () => {
    expect(photoToTemplateRealityValidationWarningExample.status).toBe(
      'reality_check_ready_with_warnings',
    );
    expect(photoToTemplateRealityValidationWarningExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'placeholder_fields_identified' }),
      ]),
    );
    expect(photoToTemplateRealityMissingPlaceholderWarningExample.supportsFullyAutomaticExtraction).toBe(false);
  });

  it('blocks demo fixture or makeup semantic fields being labeled real_from_photo', () => {
    expect(photoToTemplateRealityValidationFixtureAsRealBlockedExample.status).toBe(
      'reality_check_blocked',
    );
    expect(photoToTemplateRealityValidationFixtureAsRealBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'source_label_integrity' }),
      ]),
    );
    expect(photoToTemplateRealityFixtureAsRealBlockedExample.fieldEvidence.find(
      (field) => field.field === 'userAppPreview',
    )?.sourceTypes).toContain('real_from_photo');

    expect(photoToTemplateRealityValidationLipColorRealBlockedExample.status).toBe(
      'reality_check_blocked',
    );
    expect(photoToTemplateRealityLipColorRealBlockedExample.fieldEvidence.find(
      (field) => field.field === 'lipColor',
    )?.sourceTypes).toContain('real_from_photo');
  });

  it('blocks fully automatic extraction, model confidence, and registry claims', () => {
    expect(photoToTemplateRealityValidationFullyAutomaticBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_fully_automatic_claim' }),
      ]),
    );
    expect(photoToTemplateRealityValidationModelConfidenceBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_model_confidence_mislabel' }),
      ]),
    );
    expect(photoToTemplateRealityValidationRegistryClaimBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'no_registry_write' }),
      ]),
    );
    expect(photoToTemplateRealityFullyAutomaticClaimBlockedExample.claims.join('\n')).toContain(
      'fully automatic extraction',
    );
    expect(photoToTemplateRealityModelConfidenceMislabelBlockedExample.claims.join('\n')).toContain(
      'model raw confidence',
    );
    expect(photoToTemplateRealityRegistryClaimBlockedExample.claims.join('\n')).toContain(
      '已写入 registry',
    );
  });

  it('blocks reports that do not mark human-required fields', () => {
    expect(photoToTemplateRealityValidationMissingHumanRequiredBlockedExample.status).toBe(
      'reality_check_blocked',
    );
    expect(photoToTemplateRealityValidationMissingHumanRequiredBlockedExample.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: 'human_required_fields_identified' }),
      ]),
    );
    expect(
      photoToTemplateRealityMissingHumanRequiredBlockedExample.fieldEvidence.some((field) =>
        field.sourceTypes.includes('human_required'),
      ),
    ).toBe(false);
  });

  it('keeps validation JSON round-trip stable', () => {
    const validation = validatePhotoToTemplateRealityCheck(
      photoToTemplateRealityReadyExample,
    );

    expect(validation.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(validation))).toEqual(validation);
  });

  it('allows semantic candidate integrated source only as human-reviewed draft evidence', () => {
    const validation = validatePhotoToTemplateRealityCheck(
      photoToTemplateRealitySemanticIntegratedExample,
    );

    expect(validation.status).not.toBe('reality_check_blocked');
    expect(validation.noFullyAutomaticExtractionClaim).toBe(true);
    expect(validation.noRegistryWrite).toBe(true);
    expect(photoToTemplateRealitySemanticIntegratedExample.sourceSummary.semantic_candidate_integrated).toBeGreaterThan(0);
  });
});
