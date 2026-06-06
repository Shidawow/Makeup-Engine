import { describe, expect, it } from 'vitest';
import {
  createUserAppBrowserQaReport,
  createUserAppReadinessReport,
  evaluateMobileQaReadiness,
} from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples';

const renderedText = [
  '今日妆容练习',
  '跟练',
  '发现妆容',
  '我的准备',
  '我的偏好',
  '本地进度',
  'PWA 检查',
  'MVP 打磨',
  '管理员检查',
  'App 就绪度',
  '移动端 QA',
  '交互检查',
  '隐私说明',
  '开始分步指导',
  '上一步',
  '下一步',
  '标记完成',
  '跳过',
  '不采集真实用户照片',
  '不上传照片',
  '不会把用户照片、偏好、会话或推荐记录用于训练',
  '不会用于训练',
].join('\n');

describe('User App browser/mobile QA report', () => {
  it('creates a deterministic Phase 7H QA report without external boundaries', () => {
    const mobileQaResult = evaluateMobileQaReadiness({
      hasPackage: true,
      templateCount: userAppMvpShellExamplePackage.templates.length,
      canEnterStepGuide: true,
    });
    const readinessReport = createUserAppReadinessReport({
      packageData: userAppMvpShellExamplePackage,
      mobileQaResult,
    });
    const report = createUserAppBrowserQaReport({
      httpStatus: 200,
      pageLoaded: true,
      renderedText,
      mobileQaResult,
      readinessReport,
      criticalPathEvidence: [
        'open-shell',
        'template-list',
        'template-detail',
        'step-guide',
        'session-panel',
        'readiness-panel',
      ],
      emptyStateEvidence: ['no-package', 'no-templates', 'no-recommendations'],
      blockedStateEvidence: ['blocked-package', 'blocked-guide'],
      recoveryStateEvidence: ['partial-restore', 'session-reset'],
    });

    expect(report.schemaVersion).toBe('user-app-browser-qa-v0.1');
    expect(report.status).toBe('passed');
    expect(report.browserSmokeStatus).toBe('passed');
    expect(report.mobileQaStatus).toBe('passed');
    expect(report.criticalPathStatus).toBe('passed');
    expect(report.privacyCopyStatus).toBe('passed');
    expect(report.chineseCopyStatus).toBe('passed');
    expect(report.localOnly).toBe(true);
    expect(report.productionApp).toBe(false);
    expect(report.usesBackend).toBe(false);
    expect(report.usesCamera).toBe(false);
    expect(report.usesTraining).toBe(false);
    expect(JSON.stringify(report)).not.toContain('blob:');
    expect(JSON.stringify(report)).not.toContain('data:image/');
  });

  it('blocks on HTTP failure, forbidden privacy tokens, and mojibake copy', () => {
    const report = createUserAppBrowserQaReport({
      httpStatus: 500,
      pageLoaded: false,
      renderedText: '今日妆容练习 blob: 灏辩华',
      criticalPathEvidence: [],
      emptyStateEvidence: [],
      blockedStateEvidence: [],
      recoveryStateEvidence: [],
    });

    expect(report.status).toBe('blocked');
    expect(report.browserSmokeStatus).toBe('blocked');
    expect(report.privacyCopyStatus).toBe('blocked');
    expect(report.chineseCopyStatus).toBe('blocked');
  });
});
