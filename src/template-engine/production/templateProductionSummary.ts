import type {
  TemplateProductionArtifactState,
  TemplateProductionBatch,
  TemplateProductionBatchReadiness,
  TemplateProductionBatchSummary,
  TemplateProductionReviewState,
  TemplateProductionTask,
  TemplateProductionTaskStatus,
} from '../../templates/schema/template-production-batch.schema';

export const templateProductionTaskStatusOrder: TemplateProductionTaskStatus[] = [
  'draft',
  'blocked_by_source_image',
  'needs_artifact_binding',
  'ready_for_analysis',
  'analyzing',
  'analysis_failed',
  'analysis_complete',
  'needs_mask_review',
  'needs_human_correction',
  'correction_complete',
  'evidence_ready',
  'ready_for_template_review',
  'approved',
  'rejected',
  'published',
];

const makeStatusCounts = <T extends string>(items: readonly T[], values: readonly T[]): Record<T, number> =>
  values.reduce<Record<T, number>>(
    (acc, value) => ({
      ...acc,
      [value]: items.filter((item) => item === value).length,
    }),
    {} as Record<T, number>,
  );

const readinessFromTask = (task: TemplateProductionTask): keyof TemplateProductionBatchReadiness => {
  switch (task.currentStatus) {
    case 'ready_for_analysis':
      return 'readyForAnalysis';
    case 'needs_artifact_binding':
      return 'needsArtifactBinding';
    case 'blocked_by_source_image':
      return 'blockedBySourceImage';
    case 'analyzing':
      return 'analyzing';
    case 'analysis_complete':
      return 'analysisComplete';
    case 'needs_mask_review':
      return 'needsMaskReview';
    case 'needs_human_correction':
      return 'needsHumanCorrection';
    case 'evidence_ready':
      return 'evidenceReady';
    case 'ready_for_template_review':
      return 'readyForTemplateReview';
    case 'approved':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'published':
      return 'published';
    case 'correction_complete':
      return 'needsHumanCorrection';
    case 'analysis_failed':
      return 'blockedBySourceImage';
    default:
      return 'needsArtifactBinding';
  }
};

export const summarizeTemplateProductionBatch = (
  batch: Pick<TemplateProductionBatch, 'tasks'> & Partial<TemplateProductionBatch>,
): TemplateProductionBatchSummary => {
  const tasks = [...(batch.tasks ?? [])];
  const taskStatusCounts = templateProductionTaskStatusOrder.reduce<
    Record<TemplateProductionTaskStatus, number>
  >(
    (acc, status) => ({
      ...acc,
      [status]: tasks.filter((task) => task.currentStatus === status).length,
    }),
    {} as Record<TemplateProductionTaskStatus, number>,
  );
  const artifactBindingStates = tasks.map((task) => task.artifactBindingStatus);
  const reviewStates = tasks.map((task) => task.templateReviewStatus);
  const readiness = tasks.reduce<TemplateProductionBatchReadiness>(
    (acc, task) => ({
      ...acc,
      [readinessFromTask(task)]: acc[readinessFromTask(task)] + 1,
    }),
    {
      readyForAnalysis: 0,
      needsArtifactBinding: 0,
      blockedBySourceImage: 0,
      analyzing: 0,
      analysisComplete: 0,
      needsMaskReview: 0,
      needsHumanCorrection: 0,
      evidenceReady: 0,
      readyForTemplateReview: 0,
      approved: 0,
      rejected: 0,
      published: 0,
    },
  );
  const nextActions = Array.from(
    new Set(
      tasks.map((task) => {
        switch (task.currentStatus) {
          case 'draft':
            return 'Create production tasks from ready source images';
          case 'blocked_by_source_image':
            return 'Review blocked source image reason';
          case 'needs_artifact_binding':
            return 'Bind normalized PNG or JSON RGBA artifact';
          case 'ready_for_analysis':
            return 'Send task to Vision Analysis';
          case 'analysis_failed':
            return 'Retry analysis or inspect issues';
          case 'analysis_complete':
            return 'Send task to mask review';
          case 'needs_mask_review':
            return 'Open mask editing and correction';
          case 'needs_human_correction':
            return 'Complete human correction';
          case 'correction_complete':
            return 'Mark evidence ready';
          case 'evidence_ready':
            return 'Send task to template review';
          case 'ready_for_template_review':
            return 'Approve or reject template';
          case 'approved':
            return 'Publish approved template locally';
          case 'rejected':
            return 'Capture rejection reason and stop publish';
          case 'published':
            return 'Batch task already published';
          case 'analyzing':
            return 'Wait for analysis to finish';
          default:
            return 'No action';
        }
      }),
    ),
  );

  return {
    totalTasks: tasks.length,
    sourceImageCount: batch.tasks?.length ?? 0,
    readySourceImageCount: tasks.filter((task) => task.sourceImageStatus === 'ready_for_template_analysis').length,
    blockedSourceImageCount: tasks.filter((task) => task.sourceImageStatus === 'blocked_by_codec' || task.sourceImageStatus === 'blocked_by_quality' || task.sourceImageStatus === 'failed').length,
    failedSourceImageCount: tasks.filter((task) => task.sourceImageStatus === 'failed').length,
    validTasks: tasks.filter((task) => task.issues.length === 0).length,
    invalidTasks: tasks.filter((task) => task.issues.length > 0).length,
    taskStatusCounts,
    artifactBindingCounts: makeStatusCounts(
      artifactBindingStates,
      ['missing', 'needs_artifact_binding', 'bound', 'validated', 'unsupported'],
    ) as Record<TemplateProductionArtifactState, number>,
    reviewStateCounts: makeStatusCounts(
      reviewStates,
      ['not_requested', 'ready_for_review', 'approved', 'rejected', 'published'],
    ) as Record<TemplateProductionReviewState, number>,
    nextActions,
    ...readiness,
  };
};
