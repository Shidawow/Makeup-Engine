import { describe, expect, it } from 'vitest';
import {
  createUserAppProductDecisionGate,
  type UserAppProductDecisionGateDecision,
} from '../src/user-app';
import {
  userAppProductDecisionGateContentIssueExample,
  userAppProductDecisionGateInsufficientSignalsExample,
  userAppProductDecisionGateMvpValidationExample,
  userAppProductDecisionGatePrivacyBlockerExample,
  userAppProductDecisionGateProductionDiscoveryExample,
  userAppProductDecisionGateShellIssueExample,
  userAppProductDecisionGateTrialOpsIssueExample,
} from '../src/templates/examples';

describe('User App product decision gate', () => {
  it('covers continue, revise content, revise shell, revise trial ops, pause, mvp validation, and no-go', () => {
    const decisions: UserAppProductDecisionGateDecision[] = [
      userAppProductDecisionGateInsufficientSignalsExample.decision,
      userAppProductDecisionGateContentIssueExample.decision,
      userAppProductDecisionGateShellIssueExample.decision,
      userAppProductDecisionGateTrialOpsIssueExample.decision,
      userAppProductDecisionGatePrivacyBlockerExample.decision,
      userAppProductDecisionGateMvpValidationExample.decision,
      createUserAppProductDecisionGate({ noGo: true }).decision,
    ];

    expect(decisions).toEqual(
      expect.arrayContaining([
        'continue_internal_trials',
        'revise_template_content_first',
        'revise_user_app_shell_first',
        'revise_trial_ops_first',
        'pause_for_privacy_or_scope_fix',
        'prepare_mvp_validation_plan',
        'no_go',
      ]),
    );
  });

  it('forces privacy, sensitive, upload, backend, or training blockers to pause/no-go', () => {
    expect(userAppProductDecisionGatePrivacyBlockerExample.status).toBe(
      'product_decision_blocked',
    );
    expect(userAppProductDecisionGatePrivacyBlockerExample.decision).toBe(
      'pause_for_privacy_or_scope_fix',
    );
    expect(userAppProductDecisionGatePrivacyBlockerExample.risks[0].severity).toBe(
      'critical',
    );
    expect(userAppProductDecisionGatePrivacyBlockerExample.risks[0].blocksProductionApp).toBe(
      true,
    );
  });

  it('does not overclaim when evidence is insufficient', () => {
    expect(userAppProductDecisionGateInsufficientSignalsExample.status).toBe(
      'product_decision_needs_more_evidence',
    );
    expect(userAppProductDecisionGateInsufficientSignalsExample.decision).toBe(
      'continue_internal_trials',
    );
  });

  it('allows production app discovery only as planning, not build approval', () => {
    expect(userAppProductDecisionGateProductionDiscoveryExample.decision).toBe(
      'prepare_production_app_discovery',
    );
    expect(userAppProductDecisionGateProductionDiscoveryExample.productionAppDiscoveryOnly).toBe(
      true,
    );
    expect(userAppProductDecisionGateProductionDiscoveryExample.productionBuildApproved).toBe(
      false,
    );
  });

  it('stays local-only, deterministic, mock-only, and non-training', () => {
    const gate = createUserAppProductDecisionGate();

    expect(gate.localOnly).toBe(true);
    expect(gate.deterministic).toBe(true);
    expect(gate.mockOnly).toBe(true);
    expect(gate.anonymousOrExampleOnly).toBe(true);
    expect(gate.backendRecordSystem).toBe(false);
    expect(gate.usesAiAnalysis).toBe(false);
    expect(gate.writesTrainingInput).toBe(false);
    expect(gate.writesProjectStateUserRecords).toBe(false);
  });
});
