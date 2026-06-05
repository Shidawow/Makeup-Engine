import { describe, expect, it } from 'vitest';
import { createOpenAISemanticProvider } from '../src/vision';
import { semanticProviderInputFixture } from './semantic-provider-fixtures';

describe('OpenAI semantic provider placeholder', () => {
  it('validates placeholder config and never performs a real API call', async () => {
    const provider = createOpenAISemanticProvider();
    const errors = provider.validateConfig({
      providerId: 'openai-semantic-placeholder',
      enabled: true,
      mode: 'mock',
      capabilities: provider.capabilities,
      modelHint: 'future-server-side-vision-model',
    });
    const result = await provider.enrich(semanticProviderInputFixture());

    expect(errors).toEqual([]);
    expect(result.providerId).toBe('openai-semantic-placeholder');
    expect(result.source).toBe('semantic-enrichment');
    expect(result.debug).toContain('placeholder:no-api-call');
    expect(result.debug).toContain('local-cv-remains-source-of-truth');
    expect(result.cautionNotes.join(' ')).toContain('cannot alter landmarks');
  });

  it('rejects remote mode during placeholder phase', () => {
    const provider = createOpenAISemanticProvider();

    expect(
      provider.validateConfig({
        providerId: 'openai-semantic-placeholder',
        enabled: true,
        mode: 'remote-placeholder',
        capabilities: provider.capabilities,
      }),
    ).toContain('OpenAI semantic provider is placeholder-only in this phase.');
  });
});
