# UserAppTemplatePackage Registry Preparation

Phase 10I adds a local, administrator-only registry preparation layer for
`UserAppTemplatePackage` draft metadata.

This is not a registry write, not publication, not production app readiness, and
not a replacement for the current User App Shell package.

## Purpose

Registry preparation converts a Phase 10H draft publish gate result into a
reviewable registry entry preview. It preserves the source draft, QA trace,
human review trace, candidate trace, contract trace, preview trace, official
draft trace, and publish gate trace so a later phase can decide whether a
registry write gate is safe.

## Input

The only ready input is a Phase 10H draft publish gate with status
`draft_publish_gate_ready` or `draft_publish_gate_ready_with_warnings`.

Blocked 10H gates can still create a blocked preparation object for UI and test
coverage, but they cannot become registry-write-gate-ready.

## Prepared Fields

- package id candidate
- package version candidate
- title and summary
- style tags
- difficulty and estimated time
- step count
- privacy notice
- safety flags
- draft-only, publish-blocked, registry-write-blocked flags

## Boundaries

- No actual user app package registry write.
- No publication to a user app.
- No production `UserAppTemplatePackage` marker.
- No current User App Shell package replacement.
- No backend, database, account, analytics, camera, AR, OpenAI API, external AI
  API, training, service worker, or production app routing.
- No raw image data, object URLs, local paths, base64 image strings, personal
  data, health data, sensitive identity data, biometrics, medical claims,
  product shade claims, or unsupported final recognition claims.

Ready preparation means only that the entry preview can proceed to a future
registry write gate such as Phase 10J.
