import { describe, expect, it } from 'vitest';
import {
  controlledRegistryWriteExecutionValidationActualExecutionModeExample,
  controlledRegistryWriteExecutionValidationActualRegistryWriteExample,
  controlledRegistryWriteExecutionValidationMissingActualWriteBlockedExample,
  controlledRegistryWriteExecutionValidationMissingAuditPlanExample,
  controlledRegistryWriteExecutionValidationMissingAuthorizationGateExample,
  controlledRegistryWriteExecutionValidationMissingDryRunOnlyExample,
  controlledRegistryWriteExecutionValidationMissingPackageReplacementBlockedExample,
  controlledRegistryWriteExecutionValidationMissingPublishBlockedExample,
  controlledRegistryWriteExecutionValidationMissingRollbackDesignExample,
  controlledRegistryWriteExecutionValidationMissingWriteLockExample,
  controlledRegistryWriteExecutionValidationProductionMarkerExample,
  controlledRegistryWriteExecutionValidationReadyExample,
  controlledRegistryWriteExecutionValidationShellReplacementExample,
  controlledRegistryWriteExecutionValidationWarningExample,
} from '../src/templates/examples';

const issueIds = (validation: {
  issues: Array<{ id: string }>;
}): string[] => validation.issues.map((issue) => issue.id);

describe('Controlled registry write execution validation', () => {
  it('validates a ready execution design without treating it as a real write', () => {
    const validation = controlledRegistryWriteExecutionValidationReadyExample;

    expect(validation.status).toBe('execution_validation_ready');
    expect(validation.readyForRealWriteImplementationGate).toBe(true);
    expect(validation.executionDesignOnly).toBe(true);
    expect(validation.dryRunOnly).toBe(true);
    expect(validation.noActualRegistryWrite).toBe(true);
    expect(validation.notPublished).toBe(true);
    expect(validation.noUserAppShellPackageReplacement).toBe(true);
    expect(validation.notProductionPackage).toBe(true);
    expect(validation.recommendations[0]?.action).toBe(
      'continue_to_real_write_implementation_gate',
    );
  });

  it('keeps warning designs as warning-only handoff candidates', () => {
    const validation = controlledRegistryWriteExecutionValidationWarningExample;

    expect(validation.status).toBe('execution_validation_ready_with_warnings');
    expect(validation.recommendations[0]?.action).toBe(
      'keep_as_execution_design_only',
    );
  });

  it('blocks missing source authorization and safety flags', () => {
    expect(
      issueIds(
        controlledRegistryWriteExecutionValidationMissingAuthorizationGateExample,
      ),
    ).toContain('source_authorization_gate_ready_blocking');
    expect(
      issueIds(controlledRegistryWriteExecutionValidationMissingDryRunOnlyExample),
    ).toContain('dry_run_only_true_blocking');
    expect(
      issueIds(
        controlledRegistryWriteExecutionValidationMissingActualWriteBlockedExample,
      ),
    ).toContain('actual_write_blocked_true_blocking');
    expect(
      issueIds(controlledRegistryWriteExecutionValidationMissingPublishBlockedExample),
    ).toContain('publish_blocked_true_blocking');
    expect(
      issueIds(
        controlledRegistryWriteExecutionValidationMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true_blocking');
  });

  it('blocks missing audit, rollback, and write-lock design', () => {
    expect(
      issueIds(controlledRegistryWriteExecutionValidationMissingAuditPlanExample),
    ).toContain('audit_plan_present_blocking');
    expect(
      issueIds(
        controlledRegistryWriteExecutionValidationMissingRollbackDesignExample,
      ),
    ).toContain('rollback_design_present_blocking');
    expect(
      issueIds(controlledRegistryWriteExecutionValidationMissingWriteLockExample),
    ).toContain('write_lock_requirements_present_blocking');
  });

  it('blocks actual write, production marker, shell replacement, and non-design execution mode', () => {
    expect(
      issueIds(controlledRegistryWriteExecutionValidationActualRegistryWriteExample),
    ).toContain('no_actual_registry_write_blocking');
    expect(
      issueIds(controlledRegistryWriteExecutionValidationProductionMarkerExample),
    ).toContain('no_production_package_marker_blocking');
    expect(
      issueIds(controlledRegistryWriteExecutionValidationShellReplacementExample),
    ).toContain('no_user_app_shell_package_replacement_blocking');
    expect(
      issueIds(controlledRegistryWriteExecutionValidationActualExecutionModeExample),
    ).toContain('execution_mode_is_design_only_blocking');
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(controlledRegistryWriteExecutionValidationReadyExample);

    expect(JSON.parse(json)).toEqual(
      controlledRegistryWriteExecutionValidationReadyExample,
    );
  });
});
