import type { SourceImageArtifactLink, SourceImageEntry } from '../../../training/schema';
import type {
  BrowserArtifactResource,
  SourceImageArtifactBinding,
  TemplateAnalysisSeed,
  TemplateAnalysisSeedArtifactLink,
} from '../../../templates/schema';
import {
  isBrowserReadableArtifactUri,
  resolveSourceImageArtifacts,
} from '../../../templates/storage';

export interface SourceImagePreviewProps {
  entry?: SourceImageEntry | null;
  seed?: TemplateAnalysisSeed | null;
  binding?: SourceImageArtifactBinding | null;
  boundArtifactResource?: BrowserArtifactResource | null;
}

const toPreviewLink = (
  entry?: SourceImageEntry | null,
  seed?: TemplateAnalysisSeed | null,
): TemplateAnalysisSeedArtifactLink | SourceImageArtifactLink | undefined => {
  if (seed?.normalizedPngReference) {
    return seed.normalizedPngReference;
  }

  if (!entry) {
    return undefined;
  }

  return resolveSourceImageArtifacts(entry)['normalized-png'];
};

const linkIsBrowserReadable = (
  link: TemplateAnalysisSeedArtifactLink | SourceImageArtifactLink | undefined,
): boolean => {
  if (!link) {
    return false;
  }

  return 'browserReadable' in link ? link.browserReadable : isBrowserReadableArtifactUri(link.uri);
};

export function SourceImagePreview({
  entry,
  seed,
  binding,
  boundArtifactResource,
}: SourceImagePreviewProps) {
  const previewLink = toPreviewLink(entry, seed);
  const readable = linkIsBrowserReadable(previewLink);
  const browserResource =
    boundArtifactResource ?? seed?.boundArtifactResource ?? binding?.browserResource ?? null;
  const boundPreviewUrl =
    browserResource?.objectUrl ?? browserResource?.previewUrl ?? seed?.browserPreviewUrl;
  const width = seed?.imageWidth ?? entry?.decodedWidth;
  const height = seed?.imageHeight ?? entry?.decodedHeight;
  const fileName = seed?.originalFileName ?? entry?.originalFileName ?? '未选择源图';
  const readiness =
    seed?.readiness ??
    (entry?.importStatus === 'ready_for_template_analysis'
      ? 'ready_for_vision_analysis'
      : entry?.importStatus ?? '未选择');

  return (
    <section className="rounded-md border border-stone-200 bg-stone-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-stone-900">{fileName}</h3>
          <p className="text-xs text-stone-500">
            {width && height ? `${width} × ${height}` : '暂无尺寸'} / {readiness}
          </p>
        </div>
      </div>

      <div className="mt-3 grid min-h-[160px] place-items-center rounded-md border border-dashed border-stone-300 bg-white p-3">
        {boundPreviewUrl ? (
          <img
            alt="绑定 artifact 预览"
            className="max-h-[220px] max-w-full object-contain"
            src={boundPreviewUrl}
          />
        ) : previewLink && readable ? (
          <img
            alt="源图预览"
            className="max-h-[220px] max-w-full object-contain"
            src={previewLink.uri}
          />
        ) : (
          <div className="max-w-sm text-center text-xs leading-5 text-stone-500">
            <p className="font-semibold text-stone-700">当前 artifact 不能由浏览器直接预览</p>
            <p className="mt-1">
              CLI package 中的相对路径不会被前端自动读取，也不会被前端假装读取。请通过文件选择器提供图片，或把
              normalized PNG 暴露为可访问 URL / data URI。
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 grid gap-1 text-xs text-stone-600">
        <p>
          首选预览：{boundPreviewUrl ? 'bound artifact' : previewLink?.kind ?? '无 normalized PNG'}
        </p>
        <p className="break-all">artifact: {previewLink?.uri ?? '无'}</p>
        <p>色彩空间: {seed?.colorSpace ?? entry?.colorSpace ?? 'unknown'}</p>
        {binding ? <p>绑定状态：{binding.status}</p> : null}
        {browserResource?.objectUrl ? (
          <p className="text-amber-700">
            object URL 只在当前页面生命周期内有效，刷新后需要重新绑定本地 artifact 文件。
          </p>
        ) : null}
        {binding?.issues.length ? (
          <p className="text-amber-700">
            {binding.issues.map((nextIssue) => nextIssue.message).join('；')}
          </p>
        ) : null}
      </div>
    </section>
  );
}
