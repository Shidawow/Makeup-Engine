# Anonymous Internal Trial Evidence Review

Phase 9I defines the anonymous internal trial evidence review framework. It is
not production analytics, not a backend evidence system, not AI analysis, and
not production release approval.

## Purpose

- Review only anonymous, local, post-launch evidence summaries.
- Check evidence completeness across task completion, step comprehension,
  template value, Shell usability, recommendation usefulness, privacy clarity,
  trial ops, stop conditions, post-launch handoff, and decision input.
- Identify privacy incidents, stopped or paused sessions, and over-collected
  forbidden data.
- Prevent mock/example evidence from being overclaimed as MVP validation
  evidence.

## Required Review Dimensions

- task completion evidence
- step comprehension evidence
- template value evidence
- Shell usability evidence
- recommendation usefulness evidence
- privacy clarity evidence
- trial ops evidence
- stop condition evidence
- post-launch handoff evidence
- decision input evidence

## Privacy Boundary

The review must not store or process:

- real names
- contact information
- face photos or makeup photos
- health information
- sensitive identity information
- biometric identifiers or face embeddings
- raw camera data
- uploaded images
- backend records
- analytics records
- AI analysis records
- training data

## Status

- `evidence_review_ready`: anonymous evidence is complete and privacy safe.
- `evidence_review_ready_with_warnings`: review can continue but has gaps,
  small samples, stopped-session context, or mock/example source warnings.
- `evidence_review_blocked`: missing post-launch handoff, privacy incident, or
  forbidden data blocks the review.

## Non-Goals

9I does not collect new data, upload evidence, analyze evidence with AI, create a
database, write training data, approve MVP validation, or approve production app
work.
