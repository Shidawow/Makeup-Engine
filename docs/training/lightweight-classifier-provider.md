# Lightweight Classifier Provider

The lightweight classifier provider adapts `LightweightSegmentationClassifier` into the existing segmentation provider contract.

It is opt-in and does not replace the default provider. Inputs are image pixel data plus cosmetic region bounds. If pixel data or a region classifier is missing, the provider falls back to deterministic polygon refinement instead of failing silently.

This provider is useful for validating the end-to-end loop:

```text
MaterializedTrainingDataset
→ pixel features
→ lightweight classifier model
→ model artifact
→ segmentation provider
```

It remains a baseline and should not be treated as a production deep segmentation model.
