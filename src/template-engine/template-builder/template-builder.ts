import type {
  MakeupRegion,
  MakeupTemplate,
  MakeupTemplateRegionEvidence,
  VisualEffect,
} from '../../templates/schema';
import type {
  MakeupAnalysisPipelineResult,
  MakeupPhotoInput,
  SemanticVisionProvider,
  SemanticVisionProviderInput,
} from '../../vision';
import { SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION } from '../../vision';
import type { MakeupExtractionResult } from '../extractor/makeup-extractor';
import type { TemplateInferenceResult } from '../inference/template-inference';

export interface TemplateBuildInput {
  image: MakeupPhotoInput;
  templateName: string;
  createdBy: string;
  decomposition: {
    detectedRegions: MakeupTemplateRegionEvidence[];
    faceShapeHint: string;
    makeupSignals: string[];
    rationale: string[];
  };
  inference: TemplateInferenceResult;
  extraction: MakeupExtractionResult;
  visionAnalysis?: MakeupAnalysisPipelineResult;
}

export const buildMakeupTemplateFromPhoto = (input: TemplateBuildInput): MakeupTemplate => ({
  id: `template-${input.image.id}`,
  name: input.templateName,
  goals: ['reusable_makeup_knowledge', 'photo_to_template_conversion', 'future_coaching'],
  faceStrategy: {
    id: `strategy-${input.image.id}`,
    summary: input.inference.faceStrategySummary,
    goals: ['balance_face', 'enhance_features', 'preserve_style'],
    suitableFaceTypes: input.inference.suitableFaceTypes,
    reasoning: input.inference.reasoning,
  },
  style: input.inference.style,
  faceSuitability: {
    profile: {
      faceShapes: ['round', 'oval'],
      skinTypes: ['oily', 'combination'],
      skinTones: ['warm', 'neutral'],
      eyeTypes: ['hooded', 'double'],
      lipShapes: ['thin', 'full'],
    },
    confidence: 0.8,
    rationale: input.decomposition.rationale,
  },
  regions: input.decomposition.detectedRegions,
  eyeDesign: {
    summary: 'Lift the eye with softened outer edge transitions.',
    effects: ['lift', 'widen'],
    emphasis: 'outer eye',
  },
  lipDesign: {
    summary: 'Balance center color with softened border control.',
    effects: ['balance', 'soften'],
    emphasis: 'lip center',
  },
  contourDesign: {
    summary: 'Use structure only to improve the readable face silhouette.',
    effects: ['deepen', 'shrink'],
    emphasis: 'cheekbone and jawline',
  },
  steps: input.extraction.techniques.map((technique, index) => ({
    id: `step-${index + 1}-${input.image.id}`,
    order: index + 1,
    region: index % 3 === 0 ? 'base' : index % 3 === 1 ? 'eye' : 'lip',
    action: index % 3 === 0 ? 'apply' : index % 3 === 1 ? 'blend' : 'fill',
    tool: index % 3 === 0 ? 'sponge' : index % 3 === 1 ? 'brush' : 'finger',
    intensity: index % 3 === 0 ? 'medium' : 'low',
    layerOrder: index % 3 === 0 ? 'base' : index % 3 === 1 ? 'color' : 'finish',
    placement: {
      region: index % 3 === 0 ? 'base' : index % 3 === 1 ? 'eye' : 'lip',
      area: technique,
      coverage: 'medium',
    },
    productCategory: technique,
    finish: input.inference.style.finish,
    colorFamily: input.inference.style.palette.dominantFamilies[0],
    visualEffects: input.extraction.effects.slice(index, index + 2) as VisualEffect[],
    instruction: technique,
    rationale: input.extraction.reasons[index] ?? input.extraction.reasons[0],
    sourceRegionId: input.decomposition.detectedRegions[index % input.decomposition.detectedRegions.length]?.region,
  })),
  metadata: {
    version: '0.1',
    status: 'draft',
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
    source: {
      imageId: input.image.id,
      fileName: input.image.fileName,
      sourceType: input.image.source,
    },
    styleTags: [input.inference.style.family, input.inference.style.finish],
  },
  notes: [
    ...input.decomposition.rationale,
    ...input.extraction.reasons,
    ...(input.visionAnalysis?.semanticAnalysis?.semanticSummary ?? []),
    ...(input.visionAnalysis?.semanticAnalysis?.explanations ?? []),
  ],
});

export interface VisionTemplateBuildInput {
  image: MakeupPhotoInput;
  templateName: string;
  createdBy: string;
  analysis: MakeupAnalysisPipelineResult;
  semanticProvider?: SemanticVisionProvider;
}

const regionToTemplateRegion: Record<
  MakeupAnalysisPipelineResult['cosmeticRegions'][number]['kind'],
  MakeupRegion
> = {
  lips: 'lip',
  eyes: 'eye',
  brows: 'brow',
  blush: 'blush',
  contour: 'contour',
  highlight: 'base',
};

export const buildMakeupTemplateFromVisionAnalysis = (
  input: VisionTemplateBuildInput,
): MakeupTemplate => {
  const semanticSummary = input.analysis.semanticAnalysis?.semanticSummary ?? [];
  const pixel = input.analysis.pixelAnalysis;
  const styleTagCandidates: Array<string | undefined> = [
    input.analysis.semanticAnalysis?.lipStyle,
    input.analysis.semanticAnalysis?.lipFinish,
    input.analysis.semanticAnalysis?.blushStyle,
    input.analysis.semanticAnalysis?.eyeStyle,
  ];
  const styleTags = styleTagCandidates.filter(
    (tag): tag is string => tag !== undefined,
  );
  const regions: MakeupTemplateRegionEvidence[] =
    input.analysis.cosmeticRegions.map((region) => ({
      region: regionToTemplateRegion[region.kind],
      detected: true,
      confidence: region.confidence,
      cues: [
        `polygon_points:${region.polygon.points.length}`,
        `mask:${region.mask.kind}`,
        ...region.debug,
      ],
    }));

  return {
    id: `template-${input.image.id}`,
    name: input.templateName,
    goals: ['photo_to_template_conversion', 'pixel_makeup_understanding', 'future_coaching'],
    faceStrategy: {
      id: `strategy-${input.image.id}`,
      summary:
        'Build reusable makeup guidance from FaceMesh geometry, cosmetic polygons, and region pixel analysis.',
      goals: ['preserve_detected_style', 'parameterize_makeup_regions', 'support_template_editing'],
      suitableFaceTypes: ['unknown'],
      reasoning: [
        'Template produced from deterministic vision analysis rather than manual labels.',
        ...semanticSummary,
      ],
    },
    style: {
      family: 'natural',
      finish: input.analysis.semanticAnalysis?.lipFinish === 'gloss' ? 'dewy' : 'satin',
      contrast:
        pixel && pixel.eyes.eyeshadowDarkness > 0.45
          ? 'high'
          : pixel && pixel.lips.saturation > 0.35
            ? 'medium'
            : 'low',
      palette: {
        temperature: pixel?.blush.tone === 'cool' ? 'cool' : pixel?.blush.tone === 'warm' ? 'warm' : 'neutral',
        dominantFamilies: [input.analysis.semanticAnalysis?.lipStyle ?? 'pixel-derived'],
        accentFamilies: [input.analysis.semanticAnalysis?.blushStyle ?? 'region-derived'],
      },
      signatureTraits: semanticSummary,
      confidence: pixel ? 0.82 : 0.64,
      evidence: [
        `provider:${input.analysis.providerId}`,
        `landmarks:${input.analysis.faceMesh.landmarks.length}`,
        ...input.analysis.parameters.templateSignals,
      ],
    },
    faceSuitability: {
      profile: {
        faceShapes: ['round', 'oval'],
        skinTypes: ['oily', 'dry', 'combination'],
        skinTones: ['warm', 'cool', 'neutral'],
        eyeTypes: ['monolid', 'hooded', 'double'],
        lipShapes: ['thin', 'full'],
      },
      confidence: 0.62,
      rationale: [
        'Face suitability remains broad until face attribute inference is connected to the pixel template path.',
      ],
    },
    regions,
    eyeDesign: {
      summary: `Eye makeup classified as ${input.analysis.semanticAnalysis?.eyeStyle ?? 'unclassified'}.`,
      effects: ['deepen', 'lift'],
      emphasis: input.analysis.parameters.semanticSummary.find((entry) => entry.startsWith('eye_style')) ?? 'eye region',
    },
    lipDesign: {
      summary: `Lip makeup classified as ${input.analysis.semanticAnalysis?.lipStyle ?? 'unclassified'}.`,
      effects: ['soften', 'balance'],
      emphasis: input.analysis.parameters.semanticSummary.find((entry) => entry.startsWith('lip_style')) ?? 'lip region',
    },
    contourDesign: {
      summary: 'Contour and highlight parameters are preserved as editable region data.',
      effects: ['deepen', 'glow'],
      emphasis: 'face dimension',
    },
    steps: [
      {
        id: `step-lip-${input.image.id}`,
        order: 1,
        region: 'lip',
        action: 'fill',
        tool: 'finger',
        intensity: pixel && pixel.lips.saturation > 0.38 ? 'medium' : 'low',
        layerOrder: 'color',
        placement: { region: 'lip', area: 'lip polygon', coverage: 'medium' },
        productCategory: 'lip color',
        finish: input.analysis.semanticAnalysis?.lipFinish,
        colorFamily: `hue-${Math.round(pixel?.lips.dominantHue ?? 0)}`,
        visualEffects: ['soften', 'balance'],
        instruction: 'Apply lip color following the detected lip style.',
        rationale: input.analysis.semanticAnalysis?.explanations[0] ?? 'Lip step generated from pixel analysis.',
        sourceRegionId: input.analysis.cosmeticRegions.find((region) => region.kind === 'lips')?.id,
      },
      {
        id: `step-blush-${input.image.id}`,
        order: 2,
        region: 'blush',
        action: 'blend',
        tool: 'brush',
        intensity: pixel && pixel.blush.opacity > 0.22 ? 'medium' : 'low',
        layerOrder: 'color',
        placement: { region: 'blush', area: 'detected cheek color region', coverage: 'medium' },
        productCategory: 'blush',
        finish: 'satin',
        colorFamily: pixel?.blush.tone,
        visualEffects: ['lift', 'soften'],
        instruction: 'Blend blush around the detected color center and spread radius.',
        rationale: input.analysis.semanticAnalysis?.explanations[1] ?? 'Blush step generated from pixel analysis.',
        sourceRegionId: input.analysis.cosmeticRegions.find((region) => region.kind === 'blush')?.id,
      },
      {
        id: `step-eye-${input.image.id}`,
        order: 3,
        region: 'eye',
        action: 'blend',
        tool: 'brush',
        intensity: pixel && pixel.eyes.eyeshadowDarkness > 0.42 ? 'medium' : 'low',
        layerOrder: 'definition',
        placement: { region: 'eye', area: 'eye polygon', coverage: 'medium' },
        productCategory: 'eye definition',
        finish: pixel && pixel.eyes.shimmerEstimation > 0.12 ? 'shimmer' : 'natural',
        colorFamily: 'neutral',
        visualEffects: ['deepen', 'lift'],
        instruction: 'Follow the detected eye shadow depth and eyeliner direction.',
        rationale: input.analysis.semanticAnalysis?.explanations[2] ?? 'Eye step generated from pixel analysis.',
        sourceRegionId: input.analysis.cosmeticRegions.find((region) => region.kind === 'eyes')?.id,
      },
    ],
    metadata: {
      version: '0.1',
      status: 'draft',
      createdAt: input.image.uploadedAt ?? new Date().toISOString(),
      createdBy: input.createdBy,
      source: {
        imageId: input.image.id,
        fileName: input.image.fileName,
        sourceType: input.image.source,
      },
      styleTags,
      visionMetrics: {
        opacityConfidence:
          pixel?.skinBaseline?.differences.blush?.opacityEstimate ??
          pixel?.blush.opacity,
        edgeSoftness:
          pixel?.edgeAnalysis?.features.lips?.edgeSoftnessScore ??
          pixel?.lips.edgeSoftness,
        diffusionQuality:
          pixel?.edgeAnalysis?.features.blush?.diffusionScore ??
          pixel?.blush.spreadRadius,
        skinRelativeIntensity:
          pixel?.skinBaseline?.differences.eyeshadow?.opacityEstimate ??
          pixel?.eyes.eyeshadowDarkness,
      },
    },
    notes: [
      ...semanticSummary,
      ...(input.analysis.semanticAnalysis?.explanations ?? []),
      ...(pixel?.debug.flatMap((entry) => entry.notes) ?? []),
    ],
  };
};

export const enrichMakeupTemplateWithSemanticProvider = async (input: {
  template: MakeupTemplate;
  analysis: MakeupAnalysisPipelineResult;
  semanticProvider?: SemanticVisionProvider;
  adminNotes?: string[];
}): Promise<MakeupTemplate> => {
  if (!input.semanticProvider) {
    return input.template;
  }

  const providerInput: SemanticVisionProviderInput = {
    schemaVersion: SEMANTIC_VISION_PROVIDER_SCHEMA_VERSION,
    localMakeupParameters: input.analysis.parameters,
    templateEvidenceSummary: input.template.evidence
      ? {
          evidenceId: input.template.evidence.evidenceId,
          templateId: input.template.evidence.templateId,
          createdAt: input.template.evidence.createdAt,
        }
      : null,
    semanticAnalysis: input.analysis.semanticAnalysis,
    weightedPixelAnalysis: input.analysis.pixelAnalysis?.weighted ?? null,
    adminNotes: input.adminNotes,
  };

  try {
    const result = await input.semanticProvider.enrich(providerInput);

    return {
      ...input.template,
      name: result.makeupStyleName || input.template.name,
      goals: Array.from(
        new Set([
          ...input.template.goals,
          'semantic_style_explanation',
          ...result.suitableOccasions.map((occasion) => `occasion:${occasion}`),
        ]),
      ),
      style: {
        ...input.template.style,
        family: input.template.style.family,
        signatureTraits: Array.from(
          new Set([
            ...input.template.style.signatureTraits,
            result.styleFamily,
            ...result.qaSuggestions,
          ]),
        ),
        evidence: Array.from(
          new Set([...input.template.style.evidence, `semantic:${result.providerId}`]),
        ),
      },
      faceStrategy: {
        ...input.template.faceStrategy,
        summary: result.professionalMakeupDescription,
        suitableFaceTypes: Array.from(
          new Set([
            ...input.template.faceStrategy.suitableFaceTypes,
            ...result.suitableFaceTypes,
          ]),
        ),
        reasoning: Array.from(
          new Set([
            ...input.template.faceStrategy.reasoning,
            ...result.reviewerHints,
          ]),
        ),
      },
      steps: input.template.steps.map((step, index) => ({
        ...step,
        instruction: result.stepExplanations[index] ?? step.instruction,
        rationale: result.userFacingExplanation,
      })),
      metadata: {
        ...input.template.metadata,
        semanticEnrichment: {
          providerId: result.providerId,
          makeupStyleName: result.makeupStyleName,
          professionalDescription: result.professionalMakeupDescription,
          qaSuggestions: result.qaSuggestions,
          reviewerHints: result.reviewerHints,
          userFacingExplanation: result.userFacingExplanation,
        },
      },
      notes: Array.from(
        new Set([
          ...(input.template.notes ?? []),
          result.professionalMakeupDescription,
          ...result.cautionNotes,
          ...result.qaSuggestions,
          ...result.reviewerHints,
        ]),
      ),
    };
  } catch {
    return input.template;
  }
};

export const buildMakeupTemplateFromVisionAnalysisWithSemanticProvider = async (
  input: VisionTemplateBuildInput,
): Promise<MakeupTemplate> =>
  enrichMakeupTemplateWithSemanticProvider({
    template: buildMakeupTemplateFromVisionAnalysis(input),
    analysis: input.analysis,
    semanticProvider: input.semanticProvider,
  });
