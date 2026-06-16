import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronDown, ChevronRight, ImageUp, Loader2, ScanFace } from 'lucide-react';
import {
  applyMaskBrushEdit,
  createEditableCosmeticMask,
  createMediaPipeFaceMeshProvider,
  createMockVisionProvider,
  evaluateFaceMeshRegionQa,
  formatVisionAnalysisErrorForUser,
  loadImagePixelDataFromUrl,
  reanalyzeMakeupWithEditableMasks,
  runMakeupAnalysisPipeline,
  shouldUseVisionAnalysisDevelopmentFallback,
  type CosmeticSegmentationTarget,
  type EditableCosmeticMask,
  type ImagePixelData,
  type MakeupAnalysisPipelineResult,
  type MakeupPhotoInput,
  type MaskEditTool,
  type VisionProvider,
} from '../../../vision';
import {
  buildMakeupTemplateFromVisionAnalysis,
  convergeTemplateWithHumanCorrections,
} from '../../../template-engine';
import {
  defaultVisionDebugLayers,
  VisionDebugOverlay,
  type VisionDebugOverlayLayers,
} from '../../template-studio/vision-debug-overlay';
import { VisionQaPanel } from '../../template-studio/VisionQaPanel';
import { VisionAnalysisReadinessSummary } from './VisionAnalysisReadinessSummary';
import type { TemplateAnalysisSeed } from '../../../templates/schema';
import { loadTemplateAnalysisSeedImageData } from '../../../templates/storage';

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

const regionLabels: Record<CosmeticSegmentationTarget, string> = {
  lips: '唇部',
  eyeshadow: '眼影',
  eyeliner: '眼线',
  blush: '腮红',
  contour: '修容',
  highlight: '高光',
};

const editableTargets: CosmeticSegmentationTarget[] = [
  'lips',
  'eyeshadow',
  'eyeliner',
  'blush',
  'contour',
  'highlight',
];

const brushToolLabels: Record<MaskEditTool, string> = {
  'brush-add': '添加',
  'brush-erase': '擦除',
  'feather-brush': '羽化',
  'smooth-local': '局部平滑',
};

const createPhotoInput = (file: File, imageUrl: string): MakeupPhotoInput => ({
  id: `upload-${Date.now()}`,
  fileName: file.name,
  mimeType: file.type || 'image/unknown',
  sizeBytes: file.size,
  source: 'admin-upload',
  imageUrl,
  uploadedBy: 'local-admin',
  uploadedAt: new Date().toISOString(),
});

const createSeedPhotoInput = (
  seed: TemplateAnalysisSeed,
  imageUrl: string,
): MakeupPhotoInput => ({
  id: `seed-${seed.seedId}`,
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

export interface VisionAnalysisDemoProps {
  templateAnalysisSeed?: TemplateAnalysisSeed | null;
}

export function VisionAnalysisDemo({
  templateAnalysisSeed = null,
}: VisionAnalysisDemoProps) {
  const providerRef = useRef(createMediaPipeFaceMeshProvider());
  const [photo, setPhoto] = useState<MakeupPhotoInput | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState<MakeupAnalysisPipelineResult | null>(null);
  const [pixelData, setPixelData] = useState<ImagePixelData | null>(null);
  const [editableMasks, setEditableMasks] = useState<EditableCosmeticMask[]>([]);
  const [layers, setLayers] = useState<VisionDebugOverlayLayers>({
    ...defaultVisionDebugLayers,
    segmentationMasks: true,
  });
  const [opacity, setOpacity] = useState(0.85);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtimeNotice, setRuntimeNotice] = useState<string | null>(null);
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [activeTarget, setActiveTarget] =
    useState<CosmeticSegmentationTarget>('lips');
  const [brushTool, setBrushTool] = useState<MaskEditTool>('brush-add');
  const [brushRadius, setBrushRadius] = useState(0.06);
  const [brushStrength, setBrushStrength] = useState(0.55);
  const [adjustedTargets, setAdjustedTargets] = useState<
    CosmeticSegmentationTarget[]
  >([]);
  const [showDebugLayers, setShowDebugLayers] = useState(false);
  const [showDeveloperDetails, setShowDeveloperDetails] = useState(false);
  const seedImageData = useMemo(
    () =>
      templateAnalysisSeed
        ? loadTemplateAnalysisSeedImageData(templateAnalysisSeed)
        : null,
    [templateAnalysisSeed],
  );

  const overlayData = useMemo(() => {
    if (!result) {
      return null;
    }

    return {
      faceBox: result.faceDetection.box,
      faceMesh: result.faceMesh,
      cosmeticRegions: result.cosmeticRegions,
      cosmeticSegmentation: result.cosmeticSegmentation,
      editableMasks,
      recomputeRegions: adjustedTargets,
      convergenceDiff: adjustedTargets,
    };
  }, [adjustedTargets, editableMasks, result]);

  const templatePreview = useMemo(
    () =>
      result && photo
        ? buildMakeupTemplateFromVisionAnalysis({
            image: photo,
            templateName: `${photo.fileName} Makeup Template`,
            createdBy: 'local-admin',
            analysis: result,
          })
        : null,
    [photo, result],
  );

  const convergedTemplatePreview = useMemo(
    () =>
      templatePreview && result
        ? convergeTemplateWithHumanCorrections({
            template: templatePreview,
            analysis: result,
            editableMasks,
            adjustedRegions: adjustedTargets,
          }).template
        : templatePreview,
    [adjustedTargets, editableMasks, result, templatePreview],
  );
  const faceMeshRegionQa = useMemo(
    () =>
      result
        ? evaluateFaceMeshRegionQa({
            faceMesh: result.faceMesh,
            providerId: result.providerId,
          })
        : null,
    [result],
  );

  useEffect(() => {
    const provider = providerRef.current;

    return () => {
      provider.dispose();
    };
  }, []);

  useEffect(
    () => () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    },
    [imageUrl],
  );

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    const nextImageUrl = URL.createObjectURL(file);
    setImageUrl(nextImageUrl);
    setPhoto(createPhotoInput(file, nextImageUrl));
    setResult(null);
    setPixelData(null);
    setEditableMasks([]);
    setAdjustedTargets([]);
    setError(null);
  };

  const runAnalysisForPhoto = async (targetPhoto: MakeupPhotoInput | null) => {
    if (!targetPhoto) {
      setError('请先上传一张面部妆容照片。');
      return;
    }

    setLoading(true);
    setError(null);
    setRuntimeNotice(null);

    try {
      const mediaPipeProvider = providerRef.current;
      let currentProvider: VisionProvider = mediaPipeProvider;

      try {
        await mediaPipeProvider.initialize();
      } catch (nextError) {
        if (shouldUseVisionAnalysisDevelopmentFallback(nextError)) {
          currentProvider = createMockVisionProvider();
          setRuntimeNotice(formatVisionAnalysisErrorForUser(nextError));
        } else {
          throw nextError;
        }
      }

      const nextPixelData = await loadImagePixelDataFromUrl(targetPhoto.imageUrl ?? '');
      const nextResult = await runMakeupAnalysisPipeline({
        image: targetPhoto,
        provider: currentProvider,
        pixelData: nextPixelData,
      });

      setPixelData(nextPixelData);
      setResult(nextResult);
      setEditableMasks(
        nextResult.cosmeticSegmentation.masks.map(createEditableCosmeticMask),
      );
      setAdjustedTargets([]);
      setShowDebugLayers(false);
    } catch (nextError) {
      setError(formatVisionAnalysisErrorForUser(nextError));
    } finally {
      setLoading(false);
    }
  };

  const analyze = async () => {
    await runAnalysisForPhoto(photo);
  };

  const analyzeFromSeed = async () => {
    if (!templateAnalysisSeed || !seedImageData) {
      setError('请先从 Source Image Package 创建分析 Seed。');
      return;
    }

    if (templateAnalysisSeed.readiness === 'blocked_by_missing_artifact') {
      setError('请先绑定图片 artifact。manifest 相对路径不能被浏览器直接读取。');
      return;
    }

    if (templateAnalysisSeed.readiness !== 'ready_for_vision_analysis') {
      setError('当前 Seed 被 source image 质量、codec 或 artifact 阻断，不能运行分析。');
      return;
    }

    if (!seedImageData.canRunBrowserAnalysis || !seedImageData.previewUrl) {
      setError(
        '当前 Seed 只有 CLI package 相对路径，浏览器不能直接读取。请通过文件选择器或可访问 URL 提供 normalized PNG。',
      );
      return;
    }

    const nextPhoto = createSeedPhotoInput(templateAnalysisSeed, seedImageData.previewUrl);

    setPhoto(nextPhoto);
    setImageUrl(seedImageData.previewUrl);
    await runAnalysisForPhoto(nextPhoto);
  };

  const toggleLayer = (key: keyof VisionDebugOverlayLayers) => {
    setLayers((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const applyBrushAtPoint = (point: { x: number; y: number }) => {
    if (!editingEnabled || !result) {
      return;
    }

    setEditableMasks((current) =>
      current.map((mask) =>
        mask.mergedMask.target === activeTarget
          ? applyMaskBrushEdit(mask, {
              id: `${activeTarget}-${Date.now()}`,
              target: activeTarget,
              tool: brushTool,
              point: {
                x: point.x,
                y: point.y,
                space: 'normalized-image',
              },
              radius: brushRadius,
              strength: brushStrength,
              createdAt: new Date().toISOString(),
            })
          : mask,
      ),
    );
    setAdjustedTargets((current) =>
      current.includes(activeTarget) ? current : [...current, activeTarget],
    );
    setLayers((current) => ({
      ...current,
      editableMasks: true,
      userCorrections: true,
    }));
  };

  const onPreviewClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!editingEnabled) {
      return;
    }

    const image = event.currentTarget.querySelector('img');

    if (!image) {
      return;
    }

    const rect = image.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return;
    }

    applyBrushAtPoint({ x, y });
  };

  const reanalyzeEditedMasks = () => {
    if (!result || !pixelData || editableMasks.length === 0) {
      return;
    }

    setReanalyzing(true);
    try {
      const next = reanalyzeMakeupWithEditableMasks({
        previous: result,
        pixelData,
        editableMasks,
        invalidatedTargets: adjustedTargets,
      });

      setResult(next.analysis);
      setAdjustedTargets(next.recomputedTargets);
      setLayers((current) => ({
        ...current,
        recomputeRegions: true,
        convergenceDiff: true,
      }));
    } finally {
      setReanalyzing(false);
    }
  };

  const totalEdits = editableMasks.reduce(
    (sum, mask) => sum + mask.userModifications.length,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f8f7f4] p-4 text-stone-950 sm:p-6">
      <div className="mx-auto grid max-w-[1680px] gap-5">
        <header className="border-b border-stone-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
            Vision-first Phase 4C
          </p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
            可编辑妆容蒙版分析
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-stone-600">
            上传照片后先运行本地 FaceMesh 与妆容区域分割，再通过人工修正蒙版触发局部重新分析，让模板从 AI 初稿收敛到人工确认版本。
          </p>
        </header>

        {templateAnalysisSeed ? (
          <section className="rounded-lg border border-teal-100 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Source Image Seed</h2>
                <p className="text-xs text-stone-500">
                  {templateAnalysisSeed.originalFileName} / {templateAnalysisSeed.readiness}
                </p>
              </div>
              <button
                className="inline-flex h-9 items-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  loading ||
                  templateAnalysisSeed.readiness !== 'ready_for_vision_analysis' ||
                  !seedImageData?.canRunBrowserAnalysis
                }
                onClick={analyzeFromSeed}
                type="button"
              >
                从 Source Image Seed 分析
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-stone-600">
              Seed 只作为视觉分析输入，不会绕过人工修正、review queue 或 quality gate。
            </p>
            {seedImageData?.issues.length ? (
              <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                {seedImageData.issues.map((nextIssue) => nextIssue.message).join('；')}
              </p>
            ) : null}
          </section>
        ) : null}

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid min-w-0 content-start gap-5">
            <section className="min-w-0 rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">图片与蒙版</h2>
                  <p className="text-xs text-stone-500">
                    开启编辑后，点击图片即可用当前笔刷修正选中区域。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
                    <ImageUp aria-hidden="true" size={16} />
                    上传图片
                    <input
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
                      type="file"
                    />
                  </label>
                  <button
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                    onClick={analyze}
                    type="button"
                  >
                    {loading ? (
                      <Loader2
                        aria-hidden="true"
                        className="animate-spin"
                        size={16}
                      />
                    ) : (
                      <ScanFace aria-hidden="true" size={16} />
                    )}
                    分析照片
                  </button>
                </div>
              </div>

              <div className="mt-4 grid min-h-[620px] place-items-center rounded-md border border-dashed border-stone-300 bg-stone-50 p-3">
                {imageUrl ? (
                  <div
                    className={`relative grid max-h-[760px] w-full place-items-center overflow-hidden rounded-md bg-black/5 ${
                      editingEnabled ? 'cursor-crosshair' : ''
                    }`}
                    onClick={onPreviewClick}
                  >
                    <img
                      alt="待分析妆容照片"
                      className="block max-h-[760px] max-w-full object-contain"
                      src={imageUrl}
                    />
                    <VisionDebugOverlay
                      data={overlayData}
                      layers={layers}
                      opacity={opacity}
                      zoom={zoom}
                    />
                  </div>
                ) : (
                  <label className="grid cursor-pointer gap-2 text-center text-sm text-stone-500">
                    <ImageUp
                      aria-hidden="true"
                      className="mx-auto text-stone-400"
                      size={30}
                    />
                    <span>上传一张正脸或半侧脸妆容照片开始分析。</span>
                    <input
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
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
                  真实 FaceMesh 需要
                  {' '}
                  <code>public/mediapipe/face_landmarker.task</code>
                  {' '}
                  和
                  {' '}
                  <code>public/mediapipe/wasm/vision_wasm_internal.js</code>
                  。如果缺失，localhost 开发环境会自动 fallback 到 mock vision provider；如果需要真实
                  FaceMesh，请把 MediaPipe model/wasm 文件放回 public/mediapipe。
                </div>
              )}
            </section>

            <section className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">状态</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {result ? '分析完成' : photo ? '等待分析' : '等待上传'}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">当前区域</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {regionLabels[activeTarget]}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">已修正区域</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {adjustedTargets.length}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">编辑次数</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">{totalEdits}</p>
              </div>
            </section>
          </div>

          <aside className="grid min-w-0 content-start gap-5">
            <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">蒙版编辑</h2>
                  <p className="text-xs text-stone-500">
                    选择区域和笔刷后，在左侧大图上点击修正。
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    checked={editingEnabled}
                    onChange={(event) => setEditingEnabled(event.target.checked)}
                    type="checkbox"
                  />
                  启用
                </label>
              </div>

              <div className="mt-3 grid gap-3 text-sm">
                <label className="grid gap-1">
                  <span className="text-xs font-medium text-stone-500">编辑区域</span>
                  <select
                    className="rounded-md border border-stone-200 px-2 py-2"
                    onChange={(event) =>
                      setActiveTarget(event.target.value as CosmeticSegmentationTarget)
                    }
                    value={activeTarget}
                  >
                    {editableTargets.map((target) => (
                      <option key={target} value={target}>
                        {regionLabels[target]}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(brushToolLabels) as MaskEditTool[]).map((tool) => (
                    <button
                      className={`rounded-md border px-3 py-2 text-sm ${
                        brushTool === tool
                          ? 'border-teal-700 bg-teal-50 text-teal-900'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                      key={tool}
                      onClick={() => setBrushTool(tool)}
                      type="button"
                    >
                      {brushToolLabels[tool]}
                    </button>
                  ))}
                </div>

                <label className="grid gap-1">
                  <span className="text-xs font-medium text-stone-500">
                    笔刷半径 {brushRadius.toFixed(2)}
                  </span>
                  <input
                    max="0.18"
                    min="0.02"
                    onChange={(event) => setBrushRadius(Number(event.target.value))}
                    step="0.01"
                    type="range"
                    value={brushRadius}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs font-medium text-stone-500">
                    修正强度 {brushStrength.toFixed(2)}
                  </span>
                  <input
                    max="1"
                    min="0.1"
                    onChange={(event) => setBrushStrength(Number(event.target.value))}
                    step="0.05"
                    type="range"
                    value={brushStrength}
                  />
                </label>

                <div className="rounded-md bg-stone-50 p-3 text-xs text-stone-600">
                  <p>
                    已修正区域：
                    {adjustedTargets.map((target) => regionLabels[target]).join('、') ||
                      '暂无'}
                  </p>
                  <p>当前蒙版编辑次数：{totalEdits}</p>
                </div>

                <button
                  className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!pixelData || adjustedTargets.length === 0 || reanalyzing}
                  onClick={reanalyzeEditedMasks}
                  type="button"
                >
                  {reanalyzing ? '正在重新分析...' : '重新分析修正区域'}
                </button>
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
              <button
                className="flex w-full items-center justify-between gap-3 text-left"
                onClick={() => setShowDebugLayers((current) => !current)}
                type="button"
              >
                <div>
                  <h2 className="text-base font-semibold">调试图层</h2>
                  <p className="text-xs text-stone-500">
                    默认收起，避免挤压左侧图片。
                  </p>
                </div>
                {showDebugLayers ? (
                  <ChevronDown aria-hidden="true" size={18} />
                ) : (
                  <ChevronRight aria-hidden="true" size={18} />
                )}
              </button>

              {showDebugLayers ? (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {Object.entries(layerLabels).map(([key, label]) => (
                      <label
                        className="flex min-w-0 items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm"
                        key={key}
                      >
                        <input
                          checked={layers[key as keyof VisionDebugOverlayLayers]}
                          onChange={() =>
                            toggleLayer(key as keyof VisionDebugOverlayLayers)
                          }
                          type="checkbox"
                        />
                        <span className="truncate">{label}</span>
                      </label>
                    ))}
                  </div>
                  <label className="mt-4 grid gap-1.5 text-sm">
                    <span className="text-xs font-medium text-stone-500">
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
                  <label className="mt-3 grid gap-1.5 text-sm">
                    <span className="text-xs font-medium text-stone-500">
                      缩放 {zoom.toFixed(2)}x
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
                </>
              ) : null}
            </section>

            <VisionQaPanel
              activeRegion={activeTarget}
              analysis={result}
              brushRadius={brushRadius}
              brushTool={brushTool}
              editableMasks={editableMasks}
              onActiveRegionChange={setActiveTarget}
              onBrushRadiusChange={setBrushRadius}
              onBrushToolChange={setBrushTool}
              onReanalyze={reanalyzeEditedMasks}
              onToggleRegion={(target) =>
                setAdjustedTargets((current) =>
                  current.includes(target)
                    ? current.filter((item) => item !== target)
                    : [...current, target],
                )
              }
              template={convergedTemplatePreview}
              visibleRegions={adjustedTargets}
            />

            <VisionAnalysisReadinessSummary
              regionQa={faceMeshRegionQa}
              runtimeNotice={runtimeNotice}
            />

            <section className="rounded-lg border border-stone-200 bg-stone-950 p-4 text-stone-100 shadow-soft">
              <button
                className="flex w-full items-center justify-between gap-3 text-left"
                onClick={() => setShowDeveloperDetails((current) => !current)}
                type="button"
              >
                <div>
                  <h2 className="text-base font-semibold">开发者信息</h2>
                  <p className="text-xs text-stone-400">
                    Trace 与 JSON 默认收起。
                  </p>
                </div>
                {showDeveloperDetails ? (
                  <ChevronDown aria-hidden="true" size={18} />
                ) : (
                  <ChevronRight aria-hidden="true" size={18} />
                )}
              </button>

              {showDeveloperDetails ? (
                <div className="mt-4 grid gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">Pipeline Trace</h3>
                    <ol className="mt-3 grid gap-2 text-sm text-stone-200">
                      {(result?.trace ?? ['image-input']).map((stage, index) => (
                        <li
                          className="flex items-center gap-2"
                          key={`${stage}-${index}`}
                        >
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-400/20 text-xs font-semibold text-teal-100">
                            {index + 1}
                          </span>
                          {stage}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">妆容参数 JSON</h3>
                    <pre className="mt-3 max-h-[280px] overflow-auto rounded-md bg-black/30 p-3 text-xs leading-5 text-stone-200">
                      <code>{JSON.stringify(result?.parameters ?? {}, null, 2)}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">模板预览 JSON</h3>
                    <pre className="mt-3 max-h-[280px] overflow-auto rounded-md bg-black/30 p-3 text-xs leading-5 text-stone-200">
                      <code>
                        {JSON.stringify(convergedTemplatePreview ?? {}, null, 2)}
                      </code>
                    </pre>
                  </div>
                </div>
              ) : null}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
