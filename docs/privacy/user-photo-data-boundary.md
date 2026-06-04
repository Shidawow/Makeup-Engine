# User Photo Data Boundary

This document records the privacy boundary introduced in Phase 7C.

## Current Version

The current local User App Shell does not:

- collect real user photos
- upload photos
- request camera permissions
- analyze faces
- generate face embeddings
- infer sensitive attributes
- store photo bytes
- write photo references to durable exports
- write photo data to `project-state`
- use user photos for training

## Allowed In Phase 7C

Phase 7C allows only:

- placeholder photo intake state
- disabled future upload/camera buttons
- privacy notices
- non-sensitive local display hints
- tests that verify unsafe references are blocked

## Future Requirements

A future real-photo phase must define consent, retention, deletion, local-vs-remote processing, export boundaries, model/training exclusions, and product copy before enabling any camera, upload, or analysis path.
