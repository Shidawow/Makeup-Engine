import {
  CheckCircle2,
  Download,
  FileJson,
  FlaskConical,
  RotateCcw,
  SplitSquareHorizontal,
  XCircle,
} from 'lucide-react';
import type {
  DatasetQualityStatus,
  DatasetReviewItem,
  DatasetReviewQueue,
  DatasetSplit,
} from '../../../templates/schema';

export type DatasetReviewFilter =
  | 'all'
  | 'pending_review'
  | 'accepted'
  | 'rejected'
  | 'needs_second_review';

export interface DatasetReviewPanelProps {
  queue: DatasetReviewQueue | null;
  filter: DatasetReviewFilter;
  onFilterChange: (filter: DatasetReviewFilter) => void;
  onAccept: (reviewItemId: string) => void;
  onReject: (reviewItemId: string) => void;
  onNeedsSecondReview: (reviewItemId: string) => void;
  onAssignSplit: (reviewItemId: string, split: DatasetSplit) => void;
  onBatchAccept: () => void;
  onBatchReject: () => void;
  onExportReviewedJson: () => void;
  onExportReviewedJsonl: () => void;
  onExportManifest: () => void;
  onOpenReplay: (reviewItemId: string) => void;
}

const filters: DatasetReviewFilter[] = [
  'all',
  'pending_review',
  'accepted',
  'rejected',
  'needs_second_review',
];

const splitOptions: DatasetSplit[] = [
  'train',
  'validation',
  'test',
  'holdout',
  'unassigned',
];

const visibleStatus = (status: DatasetQualityStatus): string =>
  status.replace(/_/g, ' ');

const scoreLabel = (score: number): string => `${Math.round(score * 100)}%`;

const filteredItems = (
  queue: DatasetReviewQueue | null,
  filter: DatasetReviewFilter,
): DatasetReviewItem[] =>
  queue
    ? queue.items.filter(
        (item) => filter === 'all' || item.currentDecision.status === filter,
      )
    : [];

export function DatasetReviewPanel({
  queue,
  filter,
  onFilterChange,
  onAccept,
  onReject,
  onNeedsSecondReview,
  onAssignSplit,
  onBatchAccept,
  onBatchReject,
  onExportReviewedJson,
  onExportReviewedJsonl,
  onExportManifest,
  onOpenReplay,
}: DatasetReviewPanelProps) {
  const items = filteredItems(queue, filter);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Dataset Review Queue</h2>
          <p className="text-xs font-medium text-stone-500">
            {queue?.queueId ?? 'no queue'} / {queue?.summary.total ?? 0} items
          </p>
        </div>
        <FlaskConical aria-hidden="true" className="text-teal-700" size={18} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((nextFilter) => (
          <button
            className={`h-8 rounded-md border px-2.5 text-xs font-semibold ${
              filter === nextFilter
                ? 'border-teal-700 bg-teal-50 text-teal-900'
                : 'border-stone-200 text-stone-600'
            }`}
            key={nextFilter}
            onClick={() => onFilterChange(nextFilter)}
            type="button"
          >
            {visibleStatus(nextFilter === 'all' ? 'pending_review' : nextFilter)}
            {nextFilter === 'all' ? ' all' : ''}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!queue || queue.items.length === 0}
          onClick={onBatchAccept}
          type="button"
        >
          <CheckCircle2 aria-hidden="true" size={15} />
          Batch accept
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!queue || queue.items.length === 0}
          onClick={onBatchReject}
          type="button"
        >
          <XCircle aria-hidden="true" size={15} />
          Batch reject
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!queue}
          onClick={onExportReviewedJson}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          Reviewed JSON
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!queue}
          onClick={onExportReviewedJsonl}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          Reviewed JSONL
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!queue}
          onClick={onExportManifest}
          type="button"
        >
          <FileJson aria-hidden="true" size={15} />
          Manifest
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
            No review items match this filter. Save a correction to generate a
            dataset sample; pending items can then be accepted, rejected, replayed,
            and exported as reviewed JSONL or manifest data.
          </div>
        ) : (
          items.map((item) => (
            <div
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
              key={item.reviewItemId}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {item.regionId} / {visibleStatus(item.currentDecision.status)}
                  </p>
                  <p className="text-xs text-stone-500">{item.sampleId}</p>
                </div>
                <span className="rounded bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-900">
                  quality {scoreLabel(item.qualityScore)}
                </span>
              </div>

              <div className="mt-2 grid gap-1 text-xs leading-5 text-stone-600">
                <p>suggested: {visibleStatus(item.evidenceSummary.suggestedDecision)}</p>
                <p>
                  training ready:{' '}
                  {item.evidenceSummary.isTrainingReady ? 'yes' : 'no'} / second
                  review: {item.evidenceSummary.needsSecondReview ? 'yes' : 'no'}
                </p>
                <p>
                  reasons:{' '}
                  {item.reviewReasons.length > 0
                    ? item.reviewReasons.join(', ')
                    : 'none'}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-semibold text-stone-700"
                  onClick={() => onAccept(item.reviewItemId)}
                  type="button"
                >
                  <CheckCircle2 aria-hidden="true" size={14} />
                  Accept
                </button>
                <button
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-semibold text-stone-700"
                  onClick={() => onReject(item.reviewItemId)}
                  type="button"
                >
                  <XCircle aria-hidden="true" size={14} />
                  Reject
                </button>
                <button
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-semibold text-stone-700"
                  onClick={() => onNeedsSecondReview(item.reviewItemId)}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={14} />
                  Second review
                </button>
                <button
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-semibold text-stone-700"
                  onClick={() => onOpenReplay(item.reviewItemId)}
                  type="button"
                >
                  Replay
                </button>
                <label className="inline-flex h-8 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-semibold text-stone-700">
                  <SplitSquareHorizontal aria-hidden="true" size={14} />
                  <select
                    className="bg-transparent text-xs outline-none"
                    onChange={(event) =>
                      onAssignSplit(item.reviewItemId, event.target.value as DatasetSplit)
                    }
                    value={item.assignedSplit}
                  >
                    {splitOptions.map((split) => (
                      <option key={split} value={split}>
                        {split}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
