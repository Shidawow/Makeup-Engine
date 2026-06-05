import type { CosmeticRegionParameter } from '../../cosmetic-regions';
import type { MakeupPhotoInput } from '../../image-input';
import type { ImagePixelData } from '../../pixel-analysis';
import type { FaceMeshGeometry } from '../../providers';
import type { SegmentationProvider } from '../providers';
import {
  type CosmeticSegmentationResult,
  type CosmeticSegmentationTarget,
} from '../masks';
import { refineCosmeticRegionMasks } from '../refinement';
import { featherMask, smoothMaskEdges } from '../blending';
import { createSegmentationDebugArtifacts } from '../debug';

export interface CosmeticSegmentationPipelineInput {
  image: MakeupPhotoInput;
  faceMesh: FaceMeshGeometry;
  cosmeticRegions: CosmeticRegionParameter[];
  pixelData?: ImagePixelData;
  provider?: SegmentationProvider;
  targets?: CosmeticSegmentationTarget[];
}

export const runCosmeticSegmentation = async (
  input: CosmeticSegmentationPipelineInput,
): Promise<CosmeticSegmentationResult> => {
  const providerResult = input.provider
    ? await input.provider.segment({
        image: input.image,
        faceMesh: input.faceMesh,
        cosmeticRegions: input.cosmeticRegions,
        pixelData: input.pixelData,
        targets: input.targets,
      })
    : {
        imageId: input.image.id,
        providerId: 'polygon-refinement',
        masks: refineCosmeticRegionMasks(input.image.id, input.cosmeticRegions),
        debug: [
          {
            stage: 'mask-refinement' as const,
            label: 'Generated segmentation masks from cosmetic polygons',
            data: {
              regionCount: input.cosmeticRegions.length,
            },
          },
        ],
      };

  const masks = providerResult.masks.map((mask) => ({
    ...featherMask(
      {
        ...mask,
        grid: smoothMaskEdges(mask.grid, 1),
      },
      0.22,
    ),
    debug: [...mask.debug, 'Smoothed and feathered by segmentation pipeline.'],
  }));
  const result: CosmeticSegmentationResult = {
    ...providerResult,
    masks,
  };

  return {
    ...result,
    debug: createSegmentationDebugArtifacts(result),
  };
};

