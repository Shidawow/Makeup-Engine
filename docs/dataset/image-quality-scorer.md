# Image Quality Scorer

The image quality scorer is a deterministic placeholder for future source-image
quality assessment. It does not use a model and does not add external
dependencies.

## Output

`ImageQualityAssessment` includes:

- resolution score
- face visibility score
- lighting score
- blur risk score
- compression risk score
- occlusion risk score
- overall image quality score
- suggested decision
- reasons

## Decisions

The placeholder can suggest:

- `usable`
- `needs_review`
- `reject_source_image`

Reasons include low resolution, face visibility risk, lighting risk, blur risk,
compression risk, and occlusion risk.

## Quality Gate Integration

Quality Gate accepts image quality as optional input. If no assessment exists,
old behavior is preserved. If assessment exists, source image score can lower the
quality score and add `bad_source_image`.

## Replacement Path

A future real scorer can replace the placeholder as long as it preserves the
typed `ImageQualityAssessment` contract. That keeps Dataset Review Queue,
Curation Metrics, and Training Adapter stable.
