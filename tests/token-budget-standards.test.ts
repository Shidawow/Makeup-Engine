import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('token budget and compact handoff standards', () => {
  it('documents compact handoff rules and forbidden generated directories', async () => {
    const doc = await readFile('docs/standards/TOKEN_BUDGET_AND_COMPACT_HANDOFF.md', 'utf8');

    expect(doc).toContain('Repository files are the source of truth');
    expect(doc).toContain('Chat history is not');
    expect(doc).toContain('Do not paste full repository directory trees');
    expect(doc).toContain('node_modules');
    expect(doc).toContain('dist');
    expect(doc).toContain('.test-dist');
    expect(doc).toContain('.vite');
    expect(doc).toContain('compact prompt');
    expect(doc).toContain('medium prompt');
    expect(doc).toContain('full prompt');
    expect(doc).toContain('Token optimization is not a reduction in engineering requirements');
  });

  it('records token budget guardrails in machine-readable state', async () => {
    const raw = await readFile('project-state/guardrails.json', 'utf8');
    const guardrails = JSON.parse(raw) as { guardrails: Array<{ id: string; rule: string }> };
    const ids = guardrails.guardrails.map((guardrail) => guardrail.id);
    const rules = guardrails.guardrails.map((guardrail) => guardrail.rule).join('\n');

    expect(ids).toEqual(
      expect.arrayContaining([
        'no_full_node_modules_tree',
        'no_repeated_full_phase_history',
        'prefer_compact_report',
        'prefer_repo_docs_as_context',
        'full_prompt_only_on_request',
      ]),
    );
    expect(rules).toContain('node_modules');
    expect(rules).toContain('dist');
    expect(rules).toContain('.test-dist');
    expect(rules).toContain('.vite');
  });
});

