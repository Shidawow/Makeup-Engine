import type { ImagePixelData, ImageConditionedRegionModel } from '../../../../training/schema';
import { predictImageConditionedMask } from '../../../../training/prediction';
import type { CosmeticRegionParameter } from '../../../cosmetic-regions';
import type { CosmeticSegmentationMask } from '../../masks';
import { cosmeticRegionToSegmentationTarget } from '../../masks';
import { polygonBounds } from '../../masks/maskGeometry';

export const adaptImageConditionedPredictionToMask = (input: {
  imageId: string;
  imagePixels: ImagePixelData;
  region: CosmeticRegionParameter;
  regionModel: ImageConditionedRegionModel;
}): CosmeticSegmentationMask => {
  const prediction = predictImageConditionedMask({
    image: input.imagePixels,
    regionModel: input.regionModel,
    featureConfig: {
      featureStride: 1,
      alphaPositiveThreshold: input.regionModel.featureModel.thresholds.alphaPositiveThreshold,
      alphaNegativeThreshold: input.regionModel.featureModel.thresholds.alphaNegativeThreshold,
      localContrastWindow: 1,
    },
  });
  const target = cosmeticRegionToSegmentationTarget(input.region);
  return {
    id: `${input.imageId}-${target}-image-conditioned-mask`,
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
      `Image-conditioned baseline predicted ${target}.`,
      `Score mean: ${prediction.scoreSummary.mean}.`,
    ],
  };
};
