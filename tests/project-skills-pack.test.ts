import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const skillDocs = [
  'docs/skills/PROJECT_RECOVERY_SKILL.md',
  'docs/skills/PHASE_EXECUTION_SKILL.md',
  'docs/skills/CONTRACT_SCHEMA_GUARD_SKILL.md',
  'docs/skills/TEMPLATE_PRODUCTION_QA_SKILL.md',
  'docs/skills/COMPACT_HANDOFF_SKILL.md',
];

interface ProjectSkillsState {
  schemaVersion: string;
  lastUpdatedPhase: string;
  skills: Array<{
    skillId: string;
    skillName: string;
    appliesTo: string[];
    requiredReadFiles: string[];
    guardrails: string[];
    relatedDocs: string[];
  }>;
}

describe('project skills pack', () => {
  it('adds all required project skill documents', async () => {
    const contents = await Promise.all(skillDocs.map((filePath) => readFile(filePath, 'utf8')));

    for (const content of contents) {
      expect(content.length).toBeGreaterThan(200);
    }

    expect(contents[0]).toContain('Project Recovery Skill');
    expect(contents[1]).toContain('Phase Execution Skill');
    expect(contents[2]).toContain('Contract Schema Guard Skill');
    expect(contents[3]).toContain('Template Production QA Skill');
    expect(contents[4]).toContain('Compact Handoff Skill');
  });

  it('records the skills in project-state/skills.json', async () => {
    const raw = await readFile('project-state/skills.json', 'utf8');
    const state = JSON.parse(raw) as ProjectSkillsState;
    const ids = state.skills.map((skill) => skill.skillId);

    expect(state.schemaVersion).toBe('project-skills.v1');
    expect(state.lastUpdatedPhase).toBe('OPS-1');
    expect(ids).toEqual(
      expect.arrayContaining([
        'project-recovery',
        'phase-execution',
        'contract-schema-guard',
        'template-production-qa',
        'compact-handoff',
      ]),
    );
    expect(state.skills).toHaveLength(5);
    expect(JSON.stringify(state)).toContain('docs/skills/PROJECT_RECOVERY_SKILL.md');
    expect(JSON.stringify(state)).toContain('docs/skills/COMPACT_HANDOFF_SKILL.md');
  });

  it('documents contract and compact handoff boundaries in the skills', async () => {
    const [contractGuard, compactHandoff] = await Promise.all([
      readFile('docs/skills/CONTRACT_SCHEMA_GUARD_SKILL.md', 'utf8'),
      readFile('docs/skills/COMPACT_HANDOFF_SKILL.md', 'utf8'),
    ]);

    expect(contractGuard).toContain('object URL');
    expect(contractGuard).toContain('本地绝对路径');
    expect(contractGuard).toContain('large image bytes');
    expect(contractGuard).toContain('大图 bytes');
    expect(contractGuard).toContain('SourceImagePackage');
    expect(contractGuard).toContain('training dataset');
    expect(contractGuard).toContain('UI state cannot directly train');
    expect(contractGuard).toContain('local_published is not online publication');

    expect(compactHandoff).toContain('node_modules');
    expect(compactHandoff).toContain('dist');
    expect(compactHandoff).toContain('.test-dist');
    expect(compactHandoff).toContain('.vite');
    expect(compactHandoff).toContain('full historical chat');
    expect(compactHandoff).toContain('phase docs');
  });
});
