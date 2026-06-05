import type { CosmeticRegionParameter } from '../cosmetic-regions';
import type {
  BlushPixelFeatures,
  EyePixelFeatures,
  ImagePixelData,
  LipPixelFeatures,
  MakeupPixelAnalysis,
} from './types';
import {
  polygonAverageRadius,
  polygonCentroid,
  samplePolygonPixels,
  summarizeRegionColor,
} from './regionSampling';
import { rgbToHsb } from './color';

const requireRegion = <TKind extends CosmeticRegionParameter['kind']>(
  regions: CosmeticRegionParameter[],
  kind: TKind,
): Extract<CosmeticRegionParameter, { kind: TKind }> => {
  const region = regions.find(
    (candidate): candidate is Extract<CosmeticRegionParameter, { kind: TKind }> =>
      candidate.kind === kind,
  );

  if (!region) {
    throw new Error(`Missing cosmetic pixel region: ${kind}`);
  }

  return region;
};

const average = (values: number[]): number =>
  values.length === 0
    ? 0
    : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));

const standardDeviation = (values: number[]): number => {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Number(Math.sqrt(variance).toFixed(4));
};

const estimateLipGradientDirection = (
  pixels: ReturnType<typeof samplePolygonPixels>,
): LipPixelFeatures['gradientDirection'] => {
  if (pixels.length < 4) {
    return 'none';
  }

  const brightness = pixels.map((pixel) => rgbToHsb(pixel).brightness);
  const firstHalf = average(brightness.slice(0, Math.floor(brightness.length / 2)));
  const secondHalf = average(brightness.slice(Math.floor(brightness.length / 2)));
  const delta = Math.abs(firstHalf - secondHalf);

  if (delta < 0.03) {
    return 'center';
  }

  return firstHalf > secondHalf ? 'left-to-right' : 'top-to-bottom';
};

const analyzeLips = (
  image: ImagePixelData,
  region: Extract<CosmeticRegionParameter, { kind: 'lips' }>,
): { features: LipPixelFeatures; sampleCount: number } => {
  const summary = summarizeRegionColor(image, region.polygon);
  const pixels = samplePolygonPixels(image, region.polygon);
  const saturations = pixels.map((pixel) => rgbToHsb(pixel).saturation);

  return {
    sampleCount: summary.sampleCount,
    features: {
      dominantHue: summary.dominant.hue,
      saturation: summary.dominant.saturation,
      brightness: summary.dominant.brightness,
      edgeSoftness: Number((1 - standardDeviation(saturations)).toFixed(4)),
      gradientDirection: estimateLipGradientDirection(pixels),
    },
  };
};

const toneFromHue = (hue: number): BlushPixelFeatures['tone'] => {
  if (hue >= 335 || hue <= 55) {
    return 'warm';
  }

  if (hue >= 250 && hue <= 334) {
    return 'cool';
  }

  return 'neutral';
};

const analyzeBlush = (
  image: ImagePixelData,
  region: Extract<CosmeticRegionParameter, { kind: 'blush' }>,
): { features: BlushPixelFeatures; sampleCount: number } => {
  const summary = summarizeRegionColor(image, region.polygon);
  const centroid = polygonCentroid(region.polygon);

  return {
    sampleCount: summary.sampleCount,
    features: {
      blushCenter: { x: centroid.x, y: centroid.y },
      spreadRadius: polygonAverageRadius(region.polygon),
      opacity: Number((summary.dominant.saturation * 0.72).toFixed(4)),
      tone: toneFromHue(summary.dominant.hue),
    },
  };
};

const analyzeEyes = (
  image: ImagePixelData,
  region: Extract<CosmeticRegionParameter, { kind: 'eyes' }>,
): { features: EyePixelFeatures; sampleCount: number } => {
  const pixels = samplePolygonPixels(image, region.polygon);
  const hsbValues = pixels.map(rgbToHsb);
  const brightness = hsbValues.map((value) => value.brightness);
  const darkness = Number((1 - average(brightness)).toFixed(4));

  return {
    sampleCount: pixels.length,
    features: {
      eyeshadowDarkness: darkness,
      shimmerEstimation: standardDeviation(brightness),
      eyelinerDirection:
        region.parameters.liftAngle > 5
          ? 'upward'
          : region.parameters.liftAngle < -5
            ? 'downward'
            : 'horizontal',
    },
  };
};

export const analyzeMakeupPixels = (
  imageId: string,
  image: ImagePixelData,
  regions: CosmeticRegionParameter[],
): MakeupPixelAnalysis => {
  const lips = analyzeLips(image, requireRegion(regions, 'lips'));
  const blush = analyzeBlush(image, requireRegion(regions, 'blush'));
  const eyes = analyzeEyes(image, requireRegion(regions, 'eyes'));

  return {
    version: '0.1',
    imageId,
    lips: lips.features,
    blush: blush.features,
    eyes: eyes.features,
    debug: [
      {
        region: 'lips',
        sampleCount: lips.sampleCount,
        notes: ['Dominant lip hue, saturation, brightness, edge softness, and gradient estimated from lip polygon pixels.'],
      },
      {
        region: 'blush',
        sampleCount: blush.sampleCount,
        notes: ['Blush center, spread radius, opacity, and tone estimated from cheek polygon pixels.'],
      },
      {
        region: 'eyes',
        sampleCount: eyes.sampleCount,
        notes: ['Eyeshadow darkness, shimmer, and eyeliner direction estimated from eye polygon pixels.'],
      },
    ],
  };
};

