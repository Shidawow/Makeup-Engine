import type {
  MaterializedDatasetValidationResult,
  MaterializedTrainingDataset,
} from '../schema';
import { MATERIALIZED_DATASET_SCHEMA_VERSION } from '../schema';
import type { DatasetChecksums, DatasetChecksumFileInput } from './datasetChecksums';
import { validateDatasetChecksums } from './datasetChecksums';
import { assertNoAbsoluteDatasetPath } from './artifactPathResolver';

const REQUIRED_SPLITS = ['train', 'validation', 'test'] as const;

const result = (input: {
  dataset: MaterializedTrainingDataset;
  checkedAt?: string;
  errors: readonly string[];
  warnings: readonly string[];
  checksumMismatchCount?: number;
  absolutePathLeakCount?: number;
  missingArtifactLinkCount?: number;
}): MaterializedDatasetValidationResult => ({
  schemaVersion: MATERIALIZED_DATASET_SCHEMA_VERSION,
  valid: input.errors.length === 0,
  checkedAt: input.checkedAt ?? input.dataset.createdAt,
  errors: [...input.errors].sort(),
  warnings: [...input.warnings].sort(),
  summary: {
    entryCount: input.dataset.entries.length,
    imageFileCount: input.dataset.imageFiles.length,
    imagePixelFileCount: input.dataset.imagePixelFiles?.length ?? 0,
    maskFileCount: input.dataset.maskFiles.length,
    diffFileCount: input.dataset.diffFiles.length,
    splitFileCount: input.dataset.splitFiles.length,
    checksumMismatchCount: input.checksumMismatchCount ?? 0,
    absolutePathLeakCount: input.absolutePathLeakCount ?? 0,
    splitCompleteness: Object.fromEntries(
      REQUIRED_SPLITS.map((split) => [
        split,
        input.dataset.splitFiles.some(
          (file) => file.split === split && file.sampleCount > 0,
        ),
      ]),
    ) as Record<(typeof REQUIRED_SPLITS)[number], boolean>,
    missingArtifactLinkCount: input.missingArtifactLinkCount ?? 0,
  },
});

export const validateMaterializedFilesExist = (input: {
  dataset: MaterializedTrainingDataset;
  availablePaths: readonly string[];
}): string[] => {
  const available = new Set(input.availablePaths);
  const expected = [
    input.dataset.manifestPath,
    input.dataset.packagePath,
    input.dataset.auditReportPath,
    input.dataset.checksumsPath,
    ...(input.dataset.artifactManifestPath ? [input.dataset.artifactManifestPath] : []),
    ...input.dataset.imageFiles.map((file) => file.relativePath),
    ...(input.dataset.imagePixelFiles ?? []).map((file) => file.relativePath),
    ...input.dataset.maskFiles.map((file) => file.relativePath),
    ...input.dataset.diffFiles.map((file) => file.relativePath),
    ...input.dataset.splitFiles.map((file) => file.relativePath),
  ];

  return expected
    .filter((path) => !available.has(path))
    .map((path) => `missing materialized file:${path}`)
    .sort();
};

export const validateMaterializedChecksums = (input: {
  checksums: DatasetChecksums;
  files: readonly DatasetChecksumFileInput[];
}): string[] => validateDatasetChecksums(input).errors;

export const validateSplitFiles = (
  dataset: MaterializedTrainingDataset,
): string[] =>
  REQUIRED_SPLITS.filter(
    (split) =>
      !dataset.splitFiles.some(
        (file) => file.split === split && file.sampleCount > 0,
      ),
  )
    .map((split) => `split file is empty or missing:${split}`)
    .sort();

export const validateEntryArtifactLinks = (
  dataset: MaterializedTrainingDataset,
): string[] => {
  const imageIds = new Set(dataset.imageFiles.map((file) => file.imageFileId));
  const maskIds = new Set(dataset.maskFiles.map((file) => file.maskFileId));
  const diffIds = new Set(dataset.diffFiles.map((file) => file.diffFileId));

  return dataset.entries
    .flatMap((entry) => [
      ...(imageIds.has(entry.imageFileId)
        ? []
        : [`missing image link:${entry.sampleId}`]),
      ...(maskIds.has(entry.originalMaskFileId)
        ? []
        : [`missing original mask link:${entry.sampleId}`]),
      ...(maskIds.has(entry.humanEditedMaskFileId)
        ? []
        : [`missing edited mask link:${entry.sampleId}`]),
      ...(diffIds.has(entry.diffFileId)
        ? []
        : [`missing diff link:${entry.sampleId}`]),
    ])
    .sort();
};

export const validateNoAbsolutePathLeakage = (
  dataset: MaterializedTrainingDataset,
): string[] =>
  assertNoAbsoluteDatasetPath([
    dataset.rootDir,
    dataset.manifestPath,
    dataset.packagePath,
    dataset.auditReportPath,
    dataset.checksumsPath,
    ...dataset.entries.flatMap((entry) => Object.values(entry.relativePaths)),
    ...dataset.imageFiles.map((file) => file.relativePath),
    ...(dataset.imagePixelFiles ?? []).map((file) => file.relativePath),
    ...dataset.maskFiles.map((file) => file.relativePath),
    ...dataset.diffFiles.map((file) => file.relativePath),
    ...dataset.splitFiles.map((file) => file.relativePath),
  ]);

export const validateTrainingDatasetReadiness = (
  dataset: MaterializedTrainingDataset,
): string[] => {
  const warnings = [
    ...validateSplitFiles(dataset),
    ...Object.entries(
      dataset.entries.reduce<Record<string, number>>((counts, entry) => {
        counts[entry.regionId] = (counts[entry.regionId] ?? 0) + 1;
        return counts;
      }, {}),
    )
      .filter(([, count]) => count < 1)
      .map(([region]) => `region has no materialized entries:${region}`),
  ];

  return warnings.sort();
};

export const validateImagePixelArtifactLinks = (
  dataset: MaterializedTrainingDataset,
): string[] => {
  const pixels = new Set((dataset.imagePixelFiles ?? []).map((file) => file.imageId));
  return dataset.entries
    .filter((entry) => entry.relativePaths.imagePixel && !pixels.has(entry.imageId))
    .map((entry) => `missing image pixel link:${entry.sampleId}`)
    .sort();
};

export const validatePixelMaskDimensionCompatibility = (
  dataset: MaterializedTrainingDataset,
): string[] =>
  dataset.entries
    .filter((entry) => entry.relativePaths.imagePixel)
    .flatMap(() => [])
    .sort();

export const validateMaterializedDatasetIntegrity = (input: {
  dataset: MaterializedTrainingDataset;
  availablePaths?: readonly string[];
  checksums?: DatasetChecksums;
  files?: readonly DatasetChecksumFileInput[];
  checkedAt?: string;
}): MaterializedDatasetValidationResult => {
  const fileErrors = input.availablePaths
    ? validateMaterializedFilesExist({
        dataset: input.dataset,
        availablePaths: input.availablePaths,
      })
    : [];
  const checksumErrors =
    input.checksums && input.files
      ? validateMaterializedChecksums({
          checksums: input.checksums,
          files: input.files,
        })
      : [];
  const linkErrors = [
    ...validateEntryArtifactLinks(input.dataset),
    ...validateImagePixelArtifactLinks(input.dataset),
    ...validateMaterializedArtifactManifestLinks(input.dataset),
  ];
  const pathErrors = validateNoAbsolutePathLeakage(input.dataset);
  const warnings = validateTrainingDatasetReadiness(input.dataset);
  const errors = [...fileErrors, ...checksumErrors, ...linkErrors, ...pathErrors];

  return result({
    dataset: input.dataset,
    checkedAt: input.checkedAt,
    errors,
    warnings,
    checksumMismatchCount: checksumErrors.length,
    absolutePathLeakCount: pathErrors.length,
    missingArtifactLinkCount: linkErrors.length,
  });
};

export const validateMaterializedArtifactManifestLinks = (
  dataset: MaterializedTrainingDataset,
): string[] => {
  const links = dataset.artifactLinks ?? [];
  return [
    ...links.filter((link) => link.relativePath.length === 0).map((link) => `artifact link path missing:${link.artifactId}`),
    ...links.filter((link) => link.checksum.value.length === 0).map((link) => `artifact link checksum missing:${link.artifactId}`),
    ...links.filter((link) => link.width <= 0 || link.height <= 0).map((link) => `artifact link dimensions invalid:${link.artifactId}`),
    ...links
      .filter((link) => link.format === 'png-alpha-mask' && !link.sidecarMetadataReference)
      .map((link) => `png mask sidecar missing:${link.artifactId}`),
    ...links
      .filter((link) => link.format === 'png-alpha-mask' && link.codecKind !== 'png')
      .map((link) => `png mask codec missing:${link.artifactId}`),
    ...links
      .filter((link) => link.format === 'png-alpha-mask' && link.coordinateSpace.space !== 'pixel-grid')
      .map((link) => `png mask coordinate space mismatch:${link.artifactId}`),
    ...links
      .filter((link) => link.format === 'png-image' && !link.sidecarMetadataReference)
      .map((link) => `png image sidecar missing:${link.artifactId}`),
    ...links
      .filter((link) => link.format === 'png-image' && link.codecKind !== 'png')
      .map((link) => `png image codec missing:${link.artifactId}`),
    ...links
      .filter((link) => link.format === 'png-image' && link.channels !== 4)
      .map((link) => `png image channels mismatch:${link.artifactId}`),
  ].sort();
};
