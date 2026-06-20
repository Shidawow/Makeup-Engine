import type { ControlledRegistryWriteExecutionDesign } from './controlledRegistryWriteExecutionDesign';
import type {
  ControlledRegistryWriteExecutionValidationRecommendation,
  ControlledRegistryWriteExecutionValidationResult,
} from './controlledRegistryWriteExecutionValidation';

export type ControlledRegistryWriteExecutionNextAction =
  | 'ready_for_real_write_implementation_gate'
  | 'request_execution_plan_revision'
  | 'request_audit_plan_revision'
  | 'request_rollback_design_revision'
  | 'request_write_lock_review'
  | 'request_owner_authorization_review'
  | 'keep_as_execution_design_only'
  | 'blocked_do_not_implement_real_write';

export type ControlledRegistryWriteExecutionHandoffStatus =
  | 'execution_handoff_ready'
  | 'execution_handoff_ready_with_warnings'
  | 'execution_handoff_blocked'
  | 'execution_handoff_example_only';

export interface ControlledRegistryWriteExecutionHandoffItem {
  id: string;
  label: string;
  value: string;
  status: 'ready' | 'warning' | 'blocked';
}

export interface ControlledRegistryWriteExecutionHandoff {
  id: string;
  sourceExecutionDesignId: string;
  sourceAuthorizationGateId: string;
  sourceWriterDraftId: string;
  sourceRegistryWriteGateId: string;
  status: ControlledRegistryWriteExecutionHandoffStatus;
  nextAction: ControlledRegistryWriteExecutionNextAction;
  items: ControlledRegistryWriteExecutionHandoffItem[];
  notes: string[];
  executionDesignOnly: true;
  dryRunOnly: true;
  noActualRegistryWrite: true;
  notPublished: true;
  noUserAppShellPackageReplacement: true;
  notProductionPackage: true;
  futureOwnerAuthorizationRequired: true;
  readyForRealWriteImplementationGate: boolean;
  jsonRoundTripStable: boolean;
}

const isJsonRoundTripStable = (value: unknown): boolean => {
  try {
    return JSON.stringify(JSON.parse(JSON.stringify(value))) === JSON.stringify(value);
  } catch {
    return false;
  }
};

const statusForDesign = (
  design: ControlledRegistryWriteExecutionDesign,
  validation: ControlledRegistryWriteExecutionValidationResult,
): ControlledRegistryWriteExecutionHandoffStatus => {
  if (design.executionDesignStatus === 'execution_design_example_only') {
    return 'execution_handoff_example_only';
  }
  if (validation.status === 'execution_validation_blocked') {
    return 'execution_handoff_blocked';
  }
  if (validation.status === 'execution_validation_ready_with_warnings') {
    return 'execution_handoff_ready_with_warnings';
  }
  return 'execution_handoff_ready';
};

const nextActionForValidation = (
  recommendation: ControlledRegistryWriteExecutionValidationRecommendation | undefined,
): ControlledRegistryWriteExecutionNextAction => {
  switch (recommendation?.action) {
    case 'continue_to_real_write_implementation_gate':
      return 'ready_for_real_write_implementation_gate';
    case 'request_execution_plan_revision':
      return 'request_execution_plan_revision';
    case 'request_audit_plan_revision':
      return 'request_audit_plan_revision';
    case 'request_rollback_design_revision':
      return 'request_rollback_design_revision';
    case 'request_write_lock_review':
      return 'request_write_lock_review';
    case 'request_owner_authorization_review':
      return 'request_owner_authorization_review';
    case 'keep_as_execution_design_only':
      return 'keep_as_execution_design_only';
    case 'block_real_write_implementation':
    default:
      return 'blocked_do_not_implement_real_write';
  }
};

export const createControlledRegistryWriteExecutionHandoff = ({
  design,
  validation,
  id = `controlled-registry-write-execution-handoff-${design.executionDesignId}`,
}: {
  design: ControlledRegistryWriteExecutionDesign;
  validation: ControlledRegistryWriteExecutionValidationResult;
  id?: string;
}): ControlledRegistryWriteExecutionHandoff => {
  const handoff: ControlledRegistryWriteExecutionHandoff = {
    id,
    sourceExecutionDesignId: design.executionDesignId,
    sourceAuthorizationGateId: design.sourceAuthorizationGateId,
    sourceWriterDraftId: design.sourceWriterDraftId,
    sourceRegistryWriteGateId: design.sourceRegistryWriteGateId,
    status: statusForDesign(design, validation),
    nextAction: nextActionForValidation(validation.recommendations[0]),
    items: [
      {
        id: 'execution_design_status',
        label: 'Controlled execution design',
        value: design.executionDesignStatus,
        status:
          design.executionDesignStatus === 'execution_design_blocked'
            ? 'blocked'
            : design.executionDesignStatus === 'execution_design_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'execution_validation_status',
        label: 'Execution safety validation',
        value: validation.status,
        status:
          validation.status === 'execution_validation_blocked'
            ? 'blocked'
            : validation.status === 'execution_validation_ready_with_warnings'
              ? 'warning'
              : 'ready',
      },
      {
        id: 'audit_plan',
        label: 'Audit plan',
        value: design.auditPlan?.summary ?? 'missing audit plan',
        status: design.auditPlan ? 'ready' : 'blocked',
      },
      {
        id: 'rollback_design',
        label: 'Rollback execution design',
        value: design.rollbackExecutionDesign?.summary ?? 'missing rollback design',
        status: design.rollbackExecutionDesign ? 'ready' : 'blocked',
      },
      {
        id: 'write_lock_requirements',
        label: 'Write lock requirements',
        value: `${design.writeLockRequirements.length} requirements`,
        status:
          design.writeLockRequirements.length > 0 &&
          design.writeLockRequirements.every((item) => item.status !== 'blocked')
            ? 'ready'
            : 'blocked',
      },
    ],
    notes: [
      'Handoff is local and administrator-only.',
      'Handoff does not write a UserAppTemplatePackage registry.',
      'Handoff does not publish to the user app.',
      'Handoff does not replace the current User App Shell package.',
      'Ready only means eligible for Phase 10N real write implementation gate design/review.',
      'Future real execution still requires separate owner authorization.',
    ],
    executionDesignOnly: true,
    dryRunOnly: true,
    noActualRegistryWrite: true,
    notPublished: true,
    noUserAppShellPackageReplacement: true,
    notProductionPackage: true,
    futureOwnerAuthorizationRequired: true,
    readyForRealWriteImplementationGate:
      validation.readyForRealWriteImplementationGate,
    jsonRoundTripStable: true,
  };
  handoff.jsonRoundTripStable = isJsonRoundTripStable(handoff);
  return handoff;
};
