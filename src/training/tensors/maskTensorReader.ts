import type { TrainingDiffArtifactPayload, TrainingMaskArtifactPayload } from '../artifacts';
import type { TrainingBridgeValidationIssue } from '../schema';

export interface TrainingMaskTensor {
  width: number;
  height: number;
  values: number[];
  min: number;
  max: number;
  mean: number;
  nonZeroRatio: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
    space: 'normalized-image';
  } | null;
}

export type TrainingDiffTensor = TrainingMaskTensor;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const round4 = (value: number): number => Number(value.toFixed(4));

const summarizeValues = (
  width: number,
  height: number,
  values: readonly number[],
): TrainingMaskTensor => {
  const nonZero = values
    .map((value, index) => ({ value, index }))
    .filter((item) => item.value > 0.001);
  const xs = nonZero.map((item) => item.index % width);
  const ys = nonZero.map((item) => Math.floor(item.index / width));

  return {
    width,
    height,
    values: values.map(round4),
    min: values.length === 0 ? 0 : round4(Math.min(...values)),
    max: values.length === 0 ? 0 : round4(Math.max(...values)),
    mean:
      values.length === 0
        ? 0
        : round4(values.reduce((sum, value) => sum + value, 0) / values.length),
    nonZeroRatio: values.length === 0 ? 0 : round4(nonZero.length / values.length),
    bounds:
      nonZero.length === 0
        ? null
        : {
            x: round4(Math.min(...xs) / width),
            y: round4(Math.min(...ys) / height),
            width: round4((Math.max(...xs) - Math.min(...xs) + 1) / width),
            height: round4((Math.max(...ys) - Math.min(...ys) + 1) / height),
            space: 'normalized-image',
          },
  };
};

const deriveAlphaGridFromStats = (
  artifact: TrainingMaskArtifactPayload | TrainingDiffArtifactPayload,
  width: number,
  height: number,
): number[] => {
  const size = width * height;
  const mean = 'alphaStats' in artifact ? artifact.alphaStats.mean : artifact.alphaDeltaMean;
  const activeRatio =
    'alphaStats' in artifact ? artifact.alphaStats.activeRatio : artifact.changedAreaRatio;
  const max = 'alphaStats' in artifact ? artifact.alphaStats.max : Math.min(1, mean * 2);
  const activeCount = Math.max(0, Math.min(size, Math.round(activeRatio * size)));
  if (activeCount === 0) return Array.from({ length: size }, () => 0);
  const activeValue = clamp01(Math.min(max, (mean * size) / activeCount));
  const centerX = (width - 1) / 2;
  const centerY = (height - 1) / 2;
  const ranked = Array.from({ length: size }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return {
      index,
      distance: (x - centerX) ** 2 + (y - centerY) ** 2,
    };
  }).sort((left, right) =>
    left.distance === right.distance
      ? left.index - right.index
      : left.distance - right.distance,
  );
  const active = new Set(ranked.slice(0, activeCount).map((item) => item.index));
  return Array.from({ length: size }, (_, index) => (active.has(index) ? activeValue : 0));
};

const resizeValues = (
  values: readonly number[],
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): number[] =>
  Array.from({ length: targetWidth * targetHeight }, (_, index) => {
    const x = index % targetWidth;
    const y = Math.floor(index / targetWidth);
    const sourceX = Math.min(
      sourceWidth - 1,
      Math.floor((x / Math.max(1, targetWidth)) * sourceWidth),
    );
    const sourceY = Math.min(
      sourceHeight - 1,
      Math.floor((y / Math.max(1, targetHeight)) * sourceHeight),
    );
    return values[sourceY * sourceWidth + sourceX] ?? 0;
  });

export const normalizeAlphaGridToTensor = (input: {
  width: number;
  height: number;
  values: readonly number[];
  targetWidth?: number;
  targetHeight?: number;
}): TrainingMaskTensor => {
  const targetWidth = input.targetWidth ?? input.width;
  const targetHeight = input.targetHeight ?? input.height;
  const values =
    targetWidth === input.width && targetHeight === input.height
      ? input.values
      : resizeValues(input.values, input.width, input.height, targetWidth, targetHeight);
  return summarizeValues(targetWidth, targetHeight, values.map(clamp01));
};

export const createMaskTensorFromArtifact = (
  artifact: TrainingMaskArtifactPayload,
): TrainingMaskTensor => {
  const gridValues =
    artifact.alphaGrid && artifact.alphaGrid.alpha.length === artifact.width * artifact.height
      ? artifact.alphaGrid.alpha
      : deriveAlphaGridFromStats(artifact, artifact.width, artifact.height);
  return normalizeAlphaGridToTensor({
    width: artifact.width,
    height: artifact.height,
    values: gridValues,
  });
};

export const createDiffTensorFromArtifact = (
  artifact: TrainingDiffArtifactPayload,
): TrainingDiffTensor =>
  normalizeAlphaGridToTensor({
    width: Math.max(1, Math.round((artifact.affectedBounds?.width ?? 0.1) * 32)),
    height: Math.max(1, Math.round((artifact.affectedBounds?.height ?? 0.1) * 32)),
    values: deriveAlphaGridFromStats(
      artifact,
      Math.max(1, Math.round((artifact.affectedBounds?.width ?? 0.1) * 32)),
      Math.max(1, Math.round((artifact.affectedBounds?.height ?? 0.1) * 32)),
    ),
  });

const issue = (
  code: string,
  message: string,
): TrainingBridgeValidationIssue => ({
  severity: 'error',
  code,
  message,
});

export const validateMaskTensor = (
  tensor: TrainingMaskTensor,
): TrainingBridgeValidationIssue[] => [
  ...(tensor.width <= 0 ? [issue('mask-tensor-width-invalid', 'width must be positive')] : []),
  ...(tensor.height <= 0 ? [issue('mask-tensor-height-invalid', 'height must be positive')] : []),
  ...(tensor.values.length !== tensor.width * tensor.height
    ? [issue('mask-tensor-size-invalid', 'values length must match width * height')]
    : []),
  ...(tensor.values.some((value) => value < 0 || value > 1)
    ? [issue('mask-tensor-alpha-invalid', 'tensor values must stay in 0..1')]
    : []),
];

export const validateDiffTensor = validateMaskTensor;

export const summarizeMaskTensor = (tensor: TrainingMaskTensor): string =>
  `${tensor.width}x${tensor.height}:mean=${tensor.mean}:active=${tensor.nonZeroRatio}`;

export const summarizeDiffTensor = summarizeMaskTensor;
