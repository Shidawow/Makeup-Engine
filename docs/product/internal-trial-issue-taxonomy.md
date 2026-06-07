# Internal Trial Issue Taxonomy

Phase 9B classifies internal trial issues from anonymous/mock signals only. The taxonomy helps the team decide whether a problem belongs to template content, the User App Shell, privacy boundaries, or the trial process.

## Categories

- `content_issue`: template title, steps, region copy, tool/product content, or content quality.
- `shell_usability_issue`: home, navigation, buttons, mobile layout, state clarity, or admin/user separation.
- `guidance_clarity_issue`: step comprehension, action labels, card copy, or confusion points.
- `recommendation_issue`: recommendation reason, current template, or alternative choice clarity.
- `privacy_copy_issue`: local-only, no upload, no training, no photo, or no account copy clarity.
- `trial_ops_issue`: script, moderation, observation template, task order, or feedback organization.
- `template_selection_issue`: trial template coverage, difficulty, scene fit, or backup template choice.
- `blocked_boundary_issue`: real identity, contact, health, sensitive identity, photo, biometric, backend, upload, AI analysis, training, or project-state user-record risk.
- `unknown_issue`: signal cannot be classified yet.

## Severity

- `low`: informational or isolated.
- `medium`: unclear pattern, needs more anonymous signals or a small fix.
- `high`: clear problem affecting trial usability.
- `critical`: privacy, sensitive data, training, backend, upload, or scope boundary risk.

## Actionability

- `clear_fix`: a direct content or Shell change is visible.
- `needs_more_trials`: signal count is too low to decide.
- `needs_product_decision`: needs product judgment before implementation.
- `blocked_by_boundary`: must pause until privacy or scope is fixed.
- `not_actionable_yet`: not enough structure to act.

This taxonomy must not become a real user issue tracker. It remains local, anonymous, and example-level until a later explicit gate approves a real collection system.
