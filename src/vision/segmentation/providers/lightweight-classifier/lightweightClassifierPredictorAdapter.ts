import type { ImagePixelData, LightweightRegionClassifier } from '../../../../training/schema';
import { predictMaskWithLightweightClassifier } from '../../../../training/prediction';
import type { CosmeticRegionParameter } from '../../../cosmetic-regions';
import type { CosmeticSegmentationMask } from '../../masks';
import { cosmeticRegionToSegmentationTarget } from '../../masks';
import { polygonBounds } from '../../masks/maskGeometry';

export const adaptLightweightClassifierPredictionToMask = (input: {
  imageId: string;
  imagePixels: ImagePixelData;
  region: CosmeticRegionParameter;
  classifier: LightweightRegionClassifier;
}): CosmeticSegmentationMask => {
  const prediction = predictMaskWithLightweightClassifier({
    image: input.imagePixels,
    classifier: input.classifier,
    featureConfig: {
      featureStride: 1,
      alphaPositiveThreshold: 0.4,
      alphaNegativeThreshold: 0.05,
      localContrastWindow: 1,
    },
  });
  const target = cosmeticRegionToSegmentationTarget(input.region);
  return {
    id: `${input.imageId}-${target}-lightweight-classifier-mask`,
    target,
    sourceRegionId: input.region.id,
    polygon: input.region.polygon,
    bounds: polygonBounds(input.region.polygon),
    grid: {
      width: prediction.width,
      height: prediction.height,
      alpha: prediction.alpha,
    },
    confidence: prediction.confidence,
    debug: [
      `Lightweight classifier predicted ${target}.`,
      `Score mean: ${prediction.scoreSummary.mean}.`,
    ],
  };
};
