import {
  createMvpGapPrioritizationReport,
  createMvpGapResolutionSprintPlan,
  validateMvpGapResolutionSprintPlan,
} from '../../template-engine';
import { founderTrialFeedbackReportReadyExample } from './founder-trial-feedback.example';

export const mvpGapResolutionSprintSourceGapReportExample =
  createMvpGapPrioritizationReport({
    feedback: founderTrialFeedbackReportReadyExample,
  });

export const mvpGapResolutionSprintPlanReadyExample =
  createMvpGapResolutionSprintPlan({
    gapReport: mvpGapResolutionSprintSourceGapReportExample,
  });

export const mvpGapResolutionSprintValidationReadyExample =
  validateMvpGapResolutionSprintPlan(mvpGapResolutionSprintPlanReadyExample);

export const mvpGapResolutionSprintPlanBlockedRegistryExample = {
  ...mvpGapResolutionSprintPlanReadyExample,
  reportId: 'mvp-gap-resolution-sprint-plan-13c-blocked-registry',
  registryWriteBlocked: false as const,
  items: [
    {
      ...mvpGapResolutionSprintPlanReadyExample.items[0],
      proposedResolution: 'write registry and publish to user app after sprint.',
    },
    ...mvpGapResolutionSprintPlanReadyExample.items.slice(1),
  ],
};

export const mvpGapResolutionSprintPlanBlockedAnalyticsExample = {
  ...mvpGapResolutionSprintPlanReadyExample,
  reportId: 'mvp-gap-resolution-sprint-plan-13c-blocked-analytics',
  noAnalytics: false as const,
  items: [
    {
      ...mvpGapResolutionSprintPlanReadyExample.items[0],
      proposedResolution: 'add analytics event and real user data collection for sprint measurement.',
    },
    ...mvpGapResolutionSprintPlanReadyExample.items.slice(1),
  ],
};

export const mvpGapResolutionSprintPlanBlockedExtractionClaimExample = {
  ...mvpGapResolutionSprintPlanReadyExample,
  reportId: 'mvp-gap-resolution-sprint-plan-13c-blocked-extraction',
  fullyAutomaticExtractionClaimBlocked: false as const,
  items: [
    {
      ...mvpGapResolutionSprintPlanReadyExample.items[0],
      proposedResolution: 'claim fully automatic high-quality makeup extraction.',
    },
    ...mvpGapResolutionSprintPlanReadyExample.items.slice(1),
  ],
};
