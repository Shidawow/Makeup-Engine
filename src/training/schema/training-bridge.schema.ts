import type { CosmeticSegmentationTarget } from '../../vision';
import type {
  DatasetSplit,
  MaterializedDatasetEntry,
  MaterializedDiffFile,
  MaterializedImageFile,
  MaterializedMaskFile,
  MaterializedTrainingDataset,
  OfflineImageReference,
  OfflineMaskArtifact,
  OfflineTrainingPackageEntry,
} from '../../templates/schema';

export const TRAINING_BRIDGE_SCHEMA_VERSION =
  'segmentation-training-bridge-v0.1' as const;

export interface TrainingDatasetLoaderConfig {
  schemaVersion: typeof TRAINING_BRIDGE_SCHEMA_VERSION;
  datasetRootDir: string;
  includeSplits: DatasetSplit[];
  includeRegions: CosmeticSegmentationTarget[];
  minQualityScore: number;
  strict: boolean;
}

export type TrainingBridgeIssueSeverity = 'error' | 'warning';

export interface TrainingBridgeValidationIssue {
  severity: TrainingBridgeIssueSeverity;
  code: string;
  message: string;
  sampleId?: string;
  path?: string;
}

export interface LoadedTrainingArtifact<TPayload = unknown> {
  artifactId: string;
  relativePath: string;
  checksum: string;
  payload: TPayload;
  validationIssues: TrainingBridgeValidationIssue[];
}

export interface LoadedMaskTarget {
  artifactId: string;
  sampleId: string;
  maskId: string;
  regionId: CosmeticSegmentationTarget;
  width: number;
  height: number;
  alphaStats: OfflineMaskArtifact['alphaStats'];
  bounds: OfflineMaskArtifact['bounds'];
  checksum: string;
}

export interface LoadedDiffTarget {
  artifactId: string;
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  width: number;
  height: number;
  alphaStats: OfflineMaskArtifact['alphaStats'];
  bounds: OfflineMaskArtifact['bounds'];
  checksum: string;
}

export interface RegionTrainingTarget {
  regionId: CosmeticSegmentationTarget;
  sampleIds: string[];
  sampleCount: number;
  averageQualityScore: number;
  averageSampleWeight: number;
  warnings: string[];
}

export interface TrainingSampleInput {
  sampleId: string;
  imageId: string;
  templateId: string;
  split: DatasetSplit;
  regionId: CosmeticSegmentationTarget;
  imageReference: OfflineImageReference;
  regionTarget: CosmeticSegmentationTarget;
  qualitySignals: {
    qualityScore: number;
    sampleWeight: number;
  };
}

export interface TrainingSampleTarget {
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  originalMask: LoadedMaskTarget;
  humanEditedMask: LoadedMaskTarget;
  diffSignal: LoadedDiffTarget;
  targetWeight: number;
}

export interface LoadedTrainingSample {
  datasetId: string;
  sourcePackageId: string;
  datasetVersion: string;
  split: DatasetSplit;
  sampleId: string;
  imageId: string;
  templateId: string;
  regionId: CosmeticSegmentationTarget;
  regionTarget: RegionTrainingTarget;
  imageReference: LoadedTrainingArtifact<OfflineImageReference>;
  maskArtifact: LoadedTrainingArtifact<LoadedMaskTarget>;
  diffArtifact: LoadedTrainingArtifact<LoadedDiffTarget>;
  input: TrainingSampleInput;
  target: TrainingSampleTarget;
  qualityScore: number;
  sampleWeight: number;
  accepted: boolean;
  trainingReady: boolean;
  validationIssues: TrainingBridgeValidationIssue[];
  sourceEntry: OfflineTrainingPackageEntry | MaterializedDatasetEntry;
}

export interface LoadedTrainingSplit {
  split: DatasetSplit;
  samples: LoadedTrainingSample[];
  validationIssues: TrainingBridgeValidationIssue[];
}

export interface TrainingBatch {
  batchId: string;
  schemaVersion: typeof TRAINING_BRIDGE_SCHEMA_VERSION;
  split: DatasetSplit;
  regionId?: CosmeticSegmentationTarget;
  sampleCount: number;
  samples: TrainingSampleInput[];
  targets: TrainingSampleTarget[];
  validationIssues: TrainingBridgeValidationIssue[];
}

export interface TrainingBatchIteratorConfig {
  batchSize: number;
  split?: DatasetSplit;
  regions?: CosmeticSegmentationTarget[];
  qualityThreshold?: number;
  dropLast?: boolean;
  maxBatches?: number;
}

export interface TrainingBridgeSummary {
  datasetId: string;
  sourcePackageId: string;
  datasetVersion: string;
  totalSamples: number;
  splitCounts: Record<string, number>;
  regionCounts: Record<string, number>;
  averageQualityScore: number;
  averageSampleWeight: number;
  readiness: 'pass' | 'warning' | 'fail';
}

export interface TrainingPreflightResult {
  schemaVersion: typeof TRAINING_BRIDGE_SCHEMA_VERSION;
  datasetId: string;
  datasetVersion: string;
  sourcePackageId: string;
  checkedAt: string;
  summary: TrainingBridgeSummary;
  validationIssues: TrainingBridgeValidationIssue[];
  readiness: 'pass' | 'warning' | 'fail';
}

export interface LoadedTrainingDataset {
  schemaVersion: typeof TRAINING_BRIDGE_SCHEMA_VERSION;
  dataset: MaterializedTrainingDataset;
  samples: LoadedTrainingSample[];
  splits: LoadedTrainingSplit[];
  regionTargets: RegionTrainingTarget[];
  validationIssues: TrainingBridgeValidationIssue[];
  summary: TrainingBridgeSummary;
}

export type LoadedMaterializedFile =
  | MaterializedImageFile
  | MaterializedMaskFile
  | MaterializedDiffFile;
