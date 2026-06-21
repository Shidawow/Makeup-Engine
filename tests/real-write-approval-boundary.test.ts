import { describe, expect, it } from 'vitest';
import {
  realWriteApprovalBoundaryActualRegistryWriteExample,
  realWriteApprovalBoundaryActualWriteScopeExample,
  realWriteApprovalBoundaryMissingActualWriteBlockedExample,
  realWriteApprovalBoundaryMissingDryRunOnlyExample,
  realWriteApprovalBoundaryMissingPackageReplacementBlockedExample,
  realWriteApprovalBoundaryMissingProductionWriterBlockedExample,
  realWriteApprovalBoundaryMissingPublishBlockedExample,
  realWriteApprovalBoundaryMissingRegistryMutationBlockedExample,
  realWriteApprovalBoundaryMissingSimulatorReviewGateExample,
  realWriteApprovalBoundaryProductionMarkerExample,
  realWriteApprovalBoundaryProductionWriterCreationExample,
  realWriteApprovalBoundaryProductionWriterScopeExample,
  realWriteApprovalBoundaryPublishScopeExample,
  realWriteApprovalBoundaryReadyExample,
  realWriteApprovalBoundaryRegistryMutationExample,
  realWriteApprovalBoundaryRegistryMutationScopeExample,
  realWriteApprovalBoundaryShellReplacementExample,
  realWriteApprovalBoundaryShellReplacementScopeExample,
  realWriteApprovalBoundaryWarningExample,
} from '../src/templates/examples';

const failedIds = (boundary: {
  checks: Array<{ id: string; passed: boolean }>;
}): string[] =>
  boundary.checks.filter((check) => !check.passed).map((check) => check.id);

describe('Real write approval boundary', () => {
  it('becomes ready only from simulator review gate ready while remaining boundary-only', () => {
    const boundary = realWriteApprovalBoundaryReadyExample;

    expect(boundary.status).toBe('real_write_approval_boundary_ready');
    expect(boundary.decision).toBe(
      'ready_for_future_actual_write_authorization_request',
    );
    expect(boundary.readyForFutureActualWriteAuthorizationRequest).toBe(true);
    expect(boundary.approvalScope).toBe('boundary_only');
    expect(boundary.approvalBoundaryOnly).toBe(true);
    expect(boundary.notActualWriteAuthorization).toBe(true);
    expect(boundary.dryRunOnly).toBe(true);
    expect(boundary.noActualRegistryWrite).toBe(true);
    expect(boundary.noRegistryMutation).toBe(true);
    expect(boundary.notPublished).toBe(true);
    expect(boundary.noUserAppShellPackageReplacement).toBe(true);
    expect(boundary.doesNotCreateProductionWriter).toBe(true);
    expect(boundary.futureActualWriteRequiresSeparateApproval).toBe(true);
    expect(failedIds(boundary)).toEqual([]);
  });

  it('keeps warning simulator gates as approval-boundary-only', () => {
    const boundary = realWriteApprovalBoundaryWarningExample;

    expect(boundary.status).toBe('real_write_approval_boundary_ready_with_warnings');
    expect(boundary.readyForFutureActualWriteAuthorizationRequest).toBe(false);
    expect(boundary.decision).toBe('keep_as_approval_boundary_only');
  });

  it('blocks missing simulator review gate and required safety flags', () => {
    expect(failedIds(realWriteApprovalBoundaryMissingSimulatorReviewGateExample)).toContain(
      'source_simulator_review_gate_ready',
    );
    expect(failedIds(realWriteApprovalBoundaryMissingDryRunOnlyExample)).toContain(
      'dry_run_only_true',
    );
    expect(failedIds(realWriteApprovalBoundaryMissingActualWriteBlockedExample)).toContain(
      'actual_write_blocked_true',
    );
    expect(
      failedIds(realWriteApprovalBoundaryMissingRegistryMutationBlockedExample),
    ).toContain('registry_mutation_blocked_true');
    expect(failedIds(realWriteApprovalBoundaryMissingPublishBlockedExample)).toContain(
      'publish_blocked_true',
    );
    expect(
      failedIds(realWriteApprovalBoundaryMissingPackageReplacementBlockedExample),
    ).toContain('package_replacement_blocked_true');
    expect(
      failedIds(realWriteApprovalBoundaryMissingProductionWriterBlockedExample),
    ).toContain('production_writer_blocked_true');
  });

  it('blocks approval scopes that would imply real write authority', () => {
    expect(failedIds(realWriteApprovalBoundaryActualWriteScopeExample)).toEqual(
      expect.arrayContaining([
        'approval_boundary_only',
        'owner_has_not_authorized_actual_write',
      ]),
    );
    expect(failedIds(realWriteApprovalBoundaryRegistryMutationScopeExample)).toEqual(
      expect.arrayContaining([
        'approval_boundary_only',
        'owner_has_not_authorized_registry_mutation',
      ]),
    );
    expect(failedIds(realWriteApprovalBoundaryPublishScopeExample)).toEqual(
      expect.arrayContaining([
        'approval_boundary_only',
        'owner_has_not_authorized_publish',
      ]),
    );
    expect(failedIds(realWriteApprovalBoundaryShellReplacementScopeExample)).toEqual(
      expect.arrayContaining([
        'approval_boundary_only',
        'owner_has_not_authorized_user_app_shell_replacement',
      ]),
    );
    expect(failedIds(realWriteApprovalBoundaryProductionWriterScopeExample)).toEqual(
      expect.arrayContaining([
        'approval_boundary_only',
        'owner_has_not_authorized_production_writer_creation',
      ]),
    );
  });

  it('blocks actual write, mutation, production, shell replacement, and writer markers', () => {
    expect(failedIds(realWriteApprovalBoundaryActualRegistryWriteExample)).toContain(
      'no_actual_registry_write',
    );
    expect(failedIds(realWriteApprovalBoundaryRegistryMutationExample)).toContain(
      'no_registry_mutation',
    );
    expect(failedIds(realWriteApprovalBoundaryProductionMarkerExample)).toContain(
      'no_production_package_marker',
    );
    expect(failedIds(realWriteApprovalBoundaryShellReplacementExample)).toContain(
      'no_user_app_shell_package_replacement',
    );
    expect(
      failedIds(realWriteApprovalBoundaryProductionWriterCreationExample),
    ).toContain('no_production_writer_creation');
  });

  it('is JSON round-trip stable and never claims real execution', () => {
    const json = JSON.stringify(realWriteApprovalBoundaryReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteApprovalBoundaryReadyExample);
    expect(realWriteApprovalBoundaryReadyExample.jsonRoundTripStable).toBe(true);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('registry_mutation_executed');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('createProductionWriter');
    expect(json).not.toContain('actualWriteAuthorized');
  });
});
