import type { CosmeticSegmentationTarget } from '../../vision';
import type { DatasetSplit } from '../../templates/schema';
import type {
  TrainingBatch,
  TrainingBatchIteratorConfig,
  LoadedTrainingDataset,
  LoadedTrainingSample,
} from '../schema';
import { TRAINING_BRIDGE_SCHEMA_VERSION } from '../schema';

const batchId = (input: {
  split: DatasetSplit;
  regionId?: CosmeticSegmentationTarget;
  index: number;
}): string =>
  ['training-batch', input.split, input.regionId ?? 'all', input.index].join('-');

const toBatch = (
  samples: readonly LoadedTrainingSample[],
  index: number,
  split: DatasetSplit,
  regionId?: CosmeticSegmentationTarget,
): TrainingBatch => ({
  batchId: batchId({ split, regionId, index }),
  schemaVersion: TRAINING_BRIDGE_SCHEMA_VERSION,
  split,
  regionId,
  sampleCount: samples.length,
  samples: samples.map((sample) => sample.input),
  targets: samples.map((sample) => sample.target),
  validationIssues: samples.flatMap((sample) => sample.validationIssues),
});

const filteredSamples = (
  samples: readonly LoadedTrainingSample[],
  config: TrainingBatchIteratorConfig,
): LoadedTrainingSample[] => {
  const regions = config.regions ? new Set(config.regions) : null;

  return samples
    .filter((sample) => !config.split || sample.split === config.split)
    .filter((sample) => !regions || regions.has(sample.regionId))
    .filter(
      (sample) =>
        config.qualityThreshold === undefined ||
        sample.qualityScore >= config.qualityThreshold,
    )
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));
};

export const createTrainingBatchIterator = (
  samples: readonly LoadedTrainingSample[],
  config: TrainingBatchIteratorConfig,
): TrainingBatch[] => {
  const batchSize = Math.max(1, config.batchSize);
  const selected = filteredSamples(samples, config);
  const batches: TrainingBatch[] = [];

  for (let index = 0; index < selected.length; index += batchSize) {
    const batchSamples = selected.slice(index, index + batchSize);
    if (config.dropLast && batchSamples.length < batchSize) {
      continue;
    }
    batches.push(
      toBatch(
        batchSamples,
        batches.length,
        config.split ?? batchSamples[0]?.split ?? 'train',
        config.regions?.length === 1 ? config.regions[0] : undefined,
      ),
    );
    if (config.maxBatches !== undefined && batches.length >= config.maxBatches) {
      break;
    }
  }

  return batches;
};

export const createSplitBatchIterator = (
  dataset: LoadedTrainingDataset,
  split: DatasetSplit,
  config: Omit<TrainingBatchIteratorConfig, 'split'>,
): TrainingBatch[] =>
  createTrainingBatchIterator(dataset.samples, { ...config, split });

export const createRegionBatchIterator = (
  dataset: LoadedTrainingDataset,
  region: CosmeticSegmentationTarget,
  config: Omit<TrainingBatchIteratorConfig, 'regions'>,
): TrainingBatch[] =>
  createTrainingBatchIterator(dataset.samples, { ...config, regions: [region] });

export const createBalancedRegionBatchIterator = (
  dataset: LoadedTrainingDataset,
  config: TrainingBatchIteratorConfig,
): TrainingBatch[] =>
  [...(config.regions ?? [])]
    .sort()
    .flatMap((region) =>
      createTrainingBatchIterator(dataset.samples, {
        ...config,
        regions: [region],
      }),
    );

export const summarizeBatches = (batches: readonly TrainingBatch[]): string =>
  batches
    .map(
      (batch) =>
        `${batch.batchId}:${batch.split}:${batch.regionId ?? 'all'}:${batch.sampleCount}`,
    )
    .join('\n');
