import { createRealRegistryWriteImplementationGate } from '../../template-engine';
import {
  controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample,
  controlledRegistryWriteExecutionDesignMissingActualWriteBlockedExample,
  controlledRegistryWriteExecutionDesignMissingAuthorizationGateExample,
  controlledRegistryWriteExecutionDesignMissingDryRunOnlyExample,
  controlledRegistryWriteExecutionDesignMissingPackageReplacementBlockedExample,
  controlledRegistryWriteExecutionDesignMissingPublishBlockedExample,
  controlledRegistryWriteExecutionDesignProductionMarkerBlockedExample,
  controlledRegistryWriteExecutionDesignReadyExample,
  controlledRegistryWriteExecutionDesignShellReplacementBlockedExample,
  controlledRegistryWriteExecutionDesignWarningExample,
} from './controlled-registry-write-execution-design.example';
import {
  controlledRegistryWriteExecutionHandoffKeepDesignOnlyExample,
  controlledRegistryWriteExecutionHandoffReadyExample,
} from './controlled-registry-write-execution-handoff.example';
import {
  controlledRegistryWriteExecutionValidationActualRegistryWriteExample,
  controlledRegistryWriteExecutionValidationMissingActualWriteBlockedExample,
  controlledRegistryWriteExecutionValidationMissingAuthorizationGateExample,
  controlledRegistryWriteExecutionValidationMissingDryRunOnlyExample,
  controlledRegistryWriteExecutionValidationMissingPackageReplacementBlockedExample,
  controlledRegistryWriteExecutionValidationMissingPublishBlockedExample,
  controlledRegistryWriteExecutionValidationProductionMarkerExample,
  controlledRegistryWriteExecutionValidationReadyExample,
  controlledRegistryWriteExecutionValidationShellReplacementExample,
  controlledRegistryWriteExecutionValidationWarningExample,
} from './controlled-registry-write-execution-validation.example';

export const realRegistryWriteImplementationGateReadyExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignReadyExample,
    validation: controlledRegistryWriteExecutionValidationReadyExample,
    handoff: controlledRegistryWriteExecutionHandoffReadyExample,
  });

export const realRegistryWriteImplementationGateWarningExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignWarningExample,
    validation: controlledRegistryWriteExecutionValidationWarningExample,
    handoff: controlledRegistryWriteExecutionHandoffKeepDesignOnlyExample,
  });

export const realRegistryWriteImplementationGateMissingExecutionValidationExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignMissingAuthorizationGateExample,
    validation: controlledRegistryWriteExecutionValidationMissingAuthorizationGateExample,
    gateId: 'real-registry-write-implementation-gate-missing-execution-validation',
  });

export const realRegistryWriteImplementationGateMissingDryRunOnlyExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignReadyExample,
    validation: controlledRegistryWriteExecutionValidationReadyExample,
    gateId: 'real-registry-write-implementation-gate-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const realRegistryWriteImplementationGateMissingActualWriteBlockedExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignReadyExample,
    validation: controlledRegistryWriteExecutionValidationReadyExample,
    gateId:
      'real-registry-write-implementation-gate-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const realRegistryWriteImplementationGateMissingPublishBlockedExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignReadyExample,
    validation: controlledRegistryWriteExecutionValidationReadyExample,
    gateId: 'real-registry-write-implementation-gate-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const realRegistryWriteImplementationGateMissingPackageReplacementBlockedExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignReadyExample,
    validation: controlledRegistryWriteExecutionValidationReadyExample,
    gateId:
      'real-registry-write-implementation-gate-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample,
    validation: controlledRegistryWriteExecutionValidationActualRegistryWriteExample,
    gateId: 'real-registry-write-implementation-gate-actual-registry-write',
  });

export const realRegistryWriteImplementationGateBlockedByProductionMarkerExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignProductionMarkerBlockedExample,
    validation: controlledRegistryWriteExecutionValidationProductionMarkerExample,
    gateId: 'real-registry-write-implementation-gate-production-marker',
  });

export const realRegistryWriteImplementationGateBlockedByShellReplacementExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignShellReplacementBlockedExample,
    validation: controlledRegistryWriteExecutionValidationShellReplacementExample,
    gateId: 'real-registry-write-implementation-gate-shell-replacement',
  });

export const realRegistryWriteImplementationGateMissingSourceDryRunExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignMissingDryRunOnlyExample,
    validation: controlledRegistryWriteExecutionValidationMissingDryRunOnlyExample,
    gateId: 'real-registry-write-implementation-gate-source-missing-dry-run',
  });

export const realRegistryWriteImplementationGateMissingSourceActualWriteBlockedExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignMissingActualWriteBlockedExample,
    validation: controlledRegistryWriteExecutionValidationMissingActualWriteBlockedExample,
    gateId:
      'real-registry-write-implementation-gate-source-missing-actual-write-blocked',
  });

export const realRegistryWriteImplementationGateMissingSourcePublishBlockedExample =
  createRealRegistryWriteImplementationGate({
    design: controlledRegistryWriteExecutionDesignMissingPublishBlockedExample,
    validation: controlledRegistryWriteExecutionValidationMissingPublishBlockedExample,
    gateId: 'real-registry-write-implementation-gate-source-missing-publish-blocked',
  });

export const realRegistryWriteImplementationGateMissingSourcePackageReplacementBlockedExample =
  createRealRegistryWriteImplementationGate({
    design:
      controlledRegistryWriteExecutionDesignMissingPackageReplacementBlockedExample,
    validation:
      controlledRegistryWriteExecutionValidationMissingPackageReplacementBlockedExample,
    gateId:
      'real-registry-write-implementation-gate-source-missing-package-replacement-blocked',
  });
