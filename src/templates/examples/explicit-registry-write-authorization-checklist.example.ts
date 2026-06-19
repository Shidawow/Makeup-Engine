import { createExplicitRegistryWriteAuthorizationChecklist } from '../../template-engine';
import {
  controlledRegistryWriterDraftMissingActualWriteBlockedExample,
  controlledRegistryWriterDraftReadyExample,
  controlledRegistryWriterDraftWarningExample,
} from './controlled-user-app-template-package-registry-writer-draft.example';
import {
  controlledRegistryWriterValidationMissingActualWriteBlockedExample,
  controlledRegistryWriterValidationReadyExample,
  controlledRegistryWriterValidationWarningExample,
} from './controlled-user-app-template-package-registry-writer-validation.example';

export const explicitRegistryWriteAuthorizationChecklistReadyExample =
  createExplicitRegistryWriteAuthorizationChecklist({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
  });

export const explicitRegistryWriteAuthorizationChecklistWarningExample =
  createExplicitRegistryWriteAuthorizationChecklist({
    draft: controlledRegistryWriterDraftWarningExample,
    validation: controlledRegistryWriterValidationWarningExample,
  });

export const explicitRegistryWriteAuthorizationChecklistMissingOwnerRequirementExample =
  createExplicitRegistryWriteAuthorizationChecklist({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklistId:
      'explicit-registry-write-authorization-checklist-missing-owner-requirement',
    overrides: {
      omitRequirements: [
        'owner_confirms_future_write_requires_separate_explicit_approval',
      ],
    },
  });

export const explicitRegistryWriteAuthorizationChecklistMissingReviewerAckExample =
  createExplicitRegistryWriteAuthorizationChecklist({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklistId:
      'explicit-registry-write-authorization-checklist-missing-reviewer-ack',
    overrides: { reviewerAckRequired: false },
  });

export const explicitRegistryWriteAuthorizationChecklistMissingFutureApprovalExample =
  createExplicitRegistryWriteAuthorizationChecklist({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklistId:
      'explicit-registry-write-authorization-checklist-missing-future-approval',
    overrides: { futureApprovalRequired: false },
  });

export const explicitRegistryWriteAuthorizationChecklistBlockedExample =
  createExplicitRegistryWriteAuthorizationChecklist({
    draft: controlledRegistryWriterDraftMissingActualWriteBlockedExample,
    validation: controlledRegistryWriterValidationMissingActualWriteBlockedExample,
  });
