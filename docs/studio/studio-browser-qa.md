# Studio Browser QA

Phase 5D adds a stable Studio browser-smoke path without introducing Playwright yet.

## Current QA Level

The project does not currently include Playwright. To avoid adding a new browser dependency during Phase 5D, the browser QA coverage is implemented as a DOM-level smoke test:

```text
npm run test:browser
```

This runs:

```text
tests/studio-browser-smoke.test.tsx
```

## Covered Entry Points

The smoke test verifies that the operator path renders:

- Admin Mode
- upload photo
- analyze
- mask editing canvas
- mask editing toolbar
- human correction dataset
- review queue
- training adapter
- offline training package

It also verifies that developer JSON remains hidden in the default admin view.

## Not Covered Yet

The smoke test does not perform real browser pointer painting. It does not upload a real file and does not test canvas pixel output.

## Recommended Playwright Scope

When Playwright is introduced, add a full E2E that covers:

1. open Template Studio
2. default Admin Mode
3. load fixture image/session
4. select region
5. enable editing
6. brush add / erase
7. history updates
8. save correction
9. dataset sample appears
10. review item appears
11. accept item
12. training manifest appears
13. offline package appears
14. validation result is visible
15. export buttons are enabled
