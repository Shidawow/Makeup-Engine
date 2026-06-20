import { describe, expect, it } from 'vitest';
import {
  realRegistryWriteImplementationHandoffBlockedExample,
  realRegistryWriteImplementationHandoffKeepExecutionDesignOnlyExample,
  realRegistryWriteImplementationHandoffReadyExample,
} from '../src/templates/examples';

describe('Real registry write implementation handoff', () => {
  it('hands off only to a future real write implementation draft', () => {
    const handoff = realRegistryWriteImplementationHandoffReadyExample;

    expect(handoff.status).toBe('real_write_implementation_handoff_ready');
    expect(handoff.nextAction).toBe(
      'ready_for_future_real_write_implementation_draft',
    );
    expect(handoff.readyForFutureRealWriteImplementationDraft).toBe(true);
    expect(handoff.gateOnly).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionWriter).toBe(true);
    expect(handoff.notes.join('\n')).toContain(
      'does not write a UserAppTemplatePackage registry',
    );
    expect(handoff.notes.join('\n')).toContain(
      'Phase 10O or a later real write implementation draft only',
    );
  });

  it('keeps warnings as execution design only', () => {
    const handoff = realRegistryWriteImplementationHandoffKeepExecutionDesignOnlyExample;

    expect(handoff.status).toBe(
      'real_write_implementation_handoff_ready_with_warnings',
    );
    expect(handoff.nextAction).toBe('keep_as_execution_design_only');
  });

  it('blocks unsafe implementation handoff', () => {
    const handoff = realRegistryWriteImplementationHandoffBlockedExample;

    expect(handoff.status).toBe('real_write_implementation_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_implement_real_write');
    expect(handoff.readyForFutureRealWriteImplementationDraft).toBe(false);
  });

  it('is JSON round-trip stable and never claims a registry write', () => {
    const json = JSON.stringify(realRegistryWriteImplementationHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(
      realRegistryWriteImplementationHandoffReadyExample,
    );
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('publishedToUserApp');
    expect(json).not.toContain('replaceUserAppShellPackage');
  });
});
