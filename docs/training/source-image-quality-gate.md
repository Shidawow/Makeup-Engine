# Source Image Quality Gate

The source image quality gate is deterministic and rule-based.

It checks:

- minimum dimensions
- brightness too low or too high
- contrast too low
- color variance too low
- blank images
- transparent images
- alpha coverage

The output is a `SourceImageQualityReport` with `readiness`, `qualityScore`, signal summaries, and issue codes.
