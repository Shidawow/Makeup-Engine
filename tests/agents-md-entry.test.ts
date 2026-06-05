import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('AGENTS.md repository entry', () => {
  it('defines the compact source-of-truth entry for agents', async () => {
    const agents = await readFile('AGENTS.md', 'utf8');

    expect(agents).toContain('Makeup Engine');
    expect(agents).toContain('template production system');
    expect(agents).toContain('not the user-facing app');
    expect(agents).toContain('START_HERE.md');
    expect(agents).toContain('MASTER_CODEX_CONTEXT.md');
    expect(agents).toContain('project-state/project-state.snapshot.json');
    expect(agents).toContain('project-state/latest-handoff.json');
    expect(agents).toContain('project-state/provider-handoff.json');
    expect(agents).toContain('compact handoff');
  });

  it('records hard boundaries and validation commands', async () => {
    const agents = await readFile('AGENTS.md', 'utf8');

    expect(agents).toContain('node_modules');
    expect(agents).toContain('dist');
    expect(agents).toContain('.test-dist');
    expect(agents).toContain('.vite');
    expect(agents).toContain('src/engine');
    expect(agents).toContain('src/runtime');
    expect(agents).toContain('src/intelligence/runtime');
    expect(agents).toContain('SourceImagePackage');
    expect(agents).toContain('training dataset');
    expect(agents).toContain('object URL');
    expect(agents).toContain('local absolute paths');
    expect(agents).toContain('large image bytes');
    expect(agents).toContain('React state');
    expect(agents).toContain('npm run typecheck');
    expect(agents).toContain('npm run test');
    expect(agents).toContain('npm run build');
    expect(agents).toContain('npm run project:status');
    expect(agents).toContain('npm run project:context');
    expect(agents).toContain('external-skills-registry.json');
  });
});
