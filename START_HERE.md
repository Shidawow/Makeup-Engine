# Start Here

Makeup Engine is the makeup template production system for a future makeup coaching app. It is not the production user-facing app, not a backend service, and not an online publishing system.

## Current Position

- Project role: makeup template production system plus a local contract-driven user app shell prototype.
- Last completed phase: `Phase 7H`.
- Current completed business phase: `Phase 7H - Browser / Mobile E2E Interaction QA`.
- Next recommended phase: `Phase 8A - Product Route Decision / App MVP Planning`.
- Recent recovery milestones retained in phase docs: `Phase 6K`, `Phase 6L`, `Phase 6L-1`, `Phase 7A`, `Phase 7B`, `Phase 7C`, `Phase 7D`, `Phase 7E`, `Phase 7F`, `Phase 7G`, and `Phase 7H`.

## Current Core Capability

```text
SourceImagePackage manifest
-> SourceImageEntry
-> operator explicitly binds normalized PNG / json-rgba artifact
-> BrowserArtifactResource
-> TemplateAnalysisSeed ready_for_vision_analysis
-> Vision Analysis
-> Mask Editing
-> Human Correction
-> Template Evidence
-> Template Review
-> Template Library Entry
-> Publish Package
-> UserAppTemplatePackage
-> Prototype Contract Consumer
-> User App MVP Shell
-> Step Guidance UX Hardening
-> User Photo Intake Placeholder / Personalization Boundary
-> User App Local Preferences / Onboarding
-> User App Template Discovery / Recommendation Placeholder
-> User App Session Persistence / Local State Hardening
-> User App Mobile QA / App Readiness Gate
-> Browser / Mobile QA Harness
-> Consumption Manifest
-> Dataset Review
-> Materialized Training Dataset
```

`SourceImagePackage` can enter Vision Analysis only through explicit operator artifact binding. It still cannot become a training dataset directly, and it still cannot skip review, package validation, app contract validation, or quality gates to become a library entry, publish package, user app contract, shell state, or QA state.

## Must Read First

1. `docs/status/CURRENT_PROJECT_STATUS.md`
2. `docs/status/NEXT_ACTION.md`
3. `docs/prompts/MASTER_CODEX_CONTEXT.md`
4. `docs/prompts/PROVIDER_SWITCH_PROMPT.md`
5. `docs/user-app/user-app-browser-mobile-qa.md`
6. `docs/user-app/user-app-e2e-readiness.md`
7. `docs/user-app/user-app-mobile-interaction-qa.md`
8. `docs/user-app/user-app-readiness-gate.md`
9. `docs/user-app/user-app-readiness-checklist.md`
10. `docs/privacy/user-app-session-data-boundary.md`
11. `docs/phases/phase-7H.md`
12. `project-state/project-state.snapshot.json`
13. `project-state/provider-handoff.json`
14. `project-state/latest-handoff.json`
15. `project-state/active-task.json`

## What The System Can Do Now

- Produce and review template production artifacts through the local Makeup Engine pipeline.
- Export local publish packages and `UserAppTemplatePackage` contract data.
- Render a local User App MVP Shell from `UserAppTemplatePackage`.
- Show Chinese-facing user shell copy for template guidance, discovery, readiness, mobile QA, interaction checklist, local state, preferences, personalization placeholder, and privacy notice.
- Store and recover local-only shell session state after sanitization.
- Generate readiness reports for package validity, guidance, onboarding, preferences, discovery, session, privacy, mobile interaction, empty state, and blocked state.
- Generate mobile QA reports for `375`, `390`, `414`, and `768` width viewport profiles.
- Run local browser/mobile QA through `npm run user-app:browser-qa`, including HTTP smoke, critical copy, privacy copy, Chinese copy, and forbidden-token checks.
- Continue from Vision Analysis into mask editing, evidence capture, dataset review, materialized training datasets, and lightweight model artifact workflows.

## What The System Must Not Do

- Do not treat the local User App Shell as the production user app.
- Do not add backend, database, accounts, cloud sync, analytics, real camera capture, AR, OpenAI/external API calls, training from user state, native iOS implementation, or online publication without a future explicit phase gate.
- Do not collect, upload, analyze, store, export, or train on real user photos.
- Do not persist object URLs, local absolute paths, image bytes, base64 image data, biometrics, sensitive profile data, React state, recommendation records, readiness records, browser QA records, or training input in durable exports or `project-state`.
- Do not let preferences, recommendations, session recovery, readiness, mobile QA, or browser QA mutate `UserAppTemplatePackage`.
- Do not route new mainline work through `src/engine`, `src/runtime`, or `src/intelligence/runtime`.

## Validation Commands

Run these whenever you restore or update project state:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

For Phase 7H browser/mobile QA also run:

```bash
npm run user-app:browser-qa -- --json
```

## Source Of Truth

Project state comes from repository documents and `project-state/*.json`, not from chat memory.

Root `AGENTS.md` is the concise agent entry point. Project skills are indexed in `project-state/skills.json`; external skill candidates and approvals are indexed in `project-state/external-skills-registry.json`.
