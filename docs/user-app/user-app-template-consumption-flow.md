# User App Template Consumption Flow

Phase 7A consumes `UserAppTemplatePackage` through a local shell.

## Flow

```text
TemplatePublishPackage
-> UserAppTemplatePackage
-> User App Shell View Model
-> Template List
-> Template Detail
-> Step Guide
-> Region Instructions
-> Tools / Products
-> Compatibility Banner
```

## Contract Rules

The shell cannot consume `SourceImagePackage` directly.

The source path must remain:

```text
SourceImagePackage
-> artifact binding
-> TemplateAnalysisSeed
-> Vision Analysis
-> Editable Masks
-> Human Correction
-> Template Evidence
-> Template Review
-> Template Library Entry
-> Template Publish Package
-> UserAppTemplatePackage
-> User App Shell
```

## Runtime Reference Rules

`UserAppTemplatePackage` and shell view models must not contain:

- object URL
- local absolute path
- large image bytes
- `data:image/`
- React state

Runtime-only violations are blocking compatibility issues.
