# User App Product Route Decision

Phase 8A decides the future user app route without implementing the production app.

Canonical Phase 8A route planning docs:

- `docs/app-roadmap/app-technology-route-decision.md`
- `docs/app-roadmap/user-app-mvp-plan.md`
- `docs/app-roadmap/makeup-engine-vs-user-app-boundary.md`
- `docs/app-roadmap/phase-8-roadmap.md`
- `docs/product/user-app-v1-non-goals.md`

## Decision

The selected route is React Web / PWA MVP first.

The future user-facing MVP should be mobile-first and should consume `UserAppTemplatePackage` exports from Makeup Engine. Makeup Engine remains the template production system, local contract validation surface, and prototype shell workbench.

Future production user app work should be planned as a separate app surface or repository after a later explicit phase gate.

## Ownership Boundary

Makeup Engine owns:

- Source image import, explicit artifact binding, Vision Analysis, mask correction, evidence, review, template library, publish package, and `UserAppTemplatePackage` export.
- Local `UserAppTemplatePackage` prototype consumption and local User App MVP Shell validation.
- Phase 7H browser/mobile QA evidence for the local prototype shell.
- Phase 8A route planning documents and handoff metadata.

The future user-facing app owns, after a later explicit phase gate:

- PWA/mobile web runtime and production app shell.
- Production routing, deployment, release, and app UX.
- Any backend, accounts, analytics, camera/photo capture, AR, native iOS, React Native, Flutter, ecommerce, community, paid, or online publication work that the owner explicitly approves later.

## Selected Route

React Web / PWA is the least-expansive next route because:

- `UserAppTemplatePackage` already expresses app-facing templates, steps, regions, tools, products, compatibility, readiness, and lineage.
- Phase 7A through 7H already prove a local React shell can render guidance, discovery, preferences, sessions, readiness, mobile QA, and browser/mobile smoke boundaries.
- A PWA can validate template discovery, template detail, step-by-step guidance, region instructions, tools/products, local onboarding, local preferences, local session progress, privacy notice, and photo/camera/AR placeholders without forcing native iOS, React Native, Flutter, backend, camera, AR, analytics, accounts, or online publication before their gates are approved.

Native iOS, React Native, Flutter, backend, camera, AR, OpenAI API, external APIs, ecommerce, community, paid features, and model training remain deferred.

## Accepted Phase 7H Evidence

Phase 8A accepts Phase 7H as sufficient for route planning:

- Local browser/mobile QA harness exists.
- HTTP smoke, critical copy, privacy copy, Chinese copy, and forbidden-token checks are defined.
- Mobile readiness covers `375`, `390`, `414`, and `768` width profiles.
- The shell remains local-only and contract-driven.
- Browser/mobile QA is not production release approval and does not replace future real device, pointer, screenshot, performance, or accessibility testing.

## Explicit Non-Goals

Phase 8A does not add:

- Production user app code.
- A separate app repository bootstrap.
- Backend, database, accounts, cloud sync, analytics, or online publication.
- Real camera capture, file upload, user photo collection, face analysis, AR, or native iOS implementation.
- React Native or Flutter implementation.
- OpenAI API calls, external API calls, ecommerce, community, paid features, training, new model artifacts, or new runtime dependencies.

## Next Step

Proceed to Phase 8B: PWA / Mobile Web MVP Polish.

8B should polish the PWA/mobile web MVP brief, UX acceptance criteria, package consumption expectations, and trial-readiness checklist. It should still avoid production implementation unless a future phase gate explicitly authorizes it.
