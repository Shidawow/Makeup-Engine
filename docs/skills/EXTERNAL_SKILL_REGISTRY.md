# External Skill Registry

`project-state/external-skills-registry.json` is the machine-readable registry for external skill candidates and approvals. It does not install skills. It records whether a skill may be considered, how it may be invoked, and which guardrails apply.

## Registry Fields

Each external skill record must include:

- `skillId`: stable identifier, lowercase kebab-case
- `name`: human-readable skill name
- `source`: origin of the skill, such as marketplace name, repository path, local file, or proposed source
- `sourceType`: `marketplace`, `repository`, `local`, `vendor`, or `proposal`
- `status`: `candidate`, `approved`, `disabled`, or `rejected`
- `allowedInvocation`: `explicit-only` or `implicit-allowed`
- `instructionOnly`: whether the skill is limited to instructions and documentation
- `scriptsAllowed`: whether scripts bundled with the skill may run
- `appliesTo`: allowed task types
- `doNotUseFor`: forbidden task types or phases
- `requiredReview`: review that must happen before use
- `approvedBy`: reviewer or owner, nullable until approved
- `approvedAt`: approval timestamp, nullable until approved
- `relatedGuardrails`: guardrail ids that constrain the skill
- `notes`: operational notes and limitations

## Status Values

- `candidate`: recorded for possible future use. It cannot be invoked implicitly.
- `approved`: reviewed and allowed within its recorded scope.
- `disabled`: previously considered or approved but currently unavailable or blocked.
- `rejected`: reviewed and not allowed for this project.

## Invocation Modes

- `explicit-only`: the user or phase prompt must name the skill or explicitly request its use.
- `implicit-allowed`: the agent may choose the skill when the task clearly matches. This must be rare and requires approval.

## Default Rules

- New external skills enter as `candidate`.
- Candidate skills cannot be implicitly called.
- Approved status is required before broad use.
- `scriptsAllowed` defaults to `false`.
- `instructionOnly` defaults to `true`.
- `implicit-allowed` must be used cautiously and documented with a reason.
- External skills must never override AGENTS.md, `docs/prompts/MASTER_CODEX_CONTEXT.md`, project skills, or `project-state/guardrails.json`.

## Promotion From Candidate To Approved

To promote a skill:

1. Review the source and license or provenance.
2. Confirm the skill does not require unapproved dependencies.
3. Confirm any scripts are absent or manually reviewed.
4. Confirm it does not call external APIs unless allowed by the phase.
5. Confirm it does not modify frozen legacy runtime directories.
6. Record `approvedBy`, `approvedAt`, and the allowed invocation mode.
7. Run the required validation commands after first use.
