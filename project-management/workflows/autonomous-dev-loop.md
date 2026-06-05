# Autonomous Dev Loop

## Purpose

Keep the workspace moving without waiting for repeated user prompts.

## Loop

```text
analyze
→ plan
→ test
→ implement
→ test
→ fix
→ lint/typecheck/build
→ review
→ document
→ next task
```

## Rules

- Do not stop after one successful task if the roadmap has more ready work.
- Always update task status.
- Always record technical debt.
- Always close the loop with verification.
