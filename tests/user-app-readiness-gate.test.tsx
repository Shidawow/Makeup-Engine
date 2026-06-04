import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppReadinessGate } from '../src/components/user-app';
import {
  userAppBlockedReadinessExampleReport,
  userAppReadinessExampleReport,
} from '../src/templates/examples';

describe('UserAppReadinessGate', () => {
  it('shows the non-production gate status', () => {
    const html = renderToStaticMarkup(
      <UserAppReadinessGate report={userAppReadinessExampleReport} />,
    );

    expect(html).toContain('App readiness gate');
    expect(html).toContain('App 原型');
    expect(html).toContain('不是生产 App 发布');
  });

  it('shows blocking state when package readiness fails', () => {
    const html = renderToStaticMarkup(
      <UserAppReadinessGate report={userAppBlockedReadinessExampleReport} />,
    );

    expect(html).toContain('阻断');
    expect(html).toContain('不能进入 App 原型');
  });
});
