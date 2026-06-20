import { describe, expect, it } from 'vitest';
import {
  controlledRegistryWriteExecutionDesignActualExecutionModeBlockedExample,
  controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample,
  controlledRegistryWriteExecutionDesignMissingActualWriteBlockedExample,
  controlledRegistryWriteExecutionDesignMissingAuditPlanExample,
  controlledRegistryWriteExecutionDesignMissingAuthorizationGateExample,
  controlledRegistryWriteExecutionDesignMissingDryRunOnlyExample,
  controlledRegistryWriteExecutionDesignMissingPackageReplacementBlockedExample,
  controlledRegistryWriteExecutionDesignMissingPublishBlockedExample,
  controlledRegistryWriteExecutionDesignMissingRollbackDesignExample,
  controlledRegistryWriteExecutionDesignMissingWriteLockExample,
  controlledRegistryWriteExecutionDesignProductionMarkerBlockedExample,
  controlledRegistryWriteExecutionDesignReadyExample,
  controlledRegistryWriteExecutionDesignShellReplacementBlockedExample,
  controlledRegistryWriteExecutionDesignWarningExample,
} from '../src/templates/examples';

const blockedIds = (design: {
  blockedReasons: Array<{ id: string }>;
}): string[] => design.blockedReasons.map((reason) => reason.id);

describe('Controlled registry write execution design', () => {
  it('is ready only after authorization gate ready and remains design-only', () => {
    const design = controlledRegistryWriteExecutionDesignReadyExample;

    expect(design.executionDesignStatus).toBe('execution_design_ready');
    expect(design.readyForFutureRealWriteImplementationGate).toBe(true);
    expect(design.executionMode).toBe('dry_run_design');
    expect(design.dryRunOnly).toBe(true);
    expect(design.actualWriteBlocked).toBe(true);
    expect(design.publishBlocked).toBe(true);
    expect(design.packageReplacementBlocked).toBe(true);
    expect(design.executionDesignOnly).toBe(true);
    expect(design.noActualRegistryWrite).toBe(true);
    expect(design.notPublished).toBe(true);
    expect(design.noUserAppShellPackageReplacement).toBe(true);
    expect(design.notProductionPackage).toBe(true);
    expect(design.auditPlan?.items.length).toBeGreaterThan(0);
    expect(design.rollbackExecutionDesign?.steps.length).toBeGreaterThan(0);
    expect(design.writeLockRequirements.length).toBeGreaterThan(0);
    expect(design.summary).toContain('future real write implementation gate only');
  });

  it('keeps warning authorization gates as ready with warnings, not execution approval', () => {
    const design = controlledRegistryWriteExecutionDesignWarningExample;

    expect(design.executionDesignStatus).toBe(
      'execution_design_ready_with_warnings',
    );
    expect(design.warnings.length).toBeGreaterThan(0);
    expect(design.executionDesignOnly).toBe(true);
  });

  it('blocks missing authorization gate readiness and required safety flags', () => {
    expect(
      blockedIds(controlledRegistryWriteExecutionDesignMissingAuthorizationGateExample),
    ).toContain('authorization_gate_ready_blocking');
    expect(
      blockedIds(controlledRegistryWriteExecutionDesignMissingDryRunOnlyExample),
    ).toContain('dry_run_only_true_blocking');
    expect(
      blockedIds(
        controlledRegistryWriteExecutionDesignMissingActualWriteBlockedExample,
      ),
    ).toContain('actual_write_blocked_true_blocking');
    expect(
      blockedIds(controlledRegistryWriteExecutionDesignMissingPublishBlockedExample),
    ).toContain('publish_blocked_true_blocking');
    expect(
      blockedIds(
        controlledRegistryWriteExecutionDesignMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true_blocking');
  });

  it('blocks missing audit plan, rollback design, and write locks', () => {
    expect(
      blockedIds(controlledRegistryWriteExecutionDesignMissingAuditPlanExample),
    ).toContain('audit_plan_present_blocking');
    expect(
      blockedIds(controlledRegistryWriteExecutionDesignMissingRollbackDesignExample),
    ).toContain('rollback_design_present_blocking');
    expect(
      blockedIds(controlledRegistryWriteExecutionDesignMissingWriteLockExample),
    ).toContain('write_lock_requirements_present_blocking');
  });

  it('blocks actual registry write, production marker, shell replacement, and actual execution mode', () => {
    expect(
      blockedIds(
        controlledRegistryWriteExecutionDesignActualRegistryWriteBlockedExample,
      ),
    ).toContain('no_actual_registry_write_blocking');
    expect(
      blockedIds(
        controlledRegistryWriteExecutionDesignProductionMarkerBlockedExample,
      ),
    ).toContain('no_production_package_marker_blocking');
    expect(
      blockedIds(
        controlledRegistryWriteExecutionDesignShellReplacementBlockedExample,
      ),
    ).toContain('no_user_app_shell_package_replacement_blocking');
    expect(
      blockedIds(
        controlledRegistryWriteExecutionDesignActualExecutionModeBlockedExample,
      ),
    ).toContain('execution_mode_design_only_blocking');
  });

  it('is JSON round-trip stable and never claims real write execution', () => {
    const json = JSON.stringify(controlledRegistryWriteExecutionDesignReadyExample);

    expect(JSON.parse(json)).toEqual(
      controlledRegistryWriteExecutionDesignReadyExample,
    );
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('actualWriteAuthorized');
  });
});
