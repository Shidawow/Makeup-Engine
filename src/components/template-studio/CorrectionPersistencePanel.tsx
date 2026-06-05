import { Download, FileJson, FolderOpen, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type {
  CosmeticSegmentationTarget,
} from '../../vision';
import type { VisionCorrectionRecord } from '../../templates/storage';

export interface CorrectionPersistencePanelProps {
  records: readonly VisionCorrectionRecord[];
  activeRegion: CosmeticSegmentationTarget;
  selectedCorrectionId: string;
  exportJson: string;
  importJson: string;
  importError: string | null;
  onSelectedCorrectionChange: (id: string) => void;
  onLoadCorrection: () => void;
  onExportCorrections: () => void;
  onImportJsonChange: (json: string) => void;
  onImportCorrections: () => void;
  onImportFile: (file: File) => void;
}

export function CorrectionPersistencePanel({
  records,
  activeRegion,
  selectedCorrectionId,
  exportJson,
  importJson,
  importError,
  onSelectedCorrectionChange,
  onLoadCorrection,
  onExportCorrections,
  onImportJsonChange,
  onImportCorrections,
  onImportFile,
}: CorrectionPersistencePanelProps) {
  const activeRecords = records.filter((record) => record.region === activeRegion);
  const selectedRecord =
    records.find((record) => record.id === selectedCorrectionId) ??
    activeRecords[0] ??
    null;

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      onImportFile(file);
    }
  };

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Correction Persistence</h2>
          <p className="text-xs font-medium text-stone-500">
            {records.length} records / active {activeRegion}
          </p>
        </div>
        <FileJson aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 grid gap-3">
        <label className="grid gap-1.5 text-sm">
          <span className="text-xs font-semibold uppercase text-stone-500">
            Load correction
          </span>
          <select
            className="h-10 rounded-md border border-stone-200 bg-white px-3"
            onChange={(event) => onSelectedCorrectionChange(event.target.value)}
            value={selectedCorrectionId}
          >
            <option value="">No correction selected</option>
            {records.map((record) => (
              <option key={record.id} value={record.id}>
                {record.region} / {record.savedAt}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedRecord}
            onClick={onLoadCorrection}
            type="button"
          >
            <FolderOpen aria-hidden="true" size={15} />
            Load correction
          </button>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700"
            onClick={onExportCorrections}
            type="button"
          >
            <Download aria-hidden="true" size={15} />
            Export JSON
          </button>
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700">
            <Upload aria-hidden="true" size={15} />
            Import file
            <input
              accept="application/json,.json"
              className="hidden"
              onChange={onFileChange}
              type="file"
            />
          </label>
        </div>

        <div className="rounded-md bg-stone-50 p-3 text-xs leading-5 text-stone-600">
          <p>selected: {selectedRecord?.id ?? 'none'}</p>
          <p>savedAt: {selectedRecord?.savedAt ?? 'n/a'}</p>
          <p>
            confidence:{' '}
            {selectedRecord?.convergence.correctionConfidence?.toFixed(3) ?? 'n/a'}
          </p>
          <p>
            adjusted:{' '}
            {selectedRecord?.convergence.humanAdjustedRegions.join(', ') ?? 'none'}
          </p>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="text-xs font-semibold uppercase text-stone-500">
            Import correction JSON
          </span>
          <textarea
            className="min-h-28 rounded-md border border-stone-200 px-3 py-2 text-xs leading-5"
            onChange={(event) => onImportJsonChange(event.target.value)}
            value={importJson}
          />
        </label>

        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!importJson.trim()}
          onClick={onImportCorrections}
          type="button"
        >
          <Upload aria-hidden="true" size={15} />
          Import JSON
        </button>

        {importError ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {importError}
          </div>
        ) : null}

        {exportJson ? (
          <textarea
            className="min-h-32 rounded-md border border-stone-200 bg-stone-950 px-3 py-2 text-xs leading-5 text-stone-100"
            readOnly
            value={exportJson}
          />
        ) : null}
      </div>
    </section>
  );
}
