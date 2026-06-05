import type { CosmeticSegmentationTarget } from '../../vision';
import type { LightweightClassifierKind } from './lightweight-classifier.schema';

export const EXPORT_READY_MODEL_PACKAGE_SCHEMA_VERSION = 'export-ready-model-package-v0.1' as const;

export type ExportRuntimeTarget =
  | 'typescript-provider'
  | 'browser-provider'
  | 'node-provider'
  | 'onnx-placeholder'
  | 'webgpu-placeholder'
  | 'mobile-placeholder';

export type ExportModelReadinessStatus =
  | 'export-ready-typescript-provider'
  | 'export-ready-browser-provider'
  | 'export-preparation-only'
  | 'blocked-by-artifact-alignment'
  | 'blocked-by-region-coverage'
  | 'blocked-by-provider-compatibility';

export interface ExportRuntimeCompatibility {
  target: ExportRuntimeTarget;
  supported: boolean;
  notes: string[];
}

export type ExportPixelFormat = 'json-rgba-grid' | 'raw-rgba-binary' | 'png-image';

export interface ExportModelInputSpec {
  requiresPixelData: boolean;
  pixelFormat: ExportPixelFormat;
  featureNames: string[];
}

export interface SourceImageExportReadiness {
  sourceImageCodecReadiness: 'ready' | 'warning' | 'blocked';
  sourceImagePackageCompatibility: 'compatible' | 'not-provided' | 'blocked';
  realPhotoImportReadiness: 'ready' | 'warning' | 'blocked';
  jpegBoundaryStatus: 'metadata-only' | 'not-applicable';
  pngCodecSupportSummary: string;
}

export interface ExportModelOutputSpec {
  outputType: 'CosmeticSegmentationMask';
  alphaFormat: 'float-alpha-grid';
  coordinateSpace: 'normalized-image';
}

export interface ExportProviderCompatibility {
  providerId: string;
  compatible: boolean;
  supportedRegions: CosmeticSegmentationTarget[];
  fallbackPolicy: 'polygon-refinement' | 'none';
  issues: string[];
}

export interface ExportModelLineage {
  sourceDatasetId: string;
  sourcePackageId: string;
  trainingRunId: string;
  sourceModelId: string;
}

export interface ExportReadyModelEntry {
  entryId: string;
  relativePath: string;
  checksum: string;
  artifactType: 'model' | 'provider-spec' | 'runtime-compatibility' | 'export-preparation' | 'readme';
}

export interface ExportReadyModelPackageManifest {
  packageId: string;
  schemaVersion: typeof EXPORT_READY_MODEL_PACKAGE_SCHEMA_VERSION;
  entries: ExportReadyModelEntry[];
}

export interface ExportReadyModelPackage {
  schemaVersion: typeof EXPORT_READY_MODEL_PACKAGE_SCHEMA_VERSION;
  packageId: string;
  packageVersion: string;
  sourceModelId: string;
  sourceModelVersion: string;
  modelKind: 'lightweight-segmentation-classifier';
  classifierKind: LightweightClassifierKind;
  artifactFormat: 'lightweight-classifier-json';
  inputSpec: ExportModelInputSpec;
  outputSpec: ExportModelOutputSpec;
  featureSpec: {
    featureNames: string[];
  };
  regionSpec: {
    trainedRegions: CosmeticSegmentationTarget[];
  };
  runtimeCompatibility: ExportRuntimeCompatibility[];
  providerCompatibility: ExportProviderCompatibility;
  lineage: ExportModelLineage;
  checksums: Record<string, string>;
  sourceImageReadiness?: SourceImageExportReadiness;
  readinessStatus: ExportModelReadinessStatus;
  createdAt: string;
}
