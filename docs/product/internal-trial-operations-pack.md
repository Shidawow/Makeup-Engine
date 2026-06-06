# Internal Trial Operations Pack

Phase 9A prepares an internal small-scope trial operations pack for the local User App MVP Shell. It is not public recruitment, not production launch operations, and not App Store or TestFlight preparation.

## Purpose

The pack helps an operator run a structured internal trial session and decide what to observe before the next review phase.

The trial should answer:

- Can the participant understand the home screen?
- Can the participant find a recommended makeup template?
- Can the participant start guided practice?
- Can the participant complete several steps without help?
- Are tools, products, region instructions, and privacy copy clear?
- Does the participant think the template content is useful enough to keep trying?

## Participant Types

Use participant types only. Do not record real identities.

- Complete beginner.
- Light makeup user.
- Frequent makeup user.
- Beauty advisor or makeup knowledgeable reviewer.
- Internal product reviewer.

Each session can tag a participant type, but it must not record real name, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, or other personal identifiers.

## Session Flow

1. Explain that this is an internal small-scope trial of a local prototype shell.
2. Confirm the participant should not upload photos, share contact information, share health information, or provide sensitive identity details.
3. Ask the participant to open the shell and describe what they think the home screen offers.
4. Ask the participant to find a recommended template.
5. Ask the participant to read the template detail.
6. Ask the participant to start guided practice.
7. Ask the participant to complete at least three steps.
8. Ask the participant to inspect tools, products, and region instructions.
9. Ask the participant to review or skip local preferences.
10. Ask the participant to read the privacy explanation.
11. Ask the participant to close and reopen the shell to check local progress recovery.
12. Record anonymous observation signals and issue themes only.

## Stop Conditions

Pause the trial immediately if:

- The participant is asked for a photo, camera permission, real name, contact information, health information, sensitive identity information, or biometric information.
- The prototype appears to upload data, call a backend, call analytics, or call external AI/CV/recommendation APIs.
- The participant believes the trial is a production release or public app.
- The operator needs to store real participant records in `project-state`.

## Boundary

The operations pack is local documentation and administrator UI only. It does not add backend forms, database tables, accounts, analytics, camera capture, AR, AI analysis, OpenAI API usage, external API usage, training, production release, online publication, App Store/TestFlight work, or real user data storage.

`UserAppTemplatePackage` remains the consumption contract and is not mutated by trial operations, observation notes, outcome review, shell sessions, preferences, recommendations, readiness reports, or administrator panels.
