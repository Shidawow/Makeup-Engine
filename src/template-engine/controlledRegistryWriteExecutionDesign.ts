import type {
  ExplicitRegistryWriteAuthorizationGateResult,
} from './explicitRegistryWriteAuthorizationGate';
import type { ExplicitRegistryWriteAuthorizationHandoff } from './explicitRegistryWriteAuthorizationHandoff';
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

export type ControlledRegistryWriteExecutionDesignStatus =
  | 'execution_design_ready'
  | 'execution_design_ready_with_warnings'
  | 'execution_design_blocked'
  | 'execution_design_example_only';

export type ControlledRegistryWriteExecutionMode =
  | 'dry_run_design'
  | 'actual_write_execution';

export type ControlledRegistryWriteExecutionPreflightId =
  | 'authorization_gate_ready'
  | 'execution_mode_design_only'
  | 'dry_run_only_true'
  | 'actual_write_blocked_true'
  | 'publish_blocked_true'
  | 'package_replacement_blocked_true'
  | 'audit_plan_present'
  | 'rollback_design_present'
  | 'write_lock_requirements_present'
  | 'owner_authorization_trace_present'
  | 'trace_preserved'
  | 'no_raw_image_reference'
  | 'no_personal_data'
  | 'no_medical_claims'
  | 'no_product_shade_claims'
  | 'no_unsupported_final_claims'
  | 'no_actual_registry_write'
  | 'no_user_app_shell_package_replacement'
  | 'no_production_package_marker'
  | 'json_round_trip_safe';

export interface ControlledRegistryWriteExecutionSource {
  authorizationGateStatus: ExplicitRegistryWriteAuthorizationGateResult['status'];
  authorizationGateDecision: ExplicitRegistryWriteAuthorizationGateResult['decision'];
  sourceReadyForExecutionDesign: boolean;
}

export interface ControlledRegistryWriteExecutionPreflight {
  id: ControlledRegistryWriteExecutionPreflightId;
  label: string;
  passed: boolean;
  severity: 'info' | 'warning' | 'blocking';
  message: string;
}

export interface ControlledRegistryWriteExecutionStep {
  stepId: string;
  order: number;
  label: string;
  dryRunOnly: boolean;
  actualMutationBlocked: boolean;
  status:
    | 'planned_design_only'
    | 'blocked_until_real_write_gate'
    | 'blocked_by_safety_check';
  summary: string;
}

export interface ControlledRegistryWriteAuditPlanItem {
  id: string;
  label: string;
  required: boolean;
  sourceTrace: string;
  summary: string;
}

export interface ControlledRegistryWriteExecutionAuditPlan {
  auditPlanId: string;
  dryRunOnly: boolean;
  items: ControlledRegistryWriteAuditPlanItem[];
  retainedTraceIds: string[];
  actualWriteAuditOnly: true;
  summary: string;
}

export interface ControlledRegistryWriteRollbackExecutionDesign {
  rollbackDesignId: string;
  dryRunOnly: boolean;
  requiredBeforeAnyFutureWrite: boolean;
  restoresExistingEntryPreview: boolean;
  actualRollbackBlocked: boolean;
  steps: string[];
  summary: string;
}

export interface ControlledRegistryWriteLockRequirement {
  id: string;
  label: string;
  required: boolean;
  status: 'ready' | 'warning' | 'blocked';
  note: string;
}

export interface ControlledRegistryWriteExecutionDesignWarning {
  id: string;
  message: string;
  recommendation: string;
}

export interface ControlledRegistryWriteExecutionDesignBlockedReason {
  id: string;
  message: string;
  recommendation: string;
}

export interface ControlledRegistryWriteExecutionDesignTrace {
  source: ControlledRegistryWriteExecutionSource;
  sourceAuthorizationGateId: string;
  sourceWriterDraftId: string;
  sourceRegistryWriteGateId: string;
  sourceRegistryPreparationId: string;
  checklistId: string;
  ownerAuthorizationTrace: {
    ownerAuthorizationRequired: boolean;
    futureOwnerApprovalRequired: boolean;
    futureRealWriteRequiresSeparateAuthorization: boolean;
  };
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: ExplicitRegistryWriteAuthorizationGateResult['trace']['previewTrace'];
  gateTrace: ExplicitRegistryWriteAuthorizationGateResult['trace']['gateTrace'];
  writerTrace: ExplicitRegistryWriteAuthorizationGateResult['trace']['writerDraftTrace'];
  authorizationTrace: ExplicitRegistryWriteAuthorizationGateResult['trace'];
  noRawImageReference: boolean;
  noPersonalData: boolean;
  noMedicalClaims: boolean;
  noProductShadeClaims: boolean;
  noUnsupportedFinalClaims: boolean;
  noActualRegistryWrite: boolean;
  noUserAppShellPackageReplacement: boolean;
  noProductionPackageMarker: boolean;
}

export interface ControlledRegistryWriteExecutionDesign {
  executionDesignId: string;
  sourceAuthorizationGateId: string;
  sourceWriterDraftId: string;
  sourceRegistryWriteGateId: string;
  executionMode: ControlledRegistryWriteExecutionMode;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
  publishBlocked: boolean;
  packageReplacementBlocked: boolean;
  preflightChecks: ControlledRegistryWriteExecutionPreflight[];
  plannedExecutionSteps: ControlledRegistryWriteExecutionStep[];
  auditPlan: ControlledRegistryWriteExecutionAuditPlan | null;
  rollbackExecutionDesign: ControlledRegistryWriteRollbackExecutionDesign | null;
  writeLockRequirements: ControlledRegistryWriteLockRequirement[];
  ownerAuthorizationTrace: ControlledRegistryWriteExecutionDesignTrace['ownerAuthorizationTrace'];
  qaTrace: string;
  humanReviewTrace: string;
  candidateTrace: string;
  contractTrace: string;
  previewTrace: ExplicitRegistryWriteAuthorizationGateResult['trace']['previewTrace'];
  gateTrace: ExplicitRegistryWriteAuthorizationGateResult['trace']['gateTrace'];
  writerTrace: ExplicitRegistryWriteAuthorizationGateResult['trace']['writerDraftTrace'];
  authorizationTrace: ExplicitRegistryWriteAuthorizationGateResult['trace'];
  warnings: ControlledRegistryWriteExecutionDesignWarning[];
  blockedReasons: ControlledRegistryWriteExecutionDesignBlockedReason[];
  executionDesignStatus: ControlledRegistryWriteExecutionDesignStatus;
  executionDesignOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  readyForFutureRealWriteImplementationGate: boolean;
  trace: ControlledRegistryWriteExecutionDesignTrace;
  summary: string;
  jsonRoundTripStable: boolean;
}

export interface ControlledRegistryWriteExecutionDesignOverrides {
  executionMode?: ControlledRegistryWriteExecutionMode;
  dryRunOnly?: boolean;
  actualWriteBlocked?: boolean;
  publishBlocked?: boolean;
  packageReplacementBlocked?: boolean;
  omitAuditPlan?: boolean;
  omitRollbackExecutionDesign?: boolean;
  writeLockRequirements?: ControlledRegistryWriteLockRequirement[];
  plannedExecutionSteps?: ControlledRegistryWriteExecutionStep[];
  note?: string;
}

const createPreflight = (
  id: ControlledRegistryWriteExecutionPreflightId,
  label: string,
  passed: boolean,
  severity: ControlledRegistryWriteExecutionPreflight['severity'],
  message: string,
): ControlledRegistryWriteExecutionPreflight => ({
  id,
  label,
  passed,
  severity,
  message,
});

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const auditPlanForGate = (
  gate: ExplicitRegistryWriteAuthorizationGateResult,
  dryRunOnly: boolean,
): ControlledRegistryWriteExecutionAuditPlan => ({
  auditPlanId: `controlled-registry-write-execution-audit-${gate.gateId}`,
  dryRunOnly,
  items: [
    {
      id: 'source_authorization_gate',
      label: 'Source authorization gate',
      required: true,
      sourceTrace: gate.gateId,
      summary: 'Record the 10L gate status and decision before any future implementation gate.',
    },
    {
      id: 'writer_draft_trace',
      label: 'Writer draft trace',
      required: true,
      sourceTrace: gate.sourceWriterDraftId,
      summary: 'Retain writer draft lineage, diff preview, and rollback references.',
    },
    {
      id: 'owner_authorization_trace',
      label: 'Future owner authorization trace',
      required: true,
      sourceTrace: gate.checklistId,
      summary: 'Record that a future real write still needs separate owner authorization.',
    },
  ],
  retainedTraceIds: [
    gate.gateId,
    gate.sourceWriterDraftId,
    gate.sourceRegistryWriteGateId,
    gate.sourceRegistryPreparationId,
    gate.checklistId,
  ],
  actualWriteAuditOnly: true,
  summary:
    'Audit plan is design-only. It records what must be logged if a later real write implementation gate is approved.',
});

const rollbackDesignForGate = (
  gate: ExplicitRegistryWriteAuthorizationGateResult,
  dryRunOnly: boolean,
): ControlledRegistryWriteRollbackExecutionDesign => ({
  rollbackDesignId: `controlled-registry-write-rollback-execution-design-${gate.gateId}`,
  dryRunOnly,
  requiredBeforeAnyFutureWrite: true,
  restoresExistingEntryPreview: true,
  actualRollbackBlocked: true,
  steps: [
    'Capture the existing registry entry preview before any future authorized implementation.',
    'Keep the proposed entry as a reviewed design input until a separate implementation gate approves execution.',
    'Require owner acknowledgement of rollback scope before any future real write implementation.',
    'If a future implementation gate fails, retain this as design-only and do not mutate registry state.',
  ],
  summary:
    'Rollback execution design is required before any future implementation gate, but Phase 10M executes no write and no rollback.',
});

const writeLockRequirementsForGate = (
  gate: ExplicitRegistryWriteAuthorizationGateResult,
): ControlledRegistryWriteLockRequirement[] => [
  {
    id: 'single_package_write_lock',
    label: 'Single package write lock',
    required: true,
    status: 'ready',
    note: `Future implementation must lock package ${gate.packageIdCandidate} before any real write is considered.`,
  },
  {
    id: 'version_lock',
    label: 'Version candidate lock',
    required: true,
    status: 'ready',
    note: `Future implementation must lock version ${gate.packageVersionCandidate} and revalidate the diff.`,
  },
  {
    id: 'owner_authorization_lock',
    label: 'Owner authorization lock',
    required: true,
    status: 'ready',
    note: 'Future real execution remains blocked until the owner grants separate implementation approval.',
  },
];

const plannedStepsForGate = ({
  gate,
  dryRunOnly,
  actualWriteBlocked,
}: {
  gate: ExplicitRegistryWriteAuthorizationGateResult;
  dryRunOnly: boolean;
  actualWriteBlocked: boolean;
}): ControlledRegistryWriteExecutionStep[] => [
  {
    stepId: `preflight-${gate.gateId}`,
    order: 1,
    label: 'Run execution preflight',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status:
      dryRunOnly && actualWriteBlocked
        ? 'planned_design_only'
        : 'blocked_by_safety_check',
    summary:
      'Re-check authorization gate, trace, safety flags, write lock requirements, audit plan, and rollback design.',
  },
  {
    stepId: `simulate-write-${gate.packageIdCandidate}`,
    order: 2,
    label: 'Simulate registry entry write shape',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status: 'blocked_until_real_write_gate',
    summary:
      'Describe the future registry write shape without persisting, publishing, or replacing any package.',
  },
  {
    stepId: `record-audit-${gate.gateId}`,
    order: 3,
    label: 'Prepare audit record design',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status: 'planned_design_only',
    summary:
      'Define the audit record that a later implementation gate would require before any controlled write.',
  },
  {
    stepId: `rollback-design-${gate.gateId}`,
    order: 4,
    label: 'Prepare rollback execution design',
    dryRunOnly,
    actualMutationBlocked: actualWriteBlocked,
    status: 'planned_design_only',
    summary:
      'Define rollback requirements for a future implementation gate; no rollback is executed in this phase.',
  },
];

const executionPayloadText = ({
  gate,
  plannedExecutionSteps,
  auditPlan,
  rollbackExecutionDesign,
  writeLockRequirements,
  note = '',
}: {
  gate: ExplicitRegistryWriteAuthorizationGateResult;
  plannedExecutionSteps: ControlledRegistryWriteExecutionStep[];
  auditPlan: ControlledRegistryWriteExecutionAuditPlan | null;
  rollbackExecutionDesign: ControlledRegistryWriteRollbackExecutionDesign | null;
  writeLockRequirements: ControlledRegistryWriteLockRequirement[];
  note?: string;
}): string =>
  JSON.stringify({
    gateId: gate.gateId,
    gateStatus: gate.status,
    gateDecision: gate.decision,
    packageIdCandidate: gate.packageIdCandidate,
    packageVersionCandidate: gate.packageVersionCandidate,
    plannedExecutionSteps: plannedExecutionSteps.map((step) => ({
      label: step.label,
      status: step.status,
      summary: step.summary,
    })),
    auditItems: auditPlan?.items.map((item) => ({
      label: item.label,
      summary: item.summary,
    })),
    rollbackSteps: rollbackExecutionDesign?.steps,
    writeLockRequirements: writeLockRequirements.map((requirement) => ({
      label: requirement.label,
      note: requirement.note,
    })),
    note,
  });

export const createControlledRegistryWriteExecutionDesign = ({
  authorizationGate,
  authorizationHandoff,
  executionDesignId = `controlled-registry-write-execution-design-${authorizationGate.gateId}`,
  overrides = {},
}: {
  authorizationGate: ExplicitRegistryWriteAuthorizationGateResult;
  authorizationHandoff?: ExplicitRegistryWriteAuthorizationHandoff;
  executionDesignId?: string;
  overrides?: ControlledRegistryWriteExecutionDesignOverrides;
}): ControlledRegistryWriteExecutionDesign => {
  const sourceReady =
    authorizationGate.status === 'explicit_authorization_gate_ready' ||
    authorizationGate.status === 'explicit_authorization_gate_ready_with_warnings';
  const executionMode = overrides.executionMode ?? 'dry_run_design';
  const dryRunOnly = overrides.dryRunOnly ?? authorizationGate.dryRunOnly;
  const actualWriteBlocked =
    overrides.actualWriteBlocked ?? authorizationGate.actualWriteBlocked;
  const publishBlocked = overrides.publishBlocked ?? authorizationGate.publishBlocked;
  const packageReplacementBlocked =
    overrides.packageReplacementBlocked ??
    authorizationGate.packageReplacementBlocked;
  const plannedExecutionSteps =
    overrides.plannedExecutionSteps ??
    plannedStepsForGate({ gate: authorizationGate, dryRunOnly, actualWriteBlocked });
  const auditPlan = overrides.omitAuditPlan
    ? null
    : auditPlanForGate(authorizationGate, dryRunOnly);
  const rollbackExecutionDesign = overrides.omitRollbackExecutionDesign
    ? null
    : rollbackDesignForGate(authorizationGate, dryRunOnly);
  const writeLockRequirements =
    overrides.writeLockRequirements ?? writeLockRequirementsForGate(authorizationGate);
  const ownerAuthorizationTrace = {
    ownerAuthorizationRequired: authorizationGate.ownerAuthorizationRequired,
    futureOwnerApprovalRequired: authorizationGate.futureOwnerApprovalRequired,
    futureRealWriteRequiresSeparateAuthorization:
      authorizationHandoff?.futureOwnerApprovalRequired ??
      authorizationGate.futureOwnerApprovalRequired,
  };
  const payloadText = executionPayloadText({
    gate: authorizationGate,
    plannedExecutionSteps,
    auditPlan,
    rollbackExecutionDesign,
    writeLockRequirements,
    note: overrides.note,
  });
  const tracePreserved =
    authorizationGate.trace.qaTrace.trim().length > 0 &&
    authorizationGate.trace.humanReviewTrace.trim().length > 0 &&
    authorizationGate.trace.candidateTrace.trim().length > 0 &&
    authorizationGate.trace.contractTrace.trim().length > 0 &&
    Boolean(authorizationGate.trace.previewTrace) &&
    Boolean(authorizationGate.trace.gateTrace) &&
    Boolean(authorizationGate.trace.writerDraftTrace) &&
    Boolean(authorizationGate.trace);
  const noRawImageReference =
    authorizationGate.trace.noRawImageReference &&
    !registryPreparationRawImageReferencePattern.test(payloadText);
  const noPersonalData =
    authorizationGate.trace.noPersonalData &&
    !registryPreparationPersonalDataPattern.test(payloadText);
  const noMedicalClaims =
    authorizationGate.trace.noMedicalClaims &&
    !registryPreparationMedicalClaimPattern.test(payloadText);
  const noProductShadeClaims =
    authorizationGate.trace.noProductShadeClaims &&
    !registryPreparationShadeClaimPattern.test(payloadText);
  const noUnsupportedFinalClaims =
    authorizationGate.trace.noUnsupportedFinalClaims &&
    !registryPreparationFinalClaimPattern.test(payloadText);
  const noActualRegistryWrite =
    actualWriteBlocked &&
    authorizationGate.noActualRegistryWrite &&
    !registryPreparationActualRegistryWritePattern.test(payloadText);
  const noUserAppShellPackageReplacement =
    packageReplacementBlocked &&
    authorizationGate.noUserAppShellPackageReplacement &&
    !registryPreparationShellReplacementPattern.test(payloadText);
  const noProductionPackageMarker =
    authorizationGate.notProductionPackage &&
    !registryPreparationProductionMarkerPattern.test(payloadText);
  const jsonRoundTripStable =
    authorizationGate.jsonRoundTripStable &&
    (!authorizationHandoff || authorizationHandoff.jsonRoundTripStable);

  const preflightChecks: ControlledRegistryWriteExecutionPreflight[] = [
    createPreflight(
      'authorization_gate_ready',
      'Authorization gate ready',
      sourceReady && authorizationGate.eligibleForFutureControlledWriteExecutionDesign,
      'blocking',
      'Execution design requires a ready Phase 10L explicit authorization gate.',
    ),
    createPreflight(
      'execution_mode_design_only',
      'Execution mode is design-only',
      executionMode === 'dry_run_design',
      'blocking',
      'Execution mode must remain design-only / dry-run.',
    ),
    createPreflight(
      'dry_run_only_true',
      'Dry-run only remains true',
      dryRunOnly && plannedExecutionSteps.every((step) => step.dryRunOnly),
      'blocking',
      'Execution design must keep dryRunOnly true.',
    ),
    createPreflight(
      'actual_write_blocked_true',
      'Actual write remains blocked',
      actualWriteBlocked &&
        plannedExecutionSteps.every((step) => step.actualMutationBlocked),
      'blocking',
      'Execution design must keep actual registry writes blocked.',
    ),
    createPreflight(
      'publish_blocked_true',
      'Publish remains blocked',
      publishBlocked && authorizationGate.notPublished,
      'blocking',
      'Execution design must keep publication blocked.',
    ),
    createPreflight(
      'package_replacement_blocked_true',
      'Package replacement remains blocked',
      packageReplacementBlocked &&
        authorizationGate.noUserAppShellPackageReplacement,
      'blocking',
      'Execution design must not replace the current User App Shell package.',
    ),
    createPreflight(
      'audit_plan_present',
      'Audit plan present',
      Boolean(auditPlan && auditPlan.items.length > 0 && auditPlan.dryRunOnly),
      'blocking',
      'Execution design requires an audit plan.',
    ),
    createPreflight(
      'rollback_design_present',
      'Rollback design present',
      Boolean(
        rollbackExecutionDesign &&
          rollbackExecutionDesign.steps.length > 0 &&
          rollbackExecutionDesign.requiredBeforeAnyFutureWrite &&
          rollbackExecutionDesign.actualRollbackBlocked,
      ),
      'blocking',
      'Execution design requires rollback execution design.',
    ),
    createPreflight(
      'write_lock_requirements_present',
      'Write lock requirements present',
      writeLockRequirements.length > 0 &&
        writeLockRequirements.every(
          (requirement) => requirement.required && requirement.status !== 'blocked',
        ),
      'blocking',
      'Execution design requires write lock requirements.',
    ),
    createPreflight(
      'owner_authorization_trace_present',
      'Owner authorization trace present',
      ownerAuthorizationTrace.ownerAuthorizationRequired &&
        ownerAuthorizationTrace.futureOwnerApprovalRequired &&
        ownerAuthorizationTrace.futureRealWriteRequiresSeparateAuthorization,
      'blocking',
      'Execution design requires owner authorization trace and separate future approval.',
    ),
    createPreflight(
      'trace_preserved',
      'Trace preserved',
      tracePreserved,
      'blocking',
      'Execution design requires QA, human review, candidate, contract, preview, gate, writer, and authorization trace.',
    ),
    createPreflight(
      'no_raw_image_reference',
      'No raw image reference',
      noRawImageReference,
      'blocking',
      'Execution design must not include raw images, object URLs, base64, local paths, or runtime asset names.',
    ),
    createPreflight(
      'no_personal_data',
      'No personal data',
      noPersonalData,
      'blocking',
      'Execution design must not include personal, contact, health, sensitive identity, or biometric data.',
    ),
    createPreflight(
      'no_medical_claims',
      'No medical claims',
      noMedicalClaims,
      'blocking',
      'Execution design must not include medical, diagnosis, or treatment claims.',
    ),
    createPreflight(
      'no_product_shade_claims',
      'No product shade claims',
      noProductShadeClaims,
      'blocking',
      'Execution design must not include product shade or brand-specific claims.',
    ),
    createPreflight(
      'no_unsupported_final_claims',
      'No unsupported final claims',
      noUnsupportedFinalClaims,
      'blocking',
      'Execution design must not include final recognition, final approval, or AI confirmation claims.',
    ),
    createPreflight(
      'no_actual_registry_write',
      'No actual registry write',
      noActualRegistryWrite,
      'blocking',
      'Execution design must not execute, persist, or mark actual registry writes.',
    ),
    createPreflight(
      'no_user_app_shell_package_replacement',
      'No User App Shell package replacement',
      noUserAppShellPackageReplacement,
      'blocking',
      'Execution design must not replace the current User App Shell package.',
    ),
    createPreflight(
      'no_production_package_marker',
      'No production package marker',
      noProductionPackageMarker,
      'blocking',
      'Execution design must not carry production package markers.',
    ),
    createPreflight(
      'json_round_trip_safe',
      'JSON round-trip safe',
      jsonRoundTripStable,
      'blocking',
      'Execution design requires JSON round-trip stability.',
    ),
  ];

  const recommendationsByCheck: Record<
    ControlledRegistryWriteExecutionPreflightId,
    string
  > = {
    authorization_gate_ready:
      'Return to Phase 10L and resolve the authorization gate before execution design.',
    execution_mode_design_only:
      'Restore executionMode to dry_run_design before continuing.',
    dry_run_only_true:
      'Restore dryRunOnly and remove execution markers.',
    actual_write_blocked_true:
      'Restore actualWriteBlocked and remove write execution markers.',
    publish_blocked_true:
      'Restore publishBlocked and keep publication out of scope.',
    package_replacement_blocked_true:
      'Restore packageReplacementBlocked and preserve the current User App Shell package.',
    audit_plan_present:
      'Add an audit plan before any future implementation gate can be considered.',
    rollback_design_present:
      'Add rollback execution design before any future implementation gate.',
    write_lock_requirements_present:
      'Add write lock requirements for package, version, and owner authorization.',
    owner_authorization_trace_present:
      'Restore owner authorization trace and separate future approval requirements.',
    trace_preserved:
      'Restore all QA, review, package, gate, writer, and authorization trace.',
    no_raw_image_reference:
      'Remove raw images, object URLs, base64, local paths, and runtime assets.',
    no_personal_data:
      'Remove personal, contact, health, sensitive identity, and biometric data.',
    no_medical_claims: 'Remove medical, diagnosis, or treatment claims.',
    no_product_shade_claims:
      'Keep product copy as category placeholders without shade claims.',
    no_unsupported_final_claims:
      'Keep copy draft-only and human-review-only.',
    no_actual_registry_write:
      'Remove actual registry write markers and keep Phase 10M design-only.',
    no_user_app_shell_package_replacement:
      'Remove shell replacement markers and preserve the current User App Shell package.',
    no_production_package_marker:
      'Remove production markers and keep this design non-production.',
    json_round_trip_safe: 'Remove non-serializable values before handoff.',
  };
  const failedPreflight = preflightChecks.filter(
    (check) => !check.passed && check.severity === 'blocking',
  );
  const blockedReasons: ControlledRegistryWriteExecutionDesignBlockedReason[] =
    failedPreflight.map((check) => ({
      id: `${check.id}_blocking`,
      message: check.message,
      recommendation: recommendationsByCheck[check.id],
    }));
  const hasWarnings =
    authorizationGate.status === 'explicit_authorization_gate_ready_with_warnings' ||
    authorizationGate.warnings.length > 0 ||
    authorizationHandoff?.status === 'explicit_authorization_handoff_ready_with_warnings';
  const executionDesignStatus: ControlledRegistryWriteExecutionDesignStatus =
    authorizationGate.status === 'explicit_authorization_gate_example_only'
      ? 'execution_design_example_only'
      : blockedReasons.length > 0
        ? 'execution_design_blocked'
        : hasWarnings
          ? 'execution_design_ready_with_warnings'
          : 'execution_design_ready';
  const warnings: ControlledRegistryWriteExecutionDesignWarning[] = hasWarnings
    ? [
        {
          id: 'source_authorization_warning',
          message:
            'Source authorization gate has warnings; keep this as execution design only.',
          recommendation:
            'Review warning trace before any future real write implementation gate.',
        },
      ]
    : [];
  const readyForFutureRealWriteImplementationGate =
    executionDesignStatus === 'execution_design_ready' ||
    executionDesignStatus === 'execution_design_ready_with_warnings';

  const design: ControlledRegistryWriteExecutionDesign = {
    executionDesignId,
    sourceAuthorizationGateId: authorizationGate.gateId,
    sourceWriterDraftId: authorizationGate.sourceWriterDraftId,
    sourceRegistryWriteGateId: authorizationGate.sourceRegistryWriteGateId,
    executionMode,
    dryRunOnly,
    actualWriteBlocked,
    publishBlocked,
    packageReplacementBlocked,
    preflightChecks,
    plannedExecutionSteps,
    auditPlan,
    rollbackExecutionDesign,
    writeLockRequirements,
    ownerAuthorizationTrace,
    qaTrace: authorizationGate.trace.qaTrace,
    humanReviewTrace: authorizationGate.trace.humanReviewTrace,
    candidateTrace: authorizationGate.trace.candidateTrace,
    contractTrace: authorizationGate.trace.contractTrace,
    previewTrace: authorizationGate.trace.previewTrace,
    gateTrace: authorizationGate.trace.gateTrace,
    writerTrace: authorizationGate.trace.writerDraftTrace,
    authorizationTrace: authorizationGate.trace,
    warnings,
    blockedReasons,
    executionDesignStatus,
    executionDesignOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    readyForFutureRealWriteImplementationGate,
    trace: {
      source: {
        authorizationGateStatus: authorizationGate.status,
        authorizationGateDecision: authorizationGate.decision,
        sourceReadyForExecutionDesign: sourceReady,
      },
      sourceAuthorizationGateId: authorizationGate.gateId,
      sourceWriterDraftId: authorizationGate.sourceWriterDraftId,
      sourceRegistryWriteGateId: authorizationGate.sourceRegistryWriteGateId,
      sourceRegistryPreparationId: authorizationGate.sourceRegistryPreparationId,
      checklistId: authorizationGate.checklistId,
      ownerAuthorizationTrace,
      qaTrace: authorizationGate.trace.qaTrace,
      humanReviewTrace: authorizationGate.trace.humanReviewTrace,
      candidateTrace: authorizationGate.trace.candidateTrace,
      contractTrace: authorizationGate.trace.contractTrace,
      previewTrace: authorizationGate.trace.previewTrace,
      gateTrace: authorizationGate.trace.gateTrace,
      writerTrace: authorizationGate.trace.writerDraftTrace,
      authorizationTrace: authorizationGate.trace,
      noRawImageReference,
      noPersonalData,
      noMedicalClaims,
      noProductShadeClaims,
      noUnsupportedFinalClaims,
      noActualRegistryWrite,
      noUserAppShellPackageReplacement,
      noProductionPackageMarker,
    },
    summary: readyForFutureRealWriteImplementationGate
      ? 'Controlled registry write execution design is ready for a future real write implementation gate only; no registry write, publish, or shell replacement occurs.'
      : 'Blocked: do not implement or execute a real registry write. Keep this as design-only.',
    jsonRoundTripStable: true,
  };
  design.jsonRoundTripStable = isJsonRoundTripStable(design);
  return design;
};
