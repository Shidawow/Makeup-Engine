import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const manualPath = 'docs/manuals/makeup-engine-illustrated-operation-manual.md';

describe('illustrated operation manual', () => {
  const manual = readFileSync(manualPath, 'utf8');

  it('exists and contains required operator chapters', () => {
    expect(existsSync(manualPath)).toBe(true);
    for (const heading of [
      '## 1. 这个系统是做什么的',
      '## 2. 如何启动项目',
      '## 3. 推荐日常工作目录',
      '## 4. 分支工作流',
      '## 5. 如何查看当前项目状态',
      '## 6. Template Studio 使用说明',
      '## 7. User App Shell 普通用户路径',
      '## 8. User App Shell 管理员路径',
      '## 9. 如何准备匿名内部试用',
      '## 10. 如何复盘匿名内部试用',
      '## 11. 可以做什么 / 不可以做什么',
      '## 12. 常见问题',
      '## 13. 后续工作',
    ]) {
      expect(manual).toContain(heading);
    }
  });

  it('documents startup, branch workflow, user/admin paths, and boundaries', () => {
    for (const phrase of [
      'cd /Users/star/Makeup-Engine',
      'npm install',
      'npm run dev',
      'http://localhost:5173/',
      'npm run project:status',
      'npm run project:context',
      'npm run typecheck',
      'npm run build',
      'npm run test',
      'https://github.com/Shidawow/Makeup-Engine',
      '不要 `git add -A`',
      '发现妆容',
      '管理员路径',
      '匿名内部试用',
      '内部试用不等于正式发布',
      '不能接 OpenAI API',
      '不能。当前 photo 是 placeholder，不调用 camera API',
      '训练模型',
    ]) {
      expect(manual).toContain(phrase);
    }
  });

  it('contains required admin surfaces and diagram references', () => {
    for (const adminEntry of [
      'PWA 检查',
      'MVP 打磨',
      '模板内容 QA',
      '证据收集协议',
      '匿名内部试用 dry run',
      '匿名内部试用启动包',
      '匿名试用证据复盘',
      '匿名试用后续迭代',
      '证据缺口行动计划',
      '后续试用就绪度',
    ]) {
      expect(manual).toContain(adminEntry);
    }

    for (const diagram of [
      '../assets/manual/startup-flow.svg',
      '../assets/manual/branch-workflow.svg',
      '../assets/manual/status-recovery-flow.svg',
      '../assets/manual/template-studio-wireframe.svg',
      '../assets/manual/ordinary-user-flow.svg',
      '../assets/manual/admin-overview.svg',
      '../assets/diagrams/user-vs-admin-path.svg',
      '../assets/manual/trial-prep-flow.svg',
      '../assets/manual/trial-review-tree.svg',
      '../assets/diagrams/go-no-go-decision.svg',
    ]) {
      expect(manual).toContain(diagram);
    }
  });
});
