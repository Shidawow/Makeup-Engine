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
  recoveryEntryFiles: string[];
  forbiddenActions: string[];
  knownLimitations: string[];
}

interface ProviderHandoff {
  currentTask: string;
  lastCompletedPhase: string;
  nextRecommendedPhase: string;
  nextRequiredReadFiles: string[];
  handoffNotes: string[];
}

interface LatestHandoff {
  fromPhase: string;
  toPhase: string;
  nextAction: string;
  templateContentQaDecision: {
    phase8DResult: string[];
    nextGate: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 8D documentation recovery', () => {
  it('documents template content QA and the 8E handoff without release scope', () => {
    expect(readText('docs/user-app/template-content-qa-for-trial.md')).toContain(
      'Template Content QA',
    );
    expect(readText('docs/user-app/template-content-qa-for-trial.md')).toContain(
      'not AI content generation',
    );
    expect(readText('docs/user-app/trial-template-selection.md')).toContain(
      'Blocked templates cannot enter',
    );
    expect(readText('docs/user-app/trial-content-readiness.md')).toContain(
      'ready_for_real_user_trial',
    );
    expect(readText('docs/product/template-content-qa-checklist.md')).toContain(
      'Internal technical terms',
    );
    expect(readText('docs/phases/phase-8D.md')).toContain(
      'Template Content QA for Real User Trial',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 8E');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8D completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8D',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9D');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9D');
    expect(snapshot.currentPhaseId).toBe('9D');
    expect(snapshot.nextRecommendedPhase).toBe('9E');
    expect(snapshot.nextRecommendedPhaseName).toContain('Internal Trial Evidence Pack');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'UserAppTemplateContentQa',
        'UserAppTrialTemplateSelection',
        'UserAppTrialContentReadiness',
        'UserAppTemplateContentQaAdminPanels',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-8D.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/template-content-qa-for-trial.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/trial-template-selection.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/trial-content-readiness.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 8D template content QA');
    expect(snapshot.forbiddenActions.join('\n')).toContain('UserAppTemplatePackage');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9D');
    expect(providerHandoff.lastCompletedPhase).toBe('9D');
    expect(providerHandoff.nextRecommendedPhase).toBe('9E');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-8D.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/user-app/template-content-qa-for-trial.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'Phase 9A added internal trial operations',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9D');
    expect(latestHandoff.toPhase).toBe('9E');
    expect(latestHandoff.nextAction).toContain('Phase 9E');
    expect(latestHandoff.templateContentQaDecision.phase8DResult).toContain(
      'template content QA report',
    );
    expect(latestHandoff.templateContentQaDecision.nextGate).toContain('Phase 8E');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9D');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_8d_content_qa_local_only',
        'phase_8d_no_template_mutation',
        'phase_8d_no_user_records_or_training',
        'phase_8d_no_ai_generation_or_api',
      ]),
    );
  });
});
