# Mask Artifact Materialization

Phase 5D materializes mask data into deterministic metadata references. It does not write PNG files and does not add an image encoding dependency.

## Artifact Kinds

- `original_mask`
- `human_edited_mask`
- `diff_heatmap`

Each artifact contains:

- `artifactId`
- `sampleId`
- `maskId`
- `target`
- `regionId`
- `artifactKind`
- `width`
- `height`
- `alphaStats`
- `bounds`
- `source`
- `checksum`
- `referenceUri`

## Alpha Stats

`alphaStats` summarizes the mask grid:

- `min`
- `max`
- `mean`
- `activeRatio`

These values let the training package validate artifact shape and detect invalid alpha ranges without loading real image files.

## Reference URI

The current `referenceUri` uses a placeholder:

```text
offline://mask-artifacts/{artifactId}.json
```

Phase 6A can replace this with real paths after a mask artifact writer is added.

## Validation

The artifact validator checks:

- positive width
- positive height
- alpha range inside `[0, 1]`
- non-empty reference URI
- stable checksum
