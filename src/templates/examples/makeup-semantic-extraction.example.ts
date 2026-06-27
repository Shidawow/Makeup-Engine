import {
  buildCosmeticRegionsFromFaceMesh,
  createMakeupSemanticExtractionReport,
  type MakeupAnalysisPipelineResult,
  type MakeupPixelAnalysis,
  type WeightedColorSample,
} from '../../vision';
import {
  createFaceMeshQaExampleGeometry,
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
} from './facemesh-region-qa.example';
import { phase10aExampleAnalysis } from './makeup-attribute-candidates.example';

const imageId = 'phase-12b-semantic-example-image';

const weightedSample = ({
  target,
  hue,
  saturation,
  brightness,
  sampleCount,
}: {
  target: string;
  hue: number;
  saturation: number;
  brightness: number;
  sampleCount: number;
}): WeightedColorSample => ({
  target,
  sampleCount,
  totalWeight: sampleCount,
  weightedRgbMean: {
    r: Math.round(brightness * 255),
    g: Math.round((1 - saturation * 0.35) * brightness * 255),
    b: Math.round((1 - saturation * 0.5) * brightness * 255),
  },
  weightedHsvMean: {
    hue,
    saturation,
    brightness,
  },
  weightedSaturation: saturation,
  weightedBrightness: brightness,
  weightedOpacity: saturation * 0.8,
  hueDistribution: [
    {
      startHue: Math.max(0, hue - 8),
      endHue: Math.min(360, hue + 8),
      weight: 1,
    },
  ],
});

const basePixelAnalysis = phase10aExampleAnalysis.pixelAnalysis as MakeupPixelAnalysis;

const semanticPixelAnalysis: MakeupPixelAnalysis = {
  ...basePixelAnalysis,
  version: '0.1',
  imageId,
  weighted: {
    version: '0.1',
    imageId,
    samples: {
      lips: weightedSample({
        target: 'lips',
        hue: 18,
        saturation: 0.62,
        brightness: 0.64,
        sampleCount: 36,
      }),
      blush: weightedSample({
        target: 'blush',
        hue: 12,
        saturation: 0.38,
        brightness: 0.66,
        sampleCount: 28,
      }),
      eyeshadow: weightedSample({
        target: 'eyeshadow',
        hue: 42,
        saturation: 0.36,
        brightness: 0.52,
        sampleCount: 24,
      }),
      contour: weightedSample({
        target: 'contour',
        hue: 36,
        saturation: 0.22,
        brightness: 0.34,
        sampleCount: 18,
      }),
    },
    debug: {
      weightedHeatmap: ['phase-12b weighted local fixture'],
      samplingStatistics: ['anonymous local sample fixture only'],
    },
  },
  skinBaseline: {
    version: '0.1',
    imageId,
    differences: {
      lips: {
        target: 'lips',
        innerSampleCount: 36,
        outerSampleCount: 30,
        relativeSaturation: 0.36,
        relativeBrightness: 0.12,
        relativeHueShift: 18,
        opacityEstimate: 0.48,
      },
      blush: {
        target: 'blush',
        innerSampleCount: 28,
        outerSampleCount: 30,
        relativeSaturation: 0.24,
        relativeBrightness: 0.08,
        relativeHueShift: 12,
        opacityEstimate: 0.34,
      },
      eyeshadow: {
        target: 'eyeshadow',
        innerSampleCount: 24,
        outerSampleCount: 30,
        relativeSaturation: 0.18,
        relativeBrightness: -0.22,
        relativeHueShift: 28,
        opacityEstimate: 0.38,
      },
      contour: {
        target: 'contour',
        innerSampleCount: 18,
        outerSampleCount: 30,
        relativeSaturation: 0.08,
        relativeBrightness: -0.28,
        relativeHueShift: 8,
        opacityEstimate: 0.46,
      },
    },
    debug: ['phase-12b skin baseline fixture'],
  },
  edgeAnalysis: {
    version: '0.1',
    imageId,
    features: {
      lips: {
        target: 'lips',
        innerSampleCount: 28,
        edgeSampleCount: 24,
        outerSampleCount: 28,
        edgeSoftnessScore: 0.58,
        diffusionScore: 0.44,
        gradientDirection: 'center',
        edgeContrast: 0.18,
      },
      blush: {
        target: 'blush',
        innerSampleCount: 20,
        edgeSampleCount: 18,
        outerSampleCount: 22,
        edgeSoftnessScore: 0.76,
        diffusionScore: 0.7,
        gradientDirection: 'center',
        edgeContrast: 0.16,
      },
      contour: {
        target: 'contour',
        innerSampleCount: 18,
        edgeSampleCount: 16,
        outerSampleCount: 20,
        edgeSoftnessScore: 0.66,
        diffusionScore: 0.62,
        gradientDirection: 'top-to-bottom',
        edgeContrast: 0.2,
      },
    },
    debug: ['phase-12b edge analysis fixture'],
  },
  debug: [
    { region: 'lips', sampleCount: 36, notes: ['phase-12b lip sample fixture'] },
    { region: 'blush', sampleCount: 28, notes: ['phase-12b blush sample fixture'] },
    { region: 'eyes', sampleCount: 24, notes: ['phase-12b eye sample fixture'] },
  ],
};

export const makeupSemanticExtractionReadyAnalysis = {
  ...phase10aExampleAnalysis,
  imageId,
  faceMesh: createFaceMeshQaExampleGeometry(),
  cosmeticRegions: buildCosmeticRegionsFromFaceMesh({
    imageId,
    faceMesh: createFaceMeshQaExampleGeometry(),
    segmentationMasks: [],
  }),
  pixelAnalysis: semanticPixelAnalysis,
} as MakeupAnalysisPipelineResult;

export const makeupSemanticExtractionReadyExample =
  createMakeupSemanticExtractionReport({
    analysis: makeupSemanticExtractionReadyAnalysis,
    regionQa: faceMeshRegionQaReadyExample,
  });

export const makeupSemanticExtractionInsufficientExample =
  createMakeupSemanticExtractionReport({
    analysis: {
      ...phase10aExampleAnalysis,
      imageId: 'phase-12b-insufficient-image',
      cosmeticRegions: [],
      pixelAnalysis: undefined,
    } as MakeupAnalysisPipelineResult,
    regionQa: faceMeshRegionQaReadyExample,
  });

export const makeupSemanticExtractionBlockedExample =
  createMakeupSemanticExtractionReport({
    analysis: makeupSemanticExtractionReadyAnalysis,
    regionQa: faceMeshRegionQaBlockedExample,
  });
