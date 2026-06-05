import { describe, expect, it } from 'vitest';
import {
  createTemplateDiscoveryResult,
  createTemplateRecommendations,
  scoreTemplateForLocalPreferences,
  summarizeTemplateRecommendations,
  validateRecommendationBoundary,
} from '../src/user-app';
import {
  beginnerRecommendationContextExample,
  minimalToolsRecommendationContextExample,
  noPreferencesRecommendationContextExample,
  shortTimeRecommendationContextExample,
  userAppTemplateDiscoveryExamplePackage,
} from '../src/templates/examples';

const createContext = () => ({
  packageData: userAppTemplateDiscoveryExamplePackage,
  preferences: beginnerRecommendationContextExample,
  localOnly: true as const,
  ruleBased: true as const,
  usesAiApi: false as const,
  writesTrainingInput: false as const,
  modifiesTemplatePackage: false as const,
  writesProjectState: false as const,
});

describe('user template recommendation placeholder', () => {
  it('creates deterministic local recommendations and excludes blocked templates', () => {
    const before = JSON.stringify(userAppTemplateDiscoveryExamplePackage);
    const recommendations = createTemplateRecommendations(createContext());
    const after = JSON.stringify(userAppTemplateDiscoveryExamplePackage);

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.every((recommendation) => recommendation.localOnly)).toBe(true);
    expect(recommendations.every((recommendation) => recommendation.ruleBased)).toBe(true);
    expect(recommendations.every((recommendation) => recommendation.usesAiApi === false)).toBe(true);
    expect(recommendations.every((recommendation) => recommendation.writesTrainingInput === false)).toBe(true);
    expect(recommendations.map((recommendation) => recommendation.appTemplateId)).not.toContain(
      'user-app-discovery-blocked-missing-region',
    );
    expect(after).toBe(before);
  });

  it('prioritizes beginner, short-time, and minimal-tools preferences explainably', () => {
    const beginnerTop = createTemplateRecommendations({
      ...createContext(),
      preferences: beginnerRecommendationContextExample,
    })[0];
    const shortTimeTop = createTemplateRecommendations({
      ...createContext(),
      preferences: shortTimeRecommendationContextExample,
    })[0];
    const minimalToolsTop = createTemplateRecommendations({
      ...createContext(),
      preferences: minimalToolsRecommendationContextExample,
    })[0];

    expect(beginnerTop.title).toContain('Beginner');
    expect(beginnerTop.whyRecommended).toContain('新手');
    expect(shortTimeTop.title).toContain('Five Minute');
    expect(shortTimeTop.whyRecommended).toContain('时间不多');
    expect(minimalToolsTop.whyRecommended).toMatch(/工具/);
  });

  it('keeps warning templates recommendable with warning messages', () => {
    const recommendations = createTemplateRecommendations({
      ...createContext(),
      preferences: noPreferencesRecommendationContextExample,
      maxRecommendations: 8,
    });
    const warning = recommendations.find((recommendation) =>
      recommendation.title.includes('Warning'),
    );

    expect(warning).toBeDefined();
    expect(warning?.status).toBe('warning');
    expect(warning?.warningMessages.join('\n')).toContain('工具');
  });

  it('scores the same template deterministically', () => {
    const result = createTemplateDiscoveryResult({
      template: userAppTemplateDiscoveryExamplePackage.templates[0],
      preferredStyleTags: beginnerRecommendationContextExample.preferredStyleTags,
    });
    const first = scoreTemplateForLocalPreferences({
      result,
      preferences: beginnerRecommendationContextExample,
    });
    const second = scoreTemplateForLocalPreferences({
      result,
      preferences: beginnerRecommendationContextExample,
    });

    expect(second).toEqual(first);
    expect(first.deterministic).toBe(true);
  });

  it('validates recommendation boundary against APIs, runtime references, and training markers', () => {
    expect(validateRecommendationBoundary(createContext())).toEqual([]);
    expect(
      validateRecommendationBoundary({
        ...createContext(),
        usesAiApi: true,
        trainingInput: true,
        recommendationApiUrl: 'https://example.test/recommend',
        objectUrl: 'blob:http://local/recommendation',
      }).map((issue) => issue.code),
    ).toEqual(expect.arrayContaining(['ai_api_not_allowed', 'unsafe_boundary']));
  });

  it('summarizes recommendations as local-only and non-mutating', () => {
    const recommendations = createTemplateRecommendations(createContext());
    const summary = summarizeTemplateRecommendations({ recommendations });

    expect(summary.recommendedTemplates).toBe(recommendations.length);
    expect(summary.localOnly).toBe(true);
    expect(summary.usesAiApi).toBe(false);
    expect(summary.modifiesTemplatePackage).toBe(false);
  });
});
