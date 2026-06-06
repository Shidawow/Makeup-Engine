import { describe, expect, it } from 'vitest';
import { createUserAppMvpReleaseReadinessReport } from '../src/user-app';
import {
  userAppMvpReleaseReadinessContentBlockedExample,
  userAppMvpReleaseReadinessNoTrialTemplateExample,
  userAppMvpReleaseReadinessProductionViolationExample,
  userAppMvpReleaseReadinessReadyExample,
  userAppMvpReleaseReadinessUnsafeFeedbackExample,
  userAppMvpReleaseReadinessWarningExample,
  userAppTrialContentReadinessReadyExample,
  userAppTrialTemplateSelectionReadyExample,
} from '../src/templates/examples';

describe('User App MVP release readiness', () => {
  it('reports ready_for_internal_user_trial without production release scope', () => {
    expect(userAppMvpReleaseReadinessReadyExample.schemaVersion).toBe(
      'user-app-mvp-release-readiness-v0.1',
    );
    expect(userAppMvpReleaseReadinessReadyExample.status).toBe(
      'ready_for_internal_user_trial',
    );
    expect(userAppMvpReleaseReadinessReadyExample.nextRecommendedPhase).toBe('9A');
    expect(userAppMvpReleaseReadinessReadyExample.readyForInternalUserTrial).toBe(true);
    expect(userAppMvpReleaseReadinessReadyExample.readyForProductionRelease).toBe(false);
    expect(userAppMvpReleaseReadinessReadyExample.readyForAppStoreRelease).toBe(false);
    expect(userAppMvpReleaseReadinessReadyExample.usesBackend).toBe(false);
    expect(userAppMvpReleaseReadinessReadyExample.usesCamera).toBe(false);
    expect(userAppMvpReleaseReadinessReadyExample.usesAr).toBe(false);
    expect(userAppMvpReleaseReadinessReadyExample.writesTrainingInput).toBe(false);
  });

  it('keeps accepted release warnings as ready_with_warnings', () => {
    expect(userAppMvpReleaseReadinessWarningExample.status).toBe('ready_with_warnings');
    expect(userAppMvpReleaseReadinessWarningExample.readyForInternalUserTrial).toBe(true);
    expect(userAppMvpReleaseReadinessWarningExample.issues.some(
      (issue) => issue.severity === 'warning',
    )).toBe(true);
  });

  it('blocks no trial templates, unsafe feedback, content QA, and production violations', () => {
    expect(userAppMvpReleaseReadinessNoTrialTemplateExample.status).toBe('blocked');
    expect(userAppMvpReleaseReadinessUnsafeFeedbackExample.status).toBe('blocked');
    expect(userAppMvpReleaseReadinessContentBlockedExample.status).toBe('blocked');
    expect(userAppMvpReleaseReadinessProductionViolationExample.status).toBe('blocked');
    expect(userAppMvpReleaseReadinessProductionViolationExample.nextRecommendedPhase).toBe(
      '8E-1',
    );
  });

  it('blocks backend, camera, AR, training, external API, analytics, and contract violations', () => {
    const report = createUserAppMvpReleaseReadinessReport({
      trialContentReadinessReport: userAppTrialContentReadinessReadyExample,
      trialTemplateSelectionReport: userAppTrialTemplateSelectionReadyExample,
      usesBackend: true,
      usesCamera: true,
      usesAr: true,
      usesAnalytics: true,
      callsOpenAiApi: true,
      callsExternalApi: true,
      writesTrainingInput: true,
      writesProjectStateUserRecords: true,
      mutatesTemplatePackage: true,
      breaksUserAppTemplatePackageContract: true,
    });

    expect(report.status).toBe('blocked');
    expect(report.readyForInternalUserTrial).toBe(false);
    expect(report.issues.map((issue) => issue.area)).toContain('privacy_local_boundary');
  });
});
