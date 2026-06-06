import { describe, expect, it } from 'vitest';
import {
  createUserAppTrialReadinessReport,
  summarizeUserAppTrialReadiness,
} from '../src/user-app';
import {
  userAppTrialFeedbackBlockedExample,
  userAppTrialFeedbackReadyExample,
  userAppTrialPackIncompleteExample,
  userAppTrialPackReadyExample,
  userAppTrialReadinessBlockedExample,
  userAppTrialReadinessReadyExample,
  userAppTrialReadinessWarningExample,
} from '../src/templates/examples';

describe('User App trial readiness model', () => {
  it('creates ready_for_internal_trial when trial pack and feedback are complete', () => {
    const summary = JSON.parse(
      summarizeUserAppTrialReadiness(userAppTrialReadinessReadyExample),
    ) as {
      status: string;
      trialPackStatus: string;
      feedbackFormStatus: string;
      pwaStatus: string;
      mvpPolishStatus: string;
      localOnly: boolean;
      productionApp: boolean;
      usesBackend: boolean;
      uploadsData: boolean;
      usesCamera: boolean;
      usesAr: boolean;
      writesTrainingInput: boolean;
    };

    expect(userAppTrialReadinessReadyExample.schemaVersion).toBe(
      'user-app-trial-readiness-v0.1',
    );
    expect(userAppTrialReadinessReadyExample.checks.map((check) => check.area)).toEqual(
      expect.arrayContaining([
        'trial_tasks',
        'feedback_form',
        'privacy_copy',
        'local_boundary',
        'pwa_readiness',
        'mobile_shell',
        'user_path',
        'admin_qa_separation',
      ]),
    );
    expect(summary.status).toBe('ready_for_internal_trial');
    expect(summary.trialPackStatus).toBe('ready');
    expect(summary.feedbackFormStatus).toBe('ready');
    expect(summary.pwaStatus).toBe('ready');
    expect(summary.mvpPolishStatus).toBe('ready');
    expect(summary.localOnly).toBe(true);
    expect(summary.productionApp).toBe(false);
    expect(summary.usesBackend).toBe(false);
    expect(summary.uploadsData).toBe(false);
    expect(summary.usesCamera).toBe(false);
    expect(summary.usesAr).toBe(false);
    expect(summary.writesTrainingInput).toBe(false);
  });

  it('warns when trial scenario coverage needs more detail', () => {
    expect(userAppTrialReadinessWarningExample.status).toBe('ready_with_warnings');
    expect(userAppTrialReadinessWarningExample.issues.map((issue) => issue.area)).toContain(
      'local_boundary',
    );
  });

  it('blocks incomplete trial pack, unsafe feedback, backend, upload, camera, AR, or training', () => {
    expect(userAppTrialReadinessBlockedExample.status).toBe('blocked');

    const report = createUserAppTrialReadinessReport({
      trialPack: userAppTrialPackIncompleteExample,
      feedbackForm: userAppTrialFeedbackBlockedExample,
      usesBackend: true,
      uploadsData: true,
      usesCamera: true,
      usesAr: true,
      writesTrainingInput: true,
      writesProjectStateUserRecords: true,
    });
    const messages = report.issues.map((issue) => issue.message).join('\n');

    expect(report.status).toBe('blocked');
    expect(messages).toContain('试用任务不完整');
    expect(messages).toContain('反馈问题不完整');
    expect(messages).toContain('后端');
    expect(messages).toContain('相机');
    expect(messages).toContain('训练');
  });

  it('accepts explicit ready inputs', () => {
    const report = createUserAppTrialReadinessReport({
      trialPack: userAppTrialPackReadyExample,
      feedbackForm: userAppTrialFeedbackReadyExample,
    });

    expect(report.status).toBe('ready_for_internal_trial');
  });
});
