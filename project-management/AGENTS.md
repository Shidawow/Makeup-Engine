# Autonomous Makeup Engine Engineering Team

See detailed per-agent files in `project-management/agents`.

## Mission

Build the AI Makeup Engine Platform as an engine-first system, not a React-first application.

The system target is:

```text
Face Input
→ Face Analysis
→ Beauty Analysis
→ Style Inference
→ Makeup Plan
→ Compiler
→ Runtime
→ Renderer
→ Final Preview
```

## Agent Boundaries

### Architect Agent

- Owns engine architecture, pipeline design, runtime contracts, type systems.
- Rejects UI-coupled engine logic.
- Keeps shared contracts in engine or schema layers, not components.

### Planner Agent

- Owns roadmap, task graph, dependency analysis, milestone sequencing.
- Maintains `ROADMAP.md`, `TASKS.md`, and phase priorities.

### Intelligence Agent

- Owns face analysis, beauty scoring, style inference, and explainability.
- Logic must remain in `src/intelligence` or engine stages that wrap intelligence.

### Compiler Agent

- Owns Makeup DSL lowering into render instructions and layer graph data.
- Compiler output must target runtime execution, not UI display objects.
- Compiler changes require snapshot tests.

### Runtime Agent

- Owns execution pipeline, lifecycle, deterministic playback, benchmarkable runtime contracts.
- Runtime must be async-safe and typed.

### Renderer Agent

- Owns render layers, blending semantics, shader architecture preparation.
- Renderer APIs must support Canvas2D, WebGL, WebGPU, Metal, and mock runtimes.

### QA Agent

- Owns unit tests, integration tests, runtime verification, snapshot tests, architecture guards.
- Tests must be added before or alongside new modules.
- Failing tests must be fixed, not deleted to hide failures.

### Review Agent

- Owns architecture review, anti-pattern detection, type quality, performance audit.
- Blocks `any`, UI imports in engine, and direct React/Zustand dependencies in engine modules.

## Architecture Rules

- Engine code must not import React, React DOM, Zustand, or UI components.
- Core contracts must be centralized and shared.
- Pipeline stages must be independently testable and async-ready.
- Render output must be `RenderInstruction[]` or renderer-native frames, not plain JSON dumps.
- Runtime graph must remain explicit: dependency graph, execution graph, and layer graph.

## Coding Rules

- Strict TypeScript.
- No `any`.
- Pure functions for inference where practical.
- Deterministic runtime behavior.
- No hidden global mutable state in engine modules.
- Do not couple compiler output to DOM or React.

## Testing Rules

- New modules require tests.
- Compiler requires snapshot tests.
- Runtime requires integration tests.
- Engine pipeline requires full-flow tests.
- Architecture guard tests must prevent UI dependencies leaking into engine.

## Runtime Rules

- Runtime modules must be deterministic, async-safe, typed, and benchmarkable.
- Runtime lifecycle must expose initialization, rendering/execution, and teardown.
- Renderer implementations must satisfy `IRenderRuntime`.

## Review Rules

- Review begins with bugs and architectural violations.
- Review checks type boundaries, import direction, determinism, and test coverage.
- Review must not approve new UI complexity unless it directly validates runtime behavior.

## Prompt Registry

Reusable long-run Codex prompts live in `project-management/prompts`.
The primary operating prompt is `project-management/prompts/master-orchestrator.md`.

## Workflow Registry

Canonical workflows live in `project-management/workflows`.

## Standards Registry

Engineering standards live in `project-management/standards`.
