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
}

interface LatestHandoff {
  fromPhase: string;
  toPhase: string;
  routeDecision: {
    selectedRoute: string;
    handoffContract: string;
    phase8BResult: string[];
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 8B documentation recovery', () => {
  it('documents PWA/mobile shell polish without production app scope', () => {
    expect(readText('docs/user-app/pwa-mobile-web-mvp-polish.md')).toContain(
      'Phase 8B',
    );
    expect(readText('docs/user-app/pwa-install-readiness.md')).toContain(
      'No service worker',
    );
    expect(readText('docs/phases/phase-8B.md')).toContain(
      'PWA / Mobile Web MVP Polish',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 8C');
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'Phase 8B',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8B completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8B',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9I');
    expect(snapshot.lastCompletedBusinessPhase).toBe('9I');
    expect(snapshot.currentPhaseId).toBe('9I');
    expect(snapshot.nextRecommendedPhase).toBe('9J');
    expect(snapshot.nextRecommendedPhaseName).toContain('Anonymous Internal Trial Follow-up Iteration');
    expect(snapshot.mainDataFlow).toContain('UserAppPwaReadiness');
    expect(snapshot.mainDataFlow).toContain('UserAppMvpPolishReadiness');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-8B.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/pwa-mobile-web-mvp-polish.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/pwa-install-readiness.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('service worker');
    expect(snapshot.forbiddenActions.join('\n')).toContain('production PWA release');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 9I');
    expect(providerHandoff.lastCompletedPhase).toBe('9I');
    expect(providerHandoff.nextRecommendedPhase).toBe('9J');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-8B.md');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/user-app/pwa-mobile-web-mvp-polish.md',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('9I');
    expect(latestHandoff.toPhase).toBe('9J');
    expect(latestHandoff.routeDecision.selectedRoute).toBe('React Web / PWA MVP first');
    expect(latestHandoff.routeDecision.handoffContract).toBe('UserAppTemplatePackage');
    expect(latestHandoff.routeDecision.phase8BResult).toContain('PWA readiness report');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9I');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_8b_pwa_mobile_polish_only',
        'phase_8b_manifest_metadata_only',
        'phase_8b_no_service_worker_or_offline',
        'phase_8b_admin_qa_not_user_feature',
        'phase_8b_does_not_modify_user_app_template_package',
      ]),
    );
  });
});
