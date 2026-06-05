import { stableStringify } from '../../templates/storage/datasetExport';
import type { ExportRuntimeTarget } from '../schema/export-ready-model-package.schema';
import type { LightweightSegmentationClassifier } from '../schema';

export interface ExportBlockingIssue {
  code: string;
  message: string;
}

export interface OnnxExportPreparation {
  target: 'onnx-placeholder';
  ready: false;
  requiredInputs: string[];
  requiredOutputs: string[];
  blockingIssues: ExportBlockingIssue[];
}

export interface WebGpuExportPreparation {
  target: 'webgpu-placeholder';
  ready: false;
  tensorLayout: 'nhwc-placeholder';
  blockingIssues: ExportBlockingIssue[];
}

export interface MobileExportPreparation {
  target: 'mobile-placeholder';
  ready: false;
  quantization: 'uint8-placeholder';
  packageSpec: 'mobile-runtime-placeholder';
  blockingIssues: ExportBlockingIssue[];
}

export interface ExportPreparationManifest {
  schemaVersion: 'export-preparation-manifest-v0.1';
  modelId: string;
  targets: ExportRuntimeTarget[];
  sourceImageCodecReadiness: 'ready' | 'warning' | 'blocked';
  sourceImagePackageCompatibility: 'not-provided' | 'compatible' | 'blocked';
  realPhotoImportReadiness: 'ready' | 'warning' | 'blocked';
  jpegBoundaryStatus: 'metadata-only' | 'not-applicable';
  pngCodecSupportSummary: string;
  onnx: OnnxExportPreparation;
  webgpu: WebGpuExportPreparation;
  mobile: MobileExportPreparation;
  readiness: 'preparation-only' | 'blocked';
}

export const createExportPreparationManifest = (input: {
  model: LightweightSegmentationClassifier;
  targets: ExportRuntimeTarget[];
}): ExportPreparationManifest => ({
  schemaVersion: 'export-preparation-manifest-v0.1',
  modelId: input.model.modelId,
  targets: [...input.targets].sort(),
  sourceImageCodecReadiness: 'ready',
  sourceImagePackageCompatibility: 'not-provided',
  realPhotoImportReadiness: 'warning',
  jpegBoundaryStatus: 'metadata-only',
  pngCodecSupportSummary: 'png-support:8-bit non-interlaced color types 0,2,6; filters 0-4; stored-deflate project codec',
  onnx: {
    target: 'onnx-placeholder',
    ready: false,
    requiredInputs: ['pixel_feature_matrix', 'region_id'],
    requiredOutputs: ['alpha_grid'],
    blockingIssues: [{ code: 'onnx-export-not-implemented', message: 'Phase 6F does not export real ONNX artifacts' }],
  },
  webgpu: {
    target: 'webgpu-placeholder',
    ready: false,
    tensorLayout: 'nhwc-placeholder',
    blockingIssues: [{ code: 'webgpu-export-not-implemented', message: 'Phase 6F does not export WebGPU binaries' }],
  },
  mobile: {
    target: 'mobile-placeholder',
    ready: false,
    quantization: 'uint8-placeholder',
    packageSpec: 'mobile-runtime-placeholder',
    blockingIssues: [{ code: 'mobile-export-not-implemented', message: 'Phase 6F does not export mobile runtime binaries' }],
  },
  readiness: 'preparation-only',
});

export const validateExportPreparationReadiness = (
  manifest: ExportPreparationManifest,
): ExportBlockingIssue[] => [
  ...manifest.onnx.blockingIssues,
  ...manifest.webgpu.blockingIssues,
  ...manifest.mobile.blockingIssues,
];

export const summarizeExportPreparationManifest = (
  manifest: ExportPreparationManifest,
): string =>
  `export-preparation:${manifest.modelId}:targets=${manifest.targets.join(',')}:readiness=${manifest.readiness}`;

export const exportPreparationManifestJson = (
  manifest: ExportPreparationManifest,
): string => stableStringify(manifest);
