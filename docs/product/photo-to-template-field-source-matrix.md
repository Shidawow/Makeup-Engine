# Photo-to-Template Field Source Matrix

Phase 12A classifies each photo-to-template draft field by source type.

## Source Types

- `real_from_photo`: directly from local photo/runtime analysis.
- `facemesh_derived`: derived from MediaPipe FaceMesh geometry.
- `region_qa_derived`: derived from FaceMesh region QA.
- `pixel_rule_derived`: derived from local pixel-analysis rules.
- `semantic_rule_derived`: derived from local semantic rules over pixel data.
- `template_rule_derived`: derived from deterministic template rules.
- `demo_fixture`: local demo fixture or example copy.
- `placeholder`: placeholder copy or placeholder structure.
- `human_required`: must be reviewed or edited by a human.
- `unsupported`: not currently supported as reliable automatic extraction.

## Field Matrix

| Field | Source Classification | Reality Notes |
| --- | --- | --- |
| faceDetected | real_from_photo, facemesh_derived | Runtime geometry signal. |
| landmarkCount | real_from_photo, facemesh_derived | FaceMesh landmark count. |
| boundingBox | facemesh_derived | FaceMesh runtime bounding box. |
| readinessScore | region_qa_derived, template_rule_derived | Rule-based detection usability score, not model raw confidence. |
| regionCoverage | region_qa_derived | Region coverage from required FaceMesh landmarks. |
| cosmeticRegions | facemesh_derived, region_qa_derived, human_required | Geometry/review support, not final semantics. |
| lipColor | pixel_rule_derived, human_required | Candidate only. |
| lipFinish | semantic_rule_derived, pixel_rule_derived, human_required | Candidate only. |
| blushPlacement | pixel_rule_derived, region_qa_derived, human_required | Candidate only. |
| eyeMakeupIntensity | pixel_rule_derived, human_required | Candidate only. |
| eyeshadowTone | pixel_rule_derived, human_required, unsupported | Exact tone extraction is unsupported. |
| eyelinerShape | pixel_rule_derived, human_required | Candidate only. |
| browShape | placeholder, human_required, unsupported | Reliable semantic extraction is unsupported. |
| contourPresence | facemesh_derived, template_rule_derived, human_required | Conservative draft guidance. |
| highlightPresence | placeholder, human_required, unsupported | Lighting-sensitive and unsupported. |
| overallMakeupStyle | semantic_rule_derived, template_rule_derived, human_required | Local rule assembly, not final recognition. |
| templateTitle | template_rule_derived, human_required | Draft metadata/copy. |
| templateSummary | template_rule_derived, human_required | Draft copy. |
| suitableScenario | demo_fixture, placeholder, human_required | Demo/user-facing copy. |
| difficulty | template_rule_derived, demo_fixture, human_required | UX estimate. |
| estimatedTime | template_rule_derived, demo_fixture, human_required | Step-count estimate. |
| toolList | template_rule_derived, human_required | From draft steps. |
| stepSequence | template_rule_derived, human_required | Rule-based draft steps. |
| beginnerTips | placeholder, demo_fixture, human_required | Not extracted from photo. |
| commonMistakes | placeholder, human_required | Not extracted from photo. |
| correctionTips | placeholder, human_required | Not extracted from photo. |
| userAppPreview | demo_fixture, template_rule_derived, human_required | Local preview only. |

## Interpretation

The field matrix supports a conservative product statement:

Current capability is semi-automatic photo-to-template draft generation with
human review. It is not fully automatic makeup extraction, not production
readiness, and not user app publication.
