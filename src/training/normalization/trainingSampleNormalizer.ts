import type {
  MaterializedDatasetEntry,
  OfflineImageReference,
} from '../../templates/schema';
import type {
  LoadedDiffTarget,
  LoadedMaskTarget,
  TrainingSampleInput,
  TrainingSampleTarget,
} from '../schema';

export const normalizeSampleWeight = (value: number): number =>
  Number(Math.max(0, value).toFixed(4));

export const normalizeQualitySignals = (input: {
  qualityScore: number;
  sampleWeight: number;
}): TrainingSampleInput['qualitySignals'] => ({
  qualityScore: Number(Math.max(0, Math.min(1, input.qualityScore)).toFixed(4)),
  sampleWeight: normalizeSampleWeight(input.sampleWeight),
});

export const normalizeImageReference = (
  imageReference: OfflineImageReference,
): OfflineImageReference => ({
  ...imageReference,
  sampleIds: [...imageReference.sampleIds].sort(),
});

export const normalizeMaskTarget = (
  mask: LoadedMaskTarget,
): LoadedMaskTarget => ({
  ...mask,
  alphaStats: {
    min: Number(mask.alphaStats.min.toFixed(4)),
    max: Number(mask.alphaStats.max.toFixed(4)),
    mean: Number(mask.alphaStats.mean.toFixed(4)),
    activeRatio: Number(mask.alphaStats.activeRatio.toFixed(4)),
  },
});

export const normalizeDiffTarget = (
  diff: LoadedDiffTarget,
): LoadedDiffTarget => ({
  ...diff,
  alphaStats: {
    min: Number(diff.alphaStats.min.toFixed(4)),
    max: Number(diff.alphaStats.max.toFixed(4)),
    mean: Number(diff.alphaStats.mean.toFixed(4)),
    activeRatio: Number(diff.alphaStats.activeRatio.toFixed(4)),
  },
});

export const createTrainingSampleInput = (input: {
  entry: MaterializedDatasetEntry;
  imageReference: OfflineImageReference;
}): TrainingSampleInput => ({
  sampleId: input.entry.sampleId,
  imageId: input.entry.imageId,
  templateId: input.entry.templateId,
  split: input.entry.split,
  regionId: input.entry.regionId,
  imageReference: normalizeImageReference(input.imageReference),
  regionTarget: input.entry.regionId,
  qualitySignals: normalizeQualitySignals({
    qualityScore: input.entry.qualityScore,
    sampleWeight: input.entry.sampleWeight,
  }),
});

export const createTrainingSampleTarget = (input: {
  entry: MaterializedDatasetEntry;
  originalMask: LoadedMaskTarget;
  humanEditedMask: LoadedMaskTarget;
  diffSignal: LoadedDiffTarget;
}): TrainingSampleTarget => ({
  sampleId: input.entry.sampleId,
  regionId: input.entry.regionId,
  originalMask: normalizeMaskTarget(input.originalMask),
  humanEditedMask: normalizeMaskTarget(input.humanEditedMask),
  diffSignal: normalizeDiffTarget(input.diffSignal),
  targetWeight: normalizeSampleWeight(input.entry.sampleWeight),
});

export const normalizeTrainingSample = (input: {
  entry: MaterializedDatasetEntry;
  imageReference: OfflineImageReference;
  originalMask: LoadedMaskTarget;
  humanEditedMask: LoadedMaskTarget;
  diffSignal: LoadedDiffTarget;
}): {
  input: TrainingSampleInput;
  target: TrainingSampleTarget;
} => ({
  input: createTrainingSampleInput({
    entry: input.entry,
    imageReference: input.imageReference,
  }),
  target: createTrainingSampleTarget({
    entry: input.entry,
    originalMask: input.originalMask,
    humanEditedMask: input.humanEditedMask,
    diffSignal: input.diffSignal,
  }),
});
