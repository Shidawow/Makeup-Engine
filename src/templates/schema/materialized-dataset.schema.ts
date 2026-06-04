import type { CosmeticSegmentationTarget } from '../../vision';
import type { DatasetSplit } from './dataset-review.schema';

export const MATERIALIZED_DATASET_SCHEMA_VERSION =
  'materialized-training-dataset-v0.1' as const;

export interface MaterializedImageFile {
  imageFileId: string;
  imageReferenceId: string;
  imageId: string;
  split: DatasetSplit;
  relativePath: string;
  portableUri: string;
  checksum: string;
  sampleIds: string[];
}

export interface MaterializedImagePixelFile {
  pixelFileId: string;
  artifactId: string;
  imageId: string;
  relativePath: string;
  portableUri: string;
  checksum: string;
  format: 'json-rgba-grid' | 'json-rgb-grid' | 'png-image' | 'browser-image-data-placeholder' | 'png-image-placeholder' | 'jpeg-image-placeholder';
}

export type MaterializedArtifactFormat =
  | 'json-rgba-grid'
  | 'raw-rgba-binary'
  | 'json-alpha-grid'
  | 'binary-alpha-mask'
  | 'png-alpha-mask'
  | 'png-image'
  | 'json-diff-grid'
  | 'binary-diff-grid'
  | 'png-diff-heatmap'
  | 'png-diff-heatmap-placeholder';

export interface MaterializedArtifactChecksum {
  algorithm: 'fnv1a32-stable' | 'source-provided';
  value: string;
}

export interface MaterializedArtifactCoordinateSpace {
  space: 'normalized-image' | 'pixel-grid';
  width: number;
  height: number;
  origin: 'top-left';
}

export interface MaterializedArtifactLineage {
  sourceArtifactId?: string;
  sourceImageId?: string;
  sourceSampleId?: string;
  generatedBy: 'materialized-dataset-writer' | 'build-training-dataset-cli' | 'fixture';
}

export interface MaterializedArtifactLinkBase {
  artifactId: string;
  sampleId?: string;
  imageId?: string;
  regionId?: CosmeticSegmentationTarget;
  artifactType: 'image-pixel' | 'mask' | 'diff';
  format: MaterializedArtifactFormat;
  relativePath: string;
  checksum: MaterializedArtifactChecksum;
  width: number;
  height: number;
  coordinateSpace: MaterializedArtifactCoordinateSpace;
  source: string;
  lineage: MaterializedArtifactLineage;
  codecKind?: 'json' | 'raw-rgba' | 'binary-alpha' | 'png';
  codecVersion?: string;
  compression?: 'none' | 'png-deflate-placeholder';
  quantization?: 'none' | 'uint8-alpha';
  alphaEncoding?: 'float-alpha-grid' | 'uint8-alpha';
  colorSpace?: 'srgb';
  alphaMode?: 'straight-alpha' | 'opaque';
  channels?: 3 | 4;
  codecMetadataReference?: string;
  sidecarMetadataReference?: string;
  pngAlphaMaskSidecarReference?: string;
  sourceAlphaGridChecksum?: string;
  sourceBinaryMaskChecksum?: string;
}

export interface MaterializedImageArtifactLink extends MaterializedArtifactLinkBase {
  artifactType: 'image-pixel';
  imageId: string;
}

export interface MaterializedMaskArtifactLink extends MaterializedArtifactLinkBase {
  artifactType: 'mask';
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
}

export interface MaterializedDiffArtifactLink extends MaterializedArtifactLinkBase {
  artifactType: 'diff';
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
}

export type MaterializedArtifactLink =
  | MaterializedImageArtifactLink
  | MaterializedMaskArtifactLink
  | MaterializedDiffArtifactLink;

export interface MaterializedArtifactManifest {
  schemaVersion: typeof MATERIALIZED_DATASET_SCHEMA_VERSION;
  datasetId: string;
  createdAt: string;
  artifactLinks: MaterializedArtifactLink[];
}

export interface MaterializedMaskFile {
  maskFileId: string;
  artifactId: string;
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  artifactKind: 'original_mask' | 'human_edited_mask';
  relativePath: string;
  portableUri: string;
  checksum: string;
}

export interface MaterializedDiffFile {
  diffFileId: string;
  artifactId: string;
  sampleId: string;
  regionId: CosmeticSegmentationTarget;
  relativePath: string;
  portableUri: string;
  checksum: string;
}

export interface MaterializedSplitFile {
  splitFileId: string;
  split: Extract<DatasetSplit, 'train' | 'validation' | 'test'>;
  relativePath: string;
  portableUri: string;
  checksum: string;
  sampleCount: number;
}

export interface MaterializedDatasetEntry {
  entryId: string;
  sampleId: string;
  imageId: string;
  templateId: string;
  split: DatasetSplit;
  regionId: CosmeticSegmentationTarget;
  qualityScore: number;
  sampleWeight: number;
  imageFileId: string;
  originalMaskFileId: string;
  humanEditedMaskFileId: string;
  diffFileId: string;
  relativePaths: {
    image: string;
    imagePixel?: string;
    originalMask: string;
    humanEditedMask: string;
    diffHeatmap: string;
  };
  portableUris: {
    image: string;
    imagePixel?: string;
    originalMask: string;
    humanEditedMask: string;
    diffHeatmap: string;
  };
}

export interface MaterializedDatasetValidationResult {
  schemaVersion: typeof MATERIALIZED_DATASET_SCHEMA_VERSION;
  valid: boolean;
  checkedAt: string;
  errors: string[];
  warnings: string[];
  summary: {
    entryCount: number;
    imageFileCount: number;
    imagePixelFileCount?: number;
    maskFileCount: number;
    diffFileCount: number;
    splitFileCount: number;
    checksumMismatchCount: number;
    absolutePathLeakCount: number;
    splitCompleteness: Record<'train' | 'validation' | 'test', boolean>;
    missingArtifactLinkCount: number;
  };
}

export interface MaterializedDatasetManifest {
  datasetId: string;
  schemaVersion: typeof MATERIALIZED_DATASET_SCHEMA_VERSION;
  sourcePackageId: string;
  datasetVersion: string;
  createdAt: string;
  rootDir: string;
  entries: MaterializedDatasetEntry[];
  imageFiles: MaterializedImageFile[];
  imagePixelFiles?: MaterializedImagePixelFile[];
  artifactManifestPath?: string;
  artifactLinks?: MaterializedArtifactLink[];
  pngImageArtifactReference?: string;
  pngImageSidecarReference?: string;
  imageCodecMetadataReference?: string;
  pngAlphaMaskArtifactReference?: string;
  pngAlphaMaskSidecarReference?: string;
  pngDiffHeatmapArtifactReference?: string;
  codecMetadataReference?: string;
  maskFiles: MaterializedMaskFile[];
  diffFiles: MaterializedDiffFile[];
  splitFiles: MaterializedSplitFile[];
  manifestPath: string;
  packagePath: string;
  auditReportPath: string;
  checksumsPath: string;
  validationResult: MaterializedDatasetValidationResult;
}

export interface MaterializedTrainingDataset extends MaterializedDatasetManifest {
  packagePath: string;
  auditReportPath: string;
  checksumsPath: string;
}

export interface MaterializedDatasetBuildOptions {
  outputRootDir: string;
  createdAt?: string;
  allowAbsolutePaths?: boolean;
  pretty?: boolean;
  strict?: boolean;
  dryRun?: boolean;
  validateOnly?: boolean;
}
