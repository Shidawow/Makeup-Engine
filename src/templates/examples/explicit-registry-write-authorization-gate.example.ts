import { createExplicitRegistryWriteAuthorizationGate } from '../../template-engine';
import {
  controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
  controlledRegistryWriterDraftMissingActualWriteBlockedExample,
  controlledRegistryWriterDraftMissingDryRunOnlyExample,
  controlledRegistryWriterDraftMissingGateExample,
  controlledRegistryWriterDraftMissingPackageReplacementBlockedExample,
  controlledRegistryWriterDraftMissingPublishBlockedExample,
  controlledRegistryWriterDraftProductionMarkerBlockedExample,
  controlledRegistryWriterDraftReadyExample,
  controlledRegistryWriterDraftShellReplacementBlockedExample,
  controlledRegistryWriterDraftWarningExample,
} from './controlled-user-app-template-package-registry-writer-draft.example';
import {
  controlledRegistryWriterValidationActualRegistryWriteExample,
  controlledRegistryWriterValidationMissingActualWriteBlockedExample,
  controlledRegistryWriterValidationMissingDryRunOnlyExample,
  controlledRegistryWriterValidationMissingGateExample,
  controlledRegistryWriterValidationMissingPackageReplacementBlockedExample,
  controlledRegistryWriterValidationMissingPublishBlockedExample,
  controlledRegistryWriterValidationProductionMarkerExample,
  controlledRegistryWriterValidationReadyExample,
  controlledRegistryWriterValidationShellReplacementExample,
  controlledRegistryWriterValidationWarningExample,
} from './controlled-user-app-template-package-registry-writer-validation.example';
import {
  explicitRegistryWriteAuthorizationChecklistMissingFutureApprovalExample,
  explicitRegistryWriteAuthorizationChecklistMissingOwnerRequirementExample,
  explicitRegistryWriteAuthorizationChecklistMissingReviewerAckExample,
  explicitRegistryWriteAuthorizationChecklistReadyExample,
  explicitRegistryWriteAuthorizationChecklistWarningExample,
} from './explicit-registry-write-authorization-checklist.example';

export const explicitRegistryWriteAuthorizationGateReadyExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
  });

export const explicitRegistryWriteAuthorizationGateWarningExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftWarningExample,
    validation: controlledRegistryWriterValidationWarningExample,
    checklist: explicitRegistryWriteAuthorizationChecklistWarningExample,
  });

export const explicitRegistryWriteAuthorizationGateMissingWriterValidationExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftMissingGateExample,
    validation: controlledRegistryWriterValidationMissingGateExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
    gateId: 'explicit-registry-write-authorization-gate-missing-writer-validation',
  });

export const explicitRegistryWriteAuthorizationGateMissingDryRunOnlyExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftMissingDryRunOnlyExample,
    validation: controlledRegistryWriterValidationMissingDryRunOnlyExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
    gateId: 'explicit-registry-write-authorization-gate-missing-dry-run-only',
  });

export const explicitRegistryWriteAuthorizationGateMissingActualWriteBlockedExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftMissingActualWriteBlockedExample,
    validation: controlledRegistryWriterValidationMissingActualWriteBlockedExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
    gateId:
      'explicit-registry-write-authorization-gate-missing-actual-write-blocked',
  });

export const explicitRegistryWriteAuthorizationGateMissingPublishBlockedExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftMissingPublishBlockedExample,
    validation: controlledRegistryWriterValidationMissingPublishBlockedExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
    gateId: 'explicit-registry-write-authorization-gate-missing-publish-blocked',
  });

export const explicitRegistryWriteAuthorizationGateMissingPackageReplacementBlockedExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftMissingPackageReplacementBlockedExample,
    validation:
      controlledRegistryWriterValidationMissingPackageReplacementBlockedExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
    gateId:
      'explicit-registry-write-authorization-gate-missing-package-replacement-blocked',
  });

export const explicitRegistryWriteAuthorizationGateActualRegistryWriteBlockedExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftActualRegistryWriteBlockedExample,
    validation: controlledRegistryWriterValidationActualRegistryWriteExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
  });

export const explicitRegistryWriteAuthorizationGateProductionMarkerBlockedExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftProductionMarkerBlockedExample,
    validation: controlledRegistryWriterValidationProductionMarkerExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
  });

export const explicitRegistryWriteAuthorizationGateShellReplacementBlockedExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftShellReplacementBlockedExample,
    validation: controlledRegistryWriterValidationShellReplacementExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
  });

export const explicitRegistryWriteAuthorizationGateMissingOwnerAuthorizationExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklist:
      explicitRegistryWriteAuthorizationChecklistMissingOwnerRequirementExample,
    gateId:
      'explicit-registry-write-authorization-gate-missing-owner-authorization',
  });

export const explicitRegistryWriteAuthorizationGateMissingReviewerAckExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklist: explicitRegistryWriteAuthorizationChecklistMissingReviewerAckExample,
    gateId: 'explicit-registry-write-authorization-gate-missing-reviewer-ack',
  });

export const explicitRegistryWriteAuthorizationGateMissingFutureApprovalExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklist:
      explicitRegistryWriteAuthorizationChecklistMissingFutureApprovalExample,
    gateId: 'explicit-registry-write-authorization-gate-missing-future-approval',
  });

export const explicitRegistryWriteAuthorizationGateProductionWriteEnabledExample =
  createExplicitRegistryWriteAuthorizationGate({
    draft: controlledRegistryWriterDraftReadyExample,
    validation: controlledRegistryWriterValidationReadyExample,
    checklist: explicitRegistryWriteAuthorizationChecklistReadyExample,
    gateId: 'explicit-registry-write-authorization-gate-production-write-enabled',
    overrides: { productionWriteDisabled: false },
  });
