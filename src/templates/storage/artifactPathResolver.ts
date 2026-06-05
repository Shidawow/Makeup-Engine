import type { OfflineImageReference, OfflineMaskArtifact } from '../schema';
import type { DatasetSplit } from '../schema/dataset-review.schema';

export interface ArtifactPathResolverOptions {
  outputRootDir?: string;
  datasetVersion?: string;
  allowAbsolutePaths?: boolean;
}

const WINDOWS_DRIVE = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC = /^\\\\/;

const isAbsolutePath = (value: string): boolean =>
  value.startsWith('/') || WINDOWS_DRIVE.test(value) || WINDOWS_UNC.test(value);

const trimSlashes = (value: string): string =>
  value.replace(/^\/+/, '').replace(/\/+$/, '');

const collapsePortableSegments = (path: string): string[] => {
  const segments: string[] = [];

  for (const rawSegment of path.split('/')) {
    const segment = rawSegment.trim();

    if (segment.length === 0 || segment === '.') {
      continue;
    }

    if (segment === '..') {
      segments.pop();
      continue;
    }

    segments.push(segment);
  }

  return segments;
};

export const normalizeDatasetPath = (
  input: string,
  options: { allowAbsolutePaths?: boolean } = {},
): string => {
  const replaced = input.replace(/\\/g, '/').trim();
  const hasAbsoluteRoot = isAbsolutePath(input) || replaced.startsWith('//');

  if (hasAbsoluteRoot && !options.allowAbsolutePaths) {
    throw new Error(`Absolute dataset paths are not allowed: ${input}`);
  }

  if (hasAbsoluteRoot) {
    const prefix = WINDOWS_DRIVE.test(input)
      ? `${replaced.slice(0, 2)}/`
      : replaced.startsWith('//')
        ? '//'
        : '/';
    const withoutPrefix = replaced
      .replace(/^[A-Za-z]:\//, '')
      .replace(/^\/+/, '');

    return `${prefix}${collapsePortableSegments(withoutPrefix).join('/')}`;
  }

  return collapsePortableSegments(replaced).join('/');
};

const joinDatasetPath = (
  options: { allowAbsolutePaths?: boolean },
  ...segments: readonly string[]
): string =>
  normalizeDatasetPath(
    segments
      .filter((segment) => segment.length > 0)
      .map(trimSlashes)
      .join('/'),
    options,
  );

export const resolveDatasetRootDir = (
  options: ArtifactPathResolverOptions = {},
): string =>
  normalizeDatasetPath(
    options.outputRootDir ??
      `datasets/makeup-engine/${options.datasetVersion ?? 'dev-v0'}`,
    { allowAbsolutePaths: options.allowAbsolutePaths },
  );

export const resolveImageReferencePath = (
  imageReference: OfflineImageReference,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(
    options,
    'images',
    `${imageReference.imageReferenceId}.json`,
  );

export const resolveImagePixelArtifactPath = (
  imageId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'image-pixels', `${imageId}.rgba.json`);

export const resolvePngImageArtifactPath = (
  imageId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'images-png', `${imageId}.png`);

export const resolvePngImageSidecarPath = (
  imageId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'images-png', `${imageId}.png.meta.json`);

export const resolveRawRgbaArtifactPath = (
  imageId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'image-pixels-raw', `${imageId}.rgba.bin.json`);

export const resolveMaskArtifactPath = (
  artifact: OfflineMaskArtifact,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'masks', `${artifact.artifactId}.json`);

export const resolveDiffArtifactPath = (
  artifact: OfflineMaskArtifact,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'diffs', `${artifact.artifactId}.json`);

export const resolveBinaryMaskArtifactPath = (
  artifactId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'masks-binary', `${artifactId}.meamask.json`);

export const resolvePngAlphaMaskArtifactPath = (
  sampleId: string,
  regionId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'masks-png', `${sampleId}-${regionId}.png`);

export const resolvePngAlphaMaskSidecarPath = (
  sampleId: string,
  regionId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'masks-png', `${sampleId}-${regionId}.png.meta.json`);

export const resolveBinaryDiffArtifactPath = (
  artifactId: string,
  options: ArtifactPathResolverOptions = {},
): string =>
  joinDatasetPath(options, 'diffs-binary', `${artifactId}.meadiff.json`);

export const resolveSplitFilePath = (
  split: Extract<DatasetSplit, 'train' | 'validation' | 'test'>,
  options: ArtifactPathResolverOptions = {},
): string => joinDatasetPath(options, 'splits', `${split}.jsonl`);

export const resolveManifestPath = (
  options: ArtifactPathResolverOptions = {},
): string => joinDatasetPath(options, 'manifest.json');

export const resolvePackagePath = (
  options: ArtifactPathResolverOptions = {},
): string => joinDatasetPath(options, 'package.json');

export const resolveAuditReportPath = (
  options: ArtifactPathResolverOptions = {},
): string => joinDatasetPath(options, 'audit-report.json');

export const resolveChecksumsPath = (
  options: ArtifactPathResolverOptions = {},
): string => joinDatasetPath(options, 'checksums.json');

export const resolveArtifactManifestPath = (
  options: ArtifactPathResolverOptions = {},
): string => joinDatasetPath(options, 'artifact-manifest.json');

export const createPortableArtifactUri = (relativePath: string): string =>
  `materialized://${normalizeDatasetPath(relativePath)}`;

export const assertNoAbsoluteDatasetPath = (paths: readonly string[]): string[] =>
  paths
    .filter((path) => isAbsolutePath(path) || path.replace(/\\/g, '/').startsWith('//'))
    .map((path) => `absolute path leaked:${path}`)
    .sort();
