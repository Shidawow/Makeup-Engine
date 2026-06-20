import { describe, expect, it } from 'vitest';
import {
  realWriteExecutionAuthorizationHandoffBlockedExample,
  realWriteExecutionAuthorizationHandoffKeepModelOnlyExample,
  realWriteExecutionAuthorizationHandoffOwnerClarificationExample,
  realWriteExecutionAuthorizationHandoffReadyExample,
} from '../src/templates/examples';

describe('Real write execution authorization handoff', () => {
  it('recommends a future real write execution plan only when ready', () => {
    const handoff = realWriteExecutionAuthorizationHandoffReadyExample;

    expect(handoff.status).toBe('execution_authorization_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_future_real_write_execution_plan');
    expect(handoff.readyForFutureRealWriteExecutionPlan).toBe(true);
    expect(handoff.authorizationModelOnly).toBe(true);
    expect(handoff.notActualWriteAuthorization).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.doesNotCreateProductionWriter).toBe(true);
    expect(handoff.notes.join('\n')).toContain('Phase 10R');
  });

  it('keeps warning inputs as authorization model only', () => {
    const handoff = realWriteExecutionAuthorizationHandoffKeepModelOnlyExample;

    expect(handoff.status).toBe(
      'execution_authorization_handoff_ready_with_warnings',
    );
    expect(handoff.nextAction).toBe('keep_as_authorization_model_only');
    expect(handoff.readyForFutureRealWriteExecutionPlan).toBe(false);
  });

  it('requests owner clarification for unsafe scope', () => {
    const handoff = realWriteExecutionAuthorizationHandoffOwnerClarificationExample;

    expect(handoff.status).toBe('execution_authorization_handoff_blocked');
    expect(handoff.nextAction).toBe('request_authorization_scope_clarification');
  });

  it('blocks actual-write markers', () => {
    const handoff = realWriteExecutionAuthorizationHandoffBlockedExample;

    expect(handoff.status).toBe('execution_authorization_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_execute_real_write');
  });

  it('is JSON round-trip stable and never executes registry write', () => {
    const json = JSON.stringify(realWriteExecutionAuthorizationHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteExecutionAuthorizationHandoffReadyExample);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('createProductionWriter');
    expect(json).not.toContain('publishToUserApp');
  });
});
