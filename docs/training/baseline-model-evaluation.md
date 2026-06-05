# Baseline Model Evaluation

Baseline evaluation compares the prior mask against human-edited validation and
test masks. It computes deterministic mask-vs-mask metrics:

- hard IoU
- soft IoU
- Dice
- alpha MAE
- alpha RMSE
- bounds overlap
- area error

These are real baseline prior metrics. They are not deep segmentation model
metrics and must not be reported as neural network quality. The evaluation
report keeps dry-run proxy metrics and baseline metrics in separate fields.
