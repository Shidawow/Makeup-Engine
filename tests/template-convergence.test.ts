import { describe, expect, it } from 'vitest';
import { convergeTemplateWithHumanCorrections } from '../src/template-engine';
import { createEditableCosmeticMask, type CosmeticSegmentationMask, type MakeupAnalysisPipelineResult } from '../src/vision';
import type { MakeupTemplate } from '../src/templates/schema';

const mask: CosmeticSegmentationMask = {
  id: 'convergence-mask',
  target: 'blush',
  polygon: {
    space: 'normalized-image',
    points: [
      { x: 0.3, y: 0.3 },
      { x: 0.7, y: 0.3 },
      { x: 0.7, y: 0.6 },
      { x: 0.3, y: 0.6 },
    ],
  },
  bounds: {
    x: 0.3,
    y: 0.3,
    width: 0.4,
    height: 0.3,
    space: 'normalized-image',
  },
  grid: {
    width: 4,
    height: 4,
    alpha: [
      0, 0.1, 0.1, 0,
      0.1, 0.6, 0.6, 0.1,
      0.1, 0.6, 0.6, 0.1,
      0, 0.1, 0.1, 0,
    ],
  },
  confidence: 0.8,
  debug: [],
};

const template: MakeupTemplate = {
  id: 'template-convergence',
  name: 'Convergence Template',
  goals: ['pixel_makeup_understanding'],
  faceStrategy: {
    id: 'strategy-convergence',
    summary: 'Human verified correction template.',
    goals: ['preserve_detected_style'],
    suitableFaceTypes: ['unknown'],
    reasoning: ['fixture'],
  },
  style: {
    family: 'natural',
    finish: 'satin',
    contrast: 'low',
    palette: {
      temperature: 'neutral',
      dominantFamilies: ['neutral'],
      accentFamilies: ['natural'],
    },
    signatureTraits: ['soft'],
    confidence: 0.6,
    evidence: ['fixture'],
  },
  faceSuitability: {
    profile: {
      faceShapes: ['round'],
      skinTypes: ['combination'],
      skinTones: ['neutral'],
      eyeTypes: ['double'],
      lipShapes: ['full'],
    },
    confidence: 0.5,
    rationale: ['fixture'],
  },
  regions: [],
  eyeDesign: { summary: 'Eye', effects: ['lift'], emphasis: 'eye' },
  lipDesign: { summary: 'Lip', effects: ['soften'], emphasis: 'lip' },
  contourDesign: { summary: 'Contour', effects: ['deepen'], emphasis: 'face' },
  steps: [],
  metadata: {
    version: '0.1',
    status: 'draft',
    createdAt: '2026-05-28T00:00:00.000Z',
    createdBy: 'tester',
    source: {
      imageId: 'img',
      fileName: 'img.jpg',
      sourceType: 'fixture',
    },
    styleTags: [],
  },
};

const analysis: MakeupAnalysisPipelineResult = {
  imageId: 'img',
  providerId: 'provider',
  faceDetection: {
    detected: true,
    confidence: 0.9,
    box: {
      x: 0.2,
      y: 0.2,
      width: 0.5,
      height: 0.5,
      space: 'normalized-image',
    },
  },
  faceMesh: {
    faceId: 'face',
    imageId: 'img',
    landmarks: [],
    boundingBox: {
      x: 0.2,
      y: 0.2,
      width: 0.5,
      height: 0.5,
      space: 'normalized-image',
    },
    debug: [],
  },
  segmentationMasks: [mask],
  cosmeticRegions: [],
  cosmeticSegmentation: {
    imageId: 'img',
    providerId: 'seg',
    masks: [mask],
    debug: [],
  },
  parameters: {
    imageId: 'img',
    faceId: 'face',
    editableRegionIds: [],
    templateSignals: [],
    semanticSummary: [],
  },
  trace: ['image-input', 'mask-reanalysis', 'weighted-pixel-analysis', 'semantic-analysis', 'template-parameterization'],
  debug: [],
};

describe('template convergence', () => {
  it('adds human verified metadata after editable mask corrections', () => {
    const editable = createEditableCosmeticMask(mask);
    const converged = convergeTemplateWithHumanCorrections({
      template,
      analysis,
      editableMasks: [editable],
      adjustedRegions: ['blush'],
    });

    expect(converged.template.metadata.visionEvidence?.source).toBe('human-verified');
    expect(converged.template.metadata.humanAdjustedRegions).toEqual(['blush']);
    expect(converged.correctionConfidence).toBeGreaterThan(0.5);
    expect(converged.evidenceNotes.join('|')).toContain('mask_edit_count:0');
  });
});

