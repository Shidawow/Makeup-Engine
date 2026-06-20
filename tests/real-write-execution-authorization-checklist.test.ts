import { describe, expect, it } from 'vitest';
import {
  realWriteExecutionAuthorizationOwnerText,
} from '../src/template-engine';
import {
  realWriteExecutionAuthorizationChecklistMissingOwnerScopeExample,
  realWriteExecutionAuthorizationChecklistOwnerActualWriteBlockedExample,
  realWriteExecutionAuthorizationChecklistReadyExample,
  realWriteExecutionAuthorizationChecklistWarningExample,
} from '../src/templates/examples';

describe('Real write execution authorization checklist', () => {
  it('preserves owner authorization scope text and does not trigger write', () => {
    const checklist = realWriteExecutionAuthorizationChecklistReadyExample;

    expect(checklist.status).toBe('execution_authorization_checklist_ready');
    expect(checklist.ownerAuthorizationEvidence.scope).toBe(
      'execution_authorization_phase_only',
    );
    expect(checklist.ownerAuthorizationEvidence.text).toBe(
      realWriteExecutionAuthorizationOwnerText,
    );
    expect(checklist.doesNotTriggerWrite).toBe(true);
    expect(checklist.doesNotCreateProductionWriter).toBe(true);
    expect(checklist.doesNotModifyRegistry).toBe(true);
    expect(checklist.noActualRegistryWrite).toBe(true);
    expect(checklist.notPublished).toBe(true);
    expect(checklist.noUserAppShellPackageReplacement).toBe(true);
    expect(checklist.requirements).toContain('confirm_owner_authorized_phase_10q_only');
  });

  it('carries warning source state without granting execution', () => {
    expect(realWriteExecutionAuthorizationChecklistWarningExample.status).toBe(
      'execution_authorization_checklist_ready_with_warnings',
    );
  });

  it('blocks unsafe owner actual-write scope', () => {
    const checklist =
      realWriteExecutionAuthorizationChecklistOwnerActualWriteBlockedExample;

    expect(checklist.status).toBe('execution_authorization_checklist_blocked');
    expect(checklist.ownerAuthorizationEvidence.ownerAuthorizedActualRegistryWrite).toBe(
      true,
    );
    expect(
      checklist.items.find(
        (item) =>
          item.id ===
          'confirm_owner_did_not_authorize_actual_registry_write',
      )?.status,
    ).toBe('blocked');
  });

  it('blocks missing required owner-scope checklist item', () => {
    const checklist = realWriteExecutionAuthorizationChecklistMissingOwnerScopeExample;

    expect(checklist.status).toBe('execution_authorization_checklist_blocked');
    expect(checklist.requirements).not.toContain(
      'confirm_owner_authorized_phase_10q_only',
    );
  });

  it('is JSON round-trip stable', () => {
    const json = JSON.stringify(realWriteExecutionAuthorizationChecklistReadyExample);

    expect(JSON.parse(json)).toEqual(
      realWriteExecutionAuthorizationChecklistReadyExample,
    );
    expect(json).toContain(realWriteExecutionAuthorizationOwnerText);
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('createProductionWriter');
  });
});
