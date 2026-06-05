import type {
  CosmeticSegmentationDebugArtifact,
  CosmeticSegmentationResult,
} from '../masks';
import { compositeMasks } from '../blending';

export const createSegmentationDebugArtifacts = (
  result: CosmeticSegmentationResult,
): CosmeticSegmentationDebugArtifact[] => {
  const composite = compositeMasks(result.masks);
  const maxAlpha = composite.alpha.reduce(
    (max, value) => Math.max(max, value),
    0,
  );

  return [
    ...result.debug,
    {
      stage: 'segmentation-debug',
      label: 'Segmentation mask summary',
      data: {
        maskCount: result.masks.length,
        compositeWidth: composite.width,
        compositeHeight: composite.height,
        maxAlpha,
      },
    },
  ];
};

