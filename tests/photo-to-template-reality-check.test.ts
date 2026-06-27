import { describe, expect, it } from 'vitest';
import {
  createPhotoToTemplateRealityCheckReport,
  type PhotoToTemplateRealityFieldKey,
} from '../src/template-engine';
import {
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  phase10aExampleAnalysis,
  photoToTemplateRealityReadyExample,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

const field = (name: PhotoToTemplateRealityFieldKey) => {
  const item = photoToTemplateRealityReadyExample.fieldEvidence.find(
    (candidate) => candidate.field === name,
  );
  expect(item).toBeTruthy();
  return item!;
};

describe('photo-to-template reality check', () => {
  it('labels FaceMesh geometry and region QA as real or derived photo evidence', () => {
    expect(field('faceDetected').sourceTypes).toEqual(
      expect.arrayContaining(['real_from_photo', 'facemesh_derived']),
    );
    expect(field('landmarkCount').sourceTypes).toEqual(
      expect.arrayContaining(['real_from_photo', 'facemesh_derived']),
    );
    expect(field('boundingBox').sourceTypes).toContain('facemesh_derived');
    expect(field('regionCoverage').sourceTypes).toContain('region_qa_derived');
    expect(field('cosmeticRegions').sourceTypes).toEqual(
      expect.arrayContaining(['facemesh_derived', 'region_qa_derived', 'human_required']),
    );
  });

  it('marks Readiness Score as rule-derived usability scoring, not model confidence', () => {
    const readiness = field('readinessScore');

    expect(readiness.sourceTypes).toEqual(
      expect.arrayContaining(['region_qa_derived', 'template_rule_derived']),
    );
    expect(readiness.sourceTypes).not.toContain('real_from_photo');
    expect(readiness.evidence.join('\n')).toContain('rule-based usability score');
    expect(readiness.evidence.join('\n')).toContain('not MediaPipe model raw confidence');
    expect(photoToTemplateRealityReadyExample.readinessScoreIsRuleBased).toBe(true);
  });

  it('does not mark makeup semantics and teaching copy as real_from_photo', () => {
    const nonRealFields: PhotoToTemplateRealityFieldKey[] = [
      'lipColor',
      'lipFinish',
      'blushPlacement',
      'eyeshadowTone',
      'browShape',
      'highlightPresence',
      'templateTitle',
      'templateSummary',
      'suitableScenario',
      'beginnerTips',
      'commonMistakes',
      'correctionTips',
      'userAppPreview',
    ];

    nonRealFields.forEach((fieldName) => {
      expect(field(fieldName).sourceTypes).not.toContain('real_from_photo');
    });
    expect(field('lipColor').sourceTypes).toEqual(
      expect.arrayContaining(['pixel_rule_derived', 'human_required']),
    );
    expect(field('lipFinish').sourceTypes).toEqual(
      expect.arrayContaining(['semantic_rule_derived', 'pixel_rule_derived', 'human_required']),
    );
    expect(field('userAppPreview').sourceTypes).toEqual(
      expect.arrayContaining(['demo_fixture', 'template_rule_derived', 'human_required']),
    );
  });

  it('identifies demo fixture, placeholder, human-required, and unsupported fields', () => {
    expect(photoToTemplateRealityReadyExample.sourceSummary.demo_fixture).toBeGreaterThan(0);
    expect(photoToTemplateRealityReadyExample.sourceSummary.placeholder).toBeGreaterThan(0);
    expect(photoToTemplateRealityReadyExample.sourceSummary.human_required).toBeGreaterThan(0);
    expect(photoToTemplateRealityReadyExample.sourceSummary.unsupported).toBeGreaterThan(0);
    expect(photoToTemplateRealityReadyExample.humanReviewRequired).toBe(true);
    expect(photoToTemplateRealityReadyExample.supportsFullyAutomaticExtraction).toBe(false);
    expect(field('eyeshadowTone').sourceTypes).toContain('unsupported');
  });

  it('supports only semi-automatic draft generation with human review', () => {
    const report = createPhotoToTemplateRealityCheckReport({
      analysis: phase10aExampleAnalysis,
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
      templateDraft: makeupTemplateDraftReadyExample,
    });

    expect(report.capabilityStatus).toBe('draft_generation_supported_with_limitations');
    expect(report.decision).toBe('semi_automatic_draft_with_limitations');
    expect(report.supportsSemiAutomaticDraft).toBe(true);
    expect(report.supportsFullyAutomaticExtraction).toBe(false);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });
});
