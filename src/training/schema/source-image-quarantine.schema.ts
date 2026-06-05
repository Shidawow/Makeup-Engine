export const SOURCE_IMAGE_QUARANTINE_SCHEMA_VERSION = 'source-image-quarantine-v0.1';

export type SourceImageQuarantineReason =
  | 'binary-read-failed'
  | 'unknown-file-kind'
  | 'png-decode-failed'
  | 'png-filter-unsupported'
  | 'png-color-type-unsupported'
  | 'png-interlace-unsupported'
  | 'jpeg-decode-unsupported'
  | 'jpeg-decode-failed'
  | 'exif-orientation-unsupported'
  | 'source-image-too-small'
  | 'source-image-too-dark'
  | 'source-image-too-bright'
  | 'source-image-low-contrast'
  | 'source-image-blank'
  | 'source-image-transparent'
  | 'source-image-quality-blocked'
  | 'source-image-manifest-invalid';

export interface QuarantinedSourceImage {
  sourceImageId: string;
  fileName: string;
  checksum?: string;
  reasons: SourceImageQuarantineReason[];
  severity: 'warning' | 'blocking';
  notes: string[];
}

export interface SourceImageQuarantine {
  schemaVersion: typeof SOURCE_IMAGE_QUARANTINE_SCHEMA_VERSION;
  packageId: string;
  createdAt: string;
  items: QuarantinedSourceImage[];
  blockingCount: number;
  warningCount: number;
}
