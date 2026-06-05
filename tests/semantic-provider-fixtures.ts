import type {
  MakeupParameterSchema,
  SemanticVisionProviderInput,
} from '../src/vision';
import { SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION } from '../src/vision';
import {
  evidenceFixture,
  pixelAnalysisFixture,
  semanticsFixture,
} from './dataset-review-fixtures';

export const makeupParametersFixture = (): MakeupParameterSchema => ({
  version: '0.1',
  imageId: 'semantic-image',
  faceId: 'semantic-face',
  lips: {
    coverage: 'full-lip',
    colorFamily: 'pink',
    edgeSoftness: 0.3,
    glossLevel: 0.4,
  },
  eyes: {
    eyelinerWeight: 0.2,
    eyeshadowSpread: 0.4,
    lashEmphasis: 0.5,
    liftAngle: 0.3,
  },
  brows: {
    definition: 0.4,
    archLift: 0.3,
    density: 0.5,
  },
  blush: {
    placement: 'high-cheek',
    saturation: 0.4,
    diffusion: 0.5,
  },
  contour: {
    cheekDepth: 0.2,
    jawDefinition: 0.1,
    noseDefinition: 0.1,
    blendSoftness: 0.7,
  },
  highlight: {
    glowIntensity: 0.3,
    placement: 'cheekbone',
    particleShimmer: 0.2,
  },
  pixelAnalysis: pixelAnalysisFixture('semantic-image'),
  semanticAnalysis: semanticsFixture('semantic-image', ['lip_style:defined_satin']),
  semanticSummary: ['lip_style:defined_satin'],
  editableRegionIds: ['region-lips'],
  templateSignals: ['lips:0.90:polygon'],
});

export const semanticProviderInputFixture =
  (): SemanticVisionProviderInput => ({
    schemaVersion: SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION,
    localMakeupParameters: makeupParametersFixture(),
    templateEvidenceSummary: {
      evidenceId: evidenceFixture().evidenceId,
      templateId: evidenceFixture().templateId,
      createdAt: evidenceFixture().createdAt,
    },
    semanticAnalysis: semanticsFixture('semantic-image', ['lip_style:defined_satin']),
    weightedPixelAnalysis: undefined,
    adminNotes: ['fixture'],
  });
