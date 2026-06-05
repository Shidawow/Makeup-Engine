# Baseline Mask Prior Model

The Mask Prior Baseline Model stores one prior per cosmetic region. Each prior
contains:

- `meanAlphaGrid`
- mean alpha statistics
- area distribution
- bounds distribution
- edge softness prior
- quality-weighted confidence prior
- sample count and warnings

The model learns from human-edited masks. When an artifact does not yet contain
a full alpha grid, the tensor reader derives a deterministic alpha tensor from
the mask metadata available in the materialized artifact. This preserves a real
training path while keeping the current JSON artifact format compatible with
future PNG or binary artifact readers.

The model is useful as an engineering baseline and regression target. It is not
expected to match an image-conditioned segmentation model because it does not
read source image pixels.
