import { createControlledRegistryWriteExecutionDesign } from '../../template-engine';
import {
  explicitRegistryWriteAuthorizationGateMissingWriterValidationExample,
  explicitRegistryWriteAuthorizationGateReadyExample,
  explicitRegistryWriteAuthorizationGateWarningExample,
} from './explicit-registry-write-authorization-gate.example';
import {
  explicitRegistryWriteAuthorizationHandoffKeepDryRunOnlyExample,
  explicitRegistryWriteAuthorizationHandoffReadyExample,
} from './explicit-registry-write-authorization-handoff.example';

export const controlledRegistryWriteExecutionDesignReadyExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
  });

export const controlledRegistryWriteExecutionDesignWarningExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateWarningExample,
    authorizationHandoff:
      explicitRegistryWriteAuthorizationHandoffKeepDryRunOnlyExample,
  });

export const controlledRegistryWriteExecutionDesignMissingAuthorizationGateExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate:
      explicitRegistryWriteAuthorizationGateMissingWriterValidationExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-authorization-gate',
  });

export const controlledRegistryWriteExecutionDesignMissingDryRunOnlyExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const controlledRegistryWriteExecutionDesignMissingActualWriteBlockedExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const controlledRegistryWriteExecutionDesignMissingPublishBlockedExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const controlledRegistryWriteExecutionDesignMissingPackageReplacementBlockedExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const controlledRegistryWriteExecutionDesignMissingAuditPlanExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-audit-plan',
    overrides: { omitAuditPlan: true },
  });

export const controlledRegistryWriteExecutionDesignMissingRollbackDesignExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-rollback-design',
    overrides: { omitRollbackExecutionDesign: true },
  });

export const controlledRegistryWriteExecutionDesignMissingWriteLockExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-missing-write-lock',
    overrides: { writeLockRequirements: [] },
  });

export const controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-actual-registry-write-marker',
    overrides: { note: 'registryWriteExecuted should block this design.' },
  });

export const controlledRegistryWriteExecutionDesignProductionMarkerBlockedExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-production-marker',
    overrides: { note: 'productionPackageId should block this design.' },
  });

export const controlledRegistryWriteExecutionDesignShellReplacementBlockedExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-shell-replacement-marker',
    overrides: { note: 'replaceUserAppShellPackage should block this design.' },
  });

export const controlledRegistryWriteExecutionDesignActualExecutionModeBlockedExample =
  createControlledRegistryWriteExecutionDesign({
    authorizationGate: explicitRegistryWriteAuthorizationGateReadyExample,
    authorizationHandoff: explicitRegistryWriteAuthorizationHandoffReadyExample,
    executionDesignId:
      'controlled-registry-write-execution-design-actual-execution-mode',
    overrides: { executionMode: 'actual_write_execution' },
  });
