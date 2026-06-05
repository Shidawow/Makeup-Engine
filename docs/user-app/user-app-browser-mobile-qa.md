# User App Browser / Mobile QA

Phase 7H adds a local browser/mobile QA harness for the contract-driven User App MVP Shell.

The harness validates the prototype shell without turning Makeup Engine into the production user app. It checks that the shell can load locally, expose critical user paths, keep user-visible copy readable in Chinese, and preserve the privacy boundary around photos and personal data.

## Scope

Covered:

- HTTP smoke for the local Vite shell.
- Critical shell copy and navigation labels.
- Mobile viewport readiness for `375`, `390`, `414`, and `768` widths.
- Readiness, mobile QA, and interaction checklist entry points.
- Empty, warning, blocked, and recovery states through deterministic DOM/SSR-style tests.
- Privacy copy and forbidden-token checks.

Not covered:

- Production user app release approval.
- Native iOS QA.
- Browser camera, file upload, AR, backend, cloud sync, analytics, account, or database behavior.
- Playwright pointer/canvas/screenshot automation.
- Real device lab, performance lab, or accessibility certification.

## Script

Run:

```bash
npm run user-app:browser-qa -- --json
```

The script starts a local Vite dev server, requests the shell over HTTP, and performs deterministic source/copy checks. Use `--skip-server` only when a server is already available or when validating source copy without starting Vite.

## Privacy Boundary

The harness must not collect or persist real user photos. It checks the shell surface for forbidden runtime and training tokens such as photo bytes, image bytes, temporary image URLs, encoded image payloads, local paths, biometrics, and training markers.

Privacy copy should be user-readable. It should explain the boundary in Chinese without exposing raw internal storage field names in the visible UI.

## Recovery Notes

Phase 7H is still local deterministic QA. If future work needs real browser pointer or screenshot coverage, add a targeted 7H-1 or start a Playwright-specific phase after route planning.
