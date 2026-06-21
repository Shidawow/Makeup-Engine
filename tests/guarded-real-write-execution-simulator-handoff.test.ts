import { describe, expect, it } from 'vitest';
import {
  guardedRealWriteExecutionSimulatorHandoffBlockedExample,
  guardedRealWriteExecutionSimulatorHandoffKeepSimulatorOnlyExample,
  guardedRealWriteExecutionSimulatorHandoffReadyExample,
} from '../src/templates/examples';

describe('Guarded real write execution simulator handoff', () => {
  it('hands ready simulations to future simulator review gate only', () => {
    const handoff = guardedRealWriteExecutionSimulatorHandoffReadyExample;

    expect(handoff.status).toBe('simulation_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_future_simulator_review_gate');
    expect(handoff.readyForFutureSimulatorReviewGate).toBe(true);
    expect(handoff.simulatorOnly).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.noRegistryMutation).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionWriter).toBe(true);
    expect(handoff.doesNotCreateProductionWriter).toBe(true);
    expect(handoff.notes.join('\n')).toContain(
      'does not write a UserAppTemplatePackage registry',
    );
    expect(handoff.notes.join('\n')).toContain('does not mutate registry state');
    expect(handoff.notes.join('\n')).toContain('does not publish');
    expect(handoff.notes.join('\n')).toContain(
      'does not replace the current User App Shell package',
    );
    expect(handoff.notes.join('\n')).toContain(
      'does not create a production writer',
    );
    expect(handoff.notes.join('\n')).toContain('dry-run-only simulation');
  });

  it('keeps warning simulations as simulator only', () => {
    const handoff = guardedRealWriteExecutionSimulatorHandoffKeepSimulatorOnlyExample;

    expect(handoff.status).toBe('simulation_handoff_ready_with_warnings');
    expect(handoff.nextAction).toBe('keep_as_simulator_only');
    expect(handoff.readyForFutureSimulatorReviewGate).toBe(false);
  });

  it('blocks missing source plan validation handoff', () => {
    const handoff = guardedRealWriteExecutionSimulatorHandoffBlockedExample;

    expect(handoff.status).toBe('simulation_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_execute_real_write');
    expect(handoff.readyForFutureSimulatorReviewGate).toBe(false);
  });

  it('is JSON round-trip stable and has no real execution marker', () => {
    const json = JSON.stringify(guardedRealWriteExecutionSimulatorHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(
      guardedRealWriteExecutionSimulatorHandoffReadyExample,
    );
    expect(
      guardedRealWriteExecutionSimulatorHandoffReadyExample.jsonRoundTripStable,
    ).toBe(true);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('registry_mutation_executed');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
    expect(json).not.toContain('createProductionWriter');
  });
});
