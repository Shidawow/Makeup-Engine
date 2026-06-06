import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialGoNoGoPanel } from '../src/components/user-app';
import { userAppTrialGoNoGoWarningExample } from '../src/templates/examples';

describe('UserAppTrialGoNoGoPanel', () => {
  it('renders go/no-go signals and internal-trial-only boundary', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialGoNoGoPanel decision={userAppTrialGoNoGoWarningExample} />,
    );

    expect(html).toContain('试用 Go/No-Go');
    expect(html).toContain('内部小范围试用');
    expect(html).toContain('不是正式生产发布');
    expect(html).toContain('Go with warnings');
    expect(html).toContain('Phase 9A');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('getUserMedia');
  });
});
