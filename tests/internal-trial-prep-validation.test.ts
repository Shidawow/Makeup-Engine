import { describe, expect, it } from 'vitest';
import {
  createInternalTrialPrepReport,
  validateInternalTrialPrep,
} from '../src/template-engine';
import {
  internalFounderDemoRunReadyExample,
  internalTrialFeedbackPromptsUnsafeExample,
  internalTrialPrepBlockedByAnalyticsExample,
  internalTrialPrepBlockedByAutomationClaimExample,
  internalTrialPrepBlockedByContactExample,
  internalTrialPrepBlockedByPhotoExample,
  internalTrialPrepBlockedByRegistryExample,
  internalTrialPrepReadyExample,
} from '../src/templates/examples';

describe('Internal Trial Prep validation', () => {
  it('marks clean internal trial prep ready', () => {
    const validation = validateInternalTrialPrep(internalTrialPrepReadyExample);

    expect(validation.status).toBe('internal_trial_prep_ready');
    expect(validation.safeParticipantProfiles).toHaveLength(6);
    expect(validation.safeFeedbackPromptIds).toHaveLength(8);
    expect(validation.blockedReasons).toEqual([]);
    expect(validation.nextAction).toBe('proceed_to_internal_trial_dry_run');
    expect(validation.jsonRoundTripStable).toBe(true);
  });

  it('blocks personal data and contact collection', () => {
    const validation = validateInternalTrialPrep(internalTrialPrepBlockedByContactExample);

    expect(validation.status).toBe('internal_trial_prep_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'no_personal_data',
        'no_contact_collection',
        'feedback_prompts_safe',
      ]),
    );
  });

  it('blocks unsafe participant profiles that are not role-only', () => {
    const report = createInternalTrialPrepReport({
      sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
      participantProfiles: [
        {
          id: 'founder',
          label: 'Alice Zhang 13800000000',
          roleOnly: false as true,
          purpose: '真实姓名和电话不允许进入参与者画像。',
          allowedObservation: ['contact follow-up'],
          forbiddenData: [],
        },
      ],
    });
    const validation = validateInternalTrialPrep(report);

    expect(validation.status).toBe('internal_trial_prep_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toContain(
      'participant_profiles_are_roles_only',
    );
  });

  it('blocks real photo, base64, and local photo path scope', () => {
    const photoValidation = validateInternalTrialPrep(internalTrialPrepBlockedByPhotoExample);
    const pathReport = {
      ...internalTrialPrepReadyExample,
      operatorSummary: 'Use /Users/star/Desktop/photo.png and data:image/png;base64,aaa',
      noBase64OrLocalPhotoPath: false,
    };
    const pathValidation = validateInternalTrialPrep(pathReport);

    expect(photoValidation.status).toBe('internal_trial_prep_blocked');
    expect(photoValidation.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining(['no_real_photo_storage', 'no_base64_or_local_photo_path']),
    );
    expect(pathValidation.status).toBe('internal_trial_prep_blocked');
    expect(pathValidation.issues.map((issue) => issue.checkId)).toContain(
      'no_base64_or_local_photo_path',
    );
  });

  it('blocks analytics, backend, and database scope', () => {
    const validation = validateInternalTrialPrep(internalTrialPrepBlockedByAnalyticsExample);

    expect(validation.status).toBe('internal_trial_prep_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'no_analytics_scope',
        'no_backend_scope',
        'no_database_scope',
      ]),
    );
  });

  it('blocks registry write, publish, and production writer scope', () => {
    const validation = validateInternalTrialPrep(internalTrialPrepBlockedByRegistryExample);

    expect(validation.status).toBe('internal_trial_prep_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'no_registry_write',
        'no_publish',
        'no_production_writer',
      ]),
    );
  });

  it('blocks shell replacement, fully automatic extraction, and AI confirmed claims', () => {
    const shellReport = createInternalTrialPrepReport({
      sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
      noUserAppShellReplacement: false,
    });
    const shellValidation = validateInternalTrialPrep(shellReport);
    const automationValidation = validateInternalTrialPrep(
      internalTrialPrepBlockedByAutomationClaimExample,
    );

    expect(shellValidation.status).toBe('internal_trial_prep_blocked');
    expect(shellValidation.issues.map((issue) => issue.checkId)).toContain(
      'no_user_app_shell_replacement',
    );
    expect(automationValidation.status).toBe('internal_trial_prep_blocked');
    expect(automationValidation.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'no_fully_automatic_extraction_claim',
        'no_ai_confirmed_claim',
      ]),
    );
  });

  it('blocks missing trial route coverage and unsafe feedback prompts', () => {
    const report = createInternalTrialPrepReport({
      sourceFounderDemoRunReport: internalFounderDemoRunReadyExample,
      trialRoutes: [],
      feedbackPrompts: internalTrialFeedbackPromptsUnsafeExample,
    });
    const validation = validateInternalTrialPrep(report);

    expect(validation.status).toBe('internal_trial_prep_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining(['trial_routes_defined', 'feedback_prompts_safe']),
    );
  });
});
