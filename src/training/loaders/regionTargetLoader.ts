import type { CosmeticSegmentationTarget } from '../../vision';
import type {
  LoadedTrainingSample,
  RegionTrainingTarget,
} from '../schema';

export const TRAINING_REGIONS: CosmeticSegmentationTarget[] = [
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];

const average = (values: readonly number[]): number =>
  values.length === 0
    ? 0
    : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4));

export const groupSamplesByRegion = (
  samples: readonly LoadedTrainingSample[],
): Record<CosmeticSegmentationTarget, LoadedTrainingSample[]> =>
  Object.fromEntries(
    TRAINING_REGIONS.map((region) => [
      region,
      samples
        .filter((sample) => sample.regionId === region)
        .sort((left, right) => left.sampleId.localeCompare(right.sampleId)),
    ]),
  ) as Record<CosmeticSegmentationTarget, LoadedTrainingSample[]>;

export const computeRegionSampleWeights = (
  samples: readonly LoadedTrainingSample[],
): Record<CosmeticSegmentationTarget, number> =>
  Object.fromEntries(
    Object.entries(groupSamplesByRegion(samples)).map(([region, regionSamples]) => [
      region,
      average(regionSamples.map((sample) => sample.sampleWeight)),
    ]),
  ) as Record<CosmeticSegmentationTarget, number>;

export const createRegionTrainingTargets = (
  samples: readonly LoadedTrainingSample[],
): RegionTrainingTarget[] =>
  Object.entries(groupSamplesByRegion(samples)).map(([regionId, regionSamples]) => ({
    regionId: regionId as CosmeticSegmentationTarget,
    sampleIds: regionSamples.map((sample) => sample.sampleId),
    sampleCount: regionSamples.length,
    averageQualityScore: average(regionSamples.map((sample) => sample.qualityScore)),
    averageSampleWeight: average(regionSamples.map((sample) => sample.sampleWeight)),
    warnings:
      regionSamples.length === 0
        ? [`region has no training samples:${regionId}`]
        : regionSamples.length < 2
          ? [`region has low sample count:${regionId}`]
          : [],
  }));

export const filterTargetsByRegion = (
  samples: readonly LoadedTrainingSample[],
  regions: readonly CosmeticSegmentationTarget[],
): LoadedTrainingSample[] => {
  const selected = new Set(regions);
  return samples.filter((sample) => selected.has(sample.regionId));
};

export const filterTargetsByQuality = (
  samples: readonly LoadedTrainingSample[],
  minQualityScore: number,
): LoadedTrainingSample[] =>
  samples.filter((sample) => sample.qualityScore >= minQualityScore);

export const summarizeRegionCoverage = (
  samples: readonly LoadedTrainingSample[],
): string =>
  createRegionTrainingTargets(samples)
    .map((target) => `${target.regionId}:${target.sampleCount}`)
    .join('\n');
