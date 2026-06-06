import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppMvpReleaseReadinessPanel } from '../src/components/user-app';
import { userAppMvpReleaseReadinessReadyExample } from '../src/templates/examples';

describe('UserAppMvpReleaseReadinessPanel', () => {
  it('renders internal trial readiness without production release scope', () => {
    const html = renderToStaticMarkup(
      <UserAppMvpReleaseReadinessPanel report={userAppMvpReleaseReadinessReadyExample} />,
    );

    expect(html).toContain('MVP 发布就绪度');
    expect(html).toContain('内部小范围真实用户试用准备');
    expect(html).toContain('不是正式发布');
    expect(html).toContain('不启用上传、训练、照片、相机或 AR');
    expect(html).toContain('9A');
    expect(html).not.toContain('getUserMedia');
    expect(html).not.toContain('type=&quot;file&quot;');
  });
});
