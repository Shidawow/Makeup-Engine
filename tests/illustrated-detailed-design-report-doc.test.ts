import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const reportPath = 'docs/reports/makeup-engine-illustrated-detailed-design.md';
const readReport = (): string => readFileSync(reportPath, 'utf8');

describe('illustrated detailed design report', () => {
  it('exists and contains the required illustrated design sections', () => {
    expect(existsSync(reportPath)).toBe(true);
    const report = readReport();

    [
      '## 1. 项目概述',
      '## 2. 总体目标',
      '## 3. 系统总体架构',
      '## 4. 核心数据流',
      '## 5. Vision-first 管线设计',
      '## 6. Template Studio 设计',
      '## 7. Template / App Contract 设计',
      '## 8. User App Shell 设计',
      '## 9. 内部试用体系设计',
      '## 10. 隐私与安全边界',
      '## 11. 当前不做事项',
      '## 12. 当前已知限制',
      '## 13. 测试与质量保障',
      '## 14. 项目状态恢复机制',
      '## 15. 后续路线',
    ].forEach((heading) => expect(report).toContain(heading));
  });

  it('states production and privacy boundaries', () => {
    const report = readReport();

    expect(report).toContain('不是 production app');
    expect(report).toContain('不做 backend');
    expect(report).toContain('不做 iOS 原生');
    expect(report).toContain('不做 OpenAI API');
    expect(report).toContain('不采集真实用户照片');
    expect(report).toContain('不上传照片');
    expect(report).toContain('不调用 OpenAI API');
    expect(report).toContain('不做 backend、database、analytics');
    expect(report).toContain('不能直接进入 User App');
    expect(report).toContain('不是 training dataset');
    expect(report).toContain('internal trial');
    expect(report).toContain('production release');
  });

  it('contains Mermaid diagrams, screenshots, and user/admin path explanations', () => {
    const report = readReport();

    expect(report).toContain('```mermaid');
    expect(report).toContain('../assets/screenshots/vision-analysis-home.png');
    expect(report).toContain('../assets/screenshots/template-studio-main.png');
    expect(report).toContain('../assets/screenshots/user-app-shell-mobile-home.png');
    expect(report).toContain('普通用户路径');
    expect(report).toContain('管理员检查路径');
    expect(report).toContain('Template Studio 工作流');
    expect(report).toContain('端到端主链路');
  });
});

