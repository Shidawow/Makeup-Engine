import type { UserAppMakeupStep, UserAppTemplate } from '../templates/schema';

export interface UserAppTemplateProgress {
  templateId: string;
  currentStepId?: string;
  orderedStepIds: string[];
  completedStepIds: string[];
  skippedStepIds: string[];
  progressPercent: number;
  startedAt?: string;
  updatedAt?: string;
  localOnly: true;
}

const unique = (items: readonly string[]): string[] => Array.from(new Set(items));

const orderStepIds = (steps: readonly UserAppMakeupStep[]): string[] =>
  [...steps]
    .sort((left, right) =>
      left.order === right.order
        ? left.stepId.localeCompare(right.stepId)
        : left.order - right.order,
    )
    .map((step) => step.stepId);

const calculateProgressPercent = (
  orderedStepIds: readonly string[],
  completedStepIds: readonly string[],
): number =>
  orderedStepIds.length === 0
    ? 0
    : Math.round((completedStepIds.length / orderedStepIds.length) * 100);

const normalizeProgress = (
  progress: UserAppTemplateProgress,
): UserAppTemplateProgress => ({
  ...progress,
  completedStepIds: unique(progress.completedStepIds).filter((stepId) =>
    progress.orderedStepIds.includes(stepId),
  ),
  skippedStepIds: unique(progress.skippedStepIds).filter((stepId) =>
    progress.orderedStepIds.includes(stepId),
  ),
  progressPercent: calculateProgressPercent(
    progress.orderedStepIds,
    progress.completedStepIds,
  ),
  localOnly: true,
});

export const createInitialTemplateProgress = (input: {
  template: UserAppTemplate;
  startedAt?: string;
}): UserAppTemplateProgress => {
  const orderedStepIds = orderStepIds(input.template.steps);

  return normalizeProgress({
    templateId: input.template.appTemplateId,
    currentStepId: orderedStepIds[0],
    orderedStepIds,
    completedStepIds: [],
    skippedStepIds: [],
    progressPercent: 0,
    startedAt: input.startedAt,
    updatedAt: input.startedAt,
    localOnly: true,
  });
};

export const getNextIncompleteStep = (
  progress: UserAppTemplateProgress,
): string | undefined => {
  const done = new Set([...progress.completedStepIds, ...progress.skippedStepIds]);

  return progress.orderedStepIds.find((stepId) => !done.has(stepId));
};

export const markStepComplete = (
  progress: UserAppTemplateProgress,
  stepId: string,
  updatedAt?: string,
): UserAppTemplateProgress => {
  const completedStepIds = unique([...progress.completedStepIds, stepId]);
  const skippedStepIds = progress.skippedStepIds.filter((id) => id !== stepId);
  const nextProgress = normalizeProgress({
    ...progress,
    completedStepIds,
    skippedStepIds,
    updatedAt: updatedAt ?? progress.updatedAt,
  });

  return {
    ...nextProgress,
    currentStepId: getNextIncompleteStep(nextProgress) ?? stepId,
  };
};

export const markStepSkipped = (
  progress: UserAppTemplateProgress,
  stepId: string,
  updatedAt?: string,
): UserAppTemplateProgress => {
  const skippedStepIds = unique([...progress.skippedStepIds, stepId]);
  const completedStepIds = progress.completedStepIds.filter((id) => id !== stepId);
  const nextProgress = normalizeProgress({
    ...progress,
    completedStepIds,
    skippedStepIds,
    updatedAt: updatedAt ?? progress.updatedAt,
  });

  return {
    ...nextProgress,
    currentStepId: getNextIncompleteStep(nextProgress) ?? stepId,
  };
};

export const resetTemplateProgress = (
  progress: UserAppTemplateProgress,
  updatedAt?: string,
): UserAppTemplateProgress => ({
  ...progress,
  currentStepId: progress.orderedStepIds[0],
  completedStepIds: [],
  skippedStepIds: [],
  progressPercent: 0,
  updatedAt: updatedAt ?? progress.updatedAt,
  localOnly: true,
});

export const summarizeTemplateProgress = (
  progress: UserAppTemplateProgress,
): string =>
  JSON.stringify({
    templateId: progress.templateId,
    currentStepId: progress.currentStepId,
    completed: progress.completedStepIds.length,
    skipped: progress.skippedStepIds.length,
    total: progress.orderedStepIds.length,
    progressPercent: progress.progressPercent,
    localOnly: true,
  });
