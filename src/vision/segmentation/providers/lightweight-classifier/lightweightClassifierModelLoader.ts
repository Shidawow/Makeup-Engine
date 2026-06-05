import type { LightweightSegmentationClassifier, LightweightRegionClassifier } from '../../../../training/schema';
import type { CosmeticSegmentationTarget } from '../../masks';

export const loadLightweightSegmentationClassifier = (
  model: LightweightSegmentationClassifier,
): LightweightSegmentationClassifier => ({
  ...model,
  trainedRegions: [...model.trainedRegions].sort(),
});

export const getLightweightRegionClassifier = (
  model: LightweightSegmentationClassifier,
  regionId: CosmeticSegmentationTarget,
): LightweightRegionClassifier | null =>
  model.regionClassifiers[regionId] ?? null;
