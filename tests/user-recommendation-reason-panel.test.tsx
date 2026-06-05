import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserRecommendationReasonPanel } from '../src/components/user-app';
import { createTemplateRecommendations } from '../src/user-app';
import {
  beginnerRecommendationContextExample,
  userAppTemplateDiscoveryExamplePackage,
} from '../src/templates/examples';

describe('UserRecommendationReasonPanel', () => {
  it('renders selected recommendation reasons and empty state', () => {
    const recommendation = createTemplateRecommendations({
      packageData: userAppTemplateDiscoveryExamplePackage,
      preferences: beginnerRecommendationContextExample,
      maxRecommendations: 1,
      localOnly: true,
      ruleBased: true,
      usesAiApi: false,
      writesTrainingInput: false,
      modifiesTemplatePackage: false,
      writesProjectState: false,
    })[0];
    const html = renderToStaticMarkup(
      <UserRecommendationReasonPanel recommendation={recommendation} />,
    );
    const emptyHtml = renderToStaticMarkup(<UserRecommendationReasonPanel />);

    expect(html).toContain('Recommendation reasons');
    expect(html).toContain(recommendation.title);
    expect(html).not.toContain('trainingInput');
    expect(emptyHtml.length).toBeGreaterThan(0);
    expect(emptyHtml).not.toContain('OpenAI');
  });
});
