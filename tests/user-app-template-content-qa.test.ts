import { describe, expect, it } from 'vitest';
import { createUserAppTemplateContentQaReport } from '../src/user-app';
import {
  userAppTemplateContentQaBlockedReport,
  userAppTemplateContentQaExamplePackage,
  userAppTemplateContentQaReadyReport,
  userAppTemplateContentQaWarningReport,
  userAppTrialMissingToolsTemplate,
  userAppTrialUnclearRegionTemplate,
} from '../src/templates/examples';

describe('User App template content QA', () => {
  it('marks a clear beginner template as trial-ready', () => {
    expect(userAppTemplateContentQaReadyReport.schemaVersion).toBe(
      'user-app-template-content-qa-v0.1',
    );
    expect(userAppTemplateContentQaReadyReport.status).toBe('trial_ready');
    expect(userAppTemplateContentQaReadyReport.recommendation.trialEligible).toBe(true);
    expect(userAppTemplateContentQaReadyReport.localOnly).toBe(true);
    expect(userAppTemplateContentQaReadyReport.callsOpenAiApi).toBe(false);
    expect(userAppTemplateContentQaReadyReport.collectsUserPhotos).toBe(false);
    expect(userAppTemplateContentQaReadyReport.writesTrainingInput).toBe(false);
  });

  it('keeps warning templates eligible only as warning content', () => {
    expect(userAppTemplateContentQaWarningReport.status).toBe('ready_with_warnings');
    expect(userAppTemplateContentQaWarningReport.issues.map((issue) => issue.severity)).toContain(
      'warning',
    );
  });

  it('blocks missing steps, missing regions, and internal technical terms', () => {
    const unclearRegion = createUserAppTemplateContentQaReport({
      packageData: userAppTemplateContentQaExamplePackage,
      template: userAppTrialUnclearRegionTemplate,
    });

    expect(userAppTemplateContentQaBlockedReport.status).toBe('blocked');
    expect(userAppTemplateContentQaBlockedReport.issues.map((issue) => issue.area)).toContain(
      'internal_terms',
    );
    expect(unclearRegion.status).toBe('blocked');
    expect(unclearRegion.issues.map((issue) => issue.area)).toContain('region_instruction');
  });

  it('requires missing tools to be revised before trial', () => {
    const missingTools = createUserAppTemplateContentQaReport({
      packageData: userAppTemplateContentQaExamplePackage,
      template: userAppTrialMissingToolsTemplate,
    });

    expect(missingTools.status).toBe('needs_content_revision');
    expect(missingTools.issues.map((issue) => issue.area)).toContain('tools');
  });
});
