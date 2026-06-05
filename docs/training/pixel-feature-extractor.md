# Pixel Feature Extractor

The pixel feature extractor creates deterministic per-pixel feature vectors:

- RGB
- HSV
- brightness and saturation
- skin-relative color deltas
- local contrast
- normalized position
- distance to region center and bounds
- alpha target from the human-edited mask

Sampling is deterministic. If downsampling is required, `featureStride` advances
over a fixed grid and never uses randomness.
