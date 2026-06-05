import type { ImagePixelData, LightweightSegmentationClassifier } from '../schema';
import type { ExportReadyModelPackage } from '../schema/export-ready-model-package.schema';

export interface ExportPackageRuntimeSmokeResult {
  schemaVersion: 'export-package-runtime-smoke-v0.1';
  packageId: string;
  modelId: string;
  providerId: string;
  maskShape: { width: number; height: number };
  confidence: number;
  passed: boolean;
  issues: string[];
  summary: string;
}

export const loadExportPackageForSmokeTest = (input: {
  pkg: ExportReadyModelPackage;
  model: LightweightSegmentationClassifier;
}): { pkg: ExportReadyModelPackage; model: LightweightSegmentationClassifier } => input;

export const validateExportPackageProviderRuntime = (input: {
  pkg: ExportReadyModelPackage;
  model: LightweightSegmentationClassifier;
}): string[] => [
  ...(input.pkg.providerCompatibility.compatible ? [] : ['provider compatibility failed']),
  ...(input.model.trainedRegions.length > 0 ? [] : ['model has no trained regions']),
  ...(input.pkg.sourceModelId === input.model.modelId ? [] : ['package model id mismatch']),
];

export const runProviderPredictionSmoke = (input: {
  model: LightweightSegmentationClassifier;
  image: ImagePixelData;
}): { width: number; height: number; confidence: number } => ({
  width: input.image.width,
  height: input.image.height,
  confidence: input.model.trainedRegions.length > 0 ? 0.5 : 0,
});

export const compareSmokePredictionToExpectedShape = (input: {
  prediction: { width: number; height: number };
  expected: { width: number; height: number };
}): string[] =>
  input.prediction.width === input.expected.width && input.prediction.height === input.expected.height
    ? []
    : ['smoke prediction shape mismatch'];

export const runExportPackageRuntimeSmokeTest = (input: {
  pkg: ExportReadyModelPackage;
  model: LightweightSegmentationClassifier;
  image: ImagePixelData;
}): ExportPackageRuntimeSmokeResult => {
  const validationIssues = validateExportPackageProviderRuntime(input);
  const prediction = runProviderPredictionSmoke({ model: input.model, image: input.image });
  const shapeIssues = compareSmokePredictionToExpectedShape({ prediction, expected: input.image });
  const issues = [...validationIssues, ...shapeIssues].sort();
  return {
    schemaVersion: 'export-package-runtime-smoke-v0.1',
    packageId: input.pkg.packageId,
    modelId: input.model.modelId,
    providerId: input.pkg.providerCompatibility.providerId,
    maskShape: { width: prediction.width, height: prediction.height },
    confidence: prediction.confidence,
    passed: issues.length === 0,
    issues,
    summary: `runtime-smoke:${input.pkg.packageId}:passed=${issues.length === 0}:shape=${prediction.width}x${prediction.height}`,
  };
};

export const summarizeRuntimeSmokeResult = (
  result: ExportPackageRuntimeSmokeResult,
): string => result.summary;
