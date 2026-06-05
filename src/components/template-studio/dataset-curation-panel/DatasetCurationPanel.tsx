import { BarChart3, Clipboard, Download, ShieldAlert } from 'lucide-react';
import type {
  DatasetCurationMetrics,
  DatasetQualityStatus,
  DatasetSplit,
} from '../../../templates/schema';
import type { CosmeticSegmentationTarget } from '../../../vision';

export interface DatasetCurationPanelProps {
  metrics: DatasetCurationMetrics | null;
  regionFilter: CosmeticSegmentationTarget | 'all';
  splitFilter: DatasetSplit | 'all';
  statusFilter: DatasetQualityStatus | 'all';
  onRegionFilterChange: (region: CosmeticSegmentationTarget | 'all') => void;
  onSplitFilterChange: (split: DatasetSplit | 'all') => void;
  onStatusFilterChange: (status: DatasetQualityStatus | 'all') => void;
  onCopySummary: () => void;
  onExportMetricsJson: () => void;
  onExportTrainingManifestJson: () => void;
  onValidateTrainingManifest: () => void;
}

const regions: Array<CosmeticSegmentationTarget | 'all'> = [
  'all',
  'lips',
  'blush',
  'eyeshadow',
  'eyeliner',
  'contour',
  'highlight',
];
const splits: Array<DatasetSplit | 'all'> = [
  'all',
  'train',
  'validation',
  'test',
  'holdout',
  'unassigned',
];
const statuses: Array<DatasetQualityStatus | 'all'> = [
  'all',
  'pending_review',
  'accepted',
  'rejected',
  'needs_second_review',
  'ready_for_training',
  'excluded',
];

const pct = (value: number): string => `${Math.round(value * 100)}%`;

export function DatasetCurationPanel({
  metrics,
  regionFilter,
  splitFilter,
  statusFilter,
  onRegionFilterChange,
  onSplitFilterChange,
  onStatusFilterChange,
  onCopySummary,
  onExportMetricsJson,
  onExportTrainingManifestJson,
  onValidateTrainingManifest,
}: DatasetCurationPanelProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Dataset Curation Metrics</h2>
          <p className="text-xs font-medium text-stone-500">
            {metrics
              ? `${metrics.totalSamples} samples / readiness ${pct(metrics.trainingReadinessScore)}`
              : 'no metrics yet'}
          </p>
        </div>
        {metrics?.riskSummary.riskLevel === 'high' ? (
          <ShieldAlert aria-hidden="true" className="text-rose-700" size={18} />
        ) : (
          <BarChart3 aria-hidden="true" className="text-teal-700" size={18} />
        )}
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <label className="grid gap-1 text-xs font-semibold uppercase text-stone-500">
          Region
          <select
            className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm normal-case text-stone-700"
            onChange={(event) =>
              onRegionFilterChange(event.target.value as CosmeticSegmentationTarget | 'all')
            }
            value={regionFilter}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase text-stone-500">
          Split
          <select
            className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm normal-case text-stone-700"
            onChange={(event) => onSplitFilterChange(event.target.value as DatasetSplit | 'all')}
            value={splitFilter}
          >
            {splits.map((split) => (
              <option key={split} value={split}>
                {split}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase text-stone-500">
          Status
          <select
            className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm normal-case text-stone-700"
            onChange={(event) =>
              onStatusFilterChange(event.target.value as DatasetQualityStatus | 'all')
            }
            value={statusFilter}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!metrics}
          onClick={onCopySummary}
          type="button"
        >
          <Clipboard aria-hidden="true" size={15} />
          Copy metrics
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!metrics}
          onClick={onExportMetricsJson}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          Export metrics
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!metrics}
          onClick={onExportTrainingManifestJson}
          type="button"
        >
          <Download aria-hidden="true" size={15} />
          Training manifest
        </button>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!metrics}
          onClick={onValidateTrainingManifest}
          type="button"
        >
          Validate
        </button>
      </div>

      {!metrics ? (
        <div className="mt-4 rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
          Accept review items to calculate curation metrics and training readiness.
        </div>
      ) : (
        <div className="mt-4 grid gap-2 text-sm text-stone-700">
          <div className="grid gap-2 md:grid-cols-4">
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">Accepted</p>
              <p className="mt-1 text-lg font-semibold">{metrics.acceptedSamples}</p>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">Rejected</p>
              <p className="mt-1 text-lg font-semibold">{metrics.rejectedSamples}</p>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">Ready</p>
              <p className="mt-1 text-lg font-semibold">{metrics.trainingReadySamples}</p>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-xs font-semibold uppercase text-stone-500">Risk</p>
              <p className="mt-1 text-lg font-semibold">{metrics.riskSummary.riskLevel}</p>
            </div>
          </div>
          <p>
            split: train {metrics.splitDistribution.splitDistribution.train} /
            validation {metrics.splitDistribution.splitDistribution.validation} /
            test {metrics.splitDistribution.splitDistribution.test}
          </p>
          <p>
            quality: low {metrics.qualityScoreDistribution.scoreBuckets.low} /
            medium {metrics.qualityScoreDistribution.scoreBuckets.medium} /
            high {metrics.qualityScoreDistribution.scoreBuckets.high}
          </p>
          <p>
            warnings:{' '}
            {metrics.imbalanceWarnings.length > 0
              ? metrics.imbalanceWarnings.join(', ')
              : 'none'}
          </p>
        </div>
      )}
    </section>
  );
}
