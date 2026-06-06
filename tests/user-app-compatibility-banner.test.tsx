import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppCompatibilityBanner } from '../src/components/user-app';
import { createUserAppCompatibilityViewModel } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserAppCompatibilityBanner', () => {
  it('renders local-only compatibility state and durable export checks', () => {
    const compatibility = createUserAppCompatibilityViewModel(userAppMvpShellExamplePackage);
    const html = renderToStaticMarkup(
      <UserAppCompatibilityBanner compatibility={compatibility} />,
    );

    expect(html).toContain('本地');
    expect(html).toContain('移动 Web');
    expect(html).toContain('不上传、不发布、不训练、不使用相机或 AR');
    expect(html).toContain('未发现临时图片链接、本机路径、大图内容或界面状态');
    expect(html).not.toContain('web-app-v0');
    expect(html).not.toContain('object URL');
  });
});
