import type { MakeupAnalysisPipelineResult } from '../../vision';
import type { MakeupTemplate } from '../../templates/schema';
import type {
  TemplateProductionTask,
  TemplateProductionTaskIssue,
} from '../../templates/schema/template-production-batch.schema';

export interface ProductionTaskAnalysisSummary {
  sourceImageId: string;
  taskId: string;
  templateId?: string;
  previewId?: string;
  traceSummary: string[];
  evidenceReady: boolean;
  noteCount: number;
}

export interface ProductionTaskAnalysisHandoff {
  summary: ProductionTaskAnalysisSummary;
  task: TemplateProductionTask;
}

const issue = (
  code: string,
  message: string,
  severity: TemplateProductionTaskIssue['severity'] = 'info',
): TemplateProductionTaskIssue => ({
  code,
  message,
  severity,
  source: 'analysis',
});

export const createAnalysisResultHandoff = (input: {
  task: TemplateProductionTask;
  analysis: MakeupAnalysisPipelineResult;
  template?: MakeupTemplate | null;
  previewId?: string;
  evidenceReady?: boolean;
}): ProductionTaskAnalysisHandoff => {
  const traceSummary = [...new Set(input.analysis.trace)].slice(0, 12);

  return {
    summary: {
      sourceImageId: input.task.sourceImageId,
      taskId: input.task.taskId,
      templateId: input.template?.id,
      previewId: input.previewId,
      traceSummary,
      evidenceReady: Boolean(input.evidenceReady),
      noteCount: traceSummary.length,
    },
    task: {
      ...input.task,
      analysisSummary: {
        templateId: input.template?.id,
        previewId: input.previewId,
        traceSummary,
        evidenceReady: Boolean(input.evidenceReady),
        sourceImageId: input.task.sourceImageId,
        seedId: input.task.templateAnalysisSeed?.seedId,
      },
    },
  };
};

export const attachVisionAnalysisResultToProductionTask = (input: {
  task: TemplateProductionTask;
  analysis: MakeupAnalysisPipelineResult;
  template?: MakeupTemplate | null;
  previewId?: string;
  evidenceReady?: boolean;
}): TemplateProductionTask =>
  createAnalysisResultHandoff(input).task;

export const attachTemplatePreviewToProductionTask = (
  task: TemplateProductionTask,
  previewId: string,
): TemplateProductionTask => ({
  ...task,
  analysisSummary: {
    ...(task.analysisSummary ?? {}),
    previewId,
    sourceImageId: task.sourceImageId,
  },
});

export const attachEvidenceSummaryToProductionTask = (
  task: TemplateProductionTask,
  evidenceReady: boolean,
): TemplateProductionTask => ({
  ...task,
  analysisSummary: {
    ...(task.analysisSummary ?? {}),
    evidenceReady,
    sourceImageId: task.sourceImageId,
  },
});

export const summarizeProductionTaskAnalysisResult = (
  task: TemplateProductionTask,
): ProductionTaskAnalysisSummary => ({
  sourceImageId: task.sourceImageId,
  taskId: task.taskId,
  templateId: task.analysisSummary?.templateId,
  previewId: task.analysisSummary?.previewId,
  traceSummary: [...(task.analysisSummary?.traceSummary ?? [])],
  evidenceReady: Boolean(task.analysisSummary?.evidenceReady),
  noteCount: task.analysisSummary?.traceSummary?.length ?? 0,
});

