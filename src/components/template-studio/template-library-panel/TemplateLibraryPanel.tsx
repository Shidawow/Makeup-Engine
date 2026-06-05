import { useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  FileJson,
  Library,
  PackageCheck,
  RotateCcw,
  Tags,
  XCircle,
} from 'lucide-react';
import type {
  MakeupTemplate,
  TemplateLibrary,
  TemplateLibraryEntry,
  TemplatePublishPackage,
} from '../../../templates/schema';
import type {
  TemplateProductionBatch,
  TemplateProductionTask,
} from '../../../templates/schema/template-production-batch.schema';
import {
  exportTemplateLibraryHandoff,
  exportTemplateLibraryJson,
  exportTemplatePublishPackageHandoff,
  exportTemplatePublishPackageJson,
  importTemplateLibraryJson,
  saveTemplateLibrary,
  buildTemplatePublishPackage,
} from '../../../templates/storage';
import {
  addEntryToTemplateLibrary,
  archiveLibraryEntry,
  bumpTemplateVersion,
  createLibraryEntryFromProductionTask,
  createTemplateLibrary,
  deprecateLibraryEntry,
  markEntryLocalPublished,
  markEntryPackaged,
  markEntryReadyForPackage,
  rejectLibraryEntry,
  summarizeTemplateLibrary,
} from '../../../template-engine';

export interface TemplateLibraryPanelProps {
  productionBatch?: TemplateProductionBatch | null;
  selectedProductionTask?: TemplateProductionTask | null;
  currentTemplate?: MakeupTemplate | null;
  activeLibrary?: TemplateLibrary | null;
  selectedEntryId?: string;
  activePackage?: TemplatePublishPackage | null;
  onLibraryChange: (library: TemplateLibrary | null) => void;
  onSelectedEntryChange?: (entry: TemplateLibraryEntry | null) => void;
  onPackageChange?: (packageData: TemplatePublishPackage | null) => void;
}

const localPublishedDisclaimer =
  'local_published 只是本地模板库状态，不是线上发布，不会上传服务器，也不会生成 training dataset。';

const cloneLibraryWithEntry = (
  library: TemplateLibrary,
  entry: TemplateLibraryEntry,
): TemplateLibrary => {
  const withEntry = addEntryToTemplateLibrary(library, entry);

  return {
    ...withEntry,
    summary: summarizeTemplateLibrary(withEntry),
  };
};

const findSelectedEntry = (
  library: TemplateLibrary | null | undefined,
  selectedEntryId: string | undefined,
): TemplateLibraryEntry | null =>
  library?.entries.find((entry) => entry.libraryEntryId === selectedEntryId) ??
  library?.entries[0] ??
  null;

export function TemplateLibraryPanel({
  productionBatch,
  selectedProductionTask,
  currentTemplate,
  activeLibrary,
  selectedEntryId,
  activePackage,
  onLibraryChange,
  onSelectedEntryChange,
  onPackageChange,
}: TemplateLibraryPanelProps) {
  const [libraryName, setLibraryName] = useState('本地模板库');
  const [message, setMessage] = useState('');
  const [exchangeJson, setExchangeJson] = useState('');
  const [rejectReason, setRejectReason] = useState('library review rejected');
  const [deprecateReason, setDeprecateReason] = useState('superseded by newer package');
  const selectedEntry = useMemo(
    () => findSelectedEntry(activeLibrary, selectedEntryId),
    [activeLibrary, selectedEntryId],
  );

  const ensureLibrary = (): TemplateLibrary =>
    activeLibrary ??
    createTemplateLibrary({
      name: libraryName.trim() || '本地模板库',
    });

  const persistLibrary = (library: TemplateLibrary) => {
    saveTemplateLibrary(library);
    onLibraryChange(library);
    onSelectedEntryChange?.(findSelectedEntry(library, selectedEntryId));
  };

  const createEntryFromSelectedTask = () => {
    if (!productionBatch || !selectedProductionTask) {
      setMessage('请先选择 approved 或 local published 的 production task。');
      return;
    }

    if (!currentTemplate) {
      setMessage('当前任务缺少 makeup template，不能进入 Template Library。');
      return;
    }

    try {
      const entry = createLibraryEntryFromProductionTask({
        task: selectedProductionTask,
        template: currentTemplate,
        sourceProductionBatchId: productionBatch.batchId,
      });
      const nextLibrary = cloneLibraryWithEntry(ensureLibrary(), entry);
      persistLibrary(nextLibrary);
      onSelectedEntryChange?.(entry);
      setMessage('已从 Production Task 创建 Template Library Entry。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '创建 Library Entry 失败。');
    }
  };

  const updateSelectedEntry = (
    updater: (entry: TemplateLibraryEntry) => TemplateLibraryEntry,
    nextMessage: string,
  ) => {
    if (!activeLibrary || !selectedEntry) {
      setMessage('请先选择 library entry。');
      return;
    }

    const updated = updater(selectedEntry);
    const nextLibrary = cloneLibraryWithEntry(activeLibrary, updated);
    persistLibrary(nextLibrary);
    onSelectedEntryChange?.(updated);
    setMessage(nextMessage);
  };

  const bumpSelectedVersion = () => {
    updateSelectedEntry(
      (entry) => {
        const nextVersion = bumpTemplateVersion(entry.templateVersion, 'patch');

        return {
          ...entry,
          templateVersion: nextVersion,
          versionHistory: [
            ...entry.versionHistory,
            {
              version: nextVersion,
              changeType: 'patch',
              createdAt: new Date().toISOString(),
              reason: 'metadata or tag update',
              notes: ['patch version bump from Template Library Panel'],
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      },
      '已 bump patch version。',
    );
  };

  const buildPackage = () => {
    if (!activeLibrary) {
      setMessage('请先创建 Template Library。');
      return;
    }

    const packageData = buildTemplatePublishPackage({
      library: activeLibrary,
      packageName: `${activeLibrary.name} Publish Package`,
    });
    onPackageChange?.(packageData);
    setMessage('已构建 Template Publish Package。');
  };

  const exportLibrary = () => {
    if (!activeLibrary) {
      setMessage('暂无可导出的 Template Library。');
      return;
    }

    setExchangeJson(exportTemplateLibraryJson(activeLibrary));
    setMessage('已生成 Template Library JSON。');
  };

  const exportLibraryHandoff = () => {
    if (!activeLibrary) {
      setMessage('暂无可导出的 Template Library。');
      return;
    }

    setExchangeJson(exportTemplateLibraryHandoff(activeLibrary));
    setMessage('已生成 Template Library handoff。');
  };

  const exportPackage = () => {
    if (!activePackage) {
      setMessage('暂无可导出的 Publish Package。');
      return;
    }

    setExchangeJson(exportTemplatePublishPackageJson(activePackage));
    setMessage('已生成 Template Publish Package JSON。');
  };

  const exportPackageHandoff = () => {
    if (!activePackage) {
      setMessage('暂无可导出的 Publish Package。');
      return;
    }

    setExchangeJson(exportTemplatePublishPackageHandoff(activePackage));
    setMessage('已生成 Publish Package handoff。');
  };

  const importLibrary = () => {
    try {
      const library = importTemplateLibraryJson(exchangeJson);
      persistLibrary(library);
      setMessage('已导入 Template Library JSON。');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '导入 Template Library 失败。');
    }
  };

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Template Library 管理</h2>
          <p className="text-xs text-stone-500">
            将已通过 QA / review 的 Production Task 收敛为本地 Template Library Entry 和 Publish Package。
          </p>
        </div>
        <Library aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5 text-sm">
          <span className="text-xs font-semibold text-stone-500">Library name</span>
          <input
            className="h-9 rounded-md border border-stone-200 px-3 text-sm"
            onChange={(event) => setLibraryName(event.target.value)}
            value={libraryName}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedProductionTask || !currentTemplate}
            onClick={createEntryFromSelectedTask}
            type="button"
          >
            <Library aria-hidden="true" size={15} />
            从 Production Task 创建 Entry
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700"
            onClick={exportLibrary}
            type="button"
          >
            <FileJson aria-hidden="true" size={15} />
            导出 Library JSON
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700"
            onClick={exportLibraryHandoff}
            type="button"
          >
            <FileJson aria-hidden="true" size={15} />
            导出 Library Handoff
          </button>
        </div>
      </div>

      {activeLibrary ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <p className="rounded-md bg-teal-50 p-2">entries {activeLibrary.summary.totalEntries}</p>
            <p className="rounded-md bg-stone-50 p-2">review {activeLibrary.summary.needsReview}</p>
            <p className="rounded-md bg-stone-50 p-2">ready {activeLibrary.summary.readyForPackage}</p>
            <p className="rounded-md bg-stone-50 p-2">packaged {activeLibrary.summary.packaged}</p>
            <p className="rounded-md bg-stone-50 p-2">local {activeLibrary.summary.localPublished}</p>
            <p className="rounded-md bg-rose-50 p-2">rejected {activeLibrary.summary.rejected}</p>
            <p className="rounded-md bg-stone-50 p-2">archived {activeLibrary.summary.archived}</p>
            <p className="rounded-md bg-stone-50 p-2">deprecated {activeLibrary.summary.deprecated}</p>
          </div>

          <p className="mt-3 rounded-md bg-amber-50 p-2 text-xs text-amber-900">
            {localPublishedDisclaimer}
          </p>

          <div className="mt-3 grid gap-2">
            {activeLibrary.entries.map((entry) => (
              <button
                className={`rounded-md border p-3 text-left text-sm ${
                  entry.libraryEntryId === selectedEntry?.libraryEntryId
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
                key={entry.libraryEntryId}
                onClick={() => onSelectedEntryChange?.(entry)}
                type="button"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{entry.makeupTemplate.name}</span>
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px]">
                    {entry.status}
                  </span>
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px]">
                    v{entry.templateVersion}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-stone-500">
                  task {entry.sourceProductionTaskId} / evidence{' '}
                  {entry.evidenceSummary.evidenceReady ? 'ready' : 'missing'} / quality{' '}
                  {entry.qualitySummary.qualityScore ?? 'n/a'}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-stone-600">
                  <Tags aria-hidden="true" size={12} />
                  {entry.styleTags.join(', ') || 'no tags'}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 rounded-md bg-stone-50 p-3 text-sm text-stone-500">
          暂无 Template Library。请选择已 approved / published 且有 evidence 的 Production Task 创建 Entry。
        </p>
      )}

      {selectedEntry ? (
        <div className="mt-4 grid gap-3 rounded-md border border-stone-200 p-3">
          <div>
            <p className="text-sm font-semibold">当前 Entry：{selectedEntry.makeupTemplate.name}</p>
            <p className="text-xs text-stone-500">
              {selectedEntry.status} / {selectedEntry.templateId} / v{selectedEntry.templateVersion}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() =>
                updateSelectedEntry(markEntryReadyForPackage, '已标记为 ready_for_package。')
              }
              type="button"
            >
              <CheckCircle2 aria-hidden="true" size={14} />
              ready_for_package
            </button>
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() => updateSelectedEntry(markEntryPackaged, '已标记为 packaged。')}
              type="button"
            >
              <PackageCheck aria-hidden="true" size={14} />
              packaged
            </button>
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() =>
                updateSelectedEntry(markEntryLocalPublished, '已标记为 local_published。')
              }
              type="button"
            >
              <CheckCircle2 aria-hidden="true" size={14} />
              local_published
            </button>
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={bumpSelectedVersion}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={14} />
              bump patch
            </button>
            <button
              className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 px-2 text-xs font-semibold"
              onClick={() => updateSelectedEntry(archiveLibraryEntry, '已 archive entry。')}
              type="button"
            >
              <Archive aria-hidden="true" size={14} />
              archive
            </button>
          </div>

          <div className="grid gap-2 rounded-md bg-stone-50 p-3">
            <input
              className="h-9 rounded-md border border-stone-200 px-3 text-sm"
              onChange={(event) => setRejectReason(event.target.value)}
              value={rejectReason}
            />
            <button
              className="inline-flex h-8 w-fit items-center gap-1 rounded-md border border-rose-200 px-2 text-xs font-semibold text-rose-800"
              onClick={() =>
                updateSelectedEntry(
                  (entry) => rejectLibraryEntry(entry, rejectReason),
                  '已 reject library entry。',
                )
              }
              type="button"
            >
              <XCircle aria-hidden="true" size={14} />
              reject entry
            </button>
            <input
              className="h-9 rounded-md border border-stone-200 px-3 text-sm"
              onChange={(event) => setDeprecateReason(event.target.value)}
              value={deprecateReason}
            />
            <button
              className="h-8 w-fit rounded-md border border-amber-200 px-2 text-xs font-semibold text-amber-800"
              onClick={() =>
                updateSelectedEntry(
                  (entry) => deprecateLibraryEntry(entry, deprecateReason),
                  '已 deprecate library entry。',
                )
              }
              type="button"
            >
              deprecate entry
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 rounded-md bg-teal-50 p-3">
        <p className="text-xs font-semibold text-teal-900">Publish Package 操作</p>
        <div className="flex flex-wrap gap-2">
          <button
            className="h-8 rounded-md bg-teal-700 px-2 text-xs font-semibold text-white"
            onClick={buildPackage}
            type="button"
          >
            build package
          </button>
          <button
            className="h-8 rounded-md border border-teal-200 px-2 text-xs font-semibold text-teal-900"
            onClick={exportPackage}
            type="button"
          >
            export package JSON
          </button>
          <button
            className="h-8 rounded-md border border-teal-200 px-2 text-xs font-semibold text-teal-900"
            onClick={exportPackageHandoff}
            type="button"
          >
            export package handoff
          </button>
        </div>
        <p className="text-xs text-teal-900">
          package readiness: {activePackage?.validation.readiness.ready ? 'ready' : 'not built'}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <textarea
          className="min-h-28 rounded-md border border-stone-200 p-2 font-mono text-xs"
          onChange={(event) => setExchangeJson(event.target.value)}
          placeholder="Template Library JSON / Publish Package JSON / handoff"
          value={exchangeJson}
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="h-8 rounded-md border border-stone-200 px-2 text-xs font-semibold"
            onClick={importLibrary}
            type="button"
          >
            导入 Library JSON
          </button>
          {message ? <p className="text-xs text-stone-600">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}
