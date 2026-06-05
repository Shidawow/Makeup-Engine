# Production Batch Publish Confirmation

Phase 6I-1 makes local publish explicit and auditable.

## Behavior

Before a task can become `published`, the operator must confirm:

- This is a local production state.
- This is not online publication.
- This does not upload to a server.
- This does not generate a training dataset.

## Data Recorded

`TemplateProductionPublishConfirmation` records:

- `confirmationId`
- `confirmedAt`
- optional `confirmedBy`
- optional `operatorNote`
- `localPublished: true`
- `notOnlineRelease: true`
- `noTrainingDataset: true`

## Guardrails

- Publish requires approved status.
- Rejected task cannot create publish confirmation.
- Publish without confirmation is blocked.
- Published task must include the confirmation in export / handoff.
