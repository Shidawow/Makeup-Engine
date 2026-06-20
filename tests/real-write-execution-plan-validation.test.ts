import { describe, expect, it } from 'vitest';
import {
  realWriteExecutionPlanValidationActualRegistryWriteExample,
  realWriteExecutionPlanValidationMissingActualWriteBlockedExample,
  realWriteExecutionPlanValidationMissingAuditExample,
  realWriteExecutionPlanValidationMissingDryRunOnlyExample,
  realWriteExecutionPlanValidationMissingDryRunVerificationExample,
  realWriteExecutionPlanValidationMissingExecutionAuthorizationExample,
  realWriteExecutionPlanValidationMissingExecutionSequenceExample,
  realWriteExecutionPlanValidationMissingFailureHandlingExample,
  realWriteExecutionPlanValidationMissingPackageReplacementBlockedExample,
  realWriteExecutionPlanValidationMissingPreflightExample,
  realWriteExecutionPlanValidationMissingProductionWriterBlockedExample,
  realWriteExecutionPlanValidationMissingPublishBlockedExample,
  realWriteExecutionPlanValidationMissingRollbackExample,
  realWriteExecutionPlanValidationMissingWriteLockExample,
  realWriteExecutionPlanValidationProductionMarkerExample,
  realWriteExecutionPlanValidationProductionWriterCreationExample,
  realWriteExecutionPlanValidationReadyExample,
  realWriteExecutionPlanValidationShellReplacementExample,
  realWriteExecutionPlanValidationWarningExample,
} from '../src/templates/examples';

const failedIds = (validation: {
  checks: Array<{ id: string; passed: boolean }>;
}): string[] =>
  validation.checks
    .filter((check) => !check.passed)
    .map((check) => check.id);

describe('Real write execution plan validation', () => {
  it('passes ready execution plans while keeping execution plan only', () => {
    const validation = realWriteExecutionPlanValidationReadyExample;

    expect(validation.status).toBe('execution_plan_validation_ready');
    expect(validation.readyForFutureGuardedExecutionSimulator).toBe(true);
    expect(validation.executionPlanOnly).toBe(true);
    expect(validation.dryRunOnly).toBe(true);
    expect(validation.noActualRegistryWrite).toBe(true);
    expect(validation.notPublished).toBe(true);
    expect(validation.noUserAppShellPackageReplacement).toBe(true);
    expect(validation.notProductionWriter).toBe(true);
    expect(validation.doesNotCreateProductionWriter).toBe(true);
    expect(validation.recommendations[0]?.action).toBe(
      'continue_to_guarded_execution_simulator',
    );
  });

  it('keeps warning plans as plan-only instead of simulator-ready', () => {
    const validation = realWriteExecutionPlanValidationWarningExample;

    expect(validation.status).toBe('execution_plan_validation_ready_with_warnings');
    expect(validation.readyForFutureGuardedExecutionSimulator).toBe(false);
    expect(validation.recommendations[0]?.action).toBe(
      'keep_as_execution_plan_only',
    );
  });

  it('blocks missing source authorization and safety flags', () => {
    expect(
      failedIds(realWriteExecutionPlanValidationMissingExecutionAuthorizationExample),
    ).toContain('source_execution_authorization_ready');
    expect(failedIds(realWriteExecutionPlanValidationMissingDryRunOnlyExample)).toContain(
      'dry_run_only_true',
    );
    expect(
      failedIds(realWriteExecutionPlanValidationMissingActualWriteBlockedExample),
    ).toContain('actual_write_blocked_true');
    expect(
      failedIds(realWriteExecutionPlanValidationMissingPublishBlockedExample),
    ).toContain('publish_blocked_true');
    expect(
      failedIds(
        realWriteExecutionPlanValidationMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true');
    expect(
      failedIds(
        realWriteExecutionPlanValidationMissingProductionWriterBlockedExample,
      ),
    ).toContain('production_writer_blocked_true');
  });

  it('blocks missing required plan sections', () => {
    expect(
      failedIds(realWriteExecutionPlanValidationMissingExecutionSequenceExample),
    ).toContain('execution_sequence_plan_present');
    expect(failedIds(realWriteExecutionPlanValidationMissingPreflightExample)).toContain(
      'preflight_plan_present',
    );
    expect(failedIds(realWriteExecutionPlanValidationMissingWriteLockExample)).toContain(
      'write_lock_plan_present',
    );
    expect(failedIds(realWriteExecutionPlanValidationMissingAuditExample)).toContain(
      'audit_plan_present',
    );
    expect(failedIds(realWriteExecutionPlanValidationMissingRollbackExample)).toContain(
      'rollback_plan_present',
    );
    expect(
      failedIds(realWriteExecutionPlanValidationMissingFailureHandlingExample),
    ).toContain('failure_handling_plan_present');
    expect(
      failedIds(realWriteExecutionPlanValidationMissingDryRunVerificationExample),
    ).toContain('dry_run_verification_plan_present');
  });

  it('blocks unsafe markers', () => {
    expect(
      failedIds(realWriteExecutionPlanValidationActualRegistryWriteExample),
    ).toContain('no_actual_registry_write');
    expect(failedIds(realWriteExecutionPlanValidationProductionMarkerExample)).toContain(
      'no_production_package_marker',
    );
    expect(failedIds(realWriteExecutionPlanValidationShellReplacementExample)).toContain(
      'no_user_app_shell_package_replacement',
    );
    expect(
      failedIds(realWriteExecutionPlanValidationProductionWriterCreationExample),
    ).toContain('no_production_writer_creation');
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(realWriteExecutionPlanValidationReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteExecutionPlanValidationReadyExample);
    expect(realWriteExecutionPlanValidationReadyExample.jsonRoundTripStable).toBe(
      true,
    );
  });
});
