# Phase 10A - FaceMesh-driven Makeup Intelligence Baseline

## Status

Completed.

## Summary

Phase 10A adds a local FaceMesh-driven makeup intelligence baseline inside
Makeup Engine's template production workflow.

It introduces:

- FaceMesh region QA based on real landmark coverage and confidence.
- Makeup attribute candidates from local FaceMesh, pixel, semantic, and
  deterministic rule-based signals.
- Rule-based draft step generation.
- Draft-only template generation.
- Template Studio administrator panel for FaceMesh QA, candidates, steps, and
  template draft status.

## Important Boundary

This is not a production app feature and not automatic makeup recognition for
end users. All outputs are candidate or draft artifacts and require human
review.

Phase 10A does not add backend, database, account system, cloud sync, camera
capture, browser camera permission, AR, OpenAI API, external AI/CV API,
recommendation API, analytics, model training, public release, App
Store/TestFlight scope, React Native, Flutter, or native iOS.

`public/mediapipe/**` remains local ignored runtime assets only and must not be
committed.

## Files

- `src/vision/facemeshRegionQa.ts`
- `src/template-engine/makeupAttributeCandidates.ts`
- `src/template-engine/ruleBasedStepGenerator.ts`
- `src/template-engine/templateDraftGenerator.ts`
- `src/components/template-studio/FaceMeshMakeupIntelligencePanel.tsx`
- `docs/product/facemesh-region-qa-baseline.md`
- `docs/product/makeup-attribute-candidate-baseline.md`
- `docs/product/rule-based-template-draft-baseline.md`

## Next Phase

Phase 10B - Template Draft QA & Human Review Workflow.
