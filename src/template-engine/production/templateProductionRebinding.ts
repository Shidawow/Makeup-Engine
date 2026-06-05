import type {
  TemplateProductionBatch,
  TemplateProductionTask,
  TemplateProductionTaskIssue,
} from '../../templates/schema/template-production-batch.schema';
import { appendProductionTaskEvent } from './templateProductionStateMachine';
import { taskNeedsRebinding } from './templateProductionQaRules';

export interface TemplateProductionRebindingPlanItem {
  taskId: string;
  sourceImageId: string;
  originalFileName: string;
  reason: 'object-url-expired' | 'browser-resource-missing';
  nextAction: string;
}

export interface TemplateProductionRebindingPlan {
  generatedAt: string;
  taskCount: number;
  items: TemplateProductionRebindingPlanItem[];
}

export interface TemplateProductionRebindingValidationResult {
  valid: boolean;
  tasksNeedingRebinding: TemplateProductionRebindingPlanItem[];
  issues: TemplateProductionTaskIssue[];
}

const rebindingIssue = (): TemplateProductionTaskIssue => ({
  code: 'artifact-rebinding-required',
  message: 'BrowserArtifactResource 已失效或不存在，需要 operator 重新绑定 normalized PNG / JSON RGBA artifact',
  severity: 'warning',
  source: 'rebinding',
});

const planItemFromTask = (task: TemplateProductionTask): TemplateProductionRebindingPlanItem => ({
  taskId: task.taskId,
  sourceImageId: task.sourceImageId,
  originalFileName: task.originalFileName,
  reason: task.templateAnalysisSeed?.boundArtifactResource ? 'object-url-expired' : 'browser-resource-missing',
  nextAction: '回到 artifact binding 面板，重新选择 normalized PNG 或 JSON RGBA 文件',
});

export const detectTasksNeedingRebinding = (
  tasksOrBatch: readonly TemplateProductionTask[] | TemplateProductionBatch,
): TemplateProductionTask[] => {
  const tasks = 'tasks' in tasksOrBatch ? tasksOrBatch.tasks : tasksOrBatch;
  return tasks.filter(taskNeedsRebinding);
};

export const createRebindingRecoveryPlan = (
  tasksOrBatch: readonly TemplateProductionTask[] | TemplateProductionBatch,
  generatedAt = '2026-05-31T00:00:00.000Z',
): TemplateProductionRebindingPlan => {
  const tasks = detectTasksNeedingRebinding(tasksOrBatch);

  return {
    generatedAt,
    taskCount: tasks.length,
    items: tasks.map(planItemFromTask),
  };
};

export const applyRebindingRecoveryToTask = (
  task: TemplateProductionTask,
  timestamp = new Date().toISOString(),
): TemplateProductionTask => {
  if (!taskNeedsRebinding(task)) {
    return task;
  }

  const issue = rebindingIssue();
  const seed = task.templateAnalysisSeed
    ? {
        ...task.templateAnalysisSeed,
        readiness: 'blocked_by_missing_artifact' as const,
        boundArtifactResource: undefined,
        browserPreviewUrl: undefined,
        artifactBindingStatus: 'unbound' as const,
      }
    : undefined;

  return appendProductionTaskEvent(
    {
      ...task,
      templateAnalysisSeed: seed,
      artifactBindingStatus: 'needs_artifact_binding',
      analysisStatus: 'not_started',
      currentStatus: 'needs_artifact_binding',
      needsRebinding: true,
      issues: task.issues.some((entry) => entry.code === issue.code)
        ? task.issues
        : [...task.issues, issue],
      updatedAt: timestamp,
    },
    {
      eventType: 'rebinding-needed',
      status: 'needs_artifact_binding',
      timestamp,
      message: 'browser runtime artifact resource needs explicit rebinding',
      metadata: {
        sourceImageId: task.sourceImageId,
        seedId: task.templateAnalysisSeed?.seedId ?? null,
      },
    },
  );
};

export const summarizeRebindingRecovery = (
  plan: TemplateProductionRebindingPlan,
): string =>
  plan.taskCount === 0
    ? '没有任务需要重新绑定 artifact。'
    : `${plan.taskCount} 个任务需要重新绑定 artifact：${plan.items.map((item) => item.originalFileName).join(', ')}`;

export const validateRebindingAfterSessionRestore = (
  batch: TemplateProductionBatch,
): TemplateProductionRebindingValidationResult => {
  const tasks = detectTasksNeedingRebinding(batch);
  const items = tasks.map(planItemFromTask);

  return {
    valid: items.length === 0,
    tasksNeedingRebinding: items,
    issues: items.map(rebindingIssue),
  };
};
