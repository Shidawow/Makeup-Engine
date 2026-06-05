import type {
  BaselineRegionPrior,
  BaselineSegmentationModel,
} from '../../../../training/schema/baseline-segmentation-model.schema';
import { BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION } from '../../../../training/schema/baseline-segmentation-model.schema';
import type { CosmeticSegmentationTarget } from '../../masks';

export const validateBaselineSegmentationModel = (
  model: BaselineSegmentationModel,
): string[] => [
  ...(model.schemaVersion !== BASELINE_SEGMENTATION_MODEL_SCHEMA_VERSION
    ? ['unsupported baseline model schemaVersion']
    : []),
  ...(model.trainedRegions.length === 0 ? ['baseline model has no trained regions'] : []),
  ...model.trainedRegions.flatMap((region) =>
    model.regionPriors[region] ? [] : [`missing region prior:${region}`],
  ),
];

export const loadBaselineSegmentationModel = (
  model: BaselineSegmentationModel,
): BaselineSegmentationModel => {
  const errors = validateBaselineSegmentationModel(model);
  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }
  return model;
};

export const getBaselineRegionPrior = (
  model: BaselineSegmentationModel,
  regionId: CosmeticSegmentationTarget,
): BaselineRegionPrior | null =>
  model.regionPriors[regionId] ?? null;
