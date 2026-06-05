# Pipeline Specification

## Stage Contract

All stages must be:

- typed
- async-ready
- independently testable
- replaceable

## Runtime Pipeline

```text
FaceInput
  features
  source

FaceAnalysisResult
  normalized features
  confidence
  notes

BeautyScoreResult
  score
  dimensions
  confidence

StyleInferenceResult
  styleName
  recommendation
  explanations
  confidence

MakeupPlan
  sourceLook
  analysis
  inference
  steps

RenderInstruction[]
  layers
  region
  action
  blend
  stroke
  duration

RenderFrame
  instructions
  renderedAt
```
