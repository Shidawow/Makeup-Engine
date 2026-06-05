import type { NormalizedPolygon } from '../providers';

export interface ImagePixelData {
  width: number;
  height: number;
  data: Uint8ClampedArray | readonly number[];
}

export interface HsbColorFeature {
  hue: number;
  saturation: number;
  brightness: number;
}

export interface RegionColorSample {
  sampleCount: number;
  dominant: HsbColorFeature;
  averageRgb: {
    r: number;
    g: number;
    b: number;
  };
}

export interface LipPixelFeatures {
  dominantHue: number;
  saturation: number;
  brightness: number;
  edgeSoftness: number;
  gradientDirection: 'center' | 'left-to-right' | 'top-to-bottom' | 'none';
}

export interface BlushPixelFeatures {
  blushCenter: {
    x: number;
    y: number;
  };
  spreadRadius: number;
  opacity: number;
  tone: 'warm' | 'cool' | 'neutral';
}

export interface EyePixelFeatures {
  eyeshadowDarkness: number;
  shimmerEstimation: number;
  eyelinerDirection: 'upward' | 'horizontal' | 'downward' | 'none';
}

export interface MakeupPixelAnalysis {
  version: '0.1';
  imageId: string;
  lips: LipPixelFeatures;
  blush: BlushPixelFeatures;
  eyes: EyePixelFeatures;
  weighted?: WeightedMakeupPixelAnalysis;
  skinBaseline?: SkinBaselineAnalysis;
  edgeAnalysis?: EdgeAnalysisResult;
  debug: {
    region: 'lips' | 'blush' | 'eyes';
    sampleCount: number;
    notes: string[];
  }[];
}

export interface PixelRegionInput {
  kind: 'lips' | 'blush' | 'eyes';
  polygon: NormalizedPolygon;
}

export interface WeightedHueBin {
  startHue: number;
  endHue: number;
  weight: number;
}

export interface WeightedColorSample {
  target: string;
  sampleCount: number;
  totalWeight: number;
  weightedRgbMean: {
    r: number;
    g: number;
    b: number;
  };
  weightedHsvMean: HsbColorFeature;
  weightedSaturation: number;
  weightedBrightness: number;
  weightedOpacity: number;
  hueDistribution: WeightedHueBin[];
}

export interface WeightedMakeupPixelAnalysis {
  version: '0.1';
  imageId: string;
  samples: {
    lips?: WeightedColorSample;
    blush?: WeightedColorSample;
    eyeshadow?: WeightedColorSample;
    contour?: WeightedColorSample;
  };
  debug: {
    weightedHeatmap: string[];
    samplingStatistics: string[];
  };
}

export interface SkinBaselineDifference {
  target: string;
  innerSampleCount: number;
  outerSampleCount: number;
  relativeSaturation: number;
  relativeBrightness: number;
  relativeHueShift: number;
  opacityEstimate: number;
}

export interface SkinBaselineAnalysis {
  version: '0.1';
  imageId: string;
  differences: {
    lips?: SkinBaselineDifference;
    blush?: SkinBaselineDifference;
    eyeshadow?: SkinBaselineDifference;
    contour?: SkinBaselineDifference;
  };
  debug: string[];
}

export interface EdgeRingFeature {
  target: string;
  innerSampleCount: number;
  edgeSampleCount: number;
  outerSampleCount: number;
  edgeSoftnessScore: number;
  diffusionScore: number;
  gradientDirection: LipPixelFeatures['gradientDirection'];
  edgeContrast: number;
}

export interface EdgeAnalysisResult {
  version: '0.1';
  imageId: string;
  features: {
    lips?: EdgeRingFeature;
    blush?: EdgeRingFeature;
    contour?: EdgeRingFeature;
  };
  debug: string[];
}
