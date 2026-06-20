import { createRealWriteExecutionPlan } from '../../template-engine';
import {
  realWriteExecutionAuthorizationMissingActualWriteBlockedExample,
  realWriteExecutionAuthorizationMissingDryRunOnlyExample,
  realWriteExecutionAuthorizationMissingFinalReviewGateReadyExample,
  realWriteExecutionAuthorizationMissingPackageReplacementBlockedExample,
  realWriteExecutionAuthorizationMissingProductionWriterBlockedExample,
  realWriteExecutionAuthorizationMissingPublishBlockedExample,
  realWriteExecutionAuthorizationReadyExample,
  realWriteExecutionAuthorizationWarningExample,
} from './real-write-execution-authorization.example';

export const realWriteExecutionPlanReadyExample = createRealWriteExecutionPlan({
  authorization: realWriteExecutionAuthorizationReadyExample,
});

export const realWriteExecutionPlanWarningExample = createRealWriteExecutionPlan({
  authorization: realWriteExecutionAuthorizationWarningExample,
});

export const realWriteExecutionPlanMissingExecutionAuthorizationExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationMissingFinalReviewGateReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-execution-authorization',
  });

export const realWriteExecutionPlanMissingDryRunOnlyExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const realWriteExecutionPlanMissingActualWriteBlockedExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const realWriteExecutionPlanMissingPublishBlockedExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const realWriteExecutionPlanMissingPackageReplacementBlockedExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId:
      'real-write-execution-plan-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const realWriteExecutionPlanMissingProductionWriterBlockedExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-production-writer-blocked',
    overrides: { productionWriterBlocked: false },
  });

export const realWriteExecutionPlanMissingExecutionSequenceExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-execution-sequence',
    overrides: { omitExecutionSequencePlan: true },
  });

export const realWriteExecutionPlanMissingPreflightExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-preflight',
    overrides: { omitPreflightPlan: true },
  });

export const realWriteExecutionPlanMissingWriteLockExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-write-lock',
    overrides: { omitWriteLockPlan: true },
  });

export const realWriteExecutionPlanMissingAuditExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-audit',
    overrides: { omitAuditPlan: true },
  });

export const realWriteExecutionPlanMissingRollbackExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-rollback',
    overrides: { omitRollbackPlan: true },
  });

export const realWriteExecutionPlanMissingFailureHandlingExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-failure-handling',
    overrides: { omitFailureHandlingPlan: true },
  });

export const realWriteExecutionPlanMissingDryRunVerificationExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-missing-dry-run-verification',
    overrides: { omitDryRunVerificationPlan: true },
  });

export const realWriteExecutionPlanActualRegistryWriteExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-actual-registry-write',
    overrides: { note: 'registryWriteExecuted' },
  });

export const realWriteExecutionPlanProductionMarkerExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-production-marker',
    overrides: { note: 'productionPackageId' },
  });

export const realWriteExecutionPlanShellReplacementExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-shell-replacement',
    overrides: { note: 'replaceUserAppShellPackage' },
  });

export const realWriteExecutionPlanProductionWriterCreationExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationReadyExample,
    executionPlanId: 'real-write-execution-plan-production-writer-creation',
    overrides: { note: 'createProductionWriter' },
  });

export const realWriteExecutionPlanSourceMissingDryRunOnlyExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationMissingDryRunOnlyExample,
    executionPlanId: 'real-write-execution-plan-source-missing-dry-run-only',
  });

export const realWriteExecutionPlanSourceMissingActualWriteBlockedExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationMissingActualWriteBlockedExample,
    executionPlanId:
      'real-write-execution-plan-source-missing-actual-write-blocked',
  });

export const realWriteExecutionPlanSourceMissingPublishBlockedExample =
  createRealWriteExecutionPlan({
    authorization: realWriteExecutionAuthorizationMissingPublishBlockedExample,
    executionPlanId: 'real-write-execution-plan-source-missing-publish-blocked',
  });

export const realWriteExecutionPlanSourceMissingPackageReplacementBlockedExample =
  createRealWriteExecutionPlan({
    authorization:
      realWriteExecutionAuthorizationMissingPackageReplacementBlockedExample,
    executionPlanId:
      'real-write-execution-plan-source-missing-package-replacement-blocked',
  });

export const realWriteExecutionPlanSourceMissingProductionWriterBlockedExample =
  createRealWriteExecutionPlan({
    authorization:
      realWriteExecutionAuthorizationMissingProductionWriterBlockedExample,
    executionPlanId:
      'real-write-execution-plan-source-missing-production-writer-blocked',
  });
