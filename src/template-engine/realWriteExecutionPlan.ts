import type { RealWriteExecutionAuthorizationResult } from './realWriteExecutionAuthorization';
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

export type RealWriteExecutionPlanStatus =
  | 'execution_plan_ready'
  | 'execution_plan_ready_with_warnings'
  | 'execution_plan_blocked'
  | 'execution_plan_example_only';

export type RealWriteExecutionPlanSeverity = 'info' | 'warning' | 'blocking';

export interface RealWriteExecutionPlanSource {
  executionAuthorizationStatus: RealWriteExecutionAuthorizationResult['status'];
  executionAuthorizationDecision: RealWriteExecutionAuthorizationResult['decision'];
  sourceReadyForExecutionPlan: boolean;
}

export interface RealWriteExecutionStepPlan {
  stepId: string;
  order: number;
  label: string;
  dryRunOnly: boolean;
  actualMutationBlocked: boolean;
  status:
    | 'planned_dry_run_only'
    | 'blocked_until_guarded_simulator'
    | 'blocked_by_safety_check';
  summary: string;
}

export interface RealWriteExecutionPreflightPlan {
  preflightPlanId: string;
  dryRunOnly: boolean;
  requiredBeforeAnyFutureWrite: true;
  checks: Array<{
    id: string;
    label: string;
    required: true;
    status: 'ready' | 'warning' | 'blocked';
    note: string;
  }>;
  summary: string;
}

export interface RealWriteExecutionLockPlan {
  lockPlanId: string;
  dryRunOnly: boolean;
  actualLockAcquisitionBlocked: true;
  locks: Array<{
    id: string;
    label: string;
    required: true;
    status: 'ready' | 'warning' | 'blocked';
    note: string;
  }>;
  summary: string;
}

export interface RealWriteExecutionAuditPlan {
  auditPlanId: string;
  dryRunOnly: boolean;
  actualWriteAuditOnly: true;
  events: Array<{
    id: string;
    label: string;
    required: true;
    sourceTrace: string;
    summary: string;
  }>;
  summary: string;
}

export interface RealWriteExecutionRollbackPlan {
  rollbackPlanId: string;
  dryRunOnly: boolean;
  actualRollbackBlocked: true;
  requiredBeforeAnyFutureWrite: true;
  steps: Array<{
    id: string;
    label: string;
    actualMutationBlocked: true;
    summary: string;
  }>;
  summary: string;
}

export interface RealWriteExecutionFailureHandlingPlan {
  failureHandlingPlanId: string;
  dryRunOnly: boolean;
  actualRecoveryMutationBlocked: true;
  handlers: Array<{
    id: string;
    label: string;
    required: true;
    status: 'ready' | 'warning' | 'blocked';
    summary: string;
  }>;
  summary: string;
}

export interface RealWriteExecutionDryRunVerificationPlan {
  dryRunVerificationPlanId: string;
  dryRunOnly: boolean;
  actualWriteBlocked: true;
  checks: Array<{
    id: string;
    label: string;
    required: true;
    status: 'ready' | 'warning' | 'blocked';
    summary: string;
  }>;
  summary: string;
}

export interface RealWriteExecutionPlanWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface RealWriteExecutionPlanBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface RealWriteExecutionPlanTrace {
  source: RealWriteExecutionPlanSource;
  sourceExecutionAuthorizationId: string;
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: RealWriteExecutionAuthorizationResult['trace']['finalReviewTrace']['previewTrace'];
  gateTrace: RealWriteExecutionAuthorizationResult['trace']['finalReviewTrace']['gateTrace'];
  writerTrace: RealWriteExecutionAuthorizationResult['trace']['finalReviewTrace']['writerTrace'];
  implementationTrace: RealWriteExecutionAuthorizationResult['trace']['implementationDraftTrace'];
  authorizationTrace: RealWriteExecutionAuthorizationResult['trace'];
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
  noProductionWriterCreation: boolean;
}

export interface RealWriteExecutionPlan {
  executionPlanId: string;
  sourceExecutionAuthorizationId: string;
  sourceFinalReviewGateId: string;
  sourceImplementationDraftId: string;
  sourceImplementationGateId: string;
  sourceExecutionDesignId: string;
  sourceWriterDraftId: string;
  executionSequencePlan: RealWriteExecutionStepPlan[];
  preflightPlan: RealWriteExecutionPreflightPlan | null;
  writeLockPlan: RealWriteExecutionLockPlan | null;
  auditPlan: RealWriteExecutionAuditPlan | null;
  rollbackPlan: RealWriteExecutionRollbackPlan | null;
  failureHandlingPlan: RealWriteExecutionFailureHandlingPlan | null;
  dryRunVerificationPlan: RealWriteExecutionDryRunVerificationPlan | null;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  productionWriterBlocked: boolean;
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: RealWriteExecutionPlanTrace['previewTrace'];
  gateTrace: RealWriteExecutionPlanTrace['gateTrace'];
  writerTrace: RealWriteExecutionPlanTrace['writerTrace'];
  implementationTrace: RealWriteExecutionPlanTrace['implementationTrace'];
  authorizationTrace: RealWriteExecutionPlanTrace['authorizationTrace'];
  warnings: RealWriteExecutionPlanWarning[];
  blockedReasons: RealWriteExecutionPlanBlockedReason[];
  executionPlanStatus: RealWriteExecutionPlanStatus;
  executionPlanOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionWriter: true;
  notProductionPackage: true;
  doesNotCreateProductionWriter: true;
  readyForFutureGuardedExecutionSimulator: boolean;
  trace: RealWriteExecutionPlanTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface RealWriteExecutionPlanOverrides {
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  productionWriterBlocked?: boolean;
  omitExecutionSequencePlan?: boolean;
  omitPreflightPlan?: boolean;
  omitWriteLockPlan?: boolean;
  omitAuditPlan?: boolean;
  omitRollbackPlan?: boolean;
  omitFailureHandlingPlan?: boolean;
  omitDryRunVerificationPlan?: boolean;
  executionSequencePlan?: RealWriteExecutionStepPlan[];
  preflightPlan?: RealWriteExecutionPreflightPlan | null;
  writeLockPlan?: RealWriteExecutionLockPlan | null;
  auditPlan?: RealWriteExecutionAuditPlan | null;
  rollbackPlan?: RealWriteExecutionRollbackPlan | null;
  failureHandlingPlan?: RealWriteExecutionFailureHandlingPlan | null;
  dryRunVerificationPlan?: RealWriteExecutionDryRunVerificationPlan | null;
  note?: string;
}

const productionWriterCreationPattern =
  /productionWriterCreated|createProductionWriter|productionWriter\s*:\s*true|已创建 production writer|production_writer_ready/i;

const buildBlockedReason = (
  id: string,
  message: string,
  recommendation: string,
): RealWriteExecutionPlanBlockedReason => ({
  id,
  message,
  recommendation,
});

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const sourceAuthorizationReady = (
  authorization: RealWriteExecutionAuthorizationResult,
): boolean =>
  authorization.status === 'real_write_execution_authorization_ready' ||
  authorization.status === 'real_write_execution_authorization_ready_with_warnings';

const createExecutionSequencePlan = ({
  authorization,
  dryRunOnly,
  actualWriteBlocked,
}: {
  authorization: RealWriteExecutionAuthorizationResult;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
}): RealWriteExecutionStepPlan[] => [
  {
    stepId: `execution-plan-preflight-${authorization.authorizationId}`,
    order: 1,
    label: 'Run real write execution preflight',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status:
      dryRunOnly && actualWriteBlocked
        ? 'planned_dry_run_only'
        : 'blocked_by_safety_check',
    summary:
      'Re-check 10Q authorization, owner scope, safety flags, trace, write lock, audit, rollback, and dry-run verification before any future simulator.',
  },
  {
    stepId: `execution-plan-lock-${authorization.authorizationId}`,
    order: 2,
    label: 'Plan write lock acquisition',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status: 'blocked_until_guarded_simulator',
    summary:
      'Describe lock acquisition order for a future guarded simulator; Phase 10R acquires no real lock.',
  },
  {
    stepId: `execution-plan-simulate-${authorization.sourceImplementationDraftId}`,
    order: 3,
    label: 'Simulate registry write transaction',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status: 'blocked_until_guarded_simulator',
    summary:
      'Plan a dry-run transaction rehearsal only. No registry mutation, publication, shell replacement, or production writer is allowed.',
  },
  {
    stepId: `execution-plan-verify-${authorization.authorizationId}`,
    order: 4,
    label: 'Verify dry-run output and handoff',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status:
      dryRunOnly && actualWriteBlocked
        ? 'planned_dry_run_only'
        : 'blocked_by_safety_check',
    summary:
      'Verify dry-run evidence and hand off only to a future guarded execution simulator.',
  },
];

const createPreflightPlan = (
  authorization: RealWriteExecutionAuthorizationResult,
): RealWriteExecutionPreflightPlan => ({
  preflightPlanId: `real-write-execution-preflight-plan-${authorization.authorizationId}`,
  dryRunOnly: true,
  requiredBeforeAnyFutureWrite: true,
  checks: [
    {
      id: 'execution_authorization_ready',
      label: 'Execution authorization ready',
      required: true,
      status: sourceAuthorizationReady(authorization) ? 'ready' : 'blocked',
      note: '10Q authorization must be ready or ready-with-warnings before 10R can plan anything.',
    },
    {
      id: 'owner_scope_a_preserved',
      label: 'Owner scope A preserved',
      required: true,
      status:
        authorization.ownerAuthorizationScope ===
        'execution_authorization_phase_only'
          ? 'ready'
          : 'blocked',
      note: 'Owner authorization remains Phase-10Q-only and does not authorize actual writes.',
    },
    {
      id: 'future_owner_authorization_required',
      label: 'Future owner authorization required',
      required: true,
      status: authorization.futureActualWriteRequiresSeparateApproval
        ? 'ready'
        : 'blocked',
      note: 'Any actual write after 10R still needs separate explicit owner authorization.',
    },
  ],
  summary:
    'Preflight plan is local and dry-run-only. It checks authorization, owner scope, trace, and safety before a future simulator.',
});

const createWriteLockPlan = (
  authorization: RealWriteExecutionAuthorizationResult,
): RealWriteExecutionLockPlan => ({
  lockPlanId: `real-write-execution-lock-plan-${authorization.authorizationId}`,
  dryRunOnly: true,
  actualLockAcquisitionBlocked: true,
  locks: [
    {
      id: 'authorization_trace_lock',
      label: 'Authorization trace lock',
      required: true,
      status: authorization.trace.ownerAuthorizationText ? 'ready' : 'blocked',
      note: 'A future simulator must lock the 10Q authorization trace before any rehearsal.',
    },
    {
      id: 'implementation_draft_lock',
      label: 'Implementation draft lock',
      required: true,
      status: authorization.sourceImplementationDraftId ? 'ready' : 'blocked',
      note: 'A future simulator must lock the source implementation draft id.',
    },
    {
      id: 'owner_reauthorization_lock',
      label: 'Owner reauthorization lock',
      required: true,
      status: authorization.futureActualWriteRequiresSeparateApproval
        ? 'ready'
        : 'blocked',
      note: 'Actual execution remains blocked until a later owner authorization exists.',
    },
  ],
  summary:
    'Write lock plan describes required locks only; Phase 10R does not acquire locks or mutate state.',
});

const createAuditPlan = (
  authorization: RealWriteExecutionAuthorizationResult,
): RealWriteExecutionAuditPlan => ({
  auditPlanId: `real-write-execution-audit-plan-${authorization.authorizationId}`,
  dryRunOnly: true,
  actualWriteAuditOnly: true,
  events: [
    {
      id: 'execution_authorization_event',
      label: 'Execution authorization event',
      required: true,
      sourceTrace: authorization.authorizationId,
      summary: 'Record 10Q status, owner scope, and boundary flags.',
    },
    {
      id: 'final_review_gate_event',
      label: 'Final review gate event',
      required: true,
      sourceTrace: authorization.sourceFinalReviewGateId,
      summary: 'Record 10P final review gate lineage.',
    },
    {
      id: 'implementation_draft_event',
      label: 'Implementation draft event',
      required: true,
      sourceTrace: authorization.sourceImplementationDraftId,
      summary: 'Record 10O implementation draft lineage and dry-run-only status.',
    },
  ],
  summary:
    'Audit plan records what a future simulator must emit. It does not write registry audit records.',
});

const createRollbackPlan = (
  authorization: RealWriteExecutionAuthorizationResult,
): RealWriteExecutionRollbackPlan => ({
  rollbackPlanId: `real-write-execution-rollback-plan-${authorization.authorizationId}`,
  dryRunOnly: true,
  actualRollbackBlocked: true,
  requiredBeforeAnyFutureWrite: true,
  steps: [
    {
      id: 'capture_existing_preview',
      label: 'Capture existing registry preview',
      actualMutationBlocked: true,
      summary:
        'A future simulator must compare against existing preview state without mutating the registry.',
    },
    {
      id: 'prepare_restore_candidate',
      label: 'Prepare restore candidate',
      actualMutationBlocked: true,
      summary:
        'Prepare a rollback candidate for review only; Phase 10R cannot execute rollback.',
    },
    {
      id: 'block_on_failed_verification',
      label: 'Block on failed verification',
      actualMutationBlocked: true,
      summary:
        'Any failed verification blocks progression and preserves no-write state.',
    },
  ],
  summary:
    'Rollback plan is required before future execution simulation but cannot execute rollback in Phase 10R.',
});

const createFailureHandlingPlan = (
  authorization: RealWriteExecutionAuthorizationResult,
): RealWriteExecutionFailureHandlingPlan => ({
  failureHandlingPlanId: `real-write-execution-failure-plan-${authorization.authorizationId}`,
  dryRunOnly: true,
  actualRecoveryMutationBlocked: true,
  handlers: [
    {
      id: 'preflight_failure',
      label: 'Preflight failure',
      required: true,
      status: 'ready',
      summary:
        'Stop and request execution sequence or authorization revision. Do not continue to simulator.',
    },
    {
      id: 'lock_failure',
      label: 'Write lock failure',
      required: true,
      status: 'ready',
      summary:
        'Stop and request write lock revision. Do not acquire real locks or write registry data.',
    },
    {
      id: 'dry_run_verification_failure',
      label: 'Dry-run verification failure',
      required: true,
      status: 'ready',
      summary:
        'Stop and keep the plan as execution-plan-only until verification is fixed.',
    },
  ],
  summary:
    'Failure handling plan blocks progression on any safety, lock, audit, rollback, or verification failure.',
});

const createDryRunVerificationPlan = (
  authorization: RealWriteExecutionAuthorizationResult,
): RealWriteExecutionDryRunVerificationPlan => ({
  dryRunVerificationPlanId: `real-write-execution-dry-run-verification-${authorization.authorizationId}`,
  dryRunOnly: true,
  actualWriteBlocked: true,
  checks: [
    {
      id: 'no_registry_mutation',
      label: 'No registry mutation',
      required: true,
      status: authorization.actualWriteBlocked ? 'ready' : 'blocked',
      summary: 'Verify actual registry write remains blocked.',
    },
    {
      id: 'no_publish',
      label: 'No publish',
      required: true,
      status: authorization.publishBlocked ? 'ready' : 'blocked',
      summary: 'Verify no publication path is enabled.',
    },
    {
      id: 'no_shell_replacement',
      label: 'No User App Shell replacement',
      required: true,
      status: authorization.packageReplacementBlocked ? 'ready' : 'blocked',
      summary: 'Verify the current User App Shell package remains unchanged.',
    },
    {
      id: 'no_production_writer',
      label: 'No production writer',
      required: true,
      status: authorization.productionWriterBlocked ? 'ready' : 'blocked',
      summary: 'Verify no production writer is created or marked ready.',
    },
  ],
  summary:
    'Dry-run verification plan proves the plan is still non-executing before handoff to a future simulator.',
});

const executionPlanPayloadText = ({
  planParts,
  note = '',
}: {
  planParts: {
    executionSequencePlan: RealWriteExecutionStepPlan[];
    preflightPlan: RealWriteExecutionPreflightPlan | null;
    writeLockPlan: RealWriteExecutionLockPlan | null;
    auditPlan: RealWriteExecutionAuditPlan | null;
    rollbackPlan: RealWriteExecutionRollbackPlan | null;
    failureHandlingPlan: RealWriteExecutionFailureHandlingPlan | null;
    dryRunVerificationPlan: RealWriteExecutionDryRunVerificationPlan | null;
  };
  note?: string;
}): string =>
  JSON.stringify({
    steps: planParts.executionSequencePlan.map((step) => ({
      label: step.label,
      status: step.status,
      summary: step.summary,
    })),
    preflight: planParts.preflightPlan?.summary,
    locks: planParts.writeLockPlan?.locks.map((lock) => ({
      label: lock.label,
      note: lock.note,
    })),
    audit: planParts.auditPlan?.events.map((event) => ({
      label: event.label,
      summary: event.summary,
    })),
    rollback: planParts.rollbackPlan?.steps.map((step) => ({
      label: step.label,
      summary: step.summary,
    })),
    failures: planParts.failureHandlingPlan?.handlers.map((handler) => ({
      label: handler.label,
      summary: handler.summary,
    })),
    verification: planParts.dryRunVerificationPlan?.checks.map((check) => ({
      label: check.label,
      summary: check.summary,
    })),
    operatorNote: note,
  });

export const createRealWriteExecutionPlan = ({
  authorization,
  executionPlanId = `real-write-execution-plan-${authorization.authorizationId}`,
  overrides = {},
}: {
  authorization: RealWriteExecutionAuthorizationResult;
  executionPlanId?: string;
  overrides?: RealWriteExecutionPlanOverrides;
}): RealWriteExecutionPlan => {
  const dryRunOnly = overrides.dryRunOnly ?? authorization.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? authorization.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? authorization.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ?? authorization.packageReplacementBlocked;
  const productionWriterBlocked =
    overrides.productionWriterBlocked ?? authorization.productionWriterBlocked;
  const executionSequencePlan = overrides.omitExecutionSequencePlan
    ? []
    : (overrides.executionSequencePlan ??
      createExecutionSequencePlan({ authorization, dryRunOnly, actualWriteBlocked }));
  const preflightPlan = overrides.omitPreflightPlan
    ? null
    : (overrides.preflightPlan ?? createPreflightPlan(authorization));
  const writeLockPlan = overrides.omitWriteLockPlan
    ? null
    : (overrides.writeLockPlan ?? createWriteLockPlan(authorization));
  const auditPlan = overrides.omitAuditPlan
    ? null
    : (overrides.auditPlan ?? createAuditPlan(authorization));
  const rollbackPlan = overrides.omitRollbackPlan
    ? null
    : (overrides.rollbackPlan ?? createRollbackPlan(authorization));
  const failureHandlingPlan = overrides.omitFailureHandlingPlan
    ? null
    : (overrides.failureHandlingPlan ?? createFailureHandlingPlan(authorization));
  const dryRunVerificationPlan = overrides.omitDryRunVerificationPlan
    ? null
    : (overrides.dryRunVerificationPlan ??
      createDryRunVerificationPlan(authorization));
  const sourceReadyForExecutionPlan = sourceAuthorizationReady(authorization);
  const planParts = {
    executionSequencePlan,
    preflightPlan,
    writeLockPlan,
    auditPlan,
    rollbackPlan,
    failureHandlingPlan,
    dryRunVerificationPlan,
  };
  const payloadText = executionPlanPayloadText({
    planParts,
    note: overrides.note,
  });
  const noRawImageReference =
    authorization.trace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    authorization.trace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    authorization.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    authorization.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    authorization.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    actualWriteBlocked &&
    authorization.noActualRegistryWrite &&
    authorization.trace.noActualRegistryWrite &&
    executionSequencePlan.every((step) => step.actualMutationBlocked) &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    authorization.noUserAppShellPackageReplacement &&
    authorization.trace.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    authorization.notProductionPackage &&
    authorization.trace.noProductionPackageMarker &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const noProductionWriterCreation =
    productionWriterBlocked &&
    authorization.notProductionWriter &&
    authorization.doesNotCreateProductionWriter &&
    authorization.trace.noProductionWriterCreation &&
    !productionWriterCreationPattern.test(payloadText);

  const blockedReasons: RealWriteExecutionPlanBlockedReason[] = [
    !sourceReadyForExecutionPlan &&
      buildBlockedReason(
        'source_execution_authorization_ready',
        'Real write execution plan requires a ready Phase 10Q execution authorization.',
        'Return to Phase 10Q and resolve execution authorization readiness first.',
      ),
    !dryRunOnly &&
      buildBlockedReason(
        'dry_run_only_true',
        'Execution plan must keep dryRunOnly true.',
        'Restore dry-run-only planning before continuing.',
      ),
    !actualWriteBlocked &&
      buildBlockedReason(
        'actual_write_blocked_true',
        'Execution plan must keep actual registry writes blocked.',
        'Remove any actual registry write execution path from Phase 10R.',
      ),
    !publishBlocked &&
      buildBlockedReason(
        'publish_blocked_true',
        'Execution plan must keep publication blocked.',
        'Remove publication from Phase 10R scope.',
      ),
    !packageReplacementBlocked &&
      buildBlockedReason(
        'package_replacement_blocked_true',
        'Execution plan must not replace the current User App Shell package.',
        'Restore packageReplacementBlocked and keep the current shell package unchanged.',
      ),
    !productionWriterBlocked &&
      buildBlockedReason(
        'production_writer_blocked_true',
        'Execution plan must not create a production writer.',
        'Restore productionWriterBlocked and defer writer creation to a separately authorized future phase.',
      ),
    executionSequencePlan.length === 0 &&
      buildBlockedReason(
        'execution_sequence_plan_present',
        'Execution sequence plan is required.',
        'Add dry-run-only execution sequence steps before handoff.',
      ),
    !preflightPlan &&
      buildBlockedReason(
        'preflight_plan_present',
        'Preflight plan is required.',
        'Add authorization, trace, safety, lock, audit, and rollback preflight checks.',
      ),
    !writeLockPlan &&
      buildBlockedReason(
        'write_lock_plan_present',
        'Write lock plan is required.',
        'Add dry-run write lock requirements before future simulator handoff.',
      ),
    !auditPlan &&
      buildBlockedReason(
        'audit_plan_present',
        'Audit plan is required.',
        'Add audit events that a future simulator must emit.',
      ),
    !rollbackPlan &&
      buildBlockedReason(
        'rollback_plan_present',
        'Rollback plan is required.',
        'Add rollback planning before any future simulator handoff.',
      ),
    !failureHandlingPlan &&
      buildBlockedReason(
        'failure_handling_plan_present',
        'Failure handling plan is required.',
        'Add stop conditions and failure handling before handoff.',
      ),
    !dryRunVerificationPlan &&
      buildBlockedReason(
        'dry_run_verification_plan_present',
        'Dry-run verification plan is required.',
        'Add dry-run verification checks before handoff.',
      ),
    !noRawImageReference &&
      buildBlockedReason(
        'no_raw_image_reference',
        'Execution plan must not include raw image references.',
        'Remove object URLs, local paths, base64, and MediaPipe runtime asset references.',
      ),
    !noPersonalData &&
      buildBlockedReason(
        'no_personal_data',
        'Execution plan must not include personal or sensitive data.',
        'Remove real names, contact data, health data, biometrics, and camera data.',
      ),
    !noMedicalClaims &&
      buildBlockedReason(
        'no_medical_claims',
        'Execution plan must not include medical claims.',
        'Remove treatment, diagnosis, or medical-effect wording.',
      ),
    !noProductShadeClaims &&
      buildBlockedReason(
        'no_product_shade_claims',
        'Execution plan must not include product shade claims.',
        'Keep product copy generic and placeholder-only.',
      ),
    !noUnsupportedFinalClaims &&
      buildBlockedReason(
        'no_unsupported_final_claims',
        'Execution plan must not include unsupported final claims.',
        'Remove final recognition, final approval, or AI confirmation wording.',
      ),
    !noActualRegistryWrite &&
      buildBlockedReason(
        'no_actual_registry_write',
        'Execution plan must not execute or mark actual registry writes.',
        'Remove actual registry write markers and keep 10R plan-only.',
      ),
    !noUserAppShellPackageReplacement &&
      buildBlockedReason(
        'no_user_app_shell_package_replacement',
        'Execution plan must not replace the current User App Shell package.',
        'Remove User App Shell replacement markers.',
      ),
    !noProductionPackageMarker &&
      buildBlockedReason(
        'no_production_package_marker',
        'Execution plan must not contain production package markers.',
        'Remove production package or production readiness markers.',
      ),
    !noProductionWriterCreation &&
      buildBlockedReason(
        'no_production_writer_creation',
        'Execution plan must not create or mark a production writer.',
        'Remove production writer creation markers.',
      ),
  ].filter(
    (reason): reason is RealWriteExecutionPlanBlockedReason => Boolean(reason),
  );

  const warnings: RealWriteExecutionPlanWarning[] =
    authorization.status === 'real_write_execution_authorization_ready_with_warnings'
      ? [
          {
            id: 'source_execution_authorization_warning',
            message:
              'Source execution authorization is ready with warnings, so this plan should remain under extra review.',
            recommendation:
              'Keep as execution plan only until warning context is reviewed before any future simulator.',
          },
        ]
      : [];
  const executionPlanStatus: RealWriteExecutionPlanStatus =
    authorization.status === 'real_write_execution_authorization_example_only'
      ? 'execution_plan_example_only'
      : blockedReasons.length > 0
        ? 'execution_plan_blocked'
        : warnings.length > 0
          ? 'execution_plan_ready_with_warnings'
          : 'execution_plan_ready';
  const trace: RealWriteExecutionPlanTrace = {
    source: {
      executionAuthorizationStatus: authorization.status,
      executionAuthorizationDecision: authorization.decision,
      sourceReadyForExecutionPlan,
    },
    sourceExecutionAuthorizationId: authorization.authorizationId,
    sourceFinalReviewGateId: authorization.sourceFinalReviewGateId,
    sourceImplementationDraftId: authorization.sourceImplementationDraftId,
    sourceImplementationGateId: authorization.sourceImplementationGateId,
    sourceExecutionDesignId: authorization.sourceExecutionDesignId,
    sourceWriterDraftId: authorization.sourceWriterDraftId,
    qaTrace: authorization.trace.finalReviewTrace.qaTrace,
    humanReviewTrace: authorization.trace.finalReviewTrace.humanReviewTrace,
    candidateTrace: authorization.trace.finalReviewTrace.candidateTrace,
    contractTrace: authorization.trace.finalReviewTrace.contractTrace,
    previewTrace: authorization.trace.finalReviewTrace.previewTrace,
    gateTrace: authorization.trace.finalReviewTrace.gateTrace,
    writerTrace: authorization.trace.finalReviewTrace.writerTrace,
    implementationTrace: authorization.trace.implementationDraftTrace,
    authorizationTrace: authorization.trace,
    noRawImageReference,
    noPersonalData,
    noMedicalClaims,
    noProductShadeClaims,
    noUnsupportedFinalClaims,
    noActualRegistryWrite,
    noUserAppShellPackageReplacement,
    noProductionPackageMarker,
    noProductionWriterCreation,
  };
  const plan: RealWriteExecutionPlan = {
    executionPlanId,
    sourceExecutionAuthorizationId: authorization.authorizationId,
    sourceFinalReviewGateId: authorization.sourceFinalReviewGateId,
    sourceImplementationDraftId: authorization.sourceImplementationDraftId,
    sourceImplementationGateId: authorization.sourceImplementationGateId,
    sourceExecutionDesignId: authorization.sourceExecutionDesignId,
    sourceWriterDraftId: authorization.sourceWriterDraftId,
    executionSequencePlan,
    preflightPlan,
    writeLockPlan,
    auditPlan,
    rollbackPlan,
    failureHandlingPlan,
    dryRunVerificationPlan,
    dryRunOnly,
    actualWriteBlocked,
    publishBlocked,
    packageReplacementBlocked,
    productionWriterBlocked,
    qaTrace: trace.qaTrace,
    humanReviewTrace: trace.humanReviewTrace,
    candidateTrace: trace.candidateTrace,
    contractTrace: trace.contractTrace,
    previewTrace: trace.previewTrace,
    gateTrace: trace.gateTrace,
    writerTrace: trace.writerTrace,
    implementationTrace: trace.implementationTrace,
    authorizationTrace: trace.authorizationTrace,
    warnings,
    blockedReasons,
    executionPlanStatus,
    executionPlanOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionWriter: true,
    notProductionPackage: true,
    doesNotCreateProductionWriter: true,
    readyForFutureGuardedExecutionSimulator:
      executionPlanStatus === 'execution_plan_ready',
    trace,
    summary:
      'Phase 10R execution plan is local, dry-run-only, and eligible only for a future guarded execution simulator. It does not write registry data, publish, replace the current User App Shell package, or create a production writer.',
    jsonRoundTripStable: true,
  };
  plan.jsonRoundTripStable = isJsonRoundTripStable(plan);
  return plan;
};
