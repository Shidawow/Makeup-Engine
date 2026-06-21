import { createGuardedRealWriteExecutionSimulator } from '../../template-engine';
import {
  realWriteExecutionPlanActualRegistryWriteExample,
  realWriteExecutionPlanMissingExecutionAuthorizationExample,
  realWriteExecutionPlanProductionMarkerExample,
  realWriteExecutionPlanProductionWriterCreationExample,
  realWriteExecutionPlanReadyExample,
  realWriteExecutionPlanShellReplacementExample,
  realWriteExecutionPlanWarningExample,
} from './real-write-execution-plan.example';
import {
  realWriteExecutionPlanValidationActualRegistryWriteExample,
  realWriteExecutionPlanValidationMissingExecutionAuthorizationExample,
  realWriteExecutionPlanValidationProductionMarkerExample,
  realWriteExecutionPlanValidationProductionWriterCreationExample,
  realWriteExecutionPlanValidationReadyExample,
  realWriteExecutionPlanValidationShellReplacementExample,
  realWriteExecutionPlanValidationWarningExample,
} from './real-write-execution-plan-validation.example';

export const guardedRealWriteExecutionSimulatorReadyExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
  });

export const guardedRealWriteExecutionSimulatorWarningExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanWarningExample,
    validation: realWriteExecutionPlanValidationWarningExample,
    simulatorId: 'guarded-real-write-execution-simulator-warning',
  });

export const guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanMissingExecutionAuthorizationExample,
    validation: realWriteExecutionPlanValidationMissingExecutionAuthorizationExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-execution-plan-ready',
  });

export const guardedRealWriteExecutionSimulatorMissingDryRunOnlyExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const guardedRealWriteExecutionSimulatorMissingActualWriteBlockedExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId:
      'guarded-real-write-execution-simulator-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const guardedRealWriteExecutionSimulatorMissingPublishBlockedExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const guardedRealWriteExecutionSimulatorMissingPackageReplacementBlockedExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId:
      'guarded-real-write-execution-simulator-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const guardedRealWriteExecutionSimulatorMissingProductionWriterBlockedExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId:
      'guarded-real-write-execution-simulator-missing-production-writer-blocked',
    overrides: { productionWriterBlocked: false },
  });

export const guardedRealWriteExecutionSimulatorMissingRegistryMutationBlockedExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId:
      'guarded-real-write-execution-simulator-missing-registry-mutation-blocked',
    overrides: { registryMutationBlocked: false },
  });

export const guardedRealWriteExecutionSimulatorMissingPreflightExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-preflight',
    overrides: { omitSimulatedPreflight: true },
  });

export const guardedRealWriteExecutionSimulatorMissingWriteLockExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-write-lock',
    overrides: { omitSimulatedWriteLock: true },
  });

export const guardedRealWriteExecutionSimulatorMissingWriteOperationExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-write-operation',
    overrides: { omitSimulatedWriteOperation: true },
  });

export const guardedRealWriteExecutionSimulatorMissingAuditEventsExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-audit-events',
    overrides: { omitSimulatedAuditEvents: true },
  });

export const guardedRealWriteExecutionSimulatorMissingRollbackExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-rollback',
    overrides: { omitSimulatedRollback: true },
  });

export const guardedRealWriteExecutionSimulatorMissingFailureHandlingExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-missing-failure-handling',
    overrides: { omitSimulatedFailureHandling: true },
  });

export const guardedRealWriteExecutionSimulatorActualRegistryWriteExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanActualRegistryWriteExample,
    validation: realWriteExecutionPlanValidationActualRegistryWriteExample,
    simulatorId: 'guarded-real-write-execution-simulator-actual-registry-write',
    overrides: { note: 'registryWriteExecuted' },
  });

export const guardedRealWriteExecutionSimulatorRegistryMutationExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-registry-mutation',
    overrides: { note: 'registryMutation' },
  });

export const guardedRealWriteExecutionSimulatorProductionMarkerExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanProductionMarkerExample,
    validation: realWriteExecutionPlanValidationProductionMarkerExample,
    simulatorId: 'guarded-real-write-execution-simulator-production-marker',
    overrides: { note: 'productionPackageId' },
  });

export const guardedRealWriteExecutionSimulatorShellReplacementExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanShellReplacementExample,
    validation: realWriteExecutionPlanValidationShellReplacementExample,
    simulatorId: 'guarded-real-write-execution-simulator-shell-replacement',
    overrides: { note: 'replaceUserAppShellPackage' },
  });

export const guardedRealWriteExecutionSimulatorProductionWriterCreationExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanProductionWriterCreationExample,
    validation: realWriteExecutionPlanValidationProductionWriterCreationExample,
    simulatorId:
      'guarded-real-write-execution-simulator-production-writer-creation',
    overrides: { note: 'createProductionWriter' },
  });

export const guardedRealWriteExecutionSimulatorPersonalDataExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-personal-data',
    overrides: { note: '邮箱: user@example.com' },
  });

export const guardedRealWriteExecutionSimulatorMedicalClaimExample =
  createGuardedRealWriteExecutionSimulator({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
    simulatorId: 'guarded-real-write-execution-simulator-medical-claim',
    overrides: { note: 'medical diagnosis' },
  });
