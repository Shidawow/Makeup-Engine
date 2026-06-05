# Template Studio Mask Editing Workbench

Phase 4D turns the editable mask, incremental recompute, convergence, and
correction persistence primitives into a local administrator workbench. It does
not introduce agents, chat, a workflow runtime, a graph abstraction, a backend
service, or a database.

## Scope

- Primary UI: `src/components/template-studio`
- Overlay: `src/components/template-studio/vision-debug-overlay`
- Mask editing utilities: `src/vision/segmentation/editing`
- Incremental recompute: `src/vision/pipeline/incremental`
- Convergence diff: `src/template-engine/convergence`
- Correction persistence: `src/templates/storage`

The workbench leaves `src/engine`, `src/runtime`, and
`src/intelligence/runtime` untouched so the intelligence and runtime layers stay
isolated from UI concerns.

## UI Workflow

1. Upload a local makeup photo.
2. Run analysis. The initial pass performs FaceMesh, cosmetic region
   construction, segmentation, weighted pixel analysis, semantic analysis, and
   template parameterization.
3. Select an editable target: `lips`, `blush`, `eyeshadow`, `eyeliner`,
   `contour`, or `highlight`.
4. Paint on the canvas with `brush-add`, `brush-erase`, or `feather-brush`.
5. Review dirty regions, edit history, and before/after overlay state.
6. Reanalyze the active dirty region.
7. Save, load, export, or import correction JSON.
8. Compare AI-only template output with the human-verified template in the
   convergence diff panel.

## Canvas Interaction

Pointer events are mapped through the rendered image rectangle, not the full
canvas container. This preserves correct normalized coordinates when the image
is rendered with object-contain offsets or when the canvas resizes.

The interaction layer supports:

- Pointer down, move, up, and leave handling
- Drag painting
- Brush cursor preview
- Add, erase, and feather operations
- Normalized image-space brush points
- Resize-safe brush radius conversion

## Reanalysis UX

Mask edits mark the active region as dirty. Reanalysis calls
`reanalyzeMakeupWithEditableMasks` with only the active target invalidated and a
previous incremental cache, so unchanged masks are reused by
`recomputeInvalidatedRegions`.

The reanalysis path does not call the vision provider and does not rerun
FaceMesh. The resulting analysis trace includes `mask-reanalysis`.

## Correction Persistence

Corrections are stored through the existing local storage adapter abstraction.
The UX supports:

- Saving the active region correction
- Loading a selected correction back into a compatible editable mask
- Exporting a `VisionCorrectionSnapshot` JSON document
- Importing and merging a correction JSON document
- Showing record metadata: id, saved time, correction confidence, and adjusted
  regions

Imported correction records are schema checked before they are merged into
local storage.

## Overlay Capabilities

The debug overlay now supports:

- `editableMasks`
- `userCorrections`
- `recomputeRegions`
- `convergenceDiff`
- `brushCursor`
- `activeRegionHighlight`
- `beforeAfter`

Before mode favors the AI-only segmentation result. After mode shows the
current analysis plus editable mask and correction overlays.

## Convergence Diff

`diffTemplatesForConvergence` produces stable diff items for:

- Mask changed
- Opacity changed
- Edge softness changed
- Semantic label changed
- Confidence changed
- Generated steps changed

The panel renders each item with before and after values and a changed/same
state.

## Current Limits

- The workbench is local-only and uses browser local storage for correction
  persistence.
- Correction records can be applied only when target and grid dimensions match.
- Brush painting operates on mask grids, so extremely small edits are bounded by
  the segmentation grid resolution.
- The UI compares AI-only and human-verified templates at the template metadata
  and generated-step level; it does not yet provide per-pixel visual diff
  export.

## Next Phase Candidates

- Add region-specific keyboard shortcuts once the control model stabilizes.
- Add batch save/load for all dirty regions.
- Add per-region visual diff thumbnails.
- Add correction schema version migration tests when the correction format
  changes.
