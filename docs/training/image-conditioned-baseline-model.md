# Image-conditioned Baseline Model

The Image-conditioned Pixel Prior Model stores per-region positive and negative
feature statistics. It learns feature means, variances, alpha-weighted means,
simple score weights, and deterministic decision thresholds.

This is not a neural network. It is a statistical baseline that proves the
training system can consume real pixel artifacts and produce image-conditioned
segmentation masks.
