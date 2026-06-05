import type {
  DatasetSplit,
  OfflineTrainingPackageEntry,
} from '../../templates/schema';
import type { TrainingBridgeValidationIssue } from '../schema';
import type { TrainingDatasetFileReader } from './fileReader';

const splitPath = (split: Extract<DatasetSplit, 'train' | 'validation' | 'test'>) =>
  `splits/${split}.jsonl`;

const issue = (
  code: string,
  message: string,
  path: string,
  sampleId?: string,
): TrainingBridgeValidationIssue => ({
  severity: 'error',
  code,
  message,
  path,
  sampleId,
});

export const validateSplitSample = (
  sample: OfflineTrainingPackageEntry,
  expectedSplit: DatasetSplit,
  path: string,
): TrainingBridgeValidationIssue[] => [
  ...(sample.split !== expectedSplit
    ? [issue('split-mismatch', `expected split ${expectedSplit}`, path, sample.sampleId)]
    : []),
  ...(sample.validationStatus !== 'ready'
    ? [
        issue(
          'sample-not-training-ready',
          'split JSONL sample must be ready',
          path,
          sample.sampleId,
        ),
      ]
    : []),
  ...(sample.qualityScore <= 0
    ? [issue('sample-quality-invalid', 'quality score must be positive', path, sample.sampleId)]
    : []),
];

export const parseTrainingSplitLine = (
  line: string,
  lineNumber: number,
  path: string,
): { sample: OfflineTrainingPackageEntry | null; issues: TrainingBridgeValidationIssue[] } => {
  try {
    return {
      sample: JSON.parse(line) as OfflineTrainingPackageEntry,
      issues: [],
    };
  } catch {
    return {
      sample: null,
      issues: [
        issue('split-jsonl-parse-error', `invalid JSONL line ${lineNumber}`, path),
      ],
    };
  }
};

export const readSplitJsonl = async (
  reader: TrainingDatasetFileReader,
  split: Extract<DatasetSplit, 'train' | 'validation' | 'test'>,
): Promise<{
  split: typeof split;
  samples: OfflineTrainingPackageEntry[];
  validationIssues: TrainingBridgeValidationIssue[];
}> => {
  const path = splitPath(split);
  const text = await reader.readText(path);
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const parsed = rows.map((line, index) =>
    parseTrainingSplitLine(line, index + 1, path),
  );
  const samples = parsed
    .flatMap((row) => (row.sample ? [row.sample] : []))
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));
  const validationIssues = [
    ...parsed.flatMap((row) => row.issues),
    ...samples.flatMap((sample) => validateSplitSample(sample, split, path)),
  ];

  return {
    split,
    samples,
    validationIssues,
  };
};

export const readTrainSplit = (reader: TrainingDatasetFileReader) =>
  readSplitJsonl(reader, 'train');

export const readValidationSplit = (reader: TrainingDatasetFileReader) =>
  readSplitJsonl(reader, 'validation');

export const readTestSplit = (reader: TrainingDatasetFileReader) =>
  readSplitJsonl(reader, 'test');

export const summarizeSplit = (input: {
  split: DatasetSplit;
  samples: readonly OfflineTrainingPackageEntry[];
}): string =>
  `${input.split}:${input.samples.length}:${input.samples
    .map((sample) => sample.sampleId)
    .sort()
    .join(',')}`;
