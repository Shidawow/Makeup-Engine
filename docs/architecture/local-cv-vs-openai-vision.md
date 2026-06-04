# Local CV Vs OpenAI Vision

Makeup Engine remains local-CV-first.

The production source of truth is:

```text
local FaceMesh
-> cosmetic regions
-> segmentation masks
-> weighted pixel analysis
-> editable masks
-> correction dataset
-> review queue
-> training adapter
```

## What Local CV Owns

Local CV owns geometry and measurable data:

- landmarks and face boxes
- cosmetic region polygons
- segmentation masks
- mask alpha grids
- object-contain coordinate mapping
- weighted pixel sampling
- skin-relative analysis
- edge softness analysis
- mask diff artifacts
- training labels

These outputs must be deterministic and auditable because they become training
data.

## What OpenAI Vision May Help With Later

OpenAI Vision can be a future optional semantic enrichment provider for:

- template naming
- makeup style explanation
- professional description
- step copywriting
- QA suggestions
- reviewer hints
- user-facing explanation

It should consume local CV outputs, not replace them.

## What OpenAI Vision Must Not Own

OpenAI Vision must not replace:

- FaceMesh
- segmentation masks
- landmark coordinates
- pixel sampling
- dirty-region recompute
- training labels
- dataset review decisions

Those are local, typed artifacts because they need reproducibility and precise
coordinate behavior.

## API Key Boundary

API keys must never be exposed in the frontend. A future real OpenAI Vision call
would need a backend or secure server boundary that:

- stores secrets outside the browser
- receives local CV summaries or approved crops
- logs provider versions
- returns semantic enrichment only
- never mutates masks directly

Phase 5B.6 only defines the contract and a deterministic placeholder.
