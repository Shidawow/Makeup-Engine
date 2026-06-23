# Phase 11A - User App MVP Experience Reset

## Status

Completed.

## Summary

Phase 11A pauses the post-10U real registry write authorization path and resets
the active product focus to the ordinary-user User App MVP experience.

Phase 10V is intentionally paused. The registry chain remains preserved for
future administrator review, but it is not the active next phase.

## What Changed

- Added a clean User App MVP experience flow:
  Home -> Template Selection -> Template Detail -> Preparation ->
  Step-by-step Guidance -> Completion.
- Added a local `用户 App 预览` browser tab in `AppShell` for ordinary-user QA.
- Added ordinary-user components for template selection, template detail, step
  guidance, and completion.
- Updated `UserAppShell` so the ordinary-user path renders by default while
  administrator tooling is only rendered when explicitly enabled.
- Kept Template Studio and Phase 10A-10U registry safety panels intact.
- Added Phase 11A tests for MVP experience rendering, step guide actions,
  completion state, admin boundary separation, documentation recovery, and
  project-state recovery.

## Boundary

Phase 11A does not:

- continue Phase 10V actual write authorization request
- execute a real registry write
- mutate registry state
- publish to the user app
- create a production writer
- replace the current User App Shell package
- add backend, database, login, payment, camera, AR, OpenAI/external API, or
  training scope
- upload, store, or train on real user photos

## Validation Scope

Validation covers the User App MVP home/selection/detail/preparation/guidance/
completion path, ordinary-user/admin boundary separation, Template Studio tab
boundary preservation, ignored MediaPipe assets, typecheck, build, project
status, context pack, and browser verification.

## Next Recommended Phase

Phase 11B - User App Guided Step Experience Polish.
