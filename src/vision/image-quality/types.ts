export const IMAGE_QUALITY_SCHEMA_VERSION = 'image-quality-v0.1' as const;

export type ImageQualityDecision =
  | 'usable'
  | 'needs_review'
  | 'reject_source_image';

export interface ImageQualityAssessment {
  schemaVersion: typeof IMAGE_QUALITY_SCHEMA_VERSION;
  imageId: string;
  resolutionScore: number;
  faceVisibilityScore: number;
  lightingScore: number;
  blurRiskScore: number;
  compressionRiskScore: number;
  occlusionRiskScore: number;
  overallImageQualityScore: number;
  suggestedDecision: ImageQualityDecision;
  reasons: string[];
}

export interface ImageQualityInput {
  imageId: string;
  width?: number;
  height?: number;
  faceConfidence?: number;
  faceCoverageRatio?: number;
  debugSignals?: readonly string[];
}
