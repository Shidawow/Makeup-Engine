export const SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION = 'source-image-package-v0.1';

export type SourceImageOrientation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'missing' | 'unsupported';

export type SourceImageImportStatus =
  | 'imported'
  | 'normalized'
  | 'ready_for_template_analysis'
  | 'blocked_by_codec'
  | 'blocked_by_quality'
  | 'failed';

export type SourceImageReadiness = 'ready' | 'warning' | 'blocked';

export interface SourceImageImportIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export interface SourceImageArtifactLink {
  kind: 'original' | 'normalized-png' | 'raw-rgba' | 'json-rgba' | 'report';
  uri: string;
  checksum?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface SourceImageCodecReport {
  originalKind: 'png' | 'jpeg' | 'json' | 'raw-rgba-binary' | 'unknown';
  pngCodecReadiness: 'ready' | 'blocked' | 'not-applicable';
  jpegBoundaryStatus: 'metadata-only' | 'not-applicable';
  decoded: boolean;
  issueCodes: string[];
}

export interface SourceImageQualityReport {
  readiness: SourceImageReadiness;
  qualityScore: number;
  width: number;
  height: number;
  brightness: number;
  contrast: number;
  colorVariance: number;
  alphaCoverage: number;
  issueCodes: string[];
}

export interface SourceImageLineage {
  importedBy: 'source-image-import-cli' | 'source-image-import-pipeline';
  sourceUri: string;
  normalizedFromChecksum: string;
}

export interface SourceImageEntry {
  sourceImageId: string;
  originalFileName: string;
  originalFileChecksum: string;
  originalFileKind: SourceImageCodecReport['originalKind'];
  decodedWidth: number;
  decodedHeight: number;
  colorSpace: 'srgb' | 'unknown';
  channels: number;
  orientation: SourceImageOrientation;
  normalizedArtifactLinks: SourceImageArtifactLink[];
  codecReport: SourceImageCodecReport;
  qualityReport: SourceImageQualityReport;
  lineage: SourceImageLineage;
  importStatus: SourceImageImportStatus;
  createdAt: string;
}

export interface SourceImageManifest {
  schemaVersion: typeof SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION;
  packageId: string;
  createdAt: string;
  entries: SourceImageEntry[];
  readiness: SourceImageReadiness;
  issueCodes: string[];
}

export interface SourceImagePackage {
  schemaVersion: typeof SOURCE_IMAGE_PACKAGE_SCHEMA_VERSION;
  packageId: string;
  rootDir: string;
  createdAt: string;
  manifestPath: string;
  checksumsPath: string;
  reportPath: string;
  quarantinePath: string;
  manifest: SourceImageManifest;
}
