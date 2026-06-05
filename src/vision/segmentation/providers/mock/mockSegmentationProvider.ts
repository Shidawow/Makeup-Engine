import type { SegmentationProvider, SegmentationProviderInput } from '../types';
import {
  cosmeticRegionToSegmentationTarget,
  type CosmeticSegmentationResult,
  type CosmeticSegmentationTarget,
} from '../../masks';
import { refineCosmeticRegionMask } from '../../refinement';

export class MockSegmentationProvider implements SegmentationProvider {
  id = 'mock-segmentation-provider';
  kind = 'mock' as const;
  targets: CosmeticSegmentationTarget[] = [
    'lips',
    'eyeshadow',
    'eyeliner',
    'blush',
    'contour',
    'highlight',
  ];
  private ready = false;

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
      .map((region) =>
        refineCosmeticRegionMask(region, {
          imageId: input.image.id,
          gridSize: 32,
          featherRadius: region.kind === 'blush' || region.kind === 'contour' ? 0.065 : 0.035,
        }),
      );

    return {
      imageId: input.image.id,
      providerId: this.id,
      masks,
      debug: [
        {
          stage: 'segmentation-provider',
          label: 'Mock segmentation provider generated deterministic masks',
          data: {
            maskCount: masks.length,
            targetCount: requestedTargets.length,
          },
        },
      ],
    };
  }

  dispose(): void {
    this.ready = false;
  }
}

export const createMockSegmentationProvider = (): SegmentationProvider =>
  new MockSegmentationProvider();

