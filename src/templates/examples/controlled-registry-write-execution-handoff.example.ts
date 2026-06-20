import { createControlledRegistryWriteExecutionHandoff } from '../../template-engine';
import {
  controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample,
  controlledRegistryWriteExecutionDesignMissingAuditPlanExample,
  controlledRegistryWriteExecutionDesignMissingRollbackDesignExample,
  controlledRegistryWriteExecutionDesignReadyExample,
  controlledRegistryWriteExecutionDesignWarningExample,
} from './controlled-registry-write-execution-design.example';
import {
  controlledRegistryWriteExecutionValidationActualRegistryWriteExample,
  controlledRegistryWriteExecutionValidationMissingAuditPlanExample,
  controlledRegistryWriteExecutionValidationMissingRollbackDesignExample,
  controlledRegistryWriteExecutionValidationReadyExample,
  controlledRegistryWriteExecutionValidationWarningExample,
} from './controlled-registry-write-execution-validation.example';

export const controlledRegistryWriteExecutionHandoffReadyExample =
  createControlledRegistryWriteExecutionHandoff({
    design: controlledRegistryWriteExecutionDesignReadyExample,
    validation: controlledRegistryWriteExecutionValidationReadyExample,
  });

export const controlledRegistryWriteExecutionHandoffKeepDesignOnlyExample =
  createControlledRegistryWriteExecutionHandoff({
    design: controlledRegistryWriteExecutionDesignWarningExample,
    validation: controlledRegistryWriteExecutionValidationWarningExample,
  });

export const controlledRegistryWriteExecutionHandoffRequestAuditRevisionExample =
  createControlledRegistryWriteExecutionHandoff({
    design: controlledRegistryWriteExecutionDesignMissingAuditPlanExample,
    validation: controlledRegistryWriteExecutionValidationMissingAuditPlanExample,
  });

export const controlledRegistryWriteExecutionHandoffRequestRollbackRevisionExample =
  createControlledRegistryWriteExecutionHandoff({
    design: controlledRegistryWriteExecutionDesignMissingRollbackDesignExample,
    validation:
      controlledRegistryWriteExecutionValidationMissingRollbackDesignExample,
  });

export const controlledRegistryWriteExecutionHandoffBlockedExample =
  createControlledRegistryWriteExecutionHandoff({
    design: controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample,
    validation: controlledRegistryWriteExecutionValidationActualRegistryWriteExample,
  });
