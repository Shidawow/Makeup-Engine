import type { ExportModelInputSpec, ExportModelOutputSpec, ExportProviderCompatibility } from '../schema/export-ready-model-package.schema';
import type { BaselineSegmentationModel, ImageConditionedSegmentationModel, LightweightSegmentationClassifier } from '../schema';
import type { CosmeticSegmentationTarget } from '../../vision';

type SupportedModel =
  | BaselineSegmentationModel
  | ImageConditionedSegmentationModel
  | LightweightSegmentationClassifier;

const allFeatureNames = [
  'r',
  'g',
  'b',
  'h',
  's',
  'v',
  'brightness',
  'saturation',
  'skinRelativeDelta',
  'localContrast',
  'normalizedX',
  'normalizedY',
  'distanceToRegionCenter',
  'distanceToRegionBounds',
];

const regionsOf = (model: SupportedModel): CosmeticSegmentationTarget[] =>
  'trainedRegions' in model ? [...model.trainedRegions].sort() : [];

export const validateRegionSupportAgainstProvider = (
  model: SupportedModel,
): string[] =>
  regionsOf(model).length === 0 ? ['provider requires at least one trained region'] : [];

export const validateFeatureSpecAgainstProvider = (
  inputSpec: ExportModelInputSpec,
): string[] =>
  inputSpec.featureNames
    .filter((feature) => !allFeatureNames.includes(feature))
    .map((feature) => `unsupported feature:${feature}`)
    .sort();

export const validateInputSpecAgainstProvider = (
  inputSpec: ExportModelInputSpec,
): string[] =>
  inputSpec.requiresPixelData && inputSpec.featureNames.length === 0
    ? ['pixel provider requires feature names']
    : [];

export const validateOutputSpecAgainstProvider = (
  outputSpec: ExportModelOutputSpec,
): string[] =>
  outputSpec.outputType === 'CosmeticSegmentationMask' ? [] : ['provider output must be CosmeticSegmentationMask'];

export const validateModelProviderCompatibility = (input: {
  model: SupportedModel;
  providerId: 'baseline' | 'image-conditioned' | 'lightweight-classifier';
  inputSpec: ExportModelInputSpec;
  outputSpec: ExportModelOutputSpec;
}): ExportProviderCompatibility => {
  const issues = [
    ...validateRegionSupportAgainstProvider(input.model),
    ...validateInputSpecAgainstProvider(input.inputSpec),
    ...validateOutputSpecAgainstProvider(input.outputSpec),
    ...validateFeatureSpecAgainstProvider(input.inputSpec),
    ...(input.providerId === 'lightweight-classifier' && !('classifierKind' in input.model)
      ? ['lightweight provider requires lightweight classifier model']
      : []),
  ].sort();
  return {
    providerId: input.providerId,
    compatible: issues.length === 0,
    supportedRegions: regionsOf(input.model),
    fallbackPolicy: input.inputSpec.requiresPixelData ? 'polygon-refinement' : 'none',
    issues,
  };
};

export const summarizeProviderCompatibility = (
  compatibility: ExportProviderCompatibility,
): string =>
  `${compatibility.providerId}:compatible=${compatibility.compatible}:regions=${compatibility.supportedRegions.join(',')}:issues=${compatibility.issues.length}`;
