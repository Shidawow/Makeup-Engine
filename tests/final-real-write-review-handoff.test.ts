import { describe, expect, it } from 'vitest';
import {
  finalRealWriteReviewHandoffBlockedExample,
  finalRealWriteReviewHandoffKeepFinalReviewOnlyExample,
  finalRealWriteReviewHandoffOwnerClarificationExample,
  finalRealWriteReviewHandoffReadyExample,
} from '../src/templates/examples';

describe('Final real write review handoff', () => {
  it('hands off ready gates only to future real write execution authorization', () => {
    const handoff = finalRealWriteReviewHandoffReadyExample;

    expect(handoff.status).toBe('final_real_write_review_handoff_ready');
    expect(handoff.nextAction).toBe(
      'ready_for_future_real_write_execution_authorization',
    );
    expect(handoff.readyForFutureRealWriteExecutionAuthorization).toBe(true);
    expect(handoff.finalReviewGateOnly).toBe(true);
    expect(handoff.notActualWriteAuthorization).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionWriter).toBe(true);
  });

  it('keeps warning gates as final review only', () => {
    const handoff = finalRealWriteReviewHandoffKeepFinalReviewOnlyExample;

    expect(handoff.status).toBe(
      'final_real_write_review_handoff_ready_with_warnings',
    );
    expect(handoff.nextAction).toBe('keep_as_final_review_only');
    expect(handoff.readyForFutureRealWriteExecutionAuthorization).toBe(false);
  });

  it('requests owner authorization clarification for unsafe owner scope', () => {
    const handoff = finalRealWriteReviewHandoffOwnerClarificationExample;

    expect(handoff.status).toBe('final_real_write_review_handoff_blocked');
    expect(handoff.nextAction).toBe(
      'request_owner_authorization_clarification',
    );
    expect(handoff.readyForFutureRealWriteExecutionAuthorization).toBe(false);
  });

  it('blocks actual write execution when final review is unsafe', () => {
    const handoff = finalRealWriteReviewHandoffBlockedExample;

    expect(handoff.status).toBe('final_real_write_review_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_execute_real_write');
  });

  it('is JSON round-trip stable and does not claim execution', () => {
    const json = JSON.stringify(finalRealWriteReviewHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(finalRealWriteReviewHandoffReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionWriterReady');
    expect(json).not.toContain('replaceUserAppShellPackage');
  });
});
