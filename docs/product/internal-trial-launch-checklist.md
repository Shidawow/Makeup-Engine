# Internal Trial Launch Checklist

Use this checklist only after Phase 8E returns `go_for_internal_trial` or `go_with_warnings`.

This checklist prepares an internal small-scope trial. It is not production launch, online growth, App Store/TestFlight, backend rollout, analytics rollout, camera rollout, AR rollout, or model training.

## Before Trial

- Confirm Phase 8E MVP release readiness is not `blocked`.
- Confirm go/no-go is not `no_go`.
- Confirm the trial-ready template set has at least one beginner-friendly, short-duration, natural/daily template.
- Confirm warning or backup templates are clearly marked.
- Confirm privacy copy says local-only, no upload, no training, no photos, no camera, no AR, and no backend.
- Confirm participants are told not to provide real names, contact information, photos, health information, sensitive identity information, or biometric information.

## Participant Preparation

- Explain that the shell is a prototype.
- Explain that the trial is about understanding, willingness to follow, and perceived template value.
- Explain that feedback is local/documented structure, not a backend form.
- Ask participants to avoid entering identifying or sensitive information.

## Device Preparation

- Use mobile web/PWA shell evidence only.
- Do not install a native app.
- Do not request camera permission.
- Do not enable file upload, image preview, AR, analytics, service worker, offline cache, push notification, background sync, or install tracking.

## Trial Task Preparation

- Open the shell.
- Browse the current recommendation.
- Select a template.
- Read template detail.
- Start guidance.
- Complete at least three steps.
- View tools/products.
- View region guidance.
- Set or skip local preferences.
- Read privacy notice.
- Restore local progress after exit.

## Feedback Preparation

- Use the Phase 8C feedback questions.
- Do not collect real names, contact information, photos, health information, sensitive identity information, face embeddings, biometric identifiers, backend records, analytics records, or training data.
- Treat any pasted sensitive information as unsafe and remove it from notes.

## After Trial

- Summarize whether users understood the flow.
- Summarize whether users were willing to follow the guidance.
- Summarize whether template recommendations felt useful.
- Summarize whether privacy copy was clear.
- Record blockers and warning themes without real user records.
- Do not write real participant records into `project-state`.
