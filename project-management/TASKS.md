# Task Graph

## Operating Workflow

Every task must follow one of:

- `feature`
- `bugfix`
- `review`
- `autonomous-dev-loop`

See `project-management/workflows`.

## Current Milestone: Engine Core Integration

- [x] Audit engine/intelligence/compiler/runtime boundaries.
- [x] Add project management documents.
- [x] Add test harness.
- [x] Add compiler snapshot tests.
- [x] Add runtime integration tests.
- [x] Add engine pipeline full-flow tests.
- [x] Add architecture guard tests.
- [x] Fix test failures.
- [x] Run build and typecheck.
- [x] Review engine boundaries.
- [x] Establish self-driving project-management workspace.
- [x] Add agent registry.
- [x] Add workflow registry.
- [x] Add standards registry.
- [x] Add reusable Codex prompts.
- [x] Add technical debt register.

## Backlog

| ID | Owner | Workflow | Task | Status |
| --- | --- | --- | --- | --- |
| RENDER-001 | Renderer Agent | feature | Define layer blending model | todo |
| RUNTIME-001 | Runtime Agent | feature | Add runtime benchmark harness | todo |
| ENGINE-001 | Architect Agent | feature | Integrate executor trace into `MakeupEngine` | todo |
| INTEL-001 | Intelligence Agent | feature | Add recommendation conflict resolution | todo |
| QA-001 | QA Agent | feature | Add test coverage report format | todo |
| REVIEW-001 | Review Agent | review | Add architecture review checklist automation | todo |
| MVP-001 | Architect Agent | feature | Finalize engine contracts for MVP | done |
| MVP-002 | Intelligence Agent | feature | Harden rule engine and style inference | done |
| MVP-003 | Runtime Agent | feature | Improve pipeline orchestration traceability | todo |
| MVP-004 | Compiler Agent | feature | Keep render instruction snapshot stable | done |
| MVP-005 | QA Agent | feature | Expand Vitest coverage for all core modules | done |
| MVP-006 | Frontend Engineer | feature | Add local upload-driven MVP demo screen | done |
| MVP-007 | Runtime Agent | feature | Connect demo UI to local engine pipeline | done |

## Next Autonomous Tasks

- [ ] Add renderer layer blending model tests.
- [ ] Add benchmark harness for runtime/compiler execution.
- [ ] Add pipeline executor trace integration to `MakeupEngine`.
- [ ] Add style preset influence to `buildMakeupPlan`.
- [ ] Add conflict resolution for intelligence recommendations.
- [ ] Align all shared contracts with MVP pipeline.
- [ ] Keep architecture.md synchronized with engine changes.

## Dependencies

```text
contracts
  -> stages
  -> compiler render instructions
  -> runtime interface
  -> orchestrator
  -> tests
  -> review
```
