import type { ImageConditionedSegmentationModel, ImagePixelData } from '../../../../training/schema';
import { refineCosmeticRegionMask } from '../../refinement';
import { cosmeticRegionToSegmentationTarget, type CosmeticSegmentationResult, type CosmeticSegmentationTarget } from '../../masks';
import type { SegmentationProvider, SegmentationProviderInput } from '../types';
import { loadImageConditionedSegmentationModel } from './imageConditionedModelLoader';
import { adaptImageConditionedPredictionToMask } from './imageConditionedMaskPredictorAdapter';

export class ImageConditionedSegmentationProvider implements SegmentationProvider {
  id = 'image-conditioned-pixel-prior-provider';
  kind = 'baseline' as const;
  targets: CosmeticSegmentationTarget[];
  private ready = false;
  private readonly model: ImageConditionedSegmentationModel;
  private readonly imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;

  constructor(input: {
    model: ImageConditionedSegmentationModel;
    imagePixelsByImageId?: ReadonlyMap<string, ImagePixelData>;
  }) {
    this.model = loadImageConditionedSegmentationModel(input.model);
    this.targets = this.model.trainedRegions;
    this.imagePixelsByImageId = input.imagePixelsByImageId ?? new Map();
  }

  async initialize(): Promise<void> {
    this.ready = true;
  }

  async warmup(): Promise<void> {
    this.ready = true;
  }

  async segment(input: SegmentationProviderInput): Promise<CosmeticSegmentationResult> {
    if (!this.ready) await this.initialize();
    const imagePixels = this.imagePixelsByImageId.get(input.image.id);
    const requestedTargets = input.targets ?? this.targets;
    const masks = input.cosmeticRegions
      .filter((region) => requestedTargets.includes(cosmeticRegionToSegmentationTarget(region)))
      .map((region) => {
        const target = cosmeticRegionToSegmentationTarget(region);
        const regionModel = this.model.regionModels[target];
        if (!imagePixels || !regionModel) {
          return refineCosmeticRegionMask(region, { imageId: input.image.id, gridSize: 32 });
        }
        return adaptImageConditionedPredictionToMask({
          imageId: input.image.id,
          imagePixels,
          region,
          regionModel,
        });
      });
    return {
      imageId: input.image.id,
      providerId: this.id,
      masks,
      debug: [
        {
          stage: 'segmentation-provider',
          label: imagePixels
            ? 'Image-conditioned baseline provider generated deterministic masks'
            : 'Image-conditioned baseline provider fell back because pixel data was missing',
          data: {
            modelId: this.model.modelId,
            maskCount: masks.length,
            pixelDataAvailable: Boolean(imagePixels),
          },
        },
      ],
    };
  }

  dispose(): void {
    this.ready = false;
  }
}

export const createImageConditionedSegmentationProvider = (input: {
  model: ImageConditionedSegmentationModel;
  imagePixelsByImageId?: ReadonlyMap<string, ImagePixelData>;
}): SegmentationProvider => new ImageConditionedSegmentationProvider(input);
