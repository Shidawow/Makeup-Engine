import type { CosmeticSegmentationTarget } from '../../vision';
import type {
  DatasetQualityStatus,
  DatasetReviewReason,
  DatasetSplit,
} from './dataset-review.schema';

export const DATASET_MANIFEST_SCHEMA_VERSION = 'dataset-manifest-v0.1' as const;

export type DatasetExportFormat = 'json_bundle' | 'jsonl' | 'manifest';

export interface DatasetManifestEntry {
  sampleId: string;
  imageId: string;
  templateId: string;
  regionId: CosmeticSegmentationTarget;
  split: DatasetSplit;
  qualityStatus: DatasetQualityStatus;
  qualityScore: number;
  reviewReasons: DatasetReviewReason[];
}

export interface DatasetSplitSummary {
  train: number;
  validation: number;
  test: number;
  holdout: number;
  unassigned: number;
}

export interface DatasetDeduplicationSummary {
  uniqueCount: number;
  duplicateCount: number;
  duplicateIds: string[];
}

export interface DatasetExportManifest {
  exportId: string;
  exportFormat: DatasetExportFormat;
  exportedAt: string;
  sampleCount: number;
}

export interface DatasetManifest {
  datasetId: string;
  schemaVersion: typeof DATASET_MANIFEST_SCHEMA_VERSION;
  createdAt: string;
  sampleCount: number;
  acceptedCount: number;
  rejectedCount: number;
  splitSummary: DatasetSplitSummary;
  regionSummary: Record<CosmeticSegmentationTarget, number>;
  imageDeduplicationSummary: DatasetDeduplicationSummary;
  templateDeduplicationSummary: DatasetDeduplicationSummary;
  qualityDistribution: Record<DatasetQualityStatus, number>;
  exportFormat: DatasetExportFormat;
  entries: DatasetManifestEntry[];
  exportManifest: DatasetExportManifest;
}
