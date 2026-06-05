# Source Image To Vision Analysis

The 6H-4 source image path is:

```text
SourceImagePackage
-> ready SourceImageEntry
-> operator binds normalized PNG or usable JSON RGBA artifact
-> BrowserArtifactResource
-> TemplateAnalysisSeed
-> VisionAnalysisDemo
-> Mask Editing
-> Template Evidence
-> Dataset Review
```

`TemplateAnalysisSeed` readiness now distinguishes source package readiness from browser resource readiness:

- ready source image + validated bound normalized PNG: `ready_for_vision_analysis`
- ready source image + no browser-readable or bound artifact: `blocked_by_missing_artifact`
- source image blocked by quality: `blocked_by_source_image_quality`
- source image blocked by codec: `blocked_by_codec`

The seed can carry:

- `boundArtifactResource`
- `artifactBindingId`
- `browserPreviewUrl`
- `imageDataReference`
- `artifactBindingStatus`
- `artifactBindingIssues`

The browser still cannot directly run analysis from a manifest path. It must use a browser-readable URL, data URI, object URL, or validated generated preview.

`SourceImagePackage` remains an imported-photo package. It is not a training dataset and cannot bypass mask editing, human correction, review queue, or quality gates.

