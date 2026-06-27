# Makeup Semantic Field Evidence

Phase 12B defines a conservative evidence model for makeup semantic candidates. It improves the Phase 12A field source matrix without changing the production boundaries.

## Field Evidence Rules

`lipColorCandidate` uses local hue, saturation, brightness, weighted samples, and skin-baseline contrast. It may output a color family candidate such as coral or rose, but it must not become a brand shade or final color claim.

`lipFinishCandidate` uses brightness and edge/highlight signals. It is lighting-sensitive and should stay low or medium confidence unless a reviewer confirms it.

`blushPlacementCandidate` uses region pixel center, opacity, and spread. It can suggest upper-cheek, under-eye, diffuse, or center-cheek placement, but it remains candidate-only.

`blushIntensityCandidate` uses saturation and skin-baseline contrast. It cannot claim actual product amount or skin condition.

`eyeMakeupIntensityCandidate` uses brightness and contrast signals. It does not infer complex eyeliner shape or final eye style.

`eyeshadowToneCandidate` requires weighted local eyeshadow samples. If samples are missing, it must return insufficient evidence or unknown.

`browDefinitionCandidate`, `highlightSignalCandidate`, and `contourSignalCandidate` use FaceMesh region parameters and local contrast where available. They are signal candidates, not final brow, highlight, or contour detection.

`overallStyleCandidate` combines semantic candidates with deterministic rules. It is always human review required and must not be described as automatic style recognition.

## Source Labels

- `region_pixel_derived`: local region pixels and geometry are used.
- `facemesh_region_derived`: FaceMesh region parameters are used.
- `color_rule_derived`: hue/saturation/brightness color rules are used.
- `brightness_rule_derived`: brightness, contrast, or edge signals are used.
- `saturation_rule_derived`: saturation and baseline difference rules are used.
- `semantic_rule_derived`: multiple candidates are combined by deterministic rules.
- `insufficient_evidence`: the system lacks enough local evidence.
- `human_review_required`: the field must be checked by a reviewer.

## Review Requirements

All fields require human review. Unknown or insufficient evidence is acceptable and safer than overclaiming.

The system must not use Phase 12B evidence to claim fully automatic high-quality makeup extraction, final recognition, product shade matching, medical/skin diagnosis, registry readiness, publish readiness, production readiness, or User App Shell package replacement.
