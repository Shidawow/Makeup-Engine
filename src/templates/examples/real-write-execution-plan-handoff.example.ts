import { createRealWriteExecutionPlanHandoff } from '../../template-engine';
import {
  realWriteExecutionPlanMissingExecutionAuthorizationExample,
  realWriteExecutionPlanReadyExample,
  realWriteExecutionPlanWarningExample,
} from './real-write-execution-plan.example';
import {
  realWriteExecutionPlanValidationMissingExecutionAuthorizationExample,
  realWriteExecutionPlanValidationReadyExample,
  realWriteExecutionPlanValidationWarningExample,
} from './real-write-execution-plan-validation.example';

export const realWriteExecutionPlanHandoffReadyExample =
  createRealWriteExecutionPlanHandoff({
    plan: realWriteExecutionPlanReadyExample,
    validation: realWriteExecutionPlanValidationReadyExample,
  });

export const realWriteExecutionPlanHandoffKeepPlanOnlyExample =
  createRealWriteExecutionPlanHandoff({
    plan: realWriteExecutionPlanWarningExample,
    validation: realWriteExecutionPlanValidationWarningExample,
    id: 'real-write-execution-plan-handoff-keep-plan-only',
  });

export const realWriteExecutionPlanHandoffBlockedExample =
  createRealWriteExecutionPlanHandoff({
    plan: realWriteExecutionPlanMissingExecutionAuthorizationExample,
    validation: realWriteExecutionPlanValidationMissingExecutionAuthorizationExample,
    id: 'real-write-execution-plan-handoff-blocked',
  });
