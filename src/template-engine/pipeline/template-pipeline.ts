import { detectFace } from '../../vision/face-detection';
import { detectLandmarks } from '../../vision/landmarks';
import { segmentCosmeticRegions } from '../../vision/segmentation';
import { analyzeCosmeticSignals } from '../../vision/cosmetic-analysis';
import { decomposeMakeupPhoto } from '../decomposer/template-decomposer';
import { extractMakeupKnowledge } from '../extractor/makeup-extractor';
import { inferTemplateKnowledge } from '../inference/template-inference';
import { buildMakeupTemplateFromPhoto } from '../template-builder/template-builder';
import type { MakeupPhotoInput } from '../../vision';
import type { MakeupTemplate } from '../../templates/schema';
import type { StyleTaxonomy } from '../../templates/schema';

export interface MakeupTemplatePipelineInput {
  image: MakeupPhotoInput;
  templateName: string;
  createdBy: string;
}

export interface MakeupTemplatePipelineResult {
  template: MakeupTemplate;
  trace: string[];
}

export const generateMakeupTemplate = async (
  input: MakeupTemplatePipelineInput,
): Promise<MakeupTemplatePipelineResult> => {
  const trace: string[] = ['image-input'];
  const faceDetection = await detectFace(input.image);
  trace.push('face-detection');
  const landmarks = await detectLandmarks(input.image);
  trace.push('landmarks');
  const segmentedRegions = await segmentCosmeticRegions(input.image);
  trace.push('segmentation');
  const styleProbe: StyleTaxonomy = {
    family: 'natural',
    finish: 'natural',
    contrast: 'low',
    palette: {
      temperature: 'warm',
      dominantFamilies: ['rose'],
      accentFamilies: ['taupe'],
    },
    signatureTraits: ['template production probe'],
    confidence: 0.8,
    evidence: ['Generated from local decomposition pipeline.'],
  };
  const cosmeticAnalysis = await analyzeCosmeticSignals(
    input.image,
    faceDetection,
    landmarks,
    segmentedRegions,
    styleProbe,
  );
  trace.push('cosmetic-analysis');
  const decomposition = decomposeMakeupPhoto(
    faceDetection,
    landmarks,
    segmentedRegions,
    cosmeticAnalysis,
  );
  trace.push('decomposition');
  const inference = inferTemplateKnowledge(decomposition.detectedRegions, decomposition.faceShapeHint);
  trace.push('inference');
  const extraction = extractMakeupKnowledge(decomposition.detectedRegions, cosmeticAnalysis);
  trace.push('extraction');
  const template = buildMakeupTemplateFromPhoto({
    image: input.image,
    templateName: input.templateName,
    createdBy: input.createdBy,
    decomposition: {
      detectedRegions: segmentedRegions.map((region) => ({
        region: region.region,
        detected: true,
        confidence: region.confidence,
        cues: [region.maskDescription],
      })),
      faceShapeHint: decomposition.faceShapeHint,
      makeupSignals: decomposition.makeupSignals,
      rationale: decomposition.rationale,
    },
    inference,
    extraction,
  });
  trace.push('template-build');

  return { template, trace };
};
