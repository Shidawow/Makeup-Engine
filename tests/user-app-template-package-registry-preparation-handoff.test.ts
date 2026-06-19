import { describe, expect, it } from 'vitest';
import {
  userAppTemplatePackageRegistryPreparationHandoffBlockedExample,
  userAppTemplatePackageRegistryPreparationHandoffPersonalDataBlockedExample,
  userAppTemplatePackageRegistryPreparationHandoffPreviewOnlyExample,
  userAppTemplatePackageRegistryPreparationHandoffPrivacyReviewExample,
  userAppTemplatePackageRegistryPreparationHandoffReadyExample,
  userAppTemplatePackageRegistryPreparationHandoffShellBoundaryExample,
  userAppTemplatePackageRegistryPreparationHandoffShellReplacementBlockedExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackage registry preparation handoff', () => {
  it('hands a ready preparation to the future registry write gate without writing registry', () => {
    const handoff = userAppTemplatePackageRegistryPreparationHandoffReadyExample;

    expect(handoff.status).toBe('registry_preparation_handoff_ready');
    expect(handoff.nextAction).toBe('ready_for_registry_write_gate');
    expect(handoff.readyForFutureRegistryWriteGate).toBe(true);
    expect(handoff.registryPreparationOnly).toBe(true);
    expect(handoff.noActualRegistryWrite).toBe(true);
    expect(handoff.notPublished).toBe(true);
    expect(handoff.noUserAppShellPackageReplacement).toBe(true);
    expect(handoff.notProductionPackage).toBe(true);
  });

  it('keeps warnings as registry preview only', () => {
    expect(userAppTemplatePackageRegistryPreparationHandoffPreviewOnlyExample.status).toBe(
      'registry_preparation_handoff_ready_with_warnings',
    );
    expect(userAppTemplatePackageRegistryPreparationHandoffPreviewOnlyExample.nextAction).toBe(
      'keep_as_registry_preview_only',
    );
  });

  it('routes focused privacy and shell boundary issues to focused review actions', () => {
    expect(userAppTemplatePackageRegistryPreparationHandoffPrivacyReviewExample.nextAction).toBe(
      'request_privacy_review',
    );
    expect(userAppTemplatePackageRegistryPreparationHandoffShellBoundaryExample.nextAction).toBe(
      'request_user_app_shell_boundary_review',
    );
  });

  it('blocks actual writes and source-blocked unsafe examples', () => {
    expect(userAppTemplatePackageRegistryPreparationHandoffBlockedExample.status).toBe(
      'registry_preparation_handoff_blocked',
    );
    expect(userAppTemplatePackageRegistryPreparationHandoffBlockedExample.nextAction).toBe(
      'blocked_do_not_write_registry',
    );
    expect(
      userAppTemplatePackageRegistryPreparationHandoffPersonalDataBlockedExample.nextAction,
    ).toBe('blocked_do_not_write_registry');
    expect(
      userAppTemplatePackageRegistryPreparationHandoffShellReplacementBlockedExample.nextAction,
    ).toBe('blocked_do_not_write_registry');
  });

  it('is JSON round-trip stable and carries non-production notes', () => {
    const json = JSON.stringify(userAppTemplatePackageRegistryPreparationHandoffReadyExample);

    expect(JSON.parse(json)).toEqual(
      userAppTemplatePackageRegistryPreparationHandoffReadyExample,
    );
    expect(json).toContain('does not write a user app package registry');
    expect(json).toContain('does not publish to the user app');
    expect(json).toContain('does not replace the current User App Shell package');
  });
});
