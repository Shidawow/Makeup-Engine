# Unified Runtime Schema

Status: proposed canonical protocol  
Scope: AI makeup coaching platform and makeup template production system  
Implementation status: design document only; do not add another code schema family until migration starts

## Problem

The repository currently has several disconnected schema systems:

- `src/engine/contracts`
- `src/schema`
- `src/intelligence/types`
- `src/templates/schema`
- `src/runtime` state
- `src/vision` outputs

These schemas model overlapping concepts with different names and different levels of detail. The result is schema drift: pipeline stages can compile, but the business meaning of a field changes depending on which module produced it.

This document defines the canonical protocol the platform should converge on. It is not a command to immediately rewrite every module. It is the target contract for future migrations.

## Canonical Ownership Decision

The platform should introduce one canonical protocol layer in a future code change:

```text
src/protocol/
  primitives.ts
  vision.ts
  face.ts
  skin.ts
  style.ts
  recommendation.ts
  template.ts
  runtime.ts
  events.ts
```

Until that exists, `docs/schema/*` is the source of truth for architecture decisions.

`src/templates/schema` is the strongest current business model and should become the base for `BeautyTemplate`. Legacy `MakeupTemplate` can remain as a compatibility alias during migration, but the platform-level object should be named `BeautyTemplate` because it covers source evidence, strategy, style, suitability, and future coaching.

## Shared Primitives

All canonical schemas should use common primitives instead of repeated `string`, `number`, and ad hoc metadata fields.

```ts
export type ProtocolVersion = '0.1';
export type ProtocolId = string;
export type ISODateTime = string;
export type ConfidenceScore = number; // 0..1

export type CoordinateSpace =
  | 'image_pixels'
  | 'normalized_image'
  | 'face_normalized'
  | 'uv_map'
  | 'screen';

export interface Point2D {
  x: number;
  y: number;
  space: CoordinateSpace;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  space: CoordinateSpace;
}

export interface Polygon {
  points: Point2D[];
  space: CoordinateSpace;
}

export interface Evidence {
  source: 'vision' | 'user' | 'admin' | 'template' | 'rule' | 'model' | 'runtime';
  label: string;
  confidence: ConfidenceScore;
  reason?: string;
}

export interface ModelAttribution {
  provider: 'mock' | 'local' | 'openai' | 'custom';
  modelName: string;
  modelVersion?: string;
}

export interface DataProvenance {
  createdAt: ISODateTime;
  createdBy: 'system' | 'admin' | 'user' | 'test';
  runId?: ProtocolId;
  sourceImageId?: ProtocolId;
  model?: ModelAttribution;
}
```

## FaceGeometry

`FaceGeometry` is owned by the vision layer. It describes where the face and important regions are. It should not contain beauty judgment or makeup recommendations.

```ts
export type FaceRegionId =
  | 'full_face'
  | 'forehead'
  | 'left_eye'
  | 'right_eye'
  | 'left_eyebrow'
  | 'right_eyebrow'
  | 'nose'
  | 'left_cheek'
  | 'right_cheek'
  | 'lips'
  | 'jawline'
  | 'chin';

export interface FaceLandmark {
  id: string;
  label: string;
  point: Point2D;
  confidence: ConfidenceScore;
}

export interface FaceRegionGeometry {
  regionId: FaceRegionId;
  bounds: BoundingBox;
  contour?: Polygon;
  landmarks?: FaceLandmark[];
  confidence: ConfidenceScore;
}

export interface FaceGeometry {
  faceId: ProtocolId;
  imageId: ProtocolId;
  bounds: BoundingBox;
  landmarks: FaceLandmark[];
  regions: FaceRegionGeometry[];
  symmetryAxis?: {
    top: Point2D;
    bottom: Point2D;
    confidence: ConfidenceScore;
  };
  pose?: {
    yaw: number;
    pitch: number;
    roll: number;
    confidence: ConfidenceScore;
  };
  provenance: DataProvenance;
}
```

## FaceAttributes

`FaceAttributes` is the normalized semantic interpretation of facial features. It can be inferred by vision, rules, or model inference, but the canonical output is owned by the protocol layer.

```ts
export type FaceShape = 'round' | 'oval' | 'square' | 'heart' | 'long' | 'diamond';
export type EyeType = 'monolid' | 'hooded' | 'double' | 'deep_set' | 'upturned' | 'downturned';
export type LipShape = 'thin' | 'medium' | 'full' | 'uneven' | 'defined_cupid_bow';
export type BrowShape = 'straight' | 'arched' | 'soft_arch' | 'rounded' | 'sparse' | 'full';

export interface ClassifiedAttribute<TValue extends string> {
  value: TValue;
  confidence: ConfidenceScore;
  evidence: Evidence[];
}

export interface FaceAttributes {
  faceShape: ClassifiedAttribute<FaceShape>;
  eyeType: ClassifiedAttribute<EyeType>;
  lipShape: ClassifiedAttribute<LipShape>;
  browShape?: ClassifiedAttribute<BrowShape>;
  proportions?: {
    midfaceRatio?: number;
    eyeSpacingRatio?: number;
    lipToFaceRatio?: number;
    jawWidthRatio?: number;
  };
}
```

## SkinAnalysis

`SkinAnalysis` belongs to the bridge between vision and intelligence. Vision may provide observations; intelligence may classify product implications. The canonical object must retain both raw observations and recommendation-relevant labels.

```ts
export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
export type SkinTone = 'warm' | 'cool' | 'neutral' | 'olive';
export type SkinFinish = 'matte' | 'natural' | 'dewy' | 'glowy';

export interface SkinConcern {
  type: 'redness' | 'texture' | 'dark_circles' | 'hyperpigmentation' | 'dry_patches' | 'shine';
  severity: 'low' | 'medium' | 'high';
  regions: FaceRegionId[];
  confidence: ConfidenceScore;
}

export interface SkinAnalysis {
  skinType: ClassifiedAttribute<SkinType>;
  skinTone: ClassifiedAttribute<SkinTone>;
  undertone?: ClassifiedAttribute<SkinTone>;
  currentFinish?: ClassifiedAttribute<SkinFinish>;
  concerns: SkinConcern[];
  evidence: Evidence[];
}
```

## CosmeticRegionMap

`CosmeticRegionMap` is the canonical representation of detected makeup on the face. It must preserve spatial evidence, visual effect, and extraction confidence.

```ts
export type CosmeticRegionType =
  | 'base'
  | 'concealer'
  | 'contour'
  | 'highlight'
  | 'blush'
  | 'eyeshadow'
  | 'eyeliner'
  | 'mascara'
  | 'brow'
  | 'lip_color'
  | 'lip_liner';

export type CosmeticFinish = 'matte' | 'satin' | 'dewy' | 'glossy' | 'shimmer' | 'metallic';
export type IntensityLevel = 'low' | 'medium' | 'high';

export interface CosmeticRegion {
  id: ProtocolId;
  type: CosmeticRegionType;
  faceRegion: FaceRegionId;
  geometry: Polygon | BoundingBox;
  colorHint?: {
    hex?: string;
    family: 'pink' | 'peach' | 'coral' | 'red' | 'brown' | 'nude' | 'berry' | 'black' | 'gray';
    confidence: ConfidenceScore;
  };
  finish?: CosmeticFinish;
  intensity: IntensityLevel;
  detectedEffects: VisualEffect[];
  confidence: ConfidenceScore;
  evidence: Evidence[];
}

export interface CosmeticRegionMap {
  imageId: ProtocolId;
  faceId: ProtocolId;
  regions: CosmeticRegion[];
  coverageSummary: {
    detectedRegionCount: number;
    dominantFinish?: CosmeticFinish;
    overallIntensity: IntensityLevel;
  };
}
```

## FaceAnalysis

`FaceAnalysis` is the canonical output consumed by intelligence. It aggregates geometry, attributes, skin, and cosmetic region evidence without prescribing a style or a coaching plan.

```ts
export interface FaceAnalysis {
  id: ProtocolId;
  imageId: ProtocolId;
  geometry: FaceGeometry;
  attributes: FaceAttributes;
  skin: SkinAnalysis;
  cosmeticRegions?: CosmeticRegionMap;
  confidence: ConfidenceScore;
  provenance: DataProvenance;
}
```

## VisionInferenceResult

Vision emits `VisionInferenceResult`. It can contain partial outputs so that the pipeline can degrade gracefully.

```ts
export interface VisionInferenceResult {
  id: ProtocolId;
  imageId: ProtocolId;
  status: 'completed' | 'partial' | 'failed';
  faceDetected: boolean;
  faceAnalysis?: FaceAnalysis;
  cosmeticRegionMap?: CosmeticRegionMap;
  warnings: string[];
  errors: string[];
  confidence: ConfidenceScore;
  provenance: DataProvenance;
}
```

## MakeupStyleProfile

`MakeupStyleProfile` is the intelligence-level interpretation of the desired or detected beauty style. It should support both template production and coaching.

```ts
export type BeautyStyleId =
  | 'natural'
  | 'korean'
  | 'japanese'
  | 'douyin'
  | 'western'
  | 'clean_girl'
  | 'glam'
  | 'editorial';

export interface StyleWeightProfile {
  eyelinerWeight: number; // 0..1
  blushWeight: number;
  contourWeight: number;
  lipstickWeight: number;
  baseGlowWeight: number;
  browDefinitionWeight: number;
}

export interface MakeupStyleProfile {
  id: BeautyStyleId;
  label: string;
  weights: StyleWeightProfile;
  visualGoals: VisualEffect[];
  suitability: {
    faceShapes?: FaceShape[];
    eyeTypes?: EyeType[];
    skinTypes?: SkinType[];
    occasions?: string[];
  };
  evidence: Evidence[];
  confidence: ConfidenceScore;
}
```

## ProductRecommendation

Product recommendations must be separated from technique recommendations. The platform can recommend a finish, texture, or category before it knows a commercial product.

```ts
export interface ProductRecommendation {
  id: ProtocolId;
  category:
    | 'foundation'
    | 'concealer'
    | 'powder'
    | 'blush'
    | 'contour'
    | 'highlighter'
    | 'eyeshadow'
    | 'eyeliner'
    | 'mascara'
    | 'brow'
    | 'lipstick'
    | 'lip_gloss';
  recommendedFinish?: CosmeticFinish;
  colorFamily?: CosmeticRegion['colorHint']['family'];
  intensity: IntensityLevel;
  reason: string;
  suitabilityEvidence: Evidence[];
}
```

## MakeupRecommendation

`MakeupRecommendation` is the intelligence output. It should not contain UI text as its only source of meaning. It should be structured enough to generate templates, coach instructions, and UI summaries.

```ts
export interface MakeupRecommendation {
  id: ProtocolId;
  faceAnalysisId: ProtocolId;
  styleProfile: MakeupStyleProfile;
  visualGoals: VisualEffect[];
  productRecommendations: ProductRecommendation[];
  techniqueRecommendations: TechniqueRecommendation[];
  explanations: string[];
  confidence: ConfidenceScore;
  provenance: DataProvenance;
}

export interface TechniqueRecommendation {
  id: ProtocolId;
  region: FaceRegionId;
  action: ActionType;
  intensity: IntensityLevel;
  reason: string;
  expectedEffects: VisualEffect[];
  evidence: Evidence[];
}
```

## BeautyTemplate

`BeautyTemplate` is the canonical business asset. It represents reusable beauty knowledge extracted from an image or authored by an admin. Current `src/templates/schema/MakeupTemplate` should migrate toward this contract.

```ts
export type TemplateLifecycleStatus = 'draft' | 'review' | 'validated' | 'published' | 'deprecated';

export interface BeautyTemplate {
  id: ProtocolId;
  version: ProtocolVersion;
  name: string;
  status: TemplateLifecycleStatus;
  source: {
    sourceType: 'admin_upload' | 'fixture' | 'import' | 'generated' | 'manual';
    imageId?: ProtocolId;
    fileName?: string;
  };
  styleProfile: MakeupStyleProfile;
  faceStrategy: FaceStrategy;
  suitability: FaceSuitability;
  regionMap: CosmeticRegionMap;
  steps: BeautyTemplateStep[];
  ast: TemplateAST;
  validation: {
    valid: boolean;
    issues: TemplateValidationIssue[];
  };
  metadata: {
    createdAt: ISODateTime;
    createdBy: string;
    updatedAt?: ISODateTime;
    tags: string[];
    provenance: DataProvenance;
  };
}

export interface BeautyTemplateStep {
  id: ProtocolId;
  order: number;
  region: FaceRegionId;
  action: ActionType;
  tool: ToolType;
  intensity: IntensityLevel;
  placement: MakeupPlacement;
  blendMode: BlendMode;
  layerOrder: LayerOrder;
  strokeDirection?: StrokeDirection;
  expectedEffects: VisualEffect[];
  rationale: string;
  dependencies: ProtocolId[];
}
```

## TemplateAST

`TemplateAST` is the compiler-friendly representation of a template. It is not a replacement for `BeautyTemplate`; it is a normalized execution tree derived from one.

```ts
export interface TemplateAST {
  templateId: ProtocolId;
  version: ProtocolVersion;
  nodes: TemplateASTNode[];
  edges: TemplateASTEdge[];
  entryNodeIds: ProtocolId[];
}

export type TemplateASTNode =
  | {
      kind: 'region';
      id: ProtocolId;
      region: FaceRegionId;
      children: ProtocolId[];
    }
  | {
      kind: 'technique';
      id: ProtocolId;
      stepId: ProtocolId;
      action: ActionType;
      expectedEffects: VisualEffect[];
    }
  | {
      kind: 'validation';
      id: ProtocolId;
      ruleId: string;
      severity: 'error' | 'warning';
    };

export interface TemplateASTEdge {
  from: ProtocolId;
  to: ProtocolId;
  relation: 'contains' | 'depends_on' | 'validates' | 'explains';
}
```

## RuntimeExecutionContext

Runtime context is mutable per session, but immutable events should describe every important state transition.

```ts
export interface RuntimeExecutionContext {
  runId: ProtocolId;
  sessionId: ProtocolId;
  templateId?: ProtocolId;
  faceAnalysisId?: ProtocolId;
  recommendationId?: ProtocolId;
  activeStepId?: ProtocolId;
  completedStepIds: ProtocolId[];
  skippedStepIds: ProtocolId[];
  emittedInstructionIds: ProtocolId[];
  state: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## PipelineStageContext

Every pipeline stage should receive and return a typed context. Stages may append artifacts, warnings, and events, but should not mutate prior artifacts in place.

```ts
export type PipelineStageName =
  | 'image_input'
  | 'face_analysis'
  | 'makeup_region_detection'
  | 'style_inference'
  | 'recommendation'
  | 'technique_extraction'
  | 'template_build'
  | 'template_validation'
  | 'runtime_execution'
  | 'coaching_instruction_generation';

export interface PipelineStageContext<TInput, TOutput> {
  runId: ProtocolId;
  stageName: PipelineStageName;
  input: Readonly<TInput>;
  output?: Readonly<TOutput>;
  warnings: string[];
  errors: string[];
  startedAt: ISODateTime;
  completedAt?: ISODateTime;
  provenance: DataProvenance;
}
```

## CoachingInstruction

`CoachingInstruction` is the final runtime-facing instructional unit. It should be generated from `BeautyTemplate` or `MakeupRecommendation`, not handwritten inside React components.

```ts
export interface CoachingInstruction {
  id: ProtocolId;
  templateId?: ProtocolId;
  recommendationId?: ProtocolId;
  stepId?: ProtocolId;
  region: FaceRegionId;
  tool: ToolType;
  action: ActionType;
  instructionText: string;
  visualTargets: {
    regionGeometry?: FaceRegionGeometry;
    highlightRegion: FaceRegionId;
    overlayOpacity?: number;
  };
  timing: {
    estimatedDurationMs: number;
    repeatCount?: number;
  };
  rationale: string;
  safetyNotes: string[];
  expectedEffects: VisualEffect[];
}
```

## Domain Enumerations

These should be centralized rather than duplicated across schema families.

```ts
export type ToolType = 'brush' | 'finger' | 'sponge' | 'pencil' | 'wand' | 'puff';

export type ActionType =
  | 'apply'
  | 'blend'
  | 'line'
  | 'tightline'
  | 'curl'
  | 'set'
  | 'shade'
  | 'highlight'
  | 'contour'
  | 'diffuse'
  | 'overline'
  | 'fill';

export type BlendMode = 'none' | 'soft_blend' | 'gradient' | 'diffused_edge' | 'sharp_edge';
export type LayerOrder = 'base' | 'correction' | 'color' | 'definition' | 'finish';
export type StrokeDirection = 'upward' | 'outward' | 'inward' | 'horizontal' | 'vertical' | 'circular';

export type VisualEffect =
  | 'brighten_skin'
  | 'natural_glow'
  | 'matte_finish'
  | 'enlarge_eye'
  | 'lift_eye'
  | 'deepen_eye'
  | 'soften_eye'
  | 'slim_face'
  | 'reduce_midface'
  | 'increase_dimension'
  | 'soften_contour'
  | 'fuller_lip'
  | 'softer_lip'
  | 'youthful_lip'
  | 'doll_style'
  | 'glam_definition';
```

## Data Ownership

| Schema | Canonical owner | Producers | Consumers | Mutable? |
| --- | --- | --- | --- | --- |
| `FaceGeometry` | `vision` via `src/protocol` | face detection, landmarks | intelligence, template-engine, UI overlays | immutable |
| `FaceAttributes` | `vision`/intelligence bridge | classifiers, rules | intelligence, template-engine | immutable after inference |
| `SkinAnalysis` | intelligence protocol | skin classifiers, rules | recommendation, templates | immutable after inference |
| `CosmeticRegionMap` | vision/template-engine bridge | segmentation, cosmetic analysis | template-engine, runtime overlays | immutable after extraction |
| `VisionInferenceResult` | vision | image pipeline | intelligence, template-engine | immutable |
| `MakeupStyleProfile` | beauty-knowledge/intelligence | style inference | recommendation, templates | immutable |
| `MakeupRecommendation` | intelligence | rule engine, scorer, style inference | template-engine, runtime, UI | immutable |
| `ProductRecommendation` | intelligence | recommendation engine | UI, commerce integrations | immutable |
| `BeautyTemplate` | templates | template-engine, studio | coach-runtime, storage, UI | immutable when validated/published |
| `TemplateAST` | template-engine/compiler | template compiler | runtime, validators | immutable |
| `RuntimeExecutionContext` | coach-runtime | runtime player | UI | mutable per session |
| `PipelineStageContext` | pipeline runner | all pipeline stages | logs, tests, observability | immutable per stage completion |
| `CoachingInstruction` | coach-runtime | runtime instruction generator | UI | immutable |

## Extension Policy

1. Shared identity, provenance, confidence, geometry, and event fields belong in the protocol layer.
2. Vision modules may extend raw adapter outputs internally, but must emit `VisionInferenceResult`.
3. Intelligence modules may keep rule-specific internals, but must emit `MakeupRecommendation` and `MakeupStyleProfile`.
4. Template-engine modules may compile internal AST helpers, but persisted assets must be `BeautyTemplate`.
5. Runtime modules may maintain mutable session state, but UI must receive readonly view models or immutable events.
6. React components must not define business schemas. They can define view-only props derived from runtime output.

## Current Merge Targets

| Current interface | Target canonical schema |
| --- | --- |
| `src/intelligence/types/FaceFeatures` | `FaceAttributes` + `SkinAnalysis` |
| `src/intelligence/types/MakeupRecommendation` | `MakeupRecommendation` |
| `src/engine/contracts/FaceAnalysisResult` | `FaceAnalysis` |
| `src/engine/contracts/StyleInferenceResult` | `MakeupStyleProfile` + `MakeupRecommendation` |
| `src/engine/contracts/MakeupPlan` | `BeautyTemplate` or runtime-specific `CoachingInstruction[]` |
| `src/engine/contracts/RenderInstruction` | `CoachingInstruction` or renderer-specific projection |
| `src/vision/cosmetic-analysis/CosmeticAnalysisResult` | `VisionInferenceResult` + `CosmeticRegionMap` |
| `src/schema/MakeupTemplate` and `legacyTypes` | deprecated compatibility adapters |
| `src/templates/schema/MakeupTemplate` | `BeautyTemplate` |

## What Should Disappear

The following abstractions should be deprecated after compatibility adapters exist:

- Generic `engine/contracts` result types that duplicate beauty-domain contracts.
- `src/schema/legacyTypes.ts` and early `src/schema/types.ts` as direct imports.
- Broad string-only recommendation fields such as `foundation?: string`.
- UI-local business fields that duplicate runtime or recommendation state.

## Migration Principle

Do not mass-rewrite all imports in one pass. Migrate by pipeline boundary:

1. Define protocol code from this document.
2. Add adapters from existing types into protocol types.
3. Convert vision outputs first.
4. Convert intelligence outputs second.
5. Convert template-engine persisted assets third.
6. Convert runtime/UI view models last.

