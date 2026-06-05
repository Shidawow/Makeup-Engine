# Baseline Trainer Adapter

The baseline trainer adapter is a contract and dry-run layer. It does not train
a model and does not import PyTorch, TensorFlow, ONNX Runtime, or WebGPU training
libraries.

Adapter responsibilities:

- validate loaded training dataset input
- create a deterministic training plan
- create deterministic batches
- compute dry-run metrics
- summarize region, batch, target, and quality coverage

Dry-run output proves that the loader and iterator output can be consumed by a
future trainer without adding real training code in Phase 6A.

Future Phase 6B work can implement a real segmentation provider behind this
contract while preserving the rule that training input must come from
`MaterializedTrainingDataset` and `LoadedTrainingDataset`.
