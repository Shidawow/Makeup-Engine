import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('external skill vetting docs', () => {
  it('documents vetting, registry, and recommended candidate skills', async () => {
    const [vetting, registry, recommended] = await Promise.all([
      readFile('docs/skills/EXTERNAL_SKILL_VETTING.md', 'utf8'),
      readFile('docs/skills/EXTERNAL_SKILL_REGISTRY.md', 'utf8'),
      readFile('docs/skills/RECOMMENDED_EXTERNAL_SKILLS.md', 'utf8'),
    ]);

    expect(vetting).toContain('External Skill Vetting');
    expect(vetting).toContain('instruction-only');
    expect(vetting).toContain('scripts');
    expect(vetting).toContain('production dependencies');
    expect(vetting).toContain('external APIs');
    expect(vetting).toContain('legacy runtime');
    expect(vetting).toContain('quality gates');
    expect(vetting).toContain('project-state');

    expect(registry).toContain('skillId');
    expect(registry).toContain('sourceType');
    expect(registry).toContain('candidate');
    expect(registry).toContain('approved');
    expect(registry).toContain('explicit-only');
    expect(registry).toContain('implicit-allowed');
    expect(registry).toContain('scriptsAllowed');

    expect(recommended).toContain('React UI / Accessibility QA');
    expect(recommended).toContain('TypeScript Contract / Schema Review');
    expect(recommended).toContain('Vitest Deterministic Testing');
    expect(recommended).toContain('Security / Supply Chain Review');
    expect(recommended).toContain('Git / PR Review');
    expect(recommended).toContain('OpenAI CV API skill');
    expect(recommended).toContain('ONNX Runtime skill');
    expect(recommended).toContain('PyTorch / TensorFlow training skill');
  });
});
