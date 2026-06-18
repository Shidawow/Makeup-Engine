import { describe, expect, it } from 'vitest';
import { createOfficialUserAppPackageDraftGateHandoff } from '../src/template-engine';
import {
  officialUserAppPackageDraftGateHandoffCopyRevisionExample,
  officialUserAppPackageDraftGateHandoffPrivacyReviewExample,
  officialUserAppPackageDraftGateHandoffReadyExample,
  officialUserAppPackageDraftGateHandoffStepRevisionExample,
  officialUserAppPackageDraftGateReadyExample,
} from '../src/templates/examples';

describe('official user app package draft gate handoff', () => {
  it('hands ready gate to the future official draft builder only', () => {
    expect(officialUserAppPackageDraftGateHandoffReadyExample.status).toBe(
      'official_draft_gate_handoff_ready',
    );
    expect(officialUserAppPackageDraftGateHandoffReadyExample.nextAction).toBe(
      'ready_for_official_user_app_package_draft_builder',
    );
    expect(officialUserAppPackageDraftGateHandoffReadyExample.notFormalUserAppTemplatePackage).toBe(true);
    expect(officialUserAppPackageDraftGateHandoffReadyExample.noUserAppPackageRegistryWrite).toBe(true);
    expect(officialUserAppPackageDraftGateHandoffReadyExample.notPublished).toBe(true);
  });

  it('routes warnings, step blockers, and privacy blockers to the right next action', () => {
    expect(officialUserAppPackageDraftGateHandoffCopyRevisionExample.nextAction).toBe(
      'request_user_facing_copy_revision',
    );
    expect(officialUserAppPackageDraftGateHandoffStepRevisionExample.nextAction).toBe(
      'request_step_guidance_revision',
    );
    expect(officialUserAppPackageDraftGateHandoffPrivacyReviewExample.nextAction).toBe(
      'request_privacy_review',
    );
  });

  it('keeps handoff JSON round-trip stable without creating a formal package', () => {
    const handoff = createOfficialUserAppPackageDraftGateHandoff({
      gate: officialUserAppPackageDraftGateReadyExample,
    });
    const notes = handoff.notes.join('\n');

    expect(JSON.parse(JSON.stringify(handoff))).toEqual(handoff);
    expect(notes).toContain('does not generate a formal UserAppTemplatePackage');
    expect(notes).toContain('does not write a user app package registry');
    expect(notes).toContain('does not publish to the user app');
  });
});
