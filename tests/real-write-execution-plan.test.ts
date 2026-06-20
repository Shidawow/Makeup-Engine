import { describe, expect, it } from 'vitest';
import {
  realWriteExecutionPlanActualRegistryWriteExample,
  realWriteExecutionPlanMissingActualWriteBlockedExample,
  realWriteExecutionPlanMissingAuditExample,
  realWriteExecutionPlanMissingDryRunOnlyExample,
  realWriteExecutionPlanMissingDryRunVerificationExample,
  realWriteExecutionPlanMissingExecutionAuthorizationExample,
  realWriteExecutionPlanMissingExecutionSequenceExample,
  realWriteExecutionPlanMissingFailureHandlingExample,
  realWriteExecutionPlanMissingPackageReplacementBlockedExample,
  realWriteExecutionPlanMissingPreflightExample,
  realWriteExecutionPlanMissingProductionWriterBlockedExample,
  realWriteExecutionPlanMissingPublishBlockedExample,
  realWriteExecutionPlanMissingRollbackExample,
  realWriteExecutionPlanMissingWriteLockExample,
  realWriteExecutionPlanProductionMarkerExample,
  realWriteExecutionPlanProductionWriterCreationExample,
  realWriteExecutionPlanReadyExample,
  realWriteExecutionPlanShellReplacementExample,
  realWriteExecutionPlanWarningExample,
} from '../src/templates/examples';

const blockedIds = (plan: { blockedReasons: Array<{ id: string }> }): string[] =>
  plan.blockedReasons.map((reason) => reason.id);

describe('Real write execution plan', () => {
  it('becomes ready only from a ready execution authorization source', () => {
    const plan = realWriteExecutionPlanReadyExample;

    expect(plan.executionPlanStatus).toBe('execution_plan_ready');
    expect(plan.readyForFutureGuardedExecutionSimulator).toBe(true);
    expect(plan.executionPlanOnly).toBe(true);
    expect(plan.dryRunOnly).toBe(true);
    expect(plan.actualWriteBlocked).toBe(true);
    expect(plan.publishBlocked).toBe(true);
    expect(plan.packageReplacementBlocked).toBe(true);
    expect(plan.productionWriterBlocked).toBe(true);
    expect(plan.noActualRegistryWrite).toBe(true);
    expect(plan.notPublished).toBe(true);
    expect(plan.noUserAppShellPackageReplacement).toBe(true);
    expect(plan.notProductionWriter).toBe(true);
    expect(plan.doesNotCreateProductionWriter).toBe(true);
    expect(plan.executionSequencePlan.length).toBeGreaterThan(0);
    expect(plan.preflightPlan).toBeTruthy();
    expect(plan.writeLockPlan).toBeTruthy();
    expect(plan.auditPlan).toBeTruthy();
    expect(plan.rollbackPlan).toBeTruthy();
    expect(plan.failureHandlingPlan).toBeTruthy();
    expect(plan.dryRunVerificationPlan).toBeTruthy();
  });

  it('keeps warning source authorizations as execution-plan-only warnings', () => {
    expect(realWriteExecutionPlanWarningExample.executionPlanStatus).toBe(
      'execution_plan_ready_with_warnings',
    );
    expect(
      realWriteExecutionPlanWarningExample.readyForFutureGuardedExecutionSimulator,
    ).toBe(false);
  });

  it('blocks missing execution authorization and safety flags', () => {
    expect(blockedIds(realWriteExecutionPlanMissingExecutionAuthorizationExample)).toContain(
      'source_execution_authorization_ready',
    );
    expect(blockedIds(realWriteExecutionPlanMissingDryRunOnlyExample)).toContain(
      'dry_run_only_true',
    );
    expect(blockedIds(realWriteExecutionPlanMissingActualWriteBlockedExample)).toContain(
      'actual_write_blocked_true',
    );
    expect(blockedIds(realWriteExecutionPlanMissingPublishBlockedExample)).toContain(
      'publish_blocked_true',
    );
    expect(
      blockedIds(realWriteExecutionPlanMissingPackageReplacementBlockedExample),
    ).toContain('package_replacement_blocked_true');
    expect(
      blockedIds(realWriteExecutionPlanMissingProductionWriterBlockedExample),
    ).toContain('production_writer_blocked_true');
  });

  it('blocks missing required execution plan sections', () => {
    expect(blockedIds(realWriteExecutionPlanMissingExecutionSequenceExample)).toContain(
      'execution_sequence_plan_present',
    );
    expect(blockedIds(realWriteExecutionPlanMissingPreflightExample)).toContain(
      'preflight_plan_present',
    );
    expect(blockedIds(realWriteExecutionPlanMissingWriteLockExample)).toContain(
      'write_lock_plan_present',
    );
    expect(blockedIds(realWriteExecutionPlanMissingAuditExample)).toContain(
      'audit_plan_present',
    );
    expect(blockedIds(realWriteExecutionPlanMissingRollbackExample)).toContain(
      'rollback_plan_present',
    );
    expect(blockedIds(realWriteExecutionPlanMissingFailureHandlingExample)).toContain(
      'failure_handling_plan_present',
    );
    expect(blockedIds(realWriteExecutionPlanMissingDryRunVerificationExample)).toContain(
      'dry_run_verification_plan_present',
    );
  });

  it('blocks actual write, production, shell replacement, and production writer markers', () => {
    expect(blockedIds(realWriteExecutionPlanActualRegistryWriteExample)).toContain(
      'no_actual_registry_write',
    );
    expect(blockedIds(realWriteExecutionPlanProductionMarkerExample)).toContain(
      'no_production_package_marker',
    );
    expect(blockedIds(realWriteExecutionPlanShellReplacementExample)).toContain(
      'no_user_app_shell_package_replacement',
    );
    expect(blockedIds(realWriteExecutionPlanProductionWriterCreationExample)).toContain(
      'no_production_writer_creation',
    );
  });

  it('is JSON round-trip stable and never claims actual execution', () => {
    const json = JSON.stringify(realWriteExecutionPlanReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteExecutionPlanReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('createProductionWriter');
    expect(json).not.toContain('actualWriteAuthorized');
    expect(json).not.toContain('productionWriterReady');
  });
});
