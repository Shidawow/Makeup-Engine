import { describe, expect, it } from 'vitest';
import {
  userAppTemplatePackageDraftPublishGateHandoffBlockedExample,
  userAppTemplatePackageDraftPublishGateHandoffKeepDraftOnlyExample,
  userAppTemplatePackageDraftPublishGateHandoffReadyExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackage draft publish gate handoff', () => {
  it('routes a ready gate to future registry preparation only', () => {
    const handoff = userAppTemplatePackageDraftPublishGateHandoffReadyExample;

    expect(handoff.status).toBe('draft_publish_gate_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_future_registry_preparation');
    expect(handoff.gateDecision).toBe('eligible_for_future_registry_preparation');
    expect(handoff.draftOnly).toBe(true);
    expect(handoff.publishBlocked).toBe(true);
    expect(handoff.noUserAppPackageRegistryWrite).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.registryPreparationOnly).toBe(true);
  });

  it('keeps warning gates as draft-only when immediate registry preparation is not clean', () => {
    expect(userAppTemplatePackageDraftPublishGateHandoffKeepDraftOnlyExample.status).toBe(
      'draft_publish_gate_handoff_ready_with_warnings',
    );
    expect(userAppTemplatePackageDraftPublishGateHandoffKeepDraftOnlyExample.nextAction).toBe(
      'keep_as_draft_only',
    );
  });

  it('blocks registry preparation when the source validation is missing', () => {
    expect(userAppTemplatePackageDraftPublishGateHandoffBlockedExample.status).toBe(
      'draft_publish_gate_handoff_blocked',
    );
    expect(userAppTemplatePackageDraftPublishGateHandoffBlockedExample.nextAction).toBe(
      'blocked_do_not_prepare_registry',
    );
  });

  it('is JSON round-trip stable and contains non-publish notes', () => {
    const json = JSON.stringify(userAppTemplatePackageDraftPublishGateHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(userAppTemplatePackageDraftPublishGateHandoffReadyExample);
    expect(userAppTemplatePackageDraftPublishGateHandoffReadyExample.notes.join('\n')).toContain(
      'does not publish',
    );
    expect(userAppTemplatePackageDraftPublishGateHandoffReadyExample.notes.join('\n')).toContain(
      'does not write a user app package registry',
    );
  });
});
