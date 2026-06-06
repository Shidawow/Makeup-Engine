import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppMvpPolishChecklist } from '../src/components/user-app';
import { userAppMvpPolishReadyExampleReport } from '../src/templates/examples';

describe('UserAppMvpPolishChecklist', () => {
  it('renders the Phase 8B MVP polish checklist as admin QA', () => {
    const html = renderToStaticMarkup(
      <UserAppMvpPolishChecklist report={userAppMvpPolishReadyExampleReport} />,
    );

    expect(html).toContain('移动 Web MVP 打磨检查');
    expect(html).toContain('移动首页');
    expect(html).toContain('分步指导');
    expect(html).toContain('普通用户文案');
    expect(html).toContain('管理员 QA 分区');
    expect(html).toContain('本地边界');
    expect(html).toContain('不是正式发布审批');
  });
});
