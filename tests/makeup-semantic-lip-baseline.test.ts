import { describe, expect, it } from 'vitest';
import {
  makeupSemanticExtractionInsufficientExample,
  makeupSemanticExtractionReadyExample,
} from '../src/templates/examples';

describe('makeup semantic lip baseline', () => {
  it('derives lip color from local color rules without claiming a product shade', () => {
    const lipColor = makeupSemanticExtractionReadyExample.candidates.lipColorCandidate;

    expect(lipColor.value).toBe('coral');
    expect(lipColor.sourceType).toBe('color_rule_derived');
    expect(lipColor.confidenceBand).toBe('high');
    expect(lipColor.notFinal).toBe(true);
    expect(lipColor.limitations.join('\n')).toContain('不是具体品牌色号');
  });

  it('keeps lip finish conservative because brightness and edge evidence are lighting-sensitive', () => {
    const lipFinish = makeupSemanticExtractionReadyExample.candidates.lipFinishCandidate;

    expect(lipFinish.sourceType).toBe('brightness_rule_derived');
    expect(lipFinish.value).toMatch(/satin_like|glossy_like|matte_like/);
    expect(['low', 'medium']).toContain(lipFinish.confidenceBand);
    expect(lipFinish.limitations.join('\n')).toContain('光照');
  });

  it('returns unknown when lip pixel evidence is missing', () => {
    const lipColor = makeupSemanticExtractionInsufficientExample.candidates.lipColorCandidate;

    expect(lipColor.value).toBe('unknown');
    expect(lipColor.sourceType).toBe('insufficient_evidence');
    expect(lipColor.confidenceBand).toBe('insufficient');
  });
});
