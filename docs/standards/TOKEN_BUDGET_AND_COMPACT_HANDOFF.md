# Token Budget And Compact Handoff

OPS-0 adds token budget rules for ChatGPT, Codex, PackyAPI, and CLI handoff. The goal is to reduce repeated chat context without reducing engineering quality, repository documentation, tests, or guardrails.

## Source Of Truth

Repository files are the source of truth. Chat history is not.

Use these files as the default context anchors:

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/status/NEXT_ACTION.md`
- `project-state/project-state.snapshot.json`
- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`
- `project-state/active-task.json`
- `project-state/test-status.json`
- `project-state/guardrails.json`
- `AGENTS.md`
- `project-state/skills.json`
- `project-state/external-skills-registry.json`

Future prompts should cite these files instead of pasting long repeated background. Every provider must run or receive `npm run project:context` output before continuing.

## What Token Optimization Means

Token optimization is not a reduction in engineering requirements. It means stable context lives in repository documents, and chat becomes incremental instructions.

Allowed compression:

- Compress repeated background.
- Compress chat content.
- Compress execution report summaries.
- Replace repeated DOC-0 / DOC-1 text with references to documentation maintenance standards.

Not allowed:

- Do not compress task goals.
- Do not reduce repository documents.
- Do not reduce phase document detail.
- Do not delete acceptance standards.
- Do not reduce tests.
- Do not weaken guardrails.
- Do not omit `docs/status`, `docs/phases`, or `project-state` updates when a phase requires them.
- Do not treat a compact prompt as a low-quality prompt.

## Directory Paste Rules

Do not paste full repository directory trees in normal prompts or handoffs.

Never paste:

- `node_modules`
- `dist`
- `.test-dist`
- `.vite`

Do not paste generated build output, Vite caches, dependency trees, or full test artifact directories. If a directory shape matters, paste only the relevant file paths or use `rg --files` output filtered to the task boundary.

## Task Modes

The three supported task modes are `compact prompt`, `medium prompt`, and `full prompt`.

### Compact Prompt

Use for:

- small fixes
- small UI changes
- test fixes
- documentation sync
- project-state maintenance
- provider handoff refresh

Compact prompts must still include the current phase, goal, required reads, allowed and forbidden scope, key tasks, validation commands, documentation update requirements, current limitations, next recommendation, and compact report format.

### Medium Prompt

Use for ordinary phases with multiple files or one main feature area.

Medium prompts may summarize background but must preserve:

- full goals
- schema / state machine / contract requirements
- acceptance commands
- test requirements
- documentation and project-state requirements
- guardrails

### Full Prompt

Use for:

- architecture refactors
- new mainline systems
- large PackyAPI tasks
- failure recovery or corrective passes
- phases where a provider does not have reliable repository context

Full prompts are allowed only when needed. If the owner explicitly asks for "完整 prompt" or "full prompt", provide the longer version.

## Compact Codex Reports

Codex completion reports must default to compact format:

1. Added/modified files
2. New rules or behavior
3. Tests and validation
4. Current limitations
5. Next recommendation

Detailed implementation notes belong in `docs/phases/phase-xxx.md`, not in chat. Chat reports should summarize what changed and where to read more.

## Phase Documentation

Every business or ops phase that changes standards, architecture, contracts, or workflow must keep detailed phase documentation in `docs/phases/phase-xxx.md`.

Do not paste DOC-0 / DOC-1 in every new phase prompt. Reference:

- `docs/standards/DOCUMENTATION_MAINTENANCE.md`
- `docs/standards/PHASE_HANDOFF_REQUIREMENTS.md`
- `docs/standards/TOKEN_BUDGET_AND_COMPACT_HANDOFF.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`

## Provider Switch Rules

Provider switch prompts should include compact context:

- `AGENTS.md` summary
- current phase
- goal
- required read files
- allowed and forbidden scope
- key tasks
- validation commands
- `npm run project:context` output or summary
- `project-state/latest-handoff.json` summary
- `project-state/skills.json` summary and relevant project skills
- `project-state/external-skills-registry.json` summary if any external skill is proposed or used

Do not copy full historical chat transcripts. If history matters, summarize decisions and point to repository docs.

## External Skill Token Rules

Do not paste entire external skill repositories or bundled script trees into chat. For external skill review, cite:

- `docs/skills/EXTERNAL_SKILL_VETTING.md`
- `docs/skills/EXTERNAL_SKILL_REGISTRY.md`
- `docs/skills/RECOMMENDED_EXTERNAL_SKILLS.md`
- `project-state/external-skills-registry.json`

External skill handoff should summarize only the relevant `skillId`, source, status, invocation mode, script policy, and guardrails. Candidate skills remain `explicit-only`, instruction-only by default, and scripts-disabled by default.
