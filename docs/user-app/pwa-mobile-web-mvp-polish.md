# PWA / Mobile Web MVP Polish

Phase 8B polishes the local User App Shell so it behaves more like a mobile-first PWA MVP preview while remaining inside Makeup Engine as a local contract-driven prototype.

## What Changed

- The shell now opens with a mobile user path: current recommendation, start guidance, browse templates, and privacy entry.
- Ordinary user copy uses Chinese product language such as 妆容、跟练、本地进度、隐私说明.
- Admin QA surfaces are grouped under 管理员检查, including PWA readiness, MVP polish readiness, app readiness, mobile QA, and interaction checklist.
- Step guidance keeps touch-friendly 上一步、下一步、标记完成、跳过 actions.
- Tools, products, region instructions, local session, preferences, privacy, blocked states, and placeholder copy remain visible on narrow layouts.

## PWA Boundary

8B adds a lightweight manifest and metadata skeleton only:

- `public/manifest.webmanifest`
- `public/pwa-icon.svg`
- `theme-color` and manifest link in `index.html`
- `src/user-app/userAppPwaReadiness.ts`
- `src/components/user-app/UserAppPwaInstallPanel.tsx`

8B does not add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, database, account system, camera, AR, OpenAI API, external API, model training, native app work, online publication, or app store release work.

## MVP Polish Readiness

`src/user-app/userAppMvpPolish.ts` checks:

- mobile home readiness
- step guide readiness
- PWA manifest readiness
- privacy copy readiness
- ordinary user copy readiness
- admin QA separation readiness
- local-only boundary readiness

The report is deterministic and local-only. It cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, store user photos, or create training input.

## User Copy Rule

Ordinary user path should not expose technical terms such as contract, schema, readiness gate, or package as feature language. Those details can remain in 管理员检查 panels for QA and recovery.

Privacy copy must continue to say the shell is local-only, does not upload photos, and does not use user photos, preferences, sessions, or recommendations for training.

## Current Limitations

The shell is still not a production user app. It is not deployed, not install-tracked, not offline-capable, and not approved for app store, native iOS, React Native, Flutter, backend, camera, AR, account, analytics, ecommerce, community, paid, OpenAI API, external API, or training scope.
