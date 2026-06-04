# Phase 7A - User App MVP Shell

## Goal

Phase 7A builds a local, contract-driven User App MVP Shell from `UserAppTemplatePackage`.

This is not a production app. It is not an iOS native app, not a backend, not a database, not online publication, not camera capture, not AR, and not a training phase.

## What Changed

- Added pure `src/user-app` view model, navigation, progress, state, and shell helpers.
- Added user-facing shell components in `src/components/user-app`.
- Added `UserAppShell` with package summary, template list, template detail, step-by-step guidance, region instructions, tool/product panels, compatibility banner, and local progress.
- Added `userAppMvpShellExamplePackage` with two templates and warning coverage.
- Wired `UserAppShell` into Template Studio as a local preview after the prototype consumer panel.
- Added tests for view model, navigation, progress, component rendering, Template Studio flow, blocked runtime references, and documentation recovery.

## Main Flow

```text
UserAppTemplatePackage
-> User App Shell
-> Template List
-> Template Detail
-> Step-by-step Guidance
-> Region Instructions
-> Tools / Products
-> Local Progress
-> Compatibility Warnings
```

## Boundaries

- The shell consumes only `UserAppTemplatePackage`.
- The shell does not consume `SourceImagePackage` directly.
- The shell does not upload data or publish online.
- The shell does not create training datasets.
- The shell does not add backend, database, login, account, camera, AR, iOS native, OpenAI API, PyTorch, TensorFlow, ONNX Runtime, or new runtime dependencies.
- Durable export boundaries still block object URLs, local absolute paths, large image bytes, `data:image/`, and React state.
- Template Studio remains the administrator workbench. The shell is only a local user-side preview surface embedded there for Phase 7A.

## View Model

`src/user-app/userAppViewModel.ts` derives deterministic app-facing data:

- package summary
- template cards
- selected template detail
- ordered steps
- current step
- previous and next step ids
- region instruction summaries
- tool/product summaries
- difficulty, duration, tags, occasions, and safety notes
- compatibility warnings and blocking issues

## Navigation

`src/user-app/userAppNavigation.ts` provides local state screens:

- `home`
- `template-list`
- `template-detail`
- `step-guide`
- `tools`
- `compatibility`

Blocked packages cannot enter `step-guide`; they redirect to `compatibility`.

## Progress

`src/user-app/userAppProgress.ts` tracks local step completion:

- current step
- completed steps
- skipped steps
- progress percent
- optional timestamps

Progress is local UI state only. It is not uploaded, exported, or used for training.

## Tests

Phase 7A adds or updates tests for:

- user app shell view model
- navigation model
- progress model
- template list rendering
- template detail rendering
- step guide rendering
- region instruction rendering
- tool/product panel rendering
- compatibility banner rendering
- Template Studio shell wiring
- runtime-only reference blocking
- documentation and project-state recovery

## Result

Phase 7A is complete when validation passes and the shell can locally consume `UserAppTemplatePackage` without backend, online publication, AR, camera, training, or native iOS scope.

## Next Recommendation

Proceed to Phase 7B - Step-by-step Guidance UX Hardening.

Use Phase 7A-1 only if shell QA finds navigation, blocked-state, or template selection gaps before UX hardening.
