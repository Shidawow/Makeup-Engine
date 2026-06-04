# AGENTS.md

Repository-level entry rules for Codex, PackyAPI, native GPT, and other agents working on Makeup Engine.

## Project Role

Makeup Engine is a makeup template production system for a future makeup coaching app. It is not the user-facing app, not a backend service, and not an online publishing system.

## Source Of Truth

Use repository files, not chat memory:

- `START_HERE.md`
- `docs/prompts/MASTER_CODEX_CONTEXT.md`
- `docs/status/NEXT_ACTION.md`
- `project-state/project-state.snapshot.json`
- `project-state/latest-handoff.json`
- `project-state/provider-handoff.json`

## Default Workflow

- Use compact handoff by default.
- Do not paste `node_modules`, `dist`, `.test-dist`, or `.vite`.
- Update relevant `docs/status`, `docs/phases`, and `project-state` files for each phase or recovery pass.
- Run validation after implementation or documentation governance changes:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `npm run project:status`
  - `npm run project:context`

## Hard Boundaries

- Do not modify legacy `src/engine`, `src/runtime`, or `src/intelligence/runtime` for new mainline work.
- Do not let `SourceImagePackage` directly become a training dataset.
- Durable export must not contain `object URL`, local absolute paths / 本地绝对路径, large image bytes / 大图 bytes, or React state.
- Do not add backend, database, online publication, OpenAI API calls, PyTorch, TensorFlow, ONNX Runtime, WebGPU runtime, or AR unless a future phase explicitly allows it.

## External Skills

External skills are not automatically trusted. They must be listed in `project-state/external-skills-registry.json` and follow `docs/skills/EXTERNAL_SKILL_VETTING.md`.

- Candidate skills are `explicit-only`.
- `scriptsAllowed` defaults to `false`.
- External skills must not override project guardrails.
- External skills must not install production dependencies without explicit approval.

Detailed operating rules live in `docs/prompts/MASTER_CODEX_CONTEXT.md`, `docs/skills/*.md`, and `project-state/*.json`.
