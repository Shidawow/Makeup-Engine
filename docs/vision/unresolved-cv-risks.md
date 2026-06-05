# Unresolved CV Risks

Status: open risks after Vision-first Phase 1

## 1. No Installed Real CV Runtime Yet

The repository now has a MediaPipe FaceMesh adapter boundary, but no installed MediaPipe package or browser runtime integration.

Risk:

- Real image inference still needs dependency selection and integration work.

Recommendation:

- Add MediaPipe Tasks Vision or an equivalent local FaceMesh package in a separate dependency-focused task.
- Keep provider contract stable while integrating the package.

## 2. Segmentation Is Not Real Yet

Current segmentation support is contract-level plus test provider output.

Risk:

- Blush, contour, highlight, and eyeshadow boundaries will be approximate until segmentation is implemented.

Recommendation:

- Add a face parsing or cosmetic segmentation ONNX model behind `VisionProvider`.
- Store masks as normalized polygons first, raster masks later.

## 3. Cosmetic Parameter Defaults Are Heuristic

Region parameters currently use deterministic defaults derived from region type.

Risk:

- The system can structure makeup regions, but it does not yet estimate real color, saturation, edge softness, or finish from pixels.

Recommendation:

- Add pixel sampling utilities for region color and finish estimation.
- Use OpenCV-like preprocessing or canvas image sampling before model inference.

## 4. Face Region Mapping Uses Partial Landmark Sets

The region builder supports FaceMesh-style indices but the test provider only emits a subset.

Risk:

- Production quality region mapping requires full 468-point FaceMesh coverage.

Recommendation:

- Once MediaPipe is installed, snapshot full landmark output and harden polygon mappings per region.

## 5. No Visual QA Overlay Yet

The pipeline emits visualizable polygons, but no overlay QA screen has been added in this task.

Risk:

- CV errors may be hard to inspect manually.

Recommendation:

- Add a Template Studio debug overlay that renders provider face box, landmarks, masks, and cosmetic region polygons.

## 6. Skin/Base Makeup Analysis Is Still Missing

This phase covers lips, eyes, brows, blush, contour, and highlight. Base/foundation and skin finish are not yet deeply parameterized.

Risk:

- Template generation may underrepresent complexion products.

Recommendation:

- Add base/skin finish parameter schema after real pixel sampling exists.

## Next Stage Recommendations

Highest ROI next:

1. Install and wire a real MediaPipe FaceMesh provider.
2. Add visual overlay rendering for landmarks, face box, masks, and cosmetic polygons.
3. Add deterministic pixel sampling for lips/blush/highlight color estimation.
4. Expand `MakeupParameterSchema` into the template builder path.
5. Add snapshot tests for region polygons from real FaceMesh fixture output.

