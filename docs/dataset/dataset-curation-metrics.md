# Dataset Curation Metrics

Dataset curation metrics turn reviewed correction data into a monitorable asset.
They are computed locally from `HumanCorrectionDataset`, `DatasetReviewQueue`,
and optionally `DatasetManifest`.

## Metrics Lifecycle

1. Generate correction samples from Template Studio.
2. Review samples in the Dataset Review Queue.
3. Export or compute a manifest.
4. Run `computeDatasetCurationMetrics`.
5. Inspect readiness, risk, split balance, region coverage, and reviewer stats.
6. Export metrics JSON for training planning.

## Metric Groups

`DatasetCurationMetrics` includes:

- total, accepted, rejected, and training-ready sample counts
- region distribution
- review reason distribution
- split distribution
- quality score distribution
- evidence confidence distribution
- reviewer consistency summary
- image quality summary
- duplicate risk summary
- leakage risk summary
- imbalance warnings
- training readiness score

## Risk Signals

Risk summary combines:

- image/template duplicate risk
- train/test leakage risk
- region imbalance
- split imbalance
- low evidence confidence

The result is intentionally deterministic so repeated exports produce stable
metrics.

## Training Readiness

Training readiness is a score, not a training action. It summarizes how much of
the reviewed queue is accepted, training-ready, high quality, and leakage-safe.
The current system does not train a segmentation model.
