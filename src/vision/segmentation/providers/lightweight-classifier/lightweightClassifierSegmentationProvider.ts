import type { ImagePixelData, LightweightSegmentationClassifier } from '../../../../training/schema';
import { refineCosmeticRegionMask } from '../../refinement';
import { cosmeticRegionToSegmentationTarget, type CosmeticSegmentationResult, type CosmeticSegmentationTarget } from '../../masks';
import type { SegmentationProvider, SegmentationProviderInput } from '../types';
import { getLightweightRegionClassifier, loadLightweightSegmentationClassifier } from './lightweightClassifierModelLoader';
import { adaptLightweightClassifierPredictionToMask } from './lightweightClassifierPredictorAdapter';

export class LightweightClassifierSegmentationProvider implements SegmentationProvider {
  id = 'lightweight-classifier-segmentation-provider';
  kind = 'baseline' as const;
  targets: CosmeticSegmentationTarget[];
  private ready = false;
  private readonly model: LightweightSegmentationClassifier;
  private readonly imagePixelsByImageId: ReadonlyMap<string, ImagePixelData>;

  constructor(input: {
    model: LightweightSegmentationClassifier;
    imagePixelsByImageId?: ReadonlyMap<string, ImagePixelData>;
  }) {
    this.model = loadLightweightSegmentationClassifier(input.model);
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
        const classifier = getLightweightRegionClassifier(this.model, target);
        if (!imagePixels || !classifier) {
          return refineCosmeticRegionMask(region, { imageId: input.image.id, gridSize: 32 });
        }
        return adaptLightweightClassifierPredictionToMask({
          imageId: input.image.id,
          imagePixels,
          region,
          classifier,
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
            ? 'Lightweight classifier provider generated deterministic masks'
            : 'Lightweight classifier provider fell back because pixel data was missing',
          data: {
            modelId: this.model.modelId,
            classifierKind: this.model.classifierKind,
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

export const createLightweightClassifierSegmentationProvider = (input: {
  model: LightweightSegmentationClassifier;
  imagePixelsByImageId?: ReadonlyMap<string, ImagePixelData>;
}): SegmentationProvider => new LightweightClassifierSegmentationProvider(input);
