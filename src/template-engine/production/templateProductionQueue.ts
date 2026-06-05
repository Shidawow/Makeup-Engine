import type {
  TemplateProductionBatch,
  TemplateProductionSource,
  TemplateProductionTask,
} from '../../templates/schema/template-production-batch.schema';
import { TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION } from '../../templates/schema/template-production-batch.schema';
import type { SourceImageArtifactBindingMap } from '../../templates/schema';
import type { SourceImageManifest } from '../../training/schema';
import {
  createBatchTemplateAnalysisSeeds,
} from '../../templates/storage/sourceImagePackageStorage';
import { stableHash } from '../../templates/storage/datasetExport';
import {
  filterProductionTasksByStatus,
  summarizeBatchTaskIssues,
  updateProductionTaskStatus,
} from './templateProductionStateMachine';
import { summarizeTemplateProductionBatch } from './templateProductionSummary';
import { attachVisionAnalysisResultToProductionTask } from './templateProductionAnalysisHandoff';

export interface TemplateProductionBatchCreationInput {
  manifest: SourceImageManifest;
  manifestReference?: string;
  artifactBindings?: SourceImageArtifactBindingMap;
  name?: string;
  createdAt?: string;
  source?: TemplateProductionSource;
}

export const createTemplateProductionBatchFromSourceImages = (
  input: TemplateProductionBatchCreationInput,
): TemplateProductionBatch => {
  const creation = createBatchTemplateAnalysisSeeds(input);
  const manifestReference =
    input.manifestReference ??
    `source-image-package://${input.manifest.packageId}/manifest.json`;
  const batchId = `template-production-batch-${stableHash({
    packageId: input.manifest.packageId,
    manifestReference,
    name: input.name ?? input.manifest.packageId,
  })}`;
  const createdAt = input.createdAt ?? input.manifest.createdAt;

  const batch: TemplateProductionBatch = {
    schemaVersion: TEMPLATE_PRODUCTION_BATCH_SCHEMA_VERSION,
    batchId,
    name: input.name ?? `Production Batch ${input.manifest.packageId}`,
    sourceImagePackageId: input.manifest.packageId,
    sourceImageManifestReference: manifestReference,
    createdAt,
    updatedAt: createdAt,
    tasks: creation.tasks,
    summary: summarizeTemplateProductionBatch({ tasks: creation.tasks }),
    status:
      creation.summary.readyForAnalysisTasks > 0
        ? 'active'
        : creation.summary.needsArtifactBindingTasks > 0
          ? 'blocked'
          : 'draft',
    issues: summarizeBatchTaskIssues(creation.tasks),
    metadata: {
      sourceImageManifestReference: manifestReference,
      createdBy: 'template-studio',
      source: input.source ?? 'source-image-package',
    },
  };

  return {
    ...batch,
    summary: summarizeTemplateProductionBatch(batch),
  };
};

export const createProductionTaskFromTemplateAnalysisSeed = (
  input: {
    taskId?: string;
    seed: NonNullable<TemplateProductionTask['templateAnalysisSeed']>;
    originalFileName: string;
    sourceImageStatus: string;
    sourceImageReadiness: string;
    createdAt?: string;
  },
): TemplateProductionTask => ({
  taskId:
    input.taskId ??
    `template-production-task-${stableHash({
      seedId: input.seed.seedId,
      sourceImageId: input.seed.sourceImageId,
    })}`,
  sourceImageId: input.seed.sourceImageId,
  originalFileName: input.originalFileName,
  sourceImageStatus: input.sourceImageStatus,
  sourceImageReadiness: input.sourceImageReadiness,
  templateAnalysisSeed: input.seed,
  artifactBindingStatus: input.seed.boundArtifactResource ? 'validated' : 'missing',
  analysisStatus: input.seed.readiness === 'ready_for_vision_analysis' ? 'ready' : 'not_started',
  maskReviewStatus: 'not_requested',
  humanCorrectionStatus: 'not_requested',
  evidenceStatus: 'missing',
  templateReviewStatus: 'not_requested',
  publishStatus: 'not_requested',
  currentStatus:
    input.seed.readiness === 'ready_for_vision_analysis'
      ? 'ready_for_analysis'
      : 'needs_artifact_binding',
  issues: [],
  events: [
    {
      eventId: `seed-${input.seed.seedId}-created`,
      eventType: 'seed-created',
      status:
        input.seed.readiness === 'ready_for_vision_analysis'
          ? 'ready_for_analysis'
          : 'needs_artifact_binding',
      timestamp: input.createdAt ?? input.seed.createdAt,
      message: 'task created from template analysis seed',
      metadata: {
        seedId: input.seed.seedId,
      },
    },
  ],
  createdAt: input.createdAt ?? input.seed.createdAt,
  updatedAt: input.createdAt ?? input.seed.createdAt,
});

export const filterTasksForNextAction = (
  tasks: readonly TemplateProductionTask[],
): TemplateProductionTask[] =>
  filterProductionTasksByStatus(tasks, [
    'needs_artifact_binding',
    'ready_for_analysis',
    'analysis_complete',
    'needs_mask_review',
    'needs_human_correction',
    'correction_complete',
    'evidence_ready',
    'ready_for_template_review',
    'approved',
    'rejected',
    'published',
  ]);

export const batchTaskSummaryText = (batch: TemplateProductionBatch): string =>
  JSON.stringify(summarizeTemplateProductionBatch(batch));

export const updateProductionTaskFromAnalysis = (
  task: TemplateProductionTask,
  analysis: Parameters<typeof attachVisionAnalysisResultToProductionTask>[0]['analysis'],
  template?: Parameters<typeof attachVisionAnalysisResultToProductionTask>[0]['template'],
  previewId?: string,
  evidenceReady?: boolean,
): TemplateProductionTask => {
  const handoff = attachVisionAnalysisResultToProductionTask({
    task,
    analysis,
    template,
    previewId,
    evidenceReady,
  });

  return updateProductionTaskStatus(
    {
      ...handoff,
      analysisStatus: 'complete',
    },
    evidenceReady ? 'evidence_ready' : 'analysis_complete',
    evidenceReady ? 'analysis complete and evidence ready' : 'analysis complete',
    {
      templateId: template?.id ?? null,
      previewId: previewId ?? null,
    },
  );
};
