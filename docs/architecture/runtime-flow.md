# Runtime Flow Analysis

## Real Application Entrypoints

The actual browser application entry path is:

```text
index.html
→ src/main.tsx
→ src/App.tsx
→ src/components/AppShell.tsx
→ 用户 App 预览 / 视觉分析 / 模板工作台 tabs
```

Phase 11A makes the ordinary-user User App MVP preview the default browser
entry. The Vision Analysis and Template Studio flows still exist as
administrator/operator tabs, but they are no longer the default first screen.

## Orchestration Entrypoints

There are three meaningful orchestration paths in the repository:

1. `src/components/template-studio/TemplateStudio.tsx`
2. `src/template-engine/pipeline/template-pipeline.ts`
3. `src/examples/demoPipeline.ts`

The first is the current UI entry. The second is the best expression of the new business direction. The third is a legacy/demo orchestration path still used by existing tests and older UI concepts.

## Bootstrap Sequence

Current runtime bootstrap is:

```text
index.html
→ Vite mounts #root
→ ReactDOM creates App
→ AppShell renders UserAppShell preview by default
→ user can switch to Vision Analysis or TemplateStudio operator tabs
→ TemplateStudio loads exampleMakeupTemplates when selected
→ user uploads photo or selects sample
→ local state mutates
→ template JSON is rendered/exported
```

## Pipeline Initialization Flow

The template production pipeline currently initializes in two different ways:

### Legacy flow

```text
photo mock input
→ intelligence mock analysis
→ old engine stages
→ render runtime preview
```

### New domain flow

```text
photo input
→ face-detection
→ landmarks
→ segmentation
→ cosmetic-analysis
→ decomposition
→ inference
→ extraction
→ template build
```

The new domain flow is the correct business direction for the repository.

## Key Observation

There is no longer a single authoritative runtime. The product now has:

- a browser UI runtime for the Studio,
- a local ordinary-user User App MVP preview runtime,
- a legacy demo/runtime stack,
- a new template production pipeline.

That split is acceptable in the short term, but only if the repository stops adding new product logic to the legacy runtime path.

## Risk

The current browser app still depends on local React state rather than an explicit template store/service layer. This is fine for a Studio MVP but becomes fragile once template versioning, review, and persistence grow.
