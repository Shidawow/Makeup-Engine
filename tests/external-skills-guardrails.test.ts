import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('external skills guardrails and prompt wiring', () => {
  it('adds external skill guardrails to machine-readable state', async () => {
    const raw = await readFile('project-state/guardrails.json', 'utf8');
    const state = JSON.parse(raw) as { guardrails: Array<{ id: string; rule: string }> };
    const ids = state.guardrails.map((guardrail) => guardrail.id);

    expect(ids).toEqual(
      expect.arrayContaining([
        'external_skills_must_be_registered',
        'external_skills_default_explicit_only',
        'external_skills_scripts_disabled_by_default',
        'external_skills_no_production_dependencies_without_approval',
        'external_skills_must_not_override_project_guardrails',
        'root_agents_md_required',
      ]),
    );
  });

  it('links AGENTS.md and the external skill registry from prompts', async () => {
    const [masterContext, providerPrompt, tokenBudget] = await Promise.all([
      readFile('docs/prompts/MASTER_CODEX_CONTEXT.md', 'utf8'),
      readFile('docs/prompts/PROVIDER_SWITCH_PROMPT.md', 'utf8'),
      readFile('docs/standards/TOKEN_BUDGET_AND_COMPACT_HANDOFF.md', 'utf8'),
    ]);

    expect(masterContext).toContain('AGENTS.md');
    expect(masterContext).toContain('External Skill Governance');
    expect(masterContext).toContain('project-state/external-skills-registry.json');
    expect(masterContext).toContain('EXTERNAL_SKILL_VETTING.md');

    expect(providerPrompt).toContain('AGENTS.md');
    expect(providerPrompt).toContain('external-skills-registry.json');
    expect(providerPrompt).toContain('skillId');
    expect(providerPrompt).toContain('allowedInvocation');

    expect(tokenBudget).toContain('AGENTS.md');
    expect(tokenBudget).toContain('project-state/external-skills-registry.json');
    expect(tokenBudget).toContain('External Skill Token Rules');
  });
});
