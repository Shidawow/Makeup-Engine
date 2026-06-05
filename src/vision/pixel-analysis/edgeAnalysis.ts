import { rgbToHsb } from './color';
import { readPixel } from './regionSampling';
import type {
  EdgeAnalysisResult,
  EdgeRingFeature,
  ImagePixelData,
  LipPixelFeatures,
} from './types';
import type {
  CosmeticSegmentationMask,
  CosmeticSegmentationTarget,
} from '../segmentation';

const edgeTargetMap: Partial<Record<CosmeticSegmentationTarget, keyof EdgeAnalysisResult['features']>> = {
  lips: 'lips',
  blush: 'blush',
  contour: 'contour',
};

const average = (values: number[]): number =>
  values.length === 0
    ? 0
    : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));

const collectBrightness = (
  image: ImagePixelData,
  mask: CosmeticSegmentationMask,
  predicate: (alpha: number) => boolean,
): number[] => {
  const values: number[] = [];

  for (let y = 0; y < mask.grid.height; y += 1) {
    for (let x = 0; x < mask.grid.width; x += 1) {
      const alpha = mask.grid.alpha[y * mask.grid.width + x] ?? 0;

      if (predicate(alpha)) {
        values.push(
          rgbToHsb(
            readPixel(
              image,
              ((x + 0.5) / mask.grid.width) * image.width,
              ((y + 0.5) / mask.grid.height) * image.height,
            ),
          ).brightness,
        );
      }
    }
  }

  return values;
};

const gradientDirection = (
  innerBrightness: number,
  edgeBrightness: number,
  outerBrightness: number,
): LipPixelFeatures['gradientDirection'] => {
  if (Math.abs(innerBrightness - outerBrightness) < 0.03) {
    return 'center';
  }

  if (innerBrightness > edgeBrightness && edgeBrightness > outerBrightness) {
    return 'center';
  }

  return innerBrightness > outerBrightness ? 'left-to-right' : 'top-to-bottom';
};

export const analyzeMaskEdges = (
  image: ImagePixelData,
  mask: CosmeticSegmentationMask,
): EdgeRingFeature => {
  const inner = collectBrightness(image, mask, (alpha) => alpha >= 0.68);
  const edge = collectBrightness(image, mask, (alpha) => alpha >= 0.22 && alpha < 0.68);
  const outer = collectBrightness(image, mask, (alpha) => alpha > 0.02 && alpha < 0.22);
  const innerMean = average(inner);
  const edgeMean = average(edge);
  const outerMean = average(outer);
  const edgeContrast = Number(Math.abs(innerMean - outerMean).toFixed(4));
  const diffusionScore = Number((1 - Math.min(1, Math.abs(edgeMean - outerMean))).toFixed(4));
  const edgeSoftnessScore = Number((1 - Math.min(1, edgeContrast)).toFixed(4));

  return {
    target: mask.target,
    innerSampleCount: inner.length,
    edgeSampleCount: edge.length,
    outerSampleCount: outer.length,
    edgeSoftnessScore,
    diffusionScore,
    gradientDirection: gradientDirection(innerMean, edgeMean, outerMean),
    edgeContrast,
  };
};

export const analyzeEdgeRings = (
  imageId: string,
  image: ImagePixelData,
  masks: CosmeticSegmentationMask[],
): EdgeAnalysisResult => {
  const features: EdgeAnalysisResult['features'] = {};

  for (const mask of masks) {
    const key = edgeTargetMap[mask.target];

    if (key) {
      features[key] = analyzeMaskEdges(image, mask);
    }
  }

  return {
    version: '0.1',
    imageId,
    features,
    debug: Object.entries(features).map(
      ([target, feature]) =>
        `${target}:edge=${feature?.edgeSoftnessScore ?? 0}:diffusion=${feature?.diffusionScore ?? 0}`,
    ),
  };
};

