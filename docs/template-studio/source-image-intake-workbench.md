# Source Image Intake Workbench

Phase 6H-3 connects SourceImagePackage outputs from the import CLI into Template Studio.

The workbench accepts a `source-image-manifest.json` by paste, JSON file selection, or the built-in deterministic demo fixture. It shows package readiness, ready images, blocked images, codec status, quality status, artifact links, and quarantine reasons.

## Operator Flow

1. Import local photos with the CLI:

```bash
node scripts/import-source-images.mjs --input ./local-photos --out ./tmp/source-images/admin-batch-v0 --codec-preference png,jpeg --materialize-normalized-png --materialize-raw-rgba --materialize-json-rgba --write-manifest --quality-gate --json
```

2. Paste the generated manifest JSON into Template Studio.
3. Select a `ready_for_template_analysis` image.
4. Create a `TemplateAnalysisSeed`.
5. Send the seed into the existing Vision Analysis flow.
6. Continue with mask editing, human correction, evidence, dataset review, and quality gate.

## Boundary

SourceImagePackage is only a template-analysis input asset. It is not a training dataset and cannot bypass:

- editable masks
- human correction
- evidence generation
- review queue
- quality gate
- accepted + training-ready split assignment

Blocked source images are visible for inspection, but their analysis action is disabled.

## Browser File Access

The browser cannot read arbitrary CLI output paths. Template Studio only previews artifacts that are browser-readable, such as a data URI, blob URI, HTTP URL, HTTPS URL, or an app-served absolute URL. Relative package paths remain metadata until the operator provides an accessible file or URL.
