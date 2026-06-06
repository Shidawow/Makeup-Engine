import { describe, expect, it } from 'vitest';
import { createUserAppTrialContentReadinessReport } from '../src/user-app';
import {
  userAppTrialContentReadinessBlockedExample,
  userAppTrialContentReadinessReadyExample,
  userAppTrialContentReadinessWarningExample,
  userAppTrialTemplateSelectionReadyExample,
} from '../src/templates/examples';

describe('User App trial content readiness', () => {
  it('reports real-user-trial content readiness when trial pack and templates are ready', () => {
    expect(userAppTrialContentReadinessReadyExample.schemaVersion).toBe(
      'user-app-trial-content-readiness-v0.1',
    );
    expect(userAppTrialContentReadinessReadyExample.status).toBe('ready_for_real_user_trial');
    expect(userAppTrialContentReadinessReadyExample.trialReadyTemplateIds.length).toBeGreaterThan(0);
    expect(userAppTrialContentReadinessReadyExample.productionRelease).toBe(false);
    expect(userAppTrialContentReadinessReadyExample.collectsUserPhotos).toBe(false);
    expect(userAppTrialContentReadinessReadyExample.writesTrainingInput).toBe(false);
  });

  it('keeps warning selections as ready_with_warnings', () => {
    expect(userAppTrialContentReadinessWarningExample.status).toBe('ready_with_warnings');
    expect(userAppTrialContentReadinessWarningExample.backupTemplateIds.length).toBeGreaterThan(0);
  });

  it('blocks unsafe boundaries and blocked content', () => {
    expect(userAppTrialContentReadinessBlockedExample.status).toBe('blocked');

    const unsafe = createUserAppTrialContentReadinessReport({
      templateSelectionReport: userAppTrialTemplateSelectionReadyExample,
      hasPrivacyBoundaryCopy: true,
      usesBackend: true,
      callsOpenAiApi: true,
      collectsUserPhotos: true,
      writesTrainingInput: true,
      writesProjectStateUserRecords: true,
      mutatesTemplatePackage: true,
    });

    expect(unsafe.status).toBe('blocked');
    expect(unsafe.issues.map((issue) => issue.area)).toEqual(
      expect.arrayContaining(['local_boundary', 'privacy_boundary', 'template_content']),
    );
  });
});
