# Real Landmark Integration Report

Status: Vision-first Phase 2 implementation

## End-to-End Flow

The new demo path is:

```text
user uploads image
-> MakeupPhotoInput with imageUrl
-> MediaPipe FaceMesh provider
-> runMakeupAnalysisPipeline()
-> FaceMeshGeometry
-> cosmetic region builder
-> MakeupParameterSchema
-> VisionDebugOverlay
```

## Demo Entry

The app now opens to the Vision-first demo by default:

```text
src/components/demo/vision-analysis-demo/
```

The previous Template Studio remains available through the top navigation.

## Landmark Output

The MediaPipe provider is designed to output the full 468 FaceMesh landmarks when the runtime detects a face.

The provider output stays normalized:

```text
space: normalized-image
x: 0..1
y: 0..1
z: model-provided depth value
```

## Cosmetic Polygon Generation

Landmark groups are mapped into:

- lips
- eyes
- brows
- blush
- contour
- highlight

The generated polygons are used for:

- overlay visualization
- editable region parameters
- makeup template parameterization

## Validation

Added tests cover:

- MediaPipe provider lifecycle with injected runtime
- 468-landmark provider output
- cosmetic polygon snapshots
- canvas overlay drawing operations

## Remaining Work

The system now has the first real browser runtime path, but still needs:

1. local model asset hosting
2. real segmentation provider
3. pixel sampling for makeup color/finish
4. overlay offset correction for object-contain letterboxing
5. Template Studio integration that saves edited vision parameters into `MakeupTemplate`

