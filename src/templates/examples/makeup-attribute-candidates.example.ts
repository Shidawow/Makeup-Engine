import {
  generateMakeupAttributeCandidates,
  generateMakeupTemplateDraft,
  generateRuleBasedStepSequence,
} from '../../template-engine';
import type { MakeupAnalysisPipelineResult } from '../../vision';
import { faceMeshRegionQaReadyExample, createFaceMeshQaExampleGeometry } from './facemesh-region-qa.example';

export const phase10aExampleAnalysis = {
  imageId: 'phase-10a-example-image',
  providerId: 'mediapipe-face-mesh',
  faceDetection: {
    imageId: 'phase-10a-example-image',
    faceId: 'phase-10a-example-face',
    detected: true,
    confidence: 0.94,
    box: {
      x: 0.18,
      y: 0.08,
      width: 0.64,
      height: 0.82,
      space: 'normalized-image',
    },
  },
  faceMesh: createFaceMeshQaExampleGeometry(),
  segmentationMasks: [],
  cosmeticRegions: [],
  cosmeticSegmentation: {
    imageId: 'phase-10a-example-image',
    providerId: 'polygon-refinement',
    masks: [],
    debug: [],
  },
  pixelAnalysis: {
    version: '0.1',
    imageId: 'phase-10a-example-image',
    lips: {
      dominantHue: 8,
      saturation: 0.76,
      brightness: 0.62,
      edgeSoftness: 0.68,
      gradientDirection: 'center',
    },
    blush: {
      blushCenter: {
        x: 0.6,
        y: 0.5,
      },
      spreadRadius: 0.34,
      opacity: 0.56,
      tone: 'warm',
    },
    eyes: {
      eyeshadowDarkness: 0.42,
      shimmerEstimation: 0.22,
      eyelinerDirection: 'upward',
    },
    edgeAnalysis: {
      version: '0.1',
      imageId: 'phase-10a-example-image',
      features: {
        blush: {
          target: 'blush',
          innerSampleCount: 12,
          edgeSampleCount: 12,
          outerSampleCount: 12,
          edgeSoftnessScore: 0.7,
          diffusionScore: 0.66,
          gradientDirection: 'center',
          edgeContrast: 0.2,
        },
      },
      debug: ['example edge analysis'],
    },
    debug: [],
  },
  semanticAnalysis: {
    version: '0.1',
    sourcePixelAnalysis: undefined,
    lipStyle: 'soft_gradient',
    lipFinish: 'satin',
    blushStyle: 'high_lift',
    eyeStyle: 'clean_defined',
    semanticSummary: ['soft_gradient_lip', 'high_lift_blush', 'clean_defined_eye'],
    explanations: ['local rule-based semantic example'],
  },
  parameters: {
    version: '0.1',
    imageId: 'phase-10a-example-image',
    faceId: 'phase-10a-example-face',
    semanticSummary: ['soft_gradient_lip'],
    editableRegionIds: [],
    templateSignals: [],
  },
  trace: ['image-input', 'face-detection', 'landmarks', 'makeup-analysis'],
  debug: [],
} as unknown as MakeupAnalysisPipelineResult;

export const makeupAttributeCandidatesReadyExample =
  generateMakeupAttributeCandidates({
    analysis: phase10aExampleAnalysis,
    regionQa: faceMeshRegionQaReadyExample,
  });

export const ruleBasedStepSequenceReadyExample =
  generateRuleBasedStepSequence(makeupAttributeCandidatesReadyExample);

export const makeupTemplateDraftReadyExample = generateMakeupTemplateDraft({
  analysis: phase10aExampleAnalysis,
  regionQa: faceMeshRegionQaReadyExample,
  attributeCandidates: makeupAttributeCandidatesReadyExample,
  stepSequence: ruleBasedStepSequenceReadyExample,
});
