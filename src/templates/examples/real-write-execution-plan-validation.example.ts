import { validateRealWriteExecutionPlan } from '../../template-engine';
import {
  realWriteExecutionPlanActualRegistryWriteExample,
  realWriteExecutionPlanMissingActualWriteBlockedExample,
  realWriteExecutionPlanMissingAuditExample,
  realWriteExecutionPlanMissingDryRunOnlyExample,
  realWriteExecutionPlanMissingDryRunVerificationExample,
  realWriteExecutionPlanMissingExecutionAuthorizationExample,
  realWriteExecutionPlanMissingExecutionSequenceExample,
  realWriteExecutionPlanMissingFailureHandlingExample,
  realWriteExecutionPlanMissingPackageReplacementBlockedExample,
  realWriteExecutionPlanMissingPreflightExample,
  realWriteExecutionPlanMissingProductionWriterBlockedExample,
  realWriteExecutionPlanMissingPublishBlockedExample,
  realWriteExecutionPlanMissingRollbackExample,
  realWriteExecutionPlanMissingWriteLockExample,
  realWriteExecutionPlanProductionMarkerExample,
  realWriteExecutionPlanProductionWriterCreationExample,
  realWriteExecutionPlanReadyExample,
  realWriteExecutionPlanShellReplacementExample,
  realWriteExecutionPlanWarningExample,
} from './real-write-execution-plan.example';

export const realWriteExecutionPlanValidationReadyExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanReadyExample);

export const realWriteExecutionPlanValidationWarningExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanWarningExample);

export const realWriteExecutionPlanValidationMissingExecutionAuthorizationExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingExecutionAuthorizationExample,
  );

export const realWriteExecutionPlanValidationMissingDryRunOnlyExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanMissingDryRunOnlyExample);

export const realWriteExecutionPlanValidationMissingActualWriteBlockedExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingActualWriteBlockedExample,
  );

export const realWriteExecutionPlanValidationMissingPublishBlockedExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingPublishBlockedExample,
  );

export const realWriteExecutionPlanValidationMissingPackageReplacementBlockedExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingPackageReplacementBlockedExample,
  );

export const realWriteExecutionPlanValidationMissingProductionWriterBlockedExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingProductionWriterBlockedExample,
  );

export const realWriteExecutionPlanValidationMissingExecutionSequenceExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingExecutionSequenceExample,
  );

export const realWriteExecutionPlanValidationMissingPreflightExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanMissingPreflightExample);

export const realWriteExecutionPlanValidationMissingWriteLockExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanMissingWriteLockExample);

export const realWriteExecutionPlanValidationMissingAuditExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanMissingAuditExample);

export const realWriteExecutionPlanValidationMissingRollbackExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanMissingRollbackExample);

export const realWriteExecutionPlanValidationMissingFailureHandlingExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingFailureHandlingExample,
  );

export const realWriteExecutionPlanValidationMissingDryRunVerificationExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanMissingDryRunVerificationExample,
  );

export const realWriteExecutionPlanValidationActualRegistryWriteExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanActualRegistryWriteExample,
  );

export const realWriteExecutionPlanValidationProductionMarkerExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanProductionMarkerExample);

export const realWriteExecutionPlanValidationShellReplacementExample =
  validateRealWriteExecutionPlan(realWriteExecutionPlanShellReplacementExample);

export const realWriteExecutionPlanValidationProductionWriterCreationExample =
  validateRealWriteExecutionPlan(
    realWriteExecutionPlanProductionWriterCreationExample,
  );
