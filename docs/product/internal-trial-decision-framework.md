# Internal Trial Decision Framework

Phase 9B turns anonymous issue summaries into a next-step product decision. It is a deterministic local framework, not automated user research analysis.

## Decisions

- `continue_internal_trials`
- `revise_template_content`
- `revise_user_app_shell`
- `revise_trial_pack`
- `pause_for_privacy_or_scope_fix`
- `ready_for_phase_9C`

## Decision Rules

- Any critical boundary issue forces `pause_for_privacy_or_scope_fix`.
- Privacy or sensitive data issues force pause.
- Too few anonymous signals returns `continue_internal_trials` with a needs-more-trials status.
- Multiple content, guidance, recommendation, or template-selection issues favor `revise_template_content`.
- Multiple Shell usability issues favor `revise_user_app_shell`.
- Multiple trial operations issues favor `revise_trial_pack`.
- Clean and sufficient signals can become `ready_for_phase_9C` only when explicitly marked phase-ready.

## Boundaries

The framework must not:

- Store real participant records.
- Collect real names, contacts, photos, health information, sensitive identity information, or biometrics.
- Upload feedback.
- Use AI or external APIs.
- Write to training datasets.
- Write real user trial records into `project-state`.
- Approve production release.

Phase 9C should use this framework to plan internal trial iteration, not to launch public growth or production analytics.
