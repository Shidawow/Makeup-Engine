import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppMobileQaPanel } from '../src/components/user-app';
import { userAppReadinessExampleMobileQa } from '../src/templates/examples';

describe('UserAppMobileQaPanel', () => {
  it('renders mobile QA viewport and checklist state', () => {
    const html = renderToStaticMarkup(
      <UserAppMobileQaPanel result={userAppReadinessExampleMobileQa} />,
    );

    expect(html).toContain('移动端交互 QA');
    expect(html).toContain('小屏手机 375px');
    expect(html).toContain('按钮触控尺寸');
    expect(html).toContain('确定性清单检查');
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
  });
});
