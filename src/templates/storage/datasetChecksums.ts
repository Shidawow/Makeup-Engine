import { stableStringify } from './datasetExport';

export const DATASET_CHECKSUMS_SCHEMA_VERSION =
  'dataset-checksums-v0.1' as const;

export interface DatasetChecksumFileInput {
  path: string;
  content: string;
}

export interface DatasetChecksumEntry {
  path: string;
  checksum: string;
  byteLength: number;
}

export interface DatasetChecksums {
  schemaVersion: typeof DATASET_CHECKSUMS_SCHEMA_VERSION;
  algorithm: 'fnv1a32-stable';
  createdAt: string;
  files: DatasetChecksumEntry[];
}

export interface DatasetChecksumValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const checksumText = (content: string): string => {
  let hash = 0x811c9dc5;

  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const checksumJsonStable = (value: unknown): string =>
  checksumText(stableStringify(value));

export const createDatasetChecksums = (input: {
  files: readonly DatasetChecksumFileInput[];
  createdAt: string;
}): DatasetChecksums => ({
  schemaVersion: DATASET_CHECKSUMS_SCHEMA_VERSION,
  algorithm: 'fnv1a32-stable',
  createdAt: input.createdAt,
  files: [...input.files]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((file) => ({
      path: file.path,
      checksum: checksumText(file.content),
      byteLength: file.content.length,
    })),
});

export const validateDatasetChecksums = (input: {
  checksums: DatasetChecksums;
  files: readonly DatasetChecksumFileInput[];
}): DatasetChecksumValidationResult => {
  const fileByPath = new Map(input.files.map((file) => [file.path, file.content]));
  const errors = input.checksums.files
    .flatMap((entry) => {
      const content = fileByPath.get(entry.path);

      if (content === undefined) {
        return [`missing checksum file:${entry.path}`];
      }

      const actual = checksumText(content);

      return actual === entry.checksum
        ? []
        : [`checksum mismatch:${entry.path}`];
    })
    .sort();
  const expected = new Set(input.checksums.files.map((entry) => entry.path));
  const warnings = input.files
    .filter((file) => !expected.has(file.path))
    .map((file) => `untracked file:${file.path}`)
    .sort();

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const exportDatasetChecksumsJson = (
  checksums: DatasetChecksums,
): string => stableStringify(checksums);
