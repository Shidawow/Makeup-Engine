import { describe, expect, it } from 'vitest';
import {
  realWriteApprovalHandoffBlockedExample,
  realWriteApprovalHandoffKeepBoundaryOnlyExample,
  realWriteApprovalHandoffReadyExample,
} from '../src/templates/examples';

describe('Real write approval handoff', () => {
  it('hands off only to a future actual write authorization request', () => {
    const handoff = realWriteApprovalHandoffReadyExample;

    expect(handoff.status).toBe('real_write_approval_handoff_ready');
    expect(handoff.nextAction).toBe(
      'ready_for_future_actual_write_authorization_request',
    );
    expect(handoff.readyForFutureActualWriteAuthorizationRequest).toBe(true);
    expect(handoff.approvalBoundaryOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.noRegistryMutation).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.doesNotCreateProductionWriter).toBe(true);
  });

  it('keeps warning handoffs boundary-only', () => {
    expect(realWriteApprovalHandoffKeepBoundaryOnlyExample.status).toBe(
      'real_write_approval_handoff_ready_with_warnings',
    );
    expect(realWriteApprovalHandoffKeepBoundaryOnlyExample.nextAction).toBe(
      'keep_as_approval_boundary_only',
    );
    expect(
      realWriteApprovalHandoffKeepBoundaryOnlyExample.readyForFutureActualWriteAuthorizationRequest,
    ).toBe(false);
  });

  it('blocks dangerous approval scopes', () => {
    expect(realWriteApprovalHandoffBlockedExample.status).toBe(
      'real_write_approval_handoff_blocked',
    );
    expect(realWriteApprovalHandoffBlockedExample.nextAction).toBe(
      'request_owner_authorization_for_actual_write',
    );
    expect(
      realWriteApprovalHandoffBlockedExample.readyForFutureActualWriteAuthorizationRequest,
    ).toBe(false);
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(realWriteApprovalHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteApprovalHandoffReadyExample);
    expect(realWriteApprovalHandoffReadyExample.jsonRoundTripStable).toBe(true);
  });
});
