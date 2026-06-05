import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface ExternalSkillRegistry {
  schemaVersion: string;
  lastUpdatedPhase: string;
  skills: Array<{
    skillId: string;
    name: string;
    status: string;
    allowedInvocation: string;
    instructionOnly: boolean;
    scriptsAllowed: boolean;
    appliesTo: string[];
    doNotUseFor: string[];
    relatedGuardrails: string[];
  }>;
}

describe('external skills registry', () => {
  it('records recommended candidate skills with safe defaults', async () => {
    const raw = await readFile('project-state/external-skills-registry.json', 'utf8');
    const registry = JSON.parse(raw) as ExternalSkillRegistry;
    const ids = registry.skills.map((skill) => skill.skillId);

    expect(registry.schemaVersion).toBe('external-skills-registry.v1');
    expect(registry.lastUpdatedPhase).toBe('OPS-2');
    expect(registry.skills.length).toBeGreaterThanOrEqual(5);
    expect(ids).toEqual(
      expect.arrayContaining([
        'react-ui-accessibility-qa',
        'typescript-contract-schema-review',
        'vitest-deterministic-testing',
        'security-supply-chain-review',
        'git-pr-review',
      ]),
    );

    for (const skill of registry.skills) {
      expect(skill.status).toBe('candidate');
      expect(skill.allowedInvocation).toBe('explicit-only');
      expect(skill.instructionOnly).toBe(true);
      expect(skill.scriptsAllowed).toBe(false);
      expect(skill.appliesTo.length).toBeGreaterThan(0);
      expect(skill.doNotUseFor.length).toBeGreaterThan(0);
      expect(skill.relatedGuardrails.length).toBeGreaterThan(0);
    }
  });
});
