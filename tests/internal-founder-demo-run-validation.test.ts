import { describe, expect, it } from 'vitest';
import {
  createInternalFounderDemoRunReport,
  validateInternalFounderDemoRun,
} from '../src/template-engine';
import {
  internalFounderDemoRunBlockedByAutomationClaimExample,
  internalFounderDemoRunBlockedByRegistryExample,
  internalFounderDemoRunBlockedByUserTermLeakExample,
  internalFounderDemoRunReadyExample,
  mvpDemoGapResolutionSprint1ReadyExample,
} from '../src/templates/examples';

describe('Internal Founder Demo Run validation', () => {
  it('marks a clean local founder demo run ready', () => {
    const validation = validateInternalFounderDemoRun(internalFounderDemoRunReadyExample);

    expect(validation.status).toBe('demo_run_ready');
    expect(validation.readyRoutes).toHaveLength(5);
    expect(validation.blockedRoutes).toEqual([]);
    expect(validation.nextAction).toBe('proceed_to_internal_trial_prep');
    expect(validation.jsonRoundTripStable).toBe(true);
  });

  it('blocks missing or blocked demo routes', () => {
    const report = createInternalFounderDemoRunReport({
      sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
      userAppPathComplete: false,
    });
    const validation = validateInternalFounderDemoRun(report);

    expect(validation.status).toBe('demo_run_blocked');
    expect(validation.blockedRoutes).toContain('route_a_user_app_mvp');
    expect(validation.issues.map((issue) => issue.checkId)).toContain(
      'route_a_user_app_complete',
    );
  });

  it('blocks registry, publish, production writer, and shell replacement violations', () => {
    const report = createInternalFounderDemoRunReport({
      sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
      noRegistryWrite: false,
      noPublish: false,
      noProductionWriter: false,
      noUserAppShellReplacement: false,
    });
    const validation = validateInternalFounderDemoRun(report);

    expect(validation.status).toBe('demo_run_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toEqual(
      expect.arrayContaining([
        'no_registry_write',
        'no_publish',
        'no_production_writer',
        'no_user_app_shell_replacement',
      ]),
    );
  });

  it('blocks real user data or analytics collection scope', () => {
    const report = createInternalFounderDemoRunReport({
      sourceResolutionReport: mvpDemoGapResolutionSprint1ReadyExample,
      noAnalytics: false,
      noRealUserPhotos: false,
      noBase64OrLocalPhotoPath: false,
      noPersonalData: false,
      noRealUserFeedbackCollection: false,
    });
    const validation = validateInternalFounderDemoRun(report);

    expect(validation.status).toBe('demo_run_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toContain(
      'no_real_user_data_collection',
    );
  });

  it('blocks fully automatic extraction and AI confirmed claims', () => {
    const autoValidation = validateInternalFounderDemoRun(
      internalFounderDemoRunBlockedByAutomationClaimExample,
    );
    const aiReport = {
      ...internalFounderDemoRunReadyExample,
      founderFacingSummary: 'AI confirmed the demo route automatically.',
    };
    const aiValidation = validateInternalFounderDemoRun(aiReport);

    expect(autoValidation.status).toBe('demo_run_blocked');
    expect(autoValidation.issues.map((issue) => issue.checkId)).toContain(
      'no_fully_automatic_extraction_claim',
    );
    expect(aiValidation.status).toBe('demo_run_blocked');
    expect(aiValidation.issues.map((issue) => issue.checkId)).toContain(
      'no_ai_confirmed_claim',
    );
  });

  it('blocks ordinary user path internal terminology leaks', () => {
    const validation = validateInternalFounderDemoRun(
      internalFounderDemoRunBlockedByUserTermLeakExample,
    );

    expect(validation.status).toBe('demo_run_blocked');
    expect(validation.issues.map((issue) => issue.checkId)).toContain(
      'ordinary_user_path_internal_terms_hidden',
    );
  });

  it('keeps registry boundary examples blocked', () => {
    const validation = validateInternalFounderDemoRun(
      internalFounderDemoRunBlockedByRegistryExample,
    );

    expect(validation.status).toBe('demo_run_blocked');
    expect(validation.nextAction).toBe('run_second_gap_resolution_sprint');
  });
});
