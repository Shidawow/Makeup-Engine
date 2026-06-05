# Model Export Runbook

## Lightweight Training

Run:

```bash
npm run training:lightweight -- --help
```

Training reads materialized reviewed datasets, not source image packages or UI state.

## Export Package

Run:

```bash
npm run training:export -- --help
```

Export package outputs may include:

- model artifact
- export package manifest
- provider spec
- runtime compatibility report
- checksums
- smoke report

## Export Readiness

Use training preflight and export readiness tests before treating an artifact as exportable:

```bash
npm run training:preflight -- --help
npm run test
```

ONNX writer support is not real yet. Current export readiness is local package preparation and compatibility validation.
