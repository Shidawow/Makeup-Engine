import { describe, expect, it } from 'vitest';
import {
  controlledRegistryWriterHandoffBlockedExample,
  controlledRegistryWriterHandoffDoNotAuthorizeExample,
  controlledRegistryWriterHandoffDryRunOnlyExample,
  controlledRegistryWriterHandoffReadyExample,
  controlledRegistryWriterHandoffShellBoundaryExample,
} from '../src/templates/examples';

describe('Controlled UserAppTemplatePackage registry writer handoff', () => {
  it('hands off ready dry-run writer drafts to a future explicit authorization gate', () => {
    const handoff = controlledRegistryWriterHandoffReadyExample;

    expect(handoff.status).toBe('controlled_writer_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_explicit_write_authorization_gate');
    expect(handoff.readyForExplicitWriteAuthorizationGate).toBe(true);
    expect(handoff.dryRunOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionPackage).toBe(true);
    expect(handoff.notes.join('\n')).toContain('does not write');
    expect(handoff.notes.join('\n')).toContain('does not publish');
    expect(handoff.notes.join('\n')).toContain('does not replace');
  });

  it('keeps warning writer drafts dry-run only', () => {
    const handoff = controlledRegistryWriterHandoffDryRunOnlyExample;

    expect(handoff.status).toBe('controlled_writer_handoff_ready_with_warnings');
    expect(handoff.nextAction).toBe('keep_as_dry_run_only');
  });

  it('blocks unsafe authorization and preserves shell-boundary review actions', () => {
    expect(controlledRegistryWriterHandoffBlockedExample.status).toBe(
      'controlled_writer_handoff_blocked',
    );
    expect(controlledRegistryWriterHandoffBlockedExample.nextAction).toBe(
      'blocked_do_not_authorize_write',
    );
    expect(controlledRegistryWriterHandoffDoNotAuthorizeExample.nextAction).toBe(
      'blocked_do_not_authorize_write',
    );
    expect(controlledRegistryWriterHandoffShellBoundaryExample.nextAction).toBe(
      'request_user_app_shell_boundary_review',
    );
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(controlledRegistryWriterHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(controlledRegistryWriterHandoffReadyExample);
  });
});
