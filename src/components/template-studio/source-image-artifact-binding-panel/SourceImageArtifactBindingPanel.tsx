import { ChangeEvent, useMemo, useState } from 'react';
import { FileUp, ShieldAlert } from 'lucide-react';
import type { SourceImageArtifactLink, SourceImageEntry } from '../../../training/schema';
import type {
  BrowserArtifactResource,
  SourceImageArtifactBindingMap,
} from '../../../templates/schema';
import {
  artifactBindingMapKey,
  createSourceImageArtifactBinding,
  resolveBestBoundArtifactForAnalysis,
  resolveSourceImageArtifacts,
  revokeBrowserObjectUrl,
} from '../../../templates/storage';

type ObjectUrlApi = Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;

export interface SourceImageArtifactBindingPanelProps {
  entry: SourceImageEntry;
  sourceImagePackageId: string;
  bindings: SourceImageArtifactBindingMap;
  onBindingsChange: (bindings: SourceImageArtifactBindingMap) => void;
  onActiveResourceChange?: (resource: BrowserArtifactResource | null) => void;
  objectUrlApi?: ObjectUrlApi;
}

const labels: Record<string, string> = {
  'normalized-png': 'normalized PNG',
  'json-rgba': 'JSON RGBA',
  'raw-rgba': 'raw RGBA',
};

const acceptByKind = (kind: SourceImageArtifactLink['kind']): string =>
  kind === 'normalized-png'
    ? 'image/png,.png'
    : kind === 'json-rgba' || kind === 'raw-rgba'
      ? 'application/json,.json'
      : '*/*';

const statusLabel: Record<string, string> = {
  unbound: '未绑定',
  bound: '已绑定',
  validated: '已验证',
  mismatch: 'mismatch',
  unsupported: 'unsupported',
  failed: 'failed',
};

export function SourceImageArtifactBindingPanel({
  entry,
  sourceImagePackageId,
  bindings,
  onBindingsChange,
  onActiveResourceChange,
  objectUrlApi,
}: SourceImageArtifactBindingPanelProps) {
  const [message, setMessage] = useState<string | null>(null);
  const artifacts = useMemo(() => resolveSourceImageArtifacts(entry), [entry]);
  const manifestArtifacts = useMemo(
    () =>
      (['normalized-png', 'json-rgba', 'raw-rgba'] as const)
        .map((kind) => artifacts[kind])
        .filter((artifact): artifact is SourceImageArtifactLink => Boolean(artifact)),
    [artifacts],
  );

  const bindArtifact = async (
    artifact: SourceImageArtifactLink,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const key = artifactBindingMapKey(entry.sourceImageId, artifact.uri);
      const previous = bindings[key];

      if (previous?.objectUrl) {
        revokeBrowserObjectUrl(previous.objectUrl, objectUrlApi);
      }

      const binding = await createSourceImageArtifactBinding({
        sourceImageId: entry.sourceImageId,
        sourceImagePackageId,
        manifestArtifactReference: artifact,
        file,
        objectUrlApi,
      });
      const nextBindings = { ...bindings, [key]: binding };
      const best = resolveBestBoundArtifactForAnalysis(
        nextBindings,
        entry.sourceImageId,
      );

      onBindingsChange(nextBindings);
      onActiveResourceChange?.(best?.browserResource ?? null);
      setMessage(
        binding.status === 'validated'
          ? `${labels[artifact.kind]} 已绑定并验证。`
          : `${labels[artifact.kind]} 已绑定，但当前状态为 ${binding.status}。`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? `artifact 绑定失败：${error.message}` : 'artifact 绑定失败。',
      );
    } finally {
      event.target.value = '';
    }
  };

  const bestBinding = resolveBestBoundArtifactForAnalysis(bindings, entry.sourceImageId);

  return (
    <section className="rounded-md border border-teal-100 bg-teal-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-teal-950">Artifact 绑定</h3>
          <p className="mt-1 text-xs leading-5 text-teal-900">
            manifest 中的相对路径只是 reference，浏览器不能自动读取本机路径。只有 operator 显式选择的文件才会进入当前 Studio session。
          </p>
        </div>
        <ShieldAlert aria-hidden="true" className="shrink-0 text-teal-700" size={16} />
      </div>

      <div className="mt-3 grid gap-2">
        {manifestArtifacts.length > 0 ? (
          manifestArtifacts.map((artifact) => {
            const key = artifactBindingMapKey(entry.sourceImageId, artifact.uri);
            const binding = bindings[key];

            return (
              <div
                className="grid gap-2 rounded-md border border-teal-200 bg-white p-3 text-xs"
                key={artifact.uri}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900">
                      {labels[artifact.kind] ?? artifact.kind}
                    </p>
                    <p className="break-all text-stone-500">{artifact.uri}</p>
                  </div>
                  <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border border-stone-200 px-2 text-xs font-medium text-stone-700">
                    <FileUp aria-hidden="true" size={14} />
                    绑定文件
                    <input
                      accept={acceptByKind(artifact.kind)}
                      className="hidden"
                      onChange={(event) => void bindArtifact(artifact, event)}
                      type="file"
                    />
                  </label>
                </div>
                <div className="grid gap-1 text-stone-600">
                  <p>状态：{statusLabel[binding?.status ?? 'unbound']}</p>
                  {binding ? (
                    <>
                      <p>文件：{binding.fileName} / {binding.fileSize} bytes</p>
                      <p>checksum：{binding.fileChecksum}</p>
                      {binding.issues.length > 0 ? (
                        <p className="text-amber-700">
                          {binding.issues.map((nextIssue) => nextIssue.message).join('；')}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-md bg-white p-3 text-xs text-stone-600">
            当前 source image entry 没有可绑定的 normalized PNG / JSON RGBA / raw RGBA reference。
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-1 text-xs leading-5 text-teal-950">
        <p>页面刷新后 object URL 会失效，需要重新绑定本地文件。</p>
        <p>不会保存本地绝对路径，也不会把大图片 bytes 写入 session storage。</p>
        <p>SourceImagePackage 仍不是 training dataset，不能绕过 correction / review queue。</p>
        {bestBinding ? <p>当前可分析 artifact：{bestBinding.fileName}</p> : null}
        {message ? <p className="rounded-md bg-white p-2 text-stone-700">{message}</p> : null}
      </div>
    </section>
  );
}

