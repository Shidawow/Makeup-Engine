# Baseline Cosmetic Segmentation Training

Phase 6C introduces the first real training loop in Makeup Engine: a lightweight
Mask Prior Baseline Model. It consumes only `MaterializedTrainingDataset` outputs
from the training bridge and never reads Template Studio React state.

The baseline trains per-region priors from reviewed, accepted, training-ready
human-edited masks:

1. load materialized dataset
2. read split JSONL samples
3. convert human-edited masks to pure TypeScript alpha tensors
4. aggregate region priors with quality and sample weights
5. write `model.json`
6. evaluate the prior against validation/test masks
7. write model manifest, evaluation report, run package, config, and quarantine

This is real baseline training, but it is not neural network training. It does
not use PyTorch, TensorFlow, ONNX Runtime, WebGPU, MediaPipe, or OpenAI.

The next stage can replace the prior trainer with an image-conditioned trainer,
but the input boundary remains the materialized dataset and training bridge.
