import type { StyleTaxonomyProfile } from '../templates/schema';
import type { DetectedMakeupRegion, TemplateFaceAnalysis } from '../vision';
import { matchBeautyKnowledgeRules } from './beauty-rules';

export interface TemplateStyleInference {
  style: StyleTaxonomyProfile;
  templateGoals: string[];
  explanations: string[];
}

export const inferTemplateStyle = (
  faceAnalysis: TemplateFaceAnalysis,
  detectedRegions: DetectedMakeupRegion[],
): TemplateStyleInference => {
  const matchedRules = matchBeautyKnowledgeRules(faceAnalysis.features);
  const hasVisibleGlow = detectedRegions.some(
    (region) => region.region === 'base' && region.detected,
  );

  const style: StyleTaxonomyProfile = {
    family: 'natural',
    finish: matchedRules.find((rule) => rule.styleAdjustments.finish)?.styleAdjustments.finish ?? (hasVisibleGlow ? 'dewy' : 'natural'),
    contrast: matchedRules.find((rule) => rule.styleAdjustments.contrast)?.styleAdjustments.contrast ?? 'low',
    palette: {
      temperature: faceAnalysis.features.skinTone,
      dominantFamilies:
        faceAnalysis.features.skinTone === 'warm'
          ? ['peach', 'coral', 'warm rose']
          : ['rose', 'taupe', 'neutral brown'],
      accentFamilies: ['soft brown'],
    },
    signatureTraits: [
      'daily wearable finish',
      'soft edge transitions',
      'region-aware placement',
    ],
    confidence: Number(
      Math.min(0.95, 0.68 + matchedRules.length * 0.05).toFixed(2),
    ),
    evidence: matchedRules.map((rule) => rule.rationale),
  };

  return {
    style,
    templateGoals: [...new Set(matchedRules.flatMap((rule) => rule.templateGoals))],
    explanations: matchedRules.map((rule) => rule.rationale),
  };
};
