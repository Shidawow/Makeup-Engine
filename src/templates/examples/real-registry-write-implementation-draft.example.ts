import { createRealRegistryWriteImplementationDraft } from '../../template-engine';
import {
  realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample,
  realRegistryWriteImplementationGateBlockedByProductionMarkerExample,
  realRegistryWriteImplementationGateBlockedByShellReplacementExample,
  realRegistryWriteImplementationGateMissingActualWriteBlockedExample,
  realRegistryWriteImplementationGateMissingDryRunOnlyExample,
  realRegistryWriteImplementationGateMissingExecutionValidationExample,
  realRegistryWriteImplementationGateMissingPackageReplacementBlockedExample,
  realRegistryWriteImplementationGateMissingPublishBlockedExample,
  realRegistryWriteImplementationGateReadyExample,
  realRegistryWriteImplementationGateWarningExample,
} from './real-registry-write-implementation-gate.example';
import {
  realRegistryWriteImplementationHandoffKeepExecutionDesignOnlyExample,
  realRegistryWriteImplementationHandoffReadyExample,
} from './real-registry-write-implementation-handoff.example';

export const realRegistryWriteImplementationDraftReadyExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    handoff: realRegistryWriteImplementationHandoffReadyExample,
  });

export const realRegistryWriteImplementationDraftWarningExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateWarningExample,
    handoff: realRegistryWriteImplementationHandoffKeepExecutionDesignOnlyExample,
  });

export const realRegistryWriteImplementationDraftMissingGateReadyExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateMissingExecutionValidationExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-gate-ready',
  });

export const realRegistryWriteImplementationDraftMissingDryRunOnlyExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-dry-run-only',
    overrides: { dryRunOnly: false },
  });

export const realRegistryWriteImplementationDraftMissingActualWriteBlockedExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-actual-write-blocked',
    overrides: { actualWriteBlocked: false },
  });

export const realRegistryWriteImplementationDraftMissingPublishBlockedExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-publish-blocked',
    overrides: { publishBlocked: false },
  });

export const realRegistryWriteImplementationDraftMissingPackageReplacementBlockedExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-package-replacement-blocked',
    overrides: { packageReplacementBlocked: false },
  });

export const realRegistryWriteImplementationDraftMissingProductionWriterBlockedExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-production-writer-blocked',
    overrides: { productionWriterBlocked: false },
  });

export const realRegistryWriteImplementationDraftMissingWriterInterfaceExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-writer-interface',
    overrides: { omitWriterInterfaceDraft: true },
  });

export const realRegistryWriteImplementationDraftMissingTransactionExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-transaction',
    overrides: { omitTransactionDraft: true },
  });

export const realRegistryWriteImplementationDraftMissingWriteLockExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-write-lock',
    overrides: { omitWriteLockDraft: true },
  });

export const realRegistryWriteImplementationDraftMissingAuditEventExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-audit-event',
    overrides: { omitAuditEventDraft: true },
  });

export const realRegistryWriteImplementationDraftMissingRollbackCommandExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateReadyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-missing-rollback-command',
    overrides: { omitRollbackCommandDraft: true },
  });

export const realRegistryWriteImplementationDraftActualRegistryWriteExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-actual-registry-write',
    overrides: { note: 'registryWriteExecuted' },
  });

export const realRegistryWriteImplementationDraftProductionMarkerExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateBlockedByProductionMarkerExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-production-marker',
    overrides: { note: 'productionPackageId' },
  });

export const realRegistryWriteImplementationDraftShellReplacementExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateBlockedByShellReplacementExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-shell-replacement',
    overrides: { note: 'replaceUserAppShellPackage' },
  });

export const realRegistryWriteImplementationDraftSourceMissingDryRunOnlyExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateMissingDryRunOnlyExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-source-missing-dry-run',
  });

export const realRegistryWriteImplementationDraftSourceMissingActualWriteBlockedExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateMissingActualWriteBlockedExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-source-missing-actual-write-blocked',
  });

export const realRegistryWriteImplementationDraftSourceMissingPublishBlockedExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateMissingPublishBlockedExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-source-missing-publish-blocked',
  });

export const realRegistryWriteImplementationDraftSourceMissingPackageReplacementBlockedExample =
  createRealRegistryWriteImplementationDraft({
    gate: realRegistryWriteImplementationGateMissingPackageReplacementBlockedExample,
    implementationDraftId:
      'real-registry-write-implementation-draft-source-missing-package-replacement-blocked',
  });
