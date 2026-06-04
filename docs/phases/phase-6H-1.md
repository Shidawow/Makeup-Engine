# Phase 6H-1

## Phase name

PNG Codec Hardening and JPEG Metadata Boundary.

## Objective

Support deterministic PNG pixel decode for local training artifacts while keeping JPEG pixel decode explicitly unsupported.

## Added files

- PNG image codec readiness documentation.
- JPEG boundary documentation.
- PNG image decode and artifact tests, based on current project reports.

## Modified files

- Training artifact decode paths.
- Training preflight readiness reporting.
- Export package codec readiness checks.

## Capabilities added

- Dependency-free PNG image decode for supported local artifacts.
- PNG image sidecar metadata handling.
- JPEG metadata-only boundary.
- EXIF orientation boundary.

## Validation commands

```bash
npm run typecheck
npm run test
npm run build
```

## Test/build status

Reported passing by current project context.

## CLI status

Training preflight and dataset build CLIs reported PNG image readiness.

## Current limitations

- JPEG pixels are not decoded.
- Real photo distribution coverage remains incomplete.

## Next recommendation

Add source image package import before template analysis and before training dataset materialization.

## Forbidden areas touched: yes/no

No.

## New dependencies: yes/no

No.

## External API usage: yes/no

No.

## Recovery notes

JPEG decode is intentionally blocked. Convert or materialize supported pixel artifacts before training.
