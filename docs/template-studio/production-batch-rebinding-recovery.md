# Production Batch Rebinding Recovery

`BrowserArtifactResource` object URLs are temporary browser resources. They are not durable artifacts.

## Problem

After refresh or session restore, a task may still look like it has a validated manifest binding, but its browser object URL is gone. That task must not pretend it can still run Vision Analysis.

## Recovery Behavior

- Detect restored `ready_for_analysis` tasks whose seed cannot run browser analysis.
- Mark the task as needing rebinding.
- Move the task back to `needs_artifact_binding`.
- Clear runtime-only resource fields from the seed.
- Add a `rebinding-needed` task event.
- Let the operator reselect normalized PNG or JSON RGBA.
- After explicit rebinding, seed readiness and task status can return to `ready_for_analysis`.

## Storage Boundary

Storage can keep binding metadata, task state, seed metadata, and review state. It must not persist object URLs, local absolute paths, large image bytes, or React state.
