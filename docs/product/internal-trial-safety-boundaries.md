# Internal Trial Safety Boundaries

Phase 14B is an internal trial preparation layer. It is not public beta, not a
real user research system, not analytics, not production readiness, and not a
release approval.

## Required Boundary Copy

Before any future dry run, the operator must explain:

- This is an internal small-scope local MVP demo.
- The participant is represented only by a role profile.
- No real name, phone number, email, address, social media account, health
  information, sensitive identity information, biometric identifier, or face
  embedding will be collected.
- No real photos will be uploaded or saved.
- No base64 image, object URL, or local photo path will be recorded.
- No analytics, backend, database, account, payment, camera, AR, OpenAI API,
  external AI API, or training system is connected.
- The registry chain remains paused after Phase 10U.
- The trial cannot write registry state, publish templates, create a production
  writer, or replace the current User App Shell.
- Photo-to-template remains semi-automatic draft flow plus human review; it is
  not fully automatic high-quality extraction and not AI-confirmed recognition.

## Stop Conditions

Pause the prep or future dry run if anyone asks for:

- real name or contact information
- photo upload or photo storage
- local photo path, base64, object URL, or image bytes
- health or sensitive identity information
- biometric identifier or face embedding
- analytics or backend storage
- registry write, registry mutation, publish, production writer, or User App
  Shell package replacement
- fully automatic extraction or AI-confirmed claim

## Current Status

The current 14B output is local and deterministic. It prepares Phase 14C
Internal Trial Dry Run, but it does not run a real trial yet.
