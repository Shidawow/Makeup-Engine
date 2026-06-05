import type { TrainingRuntimeKind } from '../runtime';
import type { TrainerConfigVersion } from '../config';

export const MODEL_ARTIFACT_SCHEMA_VERSION = 'model-artifact-manifest-v0.1' as const;

export type ModelArtifactFormat =
  | 'placeholder-json'
  | 'baseline-mask-prior-json'
  | 'image-conditioned-pixel-prior-json'
  | 'lightweight-classifier-json'
  | 'nearest-centroid-json'
  | 'logistic-linear-json'
  | 'binary-mask-artifact'
  | 'binary-diff-artifact'
  | 'onnx-placeholder'
  | 'webgpu-placeholder';

export interface ModelArtifactEntry {
  artifactId: string;
  format: ModelArtifactFormat;
  referenceUri: string;
  checksum: string;
  byteSize: number;
}

export interface ModelTrainingLineage {
  sourceDatasetId: string;
  sourcePackageId: string;
  trainingRunId: string;
  trainerConfigVersion: TrainerConfigVersion;
  runtimeKind: TrainingRuntimeKind;
}

export interface ModelDeploymentReadiness {
  status:
    | 'placeholder'
    | 'blocked'
    | 'ready_for_baseline'
    | 'trained-baseline'
    | 'evaluated-baseline'
    | 'trained-image-conditioned-baseline'
    | 'evaluated-image-conditioned-baseline'
    | 'trained-lightweight-classifier'
    | 'evaluated-lightweight-classifier'
    | 'insufficient-data'
    | 'insufficient-pixel-data'
    | 'insufficient-feature-data'
    | 'failed-pixel-validation'
    | 'failed-classifier-validation'
    | 'failed-artifact-materialization'
    | 'export-ready-typescript-provider'
    | 'export-ready-browser-provider'
    | 'export-preparation-only'
    | 'blocked-by-artifact-alignment'
    | 'blocked-by-region-coverage'
    | 'blocked-by-provider-compatibility'
    | 'runtime-smoke-tested'
    | 'onnx-prototype-ready'
    | 'png-codec-ready'
    | 'png-mask-codec-ready'
    | 'blocked-by-png-codec'
    | 'blocked-by-onnx-prototype-validation'
    | 'blocked-by-runtime-smoke'
    | 'failed-validation';
  reasons: string[];
}

export interface ModelArtifactValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ModelArtifactManifest {
  schemaVersion: typeof MODEL_ARTIFACT_SCHEMA_VERSION;
  modelId: string;
  modelVersion: string;
  trainingRunId: string;
  sourceDatasetId: string;
  sourcePackageId: string;
  trainerConfigVersion: TrainerConfigVersion;
  runtimeKind: TrainingRuntimeKind;
  artifactEntries: ModelArtifactEntry[];
  metricsReference: string;
  evaluationReportReference: string;
  createdAt: string;
  readinessStatus: ModelDeploymentReadiness;
  lineage: ModelTrainingLineage;
  exportPackageReference?: string;
  providerSpecReference?: string;
  runtimeCompatibilityReference?: string;
  exportPreparationReference?: string;
  artifactManifestReference?: string;
  rawRgbaArtifactReference?: string;
  pngMaskArtifactReference?: string;
  binaryArtifactReference?: string;
  runtimeSmokeReportReference?: string;
  onnxPrototypeReference?: string;
  onnxPrototypeManifestReference?: string;
  tensorSpecReference?: string;
  codecReportReference?: string;
  pngCodecReference?: string;
  pngMaskCodecReference?: string;
}
