# Makeup Engine Vs User App Boundary

Phase 8A separates Makeup Engine ownership from the future user-facing app. This boundary protects the template production system while allowing a future mobile-first web/PWA MVP to consume exported contract data.

## Core Boundary

```text
Makeup Engine
-> Template production
-> Template publish package
-> UserAppTemplatePackage export
-> Future User App consumes the export read-only
```

Makeup Engine remains the system of record for template production. The future User App is a consumer, not a producer of Makeup Engine state.

## Makeup Engine Owns

- Source image import.
- Explicit artifact binding.
- Vision Analysis input preparation.
- Mask correction and human review.
- Template evidence.
- Template production batches.
- Template library entries.
- Template publish packages.
- `UserAppTemplatePackage` exports.
- `UserAppConsumptionManifest` exports.
- Local prototype contract consumer validation.
- Local User App MVP Shell prototype and QA evidence.
- Documentation and project-state handoff for app route planning.

## Current User App Shell Status

UserAppShell is a local prototype mounted inside Makeup Engine. It proves the contract can support app-facing flows, but it is not the production app.

The shell can preview:

- template discovery
- template detail
- step guidance
- region instructions
- tools and products
- local onboarding
- local preferences
- local session progress
- readiness and mobile QA
- PWA install-readiness placeholder
- MVP polish readiness
- privacy copy
- disabled future photo/camera/AR placeholders
- internal / small-scope trial pack tasks
- privacy-safe feedback form preview
- trial readiness checks
- MVP release readiness gate
- trial go/no-go decision

It cannot become backend state, app store release state, analytics, camera capture, AR state, OpenAI API use, external API use, training input, or durable user records.

Phase 8B adds only local shell polish and lightweight PWA metadata. The shell still cannot become the future production User App, a deployment target, service worker runtime, offline cache, analytics surface, backend client, install-tracking surface, camera/AR surface, native app, or release approval system.

Phase 8C adds only local trial pack, feedback preview, and trial readiness administrator surfaces. These surfaces are not backend forms, analytics, production trial records, App Store/TestFlight, online release approval, or real user data collection systems.

Phase 8E adds only local MVP release readiness and go/no-go administrator surfaces. These surfaces can decide internal trial preparation, but they are not production release approval, backend readiness, analytics readiness, camera readiness, AR readiness, App Store/TestFlight, online release approval, or real user data collection systems.

## UserAppTemplatePackage Owns The Contract

UserAppTemplatePackage is the stable handoff contract. It carries app-facing templates, ordered steps, region instructions, tools, products, style tags, duration, difficulty, compatibility, warnings, and lineage.

The future User App must consume this package read-only. It must not mutate the package or write app state back into Makeup Engine.

## SourceImagePackage Boundary

SourceImagePackage cannot directly enter the User App.

It cannot directly become:

- a `TemplateLibraryEntry`
- a `TemplatePublishPackage`
- a `UserAppTemplatePackage`
- User App Shell state
- user photo intake state
- training data
- a future user-facing app asset

Source images must pass through explicit artifact binding, analysis, correction, evidence, review, library, publish package, and app contract validation before user-facing guidance can consume the result.

## Future User App Owns

After a later explicit phase gate, a future user-facing app can own:

- PWA/mobile web runtime.
- Production routing.
- User-facing navigation and UI shell.
- Local app state and persistence rules.
- Release process.
- Separate repository or package setup.
- Future camera/photo, AR, backend, account, analytics, ecommerce, payment, community, native, or App Store work only if those scopes are explicitly approved.

## Not Approved In Phase 8A

Phase 8A does not approve:

- production user app implementation
- separate repository bootstrap
- backend or database
- login or accounts
- cloud sync
- analytics
- real camera or photo capture
- AR
- native iOS, React Native, or Flutter implementation
- OpenAI API or external API calls
- ecommerce, community, paid features, or model training
