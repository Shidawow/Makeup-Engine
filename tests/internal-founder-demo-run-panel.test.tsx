import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InternalFounderDemoRunPanel } from '../src/components/template-studio/InternalFounderDemoRunPanel';
import {
  internalFounderDemoRunReadyExample,
  internalFounderDemoRunValidationReadyExample,
} from '../src/templates/examples';

describe('InternalFounderDemoRunPanel', () => {
  it('renders the admin-only founder demo route summary', () => {
    const html = renderToStaticMarkup(
      <InternalFounderDemoRunPanel
        report={internalFounderDemoRunReadyExample}
        validation={internalFounderDemoRunValidationReadyExample}
      />,
    );

    expect(html).toContain('Internal Founder Demo Run');
    expect(html).toContain('Internal Founder Demo Run，不是真实用户研究');
    expect(html).toContain('不是发布，不是 production readiness');
    expect(html).toContain('当前仍是本地 MVP demo');
    expect(html).toContain('不写 registry / 不 publish');
    expect(html).toContain('Route A - User App MVP');
    expect(html).toContain('Route B - Vision Analysis');
    expect(html).toContain('Route C - Template Studio operator workflow');
    expect(html).toContain('Route D - Mobile demo');
    expect(html).toContain('Route E - Boundary explanation');
    expect(html).toContain('demo_pass');
    expect(html).toContain('Founder decision');
    expect(html).toContain('proceed_to_internal_trial_prep');
    expect(html).toContain('Phase 14B - Internal Trial Prep');
  });

  it('shows validation and boundary copy without positive publish claims', () => {
    const html = renderToStaticMarkup(
      <InternalFounderDemoRunPanel
        report={internalFounderDemoRunReadyExample}
        validation={internalFounderDemoRunValidationReadyExample}
      />,
    );

    expect(html).toContain('demo_run_ready');
    expect(html).toContain('Registry chain paused after 10U');
    expect(html).toContain('Real user data：no');
    expect(html).toContain('Analytics / backend / training：no');
    expect(html).not.toContain('已发布');
    expect(html).not.toContain('已写入 registry');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('AI confirmed');
  });
});
