import type {
  TemplateProductionBatch,
  TemplateProductionBatchSummary,
  TemplateProductionTask,
  TemplateProductionTaskStatus,
} from '../schema/template-production-batch.schema';
import type {
  TemplateProductionPublishConfirmation,
  TemplateProductionQaReport,
  TemplateProductionReviewReason,
} from '../schema/template-production-qa.schema';
import { stableHash, stableStringify } from './datasetExport';
import {
  exportTemplateProductionBatchJson,
  sanitizeTemplateProductionBatchForStorage,
} from './templateProductionBatchStorage';
import {
  evaluateProductionBatchQa,
  getNextOperatorActionForTask,
} from '../../template-engine/production/templateProductionQaRules';
import { createRebindingRecoveryPlan } from '../../template-engine/production/templateProductionRebinding';
import {
  getRejectReasonDisplayText,
  summarizeRejectReasons,
} from '../../template-engine/production/templateReviewLifecycle';

const stripUndefined = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripUndefined);
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, stripUndefined(entryValue)]),
    );
  }

  return value;
};

export interface TemplateProductionBatchManifest {
  schemaVersion: 'template-production-batch-manifest-v0.1';
  manifestId: string;
  batchId: string;
  sourceImagePackageId: string;
  sourceImageManifestReference: string;
  taskCount: number;
  taskStatusCounts: Record<TemplateProductionTaskStatus, number>;
  sourceImageLineage: {
    sourceImageId: string;
    originalFileName: string;
    sourceImageStatus: string;
    seedId?: string;
  }[];
  generatedAt: string;
  notes: string[];
}

export interface TemplateProductionBatchHandoff {
  schemaVersion: 'template-production-batch-handoff-v0.2';
  batchId: string;
  name: string;
  sourceImagePackageId: string;
  sourceImageManifestReference: string;
  summary: TemplateProductionBatchSummary;
  qaSummary: Pick<
    TemplateProductionQaReport,
    | 'totalTasks'
    | 'readyForAnalysisCount'
    | 'blockingCount'
    | 'warningCount'
    | 'needsOperatorActionCount'
    | 'readyForReviewCount'
    | 'readyForPublishCount'
    | 'approvedCount'
    | 'rejectedCount'
    | 'publishedCount'
  >;
  taskStatuses: {
    taskId: string;
    sourceImageId: string;
    originalFileName: string;
    currentStatus: TemplateProductionTaskStatus;
    qaStatus?: string;
    blockingIssueCount?: number;
    warningIssueCount?: number;
    nextOperatorAction: string;
    artifactBindingStatus: TemplateProductionTask['artifactBindingStatus'];
    seedReadiness?: string;
    evidenceStatus: TemplateProductionTask['evidenceStatus'];
    templateReviewStatus: TemplateProductionTask['templateReviewStatus'];
    publishStatus: TemplateProductionTask['publishStatus'];
    issueCodes: string[];
    rejectReason?: TemplateProductionReviewReason;
    rejectReasonText?: string;
    publishConfirmationId?: string;
    needsRebinding?: boolean;
  }[];
  blockingIssues: { taskId: string; code: string; message: string; nextAction: string }[];
  warnings: { taskId: string; code: string; message: string; nextAction: string }[];
  rejectReasons: ReturnType<typeof summarizeRejectReasons>;
  publishConfirmations: {
    taskId: string;
    confirmation: TemplateProductionPublishConfirmation;
  }[];
  rebindingNeededTasks: ReturnType<typeof createRebindingRecoveryPlan>['items'];
  nextActions: string[];
  localPublishDisclaimer: string;
  nextRecommendedPhase: '6J' | '6I-2';
  boundaries: string[];
}

export interface TemplateProductionBatchReviewSummary {
  batchId: string;
  approvedCount: number;
  rejectedCount: number;
  publishedCount: number;
  rejectReasons: ReturnType<typeof summarizeRejectReasons>;
  publishConfirmations: {
    taskId: string;
    confirmationId: string;
    confirmedAt: string;
  }[];
  localPublishDisclaimer: string;
}

const handoffBoundaryNotes = [
  'No large image bytes are included.',
  'No local absolute paths are included.',
  'No object URL is treated as a long-term artifact reference.',
  'Production review states are local admin workflow states, not backend publication.',
  'SourceImagePackage cannot directly become a training dataset.',
  'Mask correction, evidence, review queue, and quality gate remain required before training.',
];

const qaSummaryFromReport = (report: TemplateProductionQaReport): TemplateProductionBatchHandoff['qaSummary'] => ({
  totalTasks: report.totalTasks,
  readyForAnalysisCount: report.readyForAnalysisCount,
  blockingCount: report.blockingCount,
  warningCount: report.warningCount,
  needsOperatorActionCount: report.needsOperatorActionCount,
  readyForReviewCount: report.readyForReviewCount,
  readyForPublishCount: report.readyForPublishCount,
  approvedCount: report.approvedCount,
  rejectedCount: report.rejectedCount,
  publishedCount: report.publishedCount,
});

export const exportProductionBatchSummary = (
  batch: TemplateProductionBatch,
): string => stableStringify(stripUndefined(sanitizeTemplateProductionBatchForStorage(batch).summary));

export const exportProductionBatchTasksJson = (
  batch: TemplateProductionBatch,
): string => stableStringify(stripUndefined(sanitizeTemplateProductionBatchForStorage(batch).tasks));

export const createProductionBatchManifest = (
  batch: TemplateProductionBatch,
  generatedAt = batch.updatedAt,
): TemplateProductionBatchManifest => {
  const sanitized = sanitizeTemplateProductionBatchForStorage(batch);

  return {
    schemaVersion: 'template-production-batch-manifest-v0.1',
    manifestId: `template-production-batch-manifest-${stableHash({
      batchId: sanitized.batchId,
      updatedAt: sanitized.updatedAt,
    })}`,
    batchId: sanitized.batchId,
    sourceImagePackageId: sanitized.sourceImagePackageId,
    sourceImageManifestReference: sanitized.sourceImageManifestReference,
    taskCount: sanitized.tasks.length,
    taskStatusCounts: sanitized.summary.taskStatusCounts,
    sourceImageLineage: sanitized.tasks.map((task) => ({
      sourceImageId: task.sourceImageId,
      originalFileName: task.originalFileName,
      sourceImageStatus: task.sourceImageStatus,
      seedId: task.templateAnalysisSeed?.seedId,
    })),
    generatedAt,
    notes: [
      'BrowserArtifactResource object URLs are runtime resources and are not persisted.',
      'SourceImagePackage cannot directly become a training dataset.',
      'Mask correction, evidence, review queue, and quality gate remain required before training.',
      'Local published state is not backend or online publication.',
    ],
  };
};

export const exportProductionBatchQaReport = (
  batch: TemplateProductionBatch,
): string => stableStringify(stripUndefined(evaluateProductionBatchQa(sanitizeTemplateProductionBatchForStorage(batch))));

export const exportProductionBatchReviewSummary = (
  batch: TemplateProductionBatch,
): string => {
  const sanitized = sanitizeTemplateProductionBatchForStorage(batch);
  const reviewSummary: TemplateProductionBatchReviewSummary = {
    batchId: sanitized.batchId,
    approvedCount: sanitized.tasks.filter((task) => task.currentStatus === 'approved').length,
    rejectedCount: sanitized.tasks.filter((task) => task.currentStatus === 'rejected').length,
    publishedCount: sanitized.tasks.filter((task) => task.currentStatus === 'published').length,
    rejectReasons: summarizeRejectReasons(sanitized.tasks),
    publishConfirmations: sanitized.tasks.flatMap((task) =>
      task.publishConfirmation
        ? [
            {
              taskId: task.taskId,
              confirmationId: task.publishConfirmation.confirmationId,
              confirmedAt: task.publishConfirmation.confirmedAt,
            },
          ]
        : [],
    ),
    localPublishDisclaimer:
      'published is a local admin workflow state only; it is not online publication and does not create a training dataset.',
  };

  return stableStringify(stripUndefined(reviewSummary));
};

export const includeRejectReasonsInBatchExport = (
  batch: TemplateProductionBatch,
): { taskId: string; reason: TemplateProductionReviewReason; label: string; note?: string }[] =>
  sanitizeTemplateProductionBatchForStorage(batch).tasks.flatMap((task) =>
    task.rejectReason
      ? [
          {
            taskId: task.taskId,
            reason: task.rejectReason,
            label: getRejectReasonDisplayText(task.rejectReason),
            note: task.rejectNote,
          },
        ]
      : [],
  );

export const includePublishConfirmationsInBatchExport = (
  batch: TemplateProductionBatch,
): { taskId: string; confirmation: TemplateProductionPublishConfirmation }[] =>
  sanitizeTemplateProductionBatchForStorage(batch).tasks.flatMap((task) =>
    task.publishConfirmation
      ? [{ taskId: task.taskId, confirmation: task.publishConfirmation }]
      : [],
  );

export const exportProductionBatchOperatorHandoff = (
  batch: TemplateProductionBatch,
): string => {
  const sanitized = sanitizeTemplateProductionBatchForStorage(batch);
  const qa = evaluateProductionBatchQa(sanitized);
  const rebindingPlan = createRebindingRecoveryPlan(sanitized, sanitized.updatedAt);
  const handoff: TemplateProductionBatchHandoff = {
    schemaVersion: 'template-production-batch-handoff-v0.2',
    batchId: sanitized.batchId,
    name: sanitized.name,
    sourceImagePackageId: sanitized.sourceImagePackageId,
    sourceImageManifestReference: sanitized.sourceImageManifestReference,
    summary: sanitized.summary,
    qaSummary: qaSummaryFromReport(qa),
    taskStatuses: sanitized.tasks.map((task) => {
      const qaItem = qa.items.find((item) => item.taskId === task.taskId);

      return {
        taskId: task.taskId,
        sourceImageId: task.sourceImageId,
        originalFileName: task.originalFileName,
        currentStatus: task.currentStatus,
        qaStatus: qaItem?.qaStatus,
        blockingIssueCount: qaItem?.blockingIssueCount,
        warningIssueCount: qaItem?.warningCount,
        nextOperatorAction: qaItem?.nextOperatorAction ?? getNextOperatorActionForTask(task),
        artifactBindingStatus: task.artifactBindingStatus,
        seedReadiness: task.templateAnalysisSeed?.readiness,
        evidenceStatus: task.evidenceStatus,
        templateReviewStatus: task.templateReviewStatus,
        publishStatus: task.publishStatus,
        issueCodes: task.issues.map((issue) => issue.code),
        rejectReason: task.rejectReason,
        rejectReasonText: task.rejectReason
          ? getRejectReasonDisplayText(task.rejectReason)
          : undefined,
        publishConfirmationId: task.publishConfirmation?.confirmationId,
        needsRebinding: qaItem?.needsRebinding,
      };
    }),
    blockingIssues: qa.items.flatMap((item) =>
      item.blockingIssues.map((issue) => ({
        taskId: item.taskId,
        code: issue.code,
        message: issue.message,
        nextAction: issue.nextAction,
      })),
    ),
    warnings: qa.items.flatMap((item) =>
      item.warningIssues.map((issue) => ({
        taskId: item.taskId,
        code: issue.code,
        message: issue.message,
        nextAction: issue.nextAction,
      })),
    ),
    rejectReasons: summarizeRejectReasons(sanitized.tasks),
    publishConfirmations: includePublishConfirmationsInBatchExport(sanitized),
    rebindingNeededTasks: rebindingPlan.items,
    nextActions: sanitized.summary.nextActions,
    localPublishDisclaimer:
      'published is local admin state only; it is not online publication, uploads nothing, and creates no training dataset.',
    nextRecommendedPhase: qa.blockingCount === 0 ? '6J' : '6I-2',
    boundaries: handoffBoundaryNotes,
  };

  return stableStringify(stripUndefined(handoff));
};

export const exportProductionBatchHandoff = (
  batch: TemplateProductionBatch,
): string => exportProductionBatchOperatorHandoff(batch);

export const exportProductionBatchSnapshot = (
  batch: TemplateProductionBatch,
): string => exportTemplateProductionBatchJson(batch);
