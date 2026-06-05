import type { CosmeticRegionParameter } from '../../cosmetic-regions';
import type { NormalizedBoundingBox, NormalizedPolygon } from '../../providers';

export type CosmeticSegmentationTarget =
  | 'lips'
  | 'eyeshadow'
  | 'eyeliner'
  | 'blush'
  | 'contour'
  | 'highlight';

export interface SegmentationMaskGrid {
  width: number;
  height: number;
  alpha: readonly number[];
}

export interface CosmeticSegmentationMask {
  id: string;
  target: CosmeticSegmentationTarget;
  sourceRegionId?: string;
  polygon: NormalizedPolygon;
  bounds: NormalizedBoundingBox;
  grid: SegmentationMaskGrid;
  confidence: number;
  debug: string[];
}

export interface CosmeticSegmentationDebugArtifact {
  stage:
    | 'segmentation-provider'
    | 'mask-refinement'
    | 'mask-blending'
    | 'segmentation-debug';
  label: string;
  target?: CosmeticSegmentationTarget;
  data: Record<string, string | number | boolean>;
}

export interface CosmeticSegmentationResult {
  imageId: string;
  providerId: string;
  masks: CosmeticSegmentationMask[];
  debug: CosmeticSegmentationDebugArtifact[];
}

export const cosmeticRegionToSegmentationTarget = (
  region: CosmeticRegionParameter,
): CosmeticSegmentationTarget => {
  switch (region.kind) {
    case 'lips':
      return 'lips';
    case 'eyes':
      return 'eyeshadow';
    case 'brows':
      return 'eyeliner';
    case 'blush':
      return 'blush';
    case 'contour':
      return 'contour';
    case 'highlight':
      return 'highlight';
  }
};

