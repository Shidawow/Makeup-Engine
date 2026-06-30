import {
  createInternalFounderDemoRunReport,
  validateInternalFounderDemoRun,
} from '../../template-engine';
import { mvpDemoGapResolutionSprint1ReadyExample } from './mvp-demo-gap-resolution-sprint-1.example';

export const internalFounderDemoRunReadyExample =
  createInternalFounderDemoRunReport({
    sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
  });

export const internalFounderDemoRunValidationReadyExample =
  validateInternalFounderDemoRun(internalFounderDemoRunReadyExample);

export const internalFounderDemoRunBlockedByRegistryExample =
  createInternalFounderDemoRunReport({
    reportId: 'internal-founder-demo-run-blocked-registry',
    sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
    noRegistryWrite: false,
    noRegistryMutation: false,
  });

export const internalFounderDemoRunBlockedByAutomationClaimExample =
  createInternalFounderDemoRunReport({
    reportId: 'internal-founder-demo-run-blocked-automation-claim',
    sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
    noFullyAutomaticExtractionClaim: false,
  });

export const internalFounderDemoRunBlockedByUserTermLeakExample =
  createInternalFounderDemoRunReport({
    reportId: 'internal-founder-demo-run-blocked-user-term-leak',
    sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
    ordinaryUserInternalTermLeaks: [
      'Internal Founder Demo Run',
      'demo blocker',
      'registry',
    ],
  });

export const internalFounderDemoRunSafeEvidenceExample = {
  evidenceId: 'internal-founder-demo-safe-evidence-v0',
  routes: internalFounderDemoRunReadyExample.routes.map((route) => route.id),
  localOnly: true,
  anonymousExampleOnly: true,
  containsRealName: false,
  containsContact: false,
  containsRawPhoto: false,
  containsBase64: false,
  containsLocalPhotoPath: false,
  containsBiometricIdentifier: false,
  containsAnalyticsId: false,
};
