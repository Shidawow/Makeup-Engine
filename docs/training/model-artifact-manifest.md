# Model Artifact Manifest

Phase 6B creates a placeholder model artifact manifest. It does not write model
weights or real model binaries.

The manifest records:

- model id and version
- training run id
- source dataset id
- source package id
- trainer config version
- runtime kind
- artifact entries
- metrics reference
- evaluation report reference
- lineage
- deployment readiness status

The placeholder manifest lets future Phase 6C model output slot into the same
trace structure without changing dataset lineage or runtime plan reporting.
