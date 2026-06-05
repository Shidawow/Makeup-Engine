import type { ImageConditionedSegmentationModel } from '../../../../training/schema';
import { IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION } from '../../../../training/schema';

export const validateImageConditionedSegmentationModel = (
  model: ImageConditionedSegmentationModel,
): string[] => [
  ...(model.schemaVersion !== IMAGE_CONDITIONED_MODEL_SCHEMA_VERSION
    ? ['unsupported image-conditioned model schemaVersion']
    : []),
  ...(model.trainedRegions.length === 0 ? ['model has no trained regions'] : []),
];

export const loadImageConditionedSegmentationModel = (
  model: ImageConditionedSegmentationModel,
): ImageConditionedSegmentationModel => {
  const errors = validateImageConditionedSegmentationModel(model);
  if (errors.length > 0) throw new Error(errors.join('; '));
  return model;
};
