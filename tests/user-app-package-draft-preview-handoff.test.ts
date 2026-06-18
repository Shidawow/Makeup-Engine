import { describe, expect, it } from 'vitest';
import { createUserAppPackageDraftPreviewHandoff } from '../src/template-engine';
import {
  userAppPackageDraftPreviewHandoffBlockedExample,
  userAppPackageDraftPreviewHandoffCopyRevisionExample,
  userAppPackageDraftPreviewHandoffReadyExample,
  userAppPackageDraftPreviewHandoffStepRevisionExample,
  userAppPackageDraftPreviewReadyExample,
  userAppPackageDraftPreviewValidationReadyExample,
} from '../src/templates/examples';

describe('user app package draft preview handoff', () => {
  it('hands ready preview to the official draft gate only', () => {
    expect(userAppPackageDraftPreviewHandoffReadyExample.status).toBe(
      'draft_preview_handoff_ready',
    );
    expect(userAppPackageDraftPreviewHandoffReadyExample.decision).toBe(
      'handoff_to_official_user_app_package_draft_gate',
    );
    expect(userAppPackageDraftPreviewHandoffReadyExample.nextAction).toBe(
      'ready_for_official_user_app_package_draft',
    );
    expect(userAppPackageDraftPreviewHandoffReadyExample.notFormalUserAppTemplatePackage).toBe(true);
    expect(userAppPackageDraftPreviewHandoffReadyExample.noUserAppPackageRegistryWrite).toBe(true);
    expect(userAppPackageDraftPreviewHandoffReadyExample.notPublished).toBe(true);
  });

  it('requests copy revision for warning previews', () => {
    expect(userAppPackageDraftPreviewHandoffCopyRevisionExample.status).toBe(
      'draft_preview_handoff_ready_with_warnings',
    );
    expect(userAppPackageDraftPreviewHandoffCopyRevisionExample.nextAction).toBe(
      'request_user_facing_copy_revision',
    );
  });

  it('routes missing step guidance to step revision', () => {
    expect(userAppPackageDraftPreviewHandoffStepRevisionExample.status).toBe(
      'draft_preview_handoff_blocked',
    );
    expect(userAppPackageDraftPreviewHandoffStepRevisionExample.nextAction).toBe(
      'request_step_guidance_revision',
    );
  });

  it('blocks unsafe previews and does not create an app package', () => {
    expect(userAppPackageDraftPreviewHandoffBlockedExample.status).toBe(
      'draft_preview_handoff_blocked',
    );
    expect(userAppPackageDraftPreviewHandoffBlockedExample.decision).toBe(
      'block_app_package_creation',
    );
    expect(userAppPackageDraftPreviewHandoffBlockedExample.nextAction).not.toBe(
      'ready_for_official_user_app_package_draft',
    );
  });

  it('keeps handoff JSON round-trip stable and preview-only', () => {
    const handoff = createUserAppPackageDraftPreviewHandoff({
      preview: userAppPackageDraftPreviewReadyExample,
      validation: userAppPackageDraftPreviewValidationReadyExample,
    });

    expect(handoff.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(handoff))).toEqual(handoff);
    expect(handoff.notes.join('\n')).toContain('does not generate a formal UserAppTemplatePackage');
    expect(handoff.notes.join('\n')).toContain('does not write a user app package registry');
    expect(handoff.notes.join('\n')).not.toContain('published to user app');
  });
});
