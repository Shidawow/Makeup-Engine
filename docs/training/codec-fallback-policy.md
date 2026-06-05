# Codec Fallback Policy

Training artifact preference is explicit:

Image artifacts:

1. PNG image
2. raw RGBA binary
3. JSON RGBA grid

Mask artifacts:

1. PNG alpha mask
2. binary alpha mask
3. JSON alpha grid

PNG alpha masks are now supported for materialized mask artifacts. PNG/JPEG
image decode and PNG diff heatmap decode are still separate boundaries.

If PNG mask files are present, training can prefer `png-alpha-mask`. If PNG mask
files are missing, non-strict mode reports a warning and can fall back to binary
or JSON according to the configured preference. Explicit strict PNG preference
fails instead. No fallback is silent.
