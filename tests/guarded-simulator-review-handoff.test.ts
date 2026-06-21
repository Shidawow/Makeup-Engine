import { describe, expect, it } from 'vitest';
import {
  guardedSimulatorReviewHandoffBlockedExample,
  guardedSimulatorReviewHandoffKeepReviewOnlyExample,
  guardedSimulatorReviewHandoffReadyExample,
} from '../src/templates/examples';

describe('Guarded simulator review handoff', () => {
  it('hands ready gates to the future approval boundary only', () => {
    const handoff = guardedSimulatorReviewHandoffReadyExample;

    expect(handoff.status).toBe('simulator_review_handoff_ready');
    expect(handoff.nextAction).toBe(
      'ready_for_future_real_write_approval_boundary',
    );
    expect(handoff.readyForFutureRealWriteApprovalBoundary).toBe(true);
    expect(handoff.reviewGateOnly).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.noRegistryMutation).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionWriter).toBe(true);
    expect(handoff.futureActualWriteRequiresSeparateApproval).toBe(true);
  });

  it('keeps warning gates as simulator review only', () => {
    const handoff = guardedSimulatorReviewHandoffKeepReviewOnlyExample;

    expect(handoff.status).toBe('simulator_review_handoff_ready_with_warnings');
    expect(handoff.nextAction).toBe('keep_as_simulator_review_only');
    expect(handoff.readyForFutureRealWriteApprovalBoundary).toBe(false);
  });

  it('blocks unsafe gates and never authorizes real writes', () => {
    const handoff = guardedSimulatorReviewHandoffBlockedExample;

    expect(handoff.status).toBe('simulator_review_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_execute_real_write');
    expect(handoff.readyForFutureRealWriteApprovalBoundary).toBe(false);
    expect(handoff.notes.join('\n')).toContain('does not write');
    expect(handoff.notes.join('\n')).toContain('does not mutate');
    expect(handoff.notes.join('\n')).toContain('does not publish');
    expect(JSON.parse(JSON.stringify(handoff))).toEqual(handoff);
  });
});
