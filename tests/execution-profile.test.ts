import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

interface ExecutionProfileState {
  schemaVersion: string;
  recommendedProfile: string;
  allowedProfiles: string[];
  profileSelectionRules: Array<{
    profile: string;
    useWhen: string[];
  }>;
}

describe('execution profile state', () => {
  it('is valid JSON with allowed profiles and selection rules', async () => {
    const raw = await readFile('project-state/execution-profile.json', 'utf8');
    const state = JSON.parse(raw) as ExecutionProfileState;

    expect(state.schemaVersion).toBe('execution-profile.v1');
    expect(state.recommendedProfile).toBe('native-gpt-codex-daily');
    expect(state.allowedProfiles).toEqual(
      expect.arrayContaining([
        'chatgpt-planning',
        'native-gpt-codex-daily',
        'packyapi-cli-heavy',
        'emergency-fix',
        'docs-only',
      ]),
    );
    expect(state.profileSelectionRules.map((rule) => rule.profile)).toContain('packyapi-cli-heavy');
    expect(
      state.profileSelectionRules.some(
        (rule) => rule.profile === 'packyapi-cli-heavy' && rule.useWhen.includes('large refactor'),
      ),
    ).toBe(true);
  });
});
