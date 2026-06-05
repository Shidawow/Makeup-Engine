import type { TrainingBridgeValidationIssue } from '../schema';

export interface PngDiffHeatmapArtifact {
  artifactId: string;
  sampleId: string;
  regionId: string;
  format: 'png-diff-heatmap';
  width: number;
  height: number;
  referenceUri: string;
  checksum: string;
  unsupported: true;
}

export interface PngDiffHeatmapCodecResult {
  artifact: PngDiffHeatmapArtifact | null;
  content: null;
  issues: TrainingBridgeValidationIssue[];
}

const unsupportedIssue = (): TrainingBridgeValidationIssue => ({
  severity: 'warning',
  code: 'png-diff-heatmap-unsupported',
  message: 'PNG diff heatmap codec is not implemented in Phase 6G; binary/json diff artifacts remain the supported path',
});

export const writePngDiffHeatmapArtifact = (): PngDiffHeatmapCodecResult => ({
  artifact: null,
  content: null,
  issues: [unsupportedIssue()],
});

export const readPngDiffHeatmapArtifact = writePngDiffHeatmapArtifact;

export const convertJsonDiffToPngHeatmap = writePngDiffHeatmapArtifact;

export const convertPngHeatmapToJsonDiff = readPngDiffHeatmapArtifact;

export const validatePngDiffHeatmapArtifact = (
  artifact: PngDiffHeatmapArtifact | null,
): TrainingBridgeValidationIssue[] => artifact?.unsupported ? [unsupportedIssue()] : [unsupportedIssue()];

export const summarizePngDiffHeatmapArtifact = (
  artifact: PngDiffHeatmapArtifact | null,
): string =>
  artifact
    ? `png-diff-heatmap:${artifact.regionId}:${artifact.width}x${artifact.height}:unsupported`
    : 'png-diff-heatmap:unsupported';
