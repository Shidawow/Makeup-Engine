# User App Consumption Manifest

`UserAppConsumptionManifest` summarizes an app contract export for handoff.

It includes:

- manifest id
- app template package id and version
- compatibility target
- entry count
- per-template id, source id, title, style tags, difficulty, duration, step count, region count, and checksum
- readiness summary
- source publish package id
- checksums
- local-only and not-online-published flags

Exports:

- `exportUserAppTemplatePackageJson`
- `exportUserAppConsumptionHandoff`
- `createUserAppConsumptionChecksums`
- `summarizeUserAppConsumptionExport`

The manifest cannot contain object URLs, local absolute paths, large image bytes, or React state.

