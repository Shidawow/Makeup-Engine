import type {
  OfflineImageReference,
  OfflineMaskArtifact,
} from '../../templates/schema';
import type {
  LoadedDiffTarget,
  LoadedMaskTarget,
  TrainingBridgeValidationIssue,
} from '../schema';
import type { TrainingDatasetFileReader } from './fileReader';
import { parseJsonFile } from './fileReader';

const issue = (
  code: string,
  message: string,
  path?: string,
): TrainingBridgeValidationIssue => ({
  severity: 'error',
  code,
  message,
  path,
});

export const validateMaskArtifactForTraining = (
  artifact: OfflineMaskArtifact,
  path?: string,
): TrainingBridgeValidationIssue[] => [
  ...(artifact.artifactKind === 'diff_heatmap'
    ? [issue('mask-kind-invalid', 'mask artifact cannot be diff_heatmap', path)]
    : []),
  ...(artifact.width <= 0 ? [issue('mask-width-invalid', 'mask width must be positive', path)] : []),
  ...(artifact.height <= 0 ? [issue('mask-height-invalid', 'mask height must be positive', path)] : []),
  ...(artifact.checksum.length === 0
    ? [issue('mask-checksum-missing', 'mask checksum is required', path)]
    : []),
  ...(artifact.alphaStats.min < 0 || artifact.alphaStats.max > 1
    ? [issue('mask-alpha-invalid', 'mask alpha stats must stay in 0..1', path)]
    : []),
];

export const validateDiffArtifactForTraining = (
  artifact: OfflineMaskArtifact,
  path?: string,
): TrainingBridgeValidationIssue[] => [
  ...(artifact.artifactKind !== 'diff_heatmap'
    ? [issue('diff-kind-invalid', 'diff artifact must be diff_heatmap', path)]
    : []),
  ...(artifact.width <= 0 ? [issue('diff-width-invalid', 'diff width must be positive', path)] : []),
  ...(artifact.height <= 0 ? [issue('diff-height-invalid', 'diff height must be positive', path)] : []),
  ...(artifact.checksum.length === 0
    ? [issue('diff-checksum-missing', 'diff checksum is required', path)]
    : []),
];

export const normalizeMaskArtifact = (
  artifact: OfflineMaskArtifact,
): LoadedMaskTarget => ({
  artifactId: artifact.artifactId,
  sampleId: artifact.sampleId,
  maskId: artifact.maskId,
  regionId: artifact.regionId,
  width: artifact.width,
  height: artifact.height,
  alphaStats: artifact.alphaStats,
  bounds: artifact.bounds,
  checksum: artifact.checksum,
});

export const normalizeDiffArtifact = (
  artifact: OfflineMaskArtifact,
): LoadedDiffTarget => ({
  artifactId: artifact.artifactId,
  sampleId: artifact.sampleId,
  regionId: artifact.regionId,
  width: artifact.width,
  height: artifact.height,
  alphaStats: artifact.alphaStats,
  bounds: artifact.bounds,
  checksum: artifact.checksum,
});

export const readMaskArtifact = async (
  reader: TrainingDatasetFileReader,
  relativePath: string,
): Promise<OfflineMaskArtifact> =>
  parseJsonFile<OfflineMaskArtifact>(reader, relativePath);

export const readDiffArtifact = async (
  reader: TrainingDatasetFileReader,
  relativePath: string,
): Promise<OfflineMaskArtifact> =>
  parseJsonFile<OfflineMaskArtifact>(reader, relativePath);

export const readImageReferenceArtifact = async (
  reader: TrainingDatasetFileReader,
  relativePath: string,
): Promise<OfflineImageReference> =>
  parseJsonFile<OfflineImageReference>(reader, relativePath);

export const summarizeArtifactStats = (
  artifacts: readonly OfflineMaskArtifact[],
): string =>
  artifacts
    .map(
      (artifact) =>
        `${artifact.artifactKind}:${artifact.regionId}:${artifact.width}x${artifact.height}:active=${artifact.alphaStats.activeRatio}`,
    )
    .sort()
    .join('\n');
