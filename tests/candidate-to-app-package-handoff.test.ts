import { describe, expect, it } from 'vitest';
import { createCandidateToAppPackageHandoff } from '../src/template-engine';
import {
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageHandoffBlockedExample,
  candidateToAppPackageHandoffCopyPolishExample,
  candidateToAppPackageHandoffPrivacyReviewExample,
  candidateToAppPackageHandoffReadyExample,
  candidateToAppPackageHandoffRegionRevisionExample,
  candidateToAppPackageValidationReadyExample,
} from '../src/templates/examples';

describe('candidate-to-app package handoff', () => {
  it('hands ready preparation to user app package draft preview only', () => {
    expect(candidateToAppPackageHandoffReadyExample.status).toBe(
      'candidate_to_app_handoff_ready',
    );
    expect(candidateToAppPackageHandoffReadyExample.nextAction).toBe(
      'ready_for_user_app_package_draft',
    );
    expect(candidateToAppPackageHandoffReadyExample.decision).toBe(
      'handoff_to_user_app_package_draft_preview',
    );
    expect(candidateToAppPackageHandoffReadyExample.mappingPreviewOnly).toBe(true);
    expect(candidateToAppPackageHandoffReadyExample.notPublished).toBe(true);
    expect(candidateToAppPackageHandoffReadyExample.formalUserAppTemplatePackageGenerationBlocked).toBe(true);
  });

  it('routes warnings to copy polish', () => {
    expect(candidateToAppPackageHandoffCopyPolishExample.status).toBe(
      'candidate_to_app_handoff_ready_with_warnings',
    );
    expect(candidateToAppPackageHandoffCopyPolishExample.nextAction).toBe(
      'request_candidate_copy_polish',
    );
  });

  it('routes privacy and raw image blockers to privacy review', () => {
    expect(candidateToAppPackageHandoffPrivacyReviewExample.nextAction).toBe(
      'request_privacy_review',
    );
  });

  it('routes missing region guidance to region guidance revision', () => {
    expect(candidateToAppPackageHandoffRegionRevisionExample.nextAction).toBe(
      'request_region_guidance_revision',
    );
  });

  it('blocks missing approved candidate preparation', () => {
    expect(candidateToAppPackageHandoffBlockedExample.status).toBe(
      'candidate_to_app_handoff_blocked',
    );
    expect(candidateToAppPackageHandoffBlockedExample.decision).toBe(
      'block_app_package_preparation',
    );
  });

  it('keeps handoff JSON round-trip stable and does not generate UserAppTemplatePackage', () => {
    const handoff = createCandidateToAppPackageHandoff({
      preparation: candidateToAppPackageContractReadyExample,
      validation: candidateToAppPackageValidationReadyExample,
    });

    expect(JSON.parse(JSON.stringify(handoff))).toEqual(handoff);
    expect(handoff.notes.join('\n')).toContain('does not generate UserAppTemplatePackage');
    expect(handoff.notes.join('\n')).not.toContain('published to user app');
  });
});
