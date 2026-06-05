import type {
  BlushParameters,
  BrowsParameters,
  ContourParameters,
  CosmeticRegionParameter,
  EyesParameters,
  HighlightParameters,
  LipsParameters,
} from './cosmetic-regions';
import type { MakeupSemanticAnalysis } from './makeup-semantics';
import type { MakeupPixelAnalysis } from './pixel-analysis';

export interface MakeupParameterSchema {
  version: '0.1';
  imageId: string;
  faceId: string;
  lips: LipsParameters;
  eyes: EyesParameters;
  brows: BrowsParameters;
  blush: BlushParameters;
  contour: ContourParameters;
  highlight: HighlightParameters;
  pixelAnalysis?: MakeupPixelAnalysis;
  semanticAnalysis?: MakeupSemanticAnalysis;
  semanticSummary: string[];
  editableRegionIds: string[];
  templateSignals: string[];
}

const regionByKind = <TKind extends CosmeticRegionParameter['kind']>(
  regions: CosmeticRegionParameter[],
  kind: TKind,
): Extract<CosmeticRegionParameter, { kind: TKind }> => {
  const region = regions.find(
    (candidate): candidate is Extract<CosmeticRegionParameter, { kind: TKind }> =>
      candidate.kind === kind,
  );

  if (!region) {
    throw new Error(`Missing cosmetic region: ${kind}`);
  }

  return region;
};

export const parameterizeMakeupRegions = (
  imageId: string,
  faceId: string,
  regions: CosmeticRegionParameter[],
  pixelAnalysis?: MakeupPixelAnalysis,
  semanticAnalysis?: MakeupSemanticAnalysis,
): MakeupParameterSchema => ({
  version: '0.1',
  imageId,
  faceId,
  lips: {
    ...regionByKind(regions, 'lips').parameters,
    edgeSoftness:
      pixelAnalysis?.lips.edgeSoftness ?? regionByKind(regions, 'lips').parameters.edgeSoftness,
    glossLevel:
      semanticAnalysis?.lipFinish === 'gloss'
        ? Math.max(regionByKind(regions, 'lips').parameters.glossLevel, 0.75)
        : regionByKind(regions, 'lips').parameters.glossLevel,
  },
  eyes: {
    ...regionByKind(regions, 'eyes').parameters,
    eyeshadowSpread:
      pixelAnalysis?.eyes.eyeshadowDarkness ?? regionByKind(regions, 'eyes').parameters.eyeshadowSpread,
  },
  brows: regionByKind(regions, 'brows').parameters,
  blush: {
    ...regionByKind(regions, 'blush').parameters,
    saturation:
      pixelAnalysis?.blush.opacity ?? regionByKind(regions, 'blush').parameters.saturation,
    diffusion:
      pixelAnalysis?.blush.spreadRadius ?? regionByKind(regions, 'blush').parameters.diffusion,
  },
  contour: regionByKind(regions, 'contour').parameters,
  highlight: regionByKind(regions, 'highlight').parameters,
  pixelAnalysis,
  semanticAnalysis,
  semanticSummary: semanticAnalysis?.semanticSummary ?? [],
  editableRegionIds: regions.map((region) => region.id),
  templateSignals: regions.map(
    (region) =>
      `${region.kind}:${region.confidence.toFixed(2)}:${region.mask.kind}`,
  ).concat(semanticAnalysis?.semanticSummary ?? []),
});
