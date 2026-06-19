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
import type { UserAppTemplatePackageRegistryWriteGateResult } from './userAppTemplatePackageRegistryWriteGate';

export type ControlledRegistryWriterDraftStatus =
  | 'writer_draft_ready'
  | 'writer_draft_ready_with_warnings'
  | 'writer_draft_blocked'
  | 'writer_draft_example_only';

export interface ControlledRegistryWriterDraftSource {
  registryWriteGateStatus: UserAppTemplatePackageRegistryWriteGateResult['status'];
  registryWriteGateDecision: UserAppTemplatePackageRegistryWriteGateResult['decision'];
  sourceReadyForWriterDraft: boolean;
}

export interface ControlledRegistryWriteOperation {
  operationId: string;
  operationType: 'upsert_registry_entry_dry_run';
  targetPackageId: string;
  targetVersion: string;
  dryRunOnly: boolean;
  actualMutationBlocked: boolean;
  status:
    | 'planned_dry_run'
    | 'blocked_until_explicit_authorization'
    | 'blocked_by_safety_check';
  summary: string;
}

export interface ControlledRegistryWritePlan {
  planId: string;
  operations: ControlledRegistryWriteOperation[];
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  explicitAuthorizationRequired: boolean;
  executionBlocked: boolean;
  summary: string;
}

export interface ControlledRegistryExistingEntryPreview {
  packageIdCandidate: string;
  version: string | null;
  status: 'not_found_in_dry_run' | 'existing_entry_preview_only';
  note: string;
}

export interface ControlledRegistryDiffPreview {
  diffId: string;
  dryRunOnly: boolean;
  added: string[];
  changed: string[];
  removed: string[];
  before: ControlledRegistryExistingEntryPreview;
  after: UserAppTemplatePackageRegistryWriteGateResult['registryEntryPreview'];
  actualMutationBlocked: boolean;
  summary: string;
}

export interface ControlledRegistryRollbackPlan {
  rollbackPlanId: string;
  dryRunOnly: boolean;
  requiredBeforeAnyWrite: boolean;
  restoresExistingEntryPreview: boolean;
  steps: string[];
  actualRollbackBlocked: boolean;
  summary: string;
}

export interface ControlledRegistryWriterDraftWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface ControlledRegistryWriterDraftBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface ControlledRegistryWriterDraftTrace {
  source: ControlledRegistryWriterDraftSource;
  sourceRegistryWriteGateId: string;
  sourceRegistryPreparationId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['previewTrace'];
  gateTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['publishGateTrace'];
  draftTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['registryPreparationTrace']['draftTrace'];
  registryPreparationTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['registryPreparationTrace'];
  registryWriteGateTrace: UserAppTemplatePackageRegistryWriteGateResult['trace'];
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
}

export interface ControlledRegistryWriterDraft {
  writerDraftId: string;
  sourceRegistryWriteGateId: string;
  sourceRegistryPreparationId: string;
  packageIdCandidate: string;
  packageVersionCandidate: string;
  proposedRegistryEntry: UserAppTemplatePackageRegistryWriteGateResult['registryEntryPreview'];
  existingRegistryEntryPreview: ControlledRegistryExistingEntryPreview;
  writePlan: ControlledRegistryWritePlan;
  diffPreview: ControlledRegistryDiffPreview;
  rollbackPlan: ControlledRegistryRollbackPlan;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['previewTrace'];
  gateTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['publishGateTrace'];
  draftTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['registryPreparationTrace']['draftTrace'];
  registryPreparationTrace: UserAppTemplatePackageRegistryWriteGateResult['trace']['registryPreparationTrace'];
  registryWriteGateTrace: UserAppTemplatePackageRegistryWriteGateResult['trace'];
  warnings: ControlledRegistryWriterDraftWarning[];
  blockedReasons: ControlledRegistryWriterDraftBlockedReason[];
  writerDraftStatus: ControlledRegistryWriterDraftStatus;
  writerDraftOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  trace: ControlledRegistryWriterDraftTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface ControlledRegistryWriterDraftSafetyOverrides {
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  proposedRegistryEntry?: UserAppTemplatePackageRegistryWriteGateResult['registryEntryPreview'];
  note?: string;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const createBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): ControlledRegistryWriterDraftBlockedReason => ({ id, message, recommendation });

const writerPayloadText = (
  gate: UserAppTemplatePackageRegistryWriteGateResult,
  proposedRegistryEntry: UserAppTemplatePackageRegistryWriteGateResult['registryEntryPreview'],
  note = '',
): string =>
  JSON.stringify({
    gateId: gate.gateId,
    sourcePreparationId: gate.sourcePreparationId,
    registryEntryPreview: gate.registryEntryPreview,
    proposedRegistryEntry,
    packageIdCandidate: gate.packageIdCandidate,
    packageVersionCandidate: gate.packageVersionCandidate,
    gateSummary: gate.summary,
    gateDecision: gate.decision,
    note,
  });

const existingEntryPreviewForGate = (
  gate: UserAppTemplatePackageRegistryWriteGateResult,
): ControlledRegistryExistingEntryPreview => ({
  packageIdCandidate: gate.packageIdCandidate,
  version: null,
  status: 'not_found_in_dry_run',
  note: 'Dry-run preview only; no registry lookup, write, or mutation occurs in Phase 10K.',
});

const writePlanForGate = ({
  gate,
  dryRunOnly,
  actualWriteBlocked,
}: {
  gate: UserAppTemplatePackageRegistryWriteGateResult;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
}): ControlledRegistryWritePlan => ({
  planId: `controlled-registry-write-plan-${gate.gateId}`,
  dryRunOnly,
  actualWriteBlocked,
  explicitAuthorizationRequired: true,
  executionBlocked: true,
  operations: [
    {
      operationId: `dry-run-upsert-${gate.packageIdCandidate}`,
      operationType: 'upsert_registry_entry_dry_run',
      targetPackageId: gate.packageIdCandidate,
      targetVersion: gate.packageVersionCandidate,
      dryRunOnly,
      actualMutationBlocked: actualWriteBlocked,
      status:
        dryRunOnly && actualWriteBlocked
          ? 'planned_dry_run'
          : 'blocked_by_safety_check',
      summary:
        'Preview the registry entry write shape without persisting, publishing, or replacing any package.',
    },
  ],
  summary:
    'Dry-run write plan only. Future explicit authorization is required before any real writer could be considered.',
});

const diffPreviewForGate = ({
  gate,
  existingRegistryEntryPreview,
  proposedRegistryEntry,
  dryRunOnly,
}: {
  gate: UserAppTemplatePackageRegistryWriteGateResult;
  existingRegistryEntryPreview: ControlledRegistryExistingEntryPreview;
  proposedRegistryEntry: UserAppTemplatePackageRegistryWriteGateResult['registryEntryPreview'];
  dryRunOnly: boolean;
}): ControlledRegistryDiffPreview => ({
  diffId: `controlled-registry-diff-preview-${gate.gateId}`,
  dryRunOnly,
  added: [
    'packageIdCandidate',
    'packageVersionCandidate',
    'title',
    'summary',
    'styleTags',
    'safetyFlags',
  ],
  changed: [],
  removed: [],
  before: existingRegistryEntryPreview,
  after: proposedRegistryEntry,
  actualMutationBlocked: true,
  summary:
    'Diff preview is computed locally for review only; it does not write or update a registry entry.',
});

const rollbackPlanForGate = (
  gate: UserAppTemplatePackageRegistryWriteGateResult,
  dryRunOnly: boolean,
): ControlledRegistryRollbackPlan => ({
  rollbackPlanId: `controlled-registry-rollback-plan-${gate.gateId}`,
  dryRunOnly,
  requiredBeforeAnyWrite: true,
  restoresExistingEntryPreview: true,
  actualRollbackBlocked: true,
  steps: [
    'Capture existing registry entry preview before any future authorized write.',
    'Keep the proposed entry as a reviewed draft until explicit write authorization exists.',
    'If future authorization is rejected, keep the package in dry-run preview only.',
    'If a future writer is ever authorized, require a separate rollback confirmation before execution.',
  ],
  summary:
    'Rollback plan is required for review, but Phase 10K does not execute writes or rollbacks.',
});

export const createControlledUserAppTemplatePackageRegistryWriterDraft = ({
  gate,
  writerDraftId = `controlled-registry-writer-draft-${gate.gateId}`,
  safetyOverrides = {},
}: {
  gate: UserAppTemplatePackageRegistryWriteGateResult;
  writerDraftId?: string;
  safetyOverrides?: ControlledRegistryWriterDraftSafetyOverrides;
}): ControlledRegistryWriterDraft => {
  const sourceReady =
    (gate.status === 'registry_write_gate_ready' ||
      gate.status === 'registry_write_gate_ready_with_warnings') &&
    gate.eligibleForFutureControlledRegistryWriter;
  const dryRunOnly = safetyOverrides.dryRunOnly ?? true;
  const actualWriteBlocked = safetyOverrides.actualWriteBlocked ?? true;
  const publishBlocked = safetyOverrides.publishBlocked ?? true;
  const packageReplacementBlocked = safetyOverrides.packageReplacementBlocked ?? true;
  const proposedRegistryEntry =
    safetyOverrides.proposedRegistryEntry ?? gate.registryEntryPreview;
  const existingRegistryEntryPreview = existingEntryPreviewForGate(gate);
  const writePlan = writePlanForGate({ gate, dryRunOnly, actualWriteBlocked });
  const diffPreview = diffPreviewForGate({
    gate,
    existingRegistryEntryPreview,
    proposedRegistryEntry,
    dryRunOnly,
  });
  const rollbackPlan = rollbackPlanForGate(gate, dryRunOnly);
  const payloadText = writerPayloadText(gate, proposedRegistryEntry, safetyOverrides.note);

  const noRawImageReference =
    gate.trace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    gate.trace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    gate.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    gate.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    gate.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    gate.noActualRegistryWrite &&
    gate.registryWriteBlocked &&
    actualWriteBlocked &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    gate.noUserAppShellPackageReplacement &&
    packageReplacementBlocked &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    gate.notProductionPackage &&
    !registryPreparationProductionMarkerPattern.test(payloadText);

  const blockedReasons = [
    !sourceReady
      ? createBlockedReason(
          'source_registry_write_gate_not_ready',
          'Controlled writer draft requires a ready Phase 10J registry write gate.',
          'Return to the registry write gate and resolve blocked checks before drafting a writer.',
        )
      : null,
    !dryRunOnly
      ? createBlockedReason(
          'dry_run_only_missing',
          'Controlled writer draft must stay dry-run only.',
          'Restore dryRunOnly before any writer draft can continue.',
        )
      : null,
    !actualWriteBlocked
      ? createBlockedReason(
          'actual_write_block_missing',
          'Controlled writer draft must block actual registry writes.',
          'Restore actualWriteBlocked and remove any write execution marker.',
        )
      : null,
    !publishBlocked
      ? createBlockedReason(
          'publish_block_missing',
          'Controlled writer draft must keep publish blocked.',
          'Restore publishBlocked and keep publication out of scope.',
        )
      : null,
    !packageReplacementBlocked
      ? createBlockedReason(
          'package_replacement_block_missing',
          'Controlled writer draft must block current User App Shell package replacement.',
          'Restore packageReplacementBlocked before continuing.',
        )
      : null,
    !noRawImageReference
      ? createBlockedReason(
          'raw_image_reference_detected',
          'Controlled writer draft must not include raw images, object URLs, base64, local paths, or MediaPipe runtime assets.',
          'Remove runtime image references from the proposed registry entry.',
        )
      : null,
    !noPersonalData
      ? createBlockedReason(
          'personal_data_detected',
          'Controlled writer draft must not include personal, contact, health, sensitive identity, or biometric data.',
          'Remove personal or sensitive data before any writer draft.',
        )
      : null,
    !noMedicalClaims
      ? createBlockedReason(
          'medical_claim_detected',
          'Controlled writer draft must not include medical, diagnosis, or treatment claims.',
          'Remove medical claims from the registry entry preview.',
        )
      : null,
    !noProductShadeClaims
      ? createBlockedReason(
          'product_shade_claim_detected',
          'Controlled writer draft must not include product shade or brand-specific claims.',
          'Keep product copy as category placeholders only.',
        )
      : null,
    !noUnsupportedFinalClaims
      ? createBlockedReason(
          'unsupported_final_claim_detected',
          'Controlled writer draft must not include final recognition, final approval, or AI confirmation claims.',
          'Keep wording draft-only and human-review-only.',
        )
      : null,
    !noActualRegistryWrite
      ? createBlockedReason(
          'actual_registry_write_detected',
          'Controlled writer draft must not execute, persist, or mark actual registry writes.',
          'Remove actual registry write markers and keep this as dry-run only.',
        )
      : null,
    !noProductionPackageMarker
      ? createBlockedReason(
          'production_marker_detected',
          'Controlled writer draft must not include production package markers.',
          'Remove production package wording and keep draft-only status.',
        )
      : null,
    !noUserAppShellPackageReplacement
      ? createBlockedReason(
          'user_app_shell_replacement_detected',
          'Controlled writer draft must not replace the current User App Shell package.',
          'Remove shell replacement markers and preserve the current shell package.',
        )
      : null,
  ].filter(
    (reason): reason is ControlledRegistryWriterDraftBlockedReason =>
      Boolean(reason),
  );

  const hasWarnings =
    gate.status === 'registry_write_gate_ready_with_warnings' ||
    gate.warnings.length > 0;
  const warnings: ControlledRegistryWriterDraftWarning[] = hasWarnings
    ? [
        {
          id: 'source_gate_warning',
          message:
            'Source registry write gate has warnings; keep this writer draft in dry-run review.',
          recommendation:
            'Review package metadata, versioning, privacy, and shell-boundary notes before 10L.',
        },
      ]
    : [];
  const writerDraftStatus: ControlledRegistryWriterDraftStatus =
    gate.status === 'registry_write_gate_example_only'
      ? 'writer_draft_example_only'
      : blockedReasons.length > 0
        ? 'writer_draft_blocked'
        : warnings.length > 0
          ? 'writer_draft_ready_with_warnings'
          : 'writer_draft_ready';

  const draft: ControlledRegistryWriterDraft = {
    writerDraftId,
    sourceRegistryWriteGateId: gate.gateId,
    sourceRegistryPreparationId: gate.sourcePreparationId,
    packageIdCandidate: gate.packageIdCandidate,
    packageVersionCandidate: gate.packageVersionCandidate,
    proposedRegistryEntry,
    existingRegistryEntryPreview,
    writePlan,
    diffPreview,
    rollbackPlan,
    dryRunOnly,
    actualWriteBlocked,
    publishBlocked,
    packageReplacementBlocked,
    qaTrace: gate.trace.qaTrace,
    humanReviewTrace: gate.trace.humanReviewTrace,
    candidateTrace: gate.trace.candidateTrace,
    contractTrace: gate.trace.contractTrace,
    previewTrace: gate.trace.previewTrace,
    gateTrace: gate.trace.publishGateTrace,
    draftTrace: gate.trace.registryPreparationTrace.draftTrace,
    registryPreparationTrace: gate.trace.registryPreparationTrace,
    registryWriteGateTrace: gate.trace,
    warnings,
    blockedReasons,
    writerDraftStatus,
    writerDraftOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    trace: {
      source: {
        registryWriteGateStatus: gate.status,
        registryWriteGateDecision: gate.decision,
        sourceReadyForWriterDraft: sourceReady,
      },
      sourceRegistryWriteGateId: gate.gateId,
      sourceRegistryPreparationId: gate.sourcePreparationId,
      qaTrace: gate.trace.qaTrace,
      humanReviewTrace: gate.trace.humanReviewTrace,
      candidateTrace: gate.trace.candidateTrace,
      contractTrace: gate.trace.contractTrace,
      previewTrace: gate.trace.previewTrace,
      gateTrace: gate.trace.publishGateTrace,
      draftTrace: gate.trace.registryPreparationTrace.draftTrace,
      registryPreparationTrace: gate.trace.registryPreparationTrace,
      registryWriteGateTrace: gate.trace,
      noRawImageReference,
      noPersonalData,
      noMedicalClaims,
      noProductShadeClaims,
      noUnsupportedFinalClaims,
      noActualRegistryWrite,
      noUserAppShellPackageReplacement,
      noProductionPackageMarker,
    },
    summary:
      writerDraftStatus === 'writer_draft_ready' ||
      writerDraftStatus === 'writer_draft_ready_with_warnings'
        ? 'Dry-run writer draft ready for a future explicit write authorization gate; no registry write, publish, or shell replacement occurs.'
        : 'Blocked: keep as dry-run only and do not authorize registry write.',
    jsonRoundTripStable: true,
  };
  draft.jsonRoundTripStable = isJsonRoundTripStable(draft);
  return draft;
};
