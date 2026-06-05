# Source Image To Template Flow

Phase 6H-3 adds the operator handoff from imported source images into template production.

```text
SourceImagePackage
-> Source Image Intake Panel
-> TemplateAnalysisSeed
-> Vision Analysis
-> editable masks
-> human correction
-> TemplateEvidence
-> HumanCorrectionDataset
-> Dataset Review Queue
-> quality gate
-> materialized training dataset
```

## What This Phase Does

- lets an operator inspect SourceImagePackage manifests in Template Studio
- lists ready and blocked source images
- creates deterministic TemplateAnalysisSeed records
- shows source image preview when the artifact is browser-readable
- passes ready seed metadata into the existing analysis surface
- keeps manual upload available

## What This Phase Does Not Do

- no training
- no ONNX export
- no PyTorch, TensorFlow, WebGPU training, or MediaPipe runtime changes
- no OpenAI API call
- no backend service
- no database
- no direct conversion from SourceImagePackage to training dataset

## Studio Session

The local Studio session stores only source image package metadata and recent seeds. It does not store large image bytes and strips absolute local paths from persisted manifest references.

## Analysis Handoff

If a seed has a browser-readable normalized PNG reference, the Studio can prepare it as the current analysis image. If the seed only contains CLI package-relative paths, Studio shows a boundary warning and asks the operator to provide an accessible image through file selection or URL exposure.
