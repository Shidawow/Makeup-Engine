import type { BaselineRegionPrior } from '../../../../training/schema/baseline-segmentation-model.schema';
import type { CosmeticRegionParameter } from '../../../cosmetic-regions';
import type { CosmeticSegmentationMask } from '../../masks';
import { cosmeticRegionToSegmentationTarget } from '../../masks';
import { polygonBounds } from '../../masks/maskGeometry';

const round4 = (value: number): number => Number(value.toFixed(4));

export const predictBaselineMask = (input: {
  imageId: string;
  region: CosmeticRegionParameter;
  prior: BaselineRegionPrior;
}): CosmeticSegmentationMask => {
  const target = cosmeticRegionToSegmentationTarget(input.region);
  const confidence = round4(
    Math.min(1, Math.max(0, input.prior.confidencePrior.mean || input.region.confidence)),
  );

  return {
    id: `${input.imageId}-${target}-baseline-prior-mask`,
    target,
    sourceRegionId: input.region.id,
    polygon: input.region.polygon,
    bounds: polygonBounds(input.region.polygon),
    grid: {
      width: input.prior.width,
      height: input.prior.height,
      alpha: input.prior.meanAlphaGrid,
    },
    confidence,
    debug: [
      `Baseline prior model predicted ${target} from ${input.prior.sampleCount} samples.`,
      `Prior active ratio: ${input.prior.meanAlphaStats.activeRatio}.`,
    ],
  };
};
