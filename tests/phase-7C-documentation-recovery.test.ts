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

describe('Phase 7C documentation recovery', () => {
  it('documents photo intake and personalization boundaries and advances recovery state to 7D', () => {
    expect(readText('START_HERE.md')).toContain('Phase 7C');
    expect(readText('docs/user-app/user-photo-intake-placeholder.md')).toContain(
      'User Photo Intake Placeholder',
    );
    expect(readText('docs/user-app/user-personalization-boundary.md')).toContain(
      'User Personalization Boundary',
    );
    expect(readText('docs/user-app/user-photo-privacy-boundary.md')).toContain(
      'User Photo Privacy Boundary',
    );
    expect(readText('docs/privacy/user-photo-data-boundary.md')).toContain(
      'does not',
    );
    expect(readText('docs/phases/phase-7C.md')).toContain(
      'User Photo Intake Placeholder / Personalization Boundary',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 7H');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'Phase 7C Additions',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'User Photo Intake Placeholder',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'face embeddings',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 7H completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 7H',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('7H');
    expect(snapshot.nextRecommendedPhase).toBe('8A');
    expect(snapshot.mainDataFlow).toContain('UserPhotoIntakePlaceholder');
    expect(snapshot.mainDataFlow).toContain('UserPersonalizationPlaceholder');
    expect(snapshot.mainDataFlow).toContain('UserPhotoPrivacyBoundary');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-7C.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/user-app/user-photo-intake-placeholder.md',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('real user photos');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('7H');
    expect(providerHandoff.nextRecommendedPhase).toBe('8A');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7C.md');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('7H');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'no_real_user_photo_capture_in_7C',
        'no_camera_api_in_7C',
        'no_user_photo_bytes_storage',
        'no_user_photo_training_input',
        'personalization_placeholder_only',
      ]),
    );
  });
});
