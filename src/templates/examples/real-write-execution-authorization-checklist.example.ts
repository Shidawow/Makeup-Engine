import { createRealWriteExecutionAuthorizationChecklist } from '../../template-engine';
import {
  finalRealWriteReviewGateReadyExample,
  finalRealWriteReviewGateWarningExample,
} from './final-real-write-review-gate.example';

export const realWriteExecutionAuthorizationChecklistReadyExample =
  createRealWriteExecutionAuthorizationChecklist({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
  });

export const realWriteExecutionAuthorizationChecklistWarningExample =
  createRealWriteExecutionAuthorizationChecklist({
    finalReviewGate: finalRealWriteReviewGateWarningExample,
  });

export const realWriteExecutionAuthorizationChecklistOwnerActualWriteBlockedExample =
  createRealWriteExecutionAuthorizationChecklist({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    checklistId:
      'real-write-execution-authorization-checklist-owner-actual-write',
    overrides: { ownerAuthorizationScope: 'actual_registry_write' },
  });

export const realWriteExecutionAuthorizationChecklistMissingOwnerScopeExample =
  createRealWriteExecutionAuthorizationChecklist({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    checklistId:
      'real-write-execution-authorization-checklist-missing-owner-scope',
    overrides: {
      omitRequirements: ['confirm_owner_authorized_phase_10q_only'],
    },
  });
