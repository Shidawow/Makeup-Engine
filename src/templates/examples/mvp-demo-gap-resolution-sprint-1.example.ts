import { createMvpDemoGapResolutionSprint1Report } from '../../template-engine';
import { mvpGapResolutionSprintPlanReadyExample } from './mvp-gap-resolution-sprint-plan.example';

export const mvpDemoGapResolutionSprint1ReadyExample =
  createMvpDemoGapResolutionSprint1Report({
    sprintPlan: mvpGapResolutionSprintPlanReadyExample,
  });

export const mvpDemoGapResolutionSprint1MissingItemExample =
  createMvpDemoGapResolutionSprint1Report({
    reportId: 'mvp-demo-gap-resolution-sprint-1-missing-item',
    sprintPlan: {
      ...mvpGapResolutionSprintPlanReadyExample,
      phase13DItems: mvpGapResolutionSprintPlanReadyExample.phase13DItems.filter(
        (item) => item.title !== 'Mobile demo touch target / spacing polish',
      ),
    },
  });
