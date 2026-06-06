import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialObservationPanel } from '../src/components/user-app';
import {
  userAppTrialObservationMockSummary,
  userAppTrialObservationReadyExample,
} from '../src/templates/examples';

describe('UserAppTrialObservationPanel', () => {
  it('renders the local observation guide without backend record scope', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialObservationPanel
        guide={userAppTrialObservationReadyExample}
        summary={userAppTrialObservationMockSummary}
      />,
    );

    expect(html).toContain('观察记录模板');
    expect(html).toContain('不是后端记录系统');
    expect(html).toContain('匿名体验现象');
    expect(html).toContain('mock/example 摘要');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('OpenAI');
  });
});
