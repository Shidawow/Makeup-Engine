import { describe, expect, it } from 'vitest';
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
} from '../src/templates/examples';

const issueIds = (gate: {
  issues: Array<{ id: string }>;
}): string[] => gate.issues.map((issue) => issue.id);

describe('Real registry write implementation gate', () => {
  it('is ready only after execution validation ready and remains gate-only', () => {
    const gate = realRegistryWriteImplementationGateReadyExample;

    expect(gate.status).toBe('real_write_implementation_gate_ready');
    expect(gate.decision).toBe(
      'eligible_for_future_real_write_implementation_draft',
    );
    expect(gate.readyForFutureRealWriteImplementationDraft).toBe(true);
    expect(gate.implementationGateOnly).toBe(true);
    expect(gate.notRealWriteImplementation).toBe(true);
    expect(gate.dryRunOnly).toBe(true);
    expect(gate.actualWriteBlocked).toBe(true);
    expect(gate.publishBlocked).toBe(true);
    expect(gate.packageReplacementBlocked).toBe(true);
    expect(gate.productionWriteStillDisabled).toBe(true);
    expect(gate.futureExplicitApprovalRequired).toBe(true);
    expect(gate.noActualRegistryWrite).toBe(true);
    expect(gate.notPublished).toBe(true);
    expect(gate.noUserAppShellPackageReplacement).toBe(true);
    expect(gate.notProductionPackage).toBe(true);
    expect(gate.summary).toContain('future implementation draft only');
  });

  it('keeps warning execution validation as warning-only, not implementation approval', () => {
    const gate = realRegistryWriteImplementationGateWarningExample;

    expect(gate.status).toBe('real_write_implementation_gate_ready_with_warnings');
    expect(gate.decision).toBe('keep_as_execution_design_only');
    expect(gate.notRealWriteImplementation).toBe(true);
  });

  it('blocks missing execution validation and required safety flags', () => {
    expect(
      issueIds(realRegistryWriteImplementationGateMissingExecutionValidationExample),
    ).toContain('source_execution_validation_ready_blocking');
    expect(
      issueIds(realRegistryWriteImplementationGateMissingDryRunOnlyExample),
    ).toContain('dry_run_only_true_blocking');
    expect(
      issueIds(
        realRegistryWriteImplementationGateMissingActualWriteBlockedExample,
      ),
    ).toContain('actual_write_blocked_true_blocking');
    expect(
      issueIds(realRegistryWriteImplementationGateMissingPublishBlockedExample),
    ).toContain('publish_blocked_true_blocking');
    expect(
      issueIds(
        realRegistryWriteImplementationGateMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true_blocking');
  });

  it('blocks actual registry write, production marker, and shell replacement', () => {
    expect(
      issueIds(realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample),
    ).toContain('source_execution_validation_ready_blocking');
    expect(
      issueIds(realRegistryWriteImplementationGateBlockedByActualRegistryWriteExample),
    ).toContain('no_actual_registry_write_blocking');
    expect(
      issueIds(realRegistryWriteImplementationGateBlockedByProductionMarkerExample),
    ).toContain('no_production_package_marker_blocking');
    expect(
      issueIds(realRegistryWriteImplementationGateBlockedByShellReplacementExample),
    ).toContain('no_user_app_shell_package_replacement_blocking');
  });

  it('requires production write disabled and future explicit approval', () => {
    const gate = realRegistryWriteImplementationGateReadyExample;

    expect(gate.checks.find((check) => check.id === 'production_write_still_disabled')?.passed).toBe(true);
    expect(
      gate.checks.find(
        (check) => check.id === 'implementation_requires_future_explicit_approval',
      )?.passed,
    ).toBe(true);
  });

  it('is JSON round-trip stable and never claims real write implementation', () => {
    const json = JSON.stringify(realRegistryWriteImplementationGateReadyExample);

    expect(JSON.parse(json)).toEqual(realRegistryWriteImplementationGateReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('realWriteImplemented');
    expect(json).not.toContain('actualWriteAuthorized');
  });
});
