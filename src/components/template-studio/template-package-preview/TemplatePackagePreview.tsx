import { FileJson, PackageCheck } from 'lucide-react';
import type { TemplatePublishPackage } from '../../../templates/schema';
import { summarizeTemplatePublishPackage } from '../../../templates/storage';

export interface TemplatePackagePreviewProps {
  packageData?: TemplatePublishPackage | null;
  selectedEntryId?: string;
}

export function TemplatePackagePreview({
  packageData,
  selectedEntryId,
}: TemplatePackagePreviewProps) {
  const selectedEntry =
    packageData?.entries.find((entry) => entry.libraryEntryId === selectedEntryId) ??
    packageData?.entries[0] ??
    null;

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">模板发布包预览</h2>
          <p className="text-xs text-stone-500">
            Template Package Preview 只展示本地 package metadata，不代表线上发布。
          </p>
        </div>
        <PackageCheck aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      {packageData ? (
        <div className="mt-4 grid gap-3">
          <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <p className="rounded-md bg-teal-50 p-2">entries {packageData.entries.length}</p>
            <p className="rounded-md bg-teal-50 p-2">
              ready {String(packageData.validation.readiness.ready)}
            </p>
            <p className="rounded-md bg-stone-50 p-2">{packageData.packageVersion}</p>
            <p className="rounded-md bg-stone-50 p-2">local-only</p>
          </div>
          <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-900">
            本地发布包不会上传服务器，不包含 object URL、本地绝对路径或大图 bytes。
          </p>

          <div className="grid gap-2">
            {packageData.entries.map((entry) => (
              <article
                className={`rounded-md border p-3 text-sm ${
                  selectedEntry?.libraryEntryId === entry.libraryEntryId
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-stone-200'
                }`}
                key={entry.libraryEntryId}
              >
                <p className="font-semibold">{entry.templateData.name}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {entry.templateId} / {entry.templateVersion} / {entry.packageStatus}
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  styleTags: {entry.styleTags.join(', ') || 'none'}
                </p>
                <p className="mt-1 text-xs text-stone-600">
                  evidence: {entry.evidenceSummary.evidenceReady ? 'ready' : 'missing'} / lineage:{' '}
                  {entry.lineage.source.sourceProductionTaskId}
                </p>
              </article>
            ))}
          </div>

          {selectedEntry ? (
            <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
              <p className="text-xs font-semibold text-stone-600">模板步骤</p>
              <ol className="mt-2 grid gap-1 text-xs text-stone-700">
                {selectedEntry.makeupSteps.map((step) => (
                  <li key={step.id}>
                    {step.order}. {step.region} / {step.action} / {step.instruction}
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-xs text-stone-600">
                evidence notes: {selectedEntry.evidenceSummary.notes.join(' / ') || 'none'}
              </p>
            </div>
          ) : null}

          <div className="rounded-md bg-stone-950 p-3 text-xs text-stone-100">
            <span className="inline-flex items-center gap-1 font-semibold">
              <FileJson aria-hidden="true" size={14} />
              Package summary
            </span>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">
              {summarizeTemplatePublishPackage(packageData)}
            </pre>
          </div>
        </div>
      ) : (
        <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-500">
          暂无 Template Publish Package。请先在 Template Library Panel 中构建本地发布包。
        </p>
      )}
    </section>
  );
}
