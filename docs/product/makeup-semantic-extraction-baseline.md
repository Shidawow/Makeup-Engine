# Makeup Semantic Extraction Baseline

Phase 12B adds a local, deterministic Makeup Semantic Extraction Baseline for the Template Studio operator path.

This is not final recognition, not AI-confirmed analysis, not a product shade matcher, and not a medical or skin diagnosis system. Every output is candidate-only and requires human review before it can influence template copy, step guidance, package drafts, registry preparation, or user-facing content.

## Scope

The baseline creates a `MakeupSemanticExtractionReport` with `MakeupSemanticCandidate` entries for:

- `lipColorCandidate`
- `lipFinishCandidate`
- `blushPlacementCandidate`
- `blushIntensityCandidate`
- `eyeMakeupIntensityCandidate`
- `eyeshadowToneCandidate`
- `browDefinitionCandidate`
- `highlightSignalCandidate`
- `contourSignalCandidate`
- `overallStyleCandidate`

The report is built from existing local evidence only:

- FaceMesh region QA.
- Local pixel analysis.
- Weighted region color samples.
- Skin baseline contrast.
- Edge / brightness signals.
- Cosmetic region parameters.
- Deterministic semantic combination rules.

## Source Types

Phase 12B keeps field evidence explicit:

- `region_pixel_derived`
- `facemesh_region_derived`
- `color_rule_derived`
- `brightness_rule_derived`
- `saturation_rule_derived`
- `semantic_rule_derived`
- `insufficient_evidence`
- `human_review_required`

These source labels are evidence explanations, not final truth labels.

## Boundaries

The baseline must preserve:

- candidate-only output
- human review required
- not final recognition
- no AI confirmed wording
- no product shade claim
- no medical or skin diagnosis
- no fully automatic extraction claim
- no registry write or registry mutation
- no publish
- no production writer
- no User App Shell package replacement
- registry chain paused after Phase 10U

Phase 12B does not resume Phase 10V.

## Template Studio Placement

`MakeupSemanticExtractionPanel` belongs in the Template Workbench operator area. It summarizes candidates, source types, confidence bands, evidence, and limitations.

It does not belong in the ordinary User App Shell and must not expose operator-only terms to ordinary users.

## Next Step

The recommended next phase is Phase 12C - Photo-to-Template Draft Integration & Human Review Editing.
