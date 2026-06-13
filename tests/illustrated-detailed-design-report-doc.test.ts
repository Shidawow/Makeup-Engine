import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const reportPath = 'docs/reports/makeup-engine-illustrated-detailed-design.md';

describe('illustrated detailed design report', () => {
  const report = readFileSync(reportPath, 'utf8');

  it('exists and contains required design chapters', () => {
    expect(existsSync(reportPath)).toBe(true);
    for (const heading of [
      '## 1. 项目概述',
      '## 2. 总体目标',
      '## 3. 系统总体架构',
      '## 4. 核心数据流',
      '## 5. Vision-first 管线设计',
      '## 6. Template Studio 设计',
      '## 7. Template / App Contract 设计',
      '## 8. User App Shell 设计',
      '## 9. 匿名内部试用体系设计',
      '## 10. 隐私与安全边界',
      '## 13. 测试与质量保障',
      '## 14. 项目状态恢复机制',
      '## 15. 后续路线',
    ]) {
      expect(report).toContain(heading);
    }
  });

  it('documents boundaries, trial phases, and diagrams', () => {
    for (const phrase of [
      '当前不是 production app',
      'React Web / PWA MVP first',
      'SourceImagePackage 不能直接进入 User App',
      'SourceImagePackage 不是 training dataset',
      'UserAppTemplatePackage 是消费契约',
      '不做 backend / database / analytics',
      '不调用 OpenAI API / external API',
      '不采集真实照片',
      'Phase 9J',
      '9A Internal Trial Operations',
      '9J Follow-up Iteration',
      'anonymous/mock/example/framework level',
    ]) {
      expect(report).toContain(phrase);
    }

    for (const diagram of [
      '../assets/diagrams/project-position.svg',
      '../assets/diagrams/system-architecture.svg',
      '../assets/diagrams/end-to-end-data-flow.svg',
      '../assets/diagrams/vision-pipeline.svg',
      '../assets/diagrams/mask-weighted-sampling.svg',
      '../assets/diagrams/template-studio-workflow.svg',
      '../assets/diagrams/contract-boundary.svg',
      '../assets/diagrams/user-vs-admin-path.svg',
      '../assets/diagrams/internal-trial-loop.svg',
      '../assets/diagrams/evidence-lifecycle.svg',
      '../assets/diagrams/go-no-go-decision.svg',
      '../assets/diagrams/privacy-boundary.svg',
      '../assets/diagrams/forbidden-data-flow.svg',
      '../assets/diagrams/qa-gate.svg',
      '../assets/diagrams/recovery-flow.svg',
    ]) {
      expect(report).toContain(diagram);
    }
  });
});
