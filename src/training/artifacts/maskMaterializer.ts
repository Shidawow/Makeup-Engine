import { stableStringify } from '../../templates/storage/datasetExport';
import type { OfflineMaskArtifact } from '../../templates/schema';
import type {
  BinaryMaskArtifact,
  MaskArtifactDimensionValidation,
  MaskArtifactMaterialization,
  MaskArtifactMaterializationResult,
  MaskArtifactPixelGrid,
} from '../schema/mask-binary-artifact.schema';
import { MASK_BINARY_ARTIFACT_SCHEMA_VERSION } from '../schema/mask-binary-artifact.schema';
import type { TrainingBridgeValidationIssue } from '../schema';
import type { TrainingMaskArtifactPayload } from './maskArtifactIO';
import { convertJsonMaskToTrainingMaskPayload } from './maskArtifactIO';
import { createMaskTensorFromArtifact } from '../tensors';

export const BINARY_MASK_MAGIC = 'MEAMASK' as const;

export interface BinaryMaskBlob {
  magic: typeof BINARY_MASK_MAGIC;
  version: 1;
  width: number;
  height: number;
  regionId: string;
  target: string;
  valueType: 'uint8-alpha';
  values: number[];
}

export interface BinaryMaskWriterAdapter {
  mkdirp(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
}

const round4 = (value: number): number => Number(value.toFixed(4));

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
  severity: TrainingBridgeValidationIssue['severity'] = 'error',
): TrainingBridgeValidationIssue => ({ code, message, severity });

export const validateBinaryMaskArtifact = (
  blob: BinaryMaskBlob,
): TrainingBridgeValidationIssue[] => [
  ...(blob.magic !== BINARY_MASK_MAGIC ? [issue('binary-mask-magic-invalid', 'binary mask magic must be MEAMASK')] : []),
  ...(blob.width <= 0 ? [issue('binary-mask-width-invalid', 'binary mask width must be positive')] : []),
  ...(blob.height <= 0 ? [issue('binary-mask-height-invalid', 'binary mask height must be positive')] : []),
  ...(blob.values.length !== blob.width * blob.height
    ? [issue('binary-mask-size-invalid', 'binary mask values length must match width * height')]
    : []),
  ...(blob.values.some((value) => value < 0 || value > 255 || !Number.isInteger(value))
    ? [issue('binary-mask-alpha-invalid', 'binary mask alpha values must be uint8')]
    : []),
];

export const convertJsonAlphaGridToBinaryMask = (
  payload: TrainingMaskArtifactPayload,
): BinaryMaskBlob => {
  const tensor = createMaskTensorFromArtifact(payload);
  return {
    magic: BINARY_MASK_MAGIC,
    version: 1,
    width: tensor.width,
    height: tensor.height,
    regionId: payload.regionId,
    target: payload.target,
    valueType: 'uint8-alpha',
    values: tensor.values.map((value) => Math.max(0, Math.min(255, Math.round(value * 255)))),
  };
};

export const readBinaryMaskArtifact = (
  content: string,
): BinaryMaskBlob => JSON.parse(content) as BinaryMaskBlob;

export const writeBinaryMaskArtifact = (
  blob: BinaryMaskBlob,
): string => `${stableStringify(blob)}\n`;

export const summarizeBinaryMaskArtifact = (
  blob: BinaryMaskBlob,
): string =>
  `binary-mask:${blob.regionId}:${blob.width}x${blob.height}:values=${blob.values.length}`;

export const validateMaskArtifactShape = (
  grid: MaskArtifactPixelGrid,
): MaskArtifactDimensionValidation => {
  const expectedLength = grid.width * grid.height;
  const valid = grid.width > 0 && grid.height > 0 && grid.values.length === expectedLength;
  return {
    valid,
    width: grid.width,
    height: grid.height,
    expectedLength,
    actualLength: grid.values.length,
    issues: valid
      ? []
      : [issue('mask-artifact-shape-invalid', 'mask grid length must match width * height')],
  };
};

export const materializeMaskArtifact = (input: {
  artifact: OfflineMaskArtifact;
  relativePath?: string;
}): {
  blob: BinaryMaskBlob;
  metadata: BinaryMaskArtifact;
  materialization: MaskArtifactMaterialization;
} => {
  const payload = convertJsonMaskToTrainingMaskPayload(input.artifact);
  const blob = convertJsonAlphaGridToBinaryMask(payload);
  const content = writeBinaryMaskArtifact(blob);
  const checksum = checksumText(content);
  const outputArtifactId = `${input.artifact.artifactId}-binary`;
  const relativePath = input.relativePath ?? `masks-binary/${outputArtifactId}.meamask.json`;
  const metadata: BinaryMaskArtifact = {
    schemaVersion: MASK_BINARY_ARTIFACT_SCHEMA_VERSION,
    artifactId: outputArtifactId,
    sampleId: input.artifact.sampleId,
    regionId: input.artifact.regionId,
    target: input.artifact.target,
    format: 'binary-alpha-mask',
    valueType: 'uint8-alpha',
    width: blob.width,
    height: blob.height,
    byteLength: content.length,
    checksum,
    sourceJsonArtifactUri: input.artifact.referenceUri,
    referenceUri: `materialized://${relativePath}`,
    coordinateSpace: {
      space: 'normalized-image',
      width: blob.width,
      height: blob.height,
      origin: 'top-left',
    },
  };
  return {
    blob,
    metadata,
    materialization: {
      materializationId: `materialization-${outputArtifactId}`,
      sourceArtifactId: input.artifact.artifactId,
      outputArtifactId,
      sourceFormat: 'json-alpha-grid',
      outputFormat: 'binary-alpha-mask',
      relativePath,
      checksum,
    },
  };
};

export const writeMaterializedBinaryMaskArtifact = async (input: {
  adapter: BinaryMaskWriterAdapter;
  outDir: string;
  artifact: OfflineMaskArtifact;
}): Promise<MaskArtifactMaterialization> => {
  const materialized = materializeMaskArtifact({ artifact: input.artifact });
  await input.adapter.mkdirp(`${input.outDir}/masks-binary`);
  await input.adapter.writeFile(`${input.outDir}/${materialized.materialization.relativePath}`, writeBinaryMaskArtifact(materialized.blob));
  return materialized.materialization;
};

export const materializeMaskArtifacts = (
  artifacts: readonly OfflineMaskArtifact[],
): MaskArtifactMaterializationResult => {
  const masks = artifacts.filter((artifact) => artifact.artifactKind !== 'diff_heatmap');
  const converted = masks.map((artifact) => materializeMaskArtifact({ artifact }));
  const errors = converted.flatMap((item) => validateBinaryMaskArtifact(item.blob));
  return {
    schemaVersion: MASK_BINARY_ARTIFACT_SCHEMA_VERSION,
    materializations: converted.map((item) => item.materialization).sort((left, right) =>
      left.outputArtifactId.localeCompare(right.outputArtifactId),
    ),
    errors,
    warnings: [],
  };
};

export const binaryMaskToTrainingMaskPayload = (
  blob: BinaryMaskBlob,
  checksum: string,
  sourceArtifactUri: string,
): TrainingMaskArtifactPayload => ({
  format: 'json-alpha-grid',
  width: blob.width,
  height: blob.height,
  regionId: blob.regionId as TrainingMaskArtifactPayload['regionId'],
  target: blob.target as TrainingMaskArtifactPayload['target'],
  alphaGrid: {
    width: blob.width,
    height: blob.height,
    alpha: blob.values.map((value) => round4(value / 255)),
  },
  alphaStats: {
    min: blob.values.length ? round4(Math.min(...blob.values) / 255) : 0,
    max: blob.values.length ? round4(Math.max(...blob.values) / 255) : 0,
    mean: blob.values.length
      ? round4(blob.values.reduce((sum, value) => sum + value, 0) / blob.values.length / 255)
      : 0,
    activeRatio: blob.values.length
      ? round4(blob.values.filter((value) => value > 0).length / blob.values.length)
      : 0,
  },
  bounds: null,
  checksum,
  sourceArtifactUri,
});
