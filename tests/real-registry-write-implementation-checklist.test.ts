import { describe, expect, it } from 'vitest';
import {
  createRealRegistryWriteImplementationChecklist,
} from '../src/template-engine';
import {
  realRegistryWriteImplementationChecklistBlockedExample,
  realRegistryWriteImplementationChecklistReadyExample,
  realRegistryWriteImplementationChecklistRequiresSeparateFutureApprovalExample,
  realRegistryWriteImplementationGateReadyExample,
} from '../src/templates/examples';

describe('Real registry write implementation checklist', () => {
  it('confirms all required gate-only implementation requirements', () => {
    const checklist = realRegistryWriteImplementationChecklistReadyExample;

    expect(checklist.status).toBe('implementation_checklist_ready');
    expect(checklist.items).toHaveLength(10);
    expect(checklist.items.every((item) => item.required && item.confirmed)).toBe(true);
    expect(checklist.checklistOnly).toBe(true);
    expect(checklist.dryRunOnly).toBe(true);
    expect(checklist.noActualRegistryWrite).toBe(true);
    expect(checklist.notPublished).toBe(true);
    expect(checklist.noUserAppShellPackageReplacement).toBe(true);
    expect(checklist.notProductionWriter).toBe(true);
  });

  it('requires separate future approval without triggering writes', () => {
    const checklist =
      realRegistryWriteImplementationChecklistRequiresSeparateFutureApprovalExample;

    expect(
      checklist.items.find(
        (item) =>
          item.id === 'confirm_future_real_implementation_needs_separate_approval',
      )?.confirmed,
    ).toBe(true);
    expect(checklist.futureExplicitApprovalRequired).toBe(true);
    expect(checklist.notes.join('\n')).toContain('does not trigger a registry write');
    expect(checklist.notes.join('\n')).toContain('does not generate a production writer');
    expect(checklist.notes.join('\n')).toContain('does not modify a registry');
  });

  it('blocks when required confirmations are missing', () => {
    const checklist = createRealRegistryWriteImplementationChecklist({
      gate: realRegistryWriteImplementationGateReadyExample,
      overrides: {
        confirmations: {
          confirm_no_actual_registry_write_in_this_phase: false,
        },
      },
    });

    expect(checklist.status).toBe('implementation_checklist_blocked');
    expect(
      checklist.items.find(
        (item) => item.id === 'confirm_no_actual_registry_write_in_this_phase',
      )?.confirmed,
    ).toBe(false);
  });

  it('keeps blocked gates blocked', () => {
    expect(realRegistryWriteImplementationChecklistBlockedExample.status).toBe(
      'implementation_checklist_blocked',
    );
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(realRegistryWriteImplementationChecklistReadyExample);

    expect(JSON.parse(json)).toEqual(
      realRegistryWriteImplementationChecklistReadyExample,
    );
  });
});
