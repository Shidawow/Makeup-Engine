import { buildCosmeticRegionsFromFaceMesh } from '../cosmetic-regions';
import type { CosmeticRegionParameter } from '../cosmetic-regions';
import type { MakeupPhotoInput } from '../image-input';
import {
  parameterizeMakeupRegions,
  type MakeupParameterSchema,
} from '../makeup-parameters';
import {
  inferMakeupSemantics,
  type MakeupSemanticAnalysis,
} from '../makeup-semantics';
import {
  analyzeMakeupPixels,
  analyzeEdgeRings,
  analyzeSkinBaseline,
  analyzeWeightedMakeupPixels,
  type EdgeAnalysisResult,
  type ImagePixelData,
  type MakeupPixelAnalysis,
  type SkinBaselineAnalysis,
  type WeightedMakeupPixelAnalysis,
} from '../pixel-analysis';
import {
  runCosmeticSegmentation,
  type CosmeticSegmentationResult,
  editableMasksToSegmentationMasks,
  type CosmeticSegmentationMask,
  type CosmeticSegmentationTarget,
  type EditableCosmeticMask,
  type SegmentationProvider,
} from '../segmentation';
import {
  recomputeBatchInvalidatedRegions,
  recomputeInvalidatedRegions,
  type BatchReanalysisMode,
  type IncrementalRegionCache,
} from './incremental';
import type {
  FaceMeshGeometry,
  VisionDebugArtifact,
  VisionFaceDetection,
  VisionProvider,
  VisionSegmentationMask,
} from '../providers';

export type MakeupAnalysisPipelineStage =
  | 'image-input'
  | 'face-detection'
  | 'landmarks'
  | 'segmentation'
  | 'cosmetic-regions'
  | 'segmentation-analysis'
  | 'mask-reanalysis'
  | 'batch-mask-reanalysis'
  | 'weighted-pixel-analysis'
  | 'pixel-analysis'
  | 'semantic-analysis'
  | 'makeup-analysis'
  | 'template-parameterization';

export interface MakeupAnalysisDebugArtifact {
  stage: MakeupAnalysisPipelineStage;
  label: string;
  data: Record<string, string | number | boolean>;
}

export interface MakeupAnalysisPipelineInput {
  image: MakeupPhotoInput;
  provider: VisionProvider;
  segmentationProvider?: SegmentationProvider;
  pixelData?: ImagePixelData;
  editableMasks?: readonly EditableCosmeticMask[];
}

export interface MakeupAnalysisPipelineResult {
  imageId: string;
  providerId: string;
  faceDetection: VisionFaceDetection;
  faceMesh: FaceMeshGeometry;
  segmentationMasks: VisionSegmentationMask[];
  cosmeticRegions: CosmeticRegionParameter[];
  cosmeticSegmentation: CosmeticSegmentationResult;
  pixelAnalysis?: MakeupPixelAnalysis;
  semanticAnalysis?: MakeupSemanticAnalysis;
  parameters: MakeupParameterSchema;
  trace: MakeupAnalysisPipelineStage[];
  debug: MakeupAnalysisDebugArtifact[];
}

export interface MakeupMaskReanalysisInput {
  previous: MakeupAnalysisPipelineResult;
  pixelData: ImagePixelData;
  editableMasks: readonly EditableCosmeticMask[];
  invalidatedTargets: readonly CosmeticSegmentationTarget[];
  previousCache?: IncrementalRegionCache;
}

export interface MakeupMaskReanalysisResult {
  analysis: MakeupAnalysisPipelineResult;
  cache: IncrementalRegionCache;
  recomputedTargets: CosmeticSegmentationTarget[];
  reusedTargets: CosmeticSegmentationTarget[];
}

export interface MakeupBatchMaskReanalysisInput {
  previous: MakeupAnalysisPipelineResult;
  pixelData: ImagePixelData;
  editableMasks: readonly EditableCosmeticMask[];
  dirtyTargets: readonly CosmeticSegmentationTarget[];
  selectedTargets?: readonly CosmeticSegmentationTarget[];
  mode: BatchReanalysisMode;
  previousCache?: IncrementalRegionCache;
}

export interface MakeupBatchMaskReanalysisResult extends MakeupMaskReanalysisResult {
  mode: BatchReanalysisMode;
  invalidatedTargets: CosmeticSegmentationTarget[];
}

const toPipelineDebug = (
  artifact: VisionDebugArtifact,
): MakeupAnalysisDebugArtifact => ({
  stage: artifact.stage,
  label: artifact.label,
  data: artifact.data,
});

const createEditableSegmentationResult = (
  imageId: string,
  providerId: string,
  masks: readonly CosmeticSegmentationMask[],
): CosmeticSegmentationResult => ({
  imageId,
  providerId,
  masks: [...masks],
  debug: masks.map((mask) => ({
    stage: 'segmentation-debug',
    label: `Human-adjusted ${mask.target} mask`,
    target: mask.target,
    data: {
      maskId: mask.id,
      confidence: mask.confidence,
      gridWidth: mask.grid.width,
      gridHeight: mask.grid.height,
    },
  })),
});

const analyzePixelsWithSegmentationMasks = (
  imageId: string,
  pixelData: ImagePixelData,
  cosmeticRegions: CosmeticRegionParameter[],
  masks: CosmeticSegmentationMask[],
): MakeupPixelAnalysis => {
  const weighted = analyzeWeightedMakeupPixels(
    imageId,
    pixelData,
    masks,
  );
  const skinBaseline = analyzeSkinBaseline(
    imageId,
    pixelData,
    masks,
  );
  const edgeAnalysis = analyzeEdgeRings(
    imageId,
    pixelData,
    masks,
  );
  const polygonFallback = analyzeMakeupPixels(
    imageId,
    pixelData,
    cosmeticRegions,
  );

  return {
    ...polygonFallback,
    lips: {
      ...polygonFallback.lips,
      dominantHue:
        weighted.samples.lips?.weightedHsvMean.hue ??
        polygonFallback.lips.dominantHue,
      saturation:
        weighted.samples.lips?.weightedSaturation ??
        polygonFallback.lips.saturation,
      brightness:
        weighted.samples.lips?.weightedBrightness ??
        polygonFallback.lips.brightness,
      edgeSoftness:
        edgeAnalysis.features.lips?.edgeSoftnessScore ??
        polygonFallback.lips.edgeSoftness,
      gradientDirection:
        edgeAnalysis.features.lips?.gradientDirection ??
        polygonFallback.lips.gradientDirection,
    },
    blush: {
      ...polygonFallback.blush,
      opacity:
        skinBaseline.differences.blush?.opacityEstimate ??
        weighted.samples.blush?.weightedOpacity ??
        polygonFallback.blush.opacity,
    },
    eyes: {
      ...polygonFallback.eyes,
      eyeshadowDarkness:
        skinBaseline.differences.eyeshadow?.opacityEstimate ??
        polygonFallback.eyes.eyeshadowDarkness,
    },
    weighted,
    skinBaseline,
    edgeAnalysis,
    debug: [
      ...polygonFallback.debug,
      {
        region: 'lips',
        sampleCount: weighted.samples.lips?.sampleCount ?? 0,
        notes: [
          'Weighted mask sampling used for lip color and edge analysis.',
          ...weighted.debug.samplingStatistics,
          ...edgeAnalysis.debug,
        ],
      },
      {
        region: 'blush',
        sampleCount: weighted.samples.blush?.sampleCount ?? 0,
        notes: [
          'Skin baseline sampling used for blush opacity estimation.',
          ...skinBaseline.debug,
        ],
      },
    ],
  };
};

const mergeWeightedAnalysisFromCache = (
  imageId: string,
  cache: IncrementalRegionCache,
): WeightedMakeupPixelAnalysis => {
  const samples: WeightedMakeupPixelAnalysis['samples'] = {};
  const weightedHeatmap: string[] = [];
  const samplingStatistics: string[] = [];

  for (const entry of Object.values(cache.entries).sort((a, b) =>
    a.target.localeCompare(b.target),
  )) {
    for (const [key, sample] of Object.entries(entry.weighted.samples) as Array<
      [keyof WeightedMakeupPixelAnalysis['samples'], WeightedMakeupPixelAnalysis['samples'][keyof WeightedMakeupPixelAnalysis['samples']]]
    >) {
      if (sample) {
        samples[key] = sample;
      }
    }
    weightedHeatmap.push(...entry.weighted.debug.weightedHeatmap);
    samplingStatistics.push(...entry.weighted.debug.samplingStatistics);
  }

  return {
    version: '0.1',
    imageId,
    samples,
    debug: {
      weightedHeatmap,
      samplingStatistics,
    },
  };
};

const mergeSkinBaselineFromCache = (
  imageId: string,
  cache: IncrementalRegionCache,
): SkinBaselineAnalysis => {
  const differences: SkinBaselineAnalysis['differences'] = {};
  const debug: string[] = [];

  for (const entry of Object.values(cache.entries).sort((a, b) =>
    a.target.localeCompare(b.target),
  )) {
    for (const [key, difference] of Object.entries(entry.skinBaseline.differences) as Array<
      [keyof SkinBaselineAnalysis['differences'], SkinBaselineAnalysis['differences'][keyof SkinBaselineAnalysis['differences']]]
    >) {
      if (difference) {
        differences[key] = difference;
      }
    }
    debug.push(...entry.skinBaseline.debug);
  }

  return {
    version: '0.1',
    imageId,
    differences,
    debug,
  };
};

const mergeEdgeAnalysisFromCache = (
  imageId: string,
  cache: IncrementalRegionCache,
): EdgeAnalysisResult => {
  const features: EdgeAnalysisResult['features'] = {};
  const debug: string[] = [];

  for (const entry of Object.values(cache.entries).sort((a, b) =>
    a.target.localeCompare(b.target),
  )) {
    for (const [key, feature] of Object.entries(entry.edgeAnalysis.features) as Array<
      [keyof EdgeAnalysisResult['features'], EdgeAnalysisResult['features'][keyof EdgeAnalysisResult['features']]]
    >) {
      if (feature) {
        features[key] = feature;
      }
    }
    debug.push(...entry.edgeAnalysis.debug);
  }

  return {
    version: '0.1',
    imageId,
    features,
    debug,
  };
};

const createBatchPixelAnalysisFromIncrementalCache = (input: {
  previous: MakeupAnalysisPipelineResult;
  pixelData: ImagePixelData;
  masks: CosmeticSegmentationMask[];
  cache: IncrementalRegionCache;
  invalidatedTargets: readonly CosmeticSegmentationTarget[];
}): MakeupPixelAnalysis => {
  const previousPixel =
    input.previous.pixelAnalysis ??
    analyzePixelsWithSegmentationMasks(
      input.previous.imageId,
      input.pixelData,
      input.previous.cosmeticRegions,
      input.masks,
    );
  const weighted = mergeWeightedAnalysisFromCache(
    input.previous.imageId,
    input.cache,
  );
  const skinBaseline = mergeSkinBaselineFromCache(
    input.previous.imageId,
    input.cache,
  );
  const edgeAnalysis = mergeEdgeAnalysisFromCache(
    input.previous.imageId,
    input.cache,
  );
  const dirty = new Set(input.invalidatedTargets);

  return {
    ...previousPixel,
    lips: dirty.has('lips')
      ? {
          ...previousPixel.lips,
          dominantHue:
            weighted.samples.lips?.weightedHsvMean.hue ??
            previousPixel.lips.dominantHue,
          saturation:
            weighted.samples.lips?.weightedSaturation ??
            previousPixel.lips.saturation,
          brightness:
            weighted.samples.lips?.weightedBrightness ??
            previousPixel.lips.brightness,
          edgeSoftness:
            edgeAnalysis.features.lips?.edgeSoftnessScore ??
            previousPixel.lips.edgeSoftness,
          gradientDirection:
            edgeAnalysis.features.lips?.gradientDirection ??
            previousPixel.lips.gradientDirection,
        }
      : previousPixel.lips,
    blush: dirty.has('blush')
      ? {
          ...previousPixel.blush,
          opacity:
            skinBaseline.differences.blush?.opacityEstimate ??
            weighted.samples.blush?.weightedOpacity ??
            previousPixel.blush.opacity,
        }
      : previousPixel.blush,
    eyes: dirty.has('eyeshadow') || dirty.has('eyeliner')
      ? {
          ...previousPixel.eyes,
          eyeshadowDarkness:
            skinBaseline.differences.eyeshadow?.opacityEstimate ??
            previousPixel.eyes.eyeshadowDarkness,
        }
      : previousPixel.eyes,
    weighted,
    skinBaseline,
    edgeAnalysis,
    debug: [
      ...previousPixel.debug,
      {
        region: 'lips',
        sampleCount: weighted.samples.lips?.sampleCount ?? 0,
        notes: [
          `Batch incremental targets: ${input.invalidatedTargets.join(',') || 'none'}.`,
        ],
      },
    ],
  };
};

export const runMakeupAnalysisPipeline = async (
  input: MakeupAnalysisPipelineInput,
): Promise<MakeupAnalysisPipelineResult> => {
  const trace: MakeupAnalysisPipelineStage[] = ['image-input'];
  const providerResult = await input.provider.analyze(input.image);

  trace.push('face-detection');
  if (!providerResult.faceDetection.detected) {
    throw new Error(`No face detected for image ${input.image.id}.`);
  }

  trace.push('landmarks');
  if (providerResult.faceMesh.landmarks.length < 3) {
    throw new Error(`FaceMesh landmarks are insufficient for ${input.image.id}.`);
  }

  trace.push('segmentation');
  const segmentationMasks = providerResult.segmentationMasks;

  trace.push('cosmetic-regions');
  const cosmeticRegions = buildCosmeticRegionsFromFaceMesh({
    imageId: input.image.id,
    faceMesh: providerResult.faceMesh,
    segmentationMasks,
  });

  trace.push('segmentation-analysis');
  const generatedCosmeticSegmentation = await runCosmeticSegmentation({
    image: input.image,
    faceMesh: providerResult.faceMesh,
    cosmeticRegions,
    pixelData: input.pixelData,
    provider: input.segmentationProvider,
  });
  const editableSegmentationMasks = input.editableMasks
    ? editableMasksToSegmentationMasks(input.editableMasks)
    : undefined;
  const cosmeticSegmentation = editableSegmentationMasks
    ? createEditableSegmentationResult(
        input.image.id,
        `${generatedCosmeticSegmentation.providerId}+human-edit`,
        editableSegmentationMasks,
      )
    : generatedCosmeticSegmentation;

  if (editableSegmentationMasks) {
    trace.push('mask-reanalysis');
  }

  let pixelAnalysis: MakeupPixelAnalysis | undefined;
  let semanticAnalysis: MakeupSemanticAnalysis | undefined;

  if (input.pixelData) {
    if (cosmeticSegmentation.masks.length > 0) {
      trace.push('weighted-pixel-analysis');
      pixelAnalysis = analyzePixelsWithSegmentationMasks(
        input.image.id,
        input.pixelData,
        cosmeticRegions,
        cosmeticSegmentation.masks,
      );
    } else {
      trace.push('pixel-analysis');
      pixelAnalysis = analyzeMakeupPixels(
        input.image.id,
        input.pixelData,
        cosmeticRegions,
      );
    }
    trace.push('semantic-analysis');
    semanticAnalysis = inferMakeupSemantics(pixelAnalysis);
  }

  trace.push('makeup-analysis');
  const regionConfidence = cosmeticRegions.reduce(
    (sum, region) => sum + region.confidence,
    0,
  );
  const averageRegionConfidence = Number(
    (regionConfidence / cosmeticRegions.length).toFixed(3),
  );

  trace.push('template-parameterization');
  const parameters = parameterizeMakeupRegions(
    input.image.id,
    providerResult.faceMesh.faceId,
    cosmeticRegions,
    pixelAnalysis,
    semanticAnalysis,
  );

  return {
    imageId: input.image.id,
    providerId: input.provider.id,
    faceDetection: providerResult.faceDetection,
    faceMesh: providerResult.faceMesh,
    segmentationMasks,
    cosmeticRegions,
    cosmeticSegmentation,
    pixelAnalysis,
    semanticAnalysis,
    parameters,
    trace,
    debug: [
      ...providerResult.debug.map(toPipelineDebug),
      {
        stage: 'cosmetic-regions',
        label: 'Parameterized cosmetic regions',
        data: {
          regionCount: cosmeticRegions.length,
          averageRegionConfidence,
        },
      },
      ...cosmeticSegmentation.debug.map((artifact) => ({
        stage: 'segmentation-analysis' as const,
        label: artifact.label,
        data: artifact.data,
      })),
      ...(pixelAnalysis?.weighted
        ? [
            {
              stage: 'weighted-pixel-analysis' as const,
              label: 'Weighted mask sampling statistics',
              data: {
                weightedSampleGroups: Object.keys(pixelAnalysis.weighted.samples).length,
                weightedHeatmapCount: pixelAnalysis.weighted.debug.weightedHeatmap.length,
                opacityDiagnostics: pixelAnalysis.skinBaseline?.debug.length ?? 0,
                edgeDiagnostics: pixelAnalysis.edgeAnalysis?.debug.length ?? 0,
              },
            },
          ]
        : []),
      ...(editableSegmentationMasks
        ? [
            {
              stage: 'mask-reanalysis' as const,
              label: 'Human-edited masks used for weighted analysis',
              data: {
                editableMaskCount: editableSegmentationMasks.length,
                humanAdjustedTargets: editableSegmentationMasks
                  .map((mask) => mask.target)
                  .join(','),
              },
            },
          ]
        : []),
      {
        stage: 'template-parameterization',
        label: 'Editable makeup parameter schema',
        data: {
          editableRegionCount: parameters.editableRegionIds.length,
          signalCount: parameters.templateSignals.length,
          semanticSignalCount: parameters.semanticSummary.length,
        },
      },
    ],
  };
};

export const reanalyzeMakeupWithEditableMasks = (
  input: MakeupMaskReanalysisInput,
): MakeupMaskReanalysisResult => {
  const masks = editableMasksToSegmentationMasks(input.editableMasks);
  const cosmeticSegmentation = createEditableSegmentationResult(
    input.previous.imageId,
    `${input.previous.cosmeticSegmentation.providerId}+human-edit`,
    masks,
  );
  const incremental = recomputeInvalidatedRegions({
    imageId: input.previous.imageId,
    pixelData: input.pixelData,
    masks,
    invalidatedTargets: input.invalidatedTargets,
    previousCache: input.previousCache,
  });
  const pixelAnalysis = analyzePixelsWithSegmentationMasks(
    input.previous.imageId,
    input.pixelData,
    input.previous.cosmeticRegions,
    masks,
  );
  const semanticAnalysis = inferMakeupSemantics(pixelAnalysis);
  const parameters = parameterizeMakeupRegions(
    input.previous.imageId,
    input.previous.faceMesh.faceId,
    input.previous.cosmeticRegions,
    pixelAnalysis,
    semanticAnalysis,
  );
  const trace: MakeupAnalysisPipelineStage[] = [
    ...input.previous.trace.filter((stage) => stage !== 'template-parameterization'),
    'mask-reanalysis',
    'weighted-pixel-analysis',
    'semantic-analysis',
    'template-parameterization',
  ];

  return {
    analysis: {
      ...input.previous,
      cosmeticSegmentation,
      pixelAnalysis,
      semanticAnalysis,
      parameters,
      trace,
      debug: [
        ...input.previous.debug,
        {
          stage: 'mask-reanalysis',
          label: 'Incremental mask reanalysis',
          data: {
            editableMaskCount: input.editableMasks.length,
            recomputedTargets: incremental.recomputedTargets.join(',') || 'none',
            reusedTargets: incremental.reusedTargets.join(',') || 'none',
          },
        },
        {
          stage: 'weighted-pixel-analysis',
          label: 'Weighted sampling after human correction',
          data: {
            weightedSampleGroups: Object.keys(pixelAnalysis.weighted?.samples ?? {}).length,
            skinBaselineGroups: Object.keys(pixelAnalysis.skinBaseline?.differences ?? {}).length,
            edgeGroups: Object.keys(pixelAnalysis.edgeAnalysis?.features ?? {}).length,
          },
        },
      ],
    },
    cache: incremental.cache,
    recomputedTargets: incremental.recomputedTargets,
    reusedTargets: incremental.reusedTargets,
  };
};

export const reanalyzeMakeupWithEditableMasksBatch = (
  input: MakeupBatchMaskReanalysisInput,
): MakeupBatchMaskReanalysisResult => {
  const masks = editableMasksToSegmentationMasks(input.editableMasks);
  const cosmeticSegmentation = createEditableSegmentationResult(
    input.previous.imageId,
    `${input.previous.cosmeticSegmentation.providerId}+human-batch-edit`,
    masks,
  );
  const incremental = recomputeBatchInvalidatedRegions({
    imageId: input.previous.imageId,
    pixelData: input.pixelData,
    masks,
    dirtyTargets: input.dirtyTargets,
    selectedTargets: input.selectedTargets,
    mode: input.mode,
    previousCache: input.previousCache,
  });
  const pixelAnalysis = createBatchPixelAnalysisFromIncrementalCache({
    previous: input.previous,
    pixelData: input.pixelData,
    masks,
    cache: incremental.cache,
    invalidatedTargets: incremental.invalidatedTargets,
  });
  const semanticAnalysis = inferMakeupSemantics(pixelAnalysis);
  const parameters = parameterizeMakeupRegions(
    input.previous.imageId,
    input.previous.faceMesh.faceId,
    input.previous.cosmeticRegions,
    pixelAnalysis,
    semanticAnalysis,
  );
  const trace: MakeupAnalysisPipelineStage[] = [
    ...input.previous.trace.filter((stage) => stage !== 'template-parameterization'),
    'batch-mask-reanalysis',
    'weighted-pixel-analysis',
    'semantic-analysis',
    'template-parameterization',
  ];

  return {
    analysis: {
      ...input.previous,
      cosmeticSegmentation,
      pixelAnalysis,
      semanticAnalysis,
      parameters,
      trace,
      debug: [
        ...input.previous.debug,
        {
          stage: 'batch-mask-reanalysis',
          label: 'Batch incremental mask reanalysis',
          data: {
            mode: input.mode,
            editableMaskCount: input.editableMasks.length,
            invalidatedTargets: incremental.invalidatedTargets.join(',') || 'none',
            recomputedTargets: incremental.recomputedTargets.join(',') || 'none',
            reusedTargets: incremental.reusedTargets.join(',') || 'none',
          },
        },
        {
          stage: 'weighted-pixel-analysis',
          label: 'Batch weighted sampling after human corrections',
          data: {
            weightedSampleGroups: Object.keys(pixelAnalysis.weighted?.samples ?? {}).length,
            skinBaselineGroups: Object.keys(pixelAnalysis.skinBaseline?.differences ?? {}).length,
            edgeGroups: Object.keys(pixelAnalysis.edgeAnalysis?.features ?? {}).length,
          },
        },
      ],
    },
    cache: incremental.cache,
    recomputedTargets: incremental.recomputedTargets,
    reusedTargets: incremental.reusedTargets,
    mode: incremental.mode,
    invalidatedTargets: incremental.invalidatedTargets,
  };
};
