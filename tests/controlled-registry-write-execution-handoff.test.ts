import { describe, expect, it } from 'vitest';
import {
  controlledRegistryWriteExecutionHandoffBlockedExample,
  controlledRegistryWriteExecutionHandoffKeepDesignOnlyExample,
  controlledRegistryWriteExecutionHandoffReadyExample,
  controlledRegistryWriteExecutionHandoffRequestAuditRevisionExample,
  controlledRegistryWriteExecutionHandoffRequestRollbackRevisionExample,
} from '../src/templates/examples';

describe('Controlled registry write execution handoff', () => {
  it('hands off a ready design to the future implementation gate only', () => {
    const handoff = controlledRegistryWriteExecutionHandoffReadyExample;

    expect(handoff.status).toBe('execution_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_real_write_implementation_gate');
    expect(handoff.readyForRealWriteImplementationGate).toBe(true);
    expect(handoff.executionDesignOnly).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.futureOwnerAuthorizationRequired).toBe(true);
  });

  it('keeps warning designs as design-only', () => {
    const handoff = controlledRegistryWriteExecutionHandoffKeepDesignOnlyExample;

    expect(handoff.status).toBe('execution_handoff_ready_with_warnings');
    expect(handoff.nextAction).toBe('keep_as_execution_design_only');
  });

  it('routes audit and rollback gaps to the right next actions', () => {
    expect(
      controlledRegistryWriteExecutionHandoffRequestAuditRevisionExample.nextAction,
    ).toBe('request_audit_plan_revision');
    expect(
      controlledRegistryWriteExecutionHandoffRequestRollbackRevisionExample.nextAction,
    ).toBe('request_rollback_design_revision');
  });

  it('blocks unsafe implementation handoff', () => {
    const handoff = controlledRegistryWriteExecutionHandoffBlockedExample;

    expect(handoff.status).toBe('execution_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_implement_real_write');
    expect(handoff.readyForRealWriteImplementationGate).toBe(false);
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(controlledRegistryWriteExecutionHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(
      controlledRegistryWriteExecutionHandoffReadyExample,
    );
  });
});
