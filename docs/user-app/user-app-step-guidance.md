# User App Step Guidance

Phase 7A renders step-by-step guidance from `UserAppTemplatePackage`.

Phase 7B hardens that guidance into user-facing copy, checklists, warning messages, blocked reasons, and next actions.

## Data Source

Guidance comes from `UserAppMakeupStep` records:

- order
- title
- instruction text
- region
- technique
- target effect
- color hint
- intensity
- related tool ids
- related product ids
- estimated seconds
- common mistakes
- correction tips
- evidence references

## Local Progress

`src/user-app/userAppProgress.ts` tracks:

- current step
- completed steps
- skipped steps
- progress percent
- optional timestamps

Progress is local-only. It is not uploaded, not exported as a durable app package, and not used for training.

## Missing Data

If a step is missing required app-facing support, the shell shows compatibility warnings or blocking issues instead of crashing.

If a step region has no matching region instruction, the step guidance surfaces the issue so the contract can be fixed before a real app consumes it.

## Phase 7B Guidance Fields

The hardened guidance view model includes:

- progress label
- step category
- short instruction summary
- detailed instruction
- tool checklist
- product checklist
- region guidance summary
- common mistakes
- correction tips
- warning messages
- blocked reason
- next action

Internal issues are translated into user-facing language. For example, missing region instruction becomes: "This step is missing a concrete application area and cannot start yet."
