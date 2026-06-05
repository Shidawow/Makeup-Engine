import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('project skills guardrails', () => {
  it('adds skill requirements to machine-readable guardrails', async () => {
    const raw = await readFile('project-state/guardrails.json', 'utf8');
    const state = JSON.parse(raw) as { guardrails: Array<{ id: string; rule: string }> };
    const ids = state.guardrails.map((guardrail) => guardrail.id);
    const rules = state.guardrails.map((guardrail) => guardrail.rule).join('\n');

    expect(ids).toEqual(
      expect.arrayContaining([
        'require_project_recovery_skill',
        'require_phase_execution_skill',
        'require_contract_schema_guard_for_contract_changes',
        'require_compact_handoff_by_default',
      ]),
    );
    expect(rules).toContain('PROJECT_RECOVERY_SKILL.md');
    expect(rules).toContain('PHASE_EXECUTION_SKILL.md');
    expect(rules).toContain('CONTRACT_SCHEMA_GUARD_SKILL.md');
    expect(rules).toContain('COMPACT_HANDOFF_SKILL.md');
  });

  it('links project skills from master context and provider switching prompt', async () => {
    const [masterContext, providerPrompt] = await Promise.all([
      readFile('docs/prompts/MASTER_CODEX_CONTEXT.md', 'utf8'),
      readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8'),
    ]);

    expect(masterContext).toContain('Available Project Skills');
    expect(masterContext).toContain('project-state/skills.json');
    expect(masterContext).toContain('PROJECT_RECOVERY_SKILL.md');
    expect(masterContext).toContain('CONTRACT_SCHEMA_GUARD_SKILL.md');
    expect(masterContext).toContain('COMPACT_HANDOFF_SKILL.md');

    expect(providerPrompt).toContain('project-state/skills.json');
    expect(providerPrompt).toContain('relevant `docs/skills/*.md`');
    expect(providerPrompt).toContain('Relevant skills');
  });
});
