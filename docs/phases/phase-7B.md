# Phase 7B - Step-by-step Guidance UX Hardening

## Goal

Phase 7B hardens the User App MVP Shell guidance experience so a future user can understand what to do, which tool or product to use, where to apply it, what to avoid, and why a package is warning or blocked.

This is UX hardening over the local shell. It is not a production user app, not iOS native development, not backend work, not a database, not camera capture, not AR, not online publication, and not training.

## What Changed

- Added step guidance view model fields for progress label, step category, user-friendly instruction text, short summary, detailed instruction, region guidance, tool checklist, product checklist, warnings, blocked reason, and next action.
- Added user-friendly message helpers for warning and blocked compatibility issues.
- Hardened `UserMakeupStepGuide` for user-facing hierarchy, current-step focus, step preparation, mistakes, correction tips, and blocked guidance.
- Hardened `UserAppProgressPanel`, `UserRegionInstructionView`, `UserToolProductPanel`, and `UserAppCompatibilityBanner`.
- Rewrote user-app Shell copy into readable Chinese and improved small-screen stacking.
- Added `userAppGuidanceUxExamplePackage` with complete, warning, blocked, long-flow, and short-flow templates.
- Added tests for guidance view model, friendly messages, empty/blocked states, mobile layout smoke, progress behavior, and step guidance flow.

## Main Flow

```text
UserAppTemplatePackage
-> User App Shell
-> Step Guidance View Model
-> Friendly Warnings
-> Region Guidance
-> Tool / Product Guidance
-> Local Progress
```

## Step Guidance Hierarchy

Each step should present:

- current progress
- step title
- summary
- detailed instruction
- region guidance
- tool checklist
- product checklist
- common mistakes
- correction tips
- warning messages
- blocked reason
- next action

## Friendly Warning / Blocked Copy

The shell translates internal contract issues into user-facing language:

- `missing matching region instruction` becomes a concrete area-missing message.
- `object URL` becomes a temporary-resource message.
- `local absolute path` becomes a device-local-path message.
- `image bytes` becomes an inline-image-data message.
- invalid step order becomes a sequence-fix message.

## Mobile Layout

The shell keeps guidance content in stacked sections on small screens. Tool and product checklists sit beside or below instruction details depending on available width. Buttons use clear labels and remain visible after warning and blocked states.

## Boundaries

- The shell consumes only `UserAppTemplatePackage`.
- `SourceImagePackage` cannot feed User App Shell directly.
- Shell progress is local UI state only.
- No backend, database, account, camera, AR, online publication, iOS native scope, external API, PyTorch, TensorFlow, ONNX Runtime, or new runtime dependency was added.
- Durable exports still cannot contain object URLs, local absolute paths, large image bytes, `data:image/`, or React state.

## Tests

Phase 7B adds and updates tests for:

- guidance view model
- friendly messages
- makeup step guide UX
- progress panel behavior
- empty and blocked states
- mobile layout smoke
- step guidance flow
- documentation recovery

## Result

Phase 7B is complete when typecheck, full tests, build, project status, context pack, direct JSON status, direct JSON context, and HTTP smoke pass.

## Next Recommendation

Proceed to Phase 7C - User Photo Intake Placeholder / Personalization Boundary.

Use Phase 7B-1 only if mobile interaction QA finds problems in step pacing, button placement, or warning readability.

