# Phase 8A - Product Route Decision / App MVP Planning

## Goal

Decide the future user app technology route and repository ownership boundary before any production app work begins.

## Completed Scope

- Selected React Web / PWA MVP first as the next user app route.
- Selected React Web / PWA MVP first as the technology route.
- Documented the future MVP scope, V1 non-goals, Makeup Engine versus User App ownership boundary, and Phase 8 roadmap.
- Decided that future production user app work should be planned as a separate app surface or repository after an explicit phase gate.
- Kept Makeup Engine ownership limited to template production, package export, local contract prototype validation, and route handoff documents.
- Kept `UserAppTemplatePackage` as the handoff contract between Makeup Engine and the future user app.
- Accepted Phase 7H local browser/mobile QA as sufficient evidence to start app MVP planning, while explicitly keeping it out of production release approval.
- Deferred native iOS, cross-platform shell implementation, backend, accounts, analytics, real camera/photo capture, AR, OpenAI/external APIs, training, online publication, and new runtime dependencies.

## Route Decision

The future user app should begin as a React Web / PWA MVP planning track.

The React Web / PWA route is the least-expansive next step because the existing `UserAppTemplatePackage` contract and local shell already cover template selection, detail, step guidance, local preferences, discovery, session recovery, readiness, mobile QA, and browser/mobile smoke boundaries.

The canonical Phase 8A route docs are:

- `docs/app-roadmap/app-technology-route-decision.md`
- `docs/app-roadmap/user-app-mvp-plan.md`
- `docs/app-roadmap/makeup-engine-vs-user-app-boundary.md`
- `docs/app-roadmap/phase-8-roadmap.md`
- `docs/product/user-app-v1-non-goals.md`

## Ownership Boundary

Makeup Engine remains:

- The makeup template production system.
- The package and consumption-contract exporter.
- The local contract-driven prototype and QA workbench.
- The source of route planning and handoff documentation until a future app repository exists.

The future user-facing app should own:

- Production app routing, runtime, release, and deployment.
- Any real camera/photo, AR, backend, account, analytics, native iOS, cross-platform, or online publishing scope approved by future gates.

## Boundaries

Phase 8A does not add:

- Production app implementation.
- Backend, database, account system, cloud sync, analytics, or online publication.
- Real camera capture, file upload, user photo collection, face analysis, AR, or native iOS implementation.
- OpenAI API calls, external API calls, training, model artifacts, or new runtime dependencies.
- Ecommerce, community, paid features, or app store release work.
- Any mutation path from route planning, browser/mobile QA, readiness, sessions, preferences, recommendations, or shell state back into `UserAppTemplatePackage`.

## Validation

Required validation:

```bash
npm run typecheck
npm run test
npm run build
npm run project:status
npm run project:context
node scripts/project-status.mjs --json
node scripts/context-pack.mjs --json
```

`npm run user-app:browser-qa -- --json` remains a Phase 7H browser/mobile smoke command. It is useful before production app work, but Phase 8A itself is docs/project-state route planning and does not require browser runtime expansion.

## Next

Proceed to Phase 8B: PWA / Mobile Web MVP Polish.

8B should polish the mobile-first PWA MVP brief, UX acceptance criteria, package consumption expectations, and trial-readiness checklist without implementing the production app.
