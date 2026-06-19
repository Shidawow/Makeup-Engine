import { createExplicitRegistryWriteAuthorizationHandoff } from '../../template-engine';
import {
  explicitRegistryWriteAuthorizationChecklistReadyExample,
  explicitRegistryWriteAuthorizationChecklistWarningExample,
} from './explicit-registry-write-authorization-checklist.example';
import {
  explicitRegistryWriteAuthorizationGateActualRegistryWriteBlockedExample,
  explicitRegistryWriteAuthorizationGateMissingOwnerAuthorizationExample,
  explicitRegistryWriteAuthorizationGateReadyExample,
  explicitRegistryWriteAuthorizationGateWarningExample,
} from './explicit-registry-write-authorization-gate.example';

export const explicitRegistryWriteAuthorizationHandoffReadyExample =
  createExplicitRegistryWriteAuthorizationHandoff({
    gate: explicitRegistryWriteAuthorizationGateReadyExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
  });

export const explicitRegistryWriteAuthorizationHandoffKeepDryRunOnlyExample =
  createExplicitRegistryWriteAuthorizationHandoff({
    gate: explicitRegistryWriteAuthorizationGateWarningExample,
    checklist: explicitRegistryWriteAuthorizationChecklistWarningExample,
  });

export const explicitRegistryWriteAuthorizationHandoffRequestOwnerAuthorizationExample =
  createExplicitRegistryWriteAuthorizationHandoff({
    gate: explicitRegistryWriteAuthorizationGateMissingOwnerAuthorizationExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
  });

export const explicitRegistryWriteAuthorizationHandoffBlockedExample =
  createExplicitRegistryWriteAuthorizationHandoff({
    gate: explicitRegistryWriteAuthorizationGateActualRegistryWriteBlockedExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
  });
