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
  knownLimitations: string[];
  forbiddenActions: string[];
  templateDraftReviewWorkflowDecision: {
    visionAnalysisBoundary: string;
    templateWorkbenchBoundary: string;
    publishBoundary: string;
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
  templateDraftReviewWorkflowDecision: {
    nextPhase: string;
  };
}

interface GuardrailState {
  phase: string;
  guardrails: Array<{ id: string; rule: string }>;
}

describe('Phase 10B documentation recovery', () => {
  it('documents draft review workflow and tab ownership without publishing scope creep', () => {
    expect(readText('docs/product/template-draft-qa.md')).toContain('Template Draft QA');
    expect(readText('docs/product/template-draft-human-review-workflow.md')).toContain(
      'Template Draft Human Review Workflow',
    );
    expect(readText('docs/product/template-draft-review-workflow.md')).toContain(
      'Template Draft Review Workflow',
    );
    expect(readText('docs/phases/phase-10B.md')).toContain(
      '视觉分析 Tab 与模板工作台 Tab 的职责边界',
    );
    expect(readText('docs/status/NEXT_ACTION.md')).toContain('Phase 10C');
    expect(readText('docs/prompts/MASTER_CODEX_CONTEXT.md')).toContain(
      'Phase 10B completed',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'lastCompletedPhase: 10B',
    );
    expect(readText('docs/prompts/PROVIDER_SWITCH_PROMPT.md')).toContain(
      'nextRecommendedPhase: 10C',
    );

    const snapshot = readJson<ProjectSnapshot>('project-state/project-state.snapshot.json');
    expect(snapshot.lastCompletedPhase).toBe('10B');
    expect(snapshot.lastCompletedBusinessPhase).toBe('10B');
    expect(snapshot.currentPhaseId).toBe('10B');
    expect(snapshot.nextRecommendedPhase).toBe('10C');
    expect(snapshot.nextRecommendedPhaseName).toContain('Template Library Candidate Packaging');
    expect(snapshot.mainDataFlow).toEqual(
      expect.arrayContaining([
        'TemplateDraftQaResult',
        'TemplateDraftHumanReview',
        'TemplateDraftReviewWorkflow',
        'TemplateDraftCandidateHandoff',
        'TemplateStudioWorkflowState',
      ]),
    );
    expect(snapshot.recoveryEntryFiles).toContain('docs/product/template-draft-qa.md');
    expect(snapshot.recoveryEntryFiles).toContain('docs/phases/phase-10B.md');
    expect(snapshot.knownLimitations.join('\n')).toContain('Phase 10B approval');
    expect(snapshot.forbiddenActions.join('\n')).toContain('UserAppTemplatePackage');
    expect(snapshot.templateDraftReviewWorkflowDecision.visionAnalysisBoundary).toContain(
      'FaceMesh',
    );
    expect(snapshot.templateDraftReviewWorkflowDecision.templateWorkbenchBoundary).toContain(
      'human review',
    );
    expect(snapshot.templateDraftReviewWorkflowDecision.publishBoundary).toContain(
      'no automatic publish',
    );

    const providerHandoff = readJson<ProviderHandoff>('project-state/provider-handoff.json');
    expect(providerHandoff.currentTask).toContain('Phase 10B');
    expect(providerHandoff.lastCompletedPhase).toBe('10B');
    expect(providerHandoff.nextRecommendedPhase).toBe('10C');
    expect(providerHandoff.nextRecommendedPhaseName).toContain(
      'Template Library Candidate Packaging',
    );
    expect(providerHandoff.nextRequiredReadFiles).toContain('docs/phases/phase-10B.md');
    expect(providerHandoff.handoffNotes.join('\n')).toContain('Vision Analysis');

    const latestHandoff = readJson<LatestHandoff>('project-state/latest-handoff.json');
    expect(latestHandoff.fromPhase).toBe('10B');
    expect(latestHandoff.toPhase).toBe('10C');
    expect(latestHandoff.nextAction).toContain('Phase 10C');
    expect(latestHandoff.templateDraftReviewWorkflowDecision.nextPhase).toContain(
      'Phase 10C',
    );

    const guardrails = readJson<GuardrailState>('project-state/guardrails.json');
    expect(guardrails.phase).toBe('10B');
    expect(guardrails.guardrails.map((guardrail) => guardrail.id)).toEqual(
      expect.arrayContaining([
        'phase_10b_review_only',
        'phase_10b_approve_candidate_only',
        'phase_10b_no_user_app_package_auto_generation',
        'phase_10b_tab_boundary',
      ]),
    );
  });
});
