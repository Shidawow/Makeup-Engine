import { describe, expect, it } from 'vitest';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const ordinaryUserTechnicalTerms = [
  'registry',
  'write gate',
  'production writer',
  'Pipeline Trace',
  'debug JSON',
  'UserAppTemplatePackage mutation',
  '正式发布',
  '已发布',
  '自动发布',
];

describe('User App template content quality', () => {
  it('uses Chinese user-facing title, subtitle, tags, occasions, tools, and products', () => {
    const [firstTemplate, secondTemplate] = userAppMvpShellExamplePackage.templates;

    expect(firstTemplate.title).toBe('柔玫瑰日常妆');
    expect(firstTemplate.subtitle).toContain('适合通勤和日常练习');
    expect(firstTemplate.styleTags).toEqual(
      expect.arrayContaining(['日常', '自然', '玫瑰色', '新手友好']),
    );
    expect(firstTemplate.suitableOccasions).toEqual(
      expect.arrayContaining(['通勤', '日常出门']),
    );
    expect(firstTemplate.requiredTools.map((tool) => tool.displayName)).toEqual(
      expect.arrayContaining(['小号晕染刷', '指腹']),
    );
    expect(firstTemplate.productSuggestions.map((product) => product.displayName)).toEqual(
      expect.arrayContaining(['玫瑰豆沙唇色', '柔玫瑰腮红']),
    );

    expect(secondTemplate.title).toBe('暖棕约会妆');
    expect(secondTemplate.subtitle).toContain('适合晚餐和小型活动');
  });

  it('has concrete step instructions with region, tool, product, mistakes, and corrections', () => {
    const template = userAppMvpShellExamplePackage.templates[0];

    for (const step of template.steps) {
      expect(step.title.length).toBeGreaterThan(3);
      expect(step.instructionText).toMatch(/[。]/);
      expect(step.toolIds.length).toBeGreaterThan(0);
      expect(step.productIds.length).toBeGreaterThan(0);
      expect(step.commonMistakes.length).toBeGreaterThan(0);
      expect(step.correctionTips.length).toBeGreaterThan(0);
      expect(step.targetEffect).toBeTruthy();
      expect(step.technique).toBeTruthy();
    }
  });

  it('keeps content local-only and free of admin registry chain copy', () => {
    const content = JSON.stringify(userAppMvpShellExamplePackage);

    expect(userAppMvpShellExamplePackage.localOnly).toBe(true);
    expect(userAppMvpShellExamplePackage.onlinePublished).toBe(false);
    expect(content).toContain('no object URLs');
    expect(content).toContain('no local absolute paths');
    expect(content).toContain('no large image bytes');

    for (const term of ordinaryUserTechnicalTerms) {
      expect(content).not.toContain(term);
    }
  });
});
