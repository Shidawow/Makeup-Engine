import { describe, expect, it } from 'vitest';
import {
  generateMakeupAttributeCandidates,
  generateMakeupTemplateDraft,
  generateRuleBasedStepSequence,
} from '../src/template-engine';
import {
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  phase10aExampleAnalysis,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('template draft generator', () => {
  it('creates a draft-only template that is blocked from publishing', () => {
    expect(makeupTemplateDraftReadyExample.status).toBe('draft_ready');
    expect(makeupTemplateDraftReadyExample.draft?.metadata.status).toBe('draft');
    expect(makeupTemplateDraftReadyExample.draft?.metadata.humanVerificationStatus).toBe(
      'ai_generated',
    );
    expect(makeupTemplateDraftReadyExample.humanReviewRequired).toBe(true);
    expect(makeupTemplateDraftReadyExample.publishBlocked).toBe(true);
    expect(makeupTemplateDraftReadyExample.draft?.notes?.join('\n')).toContain(
      'No backend',
    );
  });

  it('blocks draft generation when FaceMesh QA is blocked', () => {
    const candidates = generateMakeupAttributeCandidates({
      analysis: phase10aExampleAnalysis,
      regionQa: faceMeshRegionQaBlockedExample,
    });
    const steps = generateRuleBasedStepSequence(candidates);
    const draft = generateMakeupTemplateDraft({
      analysis: phase10aExampleAnalysis,
      regionQa: faceMeshRegionQaBlockedExample,
      attributeCandidates: candidates,
      stepSequence: steps,
    });

    expect(draft.status).toBe('draft_blocked');
    expect(draft.draft).toBeNull();
    expect(draft.issues.map((issue) => issue.severity)).toContain('blocking');
  });

  it('round-trips as JSON without user photo bytes or production export state', () => {
    const draft = generateMakeupTemplateDraft({
      analysis: phase10aExampleAnalysis,
      regionQa: faceMeshRegionQaReadyExample,
      attributeCandidates: makeupAttributeCandidatesReadyExample,
      stepSequence: ruleBasedStepSequenceReadyExample,
    });
    const raw = JSON.stringify(draft);

    expect(raw).toContain('phase-10a');
    expect(raw).toContain('human-review-required');
    expect(raw).not.toContain('data:image');
    expect(raw).not.toContain('object URL');
    expect(raw).not.toContain('appTemplateId');
    expect(raw).not.toContain('packageId');
  });
});
