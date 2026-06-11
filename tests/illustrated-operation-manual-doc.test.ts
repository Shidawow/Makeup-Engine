import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const manualPath = 'docs/manuals/makeup-engine-illustrated-operation-manual.md';
const readManual = (): string => readFileSync(manualPath, 'utf8');

describe('illustrated operation manual', () => {
  it('exists and contains required manual sections', () => {
    expect(existsSync(manualPath)).toBe(true);
    const manual = readManual();

    [
      '## 1. 这个系统是做什么的',
      '## 2. 如何启动项目',
      '## 3. 推荐日常工作目录',
      '## 4. 分支工作流',
      '## 5. 如何查看当前项目状态',
      '## 6. Template Studio 使用说明',
      '## 7. User App Shell 使用说明',
      '## 8. 如何准备内部小范围试用',
      '## 9. 如何复盘内部试用',
      '## 10. 可以做什么 / 不可以做什么',
      '## 11. 常见问题',
      '## 12. 后续工作',
    ].forEach((heading) => expect(manual).toContain(heading));
  });

  it('contains startup commands and GitHub branch workflow', () => {
    const manual = readManual();

    expect(manual).toContain('cd /Users/star/Makeup-Engine');
    expect(manual).toContain('npm install');
    expect(manual).toContain('npm run dev');
    expect(manual).toContain('npm run project:status');
    expect(manual).toContain('npm run project:context');
    expect(manual).toContain('npm run typecheck');
    expect(manual).toContain('npm run build');
    expect(manual).toContain('npm run test');
    expect(manual).toContain('https://github.com/Shidawow/Makeup-Engine');
    expect(manual).toContain('不要 `git add -A`');
    expect(manual).toContain('git branch --show-current');
    expect(manual).toContain('git remote -v');
    expect(manual).toContain('git status');
  });

  it('documents non-production boundaries and user/admin paths with illustrations', () => {
    const manual = readManual();

    expect(manual).toContain('不是正式 App');
    expect(manual).toContain('不接后端');
    expect(manual).toContain('不收集真实用户照片');
    expect(manual).toContain('不训练模型');
    expect(manual).toContain('不能。当前范围明确 no OpenAI API');
    expect(manual).toContain('内部试用不等于正式发布');
    expect(manual).toContain('普通用户路径');
    expect(manual).toContain('管理员路径');
    expect(manual).toContain('跟练');
    expect(manual).toContain('发现妆容');
    expect(manual).toContain('隐私说明');
    expect(manual).toContain('PWA 检查');
    expect(manual).toContain('试用结果复盘');
    expect(manual).toContain('```mermaid');
    expect(manual).toContain('../assets/screenshots/user-app-admin-checks.png');
  });
});
