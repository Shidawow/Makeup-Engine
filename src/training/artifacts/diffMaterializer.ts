import { stableStringify } from '../../templates/storage/datasetExport';
import type { OfflineMaskArtifact } from '../../templates/schema';
import type { MaskArtifactMaterialization, MaskArtifactMaterializationResult } from '../schema/mask-binary-artifact.schema';
import { MASK_BINARY_ARTIFACT_SCHEMA_VERSION } from '../schema/mask-binary-artifact.schema';
import type { TrainingBridgeValidationIssue } from '../schema';
import { convertJsonDiffToTrainingDiffPayload } from './diffArtifactIO';
import { createDiffTensorFromArtifact } from '../tensors';

export const BINARY_DIFF_MAGIC = 'MEADIFF' as const;

export interface BinaryDiffBlob {
  magic: typeof BINARY_DIFF_MAGIC;
  version: 1;
  width: number;
  height: number;
  regionId: string;
  target: string;
  valueType: 'uint8-alpha';
  values: number[];
}

const checksumText = (content: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

const issue = (
  code: string,
  message: string,
): TrainingBridgeValidationIssue => ({ code, message, severity: 'error' });

export const convertJsonDiffToBinaryDiff = (
  artifact: OfflineMaskArtifact,
): BinaryDiffBlob => {
  const tensor = createDiffTensorFromArtifact(convertJsonDiffToTrainingDiffPayload(artifact));
  return {
    magic: BINARY_DIFF_MAGIC,
    version: 1,
    width: tensor.width,
    height: tensor.height,
    regionId: artifact.regionId,
    target: artifact.target,
    valueType: 'uint8-alpha',
    values: tensor.values.map((value) => Math.max(0, Math.min(255, Math.round(value * 255)))),
  };
};

export const readBinaryDiffArtifact = (content: string): BinaryDiffBlob =>
  JSON.parse(content) as BinaryDiffBlob;

export const writeBinaryDiffArtifact = (blob: BinaryDiffBlob): string =>
  `${stableStringify(blob)}\n`;

export const validateBinaryDiffArtifact = (
  blob: BinaryDiffBlob,
): TrainingBridgeValidationIssue[] => [
  ...(blob.magic !== BINARY_DIFF_MAGIC ? [issue('binary-diff-magic-invalid', 'binary diff magic must be MEADIFF')] : []),
  ...(blob.width <= 0 ? [issue('binary-diff-width-invalid', 'binary diff width must be positive')] : []),
  ...(blob.height <= 0 ? [issue('binary-diff-height-invalid', 'binary diff height must be positive')] : []),
  ...(blob.values.length !== blob.width * blob.height
    ? [issue('binary-diff-size-invalid', 'binary diff values length must match width * height')]
    : []),
  ...(blob.values.some((value) => value < 0 || value > 255 || !Number.isInteger(value))
    ? [issue('binary-diff-alpha-invalid', 'binary diff values must be uint8')]
    : []),
];

export const summarizeBinaryDiffArtifact = (blob: BinaryDiffBlob): string =>
  `binary-diff:${blob.regionId}:${blob.width}x${blob.height}:values=${blob.values.length}`;

export const materializeDiffArtifact = (input: {
  artifact: OfflineMaskArtifact;
  relativePath?: string;
}): {
  blob: BinaryDiffBlob;
  materialization: MaskArtifactMaterialization;
} => {
  const blob = convertJsonDiffToBinaryDiff(input.artifact);
  const content = writeBinaryDiffArtifact(blob);
  const checksum = checksumText(content);
  const outputArtifactId = `${input.artifact.artifactId}-binary`;
  const relativePath = input.relativePath ?? `diffs-binary/${outputArtifactId}.meadiff.json`;
  return {
    blob,
    materialization: {
      materializationId: `materialization-${outputArtifactId}`,
      sourceArtifactId: input.artifact.artifactId,
      outputArtifactId,
      sourceFormat: 'json-diff-grid',
      outputFormat: 'binary-diff-grid',
      relativePath,
      checksum,
    },
  };
};

export const materializeDiffArtifacts = (
  artifacts: readonly OfflineMaskArtifact[],
): MaskArtifactMaterializationResult => {
  const diffs = artifacts.filter((artifact) => artifact.artifactKind === 'diff_heatmap');
  const converted = diffs.map((artifact) => materializeDiffArtifact({ artifact }));
  return {
    schemaVersion: MASK_BINARY_ARTIFACT_SCHEMA_VERSION,
    materializations: converted.map((item) => item.materialization).sort((left, right) =>
      left.outputArtifactId.localeCompare(right.outputArtifactId),
    ),
    errors: converted.flatMap((item) => validateBinaryDiffArtifact(item.blob)),
    warnings: [],
  };
};
