import type { CosmeticAnalysisResult } from '../../vision/cosmetic-analysis';
import type { MakeupRegion } from '../../templates/schema';

export interface MakeupExtractionResult {
  effects: string[];
  techniques: string[];
  reasons: string[];
}

const effectsByRegion: Record<MakeupRegion, string[]> = {
  base: ['brighten', 'balance'],
  brow: ['frame', 'lift'],
  eye: ['widen', 'lift'],
  contour: ['shrink', 'deepen'],
  blush: ['flush', 'soften'],
  lip: ['balance', 'soften'],
};

const techniquesByRegion: Record<MakeupRegion, string[]> = {
  base: ['sponge tapping', 'thin layering'],
  brow: ['soft feathering', 'tail definition'],
  eye: ['outer lift', 'soft blend'],
  contour: ['shadow placement', 'diffused blend'],
  blush: ['high placement', 'diffused tap'],
  lip: ['center color press', 'edge softening'],
};

export const extractMakeupKnowledge = (
  regions: MakeupRegion[],
  analysis: CosmeticAnalysisResult,
): MakeupExtractionResult => {
  const uniqueRegions = [...new Set(regions)];

  return {
    effects: uniqueRegions.flatMap((region) => effectsByRegion[region]),
    techniques: uniqueRegions.flatMap((region) => techniquesByRegion[region]),
    reasons: [
      `Analysis confidence: ${analysis.confidence}.`,
      ...uniqueRegions.map((region) => `Extracted reusable knowledge for ${region}.`),
    ],
  };
};
