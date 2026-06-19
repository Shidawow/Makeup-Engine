import { describe, expect, it } from 'vitest';
import {
  explicitRegistryWriteAuthorizationChecklistBlockedExample,
  explicitRegistryWriteAuthorizationChecklistMissingFutureApprovalExample,
  explicitRegistryWriteAuthorizationChecklistMissingOwnerRequirementExample,
  explicitRegistryWriteAuthorizationChecklistMissingReviewerAckExample,
  explicitRegistryWriteAuthorizationChecklistReadyExample,
  explicitRegistryWriteAuthorizationChecklistWarningExample,
} from '../src/templates/examples';

describe('Explicit registry write authorization checklist', () => {
  it('requires owner confirmation items without triggering a write', () => {
    const checklist = explicitRegistryWriteAuthorizationChecklistReadyExample;

    expect(checklist.status).toBe('authorization_checklist_ready');
    expect(checklist.items).toHaveLength(9);
    expect(checklist.reviewerAckRequired).toBe(true);
    expect(checklist.ownerAuthorizationRequired).toBe(true);
    expect(checklist.futureApprovalRequired).toBe(true);
    expect(checklist.doesNotTriggerWrite).toBe(true);
    expect(checklist.noActualRegistryWrite).toBe(true);
    expect(checklist.notPublished).toBe(true);
    expect(checklist.noUserAppShellPackageReplacement).toBe(true);
    expect(checklist.noSensitiveUserData).toBe(true);
    expect(checklist.requirements).toEqual(
      expect.arrayContaining([
        'owner_confirms_candidate_package',
        'owner_confirms_registry_entry_preview',
        'owner_confirms_diff_preview',
        'owner_confirms_rollback_plan',
        'owner_confirms_privacy_boundary',
        'owner_confirms_no_raw_image_or_personal_data',
        'owner_confirms_no_publish_in_this_phase',
        'owner_confirms_no_user_app_shell_package_replacement',
        'owner_confirms_future_write_requires_separate_explicit_approval',
      ]),
    );
  });

  it('keeps warning writer validation in checklist review state', () => {
    expect(explicitRegistryWriteAuthorizationChecklistWarningExample.status).toBe(
      'authorization_checklist_ready_with_warnings',
    );
  });

  it('blocks missing acknowledgement or future owner approval requirements', () => {
    expect(
      explicitRegistryWriteAuthorizationChecklistMissingOwnerRequirementExample.status,
    ).toBe('authorization_checklist_blocked');
    expect(
      explicitRegistryWriteAuthorizationChecklistMissingReviewerAckExample.status,
    ).toBe('authorization_checklist_blocked');
    expect(
      explicitRegistryWriteAuthorizationChecklistMissingFutureApprovalExample.status,
    ).toBe('authorization_checklist_blocked');
  });

  it('blocks when source writer validation is blocked', () => {
    expect(explicitRegistryWriteAuthorizationChecklistBlockedExample.status).toBe(
      'authorization_checklist_blocked',
    );
  });

  it('is JSON round-trip stable and contains no write execution marker', () => {
    const json = JSON.stringify(explicitRegistryWriteAuthorizationChecklistReadyExample);

    expect(JSON.parse(json)).toEqual(
      explicitRegistryWriteAuthorizationChecklistReadyExample,
    );
    expect(json).not.toContain('registryWriteExecuted');
    expect(json).not.toContain('actualRegistryWrite');
    expect(json).not.toContain('replaceUserAppShellPackage');
  });
});
