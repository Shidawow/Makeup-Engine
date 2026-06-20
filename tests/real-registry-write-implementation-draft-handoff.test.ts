import { describe, expect, it } from 'vitest';
import {
  realRegistryWriteImplementationDraftHandoffBlockedExample,
  realRegistryWriteImplementationDraftHandoffKeepDraftOnlyExample,
  realRegistryWriteImplementationDraftHandoffReadyExample,
} from '../src/templates/examples';

describe('Real registry write implementation draft handoff', () => {
  it('hands off ready drafts to the future final real write review gate only', () => {
    const handoff = realRegistryWriteImplementationDraftHandoffReadyExample;

    expect(handoff.status).toBe('implementation_draft_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_final_real_write_review_gate');
    expect(handoff.readyForFinalRealWriteReviewGate).toBe(true);
    expect(handoff.implementationDraftOnly).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionWriter).toBe(true);
    expect(handoff.notProductionPackage).toBe(true);
    expect(handoff.notes.join('\n')).toContain('does not create a production writer');
    expect(handoff.notes.join('\n')).toContain('Phase 10P');
  });

  it('keeps warning drafts as implementation draft only', () => {
    const handoff = realRegistryWriteImplementationDraftHandoffKeepDraftOnlyExample;

    expect(handoff.status).toBe('implementation_draft_handoff_ready_with_warnings');
    expect(handoff.nextAction).toBe('keep_as_implementation_draft_only');
    expect(handoff.readyForFinalRealWriteReviewGate).toBe(true);
  });

  it('blocks unsafe drafts from production writer creation', () => {
    const handoff = realRegistryWriteImplementationDraftHandoffBlockedExample;

    expect(handoff.status).toBe('implementation_draft_handoff_blocked');
    expect(handoff.nextAction).toBe('blocked_do_not_create_production_writer');
    expect(handoff.readyForFinalRealWriteReviewGate).toBe(false);
  });

  it('is JSON round-trip stable and never implies write execution', () => {
    const json = JSON.stringify(realRegistryWriteImplementationDraftHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(
      realRegistryWriteImplementationDraftHandoffReadyExample,
    );
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('productionPackageId');
    expect(json).not.toContain('replaceUserAppShellPackage');
  });
});
