import { createRealWriteExecutionAuthorization } from '../../template-engine';
import {
  finalRealWriteReviewGateMissingActualWriteBlockedExample,
  finalRealWriteReviewGateMissingDryRunOnlyExample,
  finalRealWriteReviewGateMissingImplementationDraftValidationExample,
  finalRealWriteReviewGateMissingPackageReplacementBlockedExample,
  finalRealWriteReviewGateMissingProductionWriterBlockedExample,
  finalRealWriteReviewGateMissingPublishBlockedExample,
  finalRealWriteReviewGateReadyExample,
  finalRealWriteReviewGateWarningExample,
} from './final-real-write-review-gate.example';

export const realWriteExecutionAuthorizationReadyExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
  });

export const realWriteExecutionAuthorizationWarningExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateWarningExample,
  });

export const realWriteExecutionAuthorizationMissingFinalReviewGateReadyExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateMissingImplementationDraftValidationExample,
    authorizationId:
      'real-write-execution-authorization-missing-final-review-gate-ready',
  });

export const realWriteExecutionAuthorizationOwnerActualRegistryWriteExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId: 'real-write-execution-authorization-owner-actual-registry-write',
    overrides: { ownerAuthorizationScope: 'actual_registry_write' },
  });

export const realWriteExecutionAuthorizationOwnerPublishExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId: 'real-write-execution-authorization-owner-publish',
    overrides: { ownerAuthorizationScope: 'publish' },
  });

export const realWriteExecutionAuthorizationOwnerShellReplacementExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId: 'real-write-execution-authorization-owner-shell-replacement',
    overrides: { ownerAuthorizationScope: 'user_app_shell_replacement' },
  });

export const realWriteExecutionAuthorizationOwnerProductionWriterCreationExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId:
      'real-write-execution-authorization-owner-production-writer-creation',
    overrides: { ownerAuthorizationScope: 'production_writer_creation' },
  });

export const realWriteExecutionAuthorizationMissingDryRunOnlyExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateMissingDryRunOnlyExample,
    authorizationId: 'real-write-execution-authorization-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const realWriteExecutionAuthorizationMissingActualWriteBlockedExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateMissingActualWriteBlockedExample,
    authorizationId:
      'real-write-execution-authorization-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const realWriteExecutionAuthorizationMissingPublishBlockedExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateMissingPublishBlockedExample,
    authorizationId: 'real-write-execution-authorization-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const realWriteExecutionAuthorizationMissingPackageReplacementBlockedExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateMissingPackageReplacementBlockedExample,
    authorizationId:
      'real-write-execution-authorization-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const realWriteExecutionAuthorizationMissingProductionWriterBlockedExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateMissingProductionWriterBlockedExample,
    authorizationId:
      'real-write-execution-authorization-missing-production-writer-blocked',
    overrides: { productionWriterBlocked: false },
  });

export const realWriteExecutionAuthorizationActualRegistryWriteExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId: 'real-write-execution-authorization-actual-registry-write',
    overrides: { note: 'registryWriteExecuted' },
  });

export const realWriteExecutionAuthorizationProductionMarkerExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId: 'real-write-execution-authorization-production-marker',
    overrides: { note: 'productionPackageId' },
  });

export const realWriteExecutionAuthorizationShellReplacementExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId: 'real-write-execution-authorization-shell-replacement',
    overrides: { note: 'replaceUserAppShellPackage' },
  });

export const realWriteExecutionAuthorizationProductionWriterCreationMarkerExample =
  createRealWriteExecutionAuthorization({
    finalReviewGate: finalRealWriteReviewGateReadyExample,
    authorizationId:
      'real-write-execution-authorization-production-writer-creation-marker',
    overrides: { note: 'createProductionWriter' },
  });
