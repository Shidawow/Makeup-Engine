# Test And Build Runbook

## Standard Commands

```bash
npm run typecheck
npm run test
npm run build
```

## Status Commands

```bash
npm run project:status
npm run project:status -- --json
```

If npm argument forwarding is unavailable, run:

```bash
node scripts/project-status.mjs --json
```

## Windows EPERM Notes

On Windows, file locks can cause `EPERM` during build, cleanup, or test artifact writes when a dev server, editor process, antivirus scanner, or previous Node process still holds a file.

Facts to check:

- Stop running dev servers before rebuilding.
- Close processes that may hold files under `dist`, `.test-dist`, or `tmp`.
- Retry after confirming no stale Node process is writing the same path.
- Use escalated execution only when the command genuinely requires permissions outside the sandbox or normal user write scope.
