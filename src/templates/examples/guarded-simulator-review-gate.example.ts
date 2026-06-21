import { createGuardedSimulatorReviewGate } from '../../template-engine';
import {
  guardedRealWriteExecutionSimulatorActualRegistryWriteExample,
  guardedRealWriteExecutionSimulatorMissingActualWriteBlockedExample,
  guardedRealWriteExecutionSimulatorMissingDryRunOnlyExample,
  guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample,
  guardedRealWriteExecutionSimulatorMissingPackageReplacementBlockedExample,
  guardedRealWriteExecutionSimulatorMissingProductionWriterBlockedExample,
  guardedRealWriteExecutionSimulatorMissingPublishBlockedExample,
  guardedRealWriteExecutionSimulatorMissingRegistryMutationBlockedExample,
  guardedRealWriteExecutionSimulatorProductionMarkerExample,
  guardedRealWriteExecutionSimulatorProductionWriterCreationExample,
  guardedRealWriteExecutionSimulatorReadyExample,
  guardedRealWriteExecutionSimulatorRegistryMutationExample,
  guardedRealWriteExecutionSimulatorShellReplacementExample,
  guardedRealWriteExecutionSimulatorWarningExample,
} from './guarded-real-write-execution-simulator.example';
import {
  guardedRealWriteExecutionSimulatorValidationActualRegistryWriteExample,
  guardedRealWriteExecutionSimulatorValidationMissingActualWriteBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingDryRunOnlyExample,
  guardedRealWriteExecutionSimulatorValidationMissingExecutionPlanReadyExample,
  guardedRealWriteExecutionSimulatorValidationMissingPackageReplacementBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingProductionWriterBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingPublishBlockedExample,
  guardedRealWriteExecutionSimulatorValidationMissingRegistryMutationBlockedExample,
  guardedRealWriteExecutionSimulatorValidationProductionMarkerExample,
  guardedRealWriteExecutionSimulatorValidationProductionWriterCreationExample,
  guardedRealWriteExecutionSimulatorValidationReadyExample,
  guardedRealWriteExecutionSimulatorValidationRegistryMutationExample,
  guardedRealWriteExecutionSimulatorValidationShellReplacementExample,
  guardedRealWriteExecutionSimulatorValidationWarningExample,
} from './guarded-real-write-execution-simulator-validation.example';

export const guardedSimulatorReviewGateReadyExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorReadyExample,
    validation: guardedRealWriteExecutionSimulatorValidationReadyExample,
  });

export const guardedSimulatorReviewGateWarningExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorWarningExample,
    validation: guardedRealWriteExecutionSimulatorValidationWarningExample,
    gateId: 'guarded-simulator-review-gate-warning',
  });

export const guardedSimulatorReviewGateMissingSimulationValidationExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationMissingExecutionPlanReadyExample,
    gateId: 'guarded-simulator-review-gate-missing-simulation-validation',
  });

export const guardedSimulatorReviewGateMissingDryRunOnlyExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorMissingDryRunOnlyExample,
    validation: guardedRealWriteExecutionSimulatorValidationMissingDryRunOnlyExample,
    gateId: 'guarded-simulator-review-gate-missing-dry-run-only',
  });

export const guardedSimulatorReviewGateMissingActualWriteBlockedExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorMissingActualWriteBlockedExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationMissingActualWriteBlockedExample,
    gateId: 'guarded-simulator-review-gate-missing-actual-write-blocked',
  });

export const guardedSimulatorReviewGateMissingPublishBlockedExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorMissingPublishBlockedExample,
    validation: guardedRealWriteExecutionSimulatorValidationMissingPublishBlockedExample,
    gateId: 'guarded-simulator-review-gate-missing-publish-blocked',
  });

export const guardedSimulatorReviewGateMissingPackageReplacementBlockedExample =
  createGuardedSimulatorReviewGate({
    simulator:
      guardedRealWriteExecutionSimulatorMissingPackageReplacementBlockedExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationMissingPackageReplacementBlockedExample,
    gateId: 'guarded-simulator-review-gate-missing-package-replacement-blocked',
  });

export const guardedSimulatorReviewGateMissingProductionWriterBlockedExample =
  createGuardedSimulatorReviewGate({
    simulator:
      guardedRealWriteExecutionSimulatorMissingProductionWriterBlockedExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationMissingProductionWriterBlockedExample,
    gateId: 'guarded-simulator-review-gate-missing-production-writer-blocked',
  });

export const guardedSimulatorReviewGateMissingRegistryMutationBlockedExample =
  createGuardedSimulatorReviewGate({
    simulator:
      guardedRealWriteExecutionSimulatorMissingRegistryMutationBlockedExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationMissingRegistryMutationBlockedExample,
    gateId: 'guarded-simulator-review-gate-missing-registry-mutation-blocked',
  });

export const guardedSimulatorReviewGateActualRegistryWriteExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorActualRegistryWriteExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationActualRegistryWriteExample,
    gateId: 'guarded-simulator-review-gate-actual-registry-write',
    overrides: { note: 'registryWriteExecuted' },
  });

export const guardedSimulatorReviewGateRegistryMutationExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorRegistryMutationExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationRegistryMutationExample,
    gateId: 'guarded-simulator-review-gate-registry-mutation',
    overrides: { note: 'registryMutation' },
  });

export const guardedSimulatorReviewGateProductionMarkerExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorProductionMarkerExample,
    validation: guardedRealWriteExecutionSimulatorValidationProductionMarkerExample,
    gateId: 'guarded-simulator-review-gate-production-marker',
    overrides: { note: 'productionPackageId' },
  });

export const guardedSimulatorReviewGateShellReplacementExample =
  createGuardedSimulatorReviewGate({
    simulator: guardedRealWriteExecutionSimulatorShellReplacementExample,
    validation: guardedRealWriteExecutionSimulatorValidationShellReplacementExample,
    gateId: 'guarded-simulator-review-gate-shell-replacement',
    overrides: { note: 'replaceUserAppShellPackage' },
  });

export const guardedSimulatorReviewGateProductionWriterCreationExample =
  createGuardedSimulatorReviewGate({
    simulator:
      guardedRealWriteExecutionSimulatorProductionWriterCreationExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationProductionWriterCreationExample,
    gateId: 'guarded-simulator-review-gate-production-writer-creation',
    overrides: { note: 'createProductionWriter' },
  });
