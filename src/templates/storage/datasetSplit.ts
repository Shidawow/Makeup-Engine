import type {
  DatasetQualityStatus,
  DatasetSplit,
  DatasetSplitSummary,
} from '../schema';
import { stableHash } from './datasetExport';

export interface DatasetSplitCandidate {
  sampleId: string;
  imageId: string;
  templateId: string;
  currentDecision?: {
    status: DatasetQualityStatus;
  };
  assignedSplit?: DatasetSplit;
}

export interface DatasetSplitRatios {
  train: number;
  validation: number;
  test: number;
}

export interface DatasetSplitOptions {
  ratios?: DatasetSplitRatios;
  holdoutSampleIds?: readonly string[];
  allowTemplateLeakage?: boolean;
  allowImageLeakage?: boolean;
}

export interface SplitLeakageIssue {
  leakageType: 'image' | 'template';
  id: string;
  splits: DatasetSplit[];
  sampleIds: string[];
}

export interface SplitLeakageValidationResult {
  valid: boolean;
  issues: SplitLeakageIssue[];
}

const DEFAULT_RATIOS: DatasetSplitRatios = {
  train: 0.8,
  validation: 0.1,
  test: 0.1,
};

const SPLIT_ORDER: DatasetSplit[] = [
  'train',
  'validation',
  'test',
  'holdout',
  'unassigned',
];

const TRAINING_READY_STATUSES = new Set<DatasetQualityStatus>([
  'accepted',
  'ready_for_training',
]);

const normalizeRatios = (
  ratios: DatasetSplitRatios = DEFAULT_RATIOS,
): DatasetSplitRatios => {
  const total = Math.max(0.0001, ratios.train + ratios.validation + ratios.test);

  return {
    train: ratios.train / total,
    validation: ratios.validation / total,
    test: ratios.test / total,
  };
};

const isTrainingReadyCandidate = (candidate: DatasetSplitCandidate): boolean =>
  candidate.currentDecision
    ? TRAINING_READY_STATUSES.has(candidate.currentDecision.status)
    : true;

const splitFromBucket = (
  bucket: number,
  ratios: DatasetSplitRatios,
): DatasetSplit => {
  const trainCutoff = Math.round(ratios.train * 100);
  const validationCutoff = Math.round((ratios.train + ratios.validation) * 100);

  if (bucket < trainCutoff) {
    return 'train';
  }

  if (bucket < validationCutoff) {
    return 'validation';
  }

  return 'test';
};

const bucketForKey = (key: string): number =>
  Number.parseInt(stableHash(key), 16) % 100;

export const assignSampleToSplit = (
  candidate: DatasetSplitCandidate,
  options: DatasetSplitOptions = {},
): DatasetSplit => {
  if (options.holdoutSampleIds?.includes(candidate.sampleId)) {
    return 'holdout';
  }

  if (!isTrainingReadyCandidate(candidate)) {
    return 'unassigned';
  }

  const ratios = normalizeRatios(options.ratios);
  const groupKey = `${candidate.imageId}:${candidate.templateId}`;

  return splitFromBucket(bucketForKey(groupKey), ratios);
};

class DisjointSet {
  private readonly parents = new Map<string, string>();

  find(value: string): string {
    if (!this.parents.has(value)) {
      this.parents.set(value, value);
      return value;
    }

    const parent = this.parents.get(value) ?? value;

    if (parent === value) {
      return value;
    }

    const root = this.find(parent);

    this.parents.set(value, root);
    return root;
  }

  union(left: string, right: string): void {
    const leftRoot = this.find(left);
    const rightRoot = this.find(right);

    if (leftRoot !== rightRoot) {
      const [stableRoot, movingRoot] = [leftRoot, rightRoot].sort();

      this.parents.set(movingRoot, stableRoot);
    }
  }
}

export const autoAssignDatasetSplits = <T extends DatasetSplitCandidate>(
  candidates: readonly T[],
  options: DatasetSplitOptions = {},
): Record<string, DatasetSplit> => {
  const ratios = normalizeRatios(options.ratios);
  const holdoutIds = new Set(options.holdoutSampleIds ?? []);
  const disjointSet = new DisjointSet();

  for (const candidate of candidates) {
    const imageKey = `image:${candidate.imageId}`;
    const templateKey = `template:${candidate.templateId}`;

    disjointSet.union(imageKey, templateKey);
    disjointSet.union(imageKey, `sample:${candidate.sampleId}`);
  }

  const grouped = new Map<string, T[]>();

  for (const candidate of candidates) {
    const groupId = disjointSet.find(`sample:${candidate.sampleId}`);
    const current = grouped.get(groupId) ?? [];

    grouped.set(groupId, [...current, candidate]);
  }

  const assignments: Record<string, DatasetSplit> = {};

  for (const group of [...grouped.values()].sort((left, right) =>
    left[0]?.sampleId.localeCompare(right[0]?.sampleId ?? '') ?? 0,
  )) {
    const groupKey = group
      .flatMap((candidate) => [
        `image:${candidate.imageId}`,
        `template:${candidate.templateId}`,
        `sample:${candidate.sampleId}`,
      ])
      .sort()
      .join('|');
    const groupSplit = splitFromBucket(bucketForKey(groupKey), ratios);

    for (const candidate of group) {
      assignments[candidate.sampleId] = holdoutIds.has(candidate.sampleId)
        ? 'holdout'
        : isTrainingReadyCandidate(candidate)
          ? groupSplit
          : 'unassigned';
    }
  }

  return assignments;
};

const splitRank = (split: DatasetSplit): number => SPLIT_ORDER.indexOf(split);

const summarizeLeakage = (input: {
  leakageType: 'image' | 'template';
  groups: Map<string, DatasetSplitCandidate[]>;
}): SplitLeakageIssue[] =>
  [...input.groups.entries()]
    .map(([id, candidates]) => {
      const active = candidates.filter(
        (candidate) =>
          candidate.assignedSplit === 'train' || candidate.assignedSplit === 'test',
      );
      const splits = Array.from(
        new Set(active.map((candidate) => candidate.assignedSplit).filter(Boolean)),
      ) as DatasetSplit[];

      return {
        leakageType: input.leakageType,
        id,
        splits: splits.sort((left, right) => splitRank(left) - splitRank(right)),
        sampleIds: active.map((candidate) => candidate.sampleId).sort(),
      };
    })
    .filter((issue) => issue.splits.includes('train') && issue.splits.includes('test'))
    .sort((left, right) =>
      `${left.leakageType}:${left.id}`.localeCompare(
        `${right.leakageType}:${right.id}`,
      ),
    );

export const validateSplitLeakage = (
  candidates: readonly DatasetSplitCandidate[],
  options: DatasetSplitOptions = {},
): SplitLeakageValidationResult => {
  const imageGroups = new Map<string, DatasetSplitCandidate[]>();
  const templateGroups = new Map<string, DatasetSplitCandidate[]>();

  for (const candidate of candidates) {
    imageGroups.set(candidate.imageId, [
      ...(imageGroups.get(candidate.imageId) ?? []),
      candidate,
    ]);
    templateGroups.set(candidate.templateId, [
      ...(templateGroups.get(candidate.templateId) ?? []),
      candidate,
    ]);
  }

  const issues = [
    ...(options.allowImageLeakage
      ? []
      : summarizeLeakage({ leakageType: 'image', groups: imageGroups })),
    ...(options.allowTemplateLeakage
      ? []
      : summarizeLeakage({ leakageType: 'template', groups: templateGroups })),
  ];

  return {
    valid: issues.length === 0,
    issues,
  };
};

export const summarizeSplits = (
  candidates: readonly Pick<DatasetSplitCandidate, 'assignedSplit'>[],
): DatasetSplitSummary =>
  candidates.reduce<DatasetSplitSummary>(
    (summary, candidate) => ({
      ...summary,
      [candidate.assignedSplit ?? 'unassigned']:
        summary[candidate.assignedSplit ?? 'unassigned'] + 1,
    }),
    {
      train: 0,
      validation: 0,
      test: 0,
      holdout: 0,
      unassigned: 0,
    },
  );
