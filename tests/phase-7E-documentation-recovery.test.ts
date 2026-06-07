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

describe('Phase 7E documentation recovery', () => {
  it('documents local discovery/recommendation placeholders and advances recovery state to 7F', () => {
    expect(readText('START_HERE.md')).toContain('Phase 7E');
    expect(readText('docs/user-app/user-template-discovery.md')).toContain(
      'User Template Discovery',
    );
    expect(readText('docs/user-app/user-template-recommendation-placeholder.md')).toContain(
      'Recommendation Placeholder',
    );
    expect(readText('docs/user-app/user-recommendation-reasons.md')).toContain(
      'User Recommendation Reasons',
    );
    expect(readText('docs/privacy/user-template-recommendation-boundary.md')).toContain(
      'User Template Recommendation Boundary',
    );
    expect(readText('docs/phases/phase-7E.md')).toContain(
      'User App Template Discovery / Recommendation Placeholder',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 7H');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'Phase 7E Additions',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'User App Template Discovery / Recommendation Placeholder',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'recommendation is placeholder-only',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8A completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8A',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9B');
    expect(snapshot.nextRecommendedPhase).toBe('9C');
    expect(snapshot.mainDataFlow).toContain('UserAppTemplateDiscovery');
    expect(snapshot.mainDataFlow).toContain('UserTemplateRecommendationPlaceholder');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-7E.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/user-app/user-template-discovery.md',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('recommendation');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('9B');
    expect(providerHandoff.nextRecommendedPhase).toBe('9C');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7E.md');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9B');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'recommendation_placeholder_only',
        'recommendation_local_only',
        'recommendation_rule_based',
        'recommendation_no_ai_api',
        'recommendation_does_not_modify_template_package',
      ]),
    );
  });
});
