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

describe('Phase 7F documentation recovery', () => {
  it('documents local session persistence and advances recovery state to 7G', () => {
    expect(readText('START_HERE.md')).toContain('Phase 7F');
    expect(readText('docs/user-app/user-app-session-persistence.md')).toContain(
      'User App Session Persistence',
    );
    expect(readText('docs/user-app/user-app-session-recovery.md')).toContain(
      'User App Session Recovery',
    );
    expect(readText('docs/privacy/user-app-session-data-boundary.md')).toContain(
      'User App Session Data Boundary',
    );
    expect(readText('docs/phases/phase-7F.md')).toContain(
      'User App Session Persistence / Local State Hardening',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 7H');
    expect(readText('docs/architecture/CURRENT_ARCHITECTURE.md')).toContain(
      'Phase 7F Additions',
    );
    expect(readText('docs/architecture/DATA_FLOW.md')).toContain(
      'User App Session Persistence / Local State Hardening',
    );
    expect(readText('docs/architecture/BOUNDARIES_AND_GUARDRAILS.md')).toContain(
      'session persistence is local-only',
    );
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 8A completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 8A',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('9C');
    expect(snapshot.nextRecommendedPhase).toBe('9D');
    expect(snapshot.mainDataFlow).toContain('UserAppSession');
    expect(snapshot.mainDataFlow).toContain('UserAppSessionRecovery');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-7F.md');
    expect(snapshot.recoveryEntryFiles).toContain(
      'docs/user-app/user-app-session-persistence.md',
    );
    expect(snapshot.forbiddenActions.join('\n')).toContain('session');

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.lastCompletedPhase).toBe('9C');
    expect(providerHandoff.nextRecommendedPhase).toBe('9D');
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-7F.md');

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('9C');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'session_local_only',
        'no_account_system',
        'no_backend_session_sync',
        'session_no_object_url',
        'session_does_not_modify_template_package',
      ]),
    );
  });
});
