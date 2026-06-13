# Anonymous Internal Trial Launch Pack

Phase 9H defines the anonymous internal trial launch pack. It is a launch
preparation layer for a small-scope internal anonymous trial, not a public trial,
production release, backend data system, analytics system, AI analysis system, or
MVP validation plan.

## Purpose

- Prepare the participant notice, administrator execution script, anonymous
  evidence capture sheet, launch scope, and stop conditions.
- Carry forward Phase 9F evidence collection safety rules and Phase 9G dry run
  review.
- Keep the launch internal, anonymous, local, and non-public.
- Handoff only anonymous summaries after the trial.

## Launch Scope

The launch scope must include:

- `internal_only`
- `small_scope`
- `anonymous_observation_only`
- `no_photo_collection`
- `no_contact_collection`
- `no_health_or_sensitive_data`
- `no_upload`
- `no_training`
- `no_backend_storage`
- `local_review_only`

## Participant Notice

The participant notice must clearly explain:

- This is an internal small-scope anonymous trial.
- No real names, contact information, health information, sensitive identity
  information, biometric information, face photos, makeup photos, raw camera
  data, uploaded images, account credentials, or payment information are
  collected.
- No camera permission is requested.
- Nothing is uploaded.
- Nothing is written to a training dataset.
- Notes remain anonymous and local.

## Administrator Script

The administrator script should cover:

1. Opening statement: this is internal, anonymous, and non-public.
2. Privacy boundary: no photos, no identity, no contact, no health or sensitive
   information, no upload, no training, no backend.
3. Trial path: homepage, recommendation, template detail, step guidance, tools,
   region instructions, preferences, local progress, and privacy copy.
4. Anonymous evidence capture: task completion, comprehension, value, usability,
   recommendation usefulness, privacy clarity, trial ops notes, issue counts, and
   severity summary.
5. Stop condition: pause immediately if any forbidden data or scope expansion
   appears.
6. Handoff: pass only anonymous summaries into evidence review and decision
   workflow.

## Anonymous Evidence Capture Sheet

Allowed fields are anonymous and local only:

- anonymous session code
- participant type
- anonymous task completion notes
- anonymous step comprehension notes
- anonymous template value notes
- anonymous shell usability notes
- anonymous recommendation usefulness notes
- anonymous privacy clarity notes
- anonymous trial ops notes
- aggregated issue severity
- aggregated iteration priority
- handoff summary

## Stop Conditions

The trial must pause or stop if anyone asks to:

- take, upload, save, or analyze a photo
- record a real name, phone number, email, address, social account, credential,
  or other identifying information
- record skin health, health condition, sensitive identity, biometric identifier,
  face embedding, or raw camera data
- use backend storage, analytics, OpenAI/external API analysis, upload,
  synchronization, or training

## Boundary

9H does not start a public launch, production app, backend, database, account
system, analytics system, AI analysis pipeline, camera flow, AR flow, training
pipeline, App Store/TestFlight release, or MVP validation plan.
