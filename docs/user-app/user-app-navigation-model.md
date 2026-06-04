# User App Navigation Model

Phase 7A uses a small deterministic local navigation model in `src/user-app/userAppNavigation.ts`.

## Screens

- `home`
- `template-list`
- `template-detail`
- `step-guide`
- `tools`
- `compatibility`

## Rules

- Navigation is local state only.
- It does not use a production router.
- It does not create deep links.
- It does not require login.
- It does not call a backend.
- It does not persist object URLs, local absolute paths, large image bytes, or React state into durable exports.

## Step Guide Guard

`navigateToStepGuide` accepts `canEnterStepGuide`.

If the package or selected template is blocked by compatibility validation, the navigation model redirects to `compatibility` instead of entering `step-guide`.
