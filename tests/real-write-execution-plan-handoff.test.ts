import { describe, expect, it } from 'vitest';
import {
  realWriteExecutionPlanHandoffBlockedExample,
  realWriteExecutionPlanHandoffKeepPlanOnlyExample,
  realWriteExecutionPlanHandoffReadyExample,
} from '../src/templates/examples';

describe('Real write execution plan handoff', () => {
  it('hands ready plans to future guarded execution simulator only', () => {
    const handoff = realWriteExecutionPlanHandoffReadyExample;

    expect(handoff.status).toBe('execution_plan_handoff_ready');
    expect(handoff.nextAction).toBe(
      'ready_for_future_guarded_execution_simulator',
    );
    expect(handoff.readyForFutureGuardedExecutionSimulator).toBe(true);
    expect(handoff.executionPlanOnly).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionWriter).toBe(true);
    expect(handoff.doesNotCreateProductionWriter).toBe(true);
    expect(handoff.notes.join('\n')).toContain(
      'does not write a UserAppTemplatePackage registry',
    );
    expect(handoff.notes.join('\n')).toContain('does not publish');
    expect(handoff.notes.join('\n')).toContain(
      'does not replace the current User App Shell package',
    );
    expect(handoff.notes.join('\n')).toContain(
      'does not create a production writer',
    );
  });

  it('keeps warning plans as execution plan only', () => {
    const handoff = realWriteExecutionPlanHandoffKeepPlanOnlyExample;

    expect(handoff.status).toBe('execution_plan_handoff_ready_with_warnings');
    expect(handoff.nextAction).toBe('keep_as_execution_plan_only');
    expect(handoff.readyForFutureGuardedExecutionSimulator).toBe(false);
  });

  it('blocks missing execution authorization handoff', () => {
    const handoff = realWriteExecutionPlanHandoffBlockedExample;

    expect(handoff.status).toBe('execution_plan_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_execute_real_write');
    expect(handoff.readyForFutureGuardedExecutionSimulator).toBe(false);
  });

  it('is JSON round-trip stable and has no execution marker', () => {
    const json = JSON.stringify(realWriteExecutionPlanHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(realWriteExecutionPlanHandoffReadyExample);
    expect(realWriteExecutionPlanHandoffReadyExample.jsonRoundTripStable).toBe(true);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('createProductionWriter');
  });
});
