import { createGuardedRealWriteExecutionSimulatorHandoff } from '../../template-engine';
import {
  guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample,
  guardedRealWriteExecutionSimulatorReadyExample,
  guardedRealWriteExecutionSimulatorWarningExample,
} from './guarded-real-write-execution-simulator.example';
import {
  guardedRealWriteExecutionSimulatorValidationMissingExecutionPlanReadyExample,
  guardedRealWriteExecutionSimulatorValidationReadyExample,
  guardedRealWriteExecutionSimulatorValidationWarningExample,
} from './guarded-real-write-execution-simulator-validation.example';

export const guardedRealWriteExecutionSimulatorHandoffReadyExample =
  createGuardedRealWriteExecutionSimulatorHandoff({
    simulator: guardedRealWriteExecutionSimulatorReadyExample,
    validation: guardedRealWriteExecutionSimulatorValidationReadyExample,
  });

export const guardedRealWriteExecutionSimulatorHandoffKeepSimulatorOnlyExample =
  createGuardedRealWriteExecutionSimulatorHandoff({
    simulator: guardedRealWriteExecutionSimulatorWarningExample,
    validation: guardedRealWriteExecutionSimulatorValidationWarningExample,
    id: 'guarded-real-write-execution-simulator-handoff-keep-simulator-only',
  });

export const guardedRealWriteExecutionSimulatorHandoffBlockedExample =
  createGuardedRealWriteExecutionSimulatorHandoff({
    simulator: guardedRealWriteExecutionSimulatorMissingExecutionPlanReadyExample,
    validation:
      guardedRealWriteExecutionSimulatorValidationMissingExecutionPlanReadyExample,
    id: 'guarded-real-write-execution-simulator-handoff-blocked',
  });
