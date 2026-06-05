# Evidence Quality Gate

The Evidence Quality Gate is a deterministic, rule-based review helper for
`HumanCorrectionSample` assets. It is not a model and does not call an LLM.
Its job is to make the first review pass explainable and repeatable.

## Inputs

`runQualityGate` evaluates:

- `correctionConfidence`
- `maskDiff.changedAreaRatio`
- `maskDiff.edgeShiftScore`
- `maskDiff.alphaDeltaMean`
- semantic drift between original and updated semantics
- aggregate `TemplateEvidence` confidence
- `humanVerificationStatus`
- region type through the sample itself
- source image quality placeholder

All inputs are local values already present in the correction dataset or template
evidence. No remote resources are required.

## Outputs

The quality gate returns:

- `qualityScore`
- `suggestedDecision`
- `suggestedReasons`
- `needsSecondReview`
- `isTrainingReady`
- `evidenceSummary`
- `explanation`

`evidenceSummary` is copied onto each `DatasetReviewItem`, so the review queue
can be audited and exported without recomputing the gate.

## Decision Policy

High-confidence, human-verified samples with stable semantics and reasonable
mask deltas are suggested as `ready_for_training`.

Samples with moderate scores are suggested as `needs_second_review` when they
look useful but need another human pass.

Samples with low confidence, severe semantic drift, poor source image quality,
or unstable mask boundaries are suggested as `rejected` or remain
`pending_review` with reasons attached.

## Explainability

The gate adds reason tags rather than opaque scores only. For example:

- low correction confidence adds `low_confidence`
- large semantic changes add `semantic_drift`
- very small mask changes add `insufficient_makeup_signal`
- unstable boundaries add `mask_boundary_error`
- clean accepted samples add `accepted_clean`

The Evidence Panel shows the gate result, suggested decision, second-review
indicator, training-ready indicator, and confidence distribution across the
template evidence groups.

## Limitations

The source image quality input is still a placeholder. It is intentionally part
of the contract now so future image-quality scoring can be added without
changing review queue or manifest formats.
