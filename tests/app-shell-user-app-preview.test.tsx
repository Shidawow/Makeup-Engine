import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AppShell } from '../src/components/AppShell';

describe('AppShell user app preview entry', () => {
  it('defaults to the ordinary user app MVP preview without opening admin studio panels', () => {
    const html = renderToStaticMarkup(<AppShell />);

    expect(html).toContain('用户 App 预览');
    expect(html).toContain('视觉分析');
    expect(html).toContain('模板工作台');
    expect(html).toContain('今日妆容练习');
    expect(html).toContain('选择今天要练的妆容');
    expect(html).toContain('准备工具');
    expect(html).toContain('分步跟练');
    expect(html).toContain('打开管理员检查');
    expect(html).not.toContain('Pipeline Trace');
    expect(html).not.toContain('已写入 registry');
    expect(html).not.toContain('production writer');
  });
});
