# Compact Handoff Skill

Use this skill by default for chat, prompt, and provider switch work.

## Default Format

- Prefer compact prompts.
- Prefer compact completion reports.
- Put detailed implementation notes in phase docs.
- Put stable project context in repository documents, not chat history.

## Do Not Paste

- full historical chat
- full directory trees
- `node_modules`
- `dist`
- `.test-dist`
- `.vite`

## What To Cite Instead

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/status/NEXT_ACTION.md`
- `project-state/*.json`
- `docs/phases/phase-xxx.md`

## When To Use Compact / Medium / Full

- compact prompt: small fixes, test fixes, documentation sync, project-state updates, provider handoff refreshes
- medium prompt: normal phase work with limited scope
- full prompt: architecture restructuring, large cross-module work, PackyAPI-heavy tasks, or failure correction that needs full context

## Upgrade Rules

Use medium or full prompt only when:

- the task spans multiple major subsystems
- the task needs a long schema or contract description that cannot fit compactly
- the owner explicitly asks for a full prompt
- a failure requires additional context that cannot be represented safely in compact form

## Reporting Rule

Chat should report the summary only.

Detailed implementation notes belong in repository docs.

Token optimization reduces repeated background only. It does not reduce task goals, tests, guardrails, or documentation requirements.
