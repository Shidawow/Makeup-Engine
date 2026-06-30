import { describe, expect, it } from 'vitest';
import { mvpTrialContentPackReadyExample } from '../src/templates/examples';

const unsafePattern =
  /AI 已确认|自动识别你的妆容|来自真实照片自动识别|你的照片显示|模型判断|fully automatic|production ready|已发布模板|registry written|医学承诺|治疗|精准匹配.*色号/i;

describe('trial template content consistency', () => {
  it('keeps the three trial templates structurally consistent', () => {
    const pack = mvpTrialContentPackReadyExample;

    expect(pack.templates.map((template) => template.title)).toEqual([
      '新手通勤淡妆',
      '日系温柔约会妆',
      '韩系清透低饱和妆',
    ]);

    for (const template of pack.templates) {
      expect(template.title).toBeTruthy();
      expect(template.summary).toBeTruthy();
      expect(template.suitableScenarios.length).toBe(4);
      expect(template.targetUser).toBeTruthy();
      expect(['easy', 'medium']).toContain(template.difficulty);
      expect(template.estimatedMinutes).toBeGreaterThanOrEqual(12);
      expect(template.toolsChecklist.length).toBe(5);
      expect(template.productPlaceholders.length).toBe(5);
      expect(template.steps.length).toBe(3);
      expect(template.completionReview.length).toBe(4);
      expect(template.demoRiskNotes.length).toBe(3);
      expect(template.sourceLabel).toBe('local_trial_content');
      expect(template.notFromAutomaticExtraction).toBe(true);
      expect(template.humanReviewRecommended).toBe(true);

      for (const step of template.steps) {
        expect(step.region).toBeTruthy();
        expect(step.goal.length).toBeGreaterThanOrEqual(10);
        expect(step.instruction.length).toBeGreaterThan(10);
        expect(step.beginnerTip.length).toBeGreaterThan(8);
        expect(step.commonMistakes.length).toBe(2);
        expect(step.correctionTips.length).toBe(2);
      }
    }
  });

  it('does not claim automatic extraction, medical outcomes, or exact shade truth', () => {
    const userFacingCopy = mvpTrialContentPackReadyExample.templates.map((template) => ({
      title: template.title,
      englishLabel: template.englishLabel,
      summary: template.summary,
      suitableScenarios: template.suitableScenarios,
      targetUser: template.targetUser,
      toolsChecklist: template.toolsChecklist,
      productPlaceholders: template.productPlaceholders,
      steps: template.steps,
      completionReview: template.completionReview,
    }));
    const copy = JSON.stringify(userFacingCopy);

    expect(copy).not.toMatch(unsafePattern);
  });
});
