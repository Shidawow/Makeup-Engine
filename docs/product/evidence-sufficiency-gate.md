# Evidence Sufficiency Gate

Phase 9E adds a local gate for deciding whether internal trial evidence is sufficient for the next step.

## Decisions

- `sufficient_for_next_internal_trial`
- `sufficient_for_mvp_validation_planning`
- `insufficient_collect_more_internal_evidence`
- `blocked_by_privacy_or_scope_issue`
- `blocked_by_missing_trial_evidence`

## Rules

- No anonymous observation evidence means the gate cannot approve MVP validation planning.
- No evidence at all blocks evidence-based advancement.
- Privacy, sensitive data, upload, backend, AI analysis, or training violations force a blocker decision.
- Weak user value evidence means more internal evidence is needed.
- Missing template, Shell, privacy, trial operations, or decision evidence prevents overclaiming.
- MVP validation planning is allowed only when evidence is broad enough, privacy-safe, and free of critical blockers.

## Boundary

The gate is a local administrator decision aid. It is not production analytics, not backend collection, not AI analysis, not training, and not production app approval.
