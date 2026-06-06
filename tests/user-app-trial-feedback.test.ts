import { describe, expect, it } from 'vitest';
import {
  createUserAppTrialFeedbackForm,
  summarizeUserAppTrialFeedback,
  validateUserAppTrialFeedbackSafety,
} from '../src/user-app';
import {
  userAppTrialFeedbackBlockedExample,
  userAppTrialFeedbackMockAnswers,
  userAppTrialFeedbackMockSummary,
  userAppTrialFeedbackReadyExample,
  userAppTrialFeedbackUnsafeExampleIssues,
  userAppTrialFeedbackUnsafeExamplePayload,
} from '../src/templates/examples';

describe('User App trial feedback model', () => {
  it('creates a complete privacy-safe local feedback form', () => {
    expect(userAppTrialFeedbackReadyExample.schemaVersion).toBe(
      'user-app-trial-feedback-v0.1',
    );
    expect(userAppTrialFeedbackReadyExample.status).toBe('ready');
    expect(userAppTrialFeedbackReadyExample.questions.map((question) => question.questionId)).toEqual([
      'understandable',
      'willing_to_follow',
      'step_count_fit',
      'tools_useful',
      'recommendation_helpful',
      'privacy_clear',
      'most_confusing_step',
      'continue_using',
      'business_interest',
      'free_text',
    ]);
    expect(userAppTrialFeedbackReadyExample.submitsToBackend).toBe(false);
    expect(userAppTrialFeedbackReadyExample.collectsRealName).toBe(false);
    expect(userAppTrialFeedbackReadyExample.collectsContact).toBe(false);
    expect(userAppTrialFeedbackReadyExample.collectsPhoto).toBe(false);
    expect(userAppTrialFeedbackReadyExample.collectsHealthInfo).toBe(false);
    expect(userAppTrialFeedbackReadyExample.writesTrainingInput).toBe(false);
  });

  it('blocks incomplete or unsafe feedback form boundaries', () => {
    expect(userAppTrialFeedbackBlockedExample.status).toBe('blocked');
    expect(userAppTrialFeedbackBlockedExample.issues.map((issue) => issue.area)).toEqual(
      expect.arrayContaining(['form', 'boundary']),
    );

    const missing = createUserAppTrialFeedbackForm({ questions: [] });
    expect(missing.status).toBe('blocked');
  });

  it('blocks unsafe feedback with photo, base64, contact, health, or sensitive fields', () => {
    const issues = validateUserAppTrialFeedbackSafety(userAppTrialFeedbackUnsafeExamplePayload);
    const messages = issues.map((issue) => issue.message).join('\n');

    expect(issues.length).toBeGreaterThan(0);
    expect(messages).toContain('realName');
    expect(messages).toContain('contact');
    expect(messages).toContain('photoBase64');
    expect(messages).toContain('healthInfo');
    expect(userAppTrialFeedbackUnsafeExampleIssues.length).toBeGreaterThan(0);
  });

  it('summarizes mock feedback without writing training or project-state records', () => {
    const summary = summarizeUserAppTrialFeedback(userAppTrialFeedbackMockAnswers);

    expect(summary).toEqual(userAppTrialFeedbackMockSummary);
    expect(summary.answerCount).toBe(10);
    expect(summary.averageRating).toBe(4.4);
    expect(summary.mockOnly).toBe(true);
    expect(summary.localOnly).toBe(true);
    expect(summary.writesTrainingInput).toBe(false);
    expect(summary.writesProjectStateUserRecords).toBe(false);
    expect(JSON.stringify(summary)).not.toContain('data:image/');
  });
});
