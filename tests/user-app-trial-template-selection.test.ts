import { describe, expect, it } from 'vitest';
import { createUserAppTrialTemplateSelectionReport } from '../src/user-app';
import {
  userAppTemplateContentQaExamplePackage,
  userAppTrialBlockedMissingStepsTemplate,
  userAppTrialReadyBeginnerTemplate,
  userAppTrialTemplateSelectionReadyExample,
  userAppTrialTemplateSelectionWarningExample,
} from '../src/templates/examples';

describe('User App trial template selection', () => {
  it('selects beginner, short-duration, natural trial-ready coverage', () => {
    expect(userAppTrialTemplateSelectionReadyExample.schemaVersion).toBe(
      'user-app-trial-template-selection-v0.1',
    );
    expect(userAppTrialTemplateSelectionReadyExample.status).toBe('ready');
    expect(userAppTrialTemplateSelectionReadyExample.coverage).toEqual({
      hasBeginnerFriendlyTemplate: true,
      hasShortDurationTemplate: true,
      hasNaturalDailyTemplate: true,
    });
    expect(userAppTrialTemplateSelectionReadyExample.trialReadyTemplates).toHaveLength(1);
  });

  it('keeps warning templates in backup, not the core trial-ready set', () => {
    expect(userAppTrialTemplateSelectionWarningExample.status).toBe('ready_with_warnings');
    expect(userAppTrialTemplateSelectionWarningExample.trialReadyTemplates).toHaveLength(1);
    expect(userAppTrialTemplateSelectionWarningExample.backupTemplates).toHaveLength(1);
    expect(userAppTrialTemplateSelectionWarningExample.backupTemplates[0].qaStatus).toBe(
      'ready_with_warnings',
    );
  });

  it('excludes blocked templates from the trial-ready set', () => {
    const report = createUserAppTrialTemplateSelectionReport({
      packageData: {
        ...userAppTemplateContentQaExamplePackage,
        packageId: 'selection-blocked-only',
        templates: [userAppTrialBlockedMissingStepsTemplate],
      },
    });

    expect(report.status).toBe('blocked');
    expect(report.trialReadyTemplates).toHaveLength(0);
    expect(report.blockedTemplates.map((template) => template.templateId)).toContain(
      userAppTrialBlockedMissingStepsTemplate.appTemplateId,
    );
  });

  it('does not mutate template package data', () => {
    const before = JSON.stringify(userAppTrialReadyBeginnerTemplate);
    createUserAppTrialTemplateSelectionReport({
      packageData: {
        ...userAppTemplateContentQaExamplePackage,
        packageId: 'selection-mutation-check',
        templates: [userAppTrialReadyBeginnerTemplate],
      },
    });
    expect(JSON.stringify(userAppTrialReadyBeginnerTemplate)).toBe(before);
  });
});
