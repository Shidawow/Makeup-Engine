# Image-conditioned Segmentation Provider

The image-conditioned baseline provider adapts an
`ImageConditionedSegmentationModel` to the existing segmentation provider
contract. It is opt-in and does not replace the default provider.

If pixel data is available, it predicts a mask from pixel feature scores. If
pixel data or a region model is missing, it falls back to polygon refinement and
records the fallback in debug output.
