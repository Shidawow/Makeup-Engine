import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTrialOutcomePanel } from '../src/components/user-app';
import { userAppTrialOutcomeContinueExample } from '../src/templates/examples';

describe('UserAppTrialOutcomePanel', () => {
  it('renders trial outcome review without production or training scope', () => {
    const html = renderToStaticMarkup(
      <UserAppTrialOutcomePanel review={userAppTrialOutcomeContinueExample} />,
    );

    expect(html).toContain('试用结果复盘');
    expect(html).toContain('继续更多内部试用');
    expect(html).toContain('不保存真实参与者记录');
    expect(html).toContain('不写入训练数据');
    expect(html).not.toContain('App Store');
    expect(html).not.toContain('getUserMedia');
  });
});
