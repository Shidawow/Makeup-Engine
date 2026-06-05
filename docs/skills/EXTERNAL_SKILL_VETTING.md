# External Skill Vetting

External skills can improve repeated project work, but they are never allowed to replace Makeup Engine guardrails. This document defines how a Codex, PackyAPI, or native GPT session may propose, review, and use an external skill.

## Why Use External Skills

External skills may help with:

- consistent review of repeated UI, test, documentation, and handoff work
- shorter prompts by moving stable instructions into reusable skill documents
- better test review, accessibility review, schema review, and supply-chain review discipline
- more reliable provider switching when the skill is listed in machine-readable project state

## Risks

External skills can also create project risk:

- incorrect boundaries or assumptions that conflict with Makeup Engine architecture
- stale dependency guidance
- unnecessary scripts or hidden file operations
- accidental production dependency installation
- external API calls that the current phase does not allow
- changes that weaken project guardrails, review gates, or project-state recovery
- edits to frozen legacy runtime areas

## Default Policy

- External skills default to `instruction-only`.
- External skills default to `explicit-only` invocation.
- Skills with scripts must be manually reviewed before use.
- `scriptsAllowed` defaults to `false`.
- Candidate skills cannot be invoked implicitly.
- Approved skills can be used only within their recorded scope.
- External skills must not override repository guardrails, AGENTS.md, or `project-state/guardrails.json`.

## Hard Prohibitions

External skills must not:

- automatically install production dependencies
- call external APIs unless the active phase explicitly allows that API
- modify `src/engine`, `src/runtime`, or `src/intelligence/runtime`
- bypass artifact binding, mask correction, evidence, review, package validation, app contract validation, dataset review, or quality gates
- bypass `project-state` and documentation recovery updates
- persist object URLs, local absolute paths, large image bytes, or React state into durable exports
- turn `SourceImagePackage` directly into a training dataset, library entry, publish package, app contract, or prototype consumer model

## Required Registry Record

Before an external skill is used, record it in `project-state/external-skills-registry.json` with:

- source and source type
- purpose and applicable phases
- allowed invocation mode
- instruction-only and script policy
- allowed scope and forbidden scope
- required review notes
- approval status and reviewer, if approved
- related guardrails

## Review Checklist

Before use:

1. Confirm the skill is present in `project-state/external-skills-registry.json`.
2. Confirm `status` is `approved`, or that a `candidate` skill is invoked explicitly by the task.
3. Confirm the skill is instruction-only, or manually review every script it contains.
4. Confirm it does not require new production dependencies.
5. Confirm it does not call external APIs unless the current phase permits them.
6. Confirm it does not conflict with AGENTS.md, project skills, or guardrails.
7. Confirm it applies to the current task and is not listed in `doNotUseFor`.

After use:

1. Run `npm run typecheck`.
2. Run `npm run test`.
3. Run `npm run build`.
4. Run `npm run project:status`.
5. Run `npm run project:context`.
6. Update provider handoff notes if the skill affected workflow or review state.

## Failure Handling

If a skill conflicts with project guardrails, stop using it for the task and record the reason in the final report. If a skill would require unapproved dependencies, external APIs, scripts, backend services, or legacy runtime edits, do not use it.
