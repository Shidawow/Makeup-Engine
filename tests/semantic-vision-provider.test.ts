import { describe, expect, it } from 'vitest';
import { semanticProviderInputFixture } from './semantic-provider-fixtures';

describe('SemanticVisionProvider contract', () => {
  it('only accepts local CV artifacts as semantic enrichment input', () => {
    const input = semanticProviderInputFixture();

    expect(input.schemaVersion).toBe('semantic-vision-provider-v0.1');
    expect(input.localMakeupParameters.imageId).toBe('semantic-image');
    expect(input.semanticAnalysis?.semanticSummary).toEqual([
      'lip_style:defined_satin',
    ]);
    expect(input).not.toHaveProperty('apiKey');
    expect(input).not.toHaveProperty('rawImageBytes');
    expect(input).not.toHaveProperty('segmentationMaskWriter');
  });
});
