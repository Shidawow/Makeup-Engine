import type { TemplateStyleInference } from '../beauty-knowledge';
import type {
  FaceSuitabilitySchema,
  MakeupTemplate,
  MakeupTemplateRegionEvidence,
} from '../templates/schema';
import type { DetectedMakeupRegion, MakeupPhotoInput, TemplateFaceAnalysis } from '../vision';
import type { TechniqueExtractionResult, TemplateProductionInput } from './contracts';

export const buildFaceSuitability = (
  faceAnalysis: TemplateFaceAnalysis,
  styleInference: TemplateStyleInference,
): FaceSuitabilitySchema => ({
  profile: {
    faceShapes: [faceAnalysis.features.faceShape],
    skinTypes: [faceAnalysis.features.skinType],
    skinTones: [faceAnalysis.features.skinTone],
    eyeTypes: [faceAnalysis.features.eyeType],
    lipShapes: [faceAnalysis.features.lipShape],
  },
  confidence: faceAnalysis.confidence,
  rationale: styleInference.explanations,
});

const toTemplateRegionEvidence = (
  detectedRegions: DetectedMakeupRegion[],
): MakeupTemplateRegionEvidence[] =>
  detectedRegions.map((region) => ({
    region: region.region,
    detected: region.detected,
    confidence: region.confidence,
    cues: region.cues,
  }));

export const buildMakeupTemplate = (
  input: TemplateProductionInput,
  faceAnalysis: TemplateFaceAnalysis,
  detectedRegions: DetectedMakeupRegion[],
  styleInference: TemplateStyleInference,
  techniqueExtraction: TechniqueExtractionResult,
): MakeupTemplate => ({
  id: `template-${input.image.id}`,
  name: input.templateName,
  goals: styleInference.templateGoals,
  faceStrategy: {
    id: `strategy-${input.image.id}`,
    summary: 'Convert visible makeup choices into reusable guidance for similar faces.',
    goals: styleInference.templateGoals,
    suitableFaceTypes: [
      faceAnalysis.features.faceShape,
      faceAnalysis.features.eyeType,
      faceAnalysis.features.lipShape,
    ],
    reasoning: styleInference.explanations,
  },
  style: styleInference.style,
  faceSuitability: buildFaceSuitability(faceAnalysis, styleInference),
  regions: toTemplateRegionEvidence(detectedRegions),
  eyeDesign: {
    summary: 'Lift and open the eye while keeping visible lid space.',
    effects: ['lift', 'widen'],
    emphasis: faceAnalysis.features.eyeType,
  },
  lipDesign: {
    summary: 'Balance lip color and edge softness for the selected style.',
    effects: ['balance', 'soften'],
    emphasis: faceAnalysis.features.lipShape,
  },
  contourDesign: {
    summary: 'Use structure only where it supports the face strategy.',
    effects: ['deepen', 'shrink'],
    emphasis: faceAnalysis.features.faceShape,
  },
  steps: techniqueExtraction.steps,
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
    styleTags: [styleInference.style.family, styleInference.style.finish],
  },
});

export const createTemplateInputFromPhoto = (
  image: MakeupPhotoInput,
  templateName: string,
  createdBy = 'admin',
): TemplateProductionInput => ({
  image,
  templateName,
  createdBy,
});
