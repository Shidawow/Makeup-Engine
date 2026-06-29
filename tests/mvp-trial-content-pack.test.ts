import { describe, expect, it } from 'vitest';
import { countCompleteMvpTrialTemplates } from '../src/template-engine';
import {
  mvpTrialContentPackBlockedExample,
  mvpTrialContentPackReadyExample,
  mvpTrialContentPackSingleTemplateWarningExample,
} from '../src/templates/examples';

describe('MVP trial content pack', () => {
  it('contains three complete founder-demo trial templates', () => {
    const pack = mvpTrialContentPackReadyExample;

    expect(pack.templates.map((template) => template.title)).toEqual([
      '新手通勤淡妆',
      '日系温柔约会妆',
      '韩系清透低饱和妆',
    ]);
    expect(countCompleteMvpTrialTemplates(pack)).toBe(3);
    expect(pack.registryChainPausedAfter10U).toBe(true);
    expect(pack.trialContentNotOfficialTemplateLibrary).toBe(true);
    expect(pack.noRealUserPhotoIncluded).toBe(true);
    expect(pack.noRegistryWrite).toBe(true);
    expect(pack.noPublish).toBe(true);
  });

  it('keeps each template local, human-reviewable, and user-facing', () => {
    for (const template of mvpTrialContentPackReadyExample.templates) {
      expect(template.sourceLabel).toMatch(/demo_fixture|local_trial_content/);
      expect(template.notFromAutomaticExtraction).toBe(true);
      expect(template.humanReviewRecommended).toBe(true);
      expect(template.steps.length).toBeGreaterThanOrEqual(3);
      expect(template.toolsChecklist.length).toBeGreaterThan(0);
      expect(template.productPlaceholders.length).toBeGreaterThan(0);
      expect(template.completionReview.length).toBeGreaterThan(0);

      const userFacingCopy = [
        template.title,
        template.summary,
        ...template.steps.flatMap((step) => [
          step.goal,
          step.instruction,
          step.beginnerTip,
          ...step.commonMistakes,
          ...step.correctionTips,
        ]),
      ].join(' ');

      expect(userFacingCopy).not.toMatch(/fully automatic|AI 已确认|已发布|production ready|medical diagnosis|精准匹配.*色号/i);
    }
  });

  it('can distinguish warning and blocked fixture shapes for founder review', () => {
    expect(countCompleteMvpTrialTemplates(mvpTrialContentPackSingleTemplateWarningExample)).toBe(1);
    expect(mvpTrialContentPackBlockedExample.noRegistryWrite).toBe(false);
  });
});
