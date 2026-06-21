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
  realWriteApprovalBoundaryDecision: {
    nextPhase: string;
    boundary: string;
    checklistBoundary: string;
    handoffBoundary: string;
    approvalBoundary: string;
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
  realWriteApprovalBoundaryDecision: {
    nextPhase: string;
    boundary: string;
    handoffBoundary: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10U documentation recovery', () => {
  it('documents real write approval boundary without real write, mutation, publish, production writer, or shell replacement', () => {
    expect(readText('docs/product/real-write-approval-boundary.md')).toContain(
      'Real Write Approval Boundary',
    );
    expect(readText('docs/product/real-write-approval-boundary.md')).toContain(
      'boundary_only',
    );
    expect(readText('docs/product/real-write-approval-boundary.md')).toContain(
      'future actual write requires separate owner approval',
    );
    expect(readText('docs/product/real-write-approval-checklist.md')).toContain(
      'Real Write Approval Checklist',
    );
    expect(readText('docs/product/real-write-approval-handoff.md')).toContain(
      'Real Write Approval Handoff',
    );
    expect(readText('docs/phases/phase-10U.md')).toContain(
      'Real Write Approval Boundary',
    );
    expect(readText('docs/phases/phase-10U.md')).toContain(
      'not actual registry write authorization',
    );
    expect(readText('docs/phases/phase-10U.md')).toContain(
      'not registry mutation',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10V');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10U completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10U',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10V',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10T',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10U',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10U');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10U');
    expect(snapshot.currentPhaseId).toBe('10U');
    expect(snapshot.nextRecommendedPhase).toBe('10V');
    expect(snapshot.nextRecommendedPhaseName).toContain(
      'Actual Write Authorization Request',
    );
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'RealWriteApprovalBoundaryResult',
        'RealWriteApprovalBoundaryCheck',
        'RealWriteApprovalBoundaryIssue',
        'RealWriteApprovalBoundaryTrace',
        'RealWriteApprovalChecklist',
        'RealWriteApprovalChecklistItem',
        'RealWriteApprovalRequirement',
        'RealWriteApprovalHandoff',
        'RealWriteApprovalHandoffItem',
        'RealWriteApprovalBoundaryPanel',
      ]),
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10U');
    expect(snapshot.knownLimitations.join('\n')).toContain(
      'approval-boundary-only',
    );
    expect(snapshot.knownLimitations.join('\n')).toContain('registry mutation');
    expect(snapshot.forbiddenActions.join('\n')).toContain('Phase 10U');
    expect(snapshot.forbiddenActions.join('\n')).toContain('registry mutation');
    expect(snapshot.realWriteApprovalBoundaryDecision.nextPhase).toContain(
      'Phase 10V',
    );
    expect(snapshot.realWriteApprovalBoundaryDecision.boundary).toContain(
      'approval-boundary-only',
    );
    expect(
      snapshot.realWriteApprovalBoundaryDecision.checklistBoundary,
    ).toContain('does not trigger writes');
    expect(snapshot.realWriteApprovalBoundaryDecision.handoffBoundary).toContain(
      'cannot execute registry writes',
    );
    expect(
      snapshot.realWriteApprovalBoundaryDecision.approvalBoundary,
    ).toContain('separate explicit owner authorization');

    const providerHandoff = readJson<ProviderHandoff>(
      'project-state/provider-handoff.json',
    );
    expect(providerHandoff.currentTask).toContain('Phase 10U');
    expect(providerHandoff.lastCompletedPhase).toBe('10U');
    expect(providerHandoff.nextRecommendedPhase).toBe('10V');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Actual Write Authorization Request',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain(
      'docs/phases/phase-10U.md',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'real write approval boundary',
    );
    expect(providerHandoff.handoffNotes.join('\n')).toContain(
      'not actual registry write authorization',
    );

    const latestHandoff = readJson<LatestHandoff>(
      'project-state/latest-handoff.json',
    );
    expect(latestHandoff.fromPhase).toBe('10U');
    expect(latestHandoff.toPhase).toBe('10V');
    expect(latestHandoff.nextAction).toContain('Phase 10V');
    expect(latestHandoff.realWriteApprovalBoundaryDecision.nextPhase).toContain(
      'Phase 10V',
    );
    expect(latestHandoff.realWriteApprovalBoundaryDecision.boundary).toContain(
      'no actual write',
    );
    expect(latestHandoff.realWriteApprovalBoundaryDecision.handoffBoundary).toContain(
      'cannot execute registry writes',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10U');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10u_approval_boundary_only',
        'phase_10u_no_actual_registry_write',
        'phase_10u_no_registry_mutation',
        'phase_10u_no_publish',
        'phase_10u_no_shell_package_replacement',
        'phase_10u_no_production_writer',
        'phase_10u_dry_run_only',
        'phase_10u_future_owner_authorization_required',
      ]),
    );
  });
});
