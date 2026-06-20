import { createRealRegistryWriteImplementationHandoff } from '../../template-engine';
import {
  realRegistryWriteImplementationChecklistBlockedExample,
  realRegistryWriteImplementationChecklistReadyExample,
  realRegistryWriteImplementationChecklistWarningExample,
} from './real-registry-write-implementation-checklist.example';
import {
  realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample,
  realRegistryWriteImplementationGateReadyExample,
  realRegistryWriteImplementationGateWarningExample,
} from './real-registry-write-implementation-gate.example';

export const realRegistryWriteImplementationHandoffReadyExample =
  createRealRegistryWriteImplementationHandoff({
    gate: realRegistryWriteImplementationGateReadyExample,
    checklist: realRegistryWriteImplementationChecklistReadyExample,
  });

export const realRegistryWriteImplementationHandoffKeepExecutionDesignOnlyExample =
  createRealRegistryWriteImplementationHandoff({
    gate: realRegistryWriteImplementationGateWarningExample,
    checklist: realRegistryWriteImplementationChecklistWarningExample,
  });

export const realRegistryWriteImplementationHandoffBlockedExample =
  createRealRegistryWriteImplementationHandoff({
    gate: realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample,
    checklist: realRegistryWriteImplementationChecklistBlockedExample,
  });
