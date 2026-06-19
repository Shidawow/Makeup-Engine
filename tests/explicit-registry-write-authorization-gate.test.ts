import { describe, expect, it } from 'vitest';
import {
  explicitRegistryWriteAuthorizationGateActualRegistryWriteBlockedExample,
  explicitRegistryWriteAuthorizationGateMissingActualWriteBlockedExample,
  explicitRegistryWriteAuthorizationGateMissingDryRunOnlyExample,
  explicitRegistryWriteAuthorizationGateMissingFutureApprovalExample,
  explicitRegistryWriteAuthorizationGateMissingOwnerAuthorizationExample,
  explicitRegistryWriteAuthorizationGateMissingPackageReplacementBlockedExample,
  explicitRegistryWriteAuthorizationGateMissingPublishBlockedExample,
  explicitRegistryWriteAuthorizationGateMissingReviewerAckExample,
  explicitRegistryWriteAuthorizationGateMissingWriterValidationExample,
  explicitRegistryWriteAuthorizationGateProductionMarkerBlockedExample,
  explicitRegistryWriteAuthorizationGateProductionWriteEnabledExample,
  explicitRegistryWriteAuthorizationGateReadyExample,
  explicitRegistryWriteAuthorizationGateShellReplacementBlockedExample,
  explicitRegistryWriteAuthorizationGateWarningExample,
} from '../src/templates/examples';

const issueIds = (gate: {
  blockedReasons: Array<{ id: string }>;
}): string[] => gate.blockedReasons.map((reason) => reason.id);

describe('Explicit registry write authorization gate', () => {
  it('is ready only after writer validation ready and remains a future design gate', () => {
    const gate = explicitRegistryWriteAuthorizationGateReadyExample;

    expect(gate.status).toBe('explicit_authorization_gate_ready');
    expect(gate.decision).toBe(
      'eligible_for_future_controlled_write_execution_design',
    );
    expect(gate.trace.sourceReadyForAuthorizationGate).toBe(true);
    expect(gate.dryRunOnly).toBe(true);
    expect(gate.actualWriteBlocked).toBe(true);
    expect(gate.publishBlocked).toBe(true);
    expect(gate.packageReplacementBlocked).toBe(true);
    expect(gate.productionWriteDisabled).toBe(true);
    expect(gate.ownerAuthorizationRequired).toBe(true);
    expect(gate.futureOwnerApprovalRequired).toBe(true);
    expect(gate.notActualWriteAuthorization).toBe(true);
    expect(gate.authorizationGateOnly).toBe(true);
    expect(gate.noActualRegistryWrite).toBe(true);
    expect(gate.notPublished).toBe(true);
    expect(gate.noUserAppShellPackageReplacement).toBe(true);
    expect(gate.notProductionPackage).toBe(true);
    expect(gate.summary).toContain('future controlled write execution design only');
  });

  it('keeps warning writer validation as ready with warnings, not execution approval', () => {
    const gate = explicitRegistryWriteAuthorizationGateWarningExample;

    expect(gate.status).toBe('explicit_authorization_gate_ready_with_warnings');
    expect(gate.decision).toBe('keep_as_dry_run_only');
    expect(gate.notActualWriteAuthorization).toBe(true);
  });

  it('blocks missing source validation and required safety flags', () => {
    expect(
      explicitRegistryWriteAuthorizationGateMissingWriterValidationExample.status,
    ).toBe('explicit_authorization_gate_blocked');
    expect(
      issueIds(explicitRegistryWriteAuthorizationGateMissingWriterValidationExample),
    ).toContain('source_writer_validation_ready_blocking');

    expect(issueIds(explicitRegistryWriteAuthorizationGateMissingDryRunOnlyExample)).toContain(
      'dry_run_only_true_blocking',
    );
    expect(
      issueIds(
        explicitRegistryWriteAuthorizationGateMissingActualWriteBlockedExample,
      ),
    ).toContain('actual_write_blocked_true_blocking');
    expect(
      issueIds(explicitRegistryWriteAuthorizationGateMissingPublishBlockedExample),
    ).toContain('publish_blocked_true_blocking');
    expect(
      issueIds(
        explicitRegistryWriteAuthorizationGateMissingPackageReplacementBlockedExample,
      ),
    ).toContain('package_replacement_blocked_true_blocking');
  });

  it('blocks actual registry write, production marker, and shell replacement markers', () => {
    expect(
      issueIds(
        explicitRegistryWriteAuthorizationGateActualRegistryWriteBlockedExample,
      ),
    ).toContain('no_actual_registry_write_blocking');
    expect(
      issueIds(
        explicitRegistryWriteAuthorizationGateProductionMarkerBlockedExample,
      ),
    ).toContain('no_production_package_marker_blocking');
    expect(
      issueIds(
        explicitRegistryWriteAuthorizationGateShellReplacementBlockedExample,
      ),
    ).toContain('no_user_app_shell_package_replacement_blocking');
  });

  it('requires owner authorization, reviewer acknowledgement, and production write disabled', () => {
    expect(
      issueIds(
        explicitRegistryWriteAuthorizationGateMissingOwnerAuthorizationExample,
      ),
    ).toContain('owner_authorization_required_blocking');
    expect(
      issueIds(explicitRegistryWriteAuthorizationGateMissingReviewerAckExample),
    ).toContain('reviewer_ack_required_blocking');
    expect(
      issueIds(explicitRegistryWriteAuthorizationGateMissingFutureApprovalExample),
    ).toContain('owner_authorization_required_blocking');
    expect(
      issueIds(
        explicitRegistryWriteAuthorizationGateProductionWriteEnabledExample,
      ),
    ).toContain('production_write_disabled_blocking');
  });

  it('is JSON round-trip stable and never claims actual write authorization', () => {
    const json = JSON.stringify(explicitRegistryWriteAuthorizationGateReadyExample);

    expect(JSON.parse(json)).toEqual(
      explicitRegistryWriteAuthorizationGateReadyExample,
    );
    expect(json).not.toContain('actualWriteAuthorized');
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
  });
});
