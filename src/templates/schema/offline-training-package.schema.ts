import type { CosmeticSegmentationTarget } from '../../vision';
import type { DatasetSplit } from './dataset-review.schema';

export const OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION =
  'offline-training-package-v0.1' as const;

export interface OfflineDatasetVersion {
  versionId: string;
  datasetId: string;
  trainingManifestId: string;
  createdAt: string;
  sampleCount: number;
  fingerprint: string;
  labels: string[];
}

export interface OfflineImageReference {
  imageReferenceId: string;
  imageId: string;
  split: DatasetSplit;
  sampleIds: string[];
  referenceUri: string;
  checksum: string;
  source: 'reviewed-dataset';
}

export interface OfflineMaskArtifact {
  artifactId: string;
  sampleId: string;
  maskId: string;
  target: CosmeticSegmentationTarget;
  regionId: CosmeticSegmentationTarget;
  artifactKind: 'original_mask' | 'human_edited_mask' | 'diff_heatmap';
  width: number;
  height: number;
  alphaStats: {
    min: number;
    max: number;
    mean: number;
    activeRatio: number;
  };
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
    space: 'normalized-image';
  } | null;
  source: 'human-correction-sample' | 'mask-diff';
  checksum: string;
  referenceUri: string;
}

export interface OfflineTrainingPackageEntry {
  entryId: string;
  sampleId: string;
  imageId: string;
  templateId: string;
  split: DatasetSplit;
  regionId: CosmeticSegmentationTarget;
  qualityScore: number;
  sampleWeight: number;
  imageReferenceId: string;
  maskArtifactIds: {
    originalMask: string;
    humanEditedMask: string;
    diffHeatmap: string;
  };
  validationStatus: 'ready' | 'warning' | 'blocked';
  warnings: string[];
}

export interface OfflinePackageValidationResult {
  schemaVersion: typeof OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION;
  valid: boolean;
  checkedAt: string;
  errors: string[];
  warnings: string[];
  summary: {
    sampleReferenceCount: number;
    imageReferenceCount: number;
    maskArtifactCount: number;
    splitCompleteness: Record<'train' | 'validation' | 'test', boolean>;
    leakageIssueCount: number;
    lowQualityExcludedCount: number;
  };
}

export interface OfflineOperatorAuditReport {
  schemaVersion: typeof OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION;
  reportId: string;
  packageId: string;
  sourceReviewedDatasetId: string;
  sourceTrainingManifestId: string;
  createdAt: string;
  correctionSummary: {
    totalCorrections: number;
    regionCounts: Record<CosmeticSegmentationTarget, number>;
    averageCorrectionConfidence: number;
  };
  reviewSummary: {
    accepted: number;
    rejected: number;
    needsSecondReview: number;
    readyForTraining: number;
    reviewerCounts: Record<string, number>;
  };
  rejectedReasonSummary: Record<string, number>;
  readinessSummary: {
    trainingReadySamples: number;
    blockedSamples: number;
    validationPassed: boolean;
    warnings: string[];
  };
  recommendations: string[];
}

export interface OfflineTrainingPackageManifest {
  schemaVersion: typeof OFFLINE_TRAINING_PACKAGE_SCHEMA_VERSION;
  packageId: string;
  datasetVersion: OfflineDatasetVersion;
  createdAt: string;
  sourceReviewedDatasetId: string;
  sourceTrainingManifestId: string;
  entryCount: number;
  imageReferenceCount: number;
  maskArtifactCount: number;
  splitSummary: Record<DatasetSplit, number>;
  regionSummary: Record<CosmeticSegmentationTarget, number>;
  qualitySummary: {
    minQualityScore: number;
    maxQualityScore: number;
    averageQualityScore: number;
  };
  validationSummary: OfflinePackageValidationResult;
  auditSummary: OfflineOperatorAuditReport;
}

export interface OfflineTrainingPackage extends OfflineTrainingPackageManifest {
  entries: OfflineTrainingPackageEntry[];
  imageReferences: OfflineImageReference[];
  maskArtifacts: OfflineMaskArtifact[];
  manifest: OfflineTrainingPackageManifest;
}
