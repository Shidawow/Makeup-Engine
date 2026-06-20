import { createRealRegistryWriteImplementationChecklist } from '../../template-engine';
import {
  realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample,
  realRegistryWriteImplementationGateReadyExample,
  realRegistryWriteImplementationGateWarningExample,
} from './real-registry-write-implementation-gate.example';

export const realRegistryWriteImplementationChecklistReadyExample =
  createRealRegistryWriteImplementationChecklist({
    gate: realRegistryWriteImplementationGateReadyExample,
  });

export const realRegistryWriteImplementationChecklistWarningExample =
  createRealRegistryWriteImplementationChecklist({
    gate: realRegistryWriteImplementationGateWarningExample,
  });

export const realRegistryWriteImplementationChecklistRequiresSeparateFutureApprovalExample =
  createRealRegistryWriteImplementationChecklist({
    gate: realRegistryWriteImplementationGateReadyExample,
    checklistId:
      'real-registry-write-implementation-checklist-requires-future-approval',
    overrides: {
      confirmations: {
        confirm_future_real_implementation_needs_separate_approval: true,
      },
      note:
        'Checklist confirms a future real write implementation draft still needs separate owner approval.',
    },
  });

export const realRegistryWriteImplementationChecklistBlockedExample =
  createRealRegistryWriteImplementationChecklist({
    gate: realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample,
  });
