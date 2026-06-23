import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

interface ProjectSnapshot {
  lastCompletedPhase: string;
  lastCompletedBusinessPhase: string;
  currentPhaseId: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  mainDataFlow: string[];
  knownLimitations: string[];
  forbiddenActions: string[];
  userAppMvpExperienceReset: {
    registryChainStatus: string;
    userPath: string[];
    adminBoundary: string;
  };
}

interface ProviderHandoff {
  currentTask: string;
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  nextRequiredReadFiles: string[];
  handoffNotes: string[];
}

describe('Phase 11A documentation recovery', () => {
  it('documents the User App MVP experience reset and paused registry chain', () => {
    expect(readText('docs/product/user-app-mvp-experience.md')).toContain(
      'User App MVP Experience',
    );
    expect(readText('docs/product/user-app-mvp-experience.md')).toContain(
      'Home -> Template Selection -> Template Detail -> Preparation -> Step-by-step Guidance -> Completion',
    );
    expect(readText('docs/product/user-app-mvp-experience.md')).toContain(
      'registry chain paused after Phase 10U',
    );
    expect(readText('docs/product/user-app-mvp-experience.md')).toContain(
      '用户 App 预览',
    );
    expect(readText('docs/phases/phase-11A.md')).toContain(
      'User App MVP Experience Reset',
    );
    expect(readText('docs/phases/phase-11A.md')).toContain(
      'Phase 10V is intentionally paused',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 11B');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 11A completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 11A',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 11B',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('11A');
    expect(snapshot.lastCompletedBusinessPhase).toBe('11A');
    expect(snapshot.currentPhaseId).toBe('11A');
    expect(snapshot.nextRecommendedPhase).toBe('11B');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'User App Guided Step Experience Polish',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppMvpExperience',
        'UserAppTemplateSelection',
        'UserAppTemplateDetail',
        'UserAppStepGuide',
        'UserAppCompletion',
        'UserAppAdminBoundary',
        'AppShellUserAppPreview',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 11A');
    expect(snapshot.knownLimitations.join('\n')).toContain('registry chain paused');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 11A');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real registry write');
    expect(snapshot.userAppMvpExperienceReset.registryChainStatus).toContain('paused');
    expect(snapshot.userAppMvpExperienceReset.userPath).toEqual(
      expect.arrayContaining([
        'home',
        'template_selection',
        'template_detail',
        'preparation',
        'step_by_step_guidance',
        'completion',
      ]),
    );
    expect(snapshot.userAppMvpExperienceReset.adminBoundary).toContain(
      'ordinary user path',
    );

    const providerHandoff = readJson<ProviderHandoff>(
      'project-state/provider-handoff.json',
    );
    expect(providerHandoff.currentTask).toContain('Phase 11A');
    expect(providerHandoff.lastCompletedPhase).toBe('11A');
    expect(providerHandoff.nextRecommendedPhase).toBe('11B');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'User App Guided Step Experience Polish',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/user-app-mvp-experience.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'registry chain paused',
    );
  });
});
