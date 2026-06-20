import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (path: string): string => readFileSync(path, 'utf8');
const readJson = <T>(path: string): T => JSON.parse(readText(path)) as T;

const ownerAuthorizationText =
  '授权范围：A。只授权进入 Phase 10Q — Real Write Execution Authorization，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package，不授权创建 production writer。';

interface ProjectSnapshot {
  lastCompletedPhase: string;
  lastCompletedBusinessPhase: string;
  currentPhaseId: string;
  nextRecommendedPhase: string;
  nextRecommendedPhaseName: string;
  mainDataFlow: string[];
  knownLimitations: string[];
  forbiddenActions: string[];
  realWriteExecutionAuthorizationDecision: {
    ownerAuthorizationBoundary: string;
    authorizationBoundary: string;
    checklistBoundary: string;
    handoffBoundary: string;
    nextPhase: string;
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

interface LatestHandoff {
  fromPhase: string;
  toPhase: string;
  nextAction: string;
  realWriteExecutionAuthorizationDecision: {
    nextPhase: string;
    boundary: string;
    ownerAuthorizationBoundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10Q documentation recovery', () => {
  it('documents real write execution authorization without actual write, publish, production writer, or shell replacement', () => {
    expect(readText('docs/product/real-write-execution-authorization.md')).toContain(
      'Real Write Execution Authorization',
    );
    expect(
      readText('docs/product/real-write-execution-authorization-checklist.md'),
    ).toContain('Real Write Execution Authorization Checklist');
    expect(
      readText('docs/product/real-write-execution-authorization-handoff.md'),
    ).toContain('Real Write Execution Authorization Handoff');
    expect(readText('docs/phases/phase-10Q.md')).toContain(
      'Real Write Execution Authorization',
    );
    expect(readText('docs/product/real-write-execution-authorization.md')).toContain(
      ownerAuthorizationText,
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10R');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10Q completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10Q',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10R',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10P',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10Q',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10Q');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10Q');
    expect(snapshot.currentPhaseId).toBe('10Q');
    expect(snapshot.nextRecommendedPhase).toBe('10R');
    expect(snapshot.nextRecommendedPhaseName).toContain('Real Write Execution Plan');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'RealWriteExecutionAuthorizationResult',
        'RealWriteExecutionAuthorizationChecklist',
        'RealWriteExecutionAuthorizationHandoff',
        'RealWriteExecutionAuthorizationPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10Q');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'authorization model only',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10Q');
    expect(snapshot.forbiddenActions.join('\n')).toContain(
      'actual registry write authorization',
    );
    expect(
      snapshot.realWriteExecutionAuthorizationDecision.ownerAuthorizationBoundary,
    ).toContain(ownerAuthorizationText);
    expect(
      snapshot.realWriteExecutionAuthorizationDecision.authorizationBoundary,
    ).toContain('no actual write');
    expect(
      snapshot.realWriteExecutionAuthorizationDecision.checklistBoundary,
    ).toContain('owner authorization scope A');
    expect(
      snapshot.realWriteExecutionAuthorizationDecision.handoffBoundary,
    ).toContain('cannot execute registry writes');
    expect(snapshot.realWriteExecutionAuthorizationDecision.nextPhase).toContain(
      'Phase 10R',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10Q');
    expect(providerHandoff.lastCompletedPhase).toBe('10Q');
    expect(providerHandoff.nextRecommendedPhase).toBe('10R');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Real Write Execution Plan',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10Q.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'real write execution authorization',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'authorization model only',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10Q');
    expect(latestHandoff.toPhase).toBe('10R');
    expect(latestHandoff.nextAction).toContain('Phase 10R');
    expect(latestHandoff.realWriteExecutionAuthorizationDecision.nextPhase).toContain(
      'Phase 10R',
    );
    expect(
      latestHandoff.realWriteExecutionAuthorizationDecision.ownerAuthorizationBoundary,
    ).toContain(ownerAuthorizationText);

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10Q');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10q_authorization_model_only',
        'phase_10q_owner_scope_a_only',
        'phase_10q_no_actual_registry_write',
        'phase_10q_no_publish',
        'phase_10q_no_shell_package_replacement',
        'phase_10q_no_production_writer',
        'phase_10q_future_owner_authorization_required',
      ]),
    );
  });
});

