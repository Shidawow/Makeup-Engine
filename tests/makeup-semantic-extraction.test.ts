import { describe, expect, it } from 'vitest';
import { createMakeupSemanticExtractionReport } from '../src/vision';
import {
  faceMeshRegionQaBlockedExample,
  makeupSemanticExtractionBlockedExample,
  makeupSemanticExtractionReadyAnalysis,
  makeupSemanticExtractionReadyExample,
} from '../src/templates/examples';

describe('makeup semantic extraction baseline', () => {
  it('creates stable candidate-only semantic extraction reports', () => {
    expect(makeupSemanticExtractionReadyExample.status).toBe('semantic_extraction_ready');
    expect(makeupSemanticExtractionReadyExample.allOutputsAreCandidates).toBe(true);
    expect(makeupSemanticExtractionReadyExample.allCandidatesRequireHumanReview).toBe(true);
    expect(makeupSemanticExtractionReadyExample.noFinalClaims).toBe(true);
    expect(makeupSemanticExtractionReadyExample.noAiConfirmedClaims).toBe(true);
    expect(makeupSemanticExtractionReadyExample.noProductShadeClaims).toBe(true);
    expect(makeupSemanticExtractionReadyExample.noMedicalClaims).toBe(true);
    expect(makeupSemanticExtractionReadyExample.noFullyAutomaticExtractionClaim).toBe(true);
    expect(makeupSemanticExtractionReadyExample.registryChainPausedAfter10U).toBe(true);
    expect(makeupSemanticExtractionReadyExample.noRegistryMutation).toBe(true);
    expect(makeupSemanticExtractionReadyExample.noUserAppShellReplacement).toBe(true);
    expect(makeupSemanticExtractionReadyExample.jsonRoundTripStable).toBe(true);
    expect(JSON.parse(JSON.stringify(makeupSemanticExtractionReadyExample))).toEqual(
      makeupSemanticExtractionReadyExample,
    );
  });

  it('marks every semantic output as not final and human-review required', () => {
    Object.values(makeupSemanticExtractionReadyExample.candidates).forEach((candidate) => {
      expect(candidate.semanticCandidate).toBe(true);
      expect(candidate.candidate).toBe(true);
      expect(candidate.notFinal).toBe(true);
      expect(candidate.humanReviewRequired).toBe(true);
      expect(candidate.limitations.join('\n')).toMatch(/人工审核|human review|review/i);
    });
  });

  it('blocks when upstream region QA is blocked', () => {
    const report = createMakeupSemanticExtractionReport({
      analysis: makeupSemanticExtractionReadyAnalysis,
      regionQa: faceMeshRegionQaBlockedExample,
    });

    expect(report.status).toBe('semantic_extraction_blocked');
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'region_qa_blocked', severity: 'blocking' }),
      ]),
    );
    expect(makeupSemanticExtractionBlockedExample.status).toBe('semantic_extraction_blocked');
  });
});
