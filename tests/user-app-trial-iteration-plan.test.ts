import { describe, expect, it } from 'vitest';
import {
  createUserAppTrialIterationPlan,
  type UserAppTrialIterationWorkstream,
} from '../src/user-app';
import {
  userAppTrialIterationPlanCleanExample,
  userAppTrialIterationPlanContentHeavyExample,
  userAppTrialIterationPlanLowConfidenceObserveMoreExample,
  userAppTrialIterationPlanPrivacyBlockerExample,
  userAppTrialIterationPlanReadyForNextInternalTrialExample,
  userAppTrialIterationPlanShellHeavyExample,
} from '../src/templates/examples';

describe('User App trial iteration plan', () => {
  it('creates ready, warning, and blocked iteration statuses', () => {
    expect(userAppTrialIterationPlanReadyForNextInternalTrialExample.status).toBe(
      'iteration_ready',
    );
    expect(userAppTrialIterationPlanCleanExample.status).toBe(
      'iteration_ready_with_warnings',
    );
    expect(userAppTrialIterationPlanPrivacyBlockerExample.status).toBe(
      'iteration_blocked',
    );
  });

  it('routes content-heavy reviews to template content iteration', () => {
    expect(userAppTrialIterationPlanContentHeavyExample.workstreams).toContain(
      'template_content_iteration',
    );
    expect(userAppTrialIterationPlanContentHeavyExample.actions[0].nextStep).toContain(
      '模板内容',
    );
  });

  it('routes shell-heavy reviews to shell iteration', () => {
    expect(userAppTrialIterationPlanShellHeavyExample.workstreams).toContain(
      'user_app_shell_iteration',
    );
    expect(userAppTrialIterationPlanShellHeavyExample.actions[0].nextStep).toContain(
      'Shell',
    );
  });

  it('routes privacy blockers to privacy boundary iteration and prevents next trial readiness', () => {
    expect(userAppTrialIterationPlanPrivacyBlockerExample.workstreams).toContain(
      'privacy_boundary_iteration',
    );
    expect(userAppTrialIterationPlanPrivacyBlockerExample.nextInternalTrialReady).toBe(
      false,
    );
    expect(userAppTrialIterationPlanPrivacyBlockerExample.risks[0].severity).toBe(
      'critical',
    );
  });

  it('keeps low-confidence issues in observe-more workstream', () => {
    expect(userAppTrialIterationPlanLowConfidenceObserveMoreExample.workstreams).toContain(
      'no_action_observe_more',
    );
    expect(
      userAppTrialIterationPlanLowConfidenceObserveMoreExample.backlog.items[0]
        .priorityRecommendation.priority,
    ).toBe('observe_more');
  });

  it('defines the required workstream vocabulary', () => {
    const workstreams: UserAppTrialIterationWorkstream[] = [
      'template_content_iteration',
      'user_app_shell_iteration',
      'trial_pack_iteration',
      'privacy_boundary_iteration',
      'discovery_recommendation_iteration',
      'session_preference_iteration',
      'no_action_observe_more',
    ];

    expect(workstreams).toHaveLength(7);
  });

  it('stays local-only, deterministic, mock-only, and non-training', () => {
    const plan = createUserAppTrialIterationPlan({ readyForNextInternalTrial: true });

    expect(plan.localOnly).toBe(true);
    expect(plan.deterministic).toBe(true);
    expect(plan.mockOnly).toBe(true);
    expect(plan.anonymousOrExampleOnly).toBe(true);
    expect(plan.productionRelease).toBe(false);
    expect(plan.backendRecordSystem).toBe(false);
    expect(plan.usesAiAnalysis).toBe(false);
    expect(plan.writesTrainingInput).toBe(false);
    expect(plan.writesProjectStateUserRecords).toBe(false);
  });
});
