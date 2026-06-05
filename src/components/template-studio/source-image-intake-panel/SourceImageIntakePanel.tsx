import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { FileJson, ImagePlus, PackageOpen, ShieldAlert } from 'lucide-react';
import type { SourceImageManifest } from '../../../training/schema';
import type {
  BrowserArtifactResource,
  SourceImageArtifactBindingMap,
  TemplateAnalysisSeed,
} from '../../../templates/schema';
import {
  createTemplateAnalysisSeedFromEntry,
  getSourceImageEntryDetail,
  listSourceImageEntriesByStatus,
  parseSourceImageManifestJson,
  summarizeSourceImagePackageForStudio,
  validateSourceImageManifestForStudio,
} from '../../../templates/storage';
import { resolveBestBoundArtifactForAnalysis } from '../../../templates/storage/sourceImageArtifactBinding';
import {
  addTemplateAnalysisSeedToSession,
  createSourceImageStudioSession,
  saveSourceImageStudioSession,
} from '../../../templates/storage/sourceImageStudioSession';
import { SourceImageArtifactBindingPanel } from '../source-image-artifact-binding-panel';
import { SourceImagePreview } from '../source-image-preview';
import { SourceImageQuarantinePanel } from '../source-image-quarantine-panel';

export interface SourceImageIntakePanelProps {
  activeSeed?: TemplateAnalysisSeed | null;
  initialManifest?: SourceImageManifest | null;
  initialManifestJson?: string;
  artifactBindings?: SourceImageArtifactBindingMap;
  onArtifactBindingsChange?: (bindings: SourceImageArtifactBindingMap) => void;
  onActiveArtifactResourceChange?: (
    resource: BrowserArtifactResource | null,
  ) => void;
  onManifestChange?: (manifest: SourceImageManifest | null) => void;
  onSeedCreated: (seed: TemplateAnalysisSeed) => void;
}

const importCommand =
  'node scripts/import-source-images.mjs --input ./local-photos --out ./tmp/source-images/admin-batch-v0 --codec-preference png,jpeg --materialize-normalized-png --materialize-raw-rgba --materialize-json-rgba --write-manifest --quality-gate --json';

const transparentPngDataUri =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGNgYGD4z8DAwMDAwMAAAAwAAf9uR4IAAAAASUVORK5CYII=';

export const createDemoSourceImageManifest = (): SourceImageManifest => ({
  schemaVersion: 'source-image-package-v0.1',
  packageId: 'demo-source-image-package',
  createdAt: '2026-05-30T00:00:00.000Z',
  readiness: 'warning',
  issueCodes: ['demo-fixture'],
  entries: [
    {
      sourceImageId: 'demo-ready-lips',
      originalFileName: 'demo-ready-lips.png',
      originalFileChecksum: 'demo-ready-checksum',
      originalFileKind: 'png',
      decodedWidth: 2,
      decodedHeight: 2,
      colorSpace: 'srgb',
      channels: 4,
      orientation: 'missing',
      normalizedArtifactLinks: [
        {
          kind: 'normalized-png',
          uri: transparentPngDataUri,
          checksum: 'demo-normalized-png',
          width: 2,
          height: 2,
          format: 'png-image',
        },
        {
          kind: 'json-rgba',
          uri: 'image-pixels/demo-ready-lips.rgba.json',
          checksum: 'demo-json-rgba',
          width: 2,
          height: 2,
          format: 'json-rgba-grid',
        },
      ],
      codecReport: {
        originalKind: 'png',
        pngCodecReadiness: 'ready',
        jpegBoundaryStatus: 'not-applicable',
        decoded: true,
        issueCodes: [],
      },
      qualityReport: {
        readiness: 'ready',
        qualityScore: 0.92,
        width: 2,
        height: 2,
        brightness: 0.55,
        contrast: 0.21,
        colorVariance: 0.18,
        alphaCoverage: 1,
        issueCodes: [],
      },
      lineage: {
        importedBy: 'source-image-import-cli',
        sourceUri: 'demo-ready-lips.png',
        normalizedFromChecksum: 'demo-ready-checksum',
      },
      importStatus: 'ready_for_template_analysis',
      createdAt: '2026-05-30T00:00:00.000Z',
    },
    {
      sourceImageId: 'demo-blocked-codec',
      originalFileName: 'demo-blocked.jpg',
      originalFileChecksum: 'demo-blocked-checksum',
      originalFileKind: 'jpeg',
      decodedWidth: 0,
      decodedHeight: 0,
      colorSpace: 'unknown',
      channels: 0,
      orientation: 'unsupported',
      normalizedArtifactLinks: [],
      codecReport: {
        originalKind: 'jpeg',
        pngCodecReadiness: 'not-applicable',
        jpegBoundaryStatus: 'metadata-only',
        decoded: false,
        issueCodes: ['jpeg-pixel-decode-unsupported'],
      },
      qualityReport: {
        readiness: 'blocked',
        qualityScore: 0,
        width: 0,
        height: 0,
        brightness: 0,
        contrast: 0,
        colorVariance: 0,
        alphaCoverage: 0,
        issueCodes: ['source-image-not-decoded'],
      },
      lineage: {
        importedBy: 'source-image-import-cli',
        sourceUri: 'demo-blocked.jpg',
        normalizedFromChecksum: 'demo-blocked-checksum',
      },
      importStatus: 'blocked_by_codec',
      createdAt: '2026-05-30T00:00:00.000Z',
    },
  ],
});

export function SourceImageIntakePanel({
  activeSeed,
  initialManifest,
  initialManifestJson = '',
  artifactBindings,
  onArtifactBindingsChange,
  onActiveArtifactResourceChange,
  onManifestChange,
  onSeedCreated,
}: SourceImageIntakePanelProps) {
  const [manifestJson, setManifestJson] = useState(initialManifestJson);
  const [manifest, setManifest] = useState<SourceImageManifest | null>(
    initialManifest ?? null,
  );
  const [localArtifactBindings, setLocalArtifactBindings] =
    useState<SourceImageArtifactBindingMap>({});
  const [selectedSourceImageId, setSelectedSourceImageId] = useState(
    initialManifest?.entries[0]?.sourceImageId ?? '',
  );
  const [parseMessage, setParseMessage] = useState<string | null>(null);

  useEffect(() => {
    onManifestChange?.(manifest);
  }, [manifest, onManifestChange]);

  const summary = useMemo(
    () => (manifest ? summarizeSourceImagePackageForStudio(manifest) : null),
    [manifest],
  );
  const entriesByStatus = useMemo(
    () => (manifest ? listSourceImageEntriesByStatus(manifest) : null),
    [manifest],
  );
  const selectedDetail = useMemo(
    () =>
      manifest && selectedSourceImageId
        ? getSourceImageEntryDetail(manifest, selectedSourceImageId)
        : null,
    [manifest, selectedSourceImageId],
  );
  const activeArtifactBindings = artifactBindings ?? localArtifactBindings;
  const selectedBinding = useMemo(() => {
    if (!selectedDetail) {
      return null;
    }

    return (
      resolveBestBoundArtifactForAnalysis(
        activeArtifactBindings,
        selectedDetail.entry.sourceImageId,
      ) ??
      Object.values(activeArtifactBindings).find(
        (binding) => binding.sourceImageId === selectedDetail.entry.sourceImageId,
      ) ??
      null
    );
  }, [activeArtifactBindings, selectedDetail]);

  const parseManifest = () => {
    try {
      const parsed = parseSourceImageManifestJson(manifestJson);
      setManifest(parsed);
      setSelectedSourceImageId(parsed.entries[0]?.sourceImageId ?? '');
      setParseMessage('manifest 已导入，可以选择 ready 图片创建分析 seed。');
    } catch (error) {
      setParseMessage(error instanceof Error ? error.message : 'manifest 解析失败');
    }
  };

  const loadDemoManifest = () => {
    const demo = createDemoSourceImageManifest();
    setManifest(demo);
    setManifestJson(JSON.stringify(demo, null, 2));
    setSelectedSourceImageId(demo.entries[0]?.sourceImageId ?? '');
    setParseMessage('已加载 demo source image package。');
  };

  const onManifestFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      try {
        const validation = validateSourceImageManifestForStudio(
          JSON.parse(text) as unknown,
        );
        setManifestJson(text);
        setManifest(validation.manifest ?? null);
        setSelectedSourceImageId(validation.manifest?.entries[0]?.sourceImageId ?? '');
        setParseMessage(
          validation.valid
            ? 'manifest 文件已导入。'
            : `manifest 文件不可用：${validation.errors.join('; ')}`,
        );
      } catch (error) {
        setParseMessage(
          error instanceof Error ? `manifest 文件解析失败：${error.message}` : 'manifest 文件解析失败。',
        );
      }
    };
    reader.onerror = () => setParseMessage('manifest 文件读取失败。');
    reader.readAsText(file);
  };

  const createSeed = () => {
    if (!manifest || !selectedDetail) {
      return;
    }

    const seed = createTemplateAnalysisSeedFromEntry(manifest, selectedDetail.entry, {
      manifestReference: `source-image-package://${manifest.packageId}/manifest.json`,
      artifactBinding: selectedBinding ?? undefined,
    });
    const session = addTemplateAnalysisSeedToSession(
      createSourceImageStudioSession({ manifest, seeds: [] }),
      seed,
    );

    saveSourceImageStudioSession(session);
    onSeedCreated(seed);
  };

  const canCreateSeed =
    selectedDetail?.entry.importStatus === 'ready_for_template_analysis';

  const handleBindingsChange = (nextBindings: SourceImageArtifactBindingMap) => {
    if (!artifactBindings) {
      setLocalArtifactBindings(nextBindings);
    }

    onArtifactBindingsChange?.(nextBindings);
  };

  const handleActiveResourceChange = (resource: BrowserArtifactResource | null) => {
    onActiveArtifactResourceChange?.(resource);
  };

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">源图导入</h2>
          <p className="text-xs text-stone-500">
            从 SourceImagePackage 选择 ready 图片，创建 TemplateAnalysisSeed 后再进入视觉分析。
          </p>
        </div>
        <PackageOpen aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      {!manifest ? (
        <div className="mt-3 rounded-md border border-teal-100 bg-teal-50 p-3 text-xs leading-5 text-teal-950">
          没有 source image package 时，先在本地运行导入命令，然后把 manifest JSON
          粘贴到这里。工作台不会从浏览器直接读取任意本机路径。
          <pre className="mt-2 overflow-auto rounded bg-white p-2 text-[11px]">
            <code>{importCommand}</code>
          </pre>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        <textarea
          className="min-h-[110px] rounded-md border border-stone-200 p-3 text-xs leading-5 text-stone-700"
          onChange={(event) => setManifestJson(event.target.value)}
          placeholder="粘贴 source-image-manifest.json 内容"
          value={manifestJson}
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white"
            onClick={parseManifest}
            type="button"
          >
            <FileJson aria-hidden="true" size={15} />
            解析 manifest
          </button>
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700">
            <FileJson aria-hidden="true" size={15} />
            选择 JSON 文件
            <input
              accept="application/json,.json"
              className="hidden"
              onChange={onManifestFileChange}
              type="file"
            />
          </label>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700"
            onClick={loadDemoManifest}
            type="button"
          >
            <ImagePlus aria-hidden="true" size={15} />
            加载演示包
          </button>
        </div>
        {parseMessage ? (
          <p className="rounded-md border border-stone-200 bg-stone-50 p-2 text-xs text-stone-600">
            {parseMessage}
          </p>
        ) : null}
      </div>

      {summary ? (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <p className="rounded-md bg-stone-50 p-2">
            package <span className="font-semibold">{summary.packageId}</span>
          </p>
          <p className="rounded-md bg-stone-50 p-2">ready {summary.readyCount}</p>
          <p className="rounded-md bg-stone-50 p-2">blocked {summary.blockedCount}</p>
          <p className="rounded-md bg-stone-50 p-2">failed {summary.failedCount}</p>
        </div>
      ) : null}

      {entriesByStatus ? (
        <div className="mt-4 grid gap-2">
          <h3 className="text-sm font-semibold">图片列表</h3>
          {[...entriesByStatus.ready_for_template_analysis, ...entriesByStatus.blocked_by_codec, ...entriesByStatus.blocked_by_quality, ...entriesByStatus.failed]
            .sort((left, right) => left.sourceImageId.localeCompare(right.sourceImageId))
            .map((entry) => {
              const selected = entry.sourceImageId === selectedSourceImageId;

              return (
                <button
                  className={`rounded-md border p-3 text-left text-sm ${
                    selected
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                  key={entry.sourceImageId}
                  onClick={() => setSelectedSourceImageId(entry.sourceImageId)}
                  type="button"
                >
                  <span className="block font-semibold">{entry.originalFileName}</span>
                  <span className="mt-1 block text-xs text-stone-500">
                    {entry.importStatus} / {entry.decodedWidth}×{entry.decodedHeight} /{' '}
                    {entry.codecReport.originalKind} / 质量{' '}
                    {entry.qualityReport.qualityScore.toFixed(2)}
                  </span>
                </button>
              );
            })}
        </div>
      ) : null}

      {selectedDetail ? (
        <div className="mt-4 grid gap-3">
          <SourceImageArtifactBindingPanel
            bindings={activeArtifactBindings}
            entry={selectedDetail.entry}
            objectUrlApi={typeof URL === 'undefined' ? undefined : URL}
            onActiveResourceChange={handleActiveResourceChange}
            onBindingsChange={handleBindingsChange}
            sourceImagePackageId={manifest?.packageId ?? 'unknown-source-image-package'}
          />
          <SourceImagePreview
            binding={selectedBinding}
            entry={selectedDetail.entry}
            seed={activeSeed ?? undefined}
          />
          <div className="rounded-md border border-stone-200 p-3 text-xs leading-5 text-stone-600">
            <p>codec：{selectedDetail.entry.codecReport.originalKind}</p>
            <p>quality：{selectedDetail.entry.qualityReport.readiness}</p>
            <p>
              artifacts：
              {Object.values(selectedDetail.artifacts)
                .filter(Boolean)
                .map((artifact) => artifact?.kind)
                .join(', ') || '无'}
            </p>
            {selectedDetail.validation.issues.length > 0 ? (
              <p className="mt-2 text-amber-700">
                {selectedDetail.validation.issues.map((nextIssue) => nextIssue.message).join('；')}
              </p>
            ) : null}
          </div>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canCreateSeed}
            onClick={createSeed}
            type="button"
          >
            创建分析 Seed
          </button>
          {!canCreateSeed ? (
            <p className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
              <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
              被 codec、质量或 artifact 阻断的图片不能运行分析。请先查看隔离原因。
            </p>
          ) : null}
        </div>
      ) : null}

      {activeSeed ? (
        <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3 text-xs text-teal-950">
          当前 Seed：{activeSeed.originalFileName} / {activeSeed.readiness}
        </div>
      ) : null}

      <div className="mt-4">
        <SourceImageQuarantinePanel
          manifest={manifest}
          onSelectEntry={setSelectedSourceImageId}
        />
      </div>
    </section>
  );
}
