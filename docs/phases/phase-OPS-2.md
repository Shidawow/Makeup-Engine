# Phase OPS-2 - External Skill Vetting & AGENTS.md Integration

## Goal

OPS-2 adds governance for external skill adoption and a concise root `AGENTS.md` entry point. It does not add business behavior, modify Template Studio features, modify vision or training logic, add dependencies, or install external skills.

## Added Entry Point

Root `AGENTS.md` is now the short agent entry for Codex, PackyAPI, native GPT, and similar tools. It points agents to repository source-of-truth files, compact handoff defaults, validation commands, legacy frozen directories, durable export boundaries, and external skill rules.

## External Skill Vetting

External skill governance now lives in:

- `docs/skills/EXTERNAL_SKILL_VETTING.md`
- `docs/skills/EXTERNAL_SKILL_REGISTRY.md`
- `docs/skills/RECOMMENDED_EXTERNAL_SKILLS.md`
- `project-state/external-skills-registry.json`

The default policy is instruction-only, explicit-only, scripts disabled, no production dependency installation, no unapproved external API use, and no override of project guardrails.

## Registry

`project-state/external-skills-registry.json` records five recommended candidate skill categories:

- React UI / Accessibility QA
- TypeScript Contract / Schema Review
- Vitest Deterministic Testing
- Security / Supply Chain Review
- Git / PR Review

All five are candidates only. None are installed. All use `allowedInvocation: explicit-only`, `instructionOnly: true`, and `scriptsAllowed: false`.

## Prompt And Guardrail Updates

`MASTER_CODEX_CONTEXT.md` now explains that agents should read `AGENTS.md` and that external skills are governed by the registry. `PROVIDER_SWITCH_PROMPT.md` now requires provider handoffs to include an `AGENTS.md` summary and external skill registry summary when any external skill is proposed or used.

`TOKEN_BUDGET_AND_COMPACT_HANDOFF.md` now includes compact external skill handoff rules.

`project-state/guardrails.json` now includes external skill guardrails:

- `external_skills_must_be_registered`
- `external_skills_default_explicit_only`
- `external_skills_scripts_disabled_by_default`
- `external_skills_no_production_dependencies_without_approval`
- `external_skills_must_not_override_project_guardrails`
- `root_agents_md_required`

## Validation

OPS-2 added regression coverage for:

- root `AGENTS.md`
- external skill vetting docs
- external skill registry JSON
- guardrail and prompt wiring

Required validation passed:

- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run project:status`
- `npm run project:context`
- `node scripts/project-status.mjs --json`
- `node scripts/context-pack.mjs --json`

Full test count after OPS-2: 294 test files / 377 tests.

## Boundaries Preserved

- No business feature work.
- No Vision pipeline changes.
- No Template Studio behavior changes.
- No schema business field changes.
- No training logic changes.
- No backend or database.
- No OpenAI API calls.
- No external skill installation.
- No changes to legacy `src/engine`, `src/runtime`, or `src/intelligence/runtime`.
