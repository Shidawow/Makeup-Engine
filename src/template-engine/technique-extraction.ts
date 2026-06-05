import type { TemplateStyleInference } from '../beauty-knowledge';
import type {
  MakeupRegion,
  MakeupStep,
  TemplateLayerOrder,
} from '../templates/schema';
import type { DetectedMakeupRegion } from '../vision';
import type { TechniqueExtractionResult } from './contracts';

const layerRoleByRegion: Record<MakeupRegion, TemplateLayerOrder> = {
  base: 'base',
  brow: 'definition',
  eye: 'color',
  contour: 'structure',
  blush: 'color',
  lip: 'finish',
};

const instructionByRegion: Record<MakeupRegion, string> = {
  base: 'Create an even base while preserving realistic skin texture.',
  brow: 'Define brow shape softly and preserve natural hair direction.',
  eye: 'Build eye dimension with softened edges and lifted outer placement.',
  contour: 'Place contour where it supports face structure without harsh edges.',
  blush: 'Place blush to support the inferred style and face shape.',
  lip: 'Balance lip color and edge softness for the final style.',
};

const productByRegion: Record<MakeupRegion, string> = {
  base: 'base product',
  brow: 'brow product',
  eye: 'eyeshadow',
  contour: 'contour',
  blush: 'blush',
  lip: 'lip color',
};

export const extractTemplateTechniques = (
  detectedRegions: DetectedMakeupRegion[],
  styleInference: TemplateStyleInference,
): TechniqueExtractionResult => {
  const visibleRegions = detectedRegions.filter((region) => region.detected);

  const steps: MakeupStep[] = visibleRegions.map((region, index) => ({
    id: `step-${index + 1}-${region.region}`,
    order: index + 1,
    region: region.region,
    action:
      region.region === 'eye' || region.region === 'contour' || region.region === 'blush'
        ? 'blend'
        : region.region === 'brow'
          ? 'define'
          : 'apply',
    tool: region.region === 'base' ? 'sponge' : 'brush',
    intensity:
      styleInference.style.contrast === 'high'
        ? 'high'
        : styleInference.style.contrast === 'medium'
          ? 'medium'
          : 'low',
    layerOrder: layerRoleByRegion[region.region],
    placement: {
      region: region.region,
      area: region.cues[0] ?? region.region,
      coverage: region.region === 'base' ? 'full' : 'medium',
    },
    productCategory: productByRegion[region.region],
    finish: styleInference.style.finish,
    colorFamily: styleInference.style.palette.dominantFamilies[0],
    visualEffects:
      region.region === 'base'
        ? ['brighten', 'glow']
        : region.region === 'eye'
          ? ['lift', 'widen']
          : region.region === 'contour'
            ? ['shrink', 'deepen']
            : ['balance'],
    instruction: instructionByRegion[region.region],
    rationale: `Extracted from detected ${region.region} makeup evidence for reusable template production.`,
    sourceRegionId: region.id,
  }));

  return {
    steps,
    rationale: visibleRegions.map(
      (region) => `Detected ${region.region} with confidence ${region.confidence}.`,
    ),
  };
};
