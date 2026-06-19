import { describe, expect, it } from 'vitest';
import {
  officialUserAppTemplatePackageDraftHandoffKeepDraftOnlyExample,
  officialUserAppTemplatePackageDraftHandoffPrivacyRevisionExample,
  officialUserAppTemplatePackageDraftHandoffReadyExample,
  officialUserAppTemplatePackageDraftHandoffStepRevisionExample,
} from '../src/templates/examples';

describe('official UserAppTemplatePackage draft handoff', () => {
  it('routes ready draft validation to a future draft publish gate only', () => {
    const handoff = officialUserAppTemplatePackageDraftHandoffReadyExample;

    expect(handoff.status).toBe('official_draft_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_draft_publish_gate');
    expect(handoff.decision).toBe('send_to_phase_10h_draft_publish_gate');
    expect(handoff.draftOnly).toBe(true);
    expect(handoff.publishBlocked).toBe(true);
    expect(handoff.noUserAppPackageRegistryWrite).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notPublished).toBe(true);
  });

  it('keeps warning drafts as local draft-only until revised', () => {
    expect(officialUserAppTemplatePackageDraftHandoffKeepDraftOnlyExample.status).toBe(
      'official_draft_handoff_ready_with_warnings',
    );
    expect(officialUserAppTemplatePackageDraftHandoffKeepDraftOnlyExample.nextAction).toBe(
      'keep_as_draft_only',
    );
  });

  it('routes blocked drafts to focused revisions', () => {
    expect(officialUserAppTemplatePackageDraftHandoffStepRevisionExample.nextAction).toBe(
      'request_step_guidance_revision',
    );
    expect(officialUserAppTemplatePackageDraftHandoffPrivacyRevisionExample.nextAction).toBe(
      'request_privacy_notice_revision',
    );
  });

  it('is JSON round-trip stable', () => {
    expect(JSON.parse(JSON.stringify(officialUserAppTemplatePackageDraftHandoffReadyExample))).toEqual(
      officialUserAppTemplatePackageDraftHandoffReadyExample,
    );
  });
});
