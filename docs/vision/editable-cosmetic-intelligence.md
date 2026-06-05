# Editable Cosmetic Intelligence

This phase introduces human-in-the-loop cosmetic intelligence without adding orchestration, chat, or generalized runtime abstractions.

## Architecture

```text
image
-> FaceMesh
-> segmentation masks
-> weighted pixel analysis
-> skin baseline
-> edge analysis
-> semantic analysis
-> MakeupTemplate
-> human correction
-> mask-reanalysis
-> converged MakeupTemplate
```

## Editable Mask Model

`EditableCosmeticMask` keeps the original `CosmeticSegmentationMask` as the base contract and layers user edits on top:

- `baseMask`
- `userModifications`
- `mergedMask`
- `history.undo`
- `history.redo`
- `metadata.refinementNotes`

The editing module is deterministic and provider-agnostic. It does not know about React, Zustand, or canvas events.

## Editing Operations

- `brush-add`
- `brush-erase`
- `feather-brush`
- `smooth-local`
- `undo`
- `redo`

Brush edits operate directly on the alpha grid, so UI and backend logic remain separate.

## Incremental Recompute

Only invalidated regions are re-analysed. If a user edits the lips mask, the blush and eye caches can be preserved when their signatures remain unchanged.

This keeps re-analysis predictable and fast without introducing a workflow engine.

## Template Convergence

Template metadata now records:

- `visionEvidence`
- `correctionConfidence`
- `humanAdjustedRegions`
- `analysisVersion`

This makes the generated template evidence-aware and suitable for downstream dataset generation or future review workflows.

## Persistence

Vision corrections are stored through a typed local storage abstraction:

- user edit history
- merged alpha grid
- convergence metadata

No database or remote sync layer is introduced in this phase.

## Remaining Risks

- Editing precision still depends on the current soft mask source.
- Incremental recompute is region-aware, but not yet pixel-delta aware.
- Template convergence remains deterministic and heuristic-based.

