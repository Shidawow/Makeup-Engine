import type {
  DatasetExportFormat,
  DatasetManifest,
  DatasetManifestEntry,
  DatasetQualityStatus,
  DatasetReviewDecision,
  DatasetReviewItem,
  DatasetReviewQueue,
  DatasetReviewReason,
  DatasetReviewerMetadata,
  DatasetSplit,
  DatasetSplitSummary,
  HumanCorrectionDataset,
  HumanCorrectionSample,
  MakeupTemplate,
  TemplateEvidence,
} from '../schema';
import {
  DATASET_MANIFEST_SCHEMA_VERSION,
  DATASET_REPLAY_SCHEMA_VERSION,
  DATASET_REVIEW_SCHEMA_VERSION,
} from '../schema';
import type {
  DatasetReplayPayload,
  DatasetReplayTemplateSummary,
} from '../schema/dataset-replay.schema';
import {
  autoAssignDatasetSplits,
  summarizeSplits,
  validateSplitLeakage,
  type DatasetSplitOptions,
  type SplitLeakageValidationResult,
} from './datasetSplit';
import { runQualityGate, type QualityGateResult } from './qualityGate';
import { stableHash, stableStringify } from './datasetExport';

export interface CreateDatasetReviewQueueInput {
  dataset: HumanCorrectionDataset;
  evidence?: TemplateEvidence | null;
  createdAt?: string;
  reviewerId?: string;
  sourceImageQuality?: number;
}

export interface UpdateReviewDecisionInput {
  reviewItemId: string;
  status: DatasetQualityStatus;
  reasons?: readonly DatasetReviewReason[];
  reviewerMetadata: DatasetReviewerMetadata;
  decidedAt: string;
  notes?: readonly string[];
}

export interface BatchReviewDecisionInput {
  reviewItemIds?: readonly string[];
  reviewerMetadata: DatasetReviewerMetadata;
  decidedAt: string;
  reasons?: readonly DatasetReviewReason[];
  notes?: readonly string[];
}

export interface AssignReviewSplitInput {
  reviewItemId: string;
  split: DatasetSplit;
  updatedAt: string;
}

export interface ReviewedDatasetExport {
  schemaVersion: HumanCorrectionDataset['schemaVersion'];
  datasetId: string;
  sourceDatasetId: string;
  reviewQueueId: string;
  templateId: string;
  imageId: string;
  exportedAt: string;
  sampleCount: number;
  samples: HumanCorrectionSample[];
}

export interface DatasetReviewExportInput {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  exportedAt?: string;
  split?: DatasetSplit;
}

const reviewItemIdFor = (datasetId: string, sampleId: string): string =>
  `review-${stableHash({
    schemaVersion: DATASET_REVIEW_SCHEMA_VERSION,
    datasetId,
    sampleId,
  })}`;

const queueIdFor = (dataset: HumanCorrectionDataset): string =>
  `queue-${stableHash({
    schemaVersion: DATASET_REVIEW_SCHEMA_VERSION,
    datasetId: dataset.datasetId,
    sampleIds: dataset.samples.map((sample) => sample.sampleId).sort(),
  })}`;

const decision = (input: {
  status: DatasetQualityStatus;
  reasons: readonly DatasetReviewReason[];
  reviewerMetadata: DatasetReviewerMetadata;
  decidedAt: string;
  notes?: readonly string[];
}): DatasetReviewDecision => ({
  status: input.status,
  reasons: [...input.reasons].sort(),
  reviewerMetadata: {
    ...input.reviewerMetadata,
    notes: [...input.reviewerMetadata.notes],
  },
  decidedAt: input.decidedAt,
  notes: [...(input.notes ?? [])],
});

const summarizeQueue = (
  items: readonly DatasetReviewItem[],
): DatasetReviewQueue['summary'] => ({
  total: items.length,
  pending: items.filter((item) => item.currentDecision.status === 'pending_review')
    .length,
  accepted: items.filter((item) => item.currentDecision.status === 'accepted')
    .length,
  rejected: items.filter((item) => item.currentDecision.status === 'rejected')
    .length,
  needsSecondReview: items.filter(
    (item) => item.currentDecision.status === 'needs_second_review',
  ).length,
  readyForTraining: items.filter(
    (item) => item.currentDecision.status === 'ready_for_training',
  ).length,
});

const buildReviewItem = (input: {
  dataset: HumanCorrectionDataset;
  sample: HumanCorrectionSample;
  gate: QualityGateResult;
  createdAt: string;
  reviewerId: string;
  assignedSplit: DatasetSplit;
}): DatasetReviewItem => {
  const reviewerMetadata: DatasetReviewerMetadata = {
    reviewerId: input.reviewerId,
    reviewedAt: input.createdAt,
    notes: ['quality-gate-initialized'],
  };
  const initialDecision = decision({
    status: 'pending_review',
    reasons: input.gate.suggestedReasons,
    reviewerMetadata,
    decidedAt: input.createdAt,
    notes: input.gate.explanation,
  });

  return {
    schemaVersion: DATASET_REVIEW_SCHEMA_VERSION,
    reviewItemId: reviewItemIdFor(input.dataset.datasetId, input.sample.sampleId),
    sampleId: input.sample.sampleId,
    imageId: input.sample.imageId,
    templateId: input.sample.templateId,
    regionId: input.sample.regionId,
    currentDecision: initialDecision,
    qualityScore: input.gate.qualityScore,
    reviewerMetadata,
    reviewHistory: [initialDecision],
    assignedSplit: input.assignedSplit,
    reviewReasons: input.gate.suggestedReasons,
    evidenceSummary: input.gate.evidenceSummary,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  };
};

export const createDatasetReviewQueue = (
  input: CreateDatasetReviewQueueInput,
): DatasetReviewQueue => {
  const createdAt = input.createdAt ?? input.dataset.exportedAt;
  const sortedSamples = [...input.dataset.samples].sort((left, right) =>
    left.sampleId.localeCompare(right.sampleId),
  );
  const gates = new Map<string, QualityGateResult>();

  for (const sample of sortedSamples) {
    gates.set(
      sample.sampleId,
      runQualityGate({
        sample,
        evidence: input.evidence,
        sourceImageQuality: input.sourceImageQuality,
      }),
    );
  }

  const assignments = autoAssignDatasetSplits(
    sortedSamples.map((sample) => ({
      sampleId: sample.sampleId,
      imageId: sample.imageId,
      templateId: sample.templateId,
      currentDecision: { status: gates.get(sample.sampleId)?.suggestedDecision ?? 'pending_review' },
    })),
  );
  const items = sortedSamples.map((sample) =>
    buildReviewItem({
      dataset: input.dataset,
      sample,
      gate:
        gates.get(sample.sampleId) ??
        runQualityGate({
          sample,
          evidence: input.evidence,
          sourceImageQuality: input.sourceImageQuality,
        }),
      createdAt,
      reviewerId: input.reviewerId ?? 'quality-gate',
      assignedSplit: assignments[sample.sampleId] ?? 'unassigned',
    }),
  );

  return {
    schemaVersion: DATASET_REVIEW_SCHEMA_VERSION,
    queueId: queueIdFor(input.dataset),
    datasetId: input.dataset.datasetId,
    createdAt,
    updatedAt: createdAt,
    items,
    summary: summarizeQueue(items),
  };
};

export const createReviewQueueFromDataset = createDatasetReviewQueue;

export const createDatasetReviewQueueFromDataset = createDatasetReviewQueue;

const updateQueueItems = (
  queue: DatasetReviewQueue,
  updatedAt: string,
  updater: (item: DatasetReviewItem) => DatasetReviewItem,
): DatasetReviewQueue => {
  const items = queue.items
    .map(updater)
    .sort((left, right) => left.reviewItemId.localeCompare(right.reviewItemId));

  return {
    ...queue,
    updatedAt,
    items,
    summary: summarizeQueue(items),
  };
};

export const updateReviewDecision = (
  queue: DatasetReviewQueue,
  input: UpdateReviewDecisionInput,
): DatasetReviewQueue =>
  updateQueueItems(queue, input.decidedAt, (item) => {
    if (item.reviewItemId !== input.reviewItemId) {
      return item;
    }

    const nextDecision = decision({
      status: input.status,
      reasons: input.reasons ?? item.reviewReasons,
      reviewerMetadata: input.reviewerMetadata,
      decidedAt: input.decidedAt,
      notes: input.notes,
    });

    return {
      ...item,
      currentDecision: nextDecision,
      reviewerMetadata: nextDecision.reviewerMetadata,
      reviewHistory: [...item.reviewHistory, nextDecision],
      reviewReasons: nextDecision.reasons,
      updatedAt: input.decidedAt,
    };
  });

const updateManyDecisions = (
  queue: DatasetReviewQueue,
  status: DatasetQualityStatus,
  input: BatchReviewDecisionInput,
): DatasetReviewQueue => {
  const selectedIds = new Set(
    input.reviewItemIds ?? queue.items.map((item) => item.reviewItemId),
  );

  return updateQueueItems(queue, input.decidedAt, (item) => {
    if (!selectedIds.has(item.reviewItemId)) {
      return item;
    }

    const reasons =
      input.reasons ??
      (status === 'accepted' || status === 'ready_for_training'
        ? item.evidenceSummary.isTrainingReady
          ? ['accepted_clean']
          : ['accepted_minor_issue']
        : item.reviewReasons);
    const nextDecision = decision({
      status,
      reasons,
      reviewerMetadata: input.reviewerMetadata,
      decidedAt: input.decidedAt,
      notes: input.notes,
    });

    return {
      ...item,
      currentDecision: nextDecision,
      reviewerMetadata: nextDecision.reviewerMetadata,
      reviewHistory: [...item.reviewHistory, nextDecision],
      reviewReasons: nextDecision.reasons,
      updatedAt: input.decidedAt,
    };
  });
};

export const batchAcceptReviewItems = (
  queue: DatasetReviewQueue,
  input: BatchReviewDecisionInput,
): DatasetReviewQueue => updateManyDecisions(queue, 'accepted', input);

export const batchRejectReviewItems = (
  queue: DatasetReviewQueue,
  input: BatchReviewDecisionInput,
): DatasetReviewQueue => updateManyDecisions(queue, 'rejected', input);

export const markReviewItemsNeedsSecondReview = (
  queue: DatasetReviewQueue,
  input: BatchReviewDecisionInput,
): DatasetReviewQueue =>
  updateManyDecisions(queue, 'needs_second_review', {
    ...input,
    reasons: input.reasons ?? ['editor_uncertain'],
  });

export const assignReviewItemSplit = (
  queue: DatasetReviewQueue,
  input: AssignReviewSplitInput,
): DatasetReviewQueue =>
  updateQueueItems(queue, input.updatedAt, (item) =>
    item.reviewItemId === input.reviewItemId
      ? {
          ...item,
          assignedSplit: input.split,
          updatedAt: input.updatedAt,
        }
      : item,
  );

export const autoAssignReviewQueueSplits = (
  queue: DatasetReviewQueue,
  options: DatasetSplitOptions & { updatedAt: string },
): DatasetReviewQueue => {
  const assignments = autoAssignDatasetSplits(queue.items, options);

  return updateQueueItems(queue, options.updatedAt, (item) => ({
    ...item,
    assignedSplit: assignments[item.sampleId] ?? item.assignedSplit,
    updatedAt: options.updatedAt,
  }));
};

export const validateReviewQueueSplitLeakage = (
  queue: DatasetReviewQueue,
  options: DatasetSplitOptions = {},
): SplitLeakageValidationResult => validateSplitLeakage(queue.items, options);

export const isAcceptedTrainingReadyReviewItem = (
  item: DatasetReviewItem,
): boolean =>
  (item.currentDecision.status === 'accepted' ||
    item.currentDecision.status === 'ready_for_training') &&
  item.evidenceSummary.isTrainingReady &&
  item.assignedSplit !== 'unassigned' &&
  item.assignedSplit !== 'holdout';

const reviewedSamples = (
  input: DatasetReviewExportInput,
): HumanCorrectionSample[] => {
  const itemBySampleId = new Map(
    input.queue.items.map((item) => [item.sampleId, item]),
  );

  return input.dataset.samples
    .filter((sample) => {
      const item = itemBySampleId.get(sample.sampleId);

      return (
        Boolean(item) &&
        isAcceptedTrainingReadyReviewItem(item as DatasetReviewItem) &&
        (!input.split || item?.assignedSplit === input.split)
      );
    })
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));
};

export const exportReviewedDataset = (
  input: DatasetReviewExportInput,
): ReviewedDatasetExport => {
  const samples = reviewedSamples(input);

  return {
    schemaVersion: input.dataset.schemaVersion,
    datasetId: `reviewed-${input.dataset.datasetId}`,
    sourceDatasetId: input.dataset.datasetId,
    reviewQueueId: input.queue.queueId,
    templateId: input.dataset.templateId,
    imageId: input.dataset.imageId,
    exportedAt: input.exportedAt ?? input.dataset.exportedAt,
    sampleCount: samples.length,
    samples,
  };
};

export const exportReviewedDatasetFromQueueJsonl = (
  input: DatasetReviewExportInput,
): string => reviewedSamples(input).map((sample) => stableStringify(sample)).join('\n');

const dedupeSummary = (
  ids: readonly string[],
): DatasetManifest['imageDeduplicationSummary'] => {
  const counts = new Map<string, number>();

  for (const id of ids) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const duplicateIds = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort();

  return {
    uniqueCount: counts.size,
    duplicateCount: duplicateIds.length,
    duplicateIds,
  };
};

const emptyRegionSummary = (): DatasetManifest['regionSummary'] => ({
  lips: 0,
  blush: 0,
  eyeshadow: 0,
  eyeliner: 0,
  contour: 0,
  highlight: 0,
});

const emptyQualityDistribution = (): DatasetManifest['qualityDistribution'] => ({
  pending_review: 0,
  accepted: 0,
  rejected: 0,
  needs_second_review: 0,
  ready_for_training: 0,
  excluded: 0,
});

export const createDatasetManifest = (input: {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  exportFormat: DatasetExportFormat;
  createdAt?: string;
  exportedAt?: string;
}): DatasetManifest => {
  const entries: DatasetManifestEntry[] = input.queue.items
    .map((item) => ({
      sampleId: item.sampleId,
      imageId: item.imageId,
      templateId: item.templateId,
      regionId: item.regionId,
      split: item.assignedSplit,
      qualityStatus: item.currentDecision.status,
      qualityScore: item.qualityScore,
      reviewReasons: [...item.reviewReasons].sort(),
    }))
    .sort((left, right) => left.sampleId.localeCompare(right.sampleId));
  const splitSummary: DatasetSplitSummary = summarizeSplits(
    entries.map((entry) => ({ assignedSplit: entry.split })),
  );
  const regionSummary = entries.reduce(
    (summary, entry) => ({
      ...summary,
      [entry.regionId]: summary[entry.regionId] + 1,
    }),
    emptyRegionSummary(),
  );
  const qualityDistribution = entries.reduce(
    (summary, entry) => ({
      ...summary,
      [entry.qualityStatus]: summary[entry.qualityStatus] + 1,
    }),
    emptyQualityDistribution(),
  );

  return {
    datasetId: input.dataset.datasetId,
    schemaVersion: DATASET_MANIFEST_SCHEMA_VERSION,
    createdAt: input.createdAt ?? input.queue.updatedAt,
    sampleCount: entries.length,
    acceptedCount: entries.filter(
      (entry) =>
        entry.qualityStatus === 'accepted' ||
        entry.qualityStatus === 'ready_for_training',
    ).length,
    rejectedCount: entries.filter(
      (entry) =>
        entry.qualityStatus === 'rejected' || entry.qualityStatus === 'excluded',
    ).length,
    splitSummary,
    regionSummary,
    imageDeduplicationSummary: dedupeSummary(entries.map((entry) => entry.imageId)),
    templateDeduplicationSummary: dedupeSummary(
      entries.map((entry) => entry.templateId),
    ),
    qualityDistribution,
    exportFormat: input.exportFormat,
    entries,
    exportManifest: {
      exportId: `manifest-${stableHash({
        datasetId: input.dataset.datasetId,
        queueId: input.queue.queueId,
        entries,
        exportFormat: input.exportFormat,
      })}`,
      exportFormat: input.exportFormat,
      exportedAt: input.exportedAt ?? input.queue.updatedAt,
      sampleCount: entries.length,
    },
  };
};

export const exportDatasetManifest = (input: {
  dataset: HumanCorrectionDataset;
  queue: DatasetReviewQueue;
  exportFormat?: DatasetExportFormat;
  createdAt?: string;
  exportedAt?: string;
}): DatasetManifest =>
  createDatasetManifest({
    dataset: input.dataset,
    queue: input.queue,
    exportFormat: input.exportFormat ?? 'manifest',
    createdAt: input.createdAt,
    exportedAt: input.exportedAt,
  });

const summarizeTemplate = (
  template: MakeupTemplate | null | undefined,
): DatasetReplayTemplateSummary | null =>
  template
    ? {
        templateId: template.id,
        name: template.name,
        status: template.metadata.humanVerificationStatus ?? template.metadata.status,
        styleTags: [...template.metadata.styleTags].sort(),
        stepCount: template.steps.length,
        evidenceId: template.metadata.evidenceId ?? template.evidence?.evidenceId,
      }
    : null;

export const createDatasetReplayPayload = (input: {
  sample: HumanCorrectionSample;
  item: DatasetReviewItem;
  templateBefore?: MakeupTemplate | null;
  templateAfter?: MakeupTemplate | null;
}): DatasetReplayPayload => ({
  schemaVersion: DATASET_REPLAY_SCHEMA_VERSION,
  replayId: `replay-${stableHash({
    sampleId: input.sample.sampleId,
    reviewItemId: input.item.reviewItemId,
  })}`,
  sampleId: input.sample.sampleId,
  imageId: input.sample.imageId,
  templateId: input.sample.templateId,
  regionId: input.sample.regionId,
  originalMask: input.sample.originalSegmentationMask,
  humanEditedMask: input.sample.humanEditedMask,
  diffHeatmap: input.sample.maskDiff.diffHeatmap,
  originalPixelAnalysis: input.sample.originalPixelAnalysis,
  updatedPixelAnalysis: input.sample.updatedPixelAnalysis,
  originalSemantics: input.sample.originalSemantics,
  updatedSemantics: input.sample.updatedSemantics,
  templateBefore: summarizeTemplate(input.templateBefore),
  templateAfter: summarizeTemplate(input.templateAfter),
  evidenceSummary: input.item.evidenceSummary,
});

export const replayPayloadForSample = createDatasetReplayPayload;
