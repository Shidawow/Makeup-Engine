# User App Session Recovery

Phase 7F adds deterministic recovery rules for the local User App MVP Shell session.

## Recovery Rules

- If `selectedTemplateId` no longer exists, recovery falls back to the first usable template and reports a warning.
- If `activeStepId` no longer exists, recovery falls back to the next available incomplete step.
- If completed or skipped step ids no longer exist, recovery drops them and reports warnings.
- If discovery filters are invalid, recovery resets discovery state and reports a warning.
- If the package has blocking issues, recovery disables step guide restore and shows a blocked recovery notice.
- If the session version does not match, recovery resets the session.
- Recovery never modifies `UserAppTemplatePackage`.

## UI Behavior

`UserAppSessionRecoveryNotice` reports restored, partially restored, reset, and blocked recovery states. It explains why a step guide cannot be restored when the current package is blocked.

## Boundary

Recovery is local-only. It does not upload state, create an account, sync to a backend or cloud service, write user records to `project-state`, or create training input.
