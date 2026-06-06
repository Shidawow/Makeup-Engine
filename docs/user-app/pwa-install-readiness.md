# PWA Install Readiness

Phase 8B adds install-readiness placeholders for the local mobile web MVP shell. This is a readiness skeleton, not a production PWA release.

## Included

- Web app manifest at `public/manifest.webmanifest`.
- Lightweight SVG icon placeholder at `public/pwa-icon.svg`.
- HTML `theme-color`, manifest link, icon link, and description metadata.
- Deterministic readiness model in `src/user-app/userAppPwaReadiness.ts`.
- Admin QA panel in `src/components/user-app/UserAppPwaInstallPanel.tsx`.

## Required Checks

- Manifest exists and is linked.
- App name and short name exist.
- Theme color exists in manifest and HTML metadata.
- Display mode is `standalone`.
- Icon placeholder is lightweight.
- Service worker is absent unless a future phase explicitly approves it.
- Offline cache, push notification, background sync, backend, analytics, and install tracking are absent.
- Local-only privacy boundary remains visible.

## Not Included

- No service worker.
- No offline cache.
- No push notification.
- No background sync.
- No install tracking.
- No analytics.
- No backend, database, login, account, or cloud sync.
- No real camera/photo capture, upload, image preview, face analysis, AR, or biometric state.
- No OpenAI API, external API, model training, ecommerce, community, paid, native app, app store, or online publication.

## Acceptance

PWA install readiness can be considered ready for Phase 8B when `createUserAppPwaReadinessReport()` returns `ready`, scoped tests pass, and the shell still preserves the no-backend, no-camera, no-AR, no-training, no-analytics, no-service-worker boundary.
