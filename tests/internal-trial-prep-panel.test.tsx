import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InternalTrialPrepPanel } from '../src/components/template-studio/InternalTrialPrepPanel';
import {
  internalTrialPrepReadyExample,
  internalTrialPrepValidationReadyExample,
} from '../src/templates/examples';

describe('InternalTrialPrepPanel', () => {
  it('renders internal trial prep readiness, role profiles, routes, and prompts', () => {
    const html = renderToStaticMarkup(
      <InternalTrialPrepPanel
        report={internalTrialPrepReadyExample}
        validation={internalTrialPrepValidationReadyExample}
      />,
    );

    expect(html).toContain('Internal Trial Prep');
    expect(html).toContain('Internal Trial Prep，不是公开试用');
    expect(html).toContain('不是真实用户研究系统');
    expect(html).toContain('当前仍是本地 MVP demo');
    expect(html).toContain('只使用角色画像，不保存真实个人信息');
    expect(html).toContain('不接 analytics');
    expect(html).toContain('不上传照片 / 不保存照片');
    expect(html).toContain('不能写 registry / 不能 publish');
    expect(html).toContain('Trial readiness');
    expect(html).toContain('Participant role profiles');
    expect(html).toContain('Safe feedback prompts');
    expect(html).toContain('User App MVP trial');
    expect(html).toContain('Mobile demo trial');
    expect(html).toContain('Template content review');
    expect(html).toContain('Photo-to-template operator demo');
    expect(html).toContain('Boundary understanding check');
    expect(html).toContain('你是否一眼看懂这个 App 是做什么的？');
    expect(html).toContain('你是否愿意继续看更多妆容模板？');
    expect(html).toContain('Phase 14C - Internal Trial Dry Run');
  });

  it('shows privacy boundaries without positive production claims', () => {
    const html = renderToStaticMarkup(
      <InternalTrialPrepPanel
        report={internalTrialPrepReadyExample}
        validation={internalTrialPrepValidationReadyExample}
      />,
    );

    expect(html).toContain('No data / no analytics / no photo storage：yes');
    expect(html).toContain('Registry chain paused after Phase 10U：yes');
    expect(html).toContain('internal_trial_prep_ready');
    expect(html).not.toContain('已发布');
    expect(html).not.toContain('已写入 registry');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('AI confirmed');
  });
});
