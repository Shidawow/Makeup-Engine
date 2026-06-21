import { createRealWriteApprovalBoundary } from '../../template-engine';
import {
  guardedSimulatorReviewGateActualRegistryWriteExample,
  guardedSimulatorReviewGateMissingActualWriteBlockedExample,
  guardedSimulatorReviewGateMissingDryRunOnlyExample,
  guardedSimulatorReviewGateMissingPackageReplacementBlockedExample,
  guardedSimulatorReviewGateMissingProductionWriterBlockedExample,
  guardedSimulatorReviewGateMissingPublishBlockedExample,
  guardedSimulatorReviewGateMissingRegistryMutationBlockedExample,
  guardedSimulatorReviewGateMissingSimulationValidationExample,
  guardedSimulatorReviewGateProductionMarkerExample,
  guardedSimulatorReviewGateProductionWriterCreationExample,
  guardedSimulatorReviewGateReadyExample,
  guardedSimulatorReviewGateRegistryMutationExample,
  guardedSimulatorReviewGateShellReplacementExample,
  guardedSimulatorReviewGateWarningExample,
} from './guarded-simulator-review-gate.example';

export const realWriteApprovalBoundaryReadyExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateReadyExample,
  });

export const realWriteApprovalBoundaryWarningExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateWarningExample,
    boundaryId: 'real-write-approval-boundary-warning',
  });

export const realWriteApprovalBoundaryMissingSimulatorReviewGateExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateMissingSimulationValidationExample,
    boundaryId: 'real-write-approval-boundary-missing-simulator-review-gate',
  });

export const realWriteApprovalBoundaryActualWriteScopeExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateReadyExample,
    boundaryId: 'real-write-approval-boundary-actual-write-scope',
    overrides: { approvalScope: 'actual_write' },
  });

export const realWriteApprovalBoundaryRegistryMutationScopeExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateReadyExample,
    boundaryId: 'real-write-approval-boundary-registry-mutation-scope',
    overrides: { approvalScope: 'registry_mutation' },
  });

export const realWriteApprovalBoundaryPublishScopeExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateReadyExample,
    boundaryId: 'real-write-approval-boundary-publish-scope',
    overrides: { approvalScope: 'publish' },
  });

export const realWriteApprovalBoundaryShellReplacementScopeExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateReadyExample,
    boundaryId: 'real-write-approval-boundary-shell-replacement-scope',
    overrides: { approvalScope: 'user_app_shell_replacement' },
  });

export const realWriteApprovalBoundaryProductionWriterScopeExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateReadyExample,
    boundaryId: 'real-write-approval-boundary-production-writer-scope',
    overrides: { approvalScope: 'production_writer_creation' },
  });

export const realWriteApprovalBoundaryMissingDryRunOnlyExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateMissingDryRunOnlyExample,
    boundaryId: 'real-write-approval-boundary-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const realWriteApprovalBoundaryMissingActualWriteBlockedExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateMissingActualWriteBlockedExample,
    boundaryId: 'real-write-approval-boundary-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const realWriteApprovalBoundaryMissingRegistryMutationBlockedExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateMissingRegistryMutationBlockedExample,
    boundaryId: 'real-write-approval-boundary-missing-registry-mutation-blocked',
    overrides: { registryMutationBlocked: false },
  });

export const realWriteApprovalBoundaryMissingPublishBlockedExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateMissingPublishBlockedExample,
    boundaryId: 'real-write-approval-boundary-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const realWriteApprovalBoundaryMissingPackageReplacementBlockedExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateMissingPackageReplacementBlockedExample,
    boundaryId: 'real-write-approval-boundary-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const realWriteApprovalBoundaryMissingProductionWriterBlockedExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateMissingProductionWriterBlockedExample,
    boundaryId: 'real-write-approval-boundary-missing-production-writer-blocked',
    overrides: { productionWriterBlocked: false },
  });

export const realWriteApprovalBoundaryActualRegistryWriteExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateActualRegistryWriteExample,
    boundaryId: 'real-write-approval-boundary-actual-registry-write',
    overrides: { note: 'registryWriteExecuted' },
  });

export const realWriteApprovalBoundaryRegistryMutationExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateRegistryMutationExample,
    boundaryId: 'real-write-approval-boundary-registry-mutation',
    overrides: { note: 'registryMutation' },
  });

export const realWriteApprovalBoundaryProductionMarkerExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateProductionMarkerExample,
    boundaryId: 'real-write-approval-boundary-production-marker',
    overrides: { note: 'productionPackageId' },
  });

export const realWriteApprovalBoundaryShellReplacementExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateShellReplacementExample,
    boundaryId: 'real-write-approval-boundary-shell-replacement',
    overrides: { note: 'replaceUserAppShellPackage' },
  });

export const realWriteApprovalBoundaryProductionWriterCreationExample =
  createRealWriteApprovalBoundary({
    gate: guardedSimulatorReviewGateProductionWriterCreationExample,
    boundaryId: 'real-write-approval-boundary-production-writer-creation',
    overrides: { note: 'createProductionWriter' },
  });
