# Photo-to-Template Draft Reality Check

Phase 12A audits the current photo-to-template draft chain. It answers what is
actually derived from local image analysis, what is rule-derived, what is demo
fixture or placeholder copy, and what still requires human review.

## Current Conclusion

The current system can support semi-automatic template draft generation with
human review. It cannot claim fully automatic high-quality makeup extraction
from arbitrary photos.

The current chain is:

```text
local image / operator Vision Analysis
-> MediaPipe FaceMesh when local ignored assets are present
-> FaceMesh region QA
-> local pixel and semantic rules
-> makeup attribute candidates
-> rule-based step sequence
-> template draft
-> draft QA
-> human review
-> candidate/package/admin handoff only
```

## Real Or FaceMesh-Derived

- face detected state
- FaceMesh landmark count
- FaceMesh bounding box
- region coverage
- cosmetic region geometry when FaceMesh and region QA are available

These are geometry/readiness signals. They are not final makeup semantics.

## Rule-Derived

- Readiness Score, which is a rule-based detection usability score
- lip color family candidate from local pixel hue/saturation rules
- lip finish candidate from local semantic rules over pixel analysis
- blush placement candidate from local pixel/region rules
- eye makeup intensity and eyeliner direction candidates
- step sequence generated from deterministic template rules
- template title, summary, difficulty, estimated time, and tool list drafts

## Demo Fixture / Placeholder

- suitable scenario copy
- beginner tips
- common mistakes
- correction tips
- User App preview copy
- some template UX copy carried from local demo fixtures

These fields must not be described as real photo-derived makeup extraction.

## Human-Required

All makeup attribute candidates, step guidance, region instructions, user-facing
copy, fixture copy, and unsupported semantic fields require human review before
any template library or app-facing handoff.

## Unsupported For Automatic Extraction

The system does not yet reliably extract:

- exact eyeshadow tone
- brow shape semantics
- highlight presence independent of lighting
- product shades or brand matches
- final style identity from arbitrary photos
- user-ready coaching copy without review

## Boundaries

Phase 12A does not resume Phase 10V and does not perform registry write,
registry mutation, publication, production writer creation, User App Shell
package replacement, backend/database/account work, camera/AR work, OpenAI or
external AI API work, training, real photo upload, or real user data storage.

`public/mediapipe/**` remains local ignored runtime assets only.

## Next Step

Proceed to Phase 12B: Makeup Semantic Extraction Baseline. The next phase
should improve visual semantic extraction before any stronger photo-to-template
claim is made.
