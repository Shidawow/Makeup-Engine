# Export Package Codec Readiness

Export-ready model packages now report mask codec readiness.

The export package records:

- supported mask artifact formats: `png-alpha-mask`, `binary-alpha-mask`, `json-alpha-grid`
- preferred mask format
- PNG alpha mask support status
- fallback policy: `png-alpha-mask -> binary-alpha-mask -> json-alpha-grid`
- codec validation report reference

Browser providers are not required to read PNG masks directly in this phase.
The export package only needs to state whether the model and package lineage are
compatible with PNG mask artifacts.
