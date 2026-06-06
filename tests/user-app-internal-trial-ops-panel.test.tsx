import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppInternalTrialOpsPanel } from '../src/components/user-app';
import { userAppInternalTrialOpsReadyExample } from '../src/templates/examples';

describe('UserAppInternalTrialOpsPanel', () => {
  it('renders internal trial operations boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppInternalTrialOpsPanel pack={userAppInternalTrialOpsReadyExample} />,
    );

    expect(html).toContain('内部试用运营');
    expect(html).toContain('内部小范围试用');
    expect(html).toContain('不是正式发布');
    expect(html).toContain('不收集照片');
    expect(html).toContain('不训练');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('type=&quot;file&quot;');
  });
});
