import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

interface ProjectSnapshot {
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  mainDataFlow: string[];
  recoveryEntryFiles: string[];
  forbiddenActions: string[];
}

interface ProviderHandoff {
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  nextRequiredReadFiles: string[];
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 7D documentation recovery', () => {
  it('documents local onboarding and preferences and advances recovery state to 7E', () => {
    expect(readText('START_HERE.md')).toContain('Phase 7D');
    expect(readText('docs/user-app/user-app-local-onboarding.md')).toContain(
      'User App Local Onboarding',
    );
    expect(readText('docs/user-app/user-local-preferences.md')).toContain(
      'User Local Preferences',
    );
    expect(readText('docs/user-app/preferences-to-guidance-hints.md')).toContain(
      'Preferences To Guidance Hints',
    );
    expect(readText('docs/privacy/user-preferences-data-boundary.md')).toContain(
      'User Preferences Data Boundary',
    );
    expect(readText('docs/phases/phase-7D.md')).toContain(
      'User App Local Preferences & Onboarding',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 7H');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'Phase 7D Additions',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'User App Local Preferences / Onboarding',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'preferences must remain non-sensitive',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8A completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8A',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('8D');
    expect(snapshot.nextRecommendedPhase).toBe('8E');
    expect(snapshot.mainDataFlow).toContain('UserAppLocalOnboarding');
    expect(snapshot.mainDataFlow).toContain('UserLocalPreferences');
    expect(snapshot.mainDataFlow).toContain('PreferenceGuidanceHints');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-7D.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/user-app/user-app-local-onboarding.md',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('preferences');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('8D');
    expect(providerHandoff.nextRecommendedPhase).toBe('8E');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7D.md');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('8D');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'preferences_local_only',
        'onboarding_local_only',
        'no_sensitive_user_profile',
        'no_training_input_from_preferences',
        'preferences_do_not_modify_template_package',
      ]),
    );
  });
});
