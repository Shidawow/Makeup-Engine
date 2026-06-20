import { createFinalRealWriteReviewGate } from '../../template-engine';
import {
  realRegistryWriteImplementationDraftMissingActualWriteBlockedExample,
  realRegistryWriteImplementationDraftMissingDryRunOnlyExample,
  realRegistryWriteImplementationDraftMissingGateReadyExample,
  realRegistryWriteImplementationDraftMissingPackageReplacementBlockedExample,
  realRegistryWriteImplementationDraftMissingProductionWriterBlockedExample,
  realRegistryWriteImplementationDraftMissingPublishBlockedExample,
  realRegistryWriteImplementationDraftReadyExample,
  realRegistryWriteImplementationDraftWarningExample,
} from './real-registry-write-implementation-draft.example';
import {
  realRegistryWriteImplementationDraftValidationMissingActualWriteBlockedExample,
  realRegistryWriteImplementationDraftValidationMissingDryRunOnlyExample,
  realRegistryWriteImplementationDraftValidationMissingGateReadyExample,
  realRegistryWriteImplementationDraftValidationMissingPackageReplacementBlockedExample,
  realRegistryWriteImplementationDraftValidationMissingProductionWriterBlockedExample,
  realRegistryWriteImplementationDraftValidationMissingPublishBlockedExample,
  realRegistryWriteImplementationDraftValidationReadyExample,
  realRegistryWriteImplementationDraftValidationWarningExample,
} from './real-registry-write-implementation-draft-validation.example';

export const finalRealWriteReviewGateReadyExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
  });

export const finalRealWriteReviewGateWarningExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftWarningExample,
    validation: realRegistryWriteImplementationDraftValidationWarningExample,
  });

export const finalRealWriteReviewGateMissingImplementationDraftValidationExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftMissingGateReadyExample,
    validation: realRegistryWriteImplementationDraftValidationMissingGateReadyExample,
    gateId: 'final-real-write-review-gate-missing-implementation-draft-validation',
  });

export const finalRealWriteReviewGateOwnerActualWriteExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    gateId: 'final-real-write-review-gate-owner-actual-write',
    overrides: { ownerAuthorizationScope: 'actual_write' },
  });

export const finalRealWriteReviewGateOwnerPublishExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    gateId: 'final-real-write-review-gate-owner-publish',
    overrides: { ownerAuthorizationScope: 'publish' },
  });

export const finalRealWriteReviewGateOwnerShellReplacementExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    gateId: 'final-real-write-review-gate-owner-shell-replacement',
    overrides: { ownerAuthorizationScope: 'user_app_shell_replacement' },
  });

export const finalRealWriteReviewGateMissingDryRunOnlyExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftMissingDryRunOnlyExample,
    validation: realRegistryWriteImplementationDraftValidationMissingDryRunOnlyExample,
    gateId: 'final-real-write-review-gate-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const finalRealWriteReviewGateMissingActualWriteBlockedExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftMissingActualWriteBlockedExample,
    validation:
      realRegistryWriteImplementationDraftValidationMissingActualWriteBlockedExample,
    gateId: 'final-real-write-review-gate-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const finalRealWriteReviewGateMissingPublishBlockedExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftMissingPublishBlockedExample,
    validation: realRegistryWriteImplementationDraftValidationMissingPublishBlockedExample,
    gateId: 'final-real-write-review-gate-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const finalRealWriteReviewGateMissingPackageReplacementBlockedExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftMissingPackageReplacementBlockedExample,
    validation:
      realRegistryWriteImplementationDraftValidationMissingPackageReplacementBlockedExample,
    gateId: 'final-real-write-review-gate-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const finalRealWriteReviewGateMissingProductionWriterBlockedExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftMissingProductionWriterBlockedExample,
    validation:
      realRegistryWriteImplementationDraftValidationMissingProductionWriterBlockedExample,
    gateId: 'final-real-write-review-gate-missing-production-writer-blocked',
    overrides: { productionWriterBlocked: false },
  });

export const finalRealWriteReviewGateActualRegistryWriteExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    gateId: 'final-real-write-review-gate-actual-registry-write',
    overrides: { note: 'registryWriteExecuted' },
  });

export const finalRealWriteReviewGateProductionMarkerExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    gateId: 'final-real-write-review-gate-production-marker',
    overrides: { note: 'productionPackageId' },
  });

export const finalRealWriteReviewGateShellReplacementExample =
  createFinalRealWriteReviewGate({
    draft: realRegistryWriteImplementationDraftReadyExample,
    validation: realRegistryWriteImplementationDraftValidationReadyExample,
    gateId: 'final-real-write-review-gate-shell-replacement',
    overrides: { note: 'replaceUserAppShellPackage' },
  });
