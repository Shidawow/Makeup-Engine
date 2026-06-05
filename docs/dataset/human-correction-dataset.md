# Human Correction Dataset

Phase 5A promotes Template Studio mask corrections from local UI state into a
formal data asset. A correction can now be saved, exported, audited, replayed,
and used later as supervised data for segmentation or template-quality work.

## Lifecycle

1. A source image is analyzed by the existing vision-first pipeline.
2. Template Studio creates editable masks from the AI segmentation result.
3. An administrator edits a region mask.
4. Dirty regions are reanalyzed locally through incremental recompute.
5. Convergence produces a human-verified template, TemplateEvidence, and
   correction samples.
6. Dataset export writes either JSON bundle or JSONL without contacting a
   backend or database.

## Dataset Contract

The schema lives in:

```text
src/templates/schema/correction-dataset.schema.ts
```

Core records:

- `HumanCorrectionDataset`
- `HumanCorrectionSample`
- `HumanMaskCorrectionSample`
- `HumanTemplateCorrectionSample`

Each sample includes:

- Stable `sampleId`
- `imageId`, `templateId`, and `regionId`
- Original AI segmentation mask
- Human-edited mask
- `maskDiff`
- Original and updated pixel analysis
- Original and updated semantics
- Editor metadata
- Correction reason
- Correction confidence
- Export timestamp
- Human verification status

## Export Formats

The export system lives in:

```text
src/templates/storage/datasetExport.ts
```

Supported formats:

- Single correction sample JSON
- One template's correction samples
- Current workbench session dataset
- JSON bundle
- JSONL

Every export carries `schemaVersion`. Dataset and sample ids use stable hashes
over deterministic content, so the same input and `exportedAt` produce the same
output.

## Mask Diff

Mask diff artifacts live in:

```text
src/vision/segmentation/editing/maskDiff.ts
```

The diff captures:

- Added area ratio
- Removed area ratio
- Changed area ratio
- Edge shift score
- Alpha delta mean
- Affected normalized bounds
- Diff heatmap
- Correction type

Correction types include expansion, reduction, edge refinement, feather
adjustment, opacity adjustment, and mixed.

## Future Training Usage

The dataset is designed to train or evaluate segmentation improvements later.
Each sample preserves both the original AI mask and the human-edited mask, plus
pixel and semantic context. That gives future training code enough information
to learn from the correction without reconstructing Template Studio state.

## Human-In-The-Loop Value Chain

Human edits are valuable because they encode expert judgment at the region level:
where a mask should expand, contract, feather, or preserve opacity. Phase 5A
keeps that judgment attached to template evidence and exportable dataset
records, turning template production into a repeatable data flywheel.
