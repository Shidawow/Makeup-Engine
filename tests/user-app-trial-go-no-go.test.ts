import { describe, expect, it } from 'vitest';
import { createUserAppTrialGoNoGoDecision } from '../src/user-app';
import {
  userAppTrialGoNoGoReadyExample,
  userAppTrialGoNoGoWarningExample,
  userAppTrialNoGoContentQaBlockedExample,
  userAppTrialNoGoNoTemplatesExample,
  userAppTrialNoGoProductionViolationExample,
  userAppTrialNoGoUnsafeFeedbackExample,
  userAppTrialTemplateSelectionReadyExample,
} from '../src/templates/examples';

describe('User App trial go/no-go decision', () => {
  it('returns go_for_internal_trial for ready release evidence', () => {
    expect(userAppTrialGoNoGoReadyExample.schemaVersion).toBe(
      'user-app-trial-go-no-go-v0.1',
    );
    expect(userAppTrialGoNoGoReadyExample.decision).toBe('go_for_internal_trial');
    expect(userAppTrialGoNoGoReadyExample.nextRecommendedPhase).toBe('9A');
    expect(userAppTrialGoNoGoReadyExample.productionRelease).toBe(false);
    expect(userAppTrialGoNoGoReadyExample.appStoreRelease).toBe(false);
  });

  it('returns go_with_warnings when release evidence has warnings', () => {
    expect(userAppTrialGoNoGoWarningExample.decision).toBe('go_with_warnings');
    expect(userAppTrialGoNoGoWarningExample.issues.some(
      (issue) => issue.severity === 'warning',
    )).toBe(true);
  });

  it('returns no_go for no trial-ready templates, unsafe feedback, or blocked content QA', () => {
    expect(userAppTrialNoGoNoTemplatesExample.decision).toBe('no_go');
    expect(userAppTrialNoGoUnsafeFeedbackExample.decision).toBe('no_go');
    expect(userAppTrialNoGoContentQaBlockedExample.decision).toBe('no_go');
  });

  it('returns no_go for backend, camera, AR, training, production, or contract violations', () => {
    expect(userAppTrialNoGoProductionViolationExample.decision).toBe('no_go');

    const decision = createUserAppTrialGoNoGoDecision({
      trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
      usesBackend: true,
      usesCamera: true,
      usesAr: true,
      writesTrainingInput: true,
      userAppTemplatePackageContractBroken: true,
      productionNonGoalsViolated: true,
    });

    expect(decision.decision).toBe('no_go');
    expect(decision.issues.map((issue) => issue.area)).toEqual(
      expect.arrayContaining(['production_boundary', 'contract_boundary']),
    );
  });
});
