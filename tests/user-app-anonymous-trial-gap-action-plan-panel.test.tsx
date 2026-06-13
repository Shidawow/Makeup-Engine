import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppAnonymousTrialGapActionPlanPanel } from '../src/components/user-app';
import { userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample } from '../src/templates/examples';

describe('UserAppAnonymousTrialGapActionPlanPanel', () => {
  it('renders Chinese action plan copy and privacy boundary', () => {
    const html = renderToStaticMarkup(
      <UserAppAnonymousTrialGapActionPlanPanel
        actionPlan={userAppAnonymousTrialGapActionPlanMissingParticipantNoticeExample}
      />,
    );
    expect(html).toContain('证据缺口行动计划');
    expect(html).toContain('P1 下一轮前必须修');
    expect(html).toContain('不保存真实个人身份');
    expect(html).toContain('不上传');
    expect(html).toContain('不训练');
  });
});
