# Template Review Lifecycle

Phase 6I introduces a local template review lifecycle for production tasks.

## Review Flow

```text
evidence_ready
-> ready_for_template_review
-> approved | rejected
-> published
```

Approval requires evidence. Rejection requires a reason. Publish requires approval and only updates local production state.

## Boundaries

- Review state does not bypass dataset review.
- Approval does not mark correction data training-ready.
- Publish does not mean online release.
- publish does not mean online release.
- No backend, database, or deployment capability is introduced in Phase 6I.

## Next Hardening

Phase 6I-1 should strengthen review QA, reason capture, batch-level issue views, and operator confirmations before moving to template library management.
