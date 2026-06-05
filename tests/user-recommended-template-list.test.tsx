import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserRecommendedTemplateList } from '../src/components/user-app';
import { createTemplateRecommendations } from '../src/user-app';
import {
  beginnerRecommendationContextExample,
  userAppTemplateDiscoveryExamplePackage,
} from '../src/templates/examples';

describe('UserRecommendedTemplateList', () => {
  it('renders recommendations and empty state', () => {
    const recommendations = createTemplateRecommendations({
      packageData: userAppTemplateDiscoveryExamplePackage,
      preferences: beginnerRecommendationContextExample,
      maxRecommendations: 3,
      localOnly: true,
      ruleBased: true,
      usesAiApi: false,
      writesTrainingInput: false,
      modifiesTemplatePackage: false,
      writesProjectState: false,
    });
    const html = renderToStaticMarkup(
      <UserRecommendedTemplateList recommendations={recommendations} />,
    );
    const emptyHtml = renderToStaticMarkup(
      <UserRecommendedTemplateList recommendations={[]} />,
    );

    expect(html).toContain('推荐 #1');
    expect(html).toContain('查看这套妆容');
    expect(html).toContain('新手');
    expect(emptyHtml).toContain('暂时没有可推荐的妆容');
  });
});
