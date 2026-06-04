# Step Guidance UX Hardening

Phase 7B hardens the local User App MVP Shell step guidance experience.

## Goal

Make user-facing step guidance easier to read, easier to follow, and easier to recover when information is missing.

## Information Hierarchy

User-facing guidance should read in this order:

1. Current step and progress label.
2. Short instruction summary.
3. Detailed instruction text.
4. Region guidance summary.
5. Tool checklist.
6. Product checklist.
7. Common mistakes.
8. Correction tips.
9. Warning and blocked state messages.
10. Next action.

## User-Friendly Messages

Internal contract errors should be translated into user-facing language.

- Missing instruction text should say the step cannot start yet.
- Missing region instructions should say the step lacks a concrete application area.
- Runtime-only references should say the package contains temporary or local-only references that cannot be used for user guidance.
- Invalid step order should say the template order must be fixed before guidance can continue.

## Mobile Layout Principles

- Prefer single-column stacking on small screens.
- Keep buttons full-width or near-full-width when space is tight.
- Keep warning banners visible but smaller than the main instruction block.
- Keep tools and products separate from the step text so the instruction remains readable.

## Boundaries

- Local only.
- Contract driven.
- No backend.
- No database.
- No login.
- No camera.
- No AR.
- No online publication.
- No training pipeline changes.

## Current Limitations

- This is still a prototype shell, not a production user app.
- Guidance quality depends on contract quality.
- Empty, warning, and blocked states must be handled explicitly.

