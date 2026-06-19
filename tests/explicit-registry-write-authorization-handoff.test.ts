import { describe, expect, it } from 'vitest';
import {
  explicitRegistryWriteAuthorizationHandoffBlockedExample,
  explicitRegistryWriteAuthorizationHandoffKeepDryRunOnlyExample,
  explicitRegistryWriteAuthorizationHandoffReadyExample,
  explicitRegistryWriteAuthorizationHandoffRequestOwnerAuthorizationExample,
} from '../src/templates/examples';

describe('Explicit registry write authorization handoff', () => {
  it('hands ready gates to future controlled write execution design only', () => {
    const handoff = explicitRegistryWriteAuthorizationHandoffReadyExample;

    expect(handoff.status).toBe('explicit_authorization_handoff_ready');
    expect(handoff.nextAction).toBe(
      'ready_for_future_controlled_write_execution_design',
    );
    expect(handoff.readyForFutureControlledWriteExecutionDesign).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionPackage).toBe(true);
    expect(handoff.futureOwnerApprovalRequired).toBe(true);
  });

  it('maps warning gates to keep dry-run only', () => {
    expect(explicitRegistryWriteAuthorizationHandoffKeepDryRunOnlyExample.status).toBe(
      'explicit_authorization_handoff_ready_with_warnings',
    );
    expect(
      explicitRegistryWriteAuthorizationHandoffKeepDryRunOnlyExample.nextAction,
    ).toBe('keep_as_dry_run_only');
  });

  it('maps missing owner authorization to owner review', () => {
    expect(
      explicitRegistryWriteAuthorizationHandoffRequestOwnerAuthorizationExample
        .nextAction,
    ).toBe('request_owner_authorization');
  });

  it('blocks unsafe gates and never writes registry', () => {
    const handoff = explicitRegistryWriteAuthorizationHandoffBlockedExample;
    const json = JSON.stringify(handoff);

    expect(handoff.status).toBe('explicit_authorization_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_execute_write');
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('publishedToUserApp');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(JSON.parse(json)).toEqual(handoff);
  });
});
