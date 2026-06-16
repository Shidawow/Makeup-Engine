import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ImageUp,
  Layers,
  Loader2,
  ScanFace,
  SlidersHorizontal,
} from 'lucide-react';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  createMediaPipeFaceMeshProvider,
  createMockVisionProvider,
  formatVisionAnalysisErrorForUser,
  hasEditableMaskChanges,
  loadImagePixelDataFromUrl,
  recomputeInvalidatedRegions,
  reanalyzeMakeupWithEditableMasksBatch,
  reanalyzeMakeupWithEditableMasks,
  redoMaskEdit,
  resetEditableMaskToBase,
  restoreEditableMaskSnapshot,
  runMakeupAnalysisPipeline,
  shouldUseVisionAnalysisDevelopmentFallback,
  undoMaskEdit,
  evaluateFaceMeshRegionQa,
  type CosmeticSegmentationTarget,
  type EditableCosmeticMask,
  type ImagePixelData,
  type IncrementalRegionCache,
  type MakeupAnalysisPipelineResult,
  type MakeupPhotoInput,
  type MaskBrushPoint,
  type VisionProvider,
} from '../../vision';
import {
  buildTemplateStudioWorkflowState,
  buildMakeupTemplateFromVisionAnalysis,
  convergeTemplateWithHumanCorrections,
  createTemplateDraftReviewWorkflow,
  diffTemplatesForConvergence,
  evaluateTemplateDraftHumanReview,
  evaluateTemplateDraftQa,
  generateMakeupAttributeCandidates,
  generateMakeupTemplateDraft,
  generateRuleBasedStepSequence,
  summarizeBatchTaskIssues,
  summarizeTemplateProductionBatch,
  updateProductionTaskFromAnalysis,
} from '../../template-engine';
import {
  createHumanCorrectionDataset,
  assignReviewItemSplit,
  autoAssignReviewQueueSplits,
  batchAcceptReviewItems,
  batchRejectReviewItems,
  createDatasetReplayPayload,
  createDatasetReviewQueue,
  computeDatasetCurationMetrics,
  createSegmentationTrainingManifest,
  exportDatasetManifest,
  exportCorrectionDatasetJsonBundle,
  exportCorrectionDatasetJsonl,
  exportCurationMetricsJson,
  exportManifestJson,
  exportReviewedDatasetJson,
  exportReviewedDatasetJsonl,
  exportTrainingManifestJson,
  exportOfflineTrainingPackageJson,
  exportOfflineTrainingPackageManifestJson,
  exportOperatorAuditReportJson,
  createOfflineTrainingPackage,
  validateOfflineTrainingPackage,
  summarizeOfflinePackage,
  exportTrainSplitManifestJson,
  exportValidationSplitManifestJson,
  exportTestSplitManifestJson,
  applyVisionCorrectionToEditableMask,
  createVisionCorrectionRecord,
  markReviewItemsNeedsSecondReview,
  runQualityGate,
  serializeVisionCorrectionSnapshot,
  visionCorrectionStorage,
  type VisionCorrectionRecord,
  loadTemplateAnalysisSeedImageData,
} from '../../templates/storage';
import type {
  DatasetReplayPayload,
  DatasetReviewQueue,
  DatasetQualityStatus,
  DatasetSplit,
  OfflineTrainingPackage,
  SegmentationTrainingManifest,
  TemplateAnalysisSeed,
} from '../../templates/schema';
import { ConvergenceDiffPanel } from './ConvergenceDiffPanel';
import { CorrectionPersistencePanel } from './CorrectionPersistencePanel';
import { DatasetPanel } from './dataset-panel';
import { DatasetCurationPanel } from './dataset-curation-panel';
import {
  DatasetReviewPanel,
  type DatasetReviewFilter,
} from './dataset-review-panel';
import { DatasetReplayViewer } from './dataset-replay-viewer';
import { EvidencePanel } from './evidence-panel';
import { FaceMeshMakeupIntelligencePanel } from './FaceMeshMakeupIntelligencePanel';
import { TrainingAdapterPanel } from './training-adapter-panel';
import { OfflinePackagePanel } from './offline-package-panel';
import { SourceImageIntakePanel } from './source-image-intake-panel';
import {
  TemplateProductionBatchPanel,
  type TemplateProductionTaskFilter,
} from './template-production-batch-panel';
import { TemplateLibraryPanel } from './template-library-panel';
import { TemplatePackagePreview } from './template-package-preview';
import { UserAppTemplatePreview } from './user-app-template-preview';
import { UserAppPrototypeConsumerPanel } from './user-app-prototype-consumer-panel';
import { UserAppShell } from '../user-app';
import type {
  BrowserArtifactResource,
  SourceImageArtifactBindingMap,
  TemplateLibrary,
  TemplateLibraryEntry,
  TemplatePublishPackage,
  UserAppCompatibilityTarget,
  UserAppTemplatePackage,
} from '../../templates/schema';
import type {
  TemplateProductionBatch,
  TemplateProductionTask,
} from '../../templates/schema/template-production-batch.schema';
import type { SourceImageManifest } from '../../training/schema';
import { MaskCanvasInteractionLayer } from './MaskCanvasInteractionLayer';
import {
  MaskEditingToolbar,
  type StudioBrushTool,
} from './MaskEditingToolbar';
import { MaskHistoryPanel } from './MaskHistoryPanel';
import {
  defaultVisionDebugLayers,
  type OverlayBeforeAfterMode,
  type VisionDebugOverlayData,
  type VisionDebugOverlayLayers,
} from './vision-debug-overlay';

const layerLabels: Record<keyof VisionDebugOverlayLayers, string> = {
  faceBox: '人脸框',
  landmarks: '关键点',
  lips: '唇部',
  eyes: '眼部',
  brows: '眉毛',
  blush: '腮红',
  contour: '修容',
  highlight: '高光',
  segmentationMasks: '分割蒙版',
  alphaHeatmap: '透明度热力图',
  blendedMask: '融合蒙版',
  weightedSampling: '加权采样',
  skinBaseline: '肤色基线',
  edgeRings: '边缘环',
  editableMasks: '可编辑蒙版',
  userCorrections: '人工修正',
  recomputeRegions: '重算区域',
  convergenceDiff: '模板差异',
  brushCursor: '笔刷光标',
  activeRegionHighlight: '当前区域',
  beforeAfter: '修正前后',
};

type StudioMode = 'admin' | 'developer';

const uniqueTargets = (
  targets: readonly CosmeticSegmentationTarget[],
): CosmeticSegmentationTarget[] => Array.from(new Set(targets));

const createPhotoInput = (file: File, imageUrl: string): MakeupPhotoInput => ({
  id: `studio-${Date.now()}`,
  fileName: file.name,
  mimeType: file.type || 'image/unknown',
  sizeBytes: file.size,
  source: 'admin-upload',
  imageUrl,
  uploadedBy: 'template-studio',
  uploadedAt: new Date().toISOString(),
});

const createPhotoInputFromSeed = (
  seed: TemplateAnalysisSeed,
  imageUrl: string,
): MakeupPhotoInput => ({
  id: `studio-seed-${seed.seedId}`,
  fileName: seed.originalFileName,
  mimeType: seed.normalizedPngReference?.format === 'png-image'
    ? 'image/png'
    : 'image/source-image-seed',
  sizeBytes: 0,
  source: 'import',
  imageUrl,
  uploadedBy: 'source-image-package',
  uploadedAt: seed.createdAt,
});

const downloadJson = (fileName: string, json: string) => {
  if (typeof document === 'undefined' || typeof URL === 'undefined') {
    return;
  }

  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

const replaceProductionTaskInBatch = (
  batch: TemplateProductionBatch,
  taskId: string,
  updater: (task: TemplateProductionTask) => TemplateProductionTask,
): TemplateProductionBatch => {
  const updatedAt = new Date().toISOString();
  const tasks = batch.tasks.map((task) => (task.taskId === taskId ? updater(task) : task));
  const nextBatch: TemplateProductionBatch = {
    ...batch,
    tasks,
    issues: summarizeBatchTaskIssues(tasks),
    updatedAt,
  };

  return {
    ...nextBatch,
    summary: summarizeTemplateProductionBatch(nextBatch),
  };
};

export function TemplateStudio() {
  const providerRef = useRef<ReturnType<typeof createMediaPipeFaceMeshProvider> | null>(
    null,
  );
  const editSequenceRef = useRef(0);
  const [photo, setPhoto] = useState<MakeupPhotoInput | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState<MakeupAnalysisPipelineResult | null>(
    null,
  );
  const [aiOnlyAnalysis, setAiOnlyAnalysis] =
    useState<MakeupAnalysisPipelineResult | null>(null);
  const [pixelData, setPixelData] = useState<ImagePixelData | null>(null);
  const [incrementalCache, setIncrementalCache] =
    useState<IncrementalRegionCache | null>(null);
  const [editableMasks, setEditableMasks] = useState<EditableCosmeticMask[]>([]);
  const [activeRegion, setActiveRegion] =
    useState<CosmeticSegmentationTarget>('lips');
  const [brushTool, setBrushTool] = useState<StudioBrushTool>('brush-add');
  const [brushSize, setBrushSize] = useState(0.06);
  const [featherStrength, setFeatherStrength] = useState(0.55);
  const [dirtyRegions, setDirtyRegions] = useState<CosmeticSegmentationTarget[]>([]);
  const [verifiedRegions, setVerifiedRegions] = useState<CosmeticSegmentationTarget[]>([]);
  const [recomputeRegions, setRecomputeRegions] = useState<CosmeticSegmentationTarget[]>([]);
  const [beforeAfterMode, setBeforeAfterMode] =
    useState<OverlayBeforeAfterMode>('after');
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [layers, setLayers] = useState<VisionDebugOverlayLayers>({
    ...defaultVisionDebugLayers,
    segmentationMasks: true,
    editableMasks: true,
    userCorrections: true,
    brushCursor: true,
    activeRegionHighlight: true,
    beforeAfter: true,
  });
  const [opacity, setOpacity] = useState(0.85);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtimeNotice, setRuntimeNotice] = useState<string | null>(null);
  const [status, setStatus] = useState('准备就绪');
  const [correctionRecords, setCorrectionRecords] = useState<VisionCorrectionRecord[]>(
    () => visionCorrectionStorage.list(),
  );
  const [selectedCorrectionId, setSelectedCorrectionId] = useState('');
  const [exportJson, setExportJson] = useState('');
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [reviewQueue, setReviewQueue] = useState<DatasetReviewQueue | null>(null);
  const [reviewFilter, setReviewFilter] =
    useState<DatasetReviewFilter>('pending_review');
  const [replayPayload, setReplayPayload] =
    useState<DatasetReplayPayload | null>(null);
  const [studioMode, setStudioMode] = useState<StudioMode>('admin');
  const [showOverlayControls, setShowOverlayControls] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [curationRegionFilter, setCurationRegionFilter] =
    useState<CosmeticSegmentationTarget | 'all'>('all');
  const [curationSplitFilter, setCurationSplitFilter] =
    useState<DatasetSplit | 'all'>('all');
  const [curationStatusFilter, setCurationStatusFilter] =
    useState<DatasetQualityStatus | 'all'>('all');
  const [trainingValidationStatus, setTrainingValidationStatus] = useState('');
  const [offlinePackage, setOfflinePackage] =
    useState<OfflineTrainingPackage | null>(null);
  const [activeTemplateAnalysisSeed, setActiveTemplateAnalysisSeed] =
    useState<TemplateAnalysisSeed | null>(null);
  const [activeArtifactBindings, setActiveArtifactBindings] =
    useState<SourceImageArtifactBindingMap>({});
  const [activeBoundArtifactResource, setActiveBoundArtifactResource] =
    useState<BrowserArtifactResource | null>(null);
  const [activeSourceImageManifest, setActiveSourceImageManifest] =
    useState<SourceImageManifest | null>(null);
  const [activeProductionBatch, setActiveProductionBatch] =
    useState<TemplateProductionBatch | null>(null);
  const [activeProductionTask, setActiveProductionTask] =
    useState<TemplateProductionTask | null>(null);
  const [selectedProductionTaskId, setSelectedProductionTaskId] = useState('');
  const [productionTaskFilter, setProductionTaskFilter] =
    useState<TemplateProductionTaskFilter>('all');
  const [activeTemplateLibrary, setActiveTemplateLibrary] =
    useState<TemplateLibrary | null>(null);
  const [activePublishPackage, setActivePublishPackage] =
    useState<TemplatePublishPackage | null>(null);
  const [activeUserAppTemplatePackage, setActiveUserAppTemplatePackage] =
    useState<UserAppTemplatePackage | null>(null);
  const [selectedLibraryEntryId, setSelectedLibraryEntryId] = useState('');
  const [selectedUserAppTemplateId, setSelectedUserAppTemplateId] = useState('');
  const [appCompatibilityTarget, setAppCompatibilityTarget] =
    useState<UserAppCompatibilityTarget>('web-app-v0');

  const provider = () => {
    if (!providerRef.current) {
      providerRef.current = createMediaPipeFaceMeshProvider();
    }

    return providerRef.current;
  };

  useEffect(
    () => () => {
      providerRef.current?.dispose();
    },
    [],
  );

  useEffect(
    () => () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    },
    [imageUrl],
  );

  const activeMask = useMemo(
    () => editableMasks.find((mask) => mask.mergedMask.target === activeRegion),
    [activeRegion, editableMasks],
  );

  const adjustedRegions = useMemo(
    () => uniqueTargets([...dirtyRegions, ...verifiedRegions]),
    [dirtyRegions, verifiedRegions],
  );

  const aiOnlyTemplate = useMemo(
    () =>
      photo && aiOnlyAnalysis
        ? buildMakeupTemplateFromVisionAnalysis({
            image: photo,
            templateName: `${photo.fileName} AI-only Template`,
            createdBy: 'template-studio',
            analysis: aiOnlyAnalysis,
          })
        : null,
    [aiOnlyAnalysis, photo],
  );

  const convergenceResult = useMemo(() => {
    if (!aiOnlyTemplate || !analysis) {
      return null;
    }

    return convergeTemplateWithHumanCorrections({
      template: aiOnlyTemplate,
      analysis,
      editableMasks,
      adjustedRegions,
      originalAnalysis: aiOnlyAnalysis ?? undefined,
      exportedAt: aiOnlyTemplate.metadata.createdAt,
      editorMetadata: {
        editorId: 'template-studio',
        tool: 'template-studio',
        sessionId: `${analysis.imageId}:${aiOnlyTemplate.id}`,
        editedAt: aiOnlyTemplate.metadata.createdAt,
        notes: ['local-template-studio-session'],
      },
      correctionReason: 'admin mask correction',
    });
  }, [adjustedRegions, aiOnlyAnalysis, aiOnlyTemplate, analysis, editableMasks]);

  const humanVerifiedTemplate = convergenceResult?.template ?? aiOnlyTemplate;
  const templateEvidence = convergenceResult?.evidence ?? humanVerifiedTemplate?.evidence ?? null;
  const correctionDatasetSamples = convergenceResult?.correctionDatasetSamples ?? [];

  const faceMeshRegionQa = useMemo(
    () =>
      analysis
        ? evaluateFaceMeshRegionQa({
            faceMesh: analysis.faceMesh,
            providerId: analysis.providerId,
          })
        : null,
    [analysis],
  );

  const makeupAttributeCandidates = useMemo(
    () =>
      faceMeshRegionQa
        ? generateMakeupAttributeCandidates({
            analysis,
            regionQa: faceMeshRegionQa,
          })
        : null,
    [analysis, faceMeshRegionQa],
  );

  const ruleBasedStepSequence = useMemo(
    () =>
      makeupAttributeCandidates
        ? generateRuleBasedStepSequence(makeupAttributeCandidates)
        : null,
    [makeupAttributeCandidates],
  );

  const makeupTemplateDraft = useMemo(
    () =>
      faceMeshRegionQa && makeupAttributeCandidates && ruleBasedStepSequence
        ? generateMakeupTemplateDraft({
            analysis,
            regionQa: faceMeshRegionQa,
            attributeCandidates: makeupAttributeCandidates,
            stepSequence: ruleBasedStepSequence,
          })
        : null,
    [analysis, faceMeshRegionQa, makeupAttributeCandidates, ruleBasedStepSequence],
  );

  const templateDraftQa = useMemo(
    () =>
      faceMeshRegionQa && makeupAttributeCandidates && ruleBasedStepSequence && makeupTemplateDraft
        ? evaluateTemplateDraftQa({
            regionQa: faceMeshRegionQa,
            attributeCandidates: makeupAttributeCandidates,
            stepSequence: ruleBasedStepSequence,
            templateDraft: makeupTemplateDraft,
          })
        : null,
    [faceMeshRegionQa, makeupAttributeCandidates, makeupTemplateDraft, ruleBasedStepSequence],
  );

  const templateDraftHumanReview = useMemo(
    () => (templateDraftQa ? evaluateTemplateDraftHumanReview({ qa: templateDraftQa }) : null),
    [templateDraftQa],
  );

  const templateDraftReviewWorkflow = useMemo(
    () =>
      templateDraftQa && templateDraftHumanReview
        ? createTemplateDraftReviewWorkflow({
            qa: templateDraftQa,
            review: templateDraftHumanReview,
          })
        : null,
    [templateDraftHumanReview, templateDraftQa],
  );

  const templateStudioWorkflow = useMemo(
    () =>
      buildTemplateStudioWorkflowState({
        regionQa: faceMeshRegionQa,
        attributeCandidates: makeupAttributeCandidates,
        stepSequence: ruleBasedStepSequence,
        templateDraft: makeupTemplateDraft,
        draftQa: templateDraftQa,
        humanReview: templateDraftHumanReview,
        reviewWorkflow: templateDraftReviewWorkflow,
      }),
    [
      faceMeshRegionQa,
      makeupAttributeCandidates,
      makeupTemplateDraft,
      ruleBasedStepSequence,
      templateDraftHumanReview,
      templateDraftQa,
      templateDraftReviewWorkflow,
    ],
  );

  const correctionDataset = useMemo(
    () =>
      photo && humanVerifiedTemplate
        ? createHumanCorrectionDataset({
            imageId: photo.id,
            templateId: humanVerifiedTemplate.id,
            samples: correctionDatasetSamples,
            createdAt: humanVerifiedTemplate.metadata.createdAt,
            exportedAt: humanVerifiedTemplate.metadata.createdAt,
            humanVerificationStatus:
              humanVerifiedTemplate.metadata.humanVerificationStatus ??
              'ai_generated',
            notes: ['template-studio-session'],
          })
        : null,
    [correctionDatasetSamples, humanVerifiedTemplate, photo],
  );

  useEffect(() => {
    if (!correctionDataset || correctionDataset.samples.length === 0) {
      setReviewQueue(null);
      setReplayPayload(null);
      return;
    }

    setReviewQueue(
      createDatasetReviewQueue({
        dataset: correctionDataset,
        evidence: templateEvidence,
        createdAt: correctionDataset.exportedAt,
        reviewerId: 'quality-gate',
      }),
    );
    setReplayPayload(null);
  }, [correctionDataset, templateEvidence]);

  const activeCorrectionSample = useMemo(
    () =>
      correctionDatasetSamples.find((sample) => sample.regionId === activeRegion) ??
      correctionDatasetSamples[0] ??
      null,
    [activeRegion, correctionDatasetSamples],
  );

  const qualityGateResult = useMemo(
    () =>
      activeCorrectionSample
        ? runQualityGate({
            sample: activeCorrectionSample,
            evidence: templateEvidence,
          })
        : null,
    [activeCorrectionSample, templateEvidence],
  );

  const convergenceDiff = useMemo(
    () =>
      aiOnlyTemplate && humanVerifiedTemplate
        ? diffTemplatesForConvergence({
            aiOnlyTemplate,
            humanVerifiedTemplate,
            editableMasks,
          })
        : null,
    [aiOnlyTemplate, editableMasks, humanVerifiedTemplate],
  );

  const datasetManifest = useMemo(
    () =>
      correctionDataset && reviewQueue
        ? exportDatasetManifest({
            dataset: correctionDataset,
            queue: reviewQueue,
            exportFormat: 'manifest',
            exportedAt: reviewQueue.updatedAt,
          })
        : null,
    [correctionDataset, reviewQueue],
  );

  const curationMetrics = useMemo(
    () =>
      correctionDataset && reviewQueue
        ? computeDatasetCurationMetrics({
            dataset: correctionDataset,
            queue: reviewQueue,
            manifest: datasetManifest,
            createdAt: reviewQueue.updatedAt,
          })
        : null,
    [correctionDataset, datasetManifest, reviewQueue],
  );

  const trainingManifest = useMemo<SegmentationTrainingManifest | null>(
    () =>
      correctionDataset && reviewQueue
        ? createSegmentationTrainingManifest({
            dataset: correctionDataset,
            queue: reviewQueue,
            createdAt: reviewQueue.updatedAt,
          })
        : null,
    [correctionDataset, reviewQueue],
  );

  useEffect(() => {
    setOfflinePackage(null);
  }, [correctionDataset?.datasetId, trainingManifest?.manifestId]);

  const overlayData = useMemo<VisionDebugOverlayData | null>(() => {
    if (!analysis) {
      return null;
    }

    const convergenceDiffRegions =
      convergenceDiff?.items
        .filter((item) => item.changed && item.region)
        .map((item) => item.region as CosmeticSegmentationTarget) ?? [];

    return {
      faceBox: analysis.faceDetection.box,
      faceMesh: analysis.faceMesh,
      cosmeticRegions: analysis.cosmeticRegions,
      cosmeticSegmentation: analysis.cosmeticSegmentation,
      aiOnlySegmentation: aiOnlyAnalysis?.cosmeticSegmentation,
      editableMasks,
      userCorrections: correctionRecords.map((record) => record.id),
      recomputeRegions,
      convergenceDiff: uniqueTargets(convergenceDiffRegions),
      convergenceDiffItems: convergenceDiff?.items,
      activeRegion,
      beforeAfterMode,
    };
  }, [
    activeRegion,
    aiOnlyAnalysis,
    analysis,
    beforeAfterMode,
    convergenceDiff,
    correctionRecords,
    editableMasks,
    recomputeRegions,
  ]);

  const markDirty = (region: CosmeticSegmentationTarget) => {
    setDirtyRegions((current) =>
      current.includes(region) ? current : [...current, region],
    );
  };

  const updateActiveMask = (
    updater: (mask: EditableCosmeticMask) => EditableCosmeticMask,
  ) => {
    setEditableMasks((current) =>
      current.map((mask) =>
        mask.mergedMask.target === activeRegion ? updater(mask) : mask,
      ),
    );
    markDirty(activeRegion);
    setRecomputeRegions((current) =>
      current.includes(activeRegion) ? current : [...current, activeRegion],
    );
    setLayers((current) => ({
      ...current,
      editableMasks: true,
      userCorrections: true,
      brushCursor: true,
      activeRegionHighlight: true,
    }));
  };

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    const nextImageUrl = URL.createObjectURL(file);

    setPhoto(createPhotoInput(file, nextImageUrl));
    setImageUrl(nextImageUrl);
    setAnalysis(null);
    setAiOnlyAnalysis(null);
    setPixelData(null);
    setIncrementalCache(null);
    setEditableMasks([]);
    setDirtyRegions([]);
    setVerifiedRegions([]);
    setRecomputeRegions([]);
    setReviewQueue(null);
    setReplayPayload(null);
    setError(null);
    setStatus('照片已上传');
  };

  const onTemplateAnalysisSeedCreated = (seed: TemplateAnalysisSeed) => {
    const seedImageData = loadTemplateAnalysisSeedImageData(seed);

    setActiveTemplateAnalysisSeed(seed);
    setActiveBoundArtifactResource(seed.boundArtifactResource ?? null);
    setAnalysis(null);
    setAiOnlyAnalysis(null);
    setPixelData(null);
    setIncrementalCache(null);
    setEditableMasks([]);
    setDirtyRegions([]);
    setVerifiedRegions([]);
    setRecomputeRegions([]);
    setReviewQueue(null);
    setReplayPayload(null);
    setError(null);

    if (seedImageData.previewUrl && seed.readiness === 'ready_for_vision_analysis') {
      setImageUrl(seedImageData.previewUrl);
      setPhoto(createPhotoInputFromSeed(seed, seedImageData.previewUrl));
      setStatus('已从 Source Image Seed 准备源图，可以开始分析');
      return;
    }

    setStatus('Seed 已创建，但浏览器不能直接读取 CLI artifact 路径');
    setError(
      '当前 Seed 指向 source image package 内的相对路径。请通过上传照片或可访问的 normalized PNG URL 继续分析。',
    );
  };

  const onProductionBatchChange = (batch: TemplateProductionBatch | null) => {
    setActiveProductionBatch(batch);

    if (!batch) {
      setActiveProductionTask(null);
      setSelectedProductionTaskId('');
      return;
    }

    const nextTask =
      batch.tasks.find((task) => task.taskId === selectedProductionTaskId) ??
      batch.tasks[0] ??
      null;

    setActiveProductionTask(nextTask);
    setSelectedProductionTaskId(nextTask?.taskId ?? '');
  };

  const onProductionTaskSelected = (task: TemplateProductionTask | null) => {
    setActiveProductionTask(task);
    setSelectedProductionTaskId(task?.taskId ?? '');
  };

  const onProductionSeedSelected = (seed: TemplateAnalysisSeed) => {
    onTemplateAnalysisSeedCreated(seed);
  };

  const onLibraryChange = (library: TemplateLibrary | null) => {
    setActiveTemplateLibrary(library);
    setSelectedLibraryEntryId((current) =>
      library?.entries.some((entry) => entry.libraryEntryId === current)
        ? current
        : library?.entries[0]?.libraryEntryId ?? '',
    );
  };

  const onLibraryEntrySelected = (entry: TemplateLibraryEntry | null) => {
    setSelectedLibraryEntryId(entry?.libraryEntryId ?? '');
  };

  const onPublishPackageChange = (packageData: TemplatePublishPackage | null) => {
    setActivePublishPackage(packageData);
    setActiveUserAppTemplatePackage(null);
    setSelectedUserAppTemplateId('');
  };

  const onUserAppTemplatePackageChange = (packageData: UserAppTemplatePackage | null) => {
    setActiveUserAppTemplatePackage(packageData);
    setSelectedUserAppTemplateId((current) =>
      packageData?.templates.some((template) => template.appTemplateId === current)
        ? current
        : packageData?.templates[0]?.appTemplateId ?? '',
    );
  };

  const analyzePhoto = async () => {
    if (!photo) {
      setError('请先上传照片再开始分析。');
      return;
    }

    setLoading(true);
    setError(null);
    setRuntimeNotice(null);
    setStatus('正在运行 FaceMesh 与蒙版分割');

    try {
      const mediaPipeProvider = provider();
      let currentProvider: VisionProvider = mediaPipeProvider;

      try {
        await mediaPipeProvider.initialize();
      } catch (nextError) {
        if (shouldUseVisionAnalysisDevelopmentFallback(nextError)) {
          currentProvider = createMockVisionProvider();
          setRuntimeNotice(formatVisionAnalysisErrorForUser(nextError));
          setStatus('public/mediapipe 缺失，已使用 mock vision fallback');
        } else {
          throw nextError;
        }
      }

      const nextPixelData = await loadImagePixelDataFromUrl(photo.imageUrl ?? '');
      const nextAnalysis = await runMakeupAnalysisPipeline({
        image: photo,
        provider: currentProvider,
        pixelData: nextPixelData,
      });
      const nextEditableMasks =
        nextAnalysis.cosmeticSegmentation.masks.map(createEditableCosmeticMask);
      const initialCache = recomputeInvalidatedRegions({
        imageId: nextAnalysis.imageId,
        pixelData: nextPixelData,
        masks: nextEditableMasks.map((mask) => mask.mergedMask),
        invalidatedTargets: nextEditableMasks.map(
          (mask) => mask.mergedMask.target,
        ),
      });

      setPixelData(nextPixelData);
      setAnalysis(nextAnalysis);
      setAiOnlyAnalysis(nextAnalysis);
      setIncrementalCache(initialCache.cache);
      setEditableMasks(nextEditableMasks);
      setActiveRegion(nextAnalysis.cosmeticSegmentation.masks[0]?.target ?? 'lips');
      setDirtyRegions([]);
      setVerifiedRegions([]);
      setRecomputeRegions([]);
      setReviewQueue(null);
      setReplayPayload(null);
      setBeforeAfterMode('after');
      if (activeProductionBatch && selectedProductionTaskId) {
        const nextBatch = replaceProductionTaskInBatch(
          activeProductionBatch,
          selectedProductionTaskId,
          (task) => updateProductionTaskFromAnalysis(task, nextAnalysis, humanVerifiedTemplate ?? undefined),
        );
        setActiveProductionBatch(nextBatch);
        setActiveProductionTask(
          nextBatch.tasks.find((task) => task.taskId === selectedProductionTaskId) ?? null,
        );
      }
      setStatus('分析完成');
    } catch (nextError) {
      setError(formatVisionAnalysisErrorForUser(nextError));
      setStatus('分析失败');
    } finally {
      setLoading(false);
    }
  };

  const applyBrushPoint = (point: MaskBrushPoint) => {
    if (!analysis || !activeMask) {
      return;
    }

    editSequenceRef.current += 1;
    updateActiveMask((mask) =>
      applyMaskBrushEdit(mask, {
        id: `${activeRegion}-edit-${editSequenceRef.current}`,
        target: activeRegion,
        tool: brushTool,
        point,
        radius: brushSize,
        strength: brushTool === 'feather-brush' ? featherStrength : 0.85,
        createdAt: new Date().toISOString(),
      }),
    );
    setStatus(`已编辑 ${activeRegion}`);
  };

  const undoActiveMask = () => {
    if (!activeMask) {
      return;
    }

    updateActiveMask(undoMaskEdit);
    setStatus(`已撤销 ${activeRegion}`);
  };

  const redoActiveMask = () => {
    if (!activeMask) {
      return;
    }

    updateActiveMask(redoMaskEdit);
    setStatus(`已重做 ${activeRegion}`);
  };

  const resetActiveMask = () => {
    if (!activeMask) {
      return;
    }

    updateActiveMask((mask) =>
      resetEditableMaskToBase(mask, new Date().toISOString()),
    );
    setStatus(`已重置 ${activeRegion}`);
  };

  const restoreHistorySnapshot = (snapshotId: string) => {
    updateActiveMask((mask) =>
      restoreEditableMaskSnapshot(mask, snapshotId, new Date().toISOString()),
    );
    setStatus(`已恢复 ${activeRegion} 历史记录`);
  };

  const reanalyzeActiveRegion = () => {
    if (!analysis || !pixelData || editableMasks.length === 0) {
      return;
    }

    setReanalyzing(true);
    setError(null);

    try {
      const next = reanalyzeMakeupWithEditableMasks({
        previous: analysis,
        pixelData,
        editableMasks,
        invalidatedTargets: [activeRegion],
        previousCache: incrementalCache ?? undefined,
      });

      setAnalysis(next.analysis);
      setIncrementalCache(next.cache);
      setRecomputeRegions(next.recomputedTargets);
      setDirtyRegions((current) =>
        current.filter((region) => region !== activeRegion),
      );
      setVerifiedRegions((current) =>
        uniqueTargets([...current, ...next.recomputedTargets]),
      );
      setLayers((current) => ({
        ...current,
        recomputeRegions: true,
        convergenceDiff: true,
        beforeAfter: true,
      }));
      setBeforeAfterMode('after');
      setStatus(`mask-reanalysis：${next.recomputedTargets.join(', ') || '无'}`);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : 'Mask reanalysis failed.',
      );
      setStatus('蒙版重分析失败');
    } finally {
      setReanalyzing(false);
    }
  };

  const reanalyzeDirtyRegionsBatch = () => {
    if (!analysis || !pixelData || editableMasks.length === 0 || dirtyRegions.length === 0) {
      return;
    }

    setReanalyzing(true);
    setError(null);

    try {
      const next = reanalyzeMakeupWithEditableMasksBatch({
        previous: analysis,
        pixelData,
        editableMasks,
        dirtyTargets: dirtyRegions,
        mode: 'all-dirty',
        previousCache: incrementalCache ?? undefined,
      });

      setAnalysis(next.analysis);
      setIncrementalCache(next.cache);
      setRecomputeRegions(next.recomputedTargets);
      setDirtyRegions((current) =>
        current.filter((region) => !next.invalidatedTargets.includes(region)),
      );
      setVerifiedRegions((current) =>
        uniqueTargets([...current, ...next.recomputedTargets]),
      );
      setLayers((current) => ({
        ...current,
        recomputeRegions: true,
        convergenceDiff: true,
        beforeAfter: true,
      }));
      setBeforeAfterMode('after');
      setStatus(`batch-mask-reanalysis：${next.recomputedTargets.join(', ') || '无'}`);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : 'Batch mask reanalysis failed.',
      );
      setStatus('批量蒙版重分析失败');
    } finally {
      setReanalyzing(false);
    }
  };

  const saveActiveCorrection = () => {
    if (!photo || !activeMask) {
      return;
    }

    const humanAdjustedRegions = uniqueTargets([...adjustedRegions, activeRegion]);
    const record = createVisionCorrectionRecord({
      imageId: photo.id,
      templateId: humanVerifiedTemplate?.id,
      editableMask: activeMask,
      correctionConfidence: humanVerifiedTemplate?.metadata.correctionConfidence,
      humanAdjustedRegions,
      savedAt: new Date().toISOString(),
    });
    const snapshot = visionCorrectionStorage.save(record);

    setCorrectionRecords(snapshot.records);
    setSelectedCorrectionId(record.id);
    setExportJson(serializeVisionCorrectionSnapshot(snapshot));
    setStatus(`已保存 ${record.region} 修正`);
  };

  const saveDirtyCorrectionsBatch = () => {
    if (!photo || !humanVerifiedTemplate || dirtyRegions.length === 0) {
      return;
    }

    const savedAt = new Date().toISOString();
    const selected = new Set(dirtyRegions);
    const records = editableMasks
      .filter((mask) => selected.has(mask.mergedMask.target))
      .map((editableMask) =>
        createVisionCorrectionRecord({
          imageId: photo.id,
          templateId: humanVerifiedTemplate.id,
          editableMask,
          correctionConfidence: humanVerifiedTemplate.metadata.correctionConfidence,
          humanAdjustedRegions: adjustedRegions,
          savedAt,
        }),
      );
    const snapshot = visionCorrectionStorage.saveMany(records);

    setCorrectionRecords(snapshot.records);
    setExportJson(serializeVisionCorrectionSnapshot(snapshot));
    setStatus(`已批量保存 ${records.length} 条修正`);
  };

  const exportDatasetJson = () => {
    if (!correctionDataset) {
      return;
    }

    const json = exportCorrectionDatasetJsonBundle(correctionDataset);

    setExportJson(json);
    downloadJson(`${correctionDataset.datasetId}.json`, json);
    setStatus('已导出 correction dataset JSON');
  };

  const exportDatasetJsonl = () => {
    if (!correctionDataset) {
      return;
    }

    const jsonl = exportCorrectionDatasetJsonl(correctionDataset);

    setExportJson(jsonl);
    downloadJson(`${correctionDataset.datasetId}.jsonl`, jsonl);
    setStatus('已导出 correction dataset JSONL');
  };

  const reviewerMetadata = (reviewedAt: string) => ({
    reviewerId: 'template-studio',
    reviewedAt,
    notes: ['local-dataset-review'],
  });

  const visibleReviewItemIds = () =>
    reviewQueue?.items
      .filter(
        (item) =>
          reviewFilter === 'all' ||
          item.currentDecision.status === reviewFilter,
      )
      .map((item) => item.reviewItemId) ?? [];

  const acceptReviewItem = (reviewItemId: string) => {
    const decidedAt = new Date().toISOString();

    setReviewQueue((current) =>
      current
        ? autoAssignReviewQueueSplits(
            batchAcceptReviewItems(current, {
              reviewItemIds: [reviewItemId],
              reviewerMetadata: reviewerMetadata(decidedAt),
              decidedAt,
              notes: ['accepted in Template Studio'],
            }),
            { updatedAt: decidedAt },
          )
        : current,
    );
    setStatus('已通过审核项');
  };

  const rejectReviewItem = (reviewItemId: string) => {
    const decidedAt = new Date().toISOString();

    setReviewQueue((current) =>
      current
        ? batchRejectReviewItems(current, {
            reviewItemIds: [reviewItemId],
            reviewerMetadata: reviewerMetadata(decidedAt),
            decidedAt,
            notes: ['rejected in Template Studio'],
          })
        : current,
    );
    setStatus('已拒绝审核项');
  };

  const secondReviewItem = (reviewItemId: string) => {
    const decidedAt = new Date().toISOString();

    setReviewQueue((current) =>
      current
        ? markReviewItemsNeedsSecondReview(current, {
            reviewItemIds: [reviewItemId],
            reviewerMetadata: reviewerMetadata(decidedAt),
            decidedAt,
            notes: ['marked for second review in Template Studio'],
          })
        : current,
    );
    setStatus('已标记为二次审核');
  };

  const assignReviewSplit = (reviewItemId: string, split: DatasetSplit) => {
    const updatedAt = new Date().toISOString();

    setReviewQueue((current) =>
      current
        ? assignReviewItemSplit(current, { reviewItemId, split, updatedAt })
        : current,
    );
    setStatus(`已分配到 ${split} split`);
  };

  const batchAcceptVisibleReviews = () => {
    const decidedAt = new Date().toISOString();
    const reviewItemIds = visibleReviewItemIds();

    setReviewQueue((current) =>
      current
        ? autoAssignReviewQueueSplits(
            batchAcceptReviewItems(current, {
              reviewItemIds,
              reviewerMetadata: reviewerMetadata(decidedAt),
              decidedAt,
              notes: ['batch accepted in Template Studio'],
            }),
            { updatedAt: decidedAt },
          )
        : current,
    );
    setStatus(`已批量通过 ${reviewItemIds.length} 个审核项`);
  };

  const batchRejectVisibleReviews = () => {
    const decidedAt = new Date().toISOString();
    const reviewItemIds = visibleReviewItemIds();

    setReviewQueue((current) =>
      current
        ? batchRejectReviewItems(current, {
            reviewItemIds,
            reviewerMetadata: reviewerMetadata(decidedAt),
            decidedAt,
            notes: ['batch rejected in Template Studio'],
          })
        : current,
    );
    setStatus(`已批量拒绝 ${reviewItemIds.length} 个审核项`);
  };

  const exportReviewedJson = () => {
    if (!correctionDataset || !reviewQueue) {
      return;
    }

    const json = exportReviewedDatasetJson({
      dataset: correctionDataset,
      queue: reviewQueue,
      exportedAt: new Date().toISOString(),
    });

    setExportJson(json);
    downloadJson(`${correctionDataset.datasetId}-reviewed.json`, json);
    setStatus('已导出 reviewed dataset JSON');
  };

  const exportReviewedJsonl = () => {
    if (!correctionDataset || !reviewQueue) {
      return;
    }

    const jsonl = exportReviewedDatasetJsonl({
      dataset: correctionDataset,
      queue: reviewQueue,
    });

    setExportJson(jsonl);
    downloadJson(`${correctionDataset.datasetId}-reviewed.jsonl`, jsonl);
    setStatus('已导出 reviewed dataset JSONL');
  };

  const exportReviewManifest = () => {
    if (!correctionDataset || !reviewQueue) {
      return;
    }

    const manifest =
      datasetManifest ??
      exportDatasetManifest({
        dataset: correctionDataset,
        queue: reviewQueue,
        exportFormat: 'manifest',
        exportedAt: new Date().toISOString(),
      });
    const json = exportManifestJson(manifest);

    setExportJson(json);
    downloadJson(`${correctionDataset.datasetId}-manifest.json`, json);
    setStatus('已导出 dataset manifest');
  };

  const exportCurationMetrics = () => {
    if (!curationMetrics) {
      return;
    }

    const json = exportCurationMetricsJson(curationMetrics);

    setExportJson(json);
    downloadJson(`${curationMetrics.datasetId}-curation-metrics.json`, json);
    setStatus('已导出 curation metrics JSON');
  };

  const exportTrainingManifest = () => {
    if (!trainingManifest) {
      return;
    }

    const json = exportTrainingManifestJson(trainingManifest);

    setExportJson(json);
    downloadJson(`${trainingManifest.manifestId}.json`, json);
    setStatus('已导出 training manifest JSON');
  };

  const exportTrainingSplit = (
    split: 'train' | 'validation' | 'test',
  ) => {
    if (!trainingManifest) {
      return;
    }

    const json =
      split === 'train'
        ? exportTrainSplitManifestJson(trainingManifest)
        : split === 'validation'
          ? exportValidationSplitManifestJson(trainingManifest)
          : exportTestSplitManifestJson(trainingManifest);

    setExportJson(json);
    downloadJson(`${trainingManifest.manifestId}-${split}.json`, json);
    setStatus(`已导出 ${split} training split manifest`);
  };

  const copyCurationSummary = () => {
    if (!curationMetrics) {
      return;
    }

    const summary = [
      `dataset:${curationMetrics.datasetId}`,
      `total:${curationMetrics.totalSamples}`,
      `accepted:${curationMetrics.acceptedSamples}`,
      `ready:${curationMetrics.trainingReadySamples}`,
      `readiness:${curationMetrics.trainingReadinessScore}`,
      `risk:${curationMetrics.riskSummary.riskLevel}`,
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(summary);
    }

    setStatus('已复制数据指标摘要');
  };

  const validateTrainingAdapterManifest = () => {
    if (!trainingManifest) {
      return;
    }

    const nextStatus = trainingManifest.validationResult.valid
      ? '训练清单校验通过'
      : `训练清单被阻止：${trainingManifest.validationResult.errors.join(', ') || '未知原因'}`;

    setTrainingValidationStatus(nextStatus);
    setStatus(nextStatus);
  };

  const copyTrainingSummary = () => {
    if (!trainingManifest) {
      return;
    }

    const summary = [
      `manifest:${trainingManifest.manifestId}`,
      `train:${trainingManifest.train.sampleCount}`,
      `validation:${trainingManifest.validation.sampleCount}`,
      `test:${trainingManifest.test.sampleCount}`,
      `valid:${trainingManifest.validationResult.valid ? 'yes' : 'no'}`,
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(summary);
    }

    setStatus('已复制训练适配摘要');
  };

  const createOfflinePackageForTraining = () => {
    if (!correctionDataset || !trainingManifest) {
      setStatus('请先生成 reviewed dataset 与 training manifest。');
      return;
    }

    const nextPackage = createOfflineTrainingPackage({
      dataset: correctionDataset,
      trainingManifest,
      reviewQueue,
      createdAt: trainingManifest.createdAt,
    });

    setOfflinePackage(nextPackage);
    setExportJson(exportOfflineTrainingPackageJson(nextPackage));
    setStatus(`已生成离线训练数据包：${nextPackage.packageId}`);
  };

  const validateOfflinePackageForTraining = () => {
    if (!offlinePackage) {
      return;
    }

    const nextValidation = validateOfflineTrainingPackage(offlinePackage);
    const nextPackage = {
      ...offlinePackage,
      validationSummary: nextValidation,
      manifest: {
        ...offlinePackage.manifest,
        validationSummary: nextValidation,
      },
    };

    setOfflinePackage(nextPackage);
    setStatus(
      nextValidation.valid
        ? '离线训练数据包校验通过'
        : `离线训练数据包存在阻断：${nextValidation.errors.join(', ') || '未知原因'}`,
    );
  };

  const exportOfflinePackageJson = () => {
    if (!offlinePackage) {
      return;
    }

    const json = exportOfflineTrainingPackageJson(offlinePackage);

    setExportJson(json);
    downloadJson(`${offlinePackage.packageId}.json`, json);
    setStatus('已导出离线训练数据包 JSON');
  };

  const exportOfflineManifestJson = () => {
    if (!offlinePackage) {
      return;
    }

    const json = exportOfflineTrainingPackageManifestJson(offlinePackage);

    setExportJson(json);
    downloadJson(`${offlinePackage.packageId}-manifest.json`, json);
    setStatus('已导出离线训练数据包 manifest');
  };

  const exportOfflineAuditReportJson = () => {
    if (!offlinePackage) {
      return;
    }

    const json = exportOperatorAuditReportJson(offlinePackage.auditSummary);

    setExportJson(json);
    downloadJson(`${offlinePackage.packageId}-operator-audit.json`, json);
    setStatus('已导出操作员审计报告');
  };

  const copyOfflinePackageSummary = () => {
    if (!offlinePackage) {
      return;
    }

    const summary = summarizeOfflinePackage(offlinePackage);

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(summary);
    }

    setStatus('已复制离线包摘要');
  };

  const openReplayViewer = (reviewItemId: string) => {
    const item = reviewQueue?.items.find(
      (reviewItem) => reviewItem.reviewItemId === reviewItemId,
    );
    const sample = correctionDataset?.samples.find(
      (candidate) => candidate.sampleId === item?.sampleId,
    );

    if (!item || !sample) {
      return;
    }

    setReplayPayload(
      createDatasetReplayPayload({
        sample,
        item,
        templateBefore: aiOnlyTemplate,
        templateAfter: humanVerifiedTemplate,
      }),
    );
    setStatus(`已打开 ${sample.regionId} 回放`);
  };

  const copyDatasetSummary = () => {
    if (!correctionDataset) {
      return;
    }

    const summary = [
      `dataset:${correctionDataset.datasetId}`,
      `samples:${correctionDataset.sampleCount}`,
      `regions:${correctionDataset.summary.regions.join(',') || 'none'}`,
      `confidence:${correctionDataset.summary.averageCorrectionConfidence}`,
      `status:${correctionDataset.humanVerificationStatus}`,
    ].join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(summary);
    }

    setStatus('已复制数据集摘要');
  };

  const loadSelectedCorrection = () => {
    const record = correctionRecords.find((item) => item.id === selectedCorrectionId);

    if (!record) {
      return;
    }

    setEditableMasks((current) =>
      current.map((mask) => applyVisionCorrectionToEditableMask(mask, record) ?? mask),
    );
    setActiveRegion(record.region);
    markDirty(record.region);
    setRecomputeRegions((current) =>
      current.includes(record.region) ? current : [...current, record.region],
    );
    setLayers((current) => ({
      ...current,
      editableMasks: true,
      userCorrections: true,
    }));
    setStatus(`已加载 ${record.region} 修正`);
  };

  const exportCorrections = () => {
    const snapshot = {
      records: correctionRecords,
      savedAt: new Date().toISOString(),
    };
    const json = serializeVisionCorrectionSnapshot(snapshot);

    setExportJson(json);
    downloadJson('template-studio-corrections.json', json);
    setStatus('已导出 correction JSON');
  };

  const importCorrections = () => {
    setImportError(null);

    try {
      const result = visionCorrectionStorage.importJson(importJson);

      setCorrectionRecords(result.snapshot.records);
      setSelectedCorrectionId(result.snapshot.records[0]?.id ?? '');
      setExportJson(serializeVisionCorrectionSnapshot(result.snapshot));
      setStatus(`已导入 ${result.importedCount} 条修正`);
    } catch (nextError) {
      setImportError(
        nextError instanceof Error ? nextError.message : 'Invalid correction JSON.',
      );
    }
  };

  const importCorrectionFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      setImportJson(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => setImportError(`Failed to read ${file.name}.`);
    reader.readAsText(file);
  };

  const toggleLayer = (key: keyof VisionDebugOverlayLayers) => {
    setLayers((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const activeMaskChanged = activeMask ? hasEditableMaskChanges(activeMask) : false;

  return (
    <main className="min-h-screen bg-[#f8f7f4] p-4 text-stone-950 sm:p-6">
      <div className="mx-auto grid max-w-[1680px] gap-5">
        <header className="flex flex-col gap-3 border-b border-stone-200 pb-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Phase 5B.5 / 5B.6 / 5C
            </p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              模板生产工作台
            </h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-stone-600">
              本地 CV 负责蒙版、像素、审核队列、数据指标与训练适配清单；语义增强始终是可选辅助层。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-md border border-stone-200 bg-white p-1">
              {(['admin', 'developer'] as const).map((mode) => (
                <button
                  className={`h-8 rounded px-3 text-sm font-semibold ${
                    studioMode === mode
                      ? 'bg-stone-950 text-white'
                      : 'text-stone-600'
                  }`}
                  key={mode}
                  onClick={() => setStudioMode(mode)}
                  type="button"
                >
                  {mode === 'admin' ? '管理员模式' : '开发者模式'}
                </button>
              ))}
            </div>
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
              <ImageUp aria-hidden="true" size={16} />
              上传照片
              <input
                accept="image/*"
                className="hidden"
                onChange={onPhotoChange}
                type="file"
              />
            </label>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!photo || loading}
              onClick={analyzePhoto}
              type="button"
            >
              {loading ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={16} />
              ) : (
                <ScanFace aria-hidden="true" size={16} />
              )}
              开始分析
            </button>
          </div>
        </header>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="grid min-w-0 content-start gap-5">
            <section className="min-w-0 rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">蒙版编辑画布</h2>
                  <p className="text-xs font-medium text-stone-500">
                    {photo?.fileName ?? '上传照片后开始'} / {status}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                    <input
                      checked={editingEnabled}
                      onChange={(event) => setEditingEnabled(event.target.checked)}
                      type="checkbox"
                    />
                    编辑模式
                  </label>
                  <div className="inline-flex rounded-md border border-stone-200 bg-stone-50 p-1">
                    {(['before', 'after'] as const).map((mode) => (
                      <button
                        className={`h-8 rounded px-3 text-xs font-semibold ${
                          beforeAfterMode === mode
                            ? 'bg-white text-teal-800 shadow-sm'
                            : 'text-stone-500'
                        }`}
                        key={mode}
                        onClick={() => setBeforeAfterMode(mode)}
                        type="button"
                      >
                        {mode === 'before' ? '修正前' : '修正后'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {imageUrl ? (
                  <div className="min-h-[680px] min-w-0">
                    <MaskCanvasInteractionLayer
                      activeRegion={activeRegion}
                      beforeAfterMode={beforeAfterMode}
                      brushRadius={brushSize}
                      brushStrength={featherStrength}
                      editingEnabled={editingEnabled}
                      imageAlt="模板工作台源图"
                      imageUrl={imageUrl}
                      layers={layers}
                      onBrushPoint={applyBrushPoint}
                      opacity={opacity}
                      overlayData={overlayData}
                      zoom={zoom}
                    />
                  </div>
                ) : (
                  <label className="grid min-h-[680px] cursor-pointer place-items-center rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-500 hover:border-teal-400 hover:bg-teal-50/40">
                    <span className="grid gap-2">
                      <ImageUp aria-hidden="true" className="mx-auto text-stone-400" size={30} />
                      上传源图并运行分析后，就可以在画布上修正区域蒙版。
                    </span>
                    <input
                      accept="image/*"
                      className="hidden"
                      onChange={onPhotoChange}
                      type="file"
                    />
                  </label>
                )}
              </div>

              {error ? (
                <div className="mt-3 whitespace-pre-line rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
              {runtimeNotice ? (
                <div className="mt-3 whitespace-pre-line rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  {runtimeNotice}
                </div>
              ) : (
                <div className="mt-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                  MediaPipe 本地资源要求：真实 FaceMesh 需要
                  {' '}
                  <code>public/mediapipe/face_landmarker.task</code>
                  {' '}
                  和
                  {' '}
                  <code>public/mediapipe/wasm/vision_wasm_internal.js</code>
                  。如果资源缺失，页面会显示明确原因和恢复说明；localhost
                  开发环境会自动 fallback 到 mock vision provider。如果需要真实 FaceMesh，请把 MediaPipe
                  model/wasm 文件放回 public/mediapipe。
                </div>
              )}
            </section>

            <section className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-4">
              <div>
                <p className="text-xs font-semibold text-stone-500">模板状态</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {humanVerifiedTemplate?.metadata.humanVerificationStatus ?? '尚未分析'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">数据样本</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {correctionDataset?.sampleCount ?? 0} 个样本
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">审核队列</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  待审 {reviewQueue?.summary.pending ?? 0} / 已通过 {reviewQueue?.summary.accepted ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">训练清单</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {trainingManifest?.targetSummary.totalSamples ?? 0} 条引用
                </p>
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setShowOverlayControls((current) => !current)}
                type="button"
              >
                <span className="inline-flex items-center gap-2 text-base font-semibold">
                  <Layers aria-hidden="true" className="text-teal-700" size={18} />
                  图层控制
                </span>
                <span className="text-xs font-semibold uppercase text-stone-500">
                  {showOverlayControls || studioMode === 'developer' ? '已展开' : '已收起'}
                </span>
              </button>
              {showOverlayControls || studioMode === 'developer' ? (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                    {Object.entries(layerLabels).map(([key, label]) => (
                      <label
                        className="flex min-w-0 items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm"
                        key={key}
                      >
                        <input
                          checked={layers[key as keyof VisionDebugOverlayLayers]}
                          onChange={() => toggleLayer(key as keyof VisionDebugOverlayLayers)}
                          type="checkbox"
                        />
                        <span className="truncate">{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-xs font-semibold uppercase text-stone-500">
                        透明度 {opacity.toFixed(2)}
                      </span>
                      <input
                        max="1"
                        min="0.1"
                        onChange={(event) => setOpacity(Number(event.target.value))}
                        step="0.05"
                        type="range"
                        value={opacity}
                      />
                    </label>
                    <label className="grid gap-1.5 text-sm">
                      <span className="text-xs font-semibold uppercase text-stone-500">
                        缩放 {zoom.toFixed(2)}
                      </span>
                      <input
                        max="1.5"
                        min="0.75"
                        onChange={(event) => setZoom(Number(event.target.value))}
                        step="0.05"
                        type="range"
                        value={zoom}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm text-stone-500">
                  核心编辑图层保持开启。需要查看全部调试层时，可切换到开发者模式。
                </p>
              )}
            </section>

            {studioMode === 'developer' ? (
              <section className="rounded-lg border border-stone-200 bg-stone-950 p-4 text-stone-100 shadow-soft">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal aria-hidden="true" className="text-teal-300" size={17} />
                  <h2 className="text-base font-semibold">流水线追踪</h2>
                </div>
                <ol className="mt-3 grid gap-2 text-sm text-stone-200">
                  {(analysis?.trace ?? ['image-input']).map((stage, index) => (
                    <li className="flex items-center gap-2" key={`${stage}-${index}`}>
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-400/20 text-xs font-semibold text-teal-100">
                        {index + 1}
                      </span>
                      {stage}
                    </li>
                  ))}
                </ol>
                {reanalyzing ? (
                  <p className="mt-3 text-xs text-teal-100">正在执行蒙版重分析</p>
                ) : null}
              </section>
            ) : null}
          </div>

          <aside className="grid min-w-0 content-start gap-5">
            <SourceImageIntakePanel
              activeSeed={activeTemplateAnalysisSeed}
              artifactBindings={activeArtifactBindings}
              onActiveArtifactResourceChange={setActiveBoundArtifactResource}
              onArtifactBindingsChange={setActiveArtifactBindings}
              onManifestChange={setActiveSourceImageManifest}
              onSeedCreated={onTemplateAnalysisSeedCreated}
            />

            <TemplateProductionBatchPanel
              activeBatch={activeProductionBatch}
              artifactBindings={activeArtifactBindings}
              filter={productionTaskFilter}
              manifest={activeSourceImageManifest}
              onBatchChange={onProductionBatchChange}
              onFilterChange={setProductionTaskFilter}
              onSeedSelected={onProductionSeedSelected}
              onSelectedTaskChange={onProductionTaskSelected}
              selectedTaskId={selectedProductionTaskId}
            />

            <TemplateLibraryPanel
              activeLibrary={activeTemplateLibrary}
              activePackage={activePublishPackage}
              currentTemplate={humanVerifiedTemplate ?? null}
              onLibraryChange={onLibraryChange}
              onPackageChange={onPublishPackageChange}
              onSelectedEntryChange={onLibraryEntrySelected}
              productionBatch={activeProductionBatch}
              selectedEntryId={selectedLibraryEntryId}
              selectedProductionTask={activeProductionTask}
            />

            <TemplatePackagePreview
              packageData={activePublishPackage}
              selectedEntryId={selectedLibraryEntryId}
            />

            <UserAppTemplatePreview
              appPackage={activeUserAppTemplatePackage}
              compatibilityTarget={appCompatibilityTarget}
              onAppPackageChange={onUserAppTemplatePackageChange}
              onCompatibilityTargetChange={setAppCompatibilityTarget}
              publishPackage={activePublishPackage}
              selectedTemplateId={selectedUserAppTemplateId}
            />

            <UserAppPrototypeConsumerPanel
              onSelectedTemplateChange={setSelectedUserAppTemplateId}
              packageData={activeUserAppTemplatePackage}
              selectedTemplateId={selectedUserAppTemplateId}
            />

            <UserAppShell packageData={activeUserAppTemplatePackage} />

            <FaceMeshMakeupIntelligencePanel
              attributeCandidates={makeupAttributeCandidates}
              draftQa={templateDraftQa}
              humanReview={templateDraftHumanReview}
              regionQa={faceMeshRegionQa}
              reviewWorkflow={templateDraftReviewWorkflow}
              stepSequence={ruleBasedStepSequence}
              studioWorkflow={templateStudioWorkflow}
              templateDraft={makeupTemplateDraft}
            />

            <MaskEditingToolbar
              activeRegion={activeRegion}
              brushSize={brushSize}
              brushTool={brushTool}
              canRedo={(activeMask?.history.redo.length ?? 0) > 0}
              canReanalyze={Boolean(pixelData && dirtyRegions.includes(activeRegion))}
              canSaveCorrection={Boolean(activeMask && activeMaskChanged)}
              canUndo={(activeMask?.history.undo.length ?? 0) > 0}
              dirtyRegions={dirtyRegions}
              featherStrength={featherStrength}
              onActiveRegionChange={setActiveRegion}
              onBrushSizeChange={setBrushSize}
              onBrushToolChange={setBrushTool}
              onFeatherStrengthChange={setFeatherStrength}
              onReanalyzeRegion={reanalyzeActiveRegion}
              onRedo={redoActiveMask}
              onResetRegion={resetActiveMask}
              onSaveCorrection={saveActiveCorrection}
              onUndo={undoActiveMask}
            />
            <MaskHistoryPanel
              beforeAfterMode={beforeAfterMode}
              editableMask={activeMask}
              onBeforeAfterModeChange={setBeforeAfterMode}
              onRestoreSnapshot={restoreHistorySnapshot}
            />

            <ConvergenceDiffPanel diff={convergenceDiff} />

            <CorrectionPersistencePanel
              activeRegion={activeRegion}
              exportJson={exportJson}
              importError={importError}
              importJson={importJson}
              onExportCorrections={exportCorrections}
              onImportCorrections={importCorrections}
              onImportFile={importCorrectionFile}
              onImportJsonChange={setImportJson}
              onLoadCorrection={loadSelectedCorrection}
              onSelectedCorrectionChange={setSelectedCorrectionId}
              records={correctionRecords}
              selectedCorrectionId={selectedCorrectionId}
            />

            <DatasetPanel
              canBatchReanalysis={dirtyRegions.length > 0 && Boolean(pixelData)}
              canBatchSave={dirtyRegions.length > 0 && Boolean(humanVerifiedTemplate)}
              dataset={correctionDataset}
              onBatchReanalysis={reanalyzeDirtyRegionsBatch}
              onBatchSave={saveDirtyCorrectionsBatch}
              onCopyDatasetSummary={copyDatasetSummary}
              onExportJson={exportDatasetJson}
              onExportJsonl={exportDatasetJsonl}
              samples={correctionDatasetSamples}
            />

            <DatasetReviewPanel
              filter={reviewFilter}
              onAccept={acceptReviewItem}
              onAssignSplit={assignReviewSplit}
              onBatchAccept={batchAcceptVisibleReviews}
              onBatchReject={batchRejectVisibleReviews}
              onExportManifest={exportReviewManifest}
              onExportReviewedJson={exportReviewedJson}
              onExportReviewedJsonl={exportReviewedJsonl}
              onFilterChange={setReviewFilter}
              onNeedsSecondReview={secondReviewItem}
              onOpenReplay={openReplayViewer}
              onReject={rejectReviewItem}
              queue={reviewQueue}
            />

            <DatasetReplayViewer
              onClose={() => setReplayPayload(null)}
              payload={replayPayload}
            />

            <DatasetCurationPanel
              metrics={curationMetrics}
              onCopySummary={copyCurationSummary}
              onExportMetricsJson={exportCurationMetrics}
              onExportTrainingManifestJson={exportTrainingManifest}
              onRegionFilterChange={setCurationRegionFilter}
              onSplitFilterChange={setCurationSplitFilter}
              onStatusFilterChange={setCurationStatusFilter}
              onValidateTrainingManifest={validateTrainingAdapterManifest}
              regionFilter={curationRegionFilter}
              splitFilter={curationSplitFilter}
              statusFilter={curationStatusFilter}
            />

            <TrainingAdapterPanel
              manifest={trainingManifest}
              onCopySummary={copyTrainingSummary}
              onExportManifest={exportTrainingManifest}
              onExportTest={() => exportTrainingSplit('test')}
              onExportTrain={() => exportTrainingSplit('train')}
              onExportValidation={() => exportTrainingSplit('validation')}
            />

            <OfflinePackagePanel
              developerMode={studioMode === 'developer'}
              onCopySummary={copyOfflinePackageSummary}
              onCreatePackage={createOfflinePackageForTraining}
              onExportAuditReportJson={exportOfflineAuditReportJson}
              onExportManifestJson={exportOfflineManifestJson}
              onExportPackageJson={exportOfflinePackageJson}
              onValidatePackage={validateOfflinePackageForTraining}
              rawJson={
                offlinePackage ? exportOfflineTrainingPackageJson(offlinePackage) : ''
              }
              trainingPackage={offlinePackage}
            />

            {trainingValidationStatus ? (
              <div className="rounded-md border border-teal-100 bg-teal-50 p-3 text-sm font-medium text-teal-900">
                {trainingValidationStatus}
              </div>
            ) : null}

            <EvidencePanel
              evidence={templateEvidence}
              qualityGateResult={qualityGateResult}
            />

            {studioMode === 'developer' ? (
              <section className="rounded-lg border border-stone-200 bg-stone-950 p-4 text-stone-100 shadow-soft">
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setShowRawJson((current) => !current)}
                  type="button"
                >
                  <h2 className="text-base font-semibold">开发者 JSON</h2>
                  <span className="text-xs font-semibold uppercase text-stone-400">
                    {showRawJson ? '已展开' : '已收起'}
                  </span>
                </button>
                {showRawJson ? (
                  <div className="mt-3 grid gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-stone-400">
                        妆容参数 JSON
                      </p>
                      <pre className="mt-2 max-h-[260px] overflow-auto rounded-md bg-black/30 p-3 text-xs leading-5 text-stone-200">
                        <code>{JSON.stringify(analysis?.parameters ?? {}, null, 2)}</code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-stone-400">
                        人工确认模板 JSON
                      </p>
                      <pre className="mt-2 max-h-[260px] overflow-auto rounded-md bg-black/30 p-3 text-xs leading-5 text-stone-200">
                        <code>{JSON.stringify(humanVerifiedTemplate ?? {}, null, 2)}</code>
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-stone-400">
                        原始导出预览
                      </p>
                      <pre className="mt-2 max-h-[220px] overflow-auto rounded-md bg-black/30 p-3 text-xs leading-5 text-stone-200">
                        <code>{exportJson || '暂无导出内容。'}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-stone-400">
                    展开后可查看原始 evidence、数据集导出预览和模板 JSON。
                  </p>
                )}
              </section>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
