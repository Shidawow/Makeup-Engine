import type { BaselineSegmentationModel } from '../../../../training/schema/baseline-segmentation-model.schema';
import { refineCosmeticRegionMask } from '../../refinement';
import {
  cosmeticRegionToSegmentationTarget,
  type CosmeticSegmentationResult,
  type CosmeticSegmentationTarget,
} from '../../masks';
import type { SegmentationProvider, SegmentationProviderInput } from '../types';
import { getBaselineRegionPrior, loadBaselineSegmentationModel } from './baselineModelLoader';
import { predictBaselineMask } from './baselineMaskPredictor';

export class BaselineSegmentationProvider implements SegmentationProvider {
  id = 'baseline-mask-prior-provider';
  kind = 'baseline' as const;
  targets: CosmeticSegmentationTarget[];
  private ready = false;
  private readonly model: BaselineSegmentationModel;

  constructor(model: BaselineSegmentationModel) {
    this.model = loadBaselineSegmentationModel(model);
    this.targets = this.model.trainedRegions;
  }

  async initialize(): Promise<void> {
    this.ready = true;
  }

  async warmup(): Promise<void> {
    this.ready = true;
  }

  async segment(input: SegmentationProviderInput): Promise<CosmeticSegmentationResult> {
    if (!this.ready) {
      await this.initialize();
    }
    const requestedTargets = input.targets ?? this.targets;
    const masks = input.cosmeticRegions
      .filter((region) =>
        requestedTargets.includes(cosmeticRegionToSegmentationTarget(region)),
      )
      .map((region) => {
        const target = cosmeticRegionToSegmentationTarget(region);
        const prior = getBaselineRegionPrior(this.model, target);
        return prior
          ? predictBaselineMask({ imageId: input.image.id, region, prior })
          : refineCosmeticRegionMask(region, {
              imageId: input.image.id,
              gridSize: 32,
              featherRadius:
                region.kind === 'blush' || region.kind === 'contour' ? 0.065 : 0.035,
            });
      });

    return {
      imageId: input.image.id,
      providerId: this.id,
      masks,
      debug: [
        {
          stage: 'segmentation-provider',
          label: 'Baseline mask prior provider generated deterministic masks',
          data: {
            modelId: this.model.modelId,
            maskCount: masks.length,
            trainedRegionCount: this.model.trainedRegions.length,
          },
        },
      ],
    };
  }

  dispose(): void {
    this.ready = false;
  }
}

export const createBaselineSegmentationProvider = (
  model: BaselineSegmentationModel,
): SegmentationProvider => new BaselineSegmentationProvider(model);
