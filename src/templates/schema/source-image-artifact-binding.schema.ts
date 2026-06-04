export const SOURCE_IMAGE_ARTIFACT_BINDING_SCHEMA_VERSION =
  'source-image-artifact-binding-v0.1' as const;

export type SourceImageArtifactKind =
  | 'normalized-png'
  | 'raw-rgba'
  | 'json-rgba'
  | 'unknown';

export type SourceImageArtifactBindingStatus =
  | 'unbound'
  | 'bound'
  | 'validated'
  | 'mismatch'
  | 'unsupported'
  | 'failed';

export interface SourceImageArtifactBindingIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export interface BrowserArtifactImageData {
  width: number;
  height: number;
  channels: 4;
  data: readonly number[];
}

export interface BrowserArtifactResource {
  resourceId: string;
  artifactKind: SourceImageArtifactKind;
  browserResourceKind:
    | 'object-url'
    | 'generated-preview-data-url'
    | 'image-data'
    | 'summary-only';
  browserReadable: boolean;
  summaryOnly: boolean;
  objectUrl?: string;
  previewUrl?: string;
  imageDataReference?: string;
  imageData?: BrowserArtifactImageData;
}

export interface SourceImageArtifactBinding {
  schemaVersion: typeof SOURCE_IMAGE_ARTIFACT_BINDING_SCHEMA_VERSION;
  bindingId: string;
  sourceImageId: string;
  sourceImagePackageId: string;
  manifestArtifactReference: string;
  artifactKind: SourceImageArtifactKind;
  originalReferencePath: string;
  browserResourceKind: BrowserArtifactResource['browserResourceKind'];
  browserResource?: BrowserArtifactResource;
  objectUrl?: string;
  fileName: string;
  fileSize: number;
  fileChecksum: string;
  width?: number;
  height?: number;
  colorSpace?: 'srgb' | 'unknown';
  channels?: number;
  status: SourceImageArtifactBindingStatus;
  issues: readonly SourceImageArtifactBindingIssue[];
  createdAt: string;
}

export type SourceImageArtifactBindingMap = Record<
  string,
  SourceImageArtifactBinding
>;

export interface ArtifactBindingValidationResult {
  valid: boolean;
  status: SourceImageArtifactBindingStatus;
  issues: readonly SourceImageArtifactBindingIssue[];
}

