# Vision Pipeline Review

## Modules Reviewed

- `src/vision/face-detection`
- `src/vision/landmarks`
- `src/vision/segmentation`
- `src/vision/cosmetic-analysis`

## Pipeline Maturity

The CV pipeline is currently fixture-driven and deterministic. It is good enough for local prototype work, but it is not a real computer vision system.

## Missing Normalization Layer

The pipeline lacks a formal normalization layer for:

- image coordinate space
- face box normalization
- landmark normalization
- region confidence normalization
- feature canonicalization

This means downstream modules rely on synthetic, fixed assumptions.

## Schema Inconsistencies

- `face-analysis.ts` defines `TemplateFaceFeatures`.
- `face-detection` returns a face box.
- `segmentation` returns regions.
- `cosmetic-analysis` mixes style clues with geometry hints.

These are useful, but they are not yet wrapped in one canonical vision result schema.

## Runtime Bottlenecks

There are no true compute bottlenecks yet because the pipeline is mocked/deterministic. The real bottleneck will be schema quality, not computation.

## Assessment

Vision is intentionally lightweight, which is appropriate right now. The main gap is not compute. It is a missing shared result contract that can support real CV later.
