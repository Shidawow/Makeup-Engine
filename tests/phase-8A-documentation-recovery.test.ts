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
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 8A documentation recovery', () => {
  it('documents React Web / PWA route planning without production app scope', () => {
    expect(readText('docs/app-roadmap/app-technology-route-decision.md')).toContain(
      'Use a React Web / PWA MVP route first',
    );
    expect(readText('docs/app-roadmap/user-app-mvp-plan.md')).toContain('Template discovery');
    expect(readText('docs/app-roadmap/makeup-engine-vs-user-app-boundary.md')).toContain(
      'SourceImagePackage cannot directly enter the User App',
    );
    expect(readText('docs/app-roadmap/phase-8-roadmap.md')).toContain(
      'PWA / Mobile Web MVP Polish',
    );
    expect(readText('docs/product/user-app-v1-non-goals.md')).toContain('No OpenAI API');
    expect(readText('docs/user-app/user-app-product-route.md')).toContain('React Web / PWA');
    expect(readText('docs/user-app/user-app-product-route.md')).toContain(
      'separate app surface or repository',
    );
    expect(readText('docs/user-app/user-app-product-route.md')).toContain(
      'UserAppTemplatePackage',
    );
    expect(readText('docs/phases/phase-8A.md')).toContain(
      'Product Route Decision / App MVP Planning',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 8B');
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'Phase 8A is product route and ownership planning only',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8A completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8A',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('8A');
    expect(snapshot.lastCompletedBusinessPhase).toBe('8A');
    expect(snapshot.currentPhaseId).toBe('8A');
    expect(snapshot.nextRecommendedPhase).toBe('8B');
    expect(snapshot.nextRecommendedPhaseName).toContain('PWA / Mobile Web');
    expect(snapshot.mainDataFlow).toContain('UserAppProductRouteDecision');
    expect(snapshot.mainDataFlow).toContain('UserAppTechnologyRouteDecision');
    expect(snapshot.mainDataFlow).toContain('UserAppMvpPlan');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-8A.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/app-roadmap/app-technology-route-decision.md',
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/app-roadmap/user-app-mvp-plan.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/product/user-app-v1-non-goals.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/user-app/user-app-product-route.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('React Web / PWA MVP first');
    expect(snapshot.forbiddenActions.join('\n')).toContain('production user app');
    expect(snapshot.forbiddenActions.join('\n')).toContain('React Native');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 8A');
    expect(providerHandoff.lastCompletedPhase).toBe('8A');
    expect(providerHandoff.nextRecommendedPhase).toBe('8B');
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/app-roadmap/app-technology-route-decision.md',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/user-app/user-app-product-route.md',
    );

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('8A');
    expect(latestHandoff.toPhase).toBe('8B');
    expect(latestHandoff.routeDecision.selectedRoute).toBe('React Web / PWA MVP first');
    expect(latestHandoff.routeDecision.handoffContract).toBe('UserAppTemplatePackage');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('8A');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_8a_planning_only',
        'phase_8a_web_first_route_not_app',
        'phase_8a_separate_app_boundary',
        'phase_8a_contract_boundary',
        'phase_8a_no_runtime_expansion',
        'phase_8a_no_native_or_commerce_scope',
        'phase_8a_source_image_not_user_app_input',
      ]),
    );
  });
});
