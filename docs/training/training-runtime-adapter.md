# Training Runtime Adapter

Phase 6B defines runtime adapter boundaries without executing real training.

Supported runtime kinds:

- `dry-run`
- `external-python-placeholder`
- `webgpu-placeholder`
- `onnx-export-placeholder`

The adapter can validate runtime config, create an execution plan, and perform
a dry-run over `TrainingBatch` output. It does not call Python, WebGPU, ONNX
Runtime, PyTorch, TensorFlow, MediaPipe, or OpenAI.

The purpose is to make the future runtime handoff explicit:

```text
LoadedTrainingDataset
-> TrainingBatchIterator
-> TrainingRuntimeAdapter
-> TrainingRuntimeExecutionPlan
```

Phase 6C can implement a real baseline segmentation training runtime behind
this adapter.
