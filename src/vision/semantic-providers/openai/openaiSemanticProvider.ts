import {
  SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION,
  type SemanticVisionProvider,
  type SemanticVisionProviderCapability,
  type SemanticVisionProviderConfig,
  type SemanticVisionProviderInput,
  type SemanticVisionProviderResult,
} from '../types';

export const OPENAI_SEMANTIC_PROVIDER_CAPABILITIES: SemanticVisionProviderCapability[] = [
  'style_naming',
  'style_explanation',
  'step_copywriting',
  'qa_suggestions',
  'reviewer_hints',
  'user_facing_explanation',
];

const compactLabel = (value: string): string =>
  value.replace(/^[^:]+:/, '').replace(/_/g, ' ');

export class OpenAISemanticProvider implements SemanticVisionProvider {
  readonly id = 'openai-semantic-placeholder';

  readonly capabilities = OPENAI_SEMANTIC_PROVIDER_CAPABILITIES;

  validateConfig(config: SemanticVisionProviderConfig): string[] {
    return [
      ...(config.providerId !== this.id
        ? [`providerId must be ${this.id}`]
        : []),
      ...(config.mode !== 'mock' && config.mode !== 'disabled'
        ? ['OpenAI semantic provider is placeholder-only in this phase.']
        : []),
      ...(config.enabled && config.mode === 'disabled'
        ? ['enabled provider cannot use disabled mode']
        : []),
    ];
  }

  async enrich(
    input: SemanticVisionProviderInput,
  ): Promise<SemanticVisionProviderResult> {
    const semanticSummary = input.semanticAnalysis?.semanticSummary ??
      input.localMakeupParameters.semanticSummary;
    const styleBits = semanticSummary.map(compactLabel);
    const lipStyle = compactLabel(
      input.semanticAnalysis?.lipStyle ?? semanticSummary[0] ?? 'balanced soft color',
    );
    const eyeStyle = compactLabel(
      input.semanticAnalysis?.eyeStyle ?? semanticSummary[1] ?? 'clean definition',
    );
    const styleFamily = styleBits.some((bit) => bit.includes('defined'))
      ? 'polished-natural'
      : 'soft-natural';
    const makeupStyleName = `${lipStyle} ${eyeStyle}`.trim();
    const weightedTargets = Object.keys(
      input.weightedPixelAnalysis?.samples ?? {},
    ).sort();

    return {
      schemaVersion: SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION,
      providerId: this.id,
      source: 'semantic-enrichment',
      makeupStyleName,
      styleFamily,
      professionalMakeupDescription:
        `Local CV indicates ${styleBits.join(', ') || 'a balanced makeup look'} with ${weightedTargets.join(', ') || 'region'} pixel evidence.`,
      stepExplanations: [
        `Preserve ${lipStyle} lip structure from local mask and pixel analysis.`,
        `Explain ${eyeStyle} eye definition without changing segmentation masks.`,
      ],
      suitableFaceTypes: ['oval', 'round', 'balanced features'],
      suitableOccasions: ['daily wear', 'soft event makeup', 'portfolio review'],
      cautionNotes: [
        'Semantic enrichment cannot alter landmarks, masks, or pixel samples.',
        'Use local CV confidence to decide whether review is required.',
      ],
      qaSuggestions: [
        'Check mask boundary before accepting training export.',
        'Compare semantic labels against human-edited mask intent.',
      ],
      reviewerHints: [
        'Review semantic wording separately from mask geometry.',
        `Evidence reference: ${input.templateEvidenceSummary?.evidenceId ?? 'none'}`,
      ],
      userFacingExplanation:
        'This description is generated from local CV outputs and is safe to replace with future server-side semantic enrichment.',
      confidence: 0.78,
      debug: [
        'placeholder:no-api-call',
        'local-cv-remains-source-of-truth',
        ...(input.adminNotes ?? []),
      ],
    };
  }
}

export const createOpenAISemanticProvider = (): OpenAISemanticProvider =>
  new OpenAISemanticProvider();
