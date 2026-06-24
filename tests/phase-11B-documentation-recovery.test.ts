import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

interface ProjectSnapshot {
  lastCompletedPhase: string;
  lastCompletedBusinessPhase: string;
  currentPhaseId: string;
  currentPhase: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  mainDataFlow: string[];
  knownLimitations: string[];
  forbiddenActions: string[];
  userAppGuidedStepExperiencePolish: {
    registryChainStatus: string;
    preparationPolish: string[];
    stepGuidePolish: string[];
    completionPolish: string[];
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

describe('Phase 11B documentation recovery', () => {
  it('documents guided step polish, boundaries, and next phase', () => {
    expect(readText('docs/product/user-app-guided-step-experience.md')).toContain(
      'User App Guided Step Experience',
    );
    expect(readText('docs/product/user-app-guided-step-experience.md')).toContain(
      'Home -> Template Selection -> Template Detail -> Preparation -> Step-by-step Guidance -> Completion',
    );
    expect(readText('docs/product/user-app-guided-step-experience.md')).toContain(
      'registry chain paused after Phase 10U',
    );
    expect(readText('docs/product/user-app-guided-step-experience.md')).toContain(
      '完成本步骤',
    );
    expect(readText('docs/product/user-app-guided-step-experience.md')).toContain(
      'Phase 11C - User App Visual Guidance & Template Content Polish',
    );
    expect(readText('docs/phases/phase-11B.md')).toContain(
      'User App Guided Step Experience Polish',
    );
    expect(readText('docs/phases/phase-11B.md')).toContain(
      'Phase 10V actual write authorization is still not the active next phase',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 11C');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 11B completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 11B',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 11C',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('11B');
    expect(snapshot.lastCompletedBusinessPhase).toBe('11B');
    expect(snapshot.currentPhaseId).toBe('11B');
    expect(snapshot.currentPhase).toContain('User App Guided Step Experience Polish');
    expect(snapshot.nextRecommendedPhase).toBe('11C');
    expect(snapshot.nextRecommendedPhaseName).toContain('User App Visual Guidance');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppPreparation',
        'UserAppStepGuide',
        'UserAppCompletion',
        'UserAppGuidedStepExperiencePolish',
        'UserAppMobileGuidanceLayout',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 11B');
    expect(snapshot.knownLimitations.join('\n')).toContain('registry mutation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 11B');
    expect(snapshot.forbiddenActions.join('\n')).toContain('real registry write');
    expect(snapshot.userAppGuidedStepExperiencePolish.registryChainStatus).toContain('paused');
    expect(snapshot.userAppGuidedStepExperiencePolish.preparationPolish).toContain(
      'tool_checklist',
    );
    expect(snapshot.userAppGuidedStepExperiencePolish.stepGuidePolish).toContain(
      'mobile_touch_actions',
    );
    expect(snapshot.userAppGuidedStepExperiencePolish.completionPolish).toContain(
      'step_review',
    );
    expect(snapshot.userAppGuidedStepExperiencePolish.adminBoundary).toContain(
      'ordinary user path',
    );

    const providerHandoff = readJson<ProviderHandoff>(
      'project-state/provider-handoff.json',
    );
    expect(providerHandoff.currentTask).toContain('Phase 11B');
    expect(providerHandoff.lastCompletedPhase).toBe('11B');
    expect(providerHandoff.nextRecommendedPhase).toBe('11C');
    expect(providerHandoff.nextRecommendedPhaseName).toContain('User App Visual Guidance');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/product/user-app-guided-step-experience.md',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-11B.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('Preparation now shows');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('registry chain paused');
  });
});
