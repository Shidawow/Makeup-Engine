# Training Adapter Manifest

The training adapter converts reviewed correction datasets into a future
segmentation-training input manifest. It does not train a model and does not read
or write real image files.

## Inputs

The adapter consumes:

- `HumanCorrectionDataset`
- `DatasetReviewQueue`
- accepted or ready-for-training decisions
- training-ready evidence summaries
- assigned train/validation/test splits
- mask diff artifacts

Rejected, pending, second-review, holdout, and unassigned samples are excluded
from training references.

## Manifest Contents

`SegmentationTrainingManifest` contains:

- schema version
- manifest id
- source dataset id
- source queue id
- adapter config
- train split bundle
- validation split bundle
- test split bundle
- holdout and unassigned bundles
- target summary
- validation result

Each `TrainingSampleReference` includes image reference, region target, original
mask id, human edited mask id, diff heatmap id, quality score, sample weight, and
exclude reasons.

## Validation

`validateTrainingManifest` checks:

- train split is not empty
- excluded samples do not enter train/validation/test references
- split leakage validation from review queue
- empty validation/test warnings

## Export

Dataset export supports:

- full training manifest JSON
- train split manifest JSON
- validation split manifest JSON
- test split manifest JSON

All exports use stable stringify and include schema version.
