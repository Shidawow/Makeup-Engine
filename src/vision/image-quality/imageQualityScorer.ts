import {
  IMAGE_QUALITY_SCHEMA_VERSION,
  type ImageQualityAssessment,
  type ImageQualityInput,
} from './types';

const round4 = (value: number): number => Number(value.toFixed(4));

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const resolutionScore = (width?: number, height?: number): number => {
  if (!width || !height) {
    return 0.72;
  }

  const pixels = width * height;

  if (pixels >= 1024 * 1024) {
    return 1;
  }

  if (pixels >= 640 * 640) {
    return 0.82;
  }

  if (pixels >= 384 * 384) {
    return 0.62;
  }

  return 0.38;
};

export const assessImageQuality = (
  input: ImageQualityInput,
): ImageQualityAssessment => {
  const resolution = resolutionScore(input.width, input.height);
  const faceVisibilityScore = clamp01(
    (input.faceConfidence ?? 0.78) * 0.72 +
      Math.min(1, (input.faceCoverageRatio ?? 0.32) / 0.32) * 0.28,
  );
  const debugSignals = input.debugSignals ?? [];
  const lightingScore = debugSignals.includes('underexposed') ? 0.42 : 0.82;
  const blurRiskScore = debugSignals.includes('blur-risk') ? 0.72 : 0.18;
  const compressionRiskScore = debugSignals.includes('compression-risk') ? 0.68 : 0.2;
  const occlusionRiskScore = debugSignals.includes('occlusion-risk') ? 0.74 : 0.16;
  const overallImageQualityScore = round4(
    clamp01(
      resolution * 0.26 +
        faceVisibilityScore * 0.28 +
        lightingScore * 0.18 +
        (1 - blurRiskScore) * 0.1 +
        (1 - compressionRiskScore) * 0.08 +
        (1 - occlusionRiskScore) * 0.1,
    ),
  );
  const reasons = [
    ...(resolution < 0.6 ? ['low_resolution'] : []),
    ...(faceVisibilityScore < 0.62 ? ['face_visibility_risk'] : []),
    ...(lightingScore < 0.55 ? ['lighting_risk'] : []),
    ...(blurRiskScore > 0.6 ? ['blur_risk'] : []),
    ...(compressionRiskScore > 0.6 ? ['compression_risk'] : []),
    ...(occlusionRiskScore > 0.6 ? ['occlusion_risk'] : []),
  ].sort();
  const suggestedDecision =
    overallImageQualityScore < 0.5
      ? 'reject_source_image'
      : overallImageQualityScore < 0.68
        ? 'needs_review'
        : 'usable';

  return {
    schemaVersion: IMAGE_QUALITY_SCHEMA_VERSION,
    imageId: input.imageId,
    resolutionScore: round4(resolution),
    faceVisibilityScore: round4(faceVisibilityScore),
    lightingScore: round4(lightingScore),
    blurRiskScore: round4(blurRiskScore),
    compressionRiskScore: round4(compressionRiskScore),
    occlusionRiskScore: round4(occlusionRiskScore),
    overallImageQualityScore,
    suggestedDecision,
    reasons,
  };
};
