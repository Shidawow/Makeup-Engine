# App Technology Route Decision

Phase 8A selects the technology route for the future user-facing makeup guidance MVP. This is a product and ownership decision only. It does not implement a production app, create a backend, add dependencies, request camera permissions, add AR, call OpenAI or external APIs, train models, or bootstrap a separate repository.

## Decision

Use a React Web / PWA MVP route first.

The future user-facing app should begin as a mobile-first web/PWA experience that consumes `UserAppTemplatePackage` exports from Makeup Engine. React Native, Flutter, iOS native SwiftUI, backend services, real camera/photo intake, AR, and app store release work remain deferred until the PWA validates the product flow and a later explicit phase gate approves expansion.

## Why This Route Fits Now

- Makeup Engine already has React/Vite UI infrastructure and a local contract-driven User App MVP Shell.
- `UserAppTemplatePackage` already carries the app-facing contract for templates, steps, region instructions, tools, products, warnings, duration, difficulty, and lineage.
- Phase 7A through 7H already proved local web rendering, step guidance, discovery, preferences, session recovery, readiness, mobile QA, browser smoke, Chinese copy, and privacy boundaries.
- Phase 8B added local mobile web polish, lightweight PWA metadata, PWA readiness, MVP polish readiness, and admin QA separation without production runtime expansion.
- A PWA can test real user guidance flow and mobile layout without adding native toolchains, app store processes, camera permissions, AR runtimes, accounts, backend storage, analytics, or paid infrastructure.

## Route Comparison

| Route | Dev Speed | Reuse From Makeup Engine | Fit For Current MVP | Mobile UX | Future Camera / AR Expansion | App Store Cost | Backend Dependency | Risk | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| React Web / PWA | Fast | Highest. Can reuse contract shape, React patterns, copy, and shell learnings. | Strong fit for template discovery, detail, step guidance, preferences, and local progress. | Good for mobile web if Phase 8B polishes responsive/touch flows. | Possible later through browser APIs or native wrapper, but not required now. | Low. No app store gate for MVP trial. | None required for V1. | Lowest, because it validates product value before platform expansion. | Strongly recommended for MVP first. |
| React Native | Medium | Moderate. Product logic can be ported, but UI/runtime diverge. | Useful after PWA proves native-level needs. | Strong mobile UX, native gestures possible. | Better path for future camera/native integrations. | Medium to high due to native build and store process. | None required by default, but production workflows often add services. | Medium. Adds platform complexity before product validation. | Defer until after PWA validation. |
| Flutter | Medium | Lower. Requires a separate UI stack and contract adapter work. | Possible, but not aligned with existing React shell evidence. | Strong mobile UX across platforms. | Good through plugins, but adds plugin/runtime review. | Medium to high. | None required by default. | Medium-high due to stack switch and duplicated product learning. | Defer. |
| iOS Native SwiftUI | Slowest for cross-platform learning | Lowest. Contract can be consumed, but UI and tooling are new. | Too narrow for first MVP unless iOS-only launch is mandated. | Excellent iOS UX. | Strong for future camera/ARKit work. | Highest due to Apple developer, review, signing, TestFlight/App Store flow. | None required by default. | High. Commits to native surface before product proof. | Defer until native requirements are explicit. |
| Web MVP first, then native decision | Fast initial path | High now, with controlled later split. | Best sequencing for product learning. | Good now, can improve or go native later. | Keeps options open after usage and privacy needs are known. | Low now, later cost only if justified. | None now. | Low-medium. Requires discipline not to overbuild inside Makeup Engine. | Recommended sequencing. |
| Later split repo / package route | Medium later | High if `UserAppTemplatePackage` remains stable. | Correct ownership boundary once MVP scope is ready. | Depends on chosen app stack. | Clean place for future camera, AR, backend, native, analytics, and release work. | Depends on stack. | Optional and gated. | Low if delayed until scope is clear; high if started too early. | Plan after PWA scope validation, not in 8A. |

## Selected Technology Route

The selected route is:

```text
Makeup Engine
-> UserAppTemplatePackage export
-> React Web / PWA MVP
-> Product validation
-> Later native / backend / camera / AR decision if explicitly approved
```

## Deferred Routes

The following are not approved by Phase 8A:

- React Native implementation.
- Flutter implementation.
- iOS native SwiftUI implementation.
- Backend, database, accounts, cloud sync, analytics, or payment infrastructure.
- Real photo upload, camera capture, face analysis, AR overlay, or MediaPipe/OpenAI/external API use in the user app.
- App Store, TestFlight, production release, or separate repository bootstrap.

## Future Split Repo Direction

After a PWA MVP is validated, the future user-facing app can move to a separate repository or package boundary. That repository should consume stable `UserAppTemplatePackage` exports and should not mutate Makeup Engine production state.

The split should be approved by a future phase gate that defines repository ownership, package handoff format, privacy policy, release process, storage boundary, and whether native, backend, camera, AR, analytics, or paid features are in scope.

## Phase 8B Result

Phase 8B completed local PWA/mobile shell polish only. It did not change the selected route, did not bootstrap a production app repository, and did not approve service worker, offline cache, backend, analytics, camera, AR, native app, OpenAI/external API, ecommerce, community, paid, training, online publication, or app store release work.
