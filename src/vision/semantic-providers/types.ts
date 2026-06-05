import type { TemplateEvidence } from '../../templates/schema';
import type { MakeupParameterSchema } from '../makeup-parameters';
import type { MakeupSemanticAnalysis } from '../makeup-semantics';
import type { WeightedMakeupPixelAnalysis } from '../pixel-analysis';

export const SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION =
  'semantic-vision-provider-v0.1' as const;

export type SemanticVisionProviderCapability =
  | 'style_naming'
  | 'style_explanation'
  | 'step_copywriting'
  | 'qa_suggestions'
  | 'reviewer_hints'
  | 'user_facing_explanation';

export interface SemanticVisionProviderConfig {
  providerId: string;
  enabled: boolean;
  capabilities: SemanticVisionProviderCapability[];
  mode: 'mock' | 'disabled' | 'remote-placeholder';
  modelHint?: string;
}

export interface SemanticVisionProviderInput {
  schemaVersion: typeof SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION;
  localMakeupParameters: MakeupParameterSchema;
  templateEvidenceSummary?: Pick<
    TemplateEvidence,
    'evidenceId' | 'templateId' | 'createdAt'
  > | null;
  semanticAnalysis?: MakeupSemanticAnalysis | null;
  weightedPixelAnalysis?: WeightedMakeupPixelAnalysis | null;
  imageCropReference?: string;
  regionThumbnailReferences?: Record<string, string>;
  adminNotes?: string[];
}

export interface SemanticVisionProviderResult {
  schemaVersion: typeof SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION;
  providerId: string;
  source: 'semantic-enrichment';
  makeupStyleName: string;
  styleFamily: string;
  professionalMakeupDescription: string;
  stepExplanations: string[];
  suitableFaceTypes: string[];
  suitableOccasions: string[];
  cautionNotes: string[];
  qaSuggestions: string[];
  reviewerHints: string[];
  userFacingExplanation: string;
  confidence: number;
  debug: string[];
}

export interface SemanticVisionProvider {
  readonly id: string;
  readonly capabilities: SemanticVisionProviderCapability[];
  validateConfig(config: SemanticVisionProviderConfig): string[];
  enrich(input: SemanticVisionProviderInput): Promise<SemanticVisionProviderResult>;
}
