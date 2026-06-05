# Runtime Message Protocol

Status: proposed canonical event protocol  
Scope: pipeline observability, runtime playback, template production, coaching UI

## Purpose

The platform needs a single runtime message protocol so that pipeline execution, inference, template generation, and coaching playback can be observed without coupling UI to internal modules.

Events should be:

- immutable
- typed
- replayable
- ordered
- safe to log
- stable across UI rewrites

This protocol is not a backend event bus design. It is a local-first data protocol that can later be sent to a server, stored, replayed, or inspected in tests.

## Event Design Principles

1. Every event has a discriminating `type`.
2. Every event belongs to a `runId`.
3. Stage events include `stageName`.
4. Payloads are structured and narrow.
5. Events may reference large artifacts by ID; they should not embed full image binary data.
6. Events should include enough metadata to debug local MVP failures.
7. Events are append-only. Runtime state is derived from events plus current context.

## Base Event

```ts
export type RuntimeEventType =
  | 'pipeline.started'
  | 'pipeline.completed'
  | 'pipeline.failed'
  | 'stage.started'
  | 'stage.completed'
  | 'stage.failed'
  | 'vision.inference.started'
  | 'vision.inference.completed'
  | 'vision.inference.failed'
  | 'intelligence.inference.started'
  | 'intelligence.inference.completed'
  | 'intelligence.inference.failed'
  | 'template.generated'
  | 'template.validated'
  | 'template.saved'
  | 'runtime.context.created'
  | 'runtime.context.updated'
  | 'coaching.instruction.generated'
  | 'coaching.step.completed'
  | 'coaching.failed';

export interface RuntimeEventBase<TType extends RuntimeEventType, TPayload> {
  id: ProtocolId;
  type: TType;
  protocolVersion: ProtocolVersion;
  timestamp: ISODateTime;
  runId: ProtocolId;
  sessionId?: ProtocolId;
  stageName?: PipelineStageName;
  source:
    | 'vision'
    | 'intelligence'
    | 'template-engine'
    | 'templates'
    | 'coach-runtime'
    | 'ui'
    | 'store'
    | 'test';
  payload: TPayload;
}
```

## Pipeline Events

```ts
export type PipelineEvent =
  | RuntimeEventBase<'pipeline.started', PipelineStartedPayload>
  | RuntimeEventBase<'pipeline.completed', PipelineCompletedPayload>
  | RuntimeEventBase<'pipeline.failed', PipelineFailedPayload>;

export interface PipelineStartedPayload {
  inputKind: 'image' | 'template' | 'fixture';
  imageId?: ProtocolId;
  templateId?: ProtocolId;
  requestedStages: PipelineStageName[];
}

export interface PipelineCompletedPayload {
  durationMs: number;
  completedStages: PipelineStageName[];
  artifactIds: ProtocolId[];
}

export interface PipelineFailedPayload {
  failedStage?: PipelineStageName;
  errorCode: string;
  message: string;
  recoverable: boolean;
}
```

## Stage Execution Events

```ts
export type StageExecutionEvent =
  | RuntimeEventBase<'stage.started', StageStartedPayload>
  | RuntimeEventBase<'stage.completed', StageCompletedPayload>
  | RuntimeEventBase<'stage.failed', StageFailedPayload>;

export interface StageStartedPayload {
  stageName: PipelineStageName;
  inputArtifactIds: ProtocolId[];
}

export interface StageCompletedPayload {
  stageName: PipelineStageName;
  outputArtifactIds: ProtocolId[];
  durationMs: number;
  warnings: string[];
}

export interface StageFailedPayload {
  stageName: PipelineStageName;
  errorCode: string;
  message: string;
  inputArtifactIds: ProtocolId[];
  recoverable: boolean;
}
```

## Inference Events

```ts
export type InferenceEvent =
  | RuntimeEventBase<'vision.inference.started', VisionInferenceStartedPayload>
  | RuntimeEventBase<'vision.inference.completed', VisionInferenceCompletedPayload>
  | RuntimeEventBase<'vision.inference.failed', InferenceFailedPayload>
  | RuntimeEventBase<'intelligence.inference.started', IntelligenceInferenceStartedPayload>
  | RuntimeEventBase<'intelligence.inference.completed', IntelligenceInferenceCompletedPayload>
  | RuntimeEventBase<'intelligence.inference.failed', InferenceFailedPayload>;

export interface VisionInferenceStartedPayload {
  imageId: ProtocolId;
  requestedOutputs: Array<'face_geometry' | 'face_attributes' | 'skin_analysis' | 'cosmetic_region_map'>;
}

export interface VisionInferenceCompletedPayload {
  resultId: ProtocolId;
  imageId: ProtocolId;
  faceDetected: boolean;
  faceAnalysisId?: ProtocolId;
  cosmeticRegionMapId?: ProtocolId;
  confidence: ConfidenceScore;
  warnings: string[];
}

export interface IntelligenceInferenceStartedPayload {
  faceAnalysisId: ProtocolId;
  requestedOutputs: Array<'style_profile' | 'recommendation' | 'suitability' | 'product_recommendation'>;
}

export interface IntelligenceInferenceCompletedPayload {
  recommendationId: ProtocolId;
  styleProfileId: ProtocolId;
  confidence: ConfidenceScore;
  explanations: string[];
}

export interface InferenceFailedPayload {
  inputArtifactId: ProtocolId;
  errorCode: string;
  message: string;
  recoverable: boolean;
}
```

## Template Events

```ts
export type TemplateEvent =
  | RuntimeEventBase<'template.generated', TemplateGeneratedPayload>
  | RuntimeEventBase<'template.validated', TemplateValidatedPayload>
  | RuntimeEventBase<'template.saved', TemplateSavedPayload>;

export interface TemplateGeneratedPayload {
  templateId: ProtocolId;
  astId: ProtocolId;
  sourceImageId?: ProtocolId;
  recommendationId?: ProtocolId;
  status: TemplateLifecycleStatus;
}

export interface TemplateValidatedPayload {
  templateId: ProtocolId;
  valid: boolean;
  issueCount: number;
  errorCount: number;
  warningCount: number;
}

export interface TemplateSavedPayload {
  templateId: ProtocolId;
  status: TemplateLifecycleStatus;
  storageProvider: 'memory' | 'local_file' | 'indexed_db' | 'api';
  version: ProtocolVersion;
}
```

## Runtime Context Events

```ts
export type RuntimeContextEvent =
  | RuntimeEventBase<'runtime.context.created', RuntimeContextCreatedPayload>
  | RuntimeEventBase<'runtime.context.updated', RuntimeContextUpdatedPayload>;

export interface RuntimeContextCreatedPayload {
  contextId: ProtocolId;
  templateId?: ProtocolId;
  recommendationId?: ProtocolId;
  initialState: RuntimeExecutionContext['state'];
}

export interface RuntimeContextUpdatedPayload {
  contextId: ProtocolId;
  previousState: RuntimeExecutionContext['state'];
  nextState: RuntimeExecutionContext['state'];
  activeStepId?: ProtocolId;
  completedStepIds: ProtocolId[];
}
```

## Coaching Events

```ts
export type CoachingEvent =
  | RuntimeEventBase<'coaching.instruction.generated', CoachingInstructionGeneratedPayload>
  | RuntimeEventBase<'coaching.step.completed', CoachingStepCompletedPayload>
  | RuntimeEventBase<'coaching.failed', CoachingFailedPayload>;

export interface CoachingInstructionGeneratedPayload {
  instructionId: ProtocolId;
  templateId?: ProtocolId;
  recommendationId?: ProtocolId;
  stepId?: ProtocolId;
  region: FaceRegionId;
  action: ActionType;
}

export interface CoachingStepCompletedPayload {
  instructionId: ProtocolId;
  stepId?: ProtocolId;
  completedAt: ISODateTime;
  userConfirmed: boolean;
}

export interface CoachingFailedPayload {
  instructionId?: ProtocolId;
  stepId?: ProtocolId;
  errorCode: string;
  message: string;
  recoverable: boolean;
}
```

## Unified Event Union

The code implementation should expose a discriminated union:

```ts
export type RuntimeEvent =
  | PipelineEvent
  | StageExecutionEvent
  | InferenceEvent
  | TemplateEvent
  | RuntimeContextEvent
  | CoachingEvent;
```

Reducers should use exhaustive switching:

```ts
function reduceRuntimeEvent(
  context: RuntimeExecutionContext,
  event: RuntimeEvent,
): RuntimeExecutionContext {
  switch (event.type) {
    case 'runtime.context.updated':
      return {
        ...context,
        state: event.payload.nextState,
        activeStepId: event.payload.activeStepId,
        completedStepIds: event.payload.completedStepIds,
        updatedAt: event.timestamp,
      };
    default:
      return context;
  }
}
```

When implemented, use a `never` exhaustiveness check in reducers that must handle every event.

## Event Ordering

Minimum ordering guarantees:

1. `pipeline.started` must be first for a run.
2. `stage.started` must occur before matching `stage.completed` or `stage.failed`.
3. `pipeline.completed` or `pipeline.failed` must be terminal for a pipeline run.
4. Runtime coaching events may continue after template generation, but should share the same `sessionId`.
5. Events with equal timestamps should be ordered by append sequence.

## Error Protocol

Errors should be structured instead of raw thrown strings.

```ts
export interface RuntimeProtocolError {
  code:
    | 'IMAGE_INPUT_INVALID'
    | 'FACE_NOT_DETECTED'
    | 'VISION_INFERENCE_FAILED'
    | 'INTELLIGENCE_INFERENCE_FAILED'
    | 'TEMPLATE_BUILD_FAILED'
    | 'TEMPLATE_VALIDATION_FAILED'
    | 'RUNTIME_EXECUTION_FAILED'
    | 'UNKNOWN';
  message: string;
  stageName?: PipelineStageName;
  recoverable: boolean;
  details?: Record<string, string | number | boolean>;
}
```

Avoid `any` in error details. If richer details are needed, define a specific payload type for that error.

## Runtime State Derivation

Runtime state should be derived from:

```text
initial RuntimeExecutionContext
+ RuntimeEvent[]
-> current RuntimeExecutionContext
-> UI ViewModel
```

The UI should not directly mutate:

- `BeautyTemplate`
- `TemplateAST`
- `MakeupRecommendation`
- `FaceAnalysis`
- `VisionInferenceResult`

The UI may dispatch user intent:

```ts
export type RuntimeCommand =
  | { type: 'start'; templateId: ProtocolId }
  | { type: 'pause'; contextId: ProtocolId }
  | { type: 'resume'; contextId: ProtocolId }
  | { type: 'complete_step'; contextId: ProtocolId; instructionId: ProtocolId }
  | { type: 'skip_step'; contextId: ProtocolId; instructionId: ProtocolId; reason?: string };
```

Commands are mutable intent. Events are immutable facts.

## Logging Requirements

Development logs should print:

- event type
- run ID
- stage name
- duration when available
- warning/error counts
- artifact IDs

Logs should not print:

- image binary data
- full base64 image strings
- personal information
- full template payloads unless explicitly requested in dev tools

## Test Requirements

Runtime protocol tests should cover:

- event discriminated union narrowing
- pipeline event ordering
- failed stage emits terminal pipeline failure
- runtime context reducer determinism
- `BeautyTemplate -> CoachingInstruction[]` event sequence
- snapshot for template generation events

## Optional Refactor Suggestions

High ROI:

1. Create `src/protocol` from these docs.
2. Convert `src/vision` to emit `VisionInferenceResult`.
3. Convert `src/intelligence/types/FaceFeatures` into an adapter target, not a public cross-module type.
4. Rename or wrap generic `engine` outputs so template production consumes `BeautyTemplate`, not `MakeupPlan`.
5. Make `src/templates/schema` the base for persisted assets.

Medium ROI:

1. Add event emission to the local demo pipeline.
2. Add runtime reducer tests.
3. Add a UI view-model adapter so components do not import pipeline internals.

Low ROI right now:

1. Microservice-style event buses.
2. Full plugin architecture.
3. Distributed tracing.
4. WebGPU/Metal renderer contracts before the template and coaching protocols stabilize.

