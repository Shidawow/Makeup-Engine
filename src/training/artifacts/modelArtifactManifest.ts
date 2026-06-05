import { stableStringify } from '../../templates/storage/datasetExport';
import type { LoadedTrainingDataset } from '../schema';
import type { TrainerConfig } from '../config';
import type {
  ModelArtifactManifest,
  ModelArtifactValidationResult,
} from '../schema/model-artifact.schema';
import { MODEL_ARTIFACT_SCHEMA_VERSION } from '../schema/model-artifact.schema';
import type { BaselineSegmentationModel } from '../schema/baseline-segmentation-model.schema';
import type { ImageConditionedSegmentationModel } from '../schema/image-conditioned-segmentation-model.schema';
import type { LightweightSegmentationClassifier } from '../schema/lightweight-classifier.schema';

export const createModelArtifactManifestPlaceholder = (input: {
  dataset: LoadedTrainingDataset;
  config: TrainerConfig;
  trainingRunId: string;
  createdAt: string;
}): ModelArtifactManifest => ({
  schemaVersion: MODEL_ARTIFACT_SCHEMA_VERSION,
  modelId: `model-placeholder-${input.dataset.summary.datasetId}`,
  modelVersion: 'placeholder-v0.1',
  trainingRunId: input.trainingRunId,
  sourceDatasetId: input.dataset.summary.datasetId,
  sourcePackageId: input.dataset.summary.sourcePackageId,
  trainerConfigVersion: input.config.schemaVersion,
  runtimeKind: input.config.runtime.runtimeKind,
  artifactEntries: [
    {
      artifactId: `model-artifact-${input.trainingRunId}`,
      format: 'placeholder-json',
      referenceUri: `placeholder://models/${input.trainingRunId}.json`,
      checksum: 'placeholder',
      byteSize: 0,
    },
  ],
  metricsReference: `placeholder://metrics/${input.trainingRunId}.json`,
  evaluationReportReference: `placeholder://evaluation/${input.trainingRunId}.json`,
  createdAt: input.createdAt,
  readinessStatus: {
    status: 'placeholder',
    reasons: ['Phase 6B does not produce real model artifacts'],
  },
  lineage: {
    sourceDatasetId: input.dataset.summary.datasetId,
    sourcePackageId: input.dataset.summary.sourcePackageId,
    trainingRunId: input.trainingRunId,
    trainerConfigVersion: input.config.schemaVersion,
    runtimeKind: input.config.runtime.runtimeKind,
  },
});

export const validateModelArtifactManifest = (
  manifest: ModelArtifactManifest,
): ModelArtifactValidationResult => ({
  valid:
    manifest.schemaVersion === MODEL_ARTIFACT_SCHEMA_VERSION &&
    manifest.artifactEntries.length > 0,
  errors: [
    ...(manifest.schemaVersion !== MODEL_ARTIFACT_SCHEMA_VERSION
      ? ['invalid model artifact schemaVersion']
      : []),
    ...(manifest.artifactEntries.length === 0 ? ['model artifact entries are required'] : []),
  ],
  warnings:
    manifest.artifactEntries.some((entry) => entry.format === 'baseline-mask-prior-json')
      ? []
      : ['model artifact manifest is placeholder-only'],
});

export const summarizeModelArtifactManifest = (
  manifest: ModelArtifactManifest,
): string =>
  `${manifest.modelId}:${manifest.runtimeKind}:${manifest.readinessStatus.status}`;

export const exportModelArtifactManifestJson = (
  manifest: ModelArtifactManifest,
): string => stableStringify(manifest);

export const createBaselineModelArtifactManifest = (input: {
  model: BaselineSegmentationModel;
  config: TrainerConfig;
  createdAt: string;
}): ModelArtifactManifest => ({
  schemaVersion: MODEL_ARTIFACT_SCHEMA_VERSION,
  modelId: input.model.modelId,
  modelVersion: input.model.modelVersion,
  trainingRunId: input.model.trainingRunId,
  sourceDatasetId: input.model.sourceDatasetId,
  sourcePackageId: input.model.sourcePackageId,
  trainerConfigVersion: input.config.schemaVersion,
  runtimeKind: input.config.runtime.runtimeKind,
  artifactEntries: [
    {
      artifactId: `${input.model.modelId}-model-json`,
      format: 'baseline-mask-prior-json',
      referenceUri: 'model.json',
      checksum: input.model.artifactChecksum,
      byteSize: stableStringify(input.model).length,
    },
    {
      artifactId: `${input.model.modelId}-trainer-config`,
      format: 'placeholder-json',
      referenceUri: 'trainer-config.json',
      checksum: 'trainer-config',
      byteSize: stableStringify(input.config).length,
    },
    {
      artifactId: `${input.model.modelId}-evaluation-report`,
      format: 'placeholder-json',
      referenceUri: 'evaluation-report.json',
      checksum: 'evaluation-report',
      byteSize: 0,
    },
    {
      artifactId: `${input.model.modelId}-training-run-package`,
      format: 'placeholder-json',
      referenceUri: 'training-run-package.json',
      checksum: 'training-run-package',
      byteSize: 0,
    },
    {
      artifactId: `${input.model.modelId}-failed-samples`,
      format: 'placeholder-json',
      referenceUri: 'failed-samples.json',
      checksum: 'failed-samples',
      byteSize: 0,
    },
  ],
  metricsReference: 'evaluation-report.json',
  evaluationReportReference: 'evaluation-report.json',
  createdAt: input.createdAt,
  readinessStatus: {
    status: input.model.evaluationSummary.readinessStatus,
    reasons: input.model.trainingSummary.warnings,
  },
  lineage: {
    sourceDatasetId: input.model.sourceDatasetId,
    sourcePackageId: input.model.sourcePackageId,
    trainingRunId: input.model.trainingRunId,
    trainerConfigVersion: input.config.schemaVersion,
    runtimeKind: input.config.runtime.runtimeKind,
  },
});

export const createImageConditionedModelArtifactManifest = (input: {
  model: ImageConditionedSegmentationModel;
  config: TrainerConfig;
  createdAt: string;
}): ModelArtifactManifest => ({
  schemaVersion: MODEL_ARTIFACT_SCHEMA_VERSION,
  modelId: input.model.modelId,
  modelVersion: input.model.modelVersion,
  trainingRunId: input.model.trainingRunId,
  sourceDatasetId: input.model.sourceDatasetId,
  sourcePackageId: input.model.sourcePackageId,
  trainerConfigVersion: input.config.schemaVersion,
  runtimeKind: input.config.runtime.runtimeKind,
  artifactEntries: [
    {
      artifactId: `${input.model.modelId}-model-json`,
      format: 'image-conditioned-pixel-prior-json',
      referenceUri: 'model.json',
      checksum: input.model.artifactChecksum,
      byteSize: stableStringify(input.model).length,
    },
    {
      artifactId: `${input.model.modelId}-feature-config`,
      format: 'placeholder-json',
      referenceUri: 'trainer-config.json',
      checksum: 'feature-config',
      byteSize: stableStringify(input.model.featureConfig).length,
    },
    {
      artifactId: `${input.model.modelId}-evaluation-report`,
      format: 'placeholder-json',
      referenceUri: 'evaluation-report.json',
      checksum: 'evaluation-report',
      byteSize: 0,
    },
  ],
  metricsReference: 'evaluation-report.json',
  evaluationReportReference: 'evaluation-report.json',
  createdAt: input.createdAt,
  readinessStatus: {
    status: input.model.evaluationSummary.readinessStatus,
    reasons: input.model.trainingSummary.warnings,
  },
  lineage: {
    sourceDatasetId: input.model.sourceDatasetId,
    sourcePackageId: input.model.sourcePackageId,
    trainingRunId: input.model.trainingRunId,
    trainerConfigVersion: input.config.schemaVersion,
    runtimeKind: input.config.runtime.runtimeKind,
  },
});

export const createLightweightClassifierArtifactManifest = (input: {
  model: LightweightSegmentationClassifier;
  config: TrainerConfig;
  createdAt: string;
}): ModelArtifactManifest => ({
  schemaVersion: MODEL_ARTIFACT_SCHEMA_VERSION,
  modelId: input.model.modelId,
  modelVersion: input.model.modelVersion,
  trainingRunId: input.model.trainingRunId,
  sourceDatasetId: input.model.sourceDatasetId,
  sourcePackageId: input.model.sourcePackageId,
  trainerConfigVersion: input.config.schemaVersion,
  runtimeKind: input.config.runtime.runtimeKind,
  artifactEntries: [
    {
      artifactId: `${input.model.modelId}-model-json`,
      format: input.model.classifierKind === 'logistic-linear' ? 'logistic-linear-json' : 'nearest-centroid-json',
      referenceUri: 'model.json',
      checksum: input.model.artifactChecksum,
      byteSize: stableStringify(input.model).length,
    },
    {
      artifactId: `${input.model.modelId}-classifier-json`,
      format: 'lightweight-classifier-json',
      referenceUri: 'model.json',
      checksum: input.model.artifactChecksum,
      byteSize: stableStringify(input.model).length,
    },
    {
      artifactId: `${input.model.modelId}-evaluation-report`,
      format: 'placeholder-json',
      referenceUri: 'evaluation-report.json',
      checksum: 'evaluation-report',
      byteSize: 0,
    },
    {
      artifactId: `${input.model.modelId}-binary-mask-boundary`,
      format: 'binary-mask-artifact',
      referenceUri: 'masks-binary/',
      checksum: 'binary-mask-boundary',
      byteSize: 0,
    },
    {
      artifactId: `${input.model.modelId}-binary-diff-boundary`,
      format: 'binary-diff-artifact',
      referenceUri: 'diffs-binary/',
      checksum: 'binary-diff-boundary',
      byteSize: 0,
    },
  ],
  metricsReference: 'evaluation-report.json',
  evaluationReportReference: 'evaluation-report.json',
  createdAt: input.createdAt,
  readinessStatus: {
    status: input.model.evaluationSummary.readinessStatus,
    reasons: input.model.trainingSummary.warnings,
  },
  lineage: {
    sourceDatasetId: input.model.sourceDatasetId,
    sourcePackageId: input.model.sourcePackageId,
    trainingRunId: input.model.trainingRunId,
    trainerConfigVersion: input.config.schemaVersion,
    runtimeKind: input.config.runtime.runtimeKind,
  },
});

export const attachExportReadyReferencesToModelManifest = (input: {
  manifest: ModelArtifactManifest;
  exportPackageReference: string;
  providerSpecReference: string;
  runtimeCompatibilityReference: string;
  exportPreparationReference: string;
  artifactManifestReference?: string;
  runtimeSmokeReportReference?: string;
  onnxPrototypeReference?: string;
  onnxPrototypeManifestReference?: string;
  tensorSpecReference?: string;
  codecReportReference?: string;
  pngCodecReference?: string;
  pngMaskCodecReference?: string;
}): ModelArtifactManifest => ({
  ...input.manifest,
  exportPackageReference: input.exportPackageReference,
  providerSpecReference: input.providerSpecReference,
  runtimeCompatibilityReference: input.runtimeCompatibilityReference,
  exportPreparationReference: input.exportPreparationReference,
  artifactManifestReference: input.artifactManifestReference,
  runtimeSmokeReportReference: input.runtimeSmokeReportReference,
  onnxPrototypeReference: input.onnxPrototypeReference,
  onnxPrototypeManifestReference: input.onnxPrototypeManifestReference,
  tensorSpecReference: input.tensorSpecReference,
  codecReportReference: input.codecReportReference,
  pngCodecReference: input.pngCodecReference,
  pngMaskCodecReference: input.pngMaskCodecReference,
  readinessStatus: {
    ...input.manifest.readinessStatus,
    status:
      input.manifest.readinessStatus.status === 'placeholder'
        ? 'export-preparation-only'
        : input.manifest.readinessStatus.status,
    reasons: [...input.manifest.readinessStatus.reasons, 'export package references attached'].sort(),
  },
});
