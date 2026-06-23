import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  UserAppInteractionChecklist,
  UserAppMobileQaPanel,
  UserAppReadinessPanel,
  UserAppShell,
  UserPrivacyNotice,
} from '../src/components/user-app';
import {
  createUserAppReadinessReport,
  evaluateMobileQaReadiness,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const mojibakePattern = /灏辩华|绉诲姩|鐢ㄦ埛|妯℃澘|闅愮|姝ラ|閫氳繃|鎻愰啋|鍙|杩涘|褰撳|鏈|浜や/;

describe('Phase 7H User App mobile/browser smoke rendering', () => {
  it('renders core shell entries and critical path controls in readable Chinese', () => {
    const html = renderToStaticMarkup(
      <UserAppShell packageData={userAppMvpShellExamplePackage} showAdminTools />,
    );

    expect(html).toContain('今日妆容练习');
    expect(html).toContain('PWA 检查');
    expect(html).toContain('模板选择');
    expect(html).toContain('发现妆容');
    expect(html).toContain('我的准备');
    expect(html).toContain('我的偏好');
    expect(html).toContain('本地进度');
    expect(html).toContain('App 就绪度');
    expect(html).toContain('移动端 QA');
    expect(html).toContain('交互检查');
    expect(html).toContain('分步跟练');
    expect(html).toContain('开始跟练');
    expect(html).toContain('查看隐私说明');
    expect(html).toContain('准备工具');
    expect(html).not.toMatch(mojibakePattern);
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });

  it('renders readiness, mobile QA, interaction, and privacy panels without technical leaks', () => {
    const mobileQa = evaluateMobileQaReadiness({
      hasPackage: true,
      templateCount: userAppMvpShellExamplePackage.templates.length,
      canEnterStepGuide: true,
    });
    const readiness = createUserAppReadinessReport({
      packageData: userAppMvpShellExamplePackage,
      mobileQaResult: mobileQa,
    });
    const html = renderToStaticMarkup(
      <>
        <UserAppReadinessPanel report={readiness} />
        <UserAppMobileQaPanel result={mobileQa} />
        <UserAppInteractionChecklist mobileChecks={mobileQa.checks} readinessReport={readiness} />
        <UserPrivacyNotice />
      </>,
    );

    expect(html).toContain('App 就绪度检查');
    expect(html).toContain('移动端交互 QA');
    expect(html).toContain('交互检查清单');
    expect(html).toContain('小屏手机 375px');
    expect(html).toContain('常规手机 390px');
    expect(html).toContain('大屏手机 414px');
    expect(html).toContain('窄屏平板 768px');
    expect(html).toContain('不采集真实用户照片');
    expect(html).toContain('不上传照片');
    expect(html).not.toMatch(mojibakePattern);
    expect(html).not.toContain('blob:');
    expect(html).not.toContain('data:image/');
    expect(html).not.toContain('C:\\');
  });
});
