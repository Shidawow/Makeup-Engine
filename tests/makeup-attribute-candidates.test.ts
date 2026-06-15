import { describe, expect, it } from 'vitest';
import { generateMakeupAttributeCandidates } from '../src/template-engine';
import {
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  phase10aExampleAnalysis,
} from '../src/templates/examples';

describe('makeup attribute candidates', () => {
  it('generates candidate-only makeup attributes from FaceMesh-ready analysis', () => {
    expect(makeupAttributeCandidatesReadyExample.status).toBe('candidates_ready');
    expect(makeupAttributeCandidatesReadyExample.candidates.length).toBeGreaterThanOrEqual(6);
    expect(makeupAttributeCandidatesReadyExample.candidates.every(
      (candidate) => candidate.reviewStatus === 'needs_human_review',
    )).toBe(true);
    expect(makeupAttributeCandidatesReadyExample.candidates.map((candidate) => candidate.kind)).toEqual(
      expect.arrayContaining(['lip_color_family', 'blush_placement', 'eye_definition']),
    );
  });

  it('blocks candidate generation when FaceMesh region QA is blocked', () => {
    const report = generateMakeupAttributeCandidates({
      analysis: phase10aExampleAnalysis,
      regionQa: faceMeshRegionQaBlockedExample,
    });

    expect(report.status).toBe('candidates_blocked');
    expect(report.candidates).toHaveLength(0);
    expect(report.issues.map((issue) => issue.severity)).toContain('blocking');
  });

  it('uses conservative warnings when pixel analysis is missing', () => {
    const report = generateMakeupAttributeCandidates({
      analysis: {
        ...phase10aExampleAnalysis,
        pixelAnalysis: undefined,
      },
      regionQa: faceMeshRegionQaReadyExample,
    });

    expect(report.status).toBe('candidates_ready_with_warnings');
    expect(report.issues.map((issue) => issue.id)).toContain('missing_pixel_analysis');
    expect(report.notes.join('\n')).toContain('rule-based');
  });
});
