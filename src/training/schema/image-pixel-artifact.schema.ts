export const IMAGE_PIXEL_ARTIFACT_SCHEMA_VERSION =
  'image-pixel-artifact-v0.1' as const;

export type ImagePixelArtifactFormat =
  | 'json-rgba-grid'
  | 'json-rgb-grid'
  | 'png-image'
  | 'browser-image-data-placeholder'
  | 'png-image-placeholder'
  | 'jpeg-image-placeholder';

export interface ImagePixelGrid {
  width: number;
  height: number;
  channels: 3 | 4;
  values: number[];
}

export interface ImagePixelData {
  width: number;
  height: number;
  colorSpace: 'srgb';
  pixels: Array<{ r: number; g: number; b: number; a: number }>;
}

export interface ImagePixelArtifactMetadata {
  source: 'synthetic-fixture' | 'materialized-image-reference' | 'browser-placeholder';
  notes: string[];
}

export interface ImagePixelArtifact {
  artifactId: string;
  schemaVersion: typeof IMAGE_PIXEL_ARTIFACT_SCHEMA_VERSION;
  imageId: string;
  width: number;
  height: number;
  format: ImagePixelArtifactFormat;
  colorSpace: 'srgb';
  pixels: ImagePixelGrid | null;
  checksum: string;
  sourceImageReference: string;
  createdAt: string;
  metadata: ImagePixelArtifactMetadata;
}

export interface ImagePixelArtifactReference {
  artifactId: string;
  imageId: string;
  relativePath: string;
  portableUri: string;
  checksum: string;
  format: ImagePixelArtifactFormat;
}

export interface ImagePixelArtifactValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
