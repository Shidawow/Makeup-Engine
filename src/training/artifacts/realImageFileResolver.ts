import type {
  ImagePixelArtifact,
  ImagePixelArtifactFormat,
} from '../schema/image-pixel-artifact.schema';
import { createImagePixelArtifactFromRgbaGrid, validateImagePixelArtifact } from './imagePixelResolver';

export type RealImageFileReferenceKind =
  | 'json-rgba-grid'
  | 'raw-rgba-binary'
  | 'png-image'
  | 'jpeg-image';

export interface RealImageFileReference {
  referenceId: string;
  imageId: string;
  kind: RealImageFileReferenceKind;
  relativePath: string;
  portableUri: string;
  checksum: string;
  width?: number;
  height?: number;
}

export interface RealImageFileValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RealImageFileResolveResult {
  reference: RealImageFileReference;
  supported: boolean;
  pixelArtifact?: ImagePixelArtifact;
  validation: RealImageFileValidationResult;
}

const isAbsolutePathLike = (path: string): boolean =>
  /^[A-Za-z]:[\\/]/.test(path) || path.startsWith('/') || path.startsWith('\\\\');

export const validateRealImageFileReference = (
  reference: RealImageFileReference,
): RealImageFileValidationResult => {
  const errors = [
    ...(reference.referenceId.length === 0 ? ['referenceId is required'] : []),
    ...(reference.imageId.length === 0 ? ['imageId is required'] : []),
    ...(isAbsolutePathLike(reference.relativePath) ? ['absolute paths are not allowed'] : []),
    ...(!reference.portableUri.startsWith('materialized://') && !reference.portableUri.startsWith('portable://')
      ? ['portableUri must be portable']
      : []),
  ];
  const warnings = ['png-image', 'jpeg-image'].includes(reference.kind)
    ? [`${reference.kind} is a placeholder boundary and is not decoded in Phase 6E`]
    : [];
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const createImagePixelArtifactFromRawRgba = (input: {
  artifactId?: string;
  imageId: string;
  width: number;
  height: number;
  values: readonly number[];
  sourceImageReference: string;
  createdAt?: string;
}): ImagePixelArtifact => {
  const normalizedValues = input.values.map((value) => Math.max(0, Math.min(1, value)));
  return createImagePixelArtifactFromRgbaGrid({
    artifactId: input.artifactId ?? `pixel-${input.imageId}`,
    imageId: input.imageId,
    width: input.width,
    height: input.height,
    values: normalizedValues,
    sourceImageReference: input.sourceImageReference,
    createdAt: input.createdAt ?? '1970-01-01T00:00:00.000Z',
  });
};

export const resolveRealImageFileReference = (input: {
  reference: RealImageFileReference;
  artifact?: ImagePixelArtifact;
}): RealImageFileResolveResult => {
  const validation = validateRealImageFileReference(input.reference);
  if (input.reference.kind === 'png-image' || input.reference.kind === 'jpeg-image') {
    return {
      reference: input.reference,
      supported: false,
      validation: {
        ...validation,
        valid: false,
        errors: [...validation.errors, `${input.reference.kind} decoding is unsupported`],
      },
    };
  }
  if (!input.artifact) {
    return {
      reference: input.reference,
      supported: input.reference.kind === 'json-rgba-grid' || input.reference.kind === 'raw-rgba-binary',
      validation: {
        ...validation,
        valid: false,
        errors: [...validation.errors, 'pixel artifact payload is required'],
      },
    };
  }
  const artifactIssues = validateImagePixelArtifact(input.artifact);
  const supportedFormats: ImagePixelArtifactFormat[] = ['json-rgba-grid', 'json-rgb-grid'];
  return {
    reference: input.reference,
    supported: supportedFormats.includes(input.artifact.format),
    pixelArtifact: input.artifact,
    validation: {
      valid: validation.valid && artifactIssues.errors.length === 0 && supportedFormats.includes(input.artifact.format),
      errors: [
        ...validation.errors,
        ...artifactIssues.errors,
        ...(supportedFormats.includes(input.artifact.format) ? [] : [`unsupported pixel artifact format:${input.artifact.format}`]),
      ],
      warnings: [...validation.warnings, ...artifactIssues.warnings],
    },
  };
};

export const summarizeRealImageFileReference = (
  result: RealImageFileResolveResult,
): string =>
  `${result.reference.imageId}:${result.reference.kind}:supported=${result.supported}:valid=${result.validation.valid}`;
