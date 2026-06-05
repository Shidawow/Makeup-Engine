import type { MakeupRegion, MakeupTemplate } from '../../templates/schema';
import type {
  TemplateProductionBatch,
  TemplateProductionTask,
  TemplateProductionTaskIssue,
} from '../../templates/schema/template-production-batch.schema';
import type {
  TemplateLibrary,
  TemplateLibraryEntry,
  TemplateLibraryEntryIssue,
  TemplateLibraryEntryLineage,
  TemplateLibraryEntryMetadata,
  TemplateLibraryEntryQuality,
  TemplateLibraryEntrySource,
  TemplateLibraryEntryStatus,
  TemplateLibraryValidationResult,
  TemplateLibraryEvidenceSummary,
} from '../../templates/schema/template-library.schema';
import { stableHash } from '../../templates/storage/datasetExport';
import { createInitialTemplateVersion } from './templateVersioning';

const now = () => new Date().toISOString();

const libraryIssue = (
  code: string,
  message: string,
  severity: TemplateLibraryEntryIssue['severity'],
  source: TemplateLibraryEntryIssue['source'],
): TemplateLibraryEntryIssue => ({
  code,
  message,
  severity,
  source,
});

const taskToIssue = (issue: TemplateProductionTaskIssue): TemplateLibraryEntryIssue => ({
  code: issue.code,
  message: issue.message,
  severity: issue.severity === 'error' ? 'blocking' : issue.severity,
  source:
    issue.source === 'source-image-package'
      ? 'production-task'
      : issue.source === 'artifact-binding'
        ? 'production-task'
        : issue.source === 'seed'
          ? 'production-task'
          : issue.source === 'analysis'
            ? 'production-task'
            : issue.source === 'mask-review'
              ? 'production-task'
              : issue.source === 'human-correction'
                ? 'production-task'
                : issue.source === 'evidence'
                  ? 'evidence'
                  : issue.source === 'template-review'
                    ? 'library-review'
                    : issue.source === 'publish'
                      ? 'library-review'
                      : 'storage',
});

const stripUndefined = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripUndefined);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, nextValue]) => nextValue !== undefined)
        .map(([key, nextValue]) => [key, stripUndefined(nextValue)]),
    );
  }

  return value;
};

const summarizeSteps = (template: MakeupTemplate): string[] =>
  template.steps.map((step) => `${step.region}:${step.tool}:${step.action}`);

const buildEvidenceSummary = (task: TemplateProductionTask): TemplateLibraryEvidenceSummary => ({
  evidenceId: task.analysisSummary?.templateId ? `evidence-${task.analysisSummary.templateId}` : undefined,
  templateId: task.analysisSummary?.templateId,
  evidenceReady: task.evidenceStatus === 'ready',
  humanVerificationStatus:
    task.analysisSummary?.evidenceReady || task.evidenceStatus === 'ready'
      ? 'ready_for_dataset'
      : 'ai_generated',
  sourceImageId: task.sourceImageId,
  notes: [
    ...(task.analysisSummary?.traceSummary ?? []),
    ...(task.rejectReason ? [`reject:${task.rejectReason}`] : []),
    ...(task.rejectNote ? [task.rejectNote] : []),
  ],
  references: [
    task.analysisSummary?.previewId ? `preview:${task.analysisSummary.previewId}` : undefined,
    task.templateAnalysisSeed?.seedId ? `seed:${task.templateAnalysisSeed.seedId}` : undefined,
  ].filter((item): item is string => Boolean(item)),
});

export interface ProductionToLibraryConversionInput {
  task: TemplateProductionTask;
  template?: MakeupTemplate | null;
  sourceProductionBatchId?: string;
  displayName?: string;
  category?: string;
  supportedUseCases?: string[];
  createdAt?: string;
}

export const validateProductionTaskReadyForLibrary = (
  task: TemplateProductionTask,
  template?: MakeupTemplate | null,
): TemplateLibraryValidationResult & { recommendedStatus?: TemplateLibraryEntryStatus } => {
  const issues: TemplateLibraryEntryIssue[] = [];

  if (!['approved', 'published'].includes(task.currentStatus)) {
    issues.push(
      libraryIssue(
        'production-task-not-approved',
        '只有 approved 或 local_published 的 production task 才能进入 template library',
        'blocking',
        'production-task',
      ),
    );
  }

  if (task.currentStatus === 'rejected' || task.templateReviewStatus === 'rejected') {
    issues.push(
      libraryIssue(
        'rejected-task-not-eligible',
        'rejected task 不能转换为 library entry',
        'blocking',
        'production-task',
      ),
    );
  }

  if (task.evidenceStatus !== 'ready') {
    issues.push(
      libraryIssue(
        'evidence-required',
        '缺少 evidence 的 task 不能转换为 library entry',
        'blocking',
        'evidence',
      ),
    );
  }

  if (!template) {
    issues.push(
      libraryIssue(
        'template-required',
        '缺少 makeup template 或 template preview 的 task 不能转换',
        'blocking',
        'template-data',
      ),
    );
  }

  if (task.currentStatus === 'approved' && task.publishStatus !== 'published') {
    return {
      valid: issues.every((issue) => issue.severity !== 'blocking'),
      issues,
      recommendedStatus: issues.length > 0 ? 'needs_library_review' : 'imported_from_production',
    };
  }

  return {
    valid: issues.length === 0,
    issues,
    recommendedStatus:
      task.currentStatus === 'published'
        ? 'local_published'
        : issues.length > 0
          ? 'needs_library_review'
          : 'ready_for_package',
  };
};

export const extractTemplateLibraryMetadata = (
  task: TemplateProductionTask,
  template: MakeupTemplate,
  input?: { displayName?: string; category?: string; supportedUseCases?: string[] },
): TemplateLibraryEntryMetadata => ({
  displayName: input?.displayName ?? template.name,
  category: input?.category ?? template.metadata.semanticEnrichment?.makeupStyleName ?? template.metadata.source.sourceType,
  styleTags: [...new Set([...(template.metadata.styleTags ?? []), ...template.style.signatureTraits])],
  regionCoverage: template.regions.map((region) => region.region),
  supportedUseCases:
    input?.supportedUseCases ??
    Array.from(
      new Set([
        ...template.goals,
        ...(template.metadata.semanticEnrichment?.qaSuggestions ?? []),
        `source-image:${task.sourceImageId}`,
      ]),
    ),
  createdBy: 'template-studio',
  localOnly: true,
  onlinePublished: false,
});

export const extractTemplateStyleTags = (template: MakeupTemplate): string[] =>
  [...new Set([...template.metadata.styleTags, ...template.style.signatureTraits])];

export const extractTemplateRegionCoverage = (template: MakeupTemplate): MakeupRegion[] =>
  template.regions.map((region) => region.region);

export const extractTemplateEvidenceSummary = (
  task: TemplateProductionTask,
): TemplateLibraryEvidenceSummary => buildEvidenceSummary(task);

export const extractTemplateQualitySummary = (
  task: TemplateProductionTask,
  template: MakeupTemplate,
): TemplateLibraryEntryQuality => {
  const metrics = template.metadata.visionMetrics;
  const qualityScore = metrics
    ? Number(
        (
          [
            metrics.opacityConfidence ?? 0,
            metrics.edgeSoftness ?? 0,
            metrics.diffusionQuality ?? 0,
            metrics.skinRelativeIntensity ?? 0,
          ].reduce((sum, value) => sum + value, 0) / 4
        ).toFixed(4),
      )
    : undefined;

  return {
    qualityScore,
    confidence: template.faceSuitability.confidence,
    evidenceReady: task.evidenceStatus === 'ready',
    blockingIssueCount: task.issues.filter((issue) => issue.severity === 'error').length,
    warningIssueCount: task.issues.filter((issue) => issue.severity === 'warning').length,
    notes: [
      ...(template.notes ?? []),
      ...(task.analysisSummary?.traceSummary ?? []),
      ...(task.rejectReason ? [`reject:${task.rejectReason}`] : []),
    ],
  };
};

export const createLibraryEntryLineage = (
  task: TemplateProductionTask,
  template: MakeupTemplate,
  evidenceSummary: TemplateLibraryEvidenceSummary,
  sourceProductionBatchId?: string,
): TemplateLibraryEntryLineage => ({
  source: {
    sourceType: 'production-task',
    sourceProductionBatchId: sourceProductionBatchId ?? `production-batch-${stableHash(task.taskId)}`,
    sourceProductionTaskId: task.taskId,
    sourceImageId: task.sourceImageId,
    sourceImagePackageId: task.templateAnalysisSeed?.sourceImagePackageId,
    templateAnalysisSeedId: task.templateAnalysisSeed?.seedId,
    sourceImageManifestReference: task.templateAnalysisSeed?.sourceImageManifestReference,
  },
  sourceImageLineage: {
    sourceImageId: task.sourceImageId,
    sourceImageStatus: task.sourceImageStatus,
    sourceImageReadiness: task.sourceImageReadiness,
    artifactBindingStatus: task.artifactBindingStatus,
  },
  analysisSummary: {
    templateId: task.analysisSummary?.templateId ?? template.id,
    previewId: task.analysisSummary?.previewId,
    traceSummary: [...(task.analysisSummary?.traceSummary ?? [])],
    evidenceReady: evidenceSummary.evidenceReady,
  },
  reviewSummary: {
    productionStatus: task.currentStatus,
    templateReviewStatus: task.templateReviewStatus,
    publishStatus: task.publishStatus,
    rejectReason: task.rejectReason,
    rejectNote: task.rejectNote,
  },
  publishConfirmationSummary: task.publishConfirmation
    ? {
        confirmationId: task.publishConfirmation.confirmationId,
        confirmedAt: task.publishConfirmation.confirmedAt,
        confirmedBy: task.publishConfirmation.confirmedBy,
        localPublished: true,
        notOnlineRelease: true,
        noTrainingDataset: true,
      }
    : undefined,
});

export const createLibraryEntryFromProductionTask = (
  input: ProductionToLibraryConversionInput,
): TemplateLibraryEntry => {
  const validation = validateProductionTaskReadyForLibrary(input.task, input.template);

  if (!input.template) {
    throw new Error('makeup template is required to create a template library entry');
  }

  const evidenceSummary = extractTemplateEvidenceSummary(input.task);
  const qualitySummary = extractTemplateQualitySummary(input.task, input.template);
  const lineage = createLibraryEntryLineage(
    input.task,
    input.template,
    evidenceSummary,
    input.sourceProductionBatchId,
  );
  const versionHistory = [
    {
      version: createInitialTemplateVersion(),
      changeType: 'initial' as const,
      createdAt: input.createdAt ?? input.task.updatedAt,
      reason: 'Imported from production task',
      notes: [input.task.currentStatus, input.task.templateReviewStatus, input.task.publishStatus],
    },
  ];
  const baseStatus: TemplateLibraryEntryStatus =
    input.task.currentStatus === 'published'
      ? 'local_published'
      : validation.valid
        ? 'imported_from_production'
        : 'needs_library_review';
  if (
    validation.issues.some((validationIssue) =>
      ['production-task-not-approved', 'rejected-task-not-eligible', 'evidence-required'].includes(
        validationIssue.code,
      ),
    )
  ) {
    throw new Error(validation.issues.map((validationIssue) => validationIssue.message).join('; '));
  }
  const entryId = `template-library-entry-${stableHash({
    taskId: input.task.taskId,
    templateId: input.template.id,
    status: baseStatus,
  })}`;

  return {
    libraryEntryId: entryId,
    templateId: input.template.id,
    templateVersion: createInitialTemplateVersion(),
    sourceProductionBatchId: lineage.source.sourceProductionBatchId,
    sourceProductionTaskId: input.task.taskId,
    sourceImageId: input.task.sourceImageId,
    makeupTemplate: input.template,
    evidenceSummary,
    qualitySummary,
    reviewSummary: lineage.reviewSummary,
    publishConfirmationSummary: lineage.publishConfirmationSummary,
    styleTags: extractTemplateStyleTags(input.template),
    regionCoverage: extractTemplateRegionCoverage(input.template),
    supportedUseCases: input.template.goals,
    status: baseStatus,
    versionHistory,
    lineage,
    issues: validation.issues.concat(
      validation.valid
        ? []
        : [
            libraryIssue(
              'library-review-required',
              '缺少 template 或 evidence、review 信息时，library entry 必须进入 needs_library_review',
              'warning',
              'library-review',
            ),
          ],
    ),
    metadata: extractTemplateLibraryMetadata(input.task, input.template, {
      displayName: input.displayName,
      category: input.category,
      supportedUseCases: input.supportedUseCases,
    }),
    createdAt: input.createdAt ?? input.task.updatedAt,
    updatedAt: input.createdAt ?? input.task.updatedAt,
  };
};

export const createLibraryEntriesFromProductionBatch = (input: {
  batch: TemplateProductionBatch;
  templateByTaskId?: Record<string, MakeupTemplate | undefined>;
  displayNameByTaskId?: Record<string, string | undefined>;
  categoryByTaskId?: Record<string, string | undefined>;
  createdAt?: string;
}): TemplateLibraryEntry[] =>
  [...input.batch.tasks]
    .sort((left, right) => left.taskId.localeCompare(right.taskId))
    .flatMap((task) => {
      const template = input.templateByTaskId?.[task.taskId];

      if (!template) {
        return [];
      }

      const validation = validateProductionTaskReadyForLibrary(task, template);
      if (
        validation.issues.some((validationIssue) =>
          ['production-task-not-approved', 'rejected-task-not-eligible', 'evidence-required'].includes(
            validationIssue.code,
          ),
        )
      ) {
        return [];
      }

      return [
        createLibraryEntryFromProductionTask({
          task,
          template,
          sourceProductionBatchId: input.batch.batchId,
          displayName: input.displayNameByTaskId?.[task.taskId],
          category: input.categoryByTaskId?.[task.taskId],
          createdAt: input.createdAt,
        }),
      ];
    });

export const summarizeProductionToLibraryConversion = (entries: readonly TemplateLibraryEntry[]): string =>
  JSON.stringify(
    stripUndefined({
      entryCount: entries.length,
      statuses: entries.reduce<Record<string, number>>((counts, entry) => {
        counts[entry.status] = (counts[entry.status] ?? 0) + 1;
        return counts;
      }, {}),
    }),
  );

export const createTemplateLibrarySummary = (
  library: TemplateLibrary,
): TemplateLibrary['summary'] => ({
  totalEntries: library.entries.length,
  needsReview: library.entries.filter((entry) => entry.status === 'needs_library_review').length,
  readyForPackage: library.entries.filter((entry) => entry.status === 'ready_for_package').length,
  packaged: library.entries.filter((entry) => entry.status === 'packaged').length,
  localPublished: library.entries.filter((entry) => entry.status === 'local_published').length,
  rejected: library.entries.filter((entry) => entry.status === 'rejected').length,
  archived: library.entries.filter((entry) => entry.status === 'archived').length,
  deprecated: library.entries.filter((entry) => entry.status === 'deprecated').length,
  issueCount: library.entries.reduce((sum, entry) => sum + entry.issues.length, 0),
  nextActions: library.entries.flatMap((entry) =>
    entry.status === 'needs_library_review'
      ? [`review ${entry.templateId}`]
      : entry.status === 'ready_for_package'
        ? [`package ${entry.templateId}`]
        : entry.status === 'packaged'
          ? [`local publish ${entry.templateId}`]
          : entry.status === 'local_published'
            ? [`archive or deprecate ${entry.templateId}`]
            : [],
  ),
});
