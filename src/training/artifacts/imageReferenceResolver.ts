import type { OfflineImageReference } from '../../templates/schema';

export type TrainingImageReferenceKind =
  | 'metadata-only'
  | 'local-file-placeholder'
  | 'object-storage-placeholder'
  | 'data-uri-placeholder';

export interface ImageReferenceResolveOptions {
  kind?: TrainingImageReferenceKind;
  allowAbsolutePaths?: boolean;
}

export interface ResolvedTrainingImageReference {
  imageReferenceId: string;
  imageId: string;
  kind: TrainingImageReferenceKind;
  portableUri: string;
  relativePath: string | null;
  checksum: string;
}

export interface ImageReferenceValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const isAbsolute = (value: string): boolean =>
  /^[A-Za-z]:[\\/]/.test(value) || value.startsWith('/') || value.startsWith('\\\\');

export const resolveTrainingImageReference = (
  reference: OfflineImageReference,
  options: ImageReferenceResolveOptions = {},
): ResolvedTrainingImageReference => ({
  imageReferenceId: reference.imageReferenceId,
  imageId: reference.imageId,
  kind: options.kind ?? 'metadata-only',
  portableUri: reference.referenceUri,
  relativePath: reference.referenceUri.startsWith('offline://images/')
    ? `images/${reference.imageReferenceId}.json`
    : null,
  checksum: reference.checksum,
});

export const validateTrainingImageReference = (
  resolved: ResolvedTrainingImageReference,
  options: ImageReferenceResolveOptions = {},
): ImageReferenceValidationResult => {
  const errors = [
    ...(resolved.checksum.length === 0 ? ['missing image checksum'] : []),
    ...(resolved.relativePath && isAbsolute(resolved.relativePath) && !options.allowAbsolutePaths
      ? ['absolute image path is not allowed']
      : []),
  ];

  return {
    valid: errors.length === 0,
    errors,
    warnings:
      resolved.kind === 'metadata-only'
        ? ['image pixels are not loaded in Phase 6B']
        : [],
  };
};

export const summarizeTrainingImageReference = (
  resolved: ResolvedTrainingImageReference,
): string =>
  `${resolved.kind}:${resolved.imageId}:${resolved.relativePath ?? resolved.portableUri}`;
