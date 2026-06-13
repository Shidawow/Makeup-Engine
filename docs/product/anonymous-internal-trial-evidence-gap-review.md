# Anonymous Internal Trial Evidence Gap Review

Phase 9I uses evidence gap review to explain what is missing after an anonymous
internal trial. The gap review is local, deterministic, and administrator-only.
It is not a backend issue tracker or production analytics system.

## Gap Types

- `missing_task_completion_evidence`
- `missing_step_comprehension_evidence`
- `missing_template_value_evidence`
- `missing_shell_usability_evidence`
- `missing_privacy_clarity_evidence`
- `missing_stop_condition_record`
- `missing_post_launch_handoff`
- `insufficient_sample_size`
- `unclear_admin_notes`
- `over_collected_forbidden_data`
- `privacy_incident`

## Severity Rules

- `over_collected_forbidden_data` and `privacy_incident` are always critical.
- Missing post-launch handoff is high severity.
- Missing privacy clarity evidence is at least medium severity.
- Missing stop condition records, unclear admin notes, and insufficient sample
  size are medium severity.
- Lower-risk content or task evidence gaps can be low severity, but they still
  reduce confidence.

## MVP Validation Boundary

The following gaps block MVP validation planning:

- critical privacy or forbidden-data gaps
- missing post-launch handoff
- insufficient sample size
- missing privacy clarity evidence
- unclear administrator notes

If the evidence is only mock/example, the team must not present it as real MVP
validation evidence.

## Required Response

- Continue anonymous internal trial if gaps are minor.
- Repeat anonymous internal trial if sample size is insufficient.
- Revise the launch pack if post-launch handoff is missing.
- Revise the evidence collection protocol if privacy clarity, stop condition, or
  admin note quality is weak.
- Pause if forbidden data or privacy incidents appear.
