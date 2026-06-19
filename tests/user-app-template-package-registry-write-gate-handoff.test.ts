import { describe, expect, it } from 'vitest';
import {
  userAppTemplatePackageRegistryWriteGateHandoffBlockedExample,
  userAppTemplatePackageRegistryWriteGateHandoffPreviewOnlyExample,
  userAppTemplatePackageRegistryWriteGateHandoffReadyExample,
  userAppTemplatePackageRegistryWriteGateHandoffShellBoundaryExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackage registry write gate handoff', () => {
  it('hands off ready gates to a future controlled writer without writing registry', () => {
    const handoff = userAppTemplatePackageRegistryWriteGateHandoffReadyExample;

    expect(handoff.status).toBe('registry_write_gate_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_future_controlled_registry_writer');
    expect(handoff.readyForFutureControlledRegistryWriter).toBe(true);
    expect(handoff.registryWriteGateOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionPackage).toBe(true);
    expect(handoff.notes.join('\n')).toContain('does not write');
    expect(handoff.notes.join('\n')).toContain('does not publish');
    expect(handoff.notes.join('\n')).toContain('does not replace');
  });

  it('keeps warning gates as preview-only', () => {
    const handoff = userAppTemplatePackageRegistryWriteGateHandoffPreviewOnlyExample;

    expect(handoff.status).toBe('registry_write_gate_handoff_ready_with_warnings');
    expect(handoff.nextAction).toBe('keep_as_registry_preview_only');
  });

  it('blocks unsafe gates and preserves shell-boundary review actions', () => {
    expect(userAppTemplatePackageRegistryWriteGateHandoffBlockedExample.status).toBe(
      'registry_write_gate_handoff_blocked',
    );
    expect(userAppTemplatePackageRegistryWriteGateHandoffBlockedExample.nextAction).toBe(
      'blocked_do_not_write_registry',
    );
    expect(userAppTemplatePackageRegistryWriteGateHandoffShellBoundaryExample.nextAction).toBe(
      'request_user_app_shell_boundary_review',
    );
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(userAppTemplatePackageRegistryWriteGateHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(userAppTemplatePackageRegistryWriteGateHandoffReadyExample);
  });
});
