import {
  analyzeEdgeRings,
  analyzeSkinBaseline,
  analyzeWeightedMakeupPixels,
  type EdgeAnalysisResult,
  type ImagePixelData,
  type SkinBaselineAnalysis,
  type WeightedMakeupPixelAnalysis,
} from '../../pixel-analysis';
import type {
  CosmeticSegmentationMask,
  CosmeticSegmentationTarget,
} from '../../segmentation';

export type IncrementalRegionStage =
  | 'weighted-pixel-analysis'
  | 'skin-baseline'
  | 'edge-analysis';

export interface IncrementalRegionCacheEntry {
  target: CosmeticSegmentationTarget;
  maskId: string;
  maskSignature: string;
  stages: readonly IncrementalRegionStage[];
  weighted: WeightedMakeupPixelAnalysis;
  skinBaseline: SkinBaselineAnalysis;
  edgeAnalysis: EdgeAnalysisResult;
}

export interface IncrementalRegionCache {
  imageId: string;
  entries: Readonly<Record<string, IncrementalRegionCacheEntry>>;
}

export interface IncrementalRecomputeInput {
  imageId: string;
  pixelData: ImagePixelData;
  masks: readonly CosmeticSegmentationMask[];
  invalidatedTargets: readonly CosmeticSegmentationTarget[];
  previousCache?: IncrementalRegionCache;
}

export interface IncrementalRecomputeResult {
  cache: IncrementalRegionCache;
  recomputedTargets: CosmeticSegmentationTarget[];
  reusedTargets: CosmeticSegmentationTarget[];
  debug: string[];
}

export type BatchReanalysisMode = 'all-dirty' | 'selected';

export interface BatchIncrementalRecomputeInput
  extends Omit<IncrementalRecomputeInput, 'invalidatedTargets'> {
  dirtyTargets: readonly CosmeticSegmentationTarget[];
  selectedTargets?: readonly CosmeticSegmentationTarget[];
  mode: BatchReanalysisMode;
}

export interface BatchIncrementalRecomputeResult extends IncrementalRecomputeResult {
  mode: BatchReanalysisMode;
  invalidatedTargets: CosmeticSegmentationTarget[];
}

export const createMaskSignature = (
  mask: CosmeticSegmentationMask,
): string => {
  const alpha = mask.grid.alpha;
  const alphaSum = alpha.reduce((sum, value) => sum + value, 0);
  const first = alpha[0] ?? 0;
  const middle = alpha[Math.floor(alpha.length / 2)] ?? 0;
  const last = alpha[alpha.length - 1] ?? 0;

  return [
    mask.id,
    mask.target,
    mask.grid.width,
    mask.grid.height,
    alpha.length,
    alphaSum.toFixed(4),
    first.toFixed(4),
    middle.toFixed(4),
    last.toFixed(4),
  ].join(':');
};

const entryKey = (target: CosmeticSegmentationTarget): string => target;

export const resolveBatchReanalysisTargets = (input: {
  dirtyTargets: readonly CosmeticSegmentationTarget[];
  selectedTargets?: readonly CosmeticSegmentationTarget[];
  mode: BatchReanalysisMode;
}): CosmeticSegmentationTarget[] => {
  const source =
    input.mode === 'selected' && input.selectedTargets
      ? input.selectedTargets.filter((target) => input.dirtyTargets.includes(target))
      : input.dirtyTargets;

  return Array.from(new Set(source)).sort();
};

const recomputeEntry = (
  imageId: string,
  pixelData: ImagePixelData,
  mask: CosmeticSegmentationMask,
): IncrementalRegionCacheEntry => ({
  target: mask.target,
  maskId: mask.id,
  maskSignature: createMaskSignature(mask),
  stages: ['weighted-pixel-analysis', 'skin-baseline', 'edge-analysis'],
  weighted: analyzeWeightedMakeupPixels(imageId, pixelData, [mask]),
  skinBaseline: analyzeSkinBaseline(imageId, pixelData, [mask]),
  edgeAnalysis: analyzeEdgeRings(imageId, pixelData, [mask]),
});

export const recomputeInvalidatedRegions = (
  input: IncrementalRecomputeInput,
): IncrementalRecomputeResult => {
  const entries: Record<string, IncrementalRegionCacheEntry> = {};
  const invalidated = new Set(input.invalidatedTargets);
  const recomputedTargets: CosmeticSegmentationTarget[] = [];
  const reusedTargets: CosmeticSegmentationTarget[] = [];

  for (const mask of input.masks) {
    const key = entryKey(mask.target);
    const signature = createMaskSignature(mask);
    const previous = input.previousCache?.entries[key];

    if (
      previous &&
      previous.maskSignature === signature &&
      !invalidated.has(mask.target)
    ) {
      entries[key] = previous;
      reusedTargets.push(mask.target);
      continue;
    }

    entries[key] = recomputeEntry(input.imageId, input.pixelData, mask);
    recomputedTargets.push(mask.target);
  }

  return {
    cache: {
      imageId: input.imageId,
      entries,
    },
    recomputedTargets,
    reusedTargets,
    debug: [
      `recomputed:${recomputedTargets.join(',') || 'none'}`,
      `reused:${reusedTargets.join(',') || 'none'}`,
    ],
  };
};

export const recomputeBatchInvalidatedRegions = (
  input: BatchIncrementalRecomputeInput,
): BatchIncrementalRecomputeResult => {
  const invalidatedTargets = resolveBatchReanalysisTargets({
    dirtyTargets: input.dirtyTargets,
    selectedTargets: input.selectedTargets,
    mode: input.mode,
  });
  const recompute = recomputeInvalidatedRegions({
    imageId: input.imageId,
    pixelData: input.pixelData,
    masks: input.masks,
    invalidatedTargets,
    previousCache: input.previousCache,
  });

  return {
    ...recompute,
    mode: input.mode,
    invalidatedTargets,
    debug: [
      ...recompute.debug,
      `batch-mode:${input.mode}`,
      `batch-invalidated:${invalidatedTargets.join(',') || 'none'}`,
    ],
  };
};
