# Internal Trial Result Review Framework

Phase 9B defines a local framework for reviewing internal trial results after the Phase 9A operations pack. It is a structured product review aid, not a production analytics system.

## Scope

- Review anonymous or mock/example trial signals.
- Summarize task completion, step comprehension, template value, recommendation usefulness, tool/product clarity, privacy clarity, confusion points, Shell usability, content quality, and trial operation quality.
- Separate content issues, Shell usability issues, guidance clarity issues, recommendation issues, privacy copy issues, trial ops issues, template selection issues, boundary blockers, and unknown issues.
- Produce a local recommendation for the next product step.

## Non-Goals

- No backend.
- No real user database.
- No AI analysis.
- No OpenAI or external API calls.
- No training data writes.
- No production release approval.
- No App Store/TestFlight scope.
- No real names, contacts, photos, health information, sensitive identity information, or biometrics.

## Review Inputs

Allowed inputs are anonymous, summarized, local review signals such as:

- "Participants found the recommendation entrance."
- "Two participants could not understand step 2."
- "The privacy copy was clear."
- "The trial script caused confusion."

Disallowed inputs include real participant names, contact details, photos, health notes, sensitive identity data, raw feedback records, backend records, analytics events, or training labels.

## Output

The review framework can be:

- `review_ready`
- `review_ready_with_warnings`
- `review_blocked`

Blocked means a privacy, sensitive data, backend, AI analysis, upload, training, or project-state user-record risk appeared and must be fixed before continuing.
