import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('compact Codex task template', () => {
  it('exists and keeps required fields even in compact mode', async () => {
    const template = await readFile('docs/prompts/COMPACT_CODEX_TASK_TEMPLATE.md', 'utf8');

    expect(template).toContain('Current phase');
    expect(template).toContain('This round goal');
    expect(template).toContain('Required read files');
    expect(template).toContain('Allowed modification scope');
    expect(template).toContain('Forbidden modification scope');
    expect(template).toContain('Core tasks');
    expect(template).toContain('State machine / schema / contract requirements');
    expect(template).toContain('Acceptance commands');
    expect(template).toContain('Documentation update requirements');
    expect(template).toContain('Completion report format');
    expect(template).toContain('Current limitations');
    expect(template).toContain('Next recommendation');
    expect(template).toContain('not lower standards');
  });
});

