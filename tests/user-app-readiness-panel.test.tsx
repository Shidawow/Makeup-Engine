import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppReadinessPanel } from '../src/components/user-app';
import { userAppReadinessExampleReport } from '../src/templates/examples';

describe('UserAppReadinessPanel', () => {
  it('renders readiness checks in Chinese without unsafe runtime references', () => {
    const html = renderToStaticMarkup(
      <UserAppReadinessPanel report={userAppReadinessExampleReport} />,
    );

    expect(html).toContain('App 就绪度检查');
    expect(html).toContain('模板包');
    expect(html).toContain('移动端交互 QA');
    expect(html).toContain('不会创建生产 App');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
