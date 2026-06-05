import type { MakeupRegion, StyleTaxonomy } from '../../templates/schema';
import { classifyTemplateStyle } from '../classifiers/style-classifier';

export interface TemplateInferenceResult {
  style: StyleTaxonomy;
  faceStrategySummary: string;
  suitableFaceTypes: string[];
  reasoning: string[];
}

export const inferTemplateKnowledge = (
  regions: MakeupRegion[],
  faceShapeHint: string,
): TemplateInferenceResult => {
  const classification = classifyTemplateStyle(regions.length, regions);

  return {
    style: {
      family: classification.family as StyleTaxonomy['family'],
      finish: classification.finish as StyleTaxonomy['finish'],
      contrast: regions.includes('contour') ? 'medium' : 'low',
      palette: {
        temperature: 'warm',
        dominantFamilies: ['peach', 'rose', 'soft brown'],
        accentFamilies: ['champagne', 'taupe'],
      },
      signatureTraits: ['photo-derived template', 'structured make-up knowledge', faceShapeHint],
      confidence: classification.confidence,
      evidence: ['Style inferred from detected makeup regions and face shape hint.'],
    },
    faceStrategySummary: `Optimize the template for ${faceShapeHint} faces with reusable step guidance.`,
    suitableFaceTypes:
      faceShapeHint === 'round-leaning'
        ? ['round', 'oval']
        : faceShapeHint === 'structured'
          ? ['square', 'heart']
          : ['oval', 'heart'],
    reasoning: ['Style and face strategy inferred from photo decomposition.'],
  };
};
