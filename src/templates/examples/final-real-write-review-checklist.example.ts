import { createFinalRealWriteReviewChecklist } from '../../template-engine';
import {
  realRegistryWriteImplementationDraftReadyExample,
  realRegistryWriteImplementationDraftWarningExample,
} from './real-registry-write-implementation-draft.example';
import {
  realRegistryWriteImplementationDraftValidationReadyExample,
  realRegistryWriteImplementationDraftValidationWarningExample,
} from './real-registry-write-implementation-draft-validation.example';

export const finalRealWriteReviewChecklistReadyExample =
  createFinalRealWriteReviewChecklist({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
  });

export const finalRealWriteReviewChecklistWarningExample =
  createFinalRealWriteReviewChecklist({
    draft: realRegistryWriteImplementationDraftWarningExample,
    validation: realRegistryWriteImplementationDraftValidationWarningExample,
  });

export const finalRealWriteReviewChecklistOwnerActualWriteBlockedExample =
  createFinalRealWriteReviewChecklist({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    checklistId: 'final-real-write-review-checklist-owner-actual-write',
    overrides: { ownerAuthorizationScope: 'actual_write' },
  });

export const finalRealWriteReviewChecklistMissingOwnerScopeExample =
  createFinalRealWriteReviewChecklist({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    checklistId: 'final-real-write-review-checklist-missing-owner-scope',
    overrides: {
      omitRequirements: ['confirm_owner_authorized_review_gate_only'],
    },
  });
