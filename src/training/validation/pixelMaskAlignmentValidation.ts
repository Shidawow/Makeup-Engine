import type { ImagePixelData } from '../schema/image-pixel-artifact.schema';
import type { LoadedTrainingSample, TrainingBridgeValidationIssue } from '../schema';
import type { TrainingMaskTensor } from '../tensors';
import type { BinaryMaskBlob } from '../artifacts/maskMaterializer';
import { validateBinaryMaskArtifact } from '../artifacts/maskMaterializer';
import type { RawRgbaBinaryArtifact } from '../artifacts/rawRgbaImageMaterializer';
import { validateRawRgbaBinaryArtifact } from '../artifacts/rawRgbaImageMaterializer';
import type { MaterializedArtifactManifest, MaterializedArtifactLink } from '../../templates/schema';

export interface PixelMaskAlignmentResult {
  valid: boolean;
  errors: TrainingBridgeValidationIssue[];
  warnings: TrainingBridgeValidationIssue[];
  summary: {
    sampleId: string;
    imageId: string;
    regionId: string;
    pixelSize: string;
    maskSize: string;
  };
}

const makeIssue = (
  code: string,
  message: string,
  severity: TrainingBridgeValidationIssue['severity'] = 'error',
  sampleId?: string,
): TrainingBridgeValidationIssue => ({ code, message, severity, sampleId });

export const validatePixelMaskDimensions = (input: {
  image: ImagePixelData;
  mask: TrainingMaskTensor;
  sampleId?: string;
}): TrainingBridgeValidationIssue[] => [
  ...(input.image.width !== input.mask.width || input.image.height !== input.mask.height
    ? [
        makeIssue(
          'pixel-mask-dimensions-mismatch',
          `pixel ${input.image.width}x${input.image.height} does not match mask ${input.mask.width}x${input.mask.height}`,
          'error',
          input.sampleId,
        ),
      ]
    : []),
  ...(input.image.pixels.length !== input.image.width * input.image.height
    ? [makeIssue('pixel-grid-size-invalid', 'pixel grid length must match width * height', 'error', input.sampleId)]
    : []),
  ...(input.mask.values.length !== input.mask.width * input.mask.height
    ? [makeIssue('mask-grid-size-invalid', 'mask grid length must match width * height', 'error', input.sampleId)]
    : []),
];

export const validatePixelMaskCoordinateSpace = (input: {
  mask: TrainingMaskTensor;
  sampleId?: string;
}): TrainingBridgeValidationIssue[] => {
  const bounds = input.mask.bounds;
  if (!bounds) return [];
  const valid =
    bounds.x >= 0 &&
    bounds.y >= 0 &&
    bounds.width >= 0 &&
    bounds.height >= 0 &&
    bounds.x + bounds.width <= 1.0001 &&
    bounds.y + bounds.height <= 1.0001;
  return valid
    ? []
    : [makeIssue('pixel-mask-bounds-invalid', 'mask bounds must stay within normalized image coordinates', 'error', input.sampleId)];
};

export const validatePixelMaskRegionBounds = validatePixelMaskCoordinateSpace;

export const validatePixelMaskArtifactCompatibility = (input: {
  image: ImagePixelData;
  mask: TrainingMaskTensor;
  sampleId?: string;
  binaryMask?: BinaryMaskBlob;
}): TrainingBridgeValidationIssue[] => [
  ...validatePixelMaskDimensions(input),
  ...validatePixelMaskCoordinateSpace(input),
  ...(input.binaryMask ? validateBinaryMaskArtifact(input.binaryMask) : []),
];

export const validateTrainingSamplePixelMaskAlignment = (input: {
  sample: LoadedTrainingSample;
  image: ImagePixelData;
  mask: TrainingMaskTensor;
  binaryMask?: BinaryMaskBlob;
}): PixelMaskAlignmentResult => {
  const issues = validatePixelMaskArtifactCompatibility({
    image: input.image,
    mask: input.mask,
    sampleId: input.sample.sampleId,
    binaryMask: input.binaryMask,
  });
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      sampleId: input.sample.sampleId,
      imageId: input.sample.imageId,
      regionId: input.sample.regionId,
      pixelSize: `${input.image.width}x${input.image.height}`,
      maskSize: `${input.mask.width}x${input.mask.height}`,
    },
  };
};

export const summarizePixelMaskAlignment = (
  results: readonly PixelMaskAlignmentResult[],
): string =>
  `pixel-mask-alignment:valid=${results.filter((result) => result.valid).length}/${results.length}:errors=${results.reduce((sum, result) => sum + result.errors.length, 0)}`;

export const validateCoordinateSpaceConsistency = (
  links: readonly MaterializedArtifactLink[],
): TrainingBridgeValidationIssue[] =>
  links
    .filter((link) => link.coordinateSpace.origin !== 'top-left')
    .map((link) =>
      makeIssue('coordinate-space-mismatch', `coordinate space origin mismatch:${link.artifactId}`),
    );

export const validateRawRgbaMaskCompatibility = (input: {
  raw: RawRgbaBinaryArtifact;
  mask: BinaryMaskBlob;
  sampleId?: string;
}): TrainingBridgeValidationIssue[] => [
  ...validateRawRgbaBinaryArtifact(input.raw).map((message) =>
    makeIssue('raw-rgba-invalid', message, 'error', input.sampleId),
  ),
  ...validateBinaryMaskArtifact(input.mask),
  ...(input.raw.width !== input.mask.width || input.raw.height !== input.mask.height
    ? [makeIssue('pixel-mask-alignment-failed', 'raw RGBA and binary mask dimensions differ', 'error', input.sampleId)]
    : []),
];

export const validatePngMaskCompatibility = (): TrainingBridgeValidationIssue[] => [
  makeIssue('png-mask-codec-ready', 'PNG alpha mask compatibility is available for grayscale uint8 mask artifacts', 'warning'),
];

export const validatePngImageMaskCodecAlignment = (input: {
  imageWidth: number;
  imageHeight: number;
  maskWidth: number;
  maskHeight: number;
  imageId?: string;
  sampleId?: string;
}): TrainingBridgeValidationIssue[] => [
  ...(input.imageWidth !== input.maskWidth || input.imageHeight !== input.maskHeight
    ? [
      makeIssue(
        'image-mask-codec-mismatch',
        `png image ${input.imageWidth}x${input.imageHeight} does not match png mask ${input.maskWidth}x${input.maskHeight}${input.imageId ? ` for ${input.imageId}` : ''}`,
        'error',
        input.sampleId,
      ),
    ]
    : []),
];

export const validateRegionBoundsAgainstPixelGrid = (input: {
  bounds: { x: number; y: number; width: number; height: number } | null;
  sampleId?: string;
}): TrainingBridgeValidationIssue[] => {
  const bounds = input.bounds;
  if (!bounds) return [];
  return bounds.x >= 0 &&
    bounds.y >= 0 &&
    bounds.width >= 0 &&
    bounds.height >= 0 &&
    bounds.x + bounds.width <= 1.0001 &&
    bounds.y + bounds.height <= 1.0001
    ? []
    : [makeIssue('region-bounds-invalid', 'region bounds must stay inside the pixel grid', 'error', input.sampleId)];
};

export const validateArtifactManifestAlignment = (
  manifest: MaterializedArtifactManifest,
): TrainingBridgeValidationIssue[] => [
  ...validateCoordinateSpaceConsistency(manifest.artifactLinks),
  ...manifest.artifactLinks
    .filter((link) => link.width <= 0 || link.height <= 0)
    .map((link) => makeIssue('artifact-manifest-link-invalid', `artifact dimensions invalid:${link.artifactId}`)),
  ...manifest.artifactLinks
    .filter((link) => link.checksum.value.length === 0)
    .map((link) => makeIssue('artifact-manifest-checksum-mismatch', `artifact checksum missing:${link.artifactId}`)),
];

export const validateAllTrainingArtifactAlignment = (input: {
  manifest: MaterializedArtifactManifest;
}): {
  readiness: 'pass' | 'warning' | 'fail';
  issues: TrainingBridgeValidationIssue[];
  summary: string;
} => {
  const issues = validateArtifactManifestAlignment(input.manifest);
  const readiness = issues.some((issue) => issue.severity === 'error')
    ? 'fail'
    : issues.length > 0
      ? 'warning'
      : 'pass';
  return {
    readiness,
    issues,
    summary: `artifact-alignment:${readiness}:links=${input.manifest.artifactLinks.length}:issues=${issues.length}`,
  };
};
