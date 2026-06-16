import { describe, expect, it } from 'vitest';
import {
  createTemplateLibraryCandidateHandoff,
} from '../src/template-engine';
import {
  templateLibraryCandidateHandoffBlockedExample,
  templateLibraryCandidateHandoffCopyPolishExample,
  templateLibraryCandidateHandoffPrivacyReviewExample,
  templateLibraryCandidateHandoffReadyExample,
  templateLibraryCandidateHandoffRegionFixExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidateValidationReadyExample,
} from '../src/templates/examples';

describe('template library candidate handoff', () => {
  it('hands ready candidate package to candidate library review only', () => {
    expect(templateLibraryCandidateHandoffReadyExample.status).toBe(
      'candidate_handoff_ready',
    );
    expect(templateLibraryCandidateHandoffReadyExample.nextAction).toBe(
      'ready_for_candidate_library_review',
    );
    expect(templateLibraryCandidateHandoffReadyExample.packagingDecision).toBe(
      'handoff_to_candidate_library_review',
    );
    expect(templateLibraryCandidateHandoffReadyExample.notPublished).toBe(true);
    expect(templateLibraryCandidateHandoffReadyExample.formalTemplateLibraryWriteBlocked).toBe(true);
    expect(templateLibraryCandidateHandoffReadyExample.userAppTemplatePackageGenerationBlocked).toBe(true);
  });

  it('routes warnings to copy polish', () => {
    expect(templateLibraryCandidateHandoffCopyPolishExample.status).toBe(
      'candidate_handoff_ready_with_warnings',
    );
    expect(templateLibraryCandidateHandoffCopyPolishExample.nextAction).toBe(
      'request_copy_polish',
    );
  });

  it('routes QA blocked package to region fix', () => {
    expect(templateLibraryCandidateHandoffRegionFixExample.nextAction).toBe(
      'request_region_fix',
    );
  });

  it('routes raw image and privacy style risks to privacy review', () => {
    expect(templateLibraryCandidateHandoffPrivacyReviewExample.nextAction).toBe(
      'request_privacy_review',
    );
  });

  it('blocks packages missing review approval', () => {
    expect(templateLibraryCandidateHandoffBlockedExample.status).toBe(
      'candidate_handoff_blocked',
    );
    expect(templateLibraryCandidateHandoffBlockedExample.packagingDecision).toBe(
      'block_candidate_package',
    );
  });

  it('keeps handoff JSON round-trip stable', () => {
    const handoff = createTemplateLibraryCandidateHandoff({
      candidatePackage: templateLibraryCandidatePackageReadyExample,
      validation: templateLibraryCandidateValidationReadyExample,
    });

    expect(JSON.parse(JSON.stringify(handoff))).toEqual(handoff);
    expect(handoff.notes.join('\n')).toContain('does not generate UserAppTemplatePackage');
  });
});
