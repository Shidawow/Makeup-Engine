# Studio E2E Operator Flow

Template Studio is an admin workbench for producing reviewed makeup template data.
The visual priority is mask editing: the source image and overlays stay in the
main canvas, while operational panels live in the right rail.

## Main Flow

1. Upload a real source photo.
2. Run local analysis. FaceMesh, cosmetic regions, segmentation, weighted pixel
   analysis, semantics, and template parameterization run locally.
3. Select a region such as lips, blush, eyeshadow, eyeliner, contour, or highlight.
4. Paint with brush add, erase, or feather on the large canvas.
5. Review history checkpoints and before/after state.
6. Reanalyze the dirty region. The trace must include `mask-reanalysis`; FaceMesh
   is not rerun.
7. Save the correction.
8. Template Studio creates `HumanCorrectionSample` data.
9. The sample enters the Dataset Review Queue as pending review.
10. Accept, reject, or mark the item for second review.
11. Replay the sample to inspect original mask, edited mask, diff heatmap,
    semantics, pixel analysis, and evidence.
12. Export reviewed JSONL and dataset manifest.
13. Use curation metrics and training adapter manifest to check readiness for a
    future training bridge.

## Admin Mode

Admin Mode is the default. It hides raw JSON, long traces, and debug-heavy
controls so the operator can focus on editing masks and moving samples through
review.

Visible by default:

- canvas and active overlays
- mask editing toolbar
- history
- convergence diff
- correction persistence
- dataset panel
- review queue
- replay viewer
- evidence summary
- curation metrics
- training adapter

## Developer Mode

Developer Mode opens engineering surfaces:

- debug overlay layers
- pipeline trace
- makeup parameter JSON
- human-verified template JSON
- raw export preview

Developer Mode is for diagnosing local CV, evidence, dataset, and export issues.
It should not be required for normal template production.

## Empty States

Empty states point the operator to the next action:

- edit a mask on the canvas to create history
- save correction to create dataset samples
- review queue items appear after samples exist
- accepted training-ready samples are required before reviewed JSONL export
- Developer Mode exposes raw JSON and trace only when needed
