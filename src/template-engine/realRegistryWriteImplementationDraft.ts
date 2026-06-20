import type {
  RealRegistryWriteImplementationGateResult,
} from './realRegistryWriteImplementationGate';
import type {
  RealRegistryWriteImplementationHandoff,
} from './realRegistryWriteImplementationHandoff';
import {
  registryPreparationActualRegistryWritePattern,
  registryPreparationFinalClaimPattern,
  registryPreparationMedicalClaimPattern,
  registryPreparationPersonalDataPattern,
  registryPreparationProductionMarkerPattern,
  registryPreparationRawImageReferencePattern,
  registryPreparationShadeClaimPattern,
  registryPreparationShellReplacementPattern,
} from './userAppTemplatePackageRegistryPreparation';

export type RealRegistryWriteImplementationDraftStatus =
  | 'implementation_draft_ready'
  | 'implementation_draft_ready_with_warnings'
  | 'implementation_draft_blocked'
  | 'implementation_draft_example_only';

export interface RealRegistryWriteImplementationDraftSource {
  implementationGateStatus: RealRegistryWriteImplementationGateResult['status'];
  implementationGateDecision: RealRegistryWriteImplementationGateResult['decision'];
  sourceReadyForImplementationDraft: boolean;
}

export interface RealRegistryWriteWriterInterfaceDraft {
  interfaceId: string;
  label: string;
  dryRunOnly: true;
  actualWriteBlocked: true;
  productionWriterBlocked: true;
  methods: Array<{
    id: string;
    label: string;
    dryRunOnly: true;
    actualMutationBlocked: true;
    summary: string;
  }>;
  summary: string;
}

export interface RealRegistryWriteTransactionDraft {
  transactionId: string;
  mode: 'dry_run_transaction_draft';
  dryRunOnly: true;
  actualWriteBlocked: true;
  steps: Array<{
    id: string;
    order: number;
    label: string;
    actualMutationBlocked: true;
    summary: string;
  }>;
  summary: string;
}

export interface RealRegistryWriteLockDraft {
  lockId: string;
  dryRunOnly: true;
  requiredBeforeAnyFutureWrite: true;
  locks: Array<{
    id: string;
    label: string;
    required: true;
    status: 'ready' | 'warning' | 'blocked';
    note: string;
  }>;
  summary: string;
}

export interface RealRegistryWriteAuditEventDraft {
  auditEventId: string;
  dryRunOnly: true;
  actualAuditOnly: true;
  events: Array<{
    id: string;
    label: string;
    required: true;
    sourceTrace: string;
    summary: string;
  }>;
  summary: string;
}

export interface RealRegistryWriteRollbackCommandDraft {
  rollbackCommandId: string;
  dryRunOnly: true;
  actualRollbackBlocked: true;
  commands: Array<{
    id: string;
    label: string;
    actualMutationBlocked: true;
    summary: string;
  }>;
  summary: string;
}

export interface RealRegistryWriteImplementationDraftWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface RealRegistryWriteImplementationDraftBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface RealRegistryWriteImplementationDraftTrace {
  source: RealRegistryWriteImplementationDraftSource;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  sourceRegistryWriteGateId: string;
  sourceRegistryPreparationId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: RealRegistryWriteImplementationGateResult['trace']['previewTrace'];
  gateTrace: RealRegistryWriteImplementationGateResult['trace']['gateTrace'];
  writerTrace: RealRegistryWriteImplementationGateResult['trace']['writerTrace'];
  executionTrace: RealRegistryWriteImplementationGateResult['trace']['executionDesignTrace'];
  implementationGateTrace: RealRegistryWriteImplementationGateResult['trace'];
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
}

export interface RealRegistryWriteImplementationDraft {
  implementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  writerInterfaceDraft: RealRegistryWriteWriterInterfaceDraft | null;
  transactionDraft: RealRegistryWriteTransactionDraft | null;
  writeLockDraft: RealRegistryWriteLockDraft | null;
  auditEventDraft: RealRegistryWriteAuditEventDraft | null;
  rollbackCommandDraft: RealRegistryWriteRollbackCommandDraft | null;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  productionWriterBlocked: boolean;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: RealRegistryWriteImplementationGateResult['trace']['previewTrace'];
  gateTrace: RealRegistryWriteImplementationGateResult['trace']['gateTrace'];
  writerTrace: RealRegistryWriteImplementationGateResult['trace']['writerTrace'];
  executionTrace: RealRegistryWriteImplementationGateResult['trace']['executionDesignTrace'];
  implementationGateTrace: RealRegistryWriteImplementationGateResult['trace'];
  warnings: RealRegistryWriteImplementationDraftWarning[];
  blockedReasons: RealRegistryWriteImplementationDraftBlockedReason[];
  implementationDraftStatus: RealRegistryWriteImplementationDraftStatus;
  implementationDraftOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  readyForFinalRealWriteReviewGate: boolean;
  trace: RealRegistryWriteImplementationDraftTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface RealRegistryWriteImplementationDraftOverrides {
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  productionWriterBlocked?: boolean;
  omitWriterInterfaceDraft?: boolean;
  omitTransactionDraft?: boolean;
  omitWriteLockDraft?: boolean;
  omitAuditEventDraft?: boolean;
  omitRollbackCommandDraft?: boolean;
  writerInterfaceDraft?: RealRegistryWriteWriterInterfaceDraft | null;
  transactionDraft?: RealRegistryWriteTransactionDraft | null;
  writeLockDraft?: RealRegistryWriteLockDraft | null;
  auditEventDraft?: RealRegistryWriteAuditEventDraft | null;
  rollbackCommandDraft?: RealRegistryWriteRollbackCommandDraft | null;
  note?: string;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const buildBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): RealRegistryWriteImplementationDraftBlockedReason => ({
  id,
  message,
  recommendation,
});

const createWriterInterfaceDraft = (
  gate: RealRegistryWriteImplementationGateResult,
): RealRegistryWriteWriterInterfaceDraft => ({
  interfaceId: `real-registry-write-writer-interface-draft-${gate.gateId}`,
  label: 'Dry-run real registry writer interface draft',
  dryRunOnly: true,
  actualWriteBlocked: true,
  productionWriterBlocked: true,
  methods: [
    {
      id: 'prepare_write_preview',
      label: 'Prepare write preview',
      dryRunOnly: true,
      actualMutationBlocked: true,
      summary:
        'Prepare a serializable write preview for later review without mutating registry state.',
    },
    {
      id: 'validate_write_preconditions',
      label: 'Validate write preconditions',
      dryRunOnly: true,
      actualMutationBlocked: true,
      summary:
        'Validate dry-run, lock, audit, rollback, and owner authorization preconditions.',
    },
    {
      id: 'emit_draft_audit_event',
      label: 'Emit draft audit event',
      dryRunOnly: true,
      actualMutationBlocked: true,
      summary:
        'Describe the audit event that a future writer would need before execution.',
    },
  ],
  summary:
    'Interface draft only; it cannot write a registry, publish, or replace the current User App Shell package.',
});

const createTransactionDraft = (
  gate: RealRegistryWriteImplementationGateResult,
): RealRegistryWriteTransactionDraft => ({
  transactionId: `real-registry-write-transaction-draft-${gate.gateId}`,
  mode: 'dry_run_transaction_draft',
  dryRunOnly: true,
  actualWriteBlocked: true,
  steps: [
    {
      id: 'load_registry_preview',
      order: 1,
      label: 'Load registry preview',
      actualMutationBlocked: true,
      summary: 'Read the source preview and trace as immutable draft input.',
    },
    {
      id: 'compare_existing_entry_preview',
      order: 2,
      label: 'Compare existing entry preview',
      actualMutationBlocked: true,
      summary:
        'Compare proposed and existing entry previews without persisting any diff.',
    },
    {
      id: 'prepare_commit_candidate',
      order: 3,
      label: 'Prepare commit candidate',
      actualMutationBlocked: true,
      summary:
        'Prepare a future commit candidate for review; the draft cannot commit it.',
    },
  ],
  summary:
    'Transaction draft remains dry-run only and cannot persist a registry entry.',
});

const createWriteLockDraft = (
  gate: RealRegistryWriteImplementationGateResult,
): RealRegistryWriteLockDraft => ({
  lockId: `real-registry-write-lock-draft-${gate.gateId}`,
  dryRunOnly: true,
  requiredBeforeAnyFutureWrite: true,
  locks: [
    {
      id: 'package_id_lock',
      label: 'Package id lock',
      required: true,
      status: 'ready',
      note: 'Future writer must lock the package id before execution.',
    },
    {
      id: 'package_version_lock',
      label: 'Package version lock',
      required: true,
      status: 'ready',
      note: 'Future writer must lock the package version before execution.',
    },
    {
      id: 'owner_authorization_lock',
      label: 'Owner authorization lock',
      required: true,
      status: gate.futureExplicitApprovalRequired ? 'ready' : 'blocked',
      note: 'Future writer still needs separate owner authorization.',
    },
  ],
  summary:
    'Write lock draft defines required locks for a later phase; it does not acquire locks.',
});

const createAuditEventDraft = (
  gate: RealRegistryWriteImplementationGateResult,
): RealRegistryWriteAuditEventDraft => ({
  auditEventId: `real-registry-write-audit-event-draft-${gate.gateId}`,
  dryRunOnly: true,
  actualAuditOnly: true,
  events: [
    {
      id: 'implementation_gate_event',
      label: 'Implementation gate event',
      required: true,
      sourceTrace: gate.gateId,
      summary: 'Record the 10N gate status before any future final review gate.',
    },
    {
      id: 'execution_design_event',
      label: 'Execution design event',
      required: true,
      sourceTrace: gate.sourceExecutionDesignId,
      summary: 'Record the Phase 10M execution design lineage.',
    },
    {
      id: 'owner_authorization_event',
      label: 'Owner authorization event',
      required: true,
      sourceTrace: gate.sourceAuthorizationGateId,
      summary: 'Record that a later owner authorization is still required.',
    },
  ],
  summary:
    'Audit event draft is local documentation only and does not emit production audit records.',
});

const createRollbackCommandDraft = (
  gate: RealRegistryWriteImplementationGateResult,
): RealRegistryWriteRollbackCommandDraft => ({
  rollbackCommandId: `real-registry-write-rollback-command-draft-${gate.gateId}`,
  dryRunOnly: true,
  actualRollbackBlocked: true,
  commands: [
    {
      id: 'restore_existing_entry_preview',
      label: 'Restore existing entry preview',
      actualMutationBlocked: true,
      summary:
        'Describe how a future writer would restore the previous entry preview after review.',
    },
    {
      id: 'invalidate_commit_candidate',
      label: 'Invalidate commit candidate',
      actualMutationBlocked: true,
      summary:
        'Describe how a future writer would invalidate an uncommitted candidate.',
    },
    {
      id: 'retain_audit_trace',
      label: 'Retain audit trace',
      actualMutationBlocked: true,
      summary: 'Keep audit trace available for review without changing registry state.',
    },
  ],
  summary:
    'Rollback command draft is required before future execution but cannot run rollback.',
});

const draftPayloadText = ({
  draft,
  note = '',
}: {
  draft: Pick<
    RealRegistryWriteImplementationDraft,
    | 'writerInterfaceDraft'
    | 'transactionDraft'
    | 'writeLockDraft'
    | 'auditEventDraft'
    | 'rollbackCommandDraft'
    | 'summary'
  >;
  note?: string;
}): string =>
  JSON.stringify({
    writerInterfaceDraft: draft.writerInterfaceDraft,
    transactionDraft: draft.transactionDraft,
    writeLockDraft: draft.writeLockDraft,
    auditEventDraft: draft.auditEventDraft,
    rollbackCommandDraft: draft.rollbackCommandDraft,
    summary: draft.summary,
    note,
  });

export const createRealRegistryWriteImplementationDraft = ({
  gate,
  handoff,
  implementationDraftId = `real-registry-write-implementation-draft-${gate.gateId}`,
  overrides = {},
}: {
  gate: RealRegistryWriteImplementationGateResult;
  handoff?: RealRegistryWriteImplementationHandoff;
  implementationDraftId?: string;
  overrides?: RealRegistryWriteImplementationDraftOverrides;
}): RealRegistryWriteImplementationDraft => {
  const sourceReadyForImplementationDraft =
    gate.readyForFutureRealWriteImplementationDraft &&
    (gate.status === 'real_write_implementation_gate_ready' ||
      gate.status === 'real_write_implementation_gate_ready_with_warnings') &&
    (!handoff || handoff.readyForFutureRealWriteImplementationDraft);
  const dryRunOnly = overrides.dryRunOnly ?? gate.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? gate.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? gate.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? gate.packageReplacementBlocked;
  const productionWriterBlocked = overrides.productionWriterBlocked ?? true;
  const summary =
    'Real registry write implementation draft remains draft-only and dry-run only; it cannot write a registry, publish, create a production writer, or replace the current User App Shell package.';

  const draftShell: RealRegistryWriteImplementationDraft = {
    implementationDraftId,
    sourceImplementationGateId: gate.gateId,
    sourceExecutionDesignId: gate.sourceExecutionDesignId,
    sourceWriterDraftId: gate.sourceWriterDraftId,
    writerInterfaceDraft:
      overrides.writerInterfaceDraft ??
      (overrides.omitWriterInterfaceDraft
        ? null
        : createWriterInterfaceDraft(gate)),
    transactionDraft:
      overrides.transactionDraft ??
      (overrides.omitTransactionDraft ? null : createTransactionDraft(gate)),
    writeLockDraft:
      overrides.writeLockDraft ??
      (overrides.omitWriteLockDraft ? null : createWriteLockDraft(gate)),
    auditEventDraft:
      overrides.auditEventDraft ??
      (overrides.omitAuditEventDraft ? null : createAuditEventDraft(gate)),
    rollbackCommandDraft:
      overrides.rollbackCommandDraft ??
      (overrides.omitRollbackCommandDraft
        ? null
        : createRollbackCommandDraft(gate)),
    dryRunOnly,
    actualWriteBlocked,
    publishBlocked,
    packageReplacementBlocked,
    productionWriterBlocked,
    qaTrace: gate.trace.qaTrace,
    humanReviewTrace: gate.trace.humanReviewTrace,
    candidateTrace: gate.trace.candidateTrace,
    contractTrace: gate.trace.contractTrace,
    previewTrace: gate.trace.previewTrace,
    gateTrace: gate.trace.gateTrace,
    writerTrace: gate.trace.writerTrace,
    executionTrace: gate.trace.executionDesignTrace,
    implementationGateTrace: gate.trace,
    warnings: [],
    blockedReasons: [],
    implementationDraftStatus: 'implementation_draft_blocked',
    implementationDraftOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    readyForFinalRealWriteReviewGate: false,
    trace: {
      source: {
        implementationGateStatus: gate.status,
        implementationGateDecision: gate.decision,
        sourceReadyForImplementationDraft,
      },
      sourceImplementationGateId: gate.gateId,
      sourceExecutionDesignId: gate.sourceExecutionDesignId,
      sourceWriterDraftId: gate.sourceWriterDraftId,
      sourceRegistryWriteGateId: gate.sourceRegistryWriteGateId,
      sourceRegistryPreparationId: gate.trace.sourceRegistryPreparationId,
      qaTrace: gate.trace.qaTrace,
      humanReviewTrace: gate.trace.humanReviewTrace,
      candidateTrace: gate.trace.candidateTrace,
      contractTrace: gate.trace.contractTrace,
      previewTrace: gate.trace.previewTrace,
      gateTrace: gate.trace.gateTrace,
      writerTrace: gate.trace.writerTrace,
      executionTrace: gate.trace.executionDesignTrace,
      implementationGateTrace: gate.trace,
      noRawImageReference: gate.trace.noRawImageReference,
      noPersonalData: gate.trace.noPersonalData,
      noMedicalClaims: gate.trace.noMedicalClaims,
      noProductShadeClaims: gate.trace.noProductShadeClaims,
      noUnsupportedFinalClaims: gate.trace.noUnsupportedFinalClaims,
      noActualRegistryWrite: gate.trace.noActualRegistryWrite,
      noUserAppShellPackageReplacement:
        gate.trace.noUserAppShellPackageReplacement,
      noProductionPackageMarker: gate.trace.noProductionPackageMarker,
    },
    summary,
    jsonRoundTripStable: false,
  };

  const payloadText = draftPayloadText({
    draft: draftShell,
    note: overrides.note,
  });
  const blockedReasons: RealRegistryWriteImplementationDraftBlockedReason[] = [];
  const pushBlocked = (
    id: string,
    message: string,
    recommendation: string,
  ) => {
    blockedReasons.push(buildBlockedReason(id, message, recommendation));
  };

  if (!sourceReadyForImplementationDraft) {
    pushBlocked(
      'missing_implementation_gate_ready',
      'Implementation draft requires a ready Phase 10N implementation gate.',
      'Return to Phase 10N and resolve the implementation gate before drafting a writer.',
    );
  }
  if (!dryRunOnly) {
    pushBlocked(
      'missing_dry_run_only',
      'Implementation draft must keep dryRunOnly true.',
      'Restore dryRunOnly before continuing.',
    );
  }
  if (!actualWriteBlocked) {
    pushBlocked(
      'missing_actual_write_blocked',
      'Implementation draft must keep actual registry writes blocked.',
      'Restore actualWriteBlocked and remove write execution markers.',
    );
  }
  if (!publishBlocked) {
    pushBlocked(
      'missing_publish_blocked',
      'Implementation draft must keep publication blocked.',
      'Restore publishBlocked and keep release out of scope.',
    );
  }
  if (!packageReplacementBlocked) {
    pushBlocked(
      'missing_package_replacement_blocked',
      'Implementation draft must not replace the current User App Shell package.',
      'Restore packageReplacementBlocked before continuing.',
    );
  }
  if (!productionWriterBlocked) {
    pushBlocked(
      'missing_production_writer_blocked',
      'Implementation draft must not create a production writer.',
      'Restore productionWriterBlocked before continuing.',
    );
  }
  if (!draftShell.writerInterfaceDraft) {
    pushBlocked(
      'missing_writer_interface_draft',
      'Implementation draft requires a writer interface draft.',
      'Add a dry-run writer interface draft before final review.',
    );
  }
  if (!draftShell.transactionDraft) {
    pushBlocked(
      'missing_transaction_draft',
      'Implementation draft requires a transaction draft.',
      'Add a dry-run transaction draft before final review.',
    );
  }
  if (!draftShell.writeLockDraft) {
    pushBlocked(
      'missing_write_lock_draft',
      'Implementation draft requires a write lock draft.',
      'Add write lock draft requirements before final review.',
    );
  }
  if (!draftShell.auditEventDraft) {
    pushBlocked(
      'missing_audit_event_draft',
      'Implementation draft requires an audit event draft.',
      'Add audit event draft requirements before final review.',
    );
  }
  if (!draftShell.rollbackCommandDraft) {
    pushBlocked(
      'missing_rollback_command_draft',
      'Implementation draft requires a rollback command draft.',
      'Add rollback command draft requirements before final review.',
    );
  }
  if (
    !gate.trace.noRawImageReference ||
    registryPreparationRawImageReferencePattern.test(payloadText)
  ) {
    pushBlocked(
      'raw_image_reference',
      'Implementation draft must not include raw image references.',
      'Remove raw images, object URLs, base64, local paths, and runtime asset names.',
    );
  }
  if (
    !gate.trace.noPersonalData ||
    registryPreparationPersonalDataPattern.test(payloadText)
  ) {
    pushBlocked(
      'personal_data',
      'Implementation draft must not include personal data.',
      'Remove names, contact data, health data, sensitive identity data, and biometrics.',
    );
  }
  if (
    !gate.trace.noMedicalClaims ||
    registryPreparationMedicalClaimPattern.test(payloadText)
  ) {
    pushBlocked(
      'medical_claim',
      'Implementation draft must not include medical claims.',
      'Remove diagnosis, treatment, or health outcome claims.',
    );
  }
  if (
    !gate.trace.noProductShadeClaims ||
    registryPreparationShadeClaimPattern.test(payloadText)
  ) {
    pushBlocked(
      'product_shade_claim',
      'Implementation draft must not include product shade claims.',
      'Keep product copy as placeholders without brand or shade claims.',
    );
  }
  if (
    !gate.trace.noUnsupportedFinalClaims ||
    registryPreparationFinalClaimPattern.test(payloadText)
  ) {
    pushBlocked(
      'unsupported_final_claim',
      'Implementation draft must not include unsupported final claims.',
      'Keep all copy draft-only and human-review-only.',
    );
  }
  if (
    !gate.trace.noActualRegistryWrite ||
    registryPreparationActualRegistryWritePattern.test(payloadText)
  ) {
    pushBlocked(
      'actual_registry_write_marker',
      'Implementation draft must not include actual registry write markers.',
      'Remove write execution markers and keep the draft dry-run only.',
    );
  }
  if (
    !gate.trace.noProductionPackageMarker ||
    registryPreparationProductionMarkerPattern.test(payloadText)
  ) {
    pushBlocked(
      'production_marker',
      'Implementation draft must not include production writer or package markers.',
      'Remove production markers and keep the implementation draft non-production.',
    );
  }
  if (
    !gate.trace.noUserAppShellPackageReplacement ||
    registryPreparationShellReplacementPattern.test(payloadText)
  ) {
    pushBlocked(
      'user_app_shell_package_replacement',
      'Implementation draft must not replace the current User App Shell package.',
      'Remove shell replacement markers.',
    );
  }

  const warnings: RealRegistryWriteImplementationDraftWarning[] =
    gate.status === 'real_write_implementation_gate_ready_with_warnings'
      ? [
          {
            id: 'source_gate_warnings',
            message:
              'Source implementation gate is ready with warnings; keep this as review-only until warnings are resolved.',
            recommendation:
              'Review the 10N warning trace before final real write review.',
          },
        ]
      : [];
  const implementationDraftStatus: RealRegistryWriteImplementationDraftStatus =
    gate.status === 'real_write_implementation_gate_example_only'
      ? 'implementation_draft_example_only'
      : blockedReasons.length > 0
        ? 'implementation_draft_blocked'
        : warnings.length > 0
          ? 'implementation_draft_ready_with_warnings'
          : 'implementation_draft_ready';

  const draft: RealRegistryWriteImplementationDraft = {
    ...draftShell,
    warnings,
    blockedReasons,
    implementationDraftStatus,
    readyForFinalRealWriteReviewGate:
      implementationDraftStatus === 'implementation_draft_ready' ||
      implementationDraftStatus === 'implementation_draft_ready_with_warnings',
  };
  draft.jsonRoundTripStable = isJsonRoundTripStable(draft);
  return draft;
};
